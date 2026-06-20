import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Free Business Card QR Code Generator - Digital Profiles | CardQR",
  description: "Create premium digital business cards with direct vCard downloads, jobs description, social handles, and high-performance layouts."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Turn Your Business Card Into a Digital Profile"
      heroDescription="Let prospects save your contact card with a single scan. Add profile photos, jobs position, phone numbers, and instant WhatsApp chat links."
      ctaText="Create Business QR"
      ctaLink="/create?t=business"
      prefillUrl="https://cardqr.com/c/your-name"
      tagline="Save Contacts Instantly with vCard"
    />
  );
}
