import puppeteer from 'puppeteer';

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const executablePath =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await puppeteer.launch({ headless: true, executablePath });

const expectedFooterLinks = [
  'Home|/',
  'About|/about',
  'Experience|/experience',
  'Skills|/#skills',
  'Projects|/projects',
  'Achievements|/achievements',
  'Contact|/#contact',
];

try {
  const page = await browser.newPage();

  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 768, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewport({ ...viewport, deviceScaleFactor: 1 });
    await page.goto(`${baseUrl}/experience`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('main');
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = await page.evaluate(() => {
      const workEntries = Array.from(document.querySelectorAll('[data-work-entry]'));
      const quickIntell = document.querySelector('[data-company="QuickIntell"]');
      const footer = document.querySelector('footer');
      const characterArt = document.querySelector('[data-footer-character-art]');
      const footerLinks = Array.from(document.querySelectorAll('[data-footer-navigation] a')).map(
        (link) => `${link.textContent?.trim() ?? ''}|${link.getAttribute('href') ?? ''}`,
      );

      return {
        workEntries: workEntries.length,
        quickIntellText: quickIntell?.textContent ?? '',
        pageText: document.body.innerText,
        footerText: footer?.textContent ?? '',
        footerLinks: Array.from(new Set(footerLinks)),
        characterArtCount: document.querySelectorAll('[data-footer-character-art]').length,
        characterArtVisible: characterArt
          ? getComputedStyle(characterArt).display !== 'none'
          : false,
        legacyCards: document.querySelectorAll('#experience-timeline .neubrutalism-card').length,
        heroTitle: document.querySelector('main > section h1')?.textContent?.replace(/\s+/g, ' ').trim() ?? '',
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    if (result.workEntries !== 2) {
      throw new Error(`Expected 2 work entries, found ${result.workEntries} at ${viewport.width}px`);
    }
    if (!result.quickIntellText.includes('Aug. 2025 - Aug. 2026')) {
      throw new Error('QuickIntell date range is not corrected');
    }
    if (!result.quickIntellText.includes('1 year')) {
      throw new Error('QuickIntell duration is not corrected');
    }
    if (result.quickIntellText.includes('Present')) {
      throw new Error('QuickIntell is still described as ongoing');
    }
    for (const removedHeading of ['Core Competencies', 'Coding Statistics', 'Want to Work Together?']) {
      if (result.pageText.includes(removedHeading)) {
        throw new Error(`${removedHeading} is still rendered on the Experience page`);
      }
    }
    if (result.footerText.includes('CONNECT')) {
      throw new Error('CONNECT footer section is still rendered');
    }
    if (result.footerLinks.join('|') !== expectedFooterLinks.join('|')) {
      throw new Error(`Footer links are incorrect: ${result.footerLinks.join(', ')}`);
    }
    if (result.characterArtCount !== 1) {
      throw new Error(`Expected one footer character artwork, found ${result.characterArtCount}`);
    }
    const shouldShowCharacterArt = viewport.width >= 1280;
    if (result.characterArtVisible !== shouldShowCharacterArt) {
      throw new Error(`Footer character artwork visibility is incorrect at ${viewport.width}px`);
    }
    if (result.legacyCards !== 0) {
      throw new Error(`Found ${result.legacyCards} legacy Experience cards`);
    }
    if (!/^Professional\s*Experience$/.test(result.heroTitle)) {
      throw new Error(`Experience hero changed unexpectedly: ${result.heroTitle}`);
    }
    if (result.overflow > 1) {
      throw new Error(`Horizontal overflow is ${result.overflow}px at ${viewport.width}px`);
    }
  }

  console.log('Experience and footer verification passed');
} finally {
  await browser.close();
}
