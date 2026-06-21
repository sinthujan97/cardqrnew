import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Dynamic QR Code Generator - Edit Details Anytime | CardQR",
  description: "Generate dynamic QR codes with edit-anytime features. Change menu items, contact details, or credentials without reprint latency.",
  alternates: {
    canonical: "https://getcardqr.com/dynamic-qr-code"
  },
  openGraph: {
    title: "Dynamic QR Code Generator - Edit Details Anytime | CardQR",
    description: "Generate dynamic QR codes with edit-anytime features. Change menu items, contact details, or credentials without reprint latency.",
    url: "https://getcardqr.com/dynamic-qr-code",
    images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dynamic QR Code Generator - Edit Details Anytime | CardQR",
    description: "Generate dynamic QR codes with edit-anytime features. Change menu items, contact details, or credentials without reprint latency.",
    images: ['https://getcardqr.com/og-image.png'],
  }
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Dynamic QR Codes That You Can Edit Anytime"
      heroDescription="Never reprint your QR codes again. Update target links, descriptions, passwords, or menu prices behind the scenes with our Secret Edit Links."
      ctaText="Create Dynamic QR"
      ctaLink="/create/menu"
      tagline="Flexible, editable QR destinations"
      templateId="restaurant-menu"
    />
  );
}
