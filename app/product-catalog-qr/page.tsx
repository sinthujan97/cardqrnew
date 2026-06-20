import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Product Catalog QR Code Generator - Mobile Shop Catalogs | CardQR",
  description: "Create premium product catalogs with custom photos, descriptions, pricing grids, and instant checkout features."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Showcase Shop Collections in a Clean QR Catalog"
      heroDescription="Rebrand physical catalogs. Add grids of product cards, item pricing tags, and enable instant mobile checkout workflows directly inside the page preview."
      ctaText="Create Catalog QR Card"
      ctaLink="/create?t=catalog"
      prefillUrl="https://cardqr.com/c/shop-catalog"
      tagline="Mobile-first product showcases"
    />
  );
}
