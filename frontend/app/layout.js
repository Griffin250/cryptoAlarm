import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InstallPrompt from "../components/InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CryptoAlarm - Never Miss a Crypto Move | Smart Cryptocurrency Alerts",
  description: "Get instant voice call alerts when your crypto price targets are reached. Professional real-time monitoring for 11+ cryptocurrencies including Bitcoin, Ethereum, and more with smart alert system.",
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
    "voice call alerts",
    "crypto trading alerts"
  ],
  authors: [{ name: "CryptoAlarm Team" }],
  creator: "CryptoAlarm",
  publisher: "CryptoAlarm",
  applicationName: "CryptoAlarm",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  colorScheme: "dark",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/cryptoAlarmLogo.png", sizes: "16x16", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "32x32", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "48x48", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/cryptoAlarmLogo.png", sizes: "57x57", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "60x60", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "72x72", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "76x76", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "114x114", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "120x120", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "144x144", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "152x152", type: "image/png" },
      { url: "/cryptoAlarmLogo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cryptoalarm.app",
    siteName: "CryptoAlarm",
    title: "CryptoAlarm - Never Miss a Crypto Move",
    description: "Get instant voice call alerts when your crypto price targets are reached. Professional real-time monitoring for 11+ cryptocurrencies.",
    images: [
      {
        url: "/cryptoAlarmLogo.png",
        width: 1200,
        height: 630,
        alt: "CryptoAlarm - Smart Cryptocurrency Alert System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CryptoAlarm",
    creator: "@CryptoAlarm",
    title: "CryptoAlarm - Never Miss a Crypto Move",
    description: "Get instant voice call alerts when your crypto price targets are reached. Professional real-time monitoring.",
    images: ["/cryptoAlarmLogo.png"],
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CryptoAlarm",
    startupImage: [
      {
        url: "/cryptoAlarmLogo.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/cryptoAlarmLogo.png",
        media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/cryptoAlarmLogo.png",
        media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "CryptoAlarm",
    "application-name": "CryptoAlarm",
    "msapplication-TileColor": "#3861FB",
    "msapplication-TileImage": "/cryptoAlarmLogo.png",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
