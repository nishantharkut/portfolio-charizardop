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

    const result = await page.evaluate(() => {
      const hero = document.querySelector('[data-achievements-hero]');
      const evidence = document.querySelector('[data-section="evidence"]');

      return {
        sections: Array.from(document.querySelectorAll('[data-section]')).map((node) =>
          node.getAttribute('data-section'),
        ),
        competitions: document.querySelectorAll('[data-competition]').length,
        deadLinks: document.querySelectorAll('a[href="#"]').length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        heroHeight: hero?.getBoundingClientRect().height ?? 0,
        evidenceTop: evidence ? evidence.getBoundingClientRect().top + window.scrollY : 0,
        evidenceCount: document.querySelectorAll('[data-evidence-item]').length,
        identityLogos: document.querySelectorAll('[data-identity-logo]').length,
        leadershipTitles: Array.from(document.querySelectorAll('[data-leadership-title]')).map(
          (node) => node.textContent?.trim() ?? '',
        ),
        pageText: document.body.innerText,
      };
    });

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
    if (result.heroHeight < viewport.height - 1) {
      throw new Error(`Achievements hero is ${result.heroHeight}px tall at ${viewport.width}px`);
    }
    if (result.evidenceTop < viewport.height - 1) {
      throw new Error(`Evidence begins inside the hero viewport at ${viewport.width}px`);
    }
    if (result.evidenceCount !== 4) {
      throw new Error(`Expected 4 evidence items, found ${result.evidenceCount}`);
    }
    if (result.pageText.includes('Overall Head, Student Activity Council')) {
      throw new Error('Overall Head, Student Activity Council is still rendered');
    }
    if (result.pageText.includes('3 roles')) {
      throw new Error('Stale Student Activity Council role count is still rendered');
    }
    if (!result.pageText.includes('10+')) {
      throw new Error('Verified hackathon finalist count is missing');
    }

    const expectedLeadership = [
      'Joint Secretary, SAC Welfare',
      'Operations Manager, Rotaract Club',
      "Alumni Meet '24 Representative",
      'Executive, SAC Sports',
      'Member, IAENG',
      'Design Team Lead, Entrepreneurship Cell',
      'Social Media Volunteer, Aurora',
      'Squad Leader, Mood Indigo',
      "Operations Team Lead, Hindi Pakhwada '23",
    ];
    if (result.leadershipTitles.join('|') !== expectedLeadership.join('|')) {
      throw new Error(`Leadership is not reverse chronological: ${result.leadershipTitles.join(' | ')}`);
    }
    if (result.identityLogos < 10) {
      throw new Error(`Expected at least 10 recognised identity marks, found ${result.identityLogos}`);
    }
  }

  console.log('Achievements ledger verification passed');
} finally {
  await browser.close();
}
