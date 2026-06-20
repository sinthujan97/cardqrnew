import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Custom QR Code with Logo - Upload Brand Badges | CardQR",
  description: "Create premium branded QR codes with your custom business logo, customized colors, and high-contrast styling ready for prints."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Create Custom QR Codes with Your Logo"
      heroDescription="Upload your business or profile logo directly inside your workspace. Rebrand your QR destination and stand out on packaging, menus, and flyers."
      ctaText="Generate Branded QR"
      ctaLink="/create"
      prefillUrl="https://your-brand-website.com"
      tagline="Upload custom logo badges instantly"
    />
  );
}
