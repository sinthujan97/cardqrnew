import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Event QR Code Generator - Share Invites and RSVPs | CardQR",
  description: "Create custom event QR codes linking to maps navigation, calendar schedules, agenda descriptors, and immediate RSVP signups.",
  alternates: {
    canonical: "https://getcardqr.com/event-qr"
  },
  openGraph: {
    title: "Event QR Code Generator - Share Invites and RSVPs | CardQR",
    description: "Create custom event QR codes linking to maps navigation, calendar schedules, agenda descriptors, and immediate RSVP signups.",
    url: "https://getcardqr.com/event-qr",
    images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Event QR Code Generator - Share Invites and RSVPs | CardQR",
    description: "Create custom event QR codes linking to maps navigation, calendar schedules, agenda descriptors, and immediate RSVP signups.",
    images: ['https://getcardqr.com/og-image.png'],
  }
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Share Event Cards with Custom RSVP Collections"
      heroDescription="Simplify event check-ins. Print QR codes on physical invitations to let guests RSVP, view dynamic calendar schedules, and get maps directions instantly."
      ctaText="Create Event QR Card"
      ctaLink="/create?t=event"
      tagline="Prerendered event invitations"
      templateId="event-card"
    />
  );
}
