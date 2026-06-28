import Link from 'next/link';
import Image from 'next/image';
import TemplatesDropdown from '@/components/TemplatesDropdown';
import ThemeToggle from '@/components/ThemeToggle';

export default function SiteNav() {
  return (
    <nav className="h-16 px-4 sm:px-6 bg-surface/75 backdrop-blur-md border-b border-border-default flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="CardQR" width={32} height={32} priority className="rounded-xl border border-border-default/50" />
        <Link href="/" className="text-base font-bold tracking-tight text-primary flex items-center gap-1 font-heading">
          Card<span className="text-muted-text font-normal">QR</span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <TemplatesDropdown />
        <ThemeToggle />
        <Link
          href="/create"
          className="h-9 px-3 sm:px-4 bg-primary hover:opacity-90 text-background text-xs font-bold rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs whitespace-nowrap"
        >
          Create<span className="hidden sm:inline"> Your Card</span>
        </Link>
      </div>
    </nav>
  );
}
