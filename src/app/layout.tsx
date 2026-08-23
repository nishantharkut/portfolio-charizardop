import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { getSiteConfig } from "@/data";
import "./globals.css";
import "../styles/performance.css";
import { PerformanceProvider } from "@/contexts/PerformanceContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { LoadingProvider } from "./contexts/LoadingContext";
import LoadingWrapper from "./components/ui/LoadingWrapper";
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

const siteConfig = getSiteConfig();
const siteIcon = siteConfig.faviconPath || '/nishantharkut-logo-lightbg.png';
const ogImage = siteConfig.ogImagePath || '/og-image.jpg';
const twitterImage = siteConfig.twitterImagePath || siteConfig.ogImagePath || '/og-image.jpg';

export const metadata: Metadata = {
  title: {
    default: 'Nishant Harkut',
    template: '%s | Nishant Harkut'
  },
  description: 'Portfolio of Nishant Harkut, an Information Technology student at IIIT Gwalior and Software Engineering Intern at QuickIntell. Work in backend systems, full-stack products, AWS, applied ML, and open source.',
  keywords: [
    'Nishant Harkut',
    'IIIT Gwalior Student',
    'Information Technology Student',
    'Backend Engineer',
    'Full Stack Engineer',
    'Applied Machine Learning',
    'AWS Developer',
    'Python Developer',
    'Go Developer',
    'TypeScript Developer',
    'Software Engineering Intern',
    'Open Source Contributor',
    'Machine Learning Research',
    'Student Portfolio',
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
    title: 'Nishant Harkut | Software Engineering, Applied ML, AWS',
    description: 'Software Engineering Intern and Information Technology student working across backend systems, full-stack products, AWS, applied ML, and open source.',
    url: 'https://www.nishantharkut.dev',
    siteName: 'Nishant.dev',
    images: [
      { url: ogImage, width: 1200, height: 630, alt: 'Nishant Harkut software engineering portfolio' },
      { url: siteIcon, width: 72, height: 72, alt: 'Nishant Harkut Logo' },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nishant Harkut | Software Engineering, Applied ML, AWS',
    description: 'Backend and full-stack engineering, AWS, applied ML research, and open-source work.',
    images: [twitterImage],
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
      { url: siteIcon, sizes: '48x48', type: 'image/png' },
      { url: siteIcon, sizes: '72x72', type: 'image/png' },
      { url: siteIcon, sizes: '96x96', type: 'image/png' },
      { url: siteIcon, sizes: '128x128', type: 'image/png' },
      { url: siteIcon, sizes: '192x192', type: 'image/png' },
    ],
    shortcut: siteIcon,
    apple: [
      { url: siteIcon, sizes: '180x180', type: 'image/png' },
      { url: siteIcon, sizes: '192x192', type: 'image/png' },
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
        <link rel="preload" href={siteIcon} as="image" fetchPriority="high" />
        
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
              "jobTitle": "Software Engineering Intern",
              "worksFor": {
                "@type": "EducationalOrganization",
                "name": "IIIT Gwalior",
                "description": "Information Technology Student"
              },
              "affiliation": {
                "@type": "EducationalOrganization",
                "name": "Indian Institute of Information Technology, Gwalior"
              },
              "knowsAbout": [
                "Backend Engineering",
                "Full-Stack Development",
                "Applied Machine Learning",
                "AWS",
                "Open Source",
                "Python",
                "Go",
                "React",
                "FastAPI",
                "MongoDB",
                "TypeScript",
                "Testing and Debugging"
              ],
              "description": "Pre-final-year Information Technology student at IIIT Gwalior and Software Engineering Intern at QuickIntell, graduating in May 2028.",
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
