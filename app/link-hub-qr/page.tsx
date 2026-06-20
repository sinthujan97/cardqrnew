import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Link Hub QR Code Generator - Bio Link Profiles | CardQR",
  description: "Create link hub bio pages. Highlight social handles, custom links, blogs, portfolios, and store checkout buttons on a single mobile screen."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Consolidate Your Bio Links on One Scan Card"
      heroDescription="Rebrand standard bio-links. Print a clean, minimalist QR code on your product tags, banners, or portfolios to direct clients to all your social coordinates."
      ctaText="Create Bio Link QR"
      ctaLink="/create?t=link"
      prefillUrl="https://cardqr.com/c/your-portfolio"
      tagline="Premium social link hub profiles"
    />
  );
}
