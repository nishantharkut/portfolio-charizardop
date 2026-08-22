import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({ headless: true, executablePath });

async function settle(page) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
  });
  await new Promise((resolve) => setTimeout(resolve, 1800));
}

async function readDesktopBoundary(page) {
  return page.evaluate(async () => {
    const section = document.querySelector('.projects-section');
    const lastCard = document.querySelector('.project-box:last-child');
    const contact = document.querySelector('#contact');
    const spacer = section?.parentElement;
    const track = section?.querySelector('.project-flex');

    if (!section || !lastCard || !contact || !track || !spacer?.classList.contains('pin-spacer')) {
      return null;
    }

    const waitForTravel = async (minimumTravel) => {
      const deadline = performance.now() + 1500;
      while (performance.now() < deadline) {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
        if (Math.abs(matrix.m41) >= minimumTravel) return;
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    };

    const spacerTop = spacer.getBoundingClientRect().top + window.scrollY;
    const pinDistance = Number.parseFloat(getComputedStyle(spacer).paddingBottom) || 0;
    window.scrollTo(0, spacerTop + Math.max(0, pinDistance - 1));
    await waitForTravel(Math.max(0, pinDistance - 3));

    const sectionRect = section.getBoundingClientRect();
    const contactRect = contact.getBoundingClientRect();
    window.scrollTo(0, spacerTop + pinDistance);
    await waitForTravel(Math.max(0, pinDistance - 1));
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

  const mobileState = await mobile.evaluate(async () => {
    const section = document.querySelector('.projects-section');
    const track = document.querySelector('.project-flex');
    const cards = track ? Array.from(track.querySelectorAll('.project-box')) : [];
    if (track) {
      track.scrollLeft = track.scrollWidth;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    const trackRect = track?.getBoundingClientRect();
    const finalRect = cards.at(-1)?.getBoundingClientRect();
    return {
      hasPinSpacer: Boolean(section?.parentElement?.classList.contains('pin-spacer')),
      overflowX: track ? getComputedStyle(track).overflowX : '',
      scrollable: track ? track.scrollWidth > track.clientWidth : false,
      cardsFitViewport: track ? cards.every((card) => card.getBoundingClientRect().width <= track.clientWidth + 1) : false,
      finalCardContained: Boolean(
        trackRect && finalRect && finalRect.left >= trackRect.left - 1 && finalRect.right <= trackRect.right + 1,
      ),
    };
  });

  if (mobileState.hasPinSpacer) throw new Error('Mobile projects still use a pinned ScrollTrigger');
  if (!mobileState.scrollable || !['auto', 'scroll'].includes(mobileState.overflowX)) {
    throw new Error(`Mobile project track is not natively scrollable: ${JSON.stringify(mobileState)}`);
  }
  if (!mobileState.cardsFitViewport || !mobileState.finalCardContained) {
    throw new Error(`Mobile project cards are clipped by the scroll viewport: ${JSON.stringify(mobileState)}`);
  }

  console.log('Homepage project scroll verification passed');
} finally {
  await browser.close();
}
