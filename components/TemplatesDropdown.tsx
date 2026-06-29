'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Briefcase, Utensils, Share2, Wifi, FileText, Image as ImageIcon, Video, AlignLeft, Download, Star, Calendar, Mail, MessageSquare, Phone, MapPin, CreditCard, Globe } from 'lucide-react';

const Youtube = (props: any) => (
  <svg className={props.className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.86.508 9.388.508 9.388.508s7.528 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const Instagram = (props: any) => (
  <svg className={props.className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Facebook = (props: any) => (
  <svg className={props.className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const CATEGORIES = [
  {
    name: 'Business',
    items: [
      { slug: 'website-url', label: 'Website URL', icon: Globe },
      { slug: 'business-card', label: 'Business Card', icon: Briefcase },
      { slug: 'google-review', label: 'Google Review', icon: Star },
      { slug: 'payment', label: 'Payment Link', icon: CreditCard },
      { slug: 'location', label: 'Map Location', icon: MapPin },
    ]
  },
  {
    name: 'Food & Hospitality',
    items: [
      { slug: 'restaurant-menu', label: 'Restaurant Menu', icon: Utensils },
      { slug: 'wifi', label: 'Wi-Fi Sharing', icon: Wifi },
    ]
  },
  {
    name: 'Social & Media',
    items: [
      { slug: 'social-media', label: 'Social Profile Hub', icon: Share2 },
      { slug: 'facebook-page', label: 'Facebook Page', icon: Facebook },
      { slug: 'instagram-profile', label: 'Instagram Profile', icon: Instagram },
      { slug: 'youtube-channel', label: 'YouTube Channel', icon: Youtube },
    ]
  },
  {
    name: 'Communication',
    items: [
      { slug: 'email', label: 'Email prefill', icon: Mail },
      { slug: 'sms', label: 'SMS text message', icon: MessageSquare },
      { slug: 'phone-call', label: 'Phone Call dial', icon: Phone },
    ]
  },
  {
    name: 'Files & Content',
    items: [
      { slug: 'pdf', label: 'PDF Document', icon: FileText },
      { slug: 'images', label: 'Image Gallery', icon: ImageIcon },
      { slug: 'video', label: 'Video player', icon: Video },
      { slug: 'simple-text', label: 'Plain Text note', icon: AlignLeft },
    ]
  },
  {
    name: 'Apps & Events',
    items: [
      { slug: 'app-download', label: 'App Download', icon: Download },
      { slug: 'event', label: 'Event & RSVP', icon: Calendar },
    ]
  }
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
        className="boxy-sm flex items-center gap-1.5 h-9 px-3.5 rounded-none bg-surface hover:bg-surface-2 text-primary font-sans text-xs font-bold cursor-pointer select-none"
      >
        <span>Templates</span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-text transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="boxy absolute right-[-100px] md:right-0 mt-2 w-[340px] md:w-[480px] max-h-[460px] overflow-y-auto no-scrollbar bg-surface rounded-none p-4 z-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="flex flex-col gap-1.5">
                <span className="text-[9px] font-bold text-muted-text uppercase tracking-widest block px-2 border-l-2 border-accent">{cat.name}</span>
                <div className="flex flex-col gap-0.5">
                  {cat.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.slug}
                        href={`/create/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2.5 p-1.5 rounded-none hover:bg-accent-dim text-primary hover:text-primary transition-all group"
                      >
                        <div className="w-7 h-7 rounded-none bg-surface-2 text-muted-text group-hover:text-accent border border-border-default flex items-center justify-center shrink-0 transition-all duration-200">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-muted-text group-hover:text-primary transition-colors">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
