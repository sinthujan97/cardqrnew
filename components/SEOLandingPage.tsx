'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Briefcase, Utensils, Calendar, Link2, Wifi, ShoppingBag, 
  ArrowRight, ShieldCheck, RefreshCw, Zap, Sliders, Check, 
  ChevronDown, Sparkles, Smartphone, QrCode, Coffee, Link as LinkIcon
} from 'lucide-react';
import PhoneMockup from '@/components/PhoneMockup';
import QRGenerator from '@/components/QRGenerator';
import AdSlot from '@/components/AdSlot';
import SiteNav from '@/components/SiteNav';
import TemplatePreview from '@/components/TemplatePreviews';
import { getInitialData, TemplateType } from '@/lib/templates';

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

// Default FAQs
const DEFAULT_FAQS = [
  {
    question: "Do customers need to download an app?",
    answer: "No. CardQR destinations load directly in the phone's native browser overlay when scanned. The page layout is specifically optimized to look and feel exactly like a native app sheet, bypassing traditional website bars."
  },
  {
    question: "Can I edit my card details after printing the QR code?",
    answer: "Yes, completely! When you publish a card, we generate a Secret Edit Link (e.g. cardqr.com/edit/xyz). Bookmark this link. You can use it to update menu items, phone numbers, or WiFi passwords anytime, and the QR code printed on paper stays exactly the same."
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

// Core template preview data
const MOCK_TEMPLATES = [
  {
    id: 'business',
    title: 'Business Card',
    description: 'Photo, job title, contact links, and Save Contact vCard.',
    fields: ['Charlotte Dubois', 'Studio Arcs', 'Save Contact'],
    icon: Briefcase
  },
  {
    id: 'menu',
    title: 'Restaurant Menu',
    description: 'Visual categories, items list, prices, and food details.',
    fields: ['Truffle Arancini - $14', 'Burrata & Tomato - $16', 'Contemporary Italian'],
    icon: Utensils
  },
  {
    id: 'event',
    title: 'Event Card',
    description: 'Calendar details, maps, agenda description, and RSVP signup.',
    fields: ['Gallery Vernissage', 'July 24, 7:00 PM', 'Confirm RSVP Form'],
    icon: Calendar
  },
  {
    id: 'link',
    title: 'Link Hub',
    description: 'Premium alternative to bio-links. Highlight custom URLs.',
    fields: ['Latest Exhibition', 'Figma Library', 'Read Articles'],
    icon: Link2
  },
  {
    id: 'wifi',
    title: 'WiFi Sharing',
    description: 'Secure credentials card with instant click-to-copy button.',
    fields: ['StudioArcs_Guest_5G', 'Copy Password', 'Auto-WPA Setup'],
    icon: Wifi
  },
  {
    id: 'catalog',
    title: 'Product Catalog',
    description: 'Grid cards with photos, prices, and WhatsApp order checkout.',
    fields: ['Chroma Print - $120', 'Space Print - $160', 'Direct Whatsapp Order'],
    icon: ShoppingBag
  }
];

interface SEOLandingPageProps {
  heroTitle: string;
  heroDescription: string;
  ctaText?: string;
  ctaLink: string;
  prefillUrl?: string;
  tagline?: string;
  bulletTitle?: string;
  bulletDescription?: string;
  templateId?: string;
  showQRWidget?: boolean;
}

export default function SEOLandingPage({
  heroTitle,
  heroDescription,
  ctaText = "Start Template Creator",
  ctaLink,
  prefillUrl = "",
  tagline = "Create a beautiful QR destination in 60 seconds",
  bulletTitle = "Create and Deploy in Seconds",
  bulletDescription = "CardQR streamlines publication into 4 linear steps. No accounts required to get started.",
  templateId,
  showQRWidget = false
}: SEOLandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [inputUrl, setInputUrl] = useState(prefillUrl);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const getTemplateType = (): TemplateType => {
    if (!templateId) return 'business';
    if (templateId === 'business-card' || templateId === 'business') return 'business';
    if (templateId === 'restaurant-menu' || templateId === 'menu') return 'menu';
    if (templateId === 'event-card' || templateId === 'event') return 'event';
    if (templateId === 'link-hub' || templateId === 'link') return 'link';
    if (templateId === 'wifi-sharing' || templateId === 'wifi') return 'wifi';
    if (templateId === 'product-catalog' || templateId === 'catalog') return 'catalog';
    return 'business';
  };

  return (
    <div className="flex flex-col flex-1 bg-background font-sans selection:bg-accent selection:text-white text-primary">
      
      <SiteNav />

      {/* 1. HERO SECTION & INSTANT URL GENERATOR */}
      <section className="relative px-6 pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Info Column */}
        <div className="flex-1 max-w-xl text-center lg:text-left">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-dim text-accent border border-accent/15 rounded-full text-[10px] font-bold mb-5 uppercase tracking-wide">
            <Sparkles className="w-3 h-3 text-accent" /> {tagline}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight leading-[1.05] font-heading text-balance">
            {heroTitle}
          </h1>

          <p className="text-xs md:text-sm text-muted-text leading-relaxed mt-5 max-w-md mx-auto lg:mx-0 font-medium">
            {heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-8">
            <Link
              href={ctaLink}
              className="h-12 w-full sm:w-auto px-7 bg-primary hover:opacity-90 text-background text-xs font-bold rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer text-center"
            >
              {ctaText} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Visual Column (Interactive Instant QR Generator Widget) */}
        <div className="flex-1 w-full max-w-md lg:max-w-none flex justify-center">
          {showQRWidget ? (
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
          ) : (
            <PhoneMockup animate={true} dark={false} className="w-full">
              <TemplatePreview type={getTemplateType()} data={{ ...getInitialData(getTemplateType()), theme: 'light' }} slug="preview" />
            </PhoneMockup>
          )}
        </div>

      </section>

      {/* 1b. HERO AD SLOT */}
      <div className="w-full flex justify-center px-6 max-w-7xl mx-auto select-none">
        <AdSlot slotId={templateId ? `${templateId}-intro` : "landing-intro"} />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {MOCK_TEMPLATES.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <Link
                  href={getTemplateSEOPath(tpl.id)}
                  key={tpl.id}
                  className="group block bg-surface paper-grain p-5.5 rounded-3xl border border-border-default hover:border-accent transition-all duration-300 card-shadow cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent-dim text-accent border border-accent/15 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary tracking-tight">{tpl.title}</h3>
                      <p className="text-[10px] text-muted-text leading-tight mt-0.5">{tpl.description}</p>
                    </div>
                  </div>

                  {/* Animated card fields list mockup inside page */}
                  <div className="mt-4.5 bg-surface-2/45 p-3 rounded-lg border border-border-default/60 flex flex-col gap-2 transition-all">
                    {tpl.fields.map((field, fIdx) => (
                      <div key={fIdx} className="h-6.5 px-2 bg-surface rounded border border-border-default/50 flex items-center justify-between text-[9px] font-mono text-muted-text">
                        <span>{field}</span>
                        <div className="w-1 h-1 rounded-full bg-accent/20 group-hover:bg-accent transition-all" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-muted-text group-hover:text-accent transition-all font-sans">
                    <span>View Template Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2b. IN-CONTENT AD SLOT */}
      <div className="w-full flex justify-center px-6 max-w-7xl mx-auto select-none">
        <AdSlot slotId={templateId ? `${templateId}-mid` : "landing-mid"} />
      </div>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="px-6 py-20 w-full max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-medium text-primary tracking-tight font-heading">{bulletTitle}</h2>
          <p className="text-xs text-muted-text mt-2.5 font-medium">
            {bulletDescription}
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
            <div key={idx} className="flex flex-col bg-surface p-5 rounded-2xl border border-border-default card-shadow relative">
              <div className="text-lg font-medium font-heading italic text-accent mb-2">0{idx + 1}.</div>
              <h3 className="text-xs font-bold text-primary tracking-tight font-sans">{item.title}</h3>
              <p className="text-[11px] text-muted-text leading-relaxed mt-2 font-medium">{item.desc}</p>
              <div className="step-dots mt-4">
                {[0, 1, 2, 3].map((dot) => (
                  <span key={dot} className={dot <= idx ? 'is-filled' : ''} />
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>

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

      {/* 4b. LOWER AD SLOT */}
      {templateId && (
        <div className="w-full flex justify-center py-4 px-6 max-w-7xl mx-auto select-none">
          <AdSlot slotId={`${templateId}-lower`} />
        </div>
      )}

      {/* 5. FAQ */}
      <section className="px-6 py-20 w-full max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-medium text-primary tracking-tight font-heading">Frequently Asked Questions</h2>
            <p className="text-xs text-muted-text mt-2.5 font-medium">Clear responses to common workflow questions.</p>
          </div>

          <div className="flex flex-col gap-3">
            {DEFAULT_FAQS.map((faq, idx) => {
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
