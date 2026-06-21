'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Utensils, Calendar, Link2, Wifi, ShoppingBag, 
  ArrowRight, ShieldCheck, RefreshCw, Zap, Sliders, Check, 
  ChevronDown, Sparkles, Smartphone, QrCode, Coffee, Link as LinkIcon
} from 'lucide-react';
import PhoneMockup from '@/components/PhoneMockup';
import QRGenerator from '@/components/QRGenerator';
import TemplatesDropdown from '@/components/TemplatesDropdown';
import TemplatePreview from '@/components/TemplatePreviews';
import AdSlot from '@/components/AdSlot';
import Image from 'next/image';
import {
  INITIAL_BUSINESS_DATA,
  INITIAL_MENU_DATA,
  INITIAL_EVENT_DATA,
  INITIAL_LINK_DATA,
  INITIAL_WIFI_DATA,
  INITIAL_CATALOG_DATA
} from '@/lib/templates';

const getTemplateSEOPath = (id: string) => {
  switch (id) {
    case 'business': return '/business-card-qr';
    case 'menu': return '/restaurant-menu-qr';
    case 'event': return '/event-qr';
    case 'link': return '/link-hub-qr';
    case 'wifi': return '/wifi-qr';
    case 'catalog': return '/product-catalog-qr';
    default: return '/create';
  }
};

// FAQS data
const FAQS = [
  {
    question: "Do customers need to download an app?",
    answer: "No. CardQR destinations load directly in the phone's native browser overlay when scanned. The page layout is specifically optimized to look and feel exactly like a native app sheet, bypassing traditional website bars."
  },
  {
    question: "Can I edit my card details after printing the QR code?",
    answer: "Yes, completely! When you publish a card, we generate a Secret Edit Link (e.g. cardqr.com/edit/xyz). Bookmark this link. You can use it to update menu items, phone numbers, or WiFI passwords anytime, and the QR code printed on paper stays exactly the same."
  },
  {
    question: "Do my CardQR codes ever expire?",
    answer: "No, never. Even on our Free plan, generated QR codes and public card URLs remain active forever with unlimited scans. We don't implement hidden scan limits or force shutdowns."
  },
  {
    question: "Can I use my own custom business branding?",
    answer: "Yes, with CardQR Pro you can upload custom logos, remove the small 'CardQR' attribution badge, use custom themes, and upload higher-resolution image assets for your backgrounds and products."
  }
];

// Core template preview data (Realistic print mockup content)
const MOCK_TEMPLATES = [
  {
    id: 'business',
    title: 'Business Card',
    audience: 'For Professionals & Founders',
    descText: 'Share contact details, job roles, social links, and enable direct vCard contact downloads.',
    icon: Briefcase
  },
  {
    id: 'menu',
    title: 'Restaurant Menu',
    audience: 'For Diners & Cafes',
    descText: 'Showcase visual categories, menu items, specific pricing, and food details dynamically.',
    icon: Utensils
  },
  {
    id: 'event',
    title: 'Event Invite Card',
    audience: 'For Hosts & Organizers',
    descText: 'Publish date schedules, venue maps, agenda descriptors, and collect user RSVPs easily.',
    icon: Calendar
  },
  {
    id: 'link',
    title: 'Link Hub',
    audience: 'For Creators & Brands',
    descText: 'Build a link-in-bio page. Highlight multiple links, portfolio exhibits, and digital assets.',
    icon: Link2
  },
  {
    id: 'wifi',
    title: 'WiFi Sharing Card',
    audience: 'For Hosts & Offices',
    descText: 'Deploy secure WiFi access points with auto-connect setup and a quick copy network card.',
    icon: Wifi
  },
  {
    id: 'catalog',
    title: 'Product Catalog',
    audience: 'For Retailers & Shops',
    descText: 'List item cards with pricing, descriptions, and checkout links straight to WhatsApp orders.',
    icon: ShoppingBag
  }
];


