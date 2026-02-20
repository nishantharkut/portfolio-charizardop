import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import "./globals.css";
import "../styles/performance.css";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingProvider } from "./contexts/LoadingContext";
import LoadingWrapper from "./components/ui/LoadingWrapper";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import TopScrollBar from "./components/ui/TopScrollBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false, // Don't preload monospace font
  fallback: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  adjustFontFallback: true,
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '600', '700', '800'],
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    default: 'Nishant Harkut',
    template: '%s | Nishant Harkut'
  },
  description: 'Nishant Harkut — BTech IT, IIIT Gwalior. Full stack engineer with 6+ Months of Industry experience. Open to software engineering internships and SDE roles.',
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
    'Information Technology Student India',
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
    title: 'Nishant Harkut | Full Stack Dev',
    description: 'Full stack engineer, BTech IT at IIIT Gwalior. 6+ Months of Industry experience. Open to software engineering internships and SDE roles.',
    url: 'https://www.nishantharkut.dev',
    siteName: 'Nishant.dev',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nishant Harkut — Software Engineer portfolio',
      },
      {
        url: '/nishantharkut-logo-lightbg.png',
        width: 72,
        height: 72,
        alt: 'Nishant Harkut Logo',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nishant Harkut | Full Stack Developer | BTech IT, IIIT Gwalior',
    description: 'Full stack engineer, BTech IT at IIIT Gwalior. Open to software engineering internships and SDE roles.',
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
    icon: [
      // Light-bg logo so favicon is visible on Google's white search result background
      { url: '/nishantharkut-logo-lightbg.png', sizes: '48x48', type: 'image/png' },
      { url: '/nishantharkut-logo-lightbg.png', sizes: '72x72', type: 'image/png' },
      { url: '/nishantharkut-logo-lightbg.png', sizes: '96x96', type: 'image/png' },
      { url: '/nishantharkut-logo-lightbg.png', sizes: '128x128', type: 'image/png' },
      { url: '/nishantharkut-logo-lightbg.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/nishantharkut-logo-lightbg.png',
    apple: [
      { url: '/nishantharkut-logo-lightbg.png', sizes: '180x180', type: 'image/png' },
      { url: '/nishantharkut-logo-lightbg.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
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
        {/* Critical resource hints - highest priority */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preload only critical above-the-fold assets */}
        <link rel="preload" href="/nishant-image.webp" as="image" fetchPriority="high" />
        <link rel="preload" href="/nishantharkut-logo-lightbg.png" as="image" fetchPriority="high" />
        
        {/* Defer 3D model loading - load after critical content */}
        <link rel="preload" href="/models/charizard.glb" as="fetch" crossOrigin="anonymous" fetchPriority="low" />
        
        {/* Performance monitoring script */}
        <script src="/performance-monitor.js" defer></script>
        
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
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <PerformanceProvider>
            <ThemeProvider>
              <TopScrollBar />
              <LoadingProvider>
                <LoadingWrapper>
                  <ServiceWorkerRegistration />
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
