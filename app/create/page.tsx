'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = searchParams.get('t');

  useEffect(() => {
    const validTemplates = ['business', 'menu', 'event', 'link', 'wifi', 'catalog'];
    if (t && validTemplates.includes(t)) {
      router.replace(`/create/${t}`);
    } else {
      router.replace('/create/business');
    }
  }, [t, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-text">
      Redirecting to workspace...
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-text">Loading Workspace...</div>}>
      <RedirectHandler />
    </Suspense>
  );
}
