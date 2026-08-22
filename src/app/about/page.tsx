import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Nishant Harkut, an Information Technology student at IIIT Gwalior and Software Engineering Intern working in backend systems, AWS, applied ML, and open source.',
  keywords: [
    'Nishant Harkut About',
    'IIIT Gwalior Student',
    'Information Technology Student',
    'Software Engineering Intern',
    'Backend Engineering Student',
    'Applied Machine Learning',
    'AWS Student Developer',
    'Open Source Contributor',
    'IIIT Gwalior Portfolio',
    'Full Stack Engineering',
    'Python Developer',
    'Go Developer'
  ],
  openGraph: {
    title: 'About Nishant Harkut',
    description: 'Information Technology student and Software Engineering Intern working across backend systems, full-stack products, AWS, applied ML, and open source.',
    url: 'https://www.nishantharkut.dev/about',
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
    title: 'About Nishant Harkut | Software Engineering and Applied ML',
    description: 'Information Technology student at IIIT Gwalior working in software engineering, AWS, applied ML research, and open source.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
