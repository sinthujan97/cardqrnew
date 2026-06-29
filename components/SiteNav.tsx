'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TemplatesDropdown from '@/components/TemplatesDropdown';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="h-16 px-4 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border-default flex items-center justify-between sticky top-0 z-50 transition-colors">
      {/* Left side: Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="CardQR Logo" width={28} height={28} priority className="rounded-none border border-border-emphasis" />
          <span className="text-sm font-bold tracking-tight text-primary font-heading flex items-center gap-0.5">
            Card<span className="text-accent">QR</span>
          </span>
        </Link>
      </div>

      {/* Mid items: Desktop Nav links */}
      <div className="hidden md:flex items-center gap-6">
        <TemplatesDropdown />
        <Link href="/#how-it-works" className="text-xs font-semibold text-muted-text hover:text-primary transition-colors">
          How it Works
        </Link>
        <Link href="/#features" className="text-xs font-semibold text-muted-text hover:text-primary transition-colors">
          Features
        </Link>
        <Link href="/#faq" className="text-xs font-semibold text-muted-text hover:text-primary transition-colors">
          FAQs
        </Link>
      </div>

      {/* Right side: Badge, theme toggle, and CTA */}
      <div className="flex items-center gap-3">
        {/* "Free — No Signup" badge */}
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-none border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Free — No Signup
        </span>

        <ThemeToggle />

        <Link
          href="/create/website-url"
          className="boxy h-9 px-4 bg-accent hover:brightness-105 text-accent-foreground text-xs font-bold rounded-none flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
        >
          <span>Create Free QR Card</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-muted-text hover:text-primary md:hidden cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="shadow-soft absolute top-16 left-0 right-0 bg-background border-b border-border-default p-4 flex flex-col gap-4 md:hidden animate-fade-in z-50">
          <div className="flex items-center justify-between border-b border-border-default pb-2">
            <span className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Select Category</span>
            <TemplatesDropdown />
          </div>
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-bold text-muted-text hover:text-primary py-1.5 block"
          >
            How it Works
          </Link>
          <Link
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-bold text-muted-text hover:text-primary py-1.5 block"
          >
            Features
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-xs font-bold text-muted-text hover:text-primary py-1.5 block"
          >
            FAQs
          </Link>
        </div>
      )}
    </nav>
  );
}
