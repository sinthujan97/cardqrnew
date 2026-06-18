import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getCardBySlug } from '@/lib/db';
import PublicCardClient from '@/components/PublicCardClient';
import { AlertCircle, ArrowLeft } from 'lucide-react';
export const dynamic = 'force-dynamic';

interface PublicCardPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic SEO metadata matching the card info
export async function generateMetadata({ params }: PublicCardPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const card = await getCardBySlug(resolvedParams.slug);
  
  if (!card) {
    return {
      title: 'Card Not Found - CardQR',
      description: 'The requested CardQR page could not be located.'
    };
  }

  let title = 'CardQR Destination';
  let desc = 'A beautiful QR code experience';

  if (card.templateType === 'business') {
    title = `${card.data?.name || 'Business Card'} | CardQR`;
    desc = card.data?.position || 'Digital Business Card';
  } else if (card.templateType === 'menu') {
    title = `${card.data?.restaurantName || 'Restaurant Menu'} | Menu`;
    desc = card.data?.description || 'View our food and drinks selection';
  } else if (card.templateType === 'event') {
    title = `${card.data?.title || 'Event Card'} | RSVP`;
    desc = `${card.data?.date || ''} - ${card.data?.venue || ''}`;
  } else if (card.templateType === 'link') {
    title = `${card.data?.displayName || 'Link Hub'} | Links`;
    desc = card.data?.bio || 'Check out my latest links';
  } else if (card.templateType === 'wifi') {
    title = `Connect to ${card.data?.networkName || 'WiFi'} | CardQR`;
    desc = 'Instantly copy password to join network';
  } else if (card.templateType === 'catalog') {
    title = `${card.data?.catalogTitle || 'Product Catalog'} | Shop`;
    desc = card.data?.catalogDescription || 'Explore our limited products';
  }

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website'
    }
  };
}

export default async function PublicCardPage({ params }: PublicCardPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const card = await getCardBySlug(slug);

  // Card not found error template
  if (!card) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center font-sans select-none">
        <div className="w-14 h-14 bg-[#F4F4F5] text-primary rounded-full flex items-center justify-center mb-5 border border-black/5">
          <AlertCircle className="w-6 h-6" />
        </div>
        
        <h1 className="text-xl font-bold tracking-tight text-primary">Destination Not Found</h1>
        <p className="text-xs text-muted-text mt-2 max-w-[280px] leading-relaxed">
          The QR destination card you are looking for does not exist or may have been deleted by the owner.
        </p>

        <div className="mt-8 flex flex-col gap-2.5 w-full max-w-[200px]">
          <Link
            href="/"
            className="w-full h-10 bg-primary hover:bg-accent text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Go to CardQR Home
          </Link>
        </div>
      </div>
    );
  }

  return <PublicCardClient card={card} />;
}
