const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Availability = require('../models/Availability');
const Reservation = require('../models/Reservation');
const authRoutes = require('../routes/authRoutes');
const stadiumRoutes = require('../routes/stadiumRoutes');
const reservationRoutes = require('../routes/reservationRoutes');
const reviewRoutes = require('../routes/reviewRoutes');
const Review = require('../models/Review');

process.env.JWT_SECRET = 'test-only-secret-not-used-by-any-deployment';
let server, url, createdUser, admin;
before(async () => {
  const app = express(); app.use(express.json());
  app.use('/auth', authRoutes); app.use('/stadiums', stadiumRoutes);
  app.use('/reservations', reservationRoutes);
  app.use('/reviews', reviewRoutes);
  server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
  url = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));
beforeEach(() => {
  admin = false; createdUser = undefined;
  User.findOne = async () => null;
  User.create = async data => { createdUser = data; return { ...data, _id: 'owner' }; };
  User.findById = id => ({ select: async () => ({ _id: id, isAdmin: admin }) });
});
function request(path, body, user = 'owner', method = 'POST') {
  const headers = { 'Content-Type': 'application/json' };
  if (user) headers.Authorization = `Bearer ${jwt.sign({userId:user}, process.env.JWT_SECRET)}`;
  return fetch(url + path, { method, headers, ...(body ? {body:JSON.stringify(body)} : {}) });
}
test('public registration cannot grant administrator privileges', async () => {
  const response = await request('/auth/register', {username:'candidate',email:'test@example.com',password:'a-long-test-password',isAdmin:true}, null);
  assert.equal(response.status,201); assert.equal(createdUser.isAdmin,false);
  const result=await response.json(); assert.equal(jwt.verify(result.token,process.env.JWT_SECRET).isAdmin,false);
});
test('anonymous stadium mutation is rejected', async () => {
  assert.equal((await request('/stadiums',{},null)).status,401);
});
test('ordinary users cannot mutate stadiums even with an admin claim', async () => {
  const forgedRole = jwt.sign({userId:'owner',isAdmin:true},process.env.JWT_SECRET);
  const response = await fetch(url+'/stadiums',{method:'POST',headers:{Authorization:`Bearer ${forgedRole}`,'Content-Type':'application/json'},body:'{}'});
  assert.equal(response.status,403);
});
test('a reservation cannot be read by another account', async () => {
  const doc={user:'owner'};
  Reservation.findById=()=>({populate:()=>({populate:async()=>doc})});
  assert.equal((await request('/reservations/booking',null,'other','GET')).status,403);
});
test('another account cannot cancel a reservation', async () => {
  Reservation.findById=async()=>({user:'owner'});
  assert.equal((await request('/reservations/booking',null,'other','DELETE')).status,403);
});
test('concurrent bookings for one slot allow only one reservation', async () => {
  let free=true, created=0;
  Availability.findOneAndUpdate=async filter=>{
    if (!free || filter.stadium!=='stadium') return null;
    free=false; return {_id:'slot',stadium:'stadium',startTime:'10:00',endTime:'11:00'};
  };
  Reservation.create=async data=>{created++;return data;};
  const results=await Promise.all([request('/reservations',{stadium:'stadium',availability:'slot'}),request('/reservations',{stadium:'stadium',availability:'slot'})]);
  assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);assert.equal(created,1);
});
test('failed persistence releases a claimed slot', async () => {
  let released=false;
  Availability.findOneAndUpdate=async()=>({_id:'slot',stadium:'stadium'});
  Availability.findByIdAndUpdate=async()=>{released=true;};
  Reservation.create=async()=>{throw new Error('Database unavailable');};
  assert.equal((await request('/reservations',{stadium:'stadium',availability:'slot'})).status,500);
  assert.equal(released,true);
});

test('another account cannot edit a review', async () => {
  Review.findById = async () => ({ user: 'owner', save: async () => assert.fail('must not save') });
  assert.equal((await request('/reviews/review', { rating: 1, comment: 'overwrite' }, 'other', 'PUT')).status, 403);
});

test('editing a review preserves ownership and stadium', async () => {
  const review = { user: 'owner', stadium: 'original', rating: 4, comment: 'before', save: async () => {} };
  Review.findById = async () => review;
  const response = await request('/reviews/review', { rating: 5, comment: 'after', user: 'other', stadium: 'other' }, 'owner', 'PUT');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.user, 'owner'); assert.equal(body.stadium, 'original');
  assert.equal(body.rating, 5); assert.equal(body.comment, 'after');
});
