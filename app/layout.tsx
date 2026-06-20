import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CardQR - Turn Any QR Code Into a Branded Mobile Card",
  description: "Create a beautiful, branded QR destination in 60 seconds. Digital menus, business cards, link hubs, event pages, WiFi sharing, and product catalogs that open like native apps.",
  keywords: "QR card, QR code generator, digital business card, QR menu, link-in-bio, WiFi QR, mobile card, premium SaaS",
  authors: [{ name: "CardQR Team" }],
  openGraph: {
    title: "CardQR - Turn Any QR Code Into a Branded Mobile Card",
    description: "Digital business cards, menus, events, and WiFi cards that open like a native app sheet when scanned.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CardQR - Branded Mobile QR Experiences",
    description: "Create premium, native-feeling mobile cards linked to custom QR codes in seconds.",
  }
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
    <html lang="en" className="h-full bg-[#0B0C0E] antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans selection:bg-accent selection:text-zinc-950" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
