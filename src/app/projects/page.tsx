import { Metadata } from 'next';
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects | Nishant Harkut | Full-Stack Systems, AWS & TinyML',
  description: 'Production products, developer tooling, and applied ML research by Nishant Harkut: PocketBuddy (campus finance platform), GitLore (HackByte 4.0 knowledge graph), TinyRF-KD (edge intrusion detection), and Covid-RARS.',
  keywords: [
    'Nishant Harkut Projects',
    'PocketBuddy Campus Finance',
    'GitLore Knowledge Graph',
    'TinyRF-KD Edge ML',
    'Covid-RARS Research',
    'Backend Engineering Projects',
    'Full Stack Projects React FastAPI',
    'AWS Bedrock Applications',
    'TinyML Microcontroller Firmware',
    'ESP32 Arduino Machine Learning',
    'Hono Node.js REST API',
    'IIIT Gwalior Student Projects',
    'Software Engineer Portfolio Projects'
  ],
  openGraph: {
    title: 'Projects | Nishant Harkut | Full-Stack Systems, AWS & TinyML',
    description: 'Backend systems, full-stack products, AWS Bedrock applications, applied ML research, and developer tooling by Nishant Harkut.',
    url: 'https://www.nishantharkut.tech/projects',
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
    title: 'Projects | Nishant Harkut | Full-Stack Systems, AWS & TinyML',
    description: 'Backend systems, full-stack products, AWS Bedrock applications, applied ML research, and developer tooling.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/projects',
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
