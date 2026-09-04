import { Metadata } from 'next';
import ExperienceClient from './ExperienceClient';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Nishant Harkut\'s experience in healthcare document processing, X12 835 ERA generation, Python, Go, React, TypeScript, AWS, testing, and product security.',
  keywords: [
    'Nishant Harkut Experience',
    'IIIT Gwalior Internships',
    'Software Engineering Intern',
    'Healthcare Software Engineering',
    'X12 835 ERA',
    'Python Go TypeScript',
    'AWS Document Processing',
    'Testing and Debugging',
    'Product Security'
  ],
  openGraph: {
    title: 'Experience - Nishant Harkut',
    description: 'Software engineering work across healthcare document processing, backend systems, product features, AWS, testing, and security.',
    url: 'https://www.nishantharkut.tech/experience',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nishant Harkut Experience - IIIT Gwalior Student',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Experience - Nishant Harkut | IIIT Gwalior Student',
    description: 'Software engineering work across Python, Go, React, TypeScript, AWS, testing, debugging, and product security.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/experience',
  },
};

export default function ExperiencePage() {
  return <ExperienceClient />;
}

