import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About | Nishant Harkut | Software Engineer & IIIT Gwalior Student',
  description: 'Background, education, and skills of Nishant Harkut: IT student at IIIT Gwalior based in Surat, Gujarat. Software Engineer with 1 year production experience at QuickIntell, open-source contributor, and TinyML researcher. Seeking Summer 2027 internships and Full-Time 2028 roles (Jan-July 2028).',
  keywords: [
    'About Nishant Harkut',
    'Nishant Harkut IIIT Gwalior',
    'Nishant Harkut Surat',
    'Nishant Harkut Gujarat',
    'Surat Software Developer',
    'IIIT Gwalior Student Profile',
    'IIIT Gwalior Software Engineer',
    'IIIT Gwalior SDE Intern 2027',
    'Summer 2027 Intern SDE',
    'Full Time Software Engineer 2028',
    'Jan July 2028 Internship',
    'Software Engineer Bio',
    'Backend Engineer Student',
    'QuickIntell Software Engineer Intern',
    'Applied Machine Learning Student',
    'Open Source Contributor Kiwix',
    'Python Go TypeScript Developer',
    'SDE Intern Candidate India'
  ],
  openGraph: {
    title: 'About Nishant Harkut | Software Engineer & IIIT Gwalior Student',
    description: 'IT student at IIIT Gwalior, based in Surat, Gujarat. Seeking Summer 2027 Software Engineering Internships and Full-Time 2028 roles (Jan-July 2028). 1 year production engineering experience at QuickIntell.',
    url: 'https://www.nishantharkut.tech/about',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About Nishant Harkut - IIIT Gwalior Student Profile',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Nishant Harkut | Software Engineer & IIIT Gwalior Student',
    description: 'IT student at IIIT Gwalior, based in Surat, Gujarat. Seeking Summer 2027 Software Engineering Internships and Full-Time 2028 roles (Jan-July 2028). 1 year production engineering experience at QuickIntell.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
