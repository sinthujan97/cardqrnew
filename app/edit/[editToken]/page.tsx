import React, { Suspense } from 'react';
import Link from 'next/link';
import { getCardByEditToken } from '@/lib/db';
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
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center font-sans select-none animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-zinc-200 rounded-full mb-2" />
          <div className="w-48 h-6 bg-zinc-200 rounded-md" />
          <div className="w-64 h-3 bg-zinc-100 rounded-md" />
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
  // Fetch card data server-side
  const card = await getCardByEditToken(editToken);

  // If card doesn't exist, show premium error page
  if (!card) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center font-sans select-none">
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5 border border-red-100">
          <AlertCircle className="w-6 h-6" />
        </div>
        
        <h1 className="text-xl font-bold tracking-tight text-primary">Invalid Editing Link</h1>
        <p className="text-xs text-muted-text mt-2 max-w-[280px] leading-relaxed">
          The secret token in your URL is invalid or has expired. Make sure you copied the correct link.
        </p>

        <div className="mt-8 flex flex-col gap-2.5 w-full max-w-[220px]">
          <Link
            href="/create"
            className="w-full h-10 bg-primary hover:bg-accent text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Create New Card
          </Link>
          
          <Link
            href="/"
            className="w-full h-10 border border-black/10 hover:bg-[#F4F4F5] text-primary text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Render builder populated with existing card data
  return <WorkspaceBuilder initialCard={card} />;
}
