import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({ headless: true, executablePath });

async function settle(page) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
  });
  await new Promise((resolve) => setTimeout(resolve, 700));
}

async function readDesktopBoundary(page) {
  return page.evaluate(async () => {
    const section = document.querySelector('.projects-section');
    const lastCard = document.querySelector('.project-box:last-child');
    const contact = document.querySelector('#contact');
    const spacer = section?.parentElement;

    if (!section || !lastCard || !contact || !spacer?.classList.contains('pin-spacer')) {
      return null;
    }

    const spacerTop = spacer.getBoundingClientRect().top + window.scrollY;
    const pinDistance = Number.parseFloat(getComputedStyle(spacer).paddingBottom) || 0;
    window.scrollTo(0, spacerTop + Math.max(0, pinDistance - 1));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    const sectionRect = section.getBoundingClientRect();
    const contactRect = contact.getBoundingClientRect();
    window.scrollTo(0, spacerTop + pinDistance);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const lastRectAtEnd = lastCard.getBoundingClientRect();

    return {
      contactTopBeforeEnd: contactRect.top,
      lastRightAtEnd: lastRectAtEnd.right,
      pinDistance,
      sectionTopBeforeEnd: sectionRect.top,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    };
  });
}

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.projects-section .project-box:last-child');
  await settle(page);

  await page.setViewport({ width: 1920, height: 1000, deviceScaleFactor: 1 });
  await settle(page);

  const desktop = await readDesktopBoundary(page);
  if (!desktop) throw new Error('Desktop project pin geometry was unavailable');

  if (Math.abs(desktop.sectionTopBeforeEnd) > 2) {
    throw new Error(`Project section was not pinned before its end: top=${desktop.sectionTopBeforeEnd}`);
  }
  if (desktop.contactTopBeforeEnd < desktop.viewportHeight - 2) {
    throw new Error(
      `Contact entered the active project viewport: top=${desktop.contactTopBeforeEnd}, viewport=${desktop.viewportHeight}`,
    );
  }
  if (desktop.lastRightAtEnd > desktop.viewportWidth + 2) {
    throw new Error(
      `Final project panel remained ${Math.round(desktop.lastRightAtEnd - desktop.viewportWidth)}px outside the viewport after resize`,
    );
  }

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await mobile.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await mobile.waitForSelector('.projects-section .project-flex');
  await settle(mobile);

  const mobileState = await mobile.evaluate(() => {
    const section = document.querySelector('.projects-section');
    const track = document.querySelector('.project-flex');
    return {
      hasPinSpacer: Boolean(section?.parentElement?.classList.contains('pin-spacer')),
      overflowX: track ? getComputedStyle(track).overflowX : '',
      scrollable: track ? track.scrollWidth > track.clientWidth : false,
    };
  });

  if (mobileState.hasPinSpacer) throw new Error('Mobile projects still use a pinned ScrollTrigger');
  if (!mobileState.scrollable || !['auto', 'scroll'].includes(mobileState.overflowX)) {
    throw new Error(`Mobile project track is not natively scrollable: ${JSON.stringify(mobileState)}`);
  }

  console.log('Homepage project scroll verification passed');
} finally {
  await browser.close();
}
