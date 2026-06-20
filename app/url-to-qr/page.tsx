import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "URL to QR Code Generator - Convert Links Instantly | CardQR",
  description: "Convert any URL, web link, or domain name into a high-quality printable vector QR code instantly. No signup required."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Convert Any Link to QR Code Instantly"
      heroDescription="Paste your web URL on the right to dynamically render a custom QR code. Download print-ready vector formats for your websites, posters, or catalogs."
      ctaText="Convert Link Now"
      ctaLink="/create"
      prefillUrl="https://your-website.com"
      tagline="Instant URL to QR Code Converter"
    />
  );
}
