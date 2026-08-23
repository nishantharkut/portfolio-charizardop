import puppeteer from 'puppeteer';
import { createServer } from 'node:http';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({ headless: true, executablePath });

const legacyWorker = `
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== location.origin) return;
  event.respondWith(
    caches.open('portfolio-v2-dynamic').then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    }),
  );
});
`;

const proxy = createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', 'http://localhost');
  if (requestUrl.pathname === '/legacy-worker-test.js') {
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': '/',
    });
    response.end(legacyWorker);
    return;
  }

  try {
    const upstreamUrl = new URL(`${requestUrl.pathname}${requestUrl.search}`, baseUrl);
    const upstream = await fetch(upstreamUrl, {
      headers: {
        accept: request.headers.accept || '*/*',
        'user-agent': request.headers['user-agent'] || 'cache-recovery-test',
      },
    });
    const headers = Object.fromEntries(upstream.headers.entries());
    delete headers['content-encoding'];
    delete headers['content-length'];
    delete headers['transfer-encoding'];
    response.writeHead(upstream.status, headers);
    response.end(Buffer.from(await upstream.arrayBuffer()));
  } catch (error) {
    response.writeHead(502, { 'Content-Type': 'text/plain' });
    response.end(String(error));
  }
});

await new Promise((resolve) => proxy.listen(0, '127.0.0.1', resolve));
const proxyAddress = proxy.address();
if (!proxyAddress || typeof proxyAddress === 'string') {
  throw new Error('Could not start the cache-recovery test proxy');
}
const testOrigin = `http://127.0.0.1:${proxyAddress.port}`;

try {
  const page = await browser.newPage();
  await page.goto(`${testOrigin}/manifest.json`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    await caches.open('portfolio-v2-static');
    await caches.open('portfolio-v2-images');
    await navigator.serviceWorker.register('/legacy-worker-test.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    await navigator.serviceWorker.ready;
  });

  await page.goto(`${testOrigin}/refresh?recovery-test=${Date.now()}`, {
    waitUntil: 'domcontentloaded',
  });

  const deadline = Date.now() + 10_000;
  let state;
  while (Date.now() < deadline) {
    try {
      state = await page.evaluate(async () => ({
        cacheNames: await caches.keys(),
        controlled: Boolean(navigator.serviceWorker.controller),
        pathname: window.location.pathname,
        registrationCount: (await navigator.serviceWorker.getRegistrations()).length,
      }));
    } catch (error) {
      if (!String(error).includes('Execution context was destroyed')) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100));
      continue;
    }

    const legacyCaches = state.cacheNames.filter((cacheName) => cacheName.startsWith('portfolio-'));
    if (
      state.pathname === '/' &&
      !state.controlled &&
      state.registrationCount === 0 &&
      legacyCaches.length === 0
    ) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (!state) throw new Error('Forced cache recovery could not inspect the final browser state');

  const legacyCaches = state.cacheNames.filter((cacheName) => cacheName.startsWith('portfolio-'));
  if (
    state.pathname !== '/' ||
    state.controlled ||
    state.registrationCount !== 0 ||
    legacyCaches.length > 0
  ) {
    throw new Error(`Forced cache recovery did not complete: ${JSON.stringify(state)}`);
  }

  console.log('Forced cache recovery verification passed');
} finally {
  await browser.close();
  await new Promise((resolve, reject) => {
    proxy.close((error) => (error ? reject(error) : resolve()));
  });
}
