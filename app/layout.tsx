import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";


// ── next/font Google font loaders ─────────────────────────────────────────────
// Fonts are self-hosted at build time — no render-blocking requests to Google.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  // Include italic axis so the italic variant works (used in how-it-works section)
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  style: ["normal", "italic"],
});

// ── Shared JSON-LD structured data ────────────────────────────────────────────
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CardQR",
  url: "https://getcardqr.com/",
  description:
    "Create beautiful, branded QR destinations in 60 seconds. Digital menus, business cards, link hubs, event pages, WiFi sharing, and product catalogs.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://getcardqr.com/c/{search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CardQR",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  url: "https://getcardqr.com/",
  description:
    "Turn any QR code into a branded mobile card. Create digital business cards, menus, link hubs, event pages, and WiFi sharing cards with QR codes.",
};

export const metadata: Metadata = {
  title: "CardQR - Turn Any QR Code Into a Branded Mobile Card",
  description:
    "Create a beautiful, branded QR destination in 60 seconds. Digital menus, business cards, link hubs, event pages, WiFi sharing, and product catalogs that open like native apps.",
  keywords:
    "QR card, QR code generator, digital business card, QR menu, link-in-bio, WiFi QR, mobile card, vCard QR code, contactless menu",
  authors: [{ name: "CardQR Team" }],
  alternates: {
    canonical: "https://getcardqr.com/",
  },
  openGraph: {
    title: "CardQR - Turn Any QR Code Into a Branded Mobile Card",
    description:
      "Digital business cards, menus, events, and WiFi cards that open like a native app sheet when scanned.",
    type: "website",
    locale: "en_US",
    url: "https://getcardqr.com/",
    siteName: "CardQR",
    images: [{ url: "https://getcardqr.com/og-image.png", width: 1200, height: 630, alt: "CardQR — Branded QR Destinations" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CardQR - Branded Mobile QR Experiences",
    description:
      "Create premium, native-feeling mobile cards linked to custom QR codes in seconds.",
    images: ["https://getcardqr.com/og-image.png"],
  },
  verification: {
    other: {
      "google-adsense-account": "ca-pub-2616045881002465",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${outfit.variable} ${jetbrainsMono.variable} h-full bg-background antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col selection:bg-accent selection:text-white"
        suppressHydrationWarning
      >
        {/* Theme boot script — applies saved/system theme before paint to avoid flash */}
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cardqr-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2616045881002465"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
