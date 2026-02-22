import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore Nishant Harkut\'s portfolio of full stack projects, MERN stack applications, GenAI implementations, and web development work. IIIT Gwalior student showcasing technical expertise.',
  keywords: [
    'Nishant Harkut Projects',
    'MERN Stack Projects',
    'Full Stack Applications',
    'GenAI Projects',
    'Web Development Portfolio',
    'Student Developer Projects',
    'React Projects',
    'Node.js Applications',
    'IIIT Gwalior Projects',
    'Technical Portfolio'
  ],
  openGraph: {
    title: 'Projects - Nishant Harkut',
    description: 'Portfolio of full stack projects and applications by Nishant Harkut, IIIT Gwalior student specializing in MERN stack and GenAI.',
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
    description: 'Full stack projects and applications showcasing expertise in MERN stack, GenAI, and web development.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/projects',
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}

