import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects - Nishant Harkut | IIIT Gwalior Student Portfolio',
  description: 'Explore Nishant Harkut\'s student portfolio featuring MERN stack projects, GenAI applications, Web3 platforms, and innovative digital solutions. BTech IT student at IIIT Gwalior.',
  keywords: [
    'Nishant Harkut Projects',
    'IIIT Gwalior Student Projects',
    'MERN Stack Projects',
    'GenAI Projects',
    'Agentic AI Projects',
    'Web3 Projects',
    'n8n Automation Projects',
    'React Student Projects',
    'Node.js Student Projects',
    'Student Developer Portfolio',
    'BTech IT Projects',
    'Full Stack Student Projects',
    'W3nity Project',
    'Hogwarts OS Project'
  ],
  openGraph: {
    title: 'Projects Portfolio - Nishant Harkut | IIIT Gwalior Student',
    description: 'Discover innovative projects by Nishant Harkut including W3nity Web3 platform, Hogwarts OS, and MERN stack applications. BTech IT student at IIIT Gwalior.',
    url: 'https://www.nishantharkut.dev/projects',
    images: [
      {
        url: '/projects-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nishant Harkut Student Projects Portfolio',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects Portfolio - Nishant Harkut | IIIT Gwalior Student',
    description: 'Explore innovative student projects featuring MERN stack, GenAI, Web3, and creative technology solutions by IIIT Gwalior BTech student.',
    images: ['/projects-og-image.jpg'],
  },
  alternates: {
    canonical: '/projects',
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