function LiveCardPreview({ id }: { id: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the example data and force theme: 'light'
  const getExampleData = () => {
    switch (id) {
      case 'business':
        return { ...INITIAL_BUSINESS_DATA, theme: 'light' };
      case 'menu':
        return { ...INITIAL_MENU_DATA, theme: 'light' };
      case 'event':
        return { ...INITIAL_EVENT_DATA, theme: 'light' };
      case 'link':
        return { ...INITIAL_LINK_DATA, theme: 'light' };
      case 'wifi':
        return { ...INITIAL_WIFI_DATA, theme: 'light' };
      case 'catalog':
        return { ...INITIAL_CATALOG_DATA, theme: 'light' };
      default:
        return null;
    }
  };

  const data = getExampleData();

  if (!data) return null;

  // Render a clean placeholder/skeleton when not mounted to ensure CLS = 0
  if (!mounted) {
    return (
      <div className="w-full flex justify-center items-center py-4 bg-[#FAF8F4]/50 border border-[#E8E2D6]/60 rounded-xl min-h-[340px]">
        <div 
          className="relative shadow-sm border border-[#E8E2D6] rounded-2xl overflow-hidden bg-[#FAF8F4] paper-grain animate-pulse"
          style={{ width: '192px', height: '300px' }}
        >
          {/* Skeleton representation of a card */}
          <div className="w-full h-full flex flex-col justify-between p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-border-default" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-3 bg-border-default rounded w-2/3" />
                <div className="h-2 bg-border-default rounded w-1/2" />
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-3 py-6">
              <div className="h-3 bg-border-default rounded w-full" />
              <div className="h-3 bg-border-default rounded w-5/6" />
              <div className="h-3 bg-border-default rounded w-4/5" />
            </div>
            <div className="h-7 bg-border-default rounded-lg w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center py-4 bg-[#FAF8F4]/50 border border-[#E8E2D6]/60 rounded-xl overflow-hidden relative min-h-[340px]">
      <div 
        className="relative shadow-sm border border-[#E8E2D6] rounded-2xl overflow-hidden pointer-events-none select-none bg-[#FAF8F4] paper-grain"
        style={{
          width: '192px',
          height: '300px',
        }}
      >
        <div 
          style={{
            width: '320px',
            height: '500px',
            transform: 'scale(0.6)',
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
          className="absolute inset-0"
        >
          <TemplatePreview type={id as any} data={data} slug="preview" />
        </div>
      </div>
    </div>
  );
}

const renderTemplatePreview = (id: string) => {
  return <LiveCardPreview id={id} />;
};

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Hero Animation Loop State
  const [heroCardStep, setHeroCardStep] = useState<'scan' | 'sheet'>('scan');
  
  // Instant URL to QR Code state
  const [inputUrl, setInputUrl] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroCardStep(prev => prev === 'scan' ? 'sheet' : 'scan');
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col flex-1 bg-background font-sans selection:bg-accent selection:text-white text-primary">
      
      {/* Sticky Premium Navbar with Brand Logo */}
      <nav className="h-16 px-6 bg-surface/75 backdrop-blur-md border-b border-border-default flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Styled Brand Logo Badge */}
          <Image src="/logo.svg" alt="CardQR" width={32} height={32} priority className="rounded-xl border border-border-default/50" />
          <Link href="/" className="text-base font-bold tracking-tight text-primary flex items-center gap-1 font-heading">
            Card<span className="text-muted-text font-normal">QR</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <TemplatesDropdown />
          <Link 
            href="/create"
            className="h-9 px-4 bg-accent hover:bg-accent/95 text-white text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs"
          >
            Create Your Card
          </Link>
        </div>
      </nav>

      {/* 1. HERO SECTION & INSTANT URL GENERATOR */}
      <section className="relative px-6 pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Info Column */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-dim text-accent border border-accent/15 rounded-full text-[10px] font-bold mb-5 uppercase tracking-wide">
            <Sparkles className="w-3 h-3 text-accent" /> Create a beautiful QR destination in 60 seconds
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-primary tracking-tight leading-[1.08] font-heading">
            Turn Any QR Code Into a Branded Experience
          </h1>
          
          <p className="text-xs md:text-sm text-muted-text leading-relaxed mt-5 max-w-md mx-auto lg:mx-0 font-medium">
            Create digital business cards, menus, event pages, WiFi cards, and link hubs in under a minute. Or convert any web link into a print-ready vector QR code instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-8">
            <Link 
              href="/create"
              className="h-11 w-full sm:w-auto px-6 bg-accent hover:bg-accent/95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer text-center"
            >
              Start Template Creator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Visual Column (Interactive Instant QR Generator Widget) */}
        <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center">
          <div className="w-full max-w-sm bg-surface border border-border-default rounded-2xl p-6 shadow-sm relative overflow-hidden stamp-press">
            
            <div className="relative z-10 flex flex-col gap-4.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent-dim text-accent flex items-center justify-center">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-primary tracking-tight font-sans">Instant URL to QR Code</h3>
              </div>

              {/* URL Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider font-mono">Paste your Web URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="e.g. https://my-website.com"
                    className="flex-1 h-9 px-3 text-xs border border-border-default rounded-xl focus:outline-none focus:border-accent font-medium text-primary bg-surface-2 shadow-2xs font-mono"
                  />
                  {inputUrl && (
                    <button
                      onClick={() => setInputUrl('')}
                      className="h-9 px-2 text-[10px] font-bold border border-border-default rounded-xl hover:bg-surface-2/80 cursor-pointer text-muted-text bg-surface"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic QR Output Zone */}
              <div className="border-t border-border-default pt-4.5 flex flex-col items-center min-h-[220px] justify-center">
                {inputUrl.trim() ? (
                  <div className="p-4 bg-white border border-border-default rounded-xl shadow-2xs relative">
                    <div className="absolute top-1 left-1.5 text-[7px] font-mono text-muted-text/30 select-none">PROOF</div>
                    <QRGenerator value={inputUrl.trim()} size={160} showDownloads={true} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center text-muted-text/30 gap-3 py-6">
                    <div className="w-14 h-14 rounded-full border border-dashed border-border-default flex items-center justify-center bg-surface-2">
                      <QrCode className="w-6 h-6 text-muted-text/45" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-muted-text uppercase block font-mono">QR Code Preview</span>
                      <span className="text-[9px] text-muted-text/80 max-w-[200px] mt-1 block text-center">
                        Enter any link or URL path above to generate a downloadable high-resolution code.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* 1b. HERO AD SLOT */}
      <div className="w-full max-w-7xl mx-auto px-6 select-none">
        <AdSlot slotId="homepage-post-hero" />
      </div>

      {/* 2. TEMPLATE SHOWCASE */}
      <section id="templates" className="px-6 py-20 bg-surface border-t border-b border-border-default w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl md:text-3xl font-medium text-primary tracking-tight font-heading">6 Core Templates to Cover Any Idea</h2>
            <p className="text-xs text-muted-text mt-2.5 font-medium">
              Choose your profile style, fill details, and get your QR code instantly. No manual coding or website builder layout dragging needed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {MOCK_TEMPLATES.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <div 
                  key={tpl.id}
                  className="bg-surface paper-grain p-6 rounded-2xl border border-border-default hover:border-accent/30 transition-all duration-300 card-shadow select-none flex flex-col justify-between min-h-[420px]"
                >
                  <div>
                    {/* Header Info */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-dim text-accent border border-accent/15 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono tracking-wider text-accent uppercase font-bold">
                            {tpl.audience}
                          </span>
                          <h3 className="text-sm font-bold text-primary tracking-tight font-heading mt-0.5">
                            {tpl.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-text mt-3.5 leading-relaxed font-medium">
                      {tpl.descText}
                    </p>

                    {/* Realistic Interactive Preview Container */}
                    <div className="mt-5.5">
                      {renderTemplatePreview(tpl.id)}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-border-default/50 flex items-center justify-between gap-4">
                    <Link 
                      href={getTemplateSEOPath(tpl.id)}
                      className="text-[10px] font-bold text-muted-text hover:text-accent transition-all flex items-center gap-1 font-mono uppercase tracking-wider"
                    >
                      Learn More <ArrowRight className="w-3 h-3" />
                    </Link>
                    
                    <Link 
                      href={`/create/${tpl.id}`}
                      className="h-9 px-4 bg-accent hover:bg-accent/95 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white" /> Use Template
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="px-6 py-20 w-full max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-medium text-primary tracking-tight font-heading">Create and Deploy in Seconds</h2>
          <p className="text-xs text-muted-text mt-2.5 font-medium">
            CardQR streamlines publication into 4 linear steps. No accounts required to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {[
            {
              title: 'Choose template',
              desc: 'Select from 6 beautiful target profiles built specifically for restaurants, networking, events, or local stores.'
            },
            {
              title: 'Fill in your info',
              desc: 'Type your contact handles, upload items, dates, network names, or banner screens. Changes reflect live.'
            },
            {
              title: 'Generate QR instantly',
              desc: 'Our engine processes details and renders print-ready, high-resolution vector SVG or PNG files.'
            },
            {
              title: 'Print and share',
              desc: 'Place the QR code on tables, business card backs, or flyers. Update the details anytime online.'
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col bg-surface p-5 rounded-xl border border-border-default card-shadow relative">
              <div className="text-lg font-medium font-heading italic text-accent mb-2">0{idx + 1}.</div>
              <h3 className="text-xs font-bold text-primary tracking-tight font-sans">{item.title}</h3>
              <p className="text-[11px] text-muted-text leading-relaxed mt-2 font-medium">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* 2b. POST-STEPS AD SLOT */}
      <div className="w-full max-w-7xl mx-auto px-6 select-none">
        <AdSlot slotId="homepage-post-steps" />
      </div>

      {/* 4. FEATURES GRID SECTION */}
      <section id="features" className="px-6 py-20 bg-surface border-t border-b border-border-default w-full select-none">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-medium text-primary tracking-tight font-heading">Engineered for Fast Real-World Use</h2>
          <p className="text-xs text-muted-text mt-2.5 font-medium">
            CardQR handles the hosting, files, QR compiling, and rendering details. You just input info.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
          {[
            {
              title: "Instant QR Generation",
              desc: "Get vectors (SVG) or pixel-perfect (PNG) files ready to download and print on posters, paper, or metal badges.",
              icon: Zap
            },
            {
              title: "Edit Anytime",
              desc: "Save your Secret Edit link. Modify prices, names, social URLs, or dates instantly. Printed QRs stay the same.",
              icon: Sliders
            },
            {
              title: "No Login Required",
              desc: "We skip passwords, onboarding checklists, and accounts. Fill in details and get the QR in 60 seconds flat.",
              icon: ShieldCheck
            },
            {
              title: "Mobile Optimized",
              desc: "Every single layout runs mobile-first, ensuring native viewport scaling, drag gestures, and fluid spring animations.",
              icon: Smartphone
            },
            {
              title: "Printable QR Codes",
              desc: "QR grids are formatted at high resolution to avoid scanning latency or fuzzy prints.",
              icon: QrCode
            },
            {
              title: "Professional Templates",
              desc: "Select structures designed specifically for menus, WiFi cards, art listings, and networking profiles.",
              icon: Sparkles
            },
            {
              title: "Custom Branding",
              desc: "Pro users can hide branding elements, configure custom color variables, and upload heavy branding files.",
              icon: Coffee
            },
            {
              title: "Fast Loading",
              desc: "We prioritize pure client-side bundles, dynamic image resizing, and CDN delivery to ensure scan loads under 200ms.",
              icon: RefreshCw
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-surface-2 p-5 rounded-2xl border border-border-default card-shadow flex flex-col justify-between">
              <div>
                <div className="w-8.5 h-8.5 rounded-lg bg-accent-dim text-accent border border-accent/15 flex items-center justify-center mb-4">
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-primary tracking-tight">{item.title}</h3>
                <p className="text-[11px] text-muted-text leading-relaxed mt-2 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3b. PRE-FAQ AD SLOT */}
      <div className="w-full max-w-7xl mx-auto px-6 select-none">
        <AdSlot slotId="homepage-pre-faq" />
      </div>

      {/* 5. FAQ */}
      <section className="px-6 py-20 w-full max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-medium text-primary tracking-tight font-heading">Frequently Asked Questions</h2>
            <p className="text-xs text-muted-text mt-2.5">Clear responses to common workflow questions.</p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-border-default rounded-2xl overflow-hidden bg-surface shadow-2xs">
                  <button
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    className="w-full px-5 py-4 flex items-center justify-between text-left transition-all hover:bg-surface-2/80 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-primary">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-text transition-all ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div id={`faq-answer-${idx}`} role="region" className="px-5 pb-5 pt-1 text-xs text-muted-text leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border-default text-xs text-muted-text bg-surface">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between gap-8 md:gap-4">
          <div className="flex flex-col gap-2 max-w-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-primary text-sm font-heading">CardQR</span>
              <span className="text-[10px]">© 2026 CardQR Inc.</span>
            </div>
            <p className="text-[10px] text-muted-text/80 leading-relaxed font-medium">
              Create premium, native-feeling mobile cards linked to custom QR codes in seconds.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <div className="flex flex-col gap-2 min-w-[100px]">
              <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-wider">Company</span>
              <Link href="/about" className="hover:text-accent transition-all font-semibold text-[11px]">About Us</Link>
              <Link href="/contact" className="hover:text-accent transition-all font-semibold text-[11px]">Contact Support</Link>
            </div>
            <div className="flex flex-col gap-2 min-w-[100px]">
              <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-wider">Legal</span>
              <Link href="/terms-of-service" className="hover:text-accent transition-all font-semibold text-[11px]">Terms of Service</Link>
              <Link href="/privacy-policy" className="hover:text-accent transition-all font-semibold text-[11px]">Privacy Policy</Link>
            </div>
            <div className="flex flex-col gap-2 min-w-[120px]">
              <span className="font-mono text-[9px] font-bold text-primary uppercase tracking-wider">Guides & Resources</span>
              <Link href="/wifi-qr-code-generator" className="hover:text-accent transition-all font-semibold text-[11px]">WiFi QR Generator Guide</Link>
              <Link href="/qr-code-menu-maker" className="hover:text-accent transition-all font-semibold text-[11px]">QR Code Menu Maker</Link>
              <Link href="/digital-business-card-maker" className="hover:text-accent transition-all font-semibold text-[11px]">Digital Business Card Guide</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
