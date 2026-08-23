import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function launchBrowser() {
  return puppeteer.launch({ headless: true, executablePath });
}

async function wait(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const freshBrowser = await launchBrowser();
try {
  const page = await freshBrowser.newPage();
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await wait(1_500);

  const registrations = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return [];
    return (await navigator.serviceWorker.getRegistrations()).map((registration) => registration.scope);
  });

  if (registrations.length > 0) {
    throw new Error(`Fresh visitors still receive a service worker: ${JSON.stringify(registrations)}`);
  }
} finally {
  await freshBrowser.close();
}

const retirementBrowser = await launchBrowser();
try {
  const page = await retirementBrowser.newPage();
  await page.goto(`${baseUrl}/manifest.json`, { waitUntil: 'domcontentloaded' });

  await page.evaluate(async () => {
    await caches.open('portfolio-v2-static');
    await caches.open('portfolio-v2-dynamic');
    await caches.open('unrelated-test-cache');
    await navigator.serviceWorker.register(`/sw.js?retirement-test=${Date.now()}`, {
      scope: '/',
      updateViaCache: 'none',
    });
  });

  await wait(2_500);

  const state = await page.evaluate(async () => ({
    cacheNames: await caches.keys(),
    registrationCount: (await navigator.serviceWorker.getRegistrations()).length,
  }));

  const legacyCaches = state.cacheNames.filter((cacheName) => cacheName.startsWith('portfolio-'));
  if (state.registrationCount !== 0 || legacyCaches.length > 0) {
    throw new Error(`Legacy service-worker state remains: ${JSON.stringify(state)}`);
  }
  if (!state.cacheNames.includes('unrelated-test-cache')) {
    throw new Error(`Retirement worker deleted an unrelated cache: ${JSON.stringify(state.cacheNames)}`);
  }

  console.log('Service-worker retirement verification passed');
} finally {
  await retirementBrowser.close();
}
