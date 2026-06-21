import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#1C1B19] font-sans flex flex-col selection:bg-[#A8431E] selection:text-white">
      {/* Navbar */}
      <nav className="h-16 px-6 bg-white/75 backdrop-blur-md border-b border-[#E8E2D6] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="CardQR" width={32} height={32} priority className="rounded-xl border border-[#E8E2D6]/50" />
          <Link href="/" className="text-base font-bold tracking-tight text-[#1C1B19] flex items-center gap-1" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
            Card<span className="text-[#6B6456] font-normal">QR</span>
          </Link>
        </div>
        <Link
          href="/create"
          className="h-9 px-4 bg-[#A8431E] hover:bg-[#A8431E]/95 text-white text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs"
        >
          Create Your Card
        </Link>
      </nav>

      {/* 404 Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Large stamp-style 404 mark */}
        <div className="relative select-none mb-8">
          <div
            className="text-[120px] md:text-[160px] font-black leading-none tracking-tighter text-[#E8E2D6]"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
            aria-hidden="true"
          >
            404
          </div>
          {/* Stamp overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-4 border-[#A8431E]/30 rounded-2xl px-6 py-2 rotate-[-8deg] opacity-60">
              <span className="text-[#A8431E] text-sm font-black tracking-[0.3em] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Not Found
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1
          className="text-2xl md:text-3xl font-medium text-[#1C1B19] tracking-tight mb-3"
          style={{ fontFamily: 'Fraunces, Georgia, serif' }}
        >
          This page has gone missing
        </h1>
        <p className="text-sm text-[#6B6456] max-w-sm leading-relaxed font-medium mb-10">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or the URL has a typo. Check the address or head back home.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:justify-center">
          <Link
            href="/"
            className="h-11 px-6 bg-[#A8431E] hover:bg-[#A8431E]/95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <Link
            href="/create"
            className="h-11 px-6 border border-[#E8E2D6] bg-white hover:bg-[#F5EFEB] text-[#1C1B19] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Create a Card
          </Link>
        </div>

        {/* Popular links */}
        <div className="mt-16 max-w-sm w-full">
          <p className="text-[10px] font-mono font-bold text-[#6B6456] uppercase tracking-widest mb-4">Popular Pages</p>
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
                className="flex items-center gap-2 p-3 rounded-xl border border-[#E8E2D6] bg-white hover:border-[#A8431E]/30 hover:bg-[#FAF8F4] transition-all text-left text-xs font-semibold text-[#6B6456] hover:text-[#A8431E]"
              >
                <Search className="w-3 h-3 shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="py-6 px-6 border-t border-[#E8E2D6] text-[10px] text-[#6B6456] bg-white flex items-center justify-between">
        <span className="font-bold text-[#1C1B19]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>CardQR</span>
        <span>© 2026 CardQR Inc.</span>
      </footer>
    </div>
  );
}
