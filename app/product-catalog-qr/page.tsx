import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Product Catalog QR Code Generator - Mobile Shop Catalogs | CardQR",
  description: "Create premium product catalogs with custom photos, descriptions, pricing grids, and instant checkout features.",
  alternates: {
    canonical: "https://getcardqr.com/product-catalog-qr"
  },
  openGraph: {
    title: "Product Catalog QR Code Generator - Mobile Shop Catalogs | CardQR",
    description: "Create premium product catalogs with custom photos, descriptions, pricing grids, and instant checkout features.",
    url: "https://getcardqr.com/product-catalog-qr",
    images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Product Catalog QR Code Generator - Mobile Shop Catalogs | CardQR",
    description: "Create premium product catalogs with custom photos, descriptions, pricing grids, and instant checkout features.",
    images: ['https://getcardqr.com/og-image.png'],
  }
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Showcase Shop Collections in a Clean QR Catalog"
      heroDescription="Rebrand physical catalogs. Add grids of product cards, item pricing tags, and enable instant mobile checkout workflows directly inside the page preview."
      ctaText="Create Catalog QR Card"
      ctaLink="/create?t=catalog"
      tagline="Mobile-first product showcases"
      templateId="product-catalog"
    />
  );
}
