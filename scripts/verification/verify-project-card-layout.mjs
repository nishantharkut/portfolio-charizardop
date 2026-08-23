import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({ headless: true, executablePath });

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

function intersects(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

try {
  for (const viewport of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
    await page.goto(`${baseUrl}/projects`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#projects-grid .neubrutalism-card');
    await page.evaluate(() => document.fonts.ready);
    await new Promise((resolve) => setTimeout(resolve, 750));

    const cards = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#projects-grid .neubrutalism-card')).map((card) => {
        const content = card.children[1];
        const description = content?.children[1];
        const paragraph = description?.querySelector('p');
        const technologies = content?.children[2];
        const paragraphRect = paragraph?.getBoundingClientRect();
        const descriptionRect = description?.getBoundingClientRect();
        const technologyRect = technologies?.getBoundingClientRect();

        return {
          title: content?.children[0]?.querySelector('h3')?.textContent?.trim() || 'Unknown project',
          paragraphBottom: paragraphRect?.bottom ?? 0,
          descriptionBottom: descriptionRect?.bottom ?? 0,
          technologyTop: technologyRect?.top ?? 0,
        };
      }),
    );

    const overflowingCards = cards.filter(
      (card) =>
        card.paragraphBottom > card.descriptionBottom + 1 ||
        card.paragraphBottom > card.technologyTop - 1,
    );
    if (overflowingCards.length > 0) {
      throw new Error(
        `${viewport.width}px project descriptions overlap their technology tags: ${JSON.stringify(overflowingCards)}`,
      );
    }

    if (viewport.width <= 1023) {
      for (let cardIndex = 0; cardIndex < Math.min(2, cards.length); cardIndex += 1) {
        await page.evaluate((index) => {
          const card = document.querySelectorAll('#projects-grid .neubrutalism-card')[index];
          if (!card) return;
          const cardRect = card.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + cardRect.bottom - window.innerHeight + 18);
        }, cardIndex);
        await new Promise((resolve) => setTimeout(resolve, 200));

        const collisions = await page.evaluate((index) => {
          const card = document.querySelectorAll('#projects-grid .neubrutalism-card')[index];
          const actionRow = card?.children[1]?.children[3];
          if (!card || !actionRow) return null;

          const toRect = (element) => {
            const rect = element.getBoundingClientRect();
            return { bottom: rect.bottom, left: rect.left, right: rect.right, top: rect.top };
          };

          return {
            actions: Array.from(actionRow.children).map(toRect),
            floatingControls: Array.from(document.querySelectorAll('.navbar-float-btn')).map(toRect),
          };
        }, cardIndex);

        if (!collisions) throw new Error('Could not inspect the mobile project card action row');

        const overlaps = collisions.actions.flatMap((action, actionIndex) =>
          collisions.floatingControls
            .map((control, controlIndex) => ({ action, actionIndex, control, controlIndex }))
            .filter(({ action: actionRect, control }) => intersects(actionRect, control)),
        );

        if (overlaps.length > 0) {
          throw new Error(
            `${viewport.width}px floating controls overlap project ${cardIndex + 1} actions: ${JSON.stringify(overlaps)}`,
          );
        }
      }
    }

    await page.close();
  }

  console.log('Project card layout verification passed at 390px, 768px, and 1440px');
} finally {
  await browser.close();
}
