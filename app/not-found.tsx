import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';
import SiteNav from '@/components/SiteNav';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-primary font-sans flex flex-col selection:bg-accent selection:text-accent-foreground">
      <SiteNav />

      {/* 404 Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Large stamp-style 404 mark */}
        <div className="relative select-none mb-8">
          <div
            className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-border-default"
            style={{ fontFamily: 'var(--font-heading)' }}
            aria-hidden="true"
          >
            404
          </div>
          {/* Stamp overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-4 border-accent rounded-none px-6 py-2 rotate-[-8deg] opacity-70">
              <span className="text-accent text-sm font-black tracking-[0.3em] uppercase font-mono">
                Not Found
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="heading-display text-2xl md:text-3xl text-primary mb-3 text-balance">
          This page has gone missing
        </h1>
        <p className="text-sm text-muted-text max-w-sm leading-relaxed font-medium mb-10">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or the URL has a typo. Check the address or head back home.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:justify-center">
          <Link
            href="/"
            className="boxy h-11 px-6 bg-accent hover:brightness-105 text-accent-foreground text-xs font-bold rounded-none flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <Link
            href="/create"
            className="boxy h-11 px-6 bg-surface hover:bg-surface-2 text-primary text-xs font-bold rounded-none flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Create a Card
          </Link>
        </div>

        {/* Popular links */}
        <div className="mt-16 max-w-sm w-full">
          <p className="text-[10px] font-mono font-bold text-muted-text uppercase tracking-widest mb-4">Popular Pages</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { href: '/business-card-qr', label: 'Business Card QR' },
              { href: '/restaurant-menu-qr', label: 'Menu QR Code' },
              { href: '/wifi-qr', label: 'WiFi Sharing Card' },
              { href: '/url-to-qr', label: 'URL to QR Code' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="boxy-sm flex items-center gap-2 p-3 rounded-none bg-surface hover:bg-surface-2 text-left text-xs font-semibold text-muted-text hover:text-accent"
              >
                <Search className="w-3 h-3 shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="py-6 px-6 border-t border-border-default text-[10px] text-muted-text bg-surface flex items-center justify-between">
        <span className="heading-display text-primary">CardQR</span>
        <span>© 2026 CardQR Inc.</span>
      </footer>
    </div>
  );
}
