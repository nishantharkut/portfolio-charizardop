import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';

const baseUrl = new URL(process.env.BASE_URL || 'http://127.0.0.1:3000');
const transport = baseUrl.protocol === 'https:' ? https : http;

function request(path, host) {
  return new Promise((resolve, reject) => {
    const outgoing = transport.request(
      {
        hostname: baseUrl.hostname,
        port: baseUrl.port || undefined,
        method: 'GET',
        path,
        headers: { host },
      },
      (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          resolve({
            body: Buffer.concat(chunks).toString('utf8'),
            location: response.headers.location,
            status: response.statusCode,
          });
        });
      },
    );

    outgoing.on('error', reject);
    outgoing.end();
  });
}

const apexPage = await request('/', 'nishantharkut.tech');
assert.equal(apexPage.status, 307, 'The apex homepage must redirect at the application layer');
assert.equal(apexPage.location, 'https://www.nishantharkut.tech/');

const apexPath = await request('/projects?source=apex', 'nishantharkut.tech');
assert.equal(apexPath.status, 307, 'Apex paths must redirect at the application layer');
assert.equal(
  apexPath.location,
  'https://www.nishantharkut.tech/projects?source=apex',
  'The canonical redirect must preserve the path and query string',
);

const apexWorker = await request('/sw.js', 'nishantharkut.tech');
assert.equal(apexWorker.status, 200, 'The apex retirement worker must be served directly');
assert.equal(apexWorker.location, undefined, 'The apex retirement worker must not redirect');
assert.match(apexWorker.body, /LEGACY_CACHE_PREFIX/);

const canonicalPage = await request('/', 'www.nishantharkut.tech');
assert.equal(canonicalPage.status, 200, 'The canonical host must continue serving the portfolio');

console.log('Apex domain routing verification passed');
