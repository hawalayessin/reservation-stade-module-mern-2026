const path = require('node:path');

const credentialsFile = path.resolve(__dirname, '../../.demo/credentials.json');

function demoUri(value = 'mongodb://127.0.0.1:27017/stadium_recruiter_demo') {
  const uri = new URL(value);
  if (uri.protocol !== 'mongodb:' || !['127.0.0.1', 'localhost'].includes(uri.hostname)
      || uri.username || uri.password || uri.search || uri.hash
      || !/^\/[a-zA-Z0-9_]+_demo$/.test(uri.pathname)) {
    throw new Error('Demo requires a local MongoDB database ending in _demo, without credentials or URI options.');
  }
  return value;
}

module.exports = { credentialsFile, demoUri };
