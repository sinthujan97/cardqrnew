import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Contactless QR Code Menu Generator for Restaurants | CardQR",
  description: "Create premium digital contactless menus. Categorize items, list descriptions, set prices, and integrate waiter order workbook sheets.",
  alternates: {
    canonical: "https://getcardqr.com/restaurant-menu-qr"
  },
  openGraph: {
    title: "Contactless QR Code Menu Generator for Restaurants | CardQR",
    description: "Create premium digital contactless menus. Categorize items, list descriptions, set prices, and integrate waiter order workbook sheets.",
    url: "https://getcardqr.com/restaurant-menu-qr",
    images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contactless QR Code Menu Generator for Restaurants | CardQR",
    description: "Create premium digital contactless menus. Categorize items, list descriptions, set prices, and integrate waiter order workbook sheets.",
    images: ['https://getcardqr.com/og-image.png'],
  }
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Turn Your Table QR Codes Into Contactless Menus"
      heroDescription="Upgrade from boring, bloated PDF menus to interactive mobile card menus. Allow customers to browse starters, mains, and add items directly to a waiter order list."
      ctaText="Create Restaurant QR Menu"
      ctaLink="/create/menu"
      tagline="Editorial restaurant menu layouts"
      templateId="restaurant-menu"
    />
  );
}
