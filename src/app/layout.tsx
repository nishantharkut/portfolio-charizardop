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
import ServiceWorkerCleanup from "./components/ServiceWorkerCleanup";

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
    default: 'Nishant Harkut | Software Engineer | IIIT Gwalior',
    template: '%s | Nishant Harkut'
  },
  description: 'Official portfolio of Nishant Harkut, an IT student at IIIT Gwalior (based in Surat, Gujarat). Seeking Summer 2027 Software Engineering Internships and Full-Time 2028 positions (available for Jan-July 2028 6-month internships). Experienced in Python, Go, AWS, TypeScript, and applied ML.',
  keywords: [
    'Nishant Harkut',
    'Nishant Harkut Portfolio',
    'Nishant Harkut IIIT Gwalior',
    'CharizardOP',
    'Surat Software Engineer',
    'Surat Developer',
    'Gujarat Software Engineer',
    'IIIT Gwalior Student',
    'IIIT Gwalior Software Engineer',
    'IIIT Gwalior SDE Intern 2027',
    'Software Engineering Intern Summer 2027',
    'SDE Intern Summer 2027',
    'Summer 2027 Internship',
    'Software Engineer Full Time 2028',
    'SDE Full Time 2028',
    'Jan July 2028 Intern',
    '6-Month Internship 2028',
    'IIIT Gwalior 2028 Batch',
    'SDE Intern India',
    'Backend Engineer Intern',
    'Full Stack Developer Intern',
    'Junior Software Engineer',
    'Associate Software Engineer',
    'Python Developer Intern',
    'Golang Developer Intern',
    'Go Backend Developer',
    'TypeScript Next.js Engineer',
    'AWS Developer Intern',
    'AWS Bedrock Engineer',
    'Applied Machine Learning Intern',
    'TinyML Researcher',
    'FastAPI Backend Developer',
    'QuickIntell Software Engineer',
    'PocketBuddy Developer',
    'GitLore Developer',
    'Open Source Contributor Kiwix',
    'Learning Unlimited Contributor',
    'HackByte 4.0 Winner',
    'Amazon ML Summer School',
    'Hire Software Engineer Intern',
    'Remote Software Engineer Intern',
    'Bangalore SDE Intern',
    'India Software Engineer Intern',
    'Information Technology Student IIIT'
  ],
  authors: [{ name: 'Nishant Harkut', url: 'https://www.nishantharkut.tech' }],
  creator: 'Nishant Harkut',
  publisher: 'Nishant Harkut',
  category: 'technology',
  classification: 'Software Engineering, Technology, Portfolio, SDE Intern',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.nishantharkut.tech'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Nishant Harkut | Software Engineer | IIIT Gwalior',
    description: 'IT student at IIIT Gwalior, based in Surat, Gujarat. Seeking Summer 2027 Software Engineering Internships and Full-Time 2028 roles (Jan-July 2028). 1 year production experience at QuickIntell in Python, Go, AWS, and TypeScript.',
    url: 'https://www.nishantharkut.tech',
    siteName: 'nishant.tech',
    images: [
      { url: ogImage, width: 1200, height: 630, alt: 'Nishant Harkut software engineering portfolio' },
      { url: siteIcon, width: 72, height: 72, alt: 'Nishant Harkut Logo' },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nishant Harkut | Software Engineer | IIIT Gwalior',
    description: 'IT student at IIIT Gwalior, based in Surat, Gujarat. Seeking Summer 2027 Software Engineering Internships and Full-Time 2028 roles (Jan-July 2028). 1 year production experience at QuickIntell in Python, Go, AWS, and TypeScript.',
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
  other: {
    'geo.region': 'IN-GJ',
    'geo.placename': 'Surat, Gujarat, India; IIIT Gwalior, Madhya Pradesh, India',
    'geo.position': '21.1702;72.8311',
    'ICBM': '21.1702, 72.8311',
    'target': 'all',
    'coverage': 'Worldwide',
    'distribution': 'Global',
    'rating': 'General',
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
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": "https://www.nishantharkut.tech/#profilepage",
      "url": "https://www.nishantharkut.tech",
      "name": "Nishant Harkut - Software Engineer & SDE Profile",
      "isPartOf": {
        "@id": "https://www.nishantharkut.tech/#website"
      },
      "about": {
        "@id": "https://www.nishantharkut.tech/#person"
      },
      "mainEntity": {
        "@id": "https://www.nishantharkut.tech/#person"
      },
      "description": "Official portfolio of Nishant Harkut, an IT student at IIIT Gwalior based in Surat, Gujarat. Seeking Summer 2027 Software Engineering Internships and Full-Time 2028 positions (Jan-July 2028). Experienced in Python, Go, AWS, and applied ML."
    },
    {
      "@type": "WebSite",
      "@id": "https://www.nishantharkut.tech/#website",
      "url": "https://www.nishantharkut.tech",
      "name": "Nishant Harkut Portfolio",
      "alternateName": [
        "nishant.tech",
        "Nishant Harkut Tech",
        "CharizardOP Portfolio"
      ],
      "publisher": {
        "@id": "https://www.nishantharkut.tech/#person"
      }
    },
    {
      "@type": "Person",
      "@id": "https://www.nishantharkut.tech/#person",
      "name": "Nishant Harkut",
      "alternateName": [
        "CharizardOP",
        "Nishant H."
      ],
      "jobTitle": "Software Engineer",
      "url": "https://www.nishantharkut.tech",
      "image": "https://www.nishantharkut.tech/nishant-image.webp",
      "email": "mailto:nhnishantharkut@gmail.com",
      "nationality": {
        "@type": "Country",
        "name": "India"
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Surat",
        "addressRegion": "Gujarat",
        "addressCountry": "IN"
      },
      "homeLocation": {
        "@type": "Place",
        "name": "Surat, Gujarat, India",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Surat",
          "addressRegion": "Gujarat",
          "addressCountry": "IN"
        }
      },
      "workLocation": {
        "@type": "Place",
        "name": "Indian Institute of Information Technology and Management, Gwalior",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Gwalior",
          "addressRegion": "Madhya Pradesh",
          "addressCountry": "IN"
        }
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Indian Institute of Information Technology and Management, Gwalior",
        "alternateName": [
          "IIIT Gwalior",
          "ABV-IIITM Gwalior"
        ],
        "url": "https://www.iiitm.ac.in",
        "sameAs": "https://en.wikipedia.org/wiki/Indian_Institute_of_Information_Technology_and_Management,_Gwalior",
        "location": {
          "@type": "PostalAddress",
          "addressLocality": "Gwalior",
          "addressRegion": "Madhya Pradesh",
          "addressCountry": "IN"
        }
      },
      "affiliation": {
        "@type": "EducationalOrganization",
        "name": "IIIT Gwalior",
        "url": "https://www.iiitm.ac.in"
      },
      "hasOccupation": {
        "@type": "Occupation",
        "name": "Software Engineer",
        "occupationalCategory": "15-1252.00",
        "skills": "Python, Go, Golang, TypeScript, React, Next.js, FastAPI, Node.js, AWS, Lambda, Bedrock, SQS, DynamoDB, PostgreSQL, MongoDB, Docker, PyTorch, scikit-learn, TinyML, REST APIs, Microservices, Testing, pytest, Jest, Vitest, CI/CD",
        "responsibilities": "Backend systems, healthcare revenue-cycle platform development, document processing pipelines, cloud services, and applied machine learning research."
      },
      "seeks": [
        {
          "@type": "Demand",
          "name": "Software Engineering Internship Summer 2027",
          "description": "Seeking Summer 2027 Software Engineering Internships (SDE Intern, Backend Engineer Intern, Full Stack Intern) across Bangalore, Hyderabad, Pune, Delhi NCR, Mumbai, Remote, or globally."
        },
        {
          "@type": "Demand",
          "name": "Full-Time Software Engineer / 6-Month Jan-July 2028 Internship",
          "description": "Seeking Full-Time Software Engineer roles and 6-month Jan to July 2028 internship opportunities (graduating batch of 2028 from IIIT Gwalior)."
        }
      ],
      "sameAs": [
        "https://www.linkedin.com/in/nishant-harkut/",
        "https://github.com/nishantharkut",
        "https://x.com/HarkutNishant",
        "https://leetcode.com/u/nishanth14/",
        "https://codeforces.com/profile/Nishanth2908",
        "https://www.codechef.com/users/nishant_h_27",
        "https://devfolio.co/@CharizardOP",
        "https://linktr.ee/Nishant.Harkut"
      ],
      "knowsAbout": [
        "Software Engineering",
        "Backend Development",
        "Distributed Systems",
        "Full-Stack Development",
        "Applied Machine Learning",
        "TinyML",
        "Edge Computing",
        "Amazon Web Services (AWS)",
        "AWS Bedrock",
        "AWS Lambda",
        "Python",
        "Go (Golang)",
        "TypeScript",
        "React",
        "Next.js",
        "FastAPI",
        "Hono",
        "PostgreSQL",
        "MongoDB",
        "DynamoDB",
        "Docker",
        "Linux",
        "Open Source Software",
        "EDI X12 835",
        "Healthcare Technology",
        "Competitive Programming"
      ],
      "description": "Nishant Harkut is an Information Technology student at IIIT Gwalior (based in Surat, Gujarat) and Software Engineer with 1 year of production experience at QuickIntell, 16 merged open-source PRs, and applied ML research. Seeking Summer 2027 Software Engineering Internships and Full-Time 2028 positions (Jan-July 2028)."
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.nishantharkut.tech/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who is Nishant Harkut?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nishant Harkut is an Information Technology student at IIIT Gwalior (graduating May 2028) based in Surat, Gujarat. He is a Software Engineer with a year of production experience at QuickIntell specializing in backend systems, AWS cloud architectures, and applied machine learning."
          }
        },
        {
          "@type": "Question",
          "name": "Where is Nishant Harkut based and where does he study?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nishant is based in Surat, Gujarat, India. He stays and studies on campus at the Indian Institute of Information Technology and Management (IIIT) Gwalior in Madhya Pradesh, pursuing an Integrated Dual Degree in Information Technology (graduating in 2028)."
          }
        },
        {
          "@type": "Question",
          "name": "What opportunities is Nishant Harkut seeking?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nishant is actively seeking Summer 2027 Software Engineering Internships (SDE Intern / Backend / Full Stack) as well as Full-Time 2028 positions, including 6-month internships from January to July 2028 for the graduating batch of 2028. He is open to opportunities in Bangalore, Hyderabad, Pune, Delhi NCR, Mumbai, Remote, and globally."
          }
        },
        {
          "@type": "Question",
          "name": "What technical skills and stack does Nishant Harkut use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nishant's primary languages are Python, Go (Golang), TypeScript, and C++. His stack spans FastAPI, React, Next.js, Node.js, AWS (Lambda, Bedrock, SQS, S3, DynamoDB, EC2), PostgreSQL, MongoDB, Docker, PyTorch, and scikit-learn."
          }
        },
        {
          "@type": "Question",
          "name": "What production experience does Nishant Harkut have?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Nishant completed a 1-year software engineering internship at QuickIntell working on a healthcare revenue-cycle platform. He built 19 payer-specific Python EOB parsers, generated EDI X12 835 ERA files, fixed Amazon Bedrock production failures, and delivered 40+ security and product features across 5 review cycles."
          }
        },
        {
          "@type": "Question",
          "name": "How can recruiters and engineering teams contact Nishant Harkut?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Recruiters can contact Nishant directly via email at nhnishantharkut@gmail.com, connect on LinkedIn at https://www.linkedin.com/in/nishant-harkut/, or view his code on GitHub at https://github.com/nishantharkut."
          }
        }
      ]
    }
  ]
})
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ServiceWorkerCleanup />
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
