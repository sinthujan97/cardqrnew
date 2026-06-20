import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "vCard QR Code Generator - Share Contacts Instantly | CardQR",
  description: "Generate vCard QR codes that automatically prompt smartphones to save your profile photo, phone numbers, email, and social networks."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Share Your Contact Card Over vCard QR Codes"
      heroDescription="Give clients access to your complete contact details in one scan. Enable direct contact downloads to phonebooks without manual typing."
      ctaText="Create vCard QR"
      ctaLink="/create?t=business"
      prefillUrl="https://cardqr.com/c/contact-card"
      tagline="Mobile-Optimized contact sharing"
    />
  );
}
