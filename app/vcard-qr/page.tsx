import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "vCard QR Code Generator - Share Contacts Instantly | CardQR",
  description: "Generate vCard QR codes that automatically prompt smartphones to save your profile photo, phone numbers, email, and social networks.",
  alternates: {
    canonical: "https://getcardqr.com/vcard-qr"
  },
  openGraph: {
    title: "vCard QR Code Generator - Share Contacts Instantly | CardQR",
    description: "Generate vCard QR codes that automatically prompt smartphones to save your profile photo, phone numbers, email, and social networks.",
    url: "https://getcardqr.com/vcard-qr",
    images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "vCard QR Code Generator - Share Contacts Instantly | CardQR",
    description: "Generate vCard QR codes that automatically prompt smartphones to save your profile photo, phone numbers, email, and social networks.",
    images: ['https://getcardqr.com/og-image.png'],
  }
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Share Your Contact Card Over vCard QR Codes"
      heroDescription="Give clients access to your complete contact details in one scan. Enable direct contact downloads to phonebooks without manual typing."
      ctaText="Create vCard QR"
      ctaLink="/create/business"
      tagline="Mobile-Optimized contact sharing"
      templateId="business-card"
    />
  );
}
