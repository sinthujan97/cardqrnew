import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Contactless QR Code Menu Generator for Restaurants | CardQR",
  description: "Create premium digital contactless menus. Categorize items, list descriptions, set prices, and integrate waiter order workbook sheets."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Turn Your Table QR Codes Into Contactless Menus"
      heroDescription="Upgrade from boring, bloated PDF menus to interactive mobile card menus. Allow customers to browse starters, mains, and add items directly to a waiter order list."
      ctaText="Create Restaurant QR Menu"
      ctaLink="/create?t=menu"
      prefillUrl="https://cardqr.com/c/bistro-menu"
      tagline="Editorial restaurant menu layouts"
      templateId="restaurant-menu"
    />
  );
}
