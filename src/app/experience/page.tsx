import { Metadata } from 'next';
import ExperienceClient from './ExperienceClient';

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Explore Nishant Harkut\'s professional journey as a BTech IT student at IIIT Gwalior. Full stack development internships, MERN stack projects, and technical experiences in GenAI and Agentic AI.',
  keywords: [
    'Nishant Harkut Experience',
    'IIIT Gwalior Internships',
    'Student Developer Experience',
    'MERN Stack Internship',
    'Full Stack Developer Journey',
    'GenAI Projects',
    'Agentic AI Experience',
    'Web Development Internship',
    'Student Work Experience',
    'Technical Skills Portfolio'
  ],
  openGraph: {
    title: 'Experience - Nishant Harkut',
    description: 'Professional journey and internship experiences of Nishant Harkut, IIIT Gwalior student specializing in MERN stack and GenAI development.',
    url: 'https://www.nishantharkut.dev/experience',
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
    description: 'Professional journey as a BTech IT student with expertise in MERN stack, GenAI, and full stack development.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/experience',
  },
};

export default function ExperiencePage() {
  return <ExperienceClient />;
}

