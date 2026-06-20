import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "WiFi QR Code Generator - Share Wireless Access Cards | CardQR",
  description: "Create WiFi sharing QR access cards for guests, clients, or customers. Connect instantly with tap-to-copy passwords."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Secure WiFi Access Cards with Instant Scans"
      heroDescription="Avoid spelling out complex router network passwords. Place a clean, stylized WiFi card on tables so guests can connect securely in seconds."
      ctaText="Create WiFi QR Card"
      ctaLink="/create?t=wifi"
      prefillUrl="https://cardqr.com/c/studio-wifi"
      tagline="Tap-to-connect wireless sharing"
      templateId="wifi-sharing"
    />
  );
}
