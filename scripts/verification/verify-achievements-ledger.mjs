import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({ headless: true, executablePath });

try {
  const page = await browser.newPage();

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
    await page.goto(`${baseUrl}/achievements`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main');
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = await page.evaluate(() => ({
      sections: Array.from(document.querySelectorAll('[data-section]')).map((node) =>
        node.getAttribute('data-section'),
      ),
      competitions: document.querySelectorAll('[data-competition]').length,
      deadLinks: document.querySelectorAll('a[href="#"]').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));

    const requiredSections = ['evidence', 'milestones', 'competitions', 'leadership', 'credentials'];
    for (const section of requiredSections) {
      if (!result.sections.includes(section)) {
        throw new Error(`Missing ${section} section at ${viewport.width}px`);
      }
    }
    if (result.competitions !== 16) {
      throw new Error(`Expected 16 competition entries, found ${result.competitions}`);
    }
    if (result.deadLinks !== 0) {
      throw new Error(`Found ${result.deadLinks} dead credential links`);
    }
    if (result.overflow > 1) {
      throw new Error(`Horizontal overflow is ${result.overflow}px at ${viewport.width}px`);
    }
  }

  console.log('Achievements ledger verification passed');
} finally {
  await browser.close();
}
