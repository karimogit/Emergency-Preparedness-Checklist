import type { Metadata, Viewport } from 'next'
import { Outfit, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

const themeBootScript = `(function(){try{var raw=localStorage.getItem('theme');var theme=raw?JSON.parse(raw):'system';var systemDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=theme==='dark'||(theme!=='light'&&systemDark);document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light';}catch(e){}})();`

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Emergency Preparedness Checklist - Complete Family Safety Planning',
  description: 'Comprehensive emergency preparedness checklist with 200+ items, pantry management, HAM radio frequencies, emergency contacts, and document tracking. Stay 10 steps ahead with our complete family safety planning tool.',
  keywords: [
    'emergency preparedness',
    'disaster planning',
    'family safety',
    'emergency checklist',
    'survival kit',
    'prepper supplies',
    'emergency contacts',
    'HAM radio frequencies',
    'pantry management',
    'emergency documents',
    'disaster readiness',
    'family emergency plan',
    'survival checklist',
    'emergency supplies',
    'preparedness planning'
  ],
  authors: [{ name: 'Emergency Preparedness Team' }],
  creator: 'Emergency Preparedness Checklist',
  publisher: 'Emergency Preparedness Checklist',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://emergency-preparedness-checklist.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Emergency Preparedness Checklist - Complete Family Safety Planning',
    description: 'Comprehensive emergency preparedness checklist with 200+ items, pantry management, HAM radio frequencies, emergency contacts, and document tracking. Stay 10 steps ahead with our complete family safety planning tool.',
    url: 'https://emergency-preparedness-checklist.vercel.app',
    siteName: 'Emergency Preparedness Checklist',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Emergency Preparedness Checklist - Complete Family Safety Planning Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emergency Preparedness Checklist - Complete Family Safety Planning',
    description: 'Comprehensive emergency preparedness checklist with 200+ items, pantry management, HAM radio frequencies, emergency contacts, and document tracking.',
    images: ['/og-image.png'],
    creator: '@emergencyprep',
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
  verification: {
    // Add your verification codes here when ready
  },
  category: 'Safety & Emergency Planning',
  classification: 'Emergency Preparedness Tool',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#dce6d6' },
    { media: '(prefers-color-scheme: dark)', color: '#1a2e1a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#1a2e1a" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Emergency Preparedness Checklist",
              "description": "Comprehensive emergency preparedness checklist with 200+ items, pantry management, HAM radio frequencies, emergency contacts, and document tracking.",
              "url": "https://emergency-preparedness-checklist.vercel.app",
              "applicationCategory": "SafetyApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Emergency Preparedness Team"
              },
              "featureList": [
                "200+ Essential Items Checklist",
                "Family Size Management",
                "Pantry Management with Expiry Tracking",
                "HAM Radio Frequency Database",
                "Emergency Contact Management",
                "Document Tracking System",
                "Data Export Functionality",
                "Color-Coded Organization"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
