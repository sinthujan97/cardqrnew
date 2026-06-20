import { Suspense } from 'react';
import WorkspaceBuilder from '@/components/WorkspaceBuilder';

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs font-mono text-muted-text">Initializing Workspace...</div>}>
      <WorkspaceBuilder />
    </Suspense>
  );
}
