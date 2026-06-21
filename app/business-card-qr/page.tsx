import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Free Business Card QR Code Generator - Digital Profiles | CardQR",
  description: "Create premium digital business cards with direct vCard downloads, job title, social handles, and high-performance layouts.",
  alternates: {
    canonical: "https://getcardqr.com/business-card-qr"
  },
  openGraph: {
    title: "Free Business Card QR Code Generator - Digital Profiles | CardQR",
    description: "Create premium digital business cards with direct vCard downloads, job title, social handles, and high-performance layouts.",
    url: "https://getcardqr.com/business-card-qr",
    images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free Business Card QR Code Generator - Digital Profiles | CardQR",
    description: "Create premium digital business cards with direct vCard downloads, job title, social handles, and high-performance layouts.",
    images: ['https://getcardqr.com/og-image.png'],
  }
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Turn Your Business Card Into a Digital Profile"
      heroDescription="Let prospects save your contact card with a single scan. Add profile photos, jobs position, phone numbers, and instant WhatsApp chat links."
      ctaText="Create Business QR"
      ctaLink="/create/business"
      tagline="Save Contacts Instantly with vCard"
      templateId="business-card"
    />
  );
}
