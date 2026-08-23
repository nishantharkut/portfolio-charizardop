import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import puppeteer from 'puppeteer';

const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const retirementWorker = await readFile(
  new URL('../../public/sw.js', import.meta.url),
  'utf8',
);

const legacyWorker = `
const CACHE_NAME = 'portfolio-v2-dynamic';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add('/')).then(() => self.skipWaiting()),
  );
});
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin) return;
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    }),
  );
});
`;

const legacyPage = `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>Legacy portfolio state</title></head>
  <body>
    <script>
      window.legacyReady = null;
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then(() => navigator.serviceWorker.ready)
        .then(() => {
          window.legacyReady = true;
        })
        .catch((error) => {
          window.legacyError = String(error);
          window.legacyReady = false;
        });
    </script>
  </body>
</html>`;

function listen(server) {
  return new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

const canonicalServer = createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.end('<!doctype html><title>Current canonical portfolio</title>');
});
await listen(canonicalServer);
const canonicalAddress = canonicalServer.address();
if (!canonicalAddress || typeof canonicalAddress === 'string') {
  throw new Error('Could not start the canonical-origin test server');
}
const canonicalOrigin = `http://127.0.0.1:${canonicalAddress.port}`;

let legacyMode = true;
const apexServer = createServer((request, response) => {
  const requestUrl = new URL(request.url || '/', 'http://localhost');

  if (requestUrl.pathname === '/sw.js') {
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': '/',
    });
    response.end(legacyMode ? legacyWorker : retirementWorker);
    return;
  }

  if (requestUrl.pathname === '/storage-inspection') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end('<!doctype html><title>Storage inspection</title>');
    return;
  }

  if (requestUrl.pathname === '/' && legacyMode) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(legacyPage);
    return;
  }

  response.writeHead(307, { Location: `${canonicalOrigin}${requestUrl.pathname}${requestUrl.search}` });
  response.end();
});
await listen(apexServer);
const apexAddress = apexServer.address();
if (!apexAddress || typeof apexAddress === 'string') {
  throw new Error('Could not start the apex-origin test server');
}
const apexOrigin = `http://127.0.0.1:${apexAddress.port}`;

const browser = await puppeteer.launch({ headless: true, executablePath });

try {
  const page = await browser.newPage();
  await page.goto(`${apexOrigin}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.legacyReady === 'boolean', { timeout: 10_000 });
  const legacyRegistration = await page.evaluate(() => ({
    error: window.legacyError,
    ready: window.legacyReady,
  }));
  if (!legacyRegistration.ready) {
    throw new Error(`Legacy worker registration failed: ${JSON.stringify(legacyRegistration)}`);
  }
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), { timeout: 10_000 });

  await page.evaluate(async () => {
    await caches.open('unrelated-test-cache');
  });
  const seededState = await page.evaluate(async () => ({
    cacheNames: await caches.keys(),
    controlled: Boolean(navigator.serviceWorker.controller),
    registrationCount: (await navigator.serviceWorker.getRegistrations()).length,
  }));
  if (
    !seededState.controlled ||
    seededState.registrationCount !== 1 ||
    !seededState.cacheNames.includes('portfolio-v2-dynamic')
  ) {
    throw new Error(`Could not seed the legacy apex state: ${JSON.stringify(seededState)}`);
  }

  legacyMode = false;
  await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => undefined);
  await page.waitForFunction(
    (expectedOrigin) => window.location.origin === expectedOrigin,
    { timeout: 20_000 },
    canonicalOrigin,
  );

  const inspector = await browser.newPage();
  await inspector.goto(`${apexOrigin}/storage-inspection`, { waitUntil: 'domcontentloaded' });
  const recoveredState = await inspector.evaluate(async () => ({
    cacheNames: await caches.keys(),
    registrationCount: (await navigator.serviceWorker.getRegistrations()).length,
  }));
  const legacyCaches = recoveredState.cacheNames.filter((name) => name.startsWith('portfolio-'));
  if (recoveredState.registrationCount !== 0 || legacyCaches.length > 0) {
    throw new Error(`Legacy apex state remains: ${JSON.stringify(recoveredState)}`);
  }
  if (!recoveredState.cacheNames.includes('unrelated-test-cache')) {
    throw new Error(`Recovery removed unrelated storage: ${JSON.stringify(recoveredState.cacheNames)}`);
  }

  console.log('Apex legacy-worker recovery verification passed');
} finally {
  await browser.close();
  await close(apexServer);
  await close(canonicalServer);
}
