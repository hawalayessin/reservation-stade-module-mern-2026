// Explicit, local administrative bootstrap. Never exposed as a public HTTP route.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function main() {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } = process.env;
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
    throw new Error('Set MONGODB_URI, ADMIN_EMAIL, ADMIN_USERNAME and ADMIN_PASSWORD (at least 12 characters).');
  }
  await mongoose.connect(MONGODB_URI);
  if (await User.findOne({ email: ADMIN_EMAIL })) {
    throw new Error('Account already exists; no privileges were changed.');
  }
  await User.create({ email: ADMIN_EMAIL, username: ADMIN_USERNAME,
    password: await bcrypt.hash(ADMIN_PASSWORD, 12), isAdmin: true });
  console.log('Administrator created. Remove bootstrap credentials from your environment.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; })
  .finally(() => mongoose.disconnect());
