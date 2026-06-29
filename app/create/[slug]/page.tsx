import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import WorkspaceBuilder from '@/components/WorkspaceBuilder';

const METADATA_MAP: Record<string, { title: string; description: string }> = {
  'website-url': {
    title: "Create a Free Website URL QR Code | CardQR",
    description: "Generate a premium custom styled QR code linking to any website URL or page. Design with your own colors and logo."
  },
  'restaurant-menu': {
    title: "Create a Free QR Code Restaurant Menu | CardQR",
    description: "Build a beautiful online menu with food categories, pricing, item descriptions, and photos. Update anytime instantly."
  },
  'business-card': {
    title: "Create a Free Digital Business Card QR Code | CardQR",
    description: "Design a digital business card. Share contact info, company details, social profiles, and instant vCard downloads."
  },
  'social-media': {
    title: "Create a Free Social Media Profile Hub QR Code | CardQR",
    description: "Link all your social profiles, links, and bios under a single scannable custom styled QR code."
  },
  'wifi': {
    title: "Create a Free Wi-Fi Sharing QR Code | CardQR",
    description: "Generate a custom Wi-Fi sharing code. Let guests scan to connect automatically to your network."
  },
  'pdf': {
    title: "Create a Free PDF Document QR Code | CardQR",
    description: "Upload and share your PDF files, guides, brochures, and ebooks instantly via scannable QR code."
  },
  'images': {
    title: "Create a Free Image Gallery QR Code | CardQR",
    description: "Build a mobile-friendly photo gallery. Let users view your portfolios, photos, or slides when scanned."
  },
  'video': {
    title: "Create a Free Video Link QR Code | CardQR",
    description: "Embed YouTube, Vimeo, or raw MP4 videos. Share your video presentations instantly through QR."
  },
  'simple-text': {
    title: "Create a Free Plain Text QR Code | CardQR",
    description: "Generate a custom plain text QR code to display notes, messages, guidelines, or codes instantly."
  },
  'facebook-page': {
    title: "Create a Free Facebook Page QR Code | CardQR",
    description: "Direct customers straight to your Facebook business page or profile when they scan your QR code."
  },
  'app-download': {
    title: "Create a Free Mobile App Download QR Code | CardQR",
    description: "Promote your app downloads on Apple App Store & Google Play Store via a single smart QR code."
  },
  'google-review': {
    title: "Create a Free Google Review QR Code | CardQR",
    description: "Boost your customer reviews. Let users write reviews directly on Google maps with one scan."
  },
  'instagram-profile': {
    title: "Create a Free Instagram Profile QR Code | CardQR",
    description: "Generate scannable QR codes that load your Instagram profile or page instantly."
  },
  'event': {
    title: "Create a Free Event Invitation QR Code | CardQR",
    description: "Design a digital event invitation card with venue maps, dates, coordinates, and RSVP confirm inputs."
  },
  'email': {
    title: "Create a Free Pre-filled Email QR Code | CardQR",
    description: "Let users send emails with pre-filled recipient addresses, subject lines, and body text."
  },
  'sms': {
    title: "Create a Free Pre-filled SMS QR Code | CardQR",
    description: "Generate a scannable QR code that prompts pre-filled SMS messages to your target phone number."
  },
  'phone-call': {
    title: "Create a Free Phone Call Dialer QR Code | CardQR",
    description: "Allow users to initiate instant phone calls to your hotline or desk number when scanned."
  },
  'location': {
    title: "Create a Free Map Location QR Code | CardQR",
    description: "Share coordinates or street address maps on Google Maps instantly with a custom QR code."
  },
  'youtube-channel': {
    title: "Create a Free YouTube Channel QR Code | CardQR",
    description: "Promote your YouTube videos or channel. Help users discover and subscribe to your channel."
  },
  'payment': {
    title: "Create a Free Payment Link QR Code | CardQR",
    description: "Receive payments via PayPal, Stripe, Venmo, or checkout URLs instantly using a custom QR code."
  }
};

export async function generateStaticParams() {
  return Object.keys(METADATA_MAP).map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = METADATA_MAP[slug];
  if (!meta) return {};
  
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://getcardqr.com/create/${slug}`
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://getcardqr.com/create/${slug}`,
      images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
    }
  };
}

export default async function TemplateCreatePage({ params }: Props) {
  const { slug } = await params;
  
  // Backwards compatibility redirections
  const ALIAS_MAP: Record<string, string> = {
    'business': 'business-card',
    'menu': 'restaurant-menu',
    'link': 'social-media',
    'catalog': 'images',
  };

  if (ALIAS_MAP[slug]) {
    redirect(`/create/${ALIAS_MAP[slug]}`);
  }

  const validTemplates = Object.keys(METADATA_MAP);
  
  if (!validTemplates.includes(slug)) {
    notFound();
  }
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-text">Loading Workspace...</div>}>
      <WorkspaceBuilder forcedTemplate={slug as any} />
    </Suspense>
  );
}
