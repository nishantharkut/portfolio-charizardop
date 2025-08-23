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
  title: 'Charizard Developer Portfolio',
  description: 'Full stack developer & creative technologist portfolio with immersive 3D experience.',
  keywords: ['developer', 'portfolio', '3D', 'WebGL', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  openGraph: {
    title: 'Charizard Developer Portfolio',
    description: 'Immersive 3D portfolio blending development, design, and creative technology.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Charizard Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Charizard Developer Portfolio',
    description: 'Immersive 3D portfolio blending development, design, and creative technology.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
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
