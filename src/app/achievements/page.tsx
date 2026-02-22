import { Metadata } from 'next';
import AchievementsClient from './AchievementsClient';

export const metadata: Metadata = {
  title: 'Achievements',
  description: 'Nishant Harkut\'s achievements, awards, and certifications as a BTech IT student at IIIT Gwalior. Recognitions in full stack development, hackathons, and technical competitions.',
  keywords: [
    'Nishant Harkut Achievements',
    'IIIT Gwalior Awards',
    'Student Developer Certifications',
    'Hackathon Wins',
    'Technical Achievements',
    'Programming Competitions',
    'Developer Certifications',
    'Student Awards',
    'Technical Recognitions',
    'MERN Stack Certifications'
  ],
  openGraph: {
    title: 'Achievements - Nishant Harkut',
    description: 'Awards, certifications, and achievements of Nishant Harkut, IIIT Gwalior student in full stack development and technical competitions.',
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
    description: 'Awards, certifications, and recognitions in full stack development and technical competitions.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/achievements',
  },
};

export default function AchievementsPage() {
  return <AchievementsClient />;
}

