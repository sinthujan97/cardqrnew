import React, { Suspense } from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getCardBySlug, getQRCodeBySlug } from '@/lib/db';
import PublicCardClient from '@/components/PublicCardClient';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface PublicCardPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function loadCardOrQRCode(slug: string) {
  if (slug === 'preview') {
    return {
      templateType: 'business-card',
      data: getInitialData('business-card'),
      slug: 'preview'
    };
  }

  // 1. Try to find in new schema qr_codes
  const newQR = await getQRCodeBySlug(slug);
  if (newQR) {
    return {
      templateType: newQR.name,
      data: newQR.content,
      slug: newQR.slug
    };
  }

  // 2. Fallback to old cards schema
  const oldCard = await getCardBySlug(slug);
  if (oldCard) {
    return {
      templateType: oldCard.templateType,
      data: oldCard.data,
      slug: oldCard.slug
    };
  }

  return null;
}

// Stub helper for static previews loading
import { getInitialData } from '@/lib/templates';

export async function generateMetadata({ params }: PublicCardPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const card = await loadCardOrQRCode(resolvedParams.slug);
  
  if (!card) {
    return {
      title: 'Card Not Found - CardQR',
      description: 'The requested CardQR page could not be located.'
    };
  }

  let title = 'CardQR Destination';
  let desc = 'A beautiful QR code experience';

  if (card.templateType === 'business-card' || card.templateType === 'business') {
    title = `${card.data?.name || 'Business Card'} | CardQR`;
    desc = card.data?.position || 'Digital Business Card';
  } else if (card.templateType === 'restaurant-menu' || card.templateType === 'menu') {
    title = `${card.data?.restaurantName || 'Restaurant Menu'} | Menu`;
    desc = card.data?.description || 'View our food and drinks selection';
  } else if (card.templateType === 'event') {
    title = `${card.data?.title || 'Event Card'} | RSVP`;
    desc = `${card.data?.date || ''} - ${card.data?.venue || ''}`;
  } else if (card.templateType === 'social-media' || card.templateType === 'link') {
    title = `${card.data?.displayName || 'Social Profile Hub'} | Links`;
    desc = card.data?.bio || 'Check out my profile links';
  } else if (card.templateType === 'wifi') {
    title = `Connect to ${card.data?.networkName || 'WiFi'} | CardQR`;
    desc = 'Instantly copy password to join network';
  }

  return {
    title,
    description: desc,
    ...(resolvedParams.slug === 'preview' && {
      robots: { index: false, follow: false },
    }),
    alternates: {
      canonical: `https://getcardqr.com/c/${resolvedParams.slug}`
    },
    openGraph: {
      title,
      description: desc,
      type: 'website',
      url: `https://getcardqr.com/c/${resolvedParams.slug}`,
      images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
    }
  };
}

export default async function PublicCardPage({ params }: PublicCardPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-[#09090B] bg-[radial-gradient(#1f1f23_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />
        <div className="w-[320px] h-[500px] bg-white rounded-[24px] shadow-2xl z-10 flex flex-col border border-black/5 overflow-hidden relative animate-pulse">
          <div className="w-full flex justify-center py-3 shrink-0">
            <div className="w-10 h-1.5 bg-zinc-200 rounded-full" />
          </div>
          <div className="flex-1 p-6 flex flex-col items-center gap-5 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-zinc-200 mt-6" />
            <div className="w-32 h-4.5 bg-zinc-200 rounded-md" />
            <div className="w-48 h-3 bg-zinc-200 rounded-md" />
          </div>
        </div>
      </div>
    }>
      {params.then(({ slug }) => (
        <CardLoader slug={slug} />
      ))}
    </Suspense>
  );
}

async function CardLoader({ slug }: { slug: string }) {
  const card = await loadCardOrQRCode(slug);

  if (!card) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center font-sans select-none">
        <div className="w-14 h-14 bg-[#F4F4F5] text-primary rounded-full flex items-center justify-center mb-5 border border-black/5">
          <AlertCircle className="w-6 h-6" />
        </div>
        
        <h1 className="heading-display text-xl text-primary">Destination Not Found</h1>
        <p className="text-xs text-muted-text mt-2 max-w-[280px] leading-relaxed">
          The QR destination card you are looking for does not exist or may have been deleted by the owner.
        </p>

        <div className="mt-8 flex flex-col gap-2.5 w-full max-w-[200px]">
          <Link
            href="/"
            className="boxy w-full h-10 bg-accent hover:brightness-105 text-accent-foreground text-xs font-bold rounded-none flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Go to CardQR Home
          </Link>
        </div>
      </div>
    );
  }

  return <PublicCardClient card={card as any} />;
}
