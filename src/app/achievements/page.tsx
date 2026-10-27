import { Metadata } from 'next';
import AchievementsClient from './AchievementsClient';

export const metadata: Metadata = {
  title: 'Achievements | Nishant Harkut | Hackathons, Open Source & CP',
  description: 'Competitions, awards, and credentials of Nishant Harkut: Amazon ML Summer School 2026, HackOn with Amazon finalist, HackByte 4.0 track winner, 16 merged open-source PRs (Kiwix, Learning Unlimited, Palisadoes), and Competitive Programming ratings.',
  keywords: [
    'Nishant Harkut Achievements',
    'Amazon ML Summer School 2026',
    'HackOn with Amazon Finalist',
    'HackByte 4.0 Winner',
    'Open Source Contributor 16 PRs',
    'Kiwix Open Source Contributor',
    'Learning Unlimited Contributor',
    'Palisadoes Foundation Contributor',
    'Codeforces Nishanth2908',
    'LeetCode nishanth14',
    'Devfolio CharizardOP',
    'IIIT Gwalior Achievements',
    'Competitive Programming Student'
  ],
  openGraph: {
    title: 'Achievements | Nishant Harkut | Hackathons, Open Source & CP',
    description: 'Machine-learning selection, open-source contributions, national hackathon results, certifications, and campus leadership.',
    url: 'https://www.nishantharkut.tech/achievements',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nishant Harkut Achievements - IIIT Gwalior Student',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Achievements | Nishant Harkut | Hackathons, Open Source & CP',
    description: 'Machine-learning selection, open-source work, national hackathon results, certifications, and campus leadership.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/achievements',
  },
};

export default function AchievementsPage() {
  return <AchievementsClient />;
}
