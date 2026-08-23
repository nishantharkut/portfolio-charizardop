import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({ headless: true, executablePath });
const githubChartImage = '<svg xmlns="http://www.w3.org/2000/svg" width="555" height="100" />';

async function stabilizeExternalMedia(page) {
  await page.setRequestInterception(true);
  page.on('request', async (request) => {
    if (new URL(request.url()).hostname === 'ghchart.rshah.org') {
      await request.respond({ body: githubChartImage, contentType: 'image/svg+xml', status: 200 });
      return;
    }
    await request.continue();
  });
}

async function settle(page) {
  await page.waitForSelector('[data-github-chart-shell]', { timeout: 10_000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.documentElement.style.scrollBehavior = 'auto';
    const chartImage = document.querySelector('[data-github-chart-image]');
    if (chartImage instanceof HTMLImageElement) {
      chartImage.loading = 'eager';
      const source = new URL(chartImage.src);
      source.searchParams.set('layout-verification', '1');
      chartImage.src = source.toString();
    }
    document.querySelector('[data-github-chart-shell]')?.scrollIntoView({ block: 'center' });
  });
  await page
    .waitForFunction(
      () => document.querySelector('[data-github-chart-shell]')?.getAttribute('data-chart-state') === 'loaded',
      { timeout: 5_000 },
    );
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('resize'));
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

    const waitForTravel = async (minimumTravel, targetY) => {
      const deadline = performance.now() + 3000;
      while (performance.now() < deadline) {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(track).transform);
        if (Math.abs(matrix.m41) >= minimumTravel) return true;
        window.scrollTo(0, targetY);
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
      return false;
    };

    const initialSpacerTop = spacer.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, initialSpacerTop - window.innerHeight));
    window.dispatchEvent(new Event('resize'));
    await new Promise((resolve) => setTimeout(resolve, 750));

    const spacerTop = spacer.getBoundingClientRect().top + window.scrollY;
    const pinDistance = Number.parseFloat(getComputedStyle(spacer).paddingBottom) || 0;
    const beforeEndY = spacerTop + Math.max(0, pinDistance - 1);
    window.scrollTo(0, beforeEndY);
    const reachedBeforeEnd = await waitForTravel(Math.max(0, pinDistance - 3), beforeEndY);

    const sectionRect = section.getBoundingClientRect();
    const contactRect = contact.getBoundingClientRect();
    const endY = spacerTop + pinDistance;
    window.scrollTo(0, endY);
    const reachedEnd = await waitForTravel(Math.max(0, pinDistance - 1), endY);
    const lastRectAtEnd = lastCard.getBoundingClientRect();

    return {
      contactTopBeforeEnd: contactRect.top,
      lastRightAtEnd: lastRectAtEnd.right,
      pinDistance,
      reachedBeforeEnd,
      reachedEnd,
      sectionTopBeforeEnd: sectionRect.top,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
    };
  });
}

try {
  const page = await browser.newPage();
  await stabilizeExternalMedia(page);
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.projects-section .project-box:last-child');
  await settle(page);
  await page.waitForFunction(
    () => document.querySelector('.projects-section')?.parentElement?.classList.contains('pin-spacer'),
    { timeout: 10_000 },
  );

  await page.setViewport({ width: 1920, height: 1000, deviceScaleFactor: 1 });
  await settle(page);

  const desktop = await readDesktopBoundary(page);
  if (!desktop) throw new Error('Desktop project pin geometry was unavailable');
  if (!desktop.reachedBeforeEnd || !desktop.reachedEnd) {
    throw new Error(`Desktop project track did not reach its expected travel: ${JSON.stringify(desktop)}`);
  }

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
      `Final project panel remained ${Math.round(desktop.lastRightAtEnd - desktop.viewportWidth)}px outside the viewport after resize: ${JSON.stringify(desktop)}`,
    );
  }

  const mobileWidth = Number.parseInt(process.env.MOBILE_WIDTH || '390', 10);
  const mobileHeight = Number.parseInt(process.env.MOBILE_HEIGHT || '844', 10);
  const mobile = await browser.newPage();
  await stabilizeExternalMedia(mobile);
  await mobile.setViewport({ width: mobileWidth, height: mobileHeight, deviceScaleFactor: 1 });
  await mobile.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await mobile.waitForSelector('.projects-section .project-flex');
  await settle(mobile);

  await mobile.waitForFunction(
    () => document.querySelector('.projects-section')?.parentElement?.classList.contains('pin-spacer'),
    { timeout: 10_000 },
  );

  const mobileBoundary = await readDesktopBoundary(mobile);
  if (!mobileBoundary) throw new Error('Mobile project pin geometry was unavailable');
  if (!mobileBoundary.reachedBeforeEnd || !mobileBoundary.reachedEnd) {
    throw new Error(`Mobile project track did not reach its expected travel: ${JSON.stringify(mobileBoundary)}`);
  }

  const mobileState = await mobile.evaluate(() => {
    const section = document.querySelector('.projects-section');
    const track = document.querySelector('.project-flex');
    const actions = document.querySelector('.navbar-float-actions');
    const buttons = actions ? Array.from(actions.querySelectorAll('.navbar-float-btn')) : [];
    const actionStyle = actions ? getComputedStyle(actions) : null;
    return {
      hasPinSpacer: Boolean(section?.parentElement?.classList.contains('pin-spacer')),
      overflowX: track ? getComputedStyle(track).overflowX : '',
      actionsDisplay: actionStyle?.display || '',
      actionBottom: actionStyle?.bottom || '',
      actionRight: actionStyle?.right || '',
      buttonCount: buttons.length,
      buttonsVisible: buttons.every((button) => {
        const rect = button.getBoundingClientRect();
        const style = getComputedStyle(button);
        return style.display !== 'none' && rect.width >= 40 && rect.height >= 40;
      }),
    };
  });

  if (!mobileState.hasPinSpacer) throw new Error('Mobile projects do not use a pinned ScrollTrigger');
  if (['auto', 'scroll'].includes(mobileState.overflowX)) {
    throw new Error(`Mobile project track still uses native horizontal scrolling: ${JSON.stringify(mobileState)}`);
  }
  if (Math.abs(mobileBoundary.sectionTopBeforeEnd) > 2) {
    throw new Error(`Mobile project section was not pinned before its end: top=${mobileBoundary.sectionTopBeforeEnd}`);
  }
  if (mobileBoundary.contactTopBeforeEnd < mobileBoundary.viewportHeight - 2) {
    throw new Error(
      `Contact entered the active mobile project viewport: top=${mobileBoundary.contactTopBeforeEnd}, viewport=${mobileBoundary.viewportHeight}`,
    );
  }
  if (mobileBoundary.lastRightAtEnd > mobileBoundary.viewportWidth + 2) {
    throw new Error(
      `Final mobile project panel remained ${Math.round(mobileBoundary.lastRightAtEnd - mobileBoundary.viewportWidth)}px outside the viewport`,
    );
  }
  if (mobileState.actionsDisplay === 'none' || mobileState.buttonCount !== 2 || !mobileState.buttonsVisible) {
    throw new Error(`Mobile floating actions are not both visible and tappable: ${JSON.stringify(mobileState)}`);
  }

  console.log(`Homepage project scroll verification passed at ${mobileWidth}x${mobileHeight}`);
} finally {
  await browser.close();
}
