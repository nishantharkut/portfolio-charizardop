import { Metadata } from 'next';
import ExperienceClient from './ExperienceClient';

export const metadata: Metadata = {
  title: 'Experience | Nishant Harkut | Software Engineer & SDE Intern',
  description: 'Production engineering experience of Nishant Harkut: 1-year Software Engineering Internship at QuickIntell (healthcare revenue-cycle platform, 19 Python EOB parsers, EDI X12 835 ERA generation, Bedrock debugging) and Product Design at Cook N Klean. Seeking Summer 2027 internships and Full-Time 2028 positions.',
  keywords: [
    'Nishant Harkut Experience',
    'QuickIntell Software Engineer Intern',
    'Healthcare Revenue-Cycle Platform',
    'EDI X12 835 ERA Generation',
    'EOB Parser Python',
    'Production Debugging Bedrock',
    'Cook N Klean Product Designer',
    'Software Engineering Internship Summer 2027',
    'Full Time Software Engineer 2028',
    'Jan July 2028 6 Month Internship',
    'IIIT Gwalior Work Experience',
    'SDE Intern Experience',
    'Backend Engineering Work Experience',
    'AWS Cloud Engineering Intern'
  ],
  openGraph: {
    title: 'Experience | Nishant Harkut | Software Engineer & SDE Intern',
    description: 'Software engineering work across healthcare document processing, backend systems, product features, AWS, testing, and security. Seeking Summer 2027 internships and Full-Time 2028 roles.',
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
    title: 'Experience | Nishant Harkut | Software Engineer & SDE Intern',
    description: 'Software engineering work across Python, Go, React, TypeScript, AWS, testing, debugging, and product security. Seeking Summer 2027 internships and Full-Time 2028 roles.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/experience',
  },
};

export default function ExperiencePage() {
  return <ExperienceClient />;
}
