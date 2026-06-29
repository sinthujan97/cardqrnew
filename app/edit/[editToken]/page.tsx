import React, { Suspense } from 'react';
import Link from 'next/link';
import { getCardByEditToken, getQRCodeById } from '@/lib/db';
import WorkspaceBuilder from '@/components/WorkspaceBuilder';
import { AlertCircle, PlusCircle } from 'lucide-react';

export const unstable_instant = {
  prefetch: 'runtime',
  samples: [
    { params: { editToken: 'preview' } }
  ]
};

interface EditCardPageProps {
  params: Promise<{
    editToken: string;
  }>;
}

export default async function EditCardPage({ params }: EditCardPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-sans select-none animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-surface-2 rounded-full mb-2" />
          <div className="w-48 h-6 bg-surface-2 rounded-md" />
          <div className="w-64 h-3 bg-surface rounded-md" />
        </div>
      </div>
    }>
      {params.then(({ editToken }) => (
        <EditLoader editToken={editToken} />
      ))}
    </Suspense>
  );
}

async function EditLoader({ editToken }: { editToken: string }) {
  // 1. Try to load from new qr_codes using editToken as the UUID ID
  let qrCode = await getQRCodeById(editToken);
  let mappedQRCode: any = null;

  if (qrCode) {
    mappedQRCode = {
      id: qrCode.id,
      slug: qrCode.slug,
      name: qrCode.name,
      content: qrCode.content
    };
  } else {
    // 2. Fall back to old cards by edit token
    const card = await getCardByEditToken(editToken);
    if (card) {
      mappedQRCode = {
        id: card.id,
        slug: card.slug,
        name: card.templateType,
        content: card.data
      };
    }
  }

  // If neither exists, show error page
  if (!mappedQRCode) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-sans select-none text-primary">
        <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-5 border border-red-500/20">
          <AlertCircle className="w-6 h-6" />
        </div>

        <h1 className="heading-display text-xl">Invalid Editing Link</h1>
        <p className="text-xs text-muted-text mt-2 max-w-[280px] leading-relaxed">
          The secret token in your URL is invalid or has expired. Make sure you copied the correct link.
        </p>

        <div className="mt-8 flex flex-col gap-2.5 w-full max-w-[220px]">
          <Link
            href="/create/website-url"
            className="boxy w-full h-10 bg-accent hover:brightness-105 text-accent-foreground text-xs font-bold rounded-none flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Create New Card
          </Link>

          <Link
            href="/"
            className="boxy w-full h-10 bg-surface hover:bg-surface-2 text-primary text-xs font-bold rounded-none flex items-center justify-center cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Render builder populated with existing card data
  return <WorkspaceBuilder initialQRCode={mappedQRCode} />;
}

