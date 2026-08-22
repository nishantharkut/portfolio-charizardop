import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects by Nishant Harkut across backend engineering, full-stack products, AWS, edge machine learning, respiratory-audio research, and developer tools.',
  keywords: [
    'Nishant Harkut Projects',
    'Backend Engineering Projects',
    'Full Stack Projects',
    'AWS Projects',
    'Applied Machine Learning Projects',
    'TinyML Research',
    'FastAPI Projects',
    'React TypeScript Projects',
    'IIIT Gwalior Projects',
    'Technical Portfolio'
  ],
  openGraph: {
    title: 'Projects - Nishant Harkut',
    description: 'Backend systems, full-stack products, AWS applications, applied ML research, and developer tooling by Nishant Harkut.',
    url: 'https://www.nishantharkut.dev/projects',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nishant Harkut Projects - IIIT Gwalior Student Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Nishant Harkut | IIIT Gwalior Student',
    description: 'Backend systems, full-stack products, AWS applications, applied ML research, and developer tooling.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/projects',
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}

