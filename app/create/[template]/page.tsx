import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import WorkspaceBuilder from '@/components/WorkspaceBuilder';
import { TemplateType } from '@/lib/templates';

const METADATA_MAP: Record<TemplateType, { title: string; description: string }> = {
  business: {
    title: "Create a Free Digital Business Card QR Code | CardQR",
    description: "Design your free digital business card. Share contact info, social links, and direct vCard downloads with a scannable QR code."
  },
  menu: {
    title: "Create a Free QR Code Restaurant Menu | CardQR",
    description: "Build a free digital QR code menu for your restaurant, café, or bar. Add categories, items, and prices that guests scan and view instantly."
  },
  event: {
    title: "Create a Free QR Code Event Invitation | CardQR",
    description: "Design a digital event invitation card with details, maps, agenda descriptions, and instant RSVP signup forms."
  },
  link: {
    title: "Create a Free Link Hub QR Code (Link-in-Bio) | CardQR",
    description: "Build a premium digital link hub. Highlight multiple custom URLs, portfolios, and assets behind a single scannable QR code."
  },
  wifi: {
    title: "Create a Free WiFi Sharing QR Code | CardQR",
    description: "Generate a custom WiFi sharing card. Let guests scan to connect automatically without typing network names or passwords."
  },
  catalog: {
    title: "Create a Free QR Code Product Catalog | CardQR",
    description: "Build a digital product catalog with photos, pricing, descriptions, and checkout links straight to WhatsApp orders."
  }
};

export async function generateStaticParams() {
  return [
    { template: 'business' },
    { template: 'menu' },
    { template: 'event' },
    { template: 'link' },
    { template: 'wifi' },
    { template: 'catalog' }
  ];
}

type Props = {
  params: Promise<{ template: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { template } = await params;
  const meta = METADATA_MAP[template as TemplateType];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://getcardqr.com/create/${template}`
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://getcardqr.com/create/${template}`,
      images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['https://getcardqr.com/og-image.png'],
    }
  };
}

export default async function TemplateCreatePage({ params }: Props) {
  const { template } = await params;
  const validTemplates: TemplateType[] = ['business', 'menu', 'event', 'link', 'wifi', 'catalog'];
  
  if (!validTemplates.includes(template as TemplateType)) {
    notFound();
  }
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center text-xs font-mono text-muted-text">Loading Workspace...</div>}>
      <WorkspaceBuilder forcedTemplate={template as TemplateType} />
    </Suspense>
  );
}
