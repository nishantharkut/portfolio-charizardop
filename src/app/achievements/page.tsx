import { Metadata } from 'next';
import AchievementsClient from './AchievementsClient';

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Nishant Harkut\'s machine-learning selection, open-source contributions, hackathon results, certifications, and campus leadership.',
  keywords: [
    'Nishant Harkut Achievements',
    'IIIT Gwalior Awards',
    'Amazon ML Summer School 2026',
    'HackOn with Amazon Finalist',
    'Open Source Contributor',
    'Hackathon Winner',
    'Student Leadership',
    'IIIT Gwalior Achievements'
  ],
  openGraph: {
    title: 'Achievements - Nishant Harkut',
    description: 'Machine-learning selection, open-source contributions, national hackathon results, certifications, and campus leadership.',
    url: 'https://www.nishantharkut.dev/achievements',
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
    title: 'Achievements - Nishant Harkut | IIIT Gwalior Student',
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

