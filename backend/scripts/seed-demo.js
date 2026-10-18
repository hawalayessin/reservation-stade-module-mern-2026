// Explicit local demo bootstrap. Never reads the project's .env.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const mongoose = require('mongoose');
// Models must not create collections or indexes before the empty-database guard.
mongoose.set('autoCreate', false);
mongoose.set('autoIndex', false);
const bcrypt = require('bcryptjs');
const { credentialsFile, demoUri } = require('./demo-config');
const User = require('../models/User');
const Stadium = require('../models/Stadium');
const Availability = require('../models/Availability');
const Review = require('../models/Review');

async function main() {
  const uri = demoUri(process.env.DEMO_MONGODB_URI);
  if (fs.existsSync(credentialsFile)) throw new Error('Local demo credentials already exist. Reuse npm run demo; no data was changed.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  // Refuse any existing collection, including empty ones. Never erase user data.
  const collections = await mongoose.connection.db.listCollections({}, { nameOnly: true }).toArray();
  if (collections.length) throw new Error('Demo database must be empty. Choose a new local database with DEMO_MONGODB_URI; no data was changed.');

  const password = crypto.randomBytes(18).toString('base64url');
  const hash = await bcrypt.hash(password, 12);
  const admin = await User.create({ username: 'Demo Administrateur', email: 'admin@example.test', password: hash, isAdmin: true });
  const visitor = await User.create({ username: 'Demo Visiteur', email: 'visitor@example.test', password: hash, isAdmin: false });
  const fixtures = [
    { name: 'Terrain Demo Monastir', location: 'Monastir', type: 'Football', pricePerHour: 80 },
    { name: 'Terrain Demo Sousse', location: 'Sousse', type: 'Football', pricePerHour: 100 },
    { name: 'Terrain Demo Tunis', location: 'Tunis', type: 'Football', pricePerHour: 120 },
  ];
  for (const fixture of fixtures) {
    const stadium = await Stadium.create({ ...fixture, user: admin._id, description: 'Terrain fictif pour demonstration. Aucun lien avec un etablissement reel.' });
    for (let day = 1; day <= 7; day++) {
      const date = new Date();
      date.setDate(date.getDate() + day);
      const label = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      for (const hour of [18, 19, 20]) {
        await Availability.create({ stadium: stadium._id, date: label, startTime: `${hour}:00`, endTime: `${hour + 1}:00` });
      }
    }
    await Review.create({ stadium: stadium._id, user: visitor._id, rating: 4, comment: 'Avis fictif : terrain agreable, acces a preciser.' });
  }
  fs.mkdirSync(path.dirname(credentialsFile), { recursive: true });
  fs.writeFileSync(credentialsFile, JSON.stringify({ uri, visitor: 'visitor@example.test', admin: 'admin@example.test', password }, null, 2), { flag: 'wx', mode: 0o600 });
  console.log('Demo created: 3 fictional stadiums, 63 slots over the next 7 days, 3 fictional reviews.');
  console.log('Local login details: .demo/credentials.json (ignored by Git).');
}

main().catch(error => { console.error(error.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
