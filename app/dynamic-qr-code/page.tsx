import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Dynamic QR Code Generator - Edit Details Anytime | CardQR",
  description: "Generate dynamic QR codes with edit-anytime features. Change menu items, contact details, or credentials without reprint latency."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Dynamic QR Codes That You Can Edit Anytime"
      heroDescription="Never reprint your QR codes again. Update target links, descriptions, passwords, or menu prices behind the scenes with our Secret Edit Links."
      ctaText="Create Dynamic QR"
      ctaLink="/create"
      prefillUrl="https://dynamic-route.com"
      tagline="Flexible, editable QR destinations"
    />
  );
}
