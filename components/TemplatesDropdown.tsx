'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Briefcase, Utensils, Calendar, Link2, Wifi, ShoppingBag } from 'lucide-react';

const MENU_ITEMS = [
  { href: '/business-card-qr', label: 'Business Card', icon: Briefcase, desc: 'vCard contacts' },
  { href: '/restaurant-menu-qr', label: 'Restaurant Menu', icon: Utensils, desc: 'Digital food lists' },
  { href: '/event-qr', label: 'Event Card', icon: Calendar, desc: 'RSVP & details' },
  { href: '/link-hub-qr', label: 'Link Hub', icon: Link2, desc: 'Bio landing hub' },
  { href: '/wifi-qr', label: 'WiFi Sharing', icon: Wifi, desc: 'Instant credentials' },
  { href: '/product-catalog-qr', label: 'Product Catalog', icon: ShoppingBag, desc: 'Order via WhatsApp' },
];

export default function TemplatesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-border-default bg-surface hover:bg-surface-2 text-primary font-sans text-xs font-semibold transition-all cursor-pointer select-none"
      >
        <span>Templates</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-text transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-surface border border-border-default rounded-2xl shadow-md p-2 z-50 flex flex-col gap-0.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-2 text-primary hover:text-accent transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-2 group-hover:bg-accent-dim text-muted-text group-hover:text-accent border border-border-default flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold leading-tight tracking-tight">{item.label}</span>
                  <span className="text-[10px] text-muted-text leading-tight mt-0.5">{item.desc}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
