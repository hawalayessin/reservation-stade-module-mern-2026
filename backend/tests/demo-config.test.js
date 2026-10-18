const { test } = require('node:test');
const assert = require('node:assert/strict');
const { demoUri } = require('../scripts/demo-config');

test('demo bootstrap accepts a dedicated local demo database', () => {
  assert.match(demoUri(), /stadium_recruiter_demo$/);
  assert.equal(demoUri('mongodb://localhost:27017/another_demo'), 'mongodb://localhost:27017/another_demo');
});

test('demo bootstrap refuses normal databases, remote hosts and URI overrides', () => {
  for (const uri of ['mongodb://localhost:27017/production', 'mongodb://example.com/test_demo', 'mongodb://user:password@localhost/test_demo', 'mongodb://localhost/test_demo?authSource=admin', 'mongodb+srv://localhost/test_demo', 'mongodb://localhost/test_demo#ignored']) {
    assert.throws(() => demoUri(uri));
  }
});
