import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/performance.css";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingProvider } from "./contexts/LoadingContext";
import LoadingWrapper from "./components/ui/LoadingWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Nishant Harkut - IIIT Gwalior Student | Full Stack Developer Portfolio',
    template: '%s | Nishant Harkut'
  },
  description: 'Nishant Harkut is a 3rd year BTech IT student at IIIT Gwalior specializing in full stack development, MERN stack, GenAI, and Agentic AI. Looking for internships in software engineering and web development.',
  keywords: [
    'Nishant Harkut',
    'IIIT Gwalior Student',
    'BTech IT Student',
    'Full Stack Developer Student',
    'MERN Stack Developer',
    'GenAI Developer',
    'Agentic AI',
    'n8n Automation',
    'React Developer',
    'Node.js Developer',
    'MongoDB Developer',
    'Express.js Developer',
    'Software Engineering Intern',
    'Frontend Developer Intern',
    'Backend Developer Intern',
    'Web Development Intern',
    'Student Portfolio',
    'Internship Seeker',
    'Entry Level Developer',
    'Computer Science Student India',
    'IIIT Gwalior Portfolio'
  ],
  authors: [{ name: 'Nishant Harkut', url: 'https://www.nishantharkut.dev' }],
  creator: 'Nishant Harkut',
  publisher: 'Nishant Harkut',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.nishantharkut.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nishant Harkut - IIIT Gwalior Student | Full Stack Developer',
    description: 'Portfolio of Nishant Harkut, a 3rd year BTech IT student at IIIT Gwalior. Specializing in MERN stack, GenAI, and Agentic AI. Available for internships in software engineering.',
    url: 'https://www.nishantharkut.dev',
    siteName: 'Nishant Harkut - Student Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nishant Harkut - IIIT Gwalior Student Portfolio',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nishant Harkut - IIIT Gwalior Student | Full Stack Developer',
    description: 'BTech IT student at IIIT Gwalior specializing in MERN stack, GenAI, and Agentic AI. Available for software engineering internships.',
    images: ['/og-image.jpg'],
    creator: '@HarkutNishant',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code', // You'll need to add this
    yandex: 'your-yandex-verification-code', // Optional
    yahoo: 'your-yahoo-verification-code', // Optional
    other: {
      me: ['nishantharkut@gmail.com', 'https://nishantharkut.com'],
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Nishant Harkut",
              "url": "https://www.nishantharkut.dev",
              "image": "https://www.nishantharkut.dev/profile-image.jpg",
              "sameAs": [
                "https://www.linkedin.com/in/nishant-harkut/",
                "https://github.com/nishantharkut",
                "https://x.com/HarkutNishant",
                "https://www.instagram.com/nishant.harkut/",
                "https://devfolio.co/@CharizardOP"
              ],
              "jobTitle": "Full Stack Developer Student",
              "worksFor": {
                "@type": "EducationalOrganization",
                "name": "IIIT Gwalior",
                "description": "BTech IT Student"
              },
              "affiliation": {
                "@type": "EducationalOrganization",
                "name": "Indian Institute of Information Technology Gwalior"
              },
              "knowsAbout": [
                "Full Stack Development",
                "MERN Stack",
                "GenAI",
                "Agentic AI", 
                "n8n Automation",
                "React",
                "Node.js",
                "MongoDB",
                "Express.js",
                "TypeScript",
                "Three.js",
                "Web Development",
                "Frontend Development",
                "Backend Development"
              ],
              "description": "3rd year BTech IT student at IIIT Gwalior specializing in full stack development, MERN stack, GenAI, and Agentic AI. Available for software engineering internships.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "India"
              },
              "email": "contact@nishant.dev",
              "seeks": "Software Engineering Internship"
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <PerformanceProvider>
            <ThemeProvider>
              <LoadingProvider>
                <LoadingWrapper>
                  {children}
                </LoadingWrapper>
              </LoadingProvider>
            </ThemeProvider>
          </PerformanceProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
