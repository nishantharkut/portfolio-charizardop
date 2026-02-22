import { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Nishant Harkut, a 3rd year BTech IT student at IIIT Gwalior. Passionate about full stack development, MERN stack, GenAI, and Agentic AI. Available for software engineering internships.',
  keywords: [
    'Nishant Harkut About',
    'IIIT Gwalior Student',
    'BTech IT Student Profile',
    'MERN Stack Student Developer',
    'GenAI Student Developer',
    'Agentic AI Student',
    'n8n Automation Student',
    'Student Technical Skills',
    'IIIT Gwalior Portfolio',
    'Information Technology Student',
    'Full Stack Student Developer',
    'React Student Developer',
    'Node.js Student Developer'
  ],
  openGraph: {
    title: 'About Nishant Harkut',
    description: 'Learn about Nishant Harkut, a 3rd year BTech IT student at IIIT Gwalior specializing in MERN stack, GenAI, and Agentic AI. Available for internships.',
    url: 'https://www.nishantharkut.dev/about',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About Nishant Harkut - IIIT Gwalior Student Profile',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Nishant Harkut - IIIT Gwalior BTech Student | MERN Stack Developer', 
    description: 'Learn about my journey as a BTech IT student at IIIT Gwalior with expertise in MERN stack, GenAI, and Agentic AI development.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
