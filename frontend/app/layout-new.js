import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CryptoAlarm - Smart Cryptocurrency Alert System",
  description: "Advanced cryptocurrency monitoring with real-time alerts, smart notifications, and comprehensive portfolio tracking. Never miss a trading opportunity with AI-powered price alerts.",
  keywords: [
    "crypto alerts",
    "cryptocurrency monitoring", 
    "price notifications",
    "bitcoin alerts",
    "ethereum alerts", 
    "real-time crypto tracking",
    "crypto price alerts",
    "cryptocurrency notifications",
    "binance alerts",
    "crypto portfolio monitoring",
    "smart alerts",
    "crypto trading alerts",
    "supabase crypto app",
    "next.js crypto dashboard"
  ],
  authors: [{ name: "CryptoAlarm Team" }],
  creator: "CryptoAlarm",
  publisher: "CryptoAlarm",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cryptoalarm.app',
    title: 'CryptoAlarm - Smart Cryptocurrency Alert System',
    description: 'Advanced cryptocurrency monitoring with real-time alerts and comprehensive portfolio tracking.',
    siteName: 'CryptoAlarm',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'CryptoAlarm Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CryptoAlarm - Smart Cryptocurrency Alert System',
    description: 'Advanced cryptocurrency monitoring with real-time alerts and comprehensive portfolio tracking.',
    images: ['/icon-512x512.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png', 
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
    ],
  },
  themeColor: '#3861FB',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CryptoAlarm',
  },
  category: 'finance',
  classification: 'Cryptocurrency Monitoring Tool',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="CryptoAlarm" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CryptoAlarm" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#3861FB" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        
        {/* Performance Hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.binance.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional SEO */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="language" content="English" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CryptoAlarm",
              "description": "Advanced cryptocurrency monitoring with real-time alerts and comprehensive portfolio tracking",
              "url": "https://cryptoalarm.app",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "CryptoAlarm Team"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}