import { Metadata } from 'next';
import SEOLandingPage from '@/components/SEOLandingPage';

export const metadata: Metadata = {
  title: "Event QR Code Generator - Share Invites and RSVPs | CardQR",
  description: "Create custom event QR codes linking to maps navigation, calendar schedules, agenda descriptors, and immediate RSVP signups."
};

export default function Page() {
  return (
    <SEOLandingPage 
      heroTitle="Share Event Cards with Custom RSVP Collections"
      heroDescription="Simplify event check-ins. Print QR codes on physical invitations to let guests RSVP, view dynamic calendar schedules, and get maps directions instantly."
      ctaText="Create Event QR Card"
      ctaLink="/create?t=event"
      prefillUrl="https://cardqr.com/c/exhibition-rsvp"
      tagline="Prerendered event invitations"
      templateId="event-card"
    />
  );
}
