const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const { credentialsFile, demoUri } = require('./demo-config');

if (!fs.existsSync(credentialsFile)) {
  console.error('Run npm run demo:seed first.');
  process.exit(1);
}
const credentials = JSON.parse(fs.readFileSync(credentialsFile, 'utf8'));
const uri = demoUri(credentials.uri);
console.log('Local demonstration API: http://localhost:5000. AI is disabled; login details are in .demo/credentials.json.');
const child = spawn(process.execPath, ['server.js'], {
  cwd: path.resolve(__dirname, '..'), stdio: 'inherit',
  env: { ...process.env, MONGODB_URI: uri, PORT: '5000', JWT_SECRET: crypto.randomBytes(48).toString('hex'), GEMINI_API_KEY: '' },
});
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
