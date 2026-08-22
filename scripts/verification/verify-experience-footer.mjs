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
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.experience-info-box');

    const landingResult = await page.evaluate(() => {
      const year = document.querySelector('.experience-info-box h3');
      const info = document.querySelector('.experience-info-box .experience-info-in');
      const yearRect = year?.getBoundingClientRect();
      const infoRect = info?.getBoundingClientRect();

      return {
        year: year?.textContent?.trim() ?? '',
        yearFits: Boolean(yearRect && infoRect && yearRect.right <= infoRect.right + 1),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    if (landingResult.year !== '2025-26') {
      throw new Error(
        `Landing-page QuickIntell year is incorrect at ${viewport.width}px: ${landingResult.year || '(empty)'}`,
      );
    }
    if (!landingResult.yearFits) {
      throw new Error(`Landing-page QuickIntell year exceeds its row at ${viewport.width}px`);
    }
    if (landingResult.overflow > 1) {
      throw new Error(
        `Landing-page horizontal overflow is ${landingResult.overflow}px at ${viewport.width}px`,
      );
    }
  }

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
      const workHistoryHeader = document.querySelector('[data-experience-timeline] > div > header');
      const firstWorkHeading = workEntries[0]?.querySelector('[data-employment-duration]');
      const workHistoryHeaderRect = workHistoryHeader?.getBoundingClientRect();
      const firstWorkHeadingRect = firstWorkHeading?.getBoundingClientRect();
      const floatingActions = document.querySelector('.navbar-float-actions');
      const timelineProgress = document.querySelector('[data-timeline-progress]');
      const timelineRail = timelineProgress?.parentElement;
      const timelineNodes = Array.from(document.querySelectorAll('[data-timeline-node]'));
      const timelineRailRect = timelineRail?.getBoundingClientRect();
      const firstTimelineNodeRect = timelineNodes.at(0)?.getBoundingClientRect();
      const lastTimelineNodeRect = timelineNodes.at(-1)?.getBoundingClientRect();
      const githubChartShell = document.querySelector('[data-github-chart-shell]');
      const githubAttribution = document.querySelector('[data-github-chart-attribution]');
      const characterArt = document.querySelector('[data-footer-character-art]');
      const footerLinks = Array.from(document.querySelectorAll('[data-footer-navigation] a')).map(
        (link) => `${link.textContent?.trim() ?? ''}|${link.getAttribute('href') ?? ''}`,
      );

      return {
        workEntries: workEntries.length,
        workEntryOpacities: workEntries.map((entry) => Number.parseFloat(getComputedStyle(entry).opacity)),
        experienceTimelines: document.querySelectorAll('[data-experience-timeline]').length,
        timelineProgressBars: document.querySelectorAll('[data-timeline-progress]').length,
        timelineNodes: document.querySelectorAll('[data-timeline-node]').length,
        timelineRailOffsets:
          timelineRailRect && firstTimelineNodeRect && lastTimelineNodeRect
            ? {
                start: Math.abs(
                  timelineRailRect.top - (firstTimelineNodeRect.top + firstTimelineNodeRect.height / 2),
                ),
                end: Math.abs(
                  timelineRailRect.bottom - (lastTimelineNodeRect.top + lastTimelineNodeRect.height / 2),
                ),
              }
            : null,
        technologyLists: workEntries.map((entry) => {
          const list = entry.querySelector('[data-technology-list]');
          const logos = Array.from(entry.querySelectorAll('[data-technology-logo]'));

          return {
            names: logos.map((logo) => logo.getAttribute('aria-label') ?? ''),
            visibleText: list?.textContent?.trim() ?? '',
            svgCount: logos.filter((logo) => logo.querySelector('svg')).length,
          };
        }),
        employmentDurations: workEntries.map((entry) => {
          const duration = entry.querySelector('[data-employment-duration]');
          return {
            text: duration?.textContent?.trim() ?? '',
            fontSize: duration ? Number.parseFloat(getComputedStyle(duration).fontSize) : 0,
            visible: duration ? getComputedStyle(duration).display !== 'none' : false,
          };
        }),
        companyIdentities: workEntries.map((entry) => ({
          company: entry.getAttribute('data-company') ?? '',
          href: entry.querySelector('[data-company-link]')?.getAttribute('href') ?? '',
          logoSrc: entry.querySelector('[data-company-logo]')?.getAttribute('src') ?? '',
          logoSources: Array.from(entry.querySelectorAll('[data-company-logo-variant]')).map(
            (logo) => logo.getAttribute('src') ?? '',
          ),
          visibleLogoCount: Array.from(entry.querySelectorAll('[data-company-logo-variant]')).filter(
            (logo) => getComputedStyle(logo).display !== 'none',
          ).length,
          logoLoaded: (() => {
            const logo = entry.querySelector('[data-company-logo]');
            return logo instanceof HTMLImageElement && logo.complete && logo.naturalWidth > 0;
          })(),
        })),
        openSourceEntries: document.querySelectorAll('[data-open-source-entry]').length,
        openSourceIdentities: Array.from(document.querySelectorAll('[data-open-source-entry]')).map((entry) => ({
          organization: entry.querySelector('h3')?.textContent?.trim() ?? '',
          logoSrc: entry.querySelector('[data-open-source-logo]')?.getAttribute('src') ?? '',
          logoLoaded: (() => {
            const logo = entry.querySelector('[data-open-source-logo]');
            return logo instanceof HTMLImageElement && logo.complete && logo.naturalWidth > 0;
          })(),
        })),
        githubContributionGraphs: document.querySelectorAll('[data-github-contribution-graph]').length,
        githubChartShells: document.querySelectorAll('[data-github-chart-shell]').length,
        githubChartSkeletons: document.querySelectorAll('[data-github-chart-skeleton]').length,
        githubChartLoadingLabels: Array.from(
          document.querySelectorAll('[data-github-chart-loading-label]'),
        ).map((label) => label.textContent?.trim() ?? ''),
        githubChartShellHeight: Math.round(
          document.querySelector('[data-github-chart-shell]')?.getBoundingClientRect().height ?? 0,
        ),
        githubChartState: githubChartShell?.getAttribute('data-chart-state') ?? '',
        githubAttributionTabIndex: githubAttribution instanceof HTMLAnchorElement ? githubAttribution.tabIndex : -1,
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
        workHistoryContentGap:
          workHistoryHeaderRect && firstWorkHeadingRect
            ? Math.round(firstWorkHeadingRect.top - workHistoryHeaderRect.bottom)
            : -1,
        floatingActionsVisible: floatingActions
          ? getComputedStyle(floatingActions).display !== 'none'
          : false,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    if (result.workEntries !== 2) {
      throw new Error(`Expected 2 work entries, found ${result.workEntries} at ${viewport.width}px`);
    }
    if (result.workEntryOpacities.some((opacity) => opacity < 0.99)) {
      throw new Error(`A work-history entry is visually de-emphasized at ${viewport.width}px`);
    }
    if (result.experienceTimelines !== 1) {
      throw new Error(`Expected one GSAP experience timeline at ${viewport.width}px`);
    }
    if (result.timelineProgressBars !== 1 || result.timelineNodes !== 2) {
      throw new Error(
        `Timeline structure is incomplete at ${viewport.width}px: ${result.timelineProgressBars} progress bars, ${result.timelineNodes} nodes`,
      );
    }
    if (
      !result.timelineRailOffsets ||
      result.timelineRailOffsets.start > 2 ||
      result.timelineRailOffsets.end > 2
    ) {
      throw new Error(
        `Timeline rail does not terminate at its nodes at ${viewport.width}px: ${JSON.stringify(result.timelineRailOffsets)}`,
      );
    }
    const expectedTechnologies = [
      ['Python', 'Go', 'TypeScript', 'React', 'PostgreSQL', 'AWS'],
      ['Figma', 'Adobe Photoshop', 'Adobe Illustrator'],
    ];
    if (JSON.stringify(result.technologyLists.map(({ names }) => names)) !== JSON.stringify(expectedTechnologies)) {
      throw new Error(`Technology logos are incomplete or out of order at ${viewport.width}px`);
    }
    if (result.technologyLists.some(({ names, svgCount }) => svgCount !== names.length)) {
      throw new Error(`A technology logo is missing its SVG at ${viewport.width}px`);
    }
    if (result.technologyLists.some(({ visibleText }) => visibleText.length > 0)) {
      throw new Error(`Technology names are still rendered as visible text at ${viewport.width}px`);
    }
    const expectedDurations = ['1 year', '3 months'];
    if (JSON.stringify(result.employmentDurations.map(({ text }) => text)) !== JSON.stringify(expectedDurations)) {
      throw new Error(`Employment durations are missing or incorrect at ${viewport.width}px`);
    }
    if (result.employmentDurations.some(({ fontSize, visible }) => !visible || fontSize < 18)) {
      throw new Error(`Employment durations are not prominent enough at ${viewport.width}px`);
    }
    const expectedCompanyIdentities = [
      {
        company: 'QuickIntell',
        href: 'https://quickintell.com/',
        logoSrc: '/assets/logos/quickintell.png',
        logoSources: ['/assets/logos/quickintell.png'],
      },
      {
        company: 'Cook N Klean',
        href: 'https://www.cooknklean.com/',
        logoSrc: '/assets/logos/cook-n-klean-light.png',
        logoSources: [
          '/assets/logos/cook-n-klean-light.png',
          '/assets/logos/cook-n-klean-dark.svg',
        ],
      },
    ];
    for (const [index, identity] of result.companyIdentities.entries()) {
      const expected = expectedCompanyIdentities[index];
      if (
        !expected ||
        identity.company !== expected.company ||
        identity.href !== expected.href ||
        identity.logoSrc !== expected.logoSrc ||
        JSON.stringify(identity.logoSources) !== JSON.stringify(expected.logoSources)
      ) {
        throw new Error(`Company identity is incorrect at ${viewport.width}px: ${JSON.stringify(identity)}`);
      }
      if (identity.visibleLogoCount !== 1) {
        throw new Error(`Expected one visible company logo at ${viewport.width}px: ${identity.company}`);
      }
      if (!identity.logoLoaded) {
        throw new Error(`Company logo did not load at ${viewport.width}px: ${identity.company}`);
      }
    }
    if (result.openSourceEntries !== 3) {
      throw new Error(
        `Expected 3 curated open-source entries, found ${result.openSourceEntries} at ${viewport.width}px`,
      );
    }
    const expectedOpenSourceLogos = [
      ['Learning Unlimited', '/assets/logos/learning-unlimited.png'],
      ['Kiwix', '/assets/logos/kiwix.png'],
      ['Palisadoes Foundation', '/assets/logos/palisadoes-foundation.png'],
    ];
    for (const [index, identity] of result.openSourceIdentities.entries()) {
      const expected = expectedOpenSourceLogos[index];
      if (!expected || identity.organization !== expected[0] || identity.logoSrc !== expected[1]) {
        throw new Error(`Open-source identity is incorrect at ${viewport.width}px: ${JSON.stringify(identity)}`);
      }
      if (!identity.logoLoaded) {
        throw new Error(`Open-source logo did not load at ${viewport.width}px: ${identity.organization}`);
      }
    }
    if (result.githubContributionGraphs !== 1) {
      throw new Error(`GitHub contribution graph is missing at ${viewport.width}px`);
    }
    if (result.githubChartShells !== 1 || result.githubChartSkeletons !== 1) {
      throw new Error(`GitHub chart loading shell is incomplete at ${viewport.width}px`);
    }
    if (JSON.stringify(result.githubChartLoadingLabels) !== JSON.stringify(['Loading GitHub activity'])) {
      throw new Error(`GitHub chart loading state is ambiguous at ${viewport.width}px`);
    }
    if (result.githubChartShellHeight < 80) {
      throw new Error(`GitHub chart loading shell is too short at ${viewport.width}px`);
    }
    if (result.githubChartState !== 'loaded' && result.githubAttributionTabIndex >= 0) {
      throw new Error(`Hidden GitHub attribution remains keyboard-focusable at ${viewport.width}px`);
    }
    if (!result.quickIntellText.includes('Aug. 2025 - Aug. 2026')) {
      throw new Error('QuickIntell date range is not corrected');
    }
    if (result.quickIntellText.includes('Present')) {
      throw new Error('QuickIntell is still described as ongoing');
    }
    for (const requiredOpenSourceEvidence of [
      '16 merged pull requests',
      '9 merged pull requests across 38 unique files',
      'autoscheduler swap validation',
      '5 merged pull requests',
      '2 merged, maintainer-reviewed pull requests',
    ]) {
      if (!result.pageText.toLowerCase().includes(requiredOpenSourceEvidence.toLowerCase())) {
        throw new Error(`Missing open-source evidence: ${requiredOpenSourceEvidence}`);
      }
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
    if (result.workHistoryContentGap < 48 || result.workHistoryContentGap > 96) {
      throw new Error(
        `Work-history spacing is unbalanced at ${viewport.width}px: ${result.workHistoryContentGap}px`,
      );
    }
    const shouldShowFloatingActions = viewport.width >= 1024;
    if (result.floatingActionsVisible !== shouldShowFloatingActions) {
      throw new Error(`Floating controls visibility is incorrect at ${viewport.width}px`);
    }
    if (result.overflow > 1) {
      throw new Error(`Horizontal overflow is ${result.overflow}px at ${viewport.width}px`);
    }
  }

  console.log('Experience and footer verification passed');
} finally {
  await browser.close();
}
