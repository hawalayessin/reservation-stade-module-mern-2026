// Exercise only the generated local demo through the real HTTP API and MongoDB.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { credentialsFile, demoUri } = require('./demo-config');
const credentials = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
demoUri(credentials.uri);
const base = 'http://localhost:5000/api';
async function call(path, { token, method = 'GET', body, status = 200 } = {}) {
  const response = await fetch(base + path, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  assert.equal(response.status, status, `${method} ${path}`);
  return response.json();
}
async function main() {
  const visitor = await call('/auth/login', { method: 'POST', body: { email: credentials.visitor, password: credentials.password } });
  const admin = await call('/auth/login', { method: 'POST', body: { email: credentials.admin, password: credentials.password } });
  const stadiums = await call('/stadiums', { token: visitor.token });
  const stadium = stadiums.find(item => item.name === 'Terrain Demo Monastir');
  assert.ok(stadium);
  const path = `/availabilities/stadium/${stadium._id}`;
  const slots = await call(path);
  assert.ok(slots.length);
  let reservation;
  try {
    reservation = await call('/reservations', { token: visitor.token, method: 'POST', status: 201, body: { stadium: stadium._id, availability: slots[0]._id } });
    assert.ok(!(await call(path)).some(slot => slot._id === slots[0]._id));
    await call('/reservations', { token: visitor.token, method: 'POST', status: 409, body: { stadium: stadium._id, availability: slots[0]._id } });
    await call(`/reservations/${reservation._id}`, { token: admin.token, status: 403 });
    const mine = await call('/reservations', { token: visitor.token });
    assert.ok(mine.some(item => item._id === reservation._id));
  } finally {
    if (reservation) await call(`/reservations/${reservation._id}`, { token: visitor.token, method: 'DELETE' });
  }
  assert.ok((await call(path)).some(slot => slot._id === slots[0]._id));
  await call(`/availabilities/admin/stadium/${stadium._id}`, { token: visitor.token, status: 403 });
  const adminSlots = await call(`/availabilities/admin/stadium/${stadium._id}`, { token: admin.token });
  assert.ok(adminSlots.length);
  await call(`/ai/analyze-reviews/${stadium._id}`, { token: visitor.token, method: 'POST', status: 503 });
  const review = await call('/reviews', { token: visitor.token, method: 'POST', status: 201, body: { stadium: stadium._id, rating: 4, comment: 'Avis fictif de verification.' } });
  try {
    await call(`/reviews/${review._id}`, { token: admin.token, method: 'PUT', status: 403, body: { rating: 1, comment: 'Forbidden' } });
    await call(`/reviews/${review._id}`, { token: visitor.token, method: 'PUT', status: 400, body: { rating: 6, comment: 'Invalid rating' } });
    const edited = await call(`/reviews/${review._id}`, { token: visitor.token, method: 'PUT', body: { rating: 5, comment: 'Avis fictif modifie.', user: admin.user.id } });
    assert.equal(edited.rating, 5);
    assert.equal(edited.user, visitor.user.id);
  } finally {
    await call(`/reviews/${review._id}`, { token: visitor.token, method: 'DELETE' });
  }
  console.log('PASS: review creation, owner-only editing, rating validation, immutable ownership and deletion.');
  console.log('PASS: real demo login, booking, duplicate rejection, owner access, cancellation, restored slot, admin permissions, optional AI response.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
