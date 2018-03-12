/* eslint no-console: 0  */

const https = require('https');

let task;
let subject;

if (process.argv[2]) { task = process.argv[2].substring(1, process.argv[2].length); }
if (process.argv[3]) { subject = process.argv[3].substring(1, process.argv[3].length); }

const req = https.request({
  hostname: 'localhost',
  port: 3000,
  path: '/setup?task=' + task + '&subject=' + subject,
  method: 'POST',
  rejectUnauthorized: false
}, (res) => {

  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', (err) => {
  console.error(err);
});

req.end();