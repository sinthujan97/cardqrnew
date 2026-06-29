'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Briefcase, Utensils, Calendar, Wifi, ShoppingBag,
  ArrowRight, ShieldCheck, Zap, Sliders, Check,
  ChevronDown, Sparkles, Globe, FileText, Image as ImageIcon,
  Video, AlignLeft, Download, Star,
  Mail, MessageSquare, Phone, MapPin,
  CreditCard, ExternalLink, QrCode, Link as LinkIcon
} from 'lucide-react';
import QRGenerator from '@/components/QRGenerator';

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

import AdSlot from '@/components/AdSlot';
import SiteNav from '@/components/SiteNav';

// 20 Templates configuration
const TEMPLATE_CARDS = [
  { slug: 'website-url', label: 'Website URL', icon: Globe, cat: 'Business', desc: 'Direct scannable web link.' },
  { slug: 'business-card', label: 'Business Card', icon: Briefcase, cat: 'Business', desc: 'Digital vCard contact profiles.' },
  { slug: 'google-review', label: 'Google Review', icon: Star, cat: 'Business', desc: 'Direct review generation page.' },
  { slug: 'payment', label: 'Payment Link', icon: CreditCard, cat: 'Business', desc: 'Accept payment links directly.' },
  { slug: 'location', label: 'Map Location', icon: MapPin, cat: 'Business', desc: 'Coordinate navigation mapping.' },
  { slug: 'restaurant-menu', label: 'Restaurant Menu', icon: Utensils, cat: 'Food & Hospitality', desc: 'Full digital items menu card.' },
  { slug: 'wifi', label: 'Wi-Fi Sharing', icon: Wifi, cat: 'Food & Hospitality', desc: 'SSID password sharing credentials.' },
  { slug: 'social-media', label: 'Social Profile Hub', icon: Sparkles, cat: 'Social & Media', desc: 'Unified profiles landing aggregator.' },
  { slug: 'facebook-page', label: 'Facebook Page', icon: Facebook, cat: 'Social & Media', desc: 'Social page scannable redirect.' },
  { slug: 'instagram-profile', label: 'Instagram Profile', icon: Instagram, cat: 'Social & Media', desc: 'Scannable link to account.' },
  { slug: 'youtube-channel', label: 'YouTube Channel', icon: Youtube, cat: 'Social & Media', desc: 'Channel or video direct play.' },
  { slug: 'email', label: 'Email prefill', icon: Mail, cat: 'Communication', desc: 'Mail to recipient with prefilled fields.' },
  { slug: 'sms', label: 'SMS text message', icon: MessageSquare, cat: 'Communication', desc: 'SMS dial prompt with prefilled text.' },
  { slug: 'phone-call', label: 'Phone Call dial', icon: Phone, cat: 'Communication', desc: 'Direct dial shortcut scannable.' },
  { slug: 'pdf', label: 'PDF Document', icon: FileText, cat: 'Files & Content', desc: 'Upload & share catalog document.' },
  { slug: 'images', label: 'Image Gallery', icon: ImageIcon, cat: 'Files & Content', desc: 'Bento styled photos carousel.' },
  { slug: 'video', label: 'Video player', icon: Video, cat: 'Files & Content', desc: 'Play embedded presentation files.' },
  { slug: 'simple-text', label: 'Plain Text note', icon: AlignLeft, cat: 'Files & Content', desc: 'Static messages read note.' },
  { slug: 'app-download', label: 'App Download', icon: Download, cat: 'Apps & Events', desc: 'iOS & Play Store download links.' },
  { slug: 'event', label: 'Event & RSVP', icon: Calendar, cat: 'Apps & Events', desc: 'RSVP confirmations & invites.' },
];

const FAQS = [
  {
    question: "Do dynamic QR codes track scans?",
    answer: "Yes! When you use our dynamic templates (like menus, business cards, link hubs, etc.), scans route through cardqr.com/q/[id] to increment the database analytics count before redirecting seamlessly."
  },
  {
    question: "Is there any sign-up required to create cards?",
    answer: "No. CardQR allows you to generate completely functional QR codes and custom destinations instantly without email registration."
  },
  {
    question: "Can I edit data after printing QR codes?",
    answer: "Yes, for all dynamic QR destinations. You get a secret edit link upon creation. Static codes (like direct Wi-Fi credentials or raw URLs) encode values directly onto the paper, so they cannot be updated after printing."
  },
  {
    question: "What download formats are supported?",
    answer: "We support PNG, SVG, PDF, and JPEG downloads, catering to digital assets, prints, signboards, or professional graphic designers."
  },
  {
    question: "Are the generated codes permanent?",
    answer: "Yes. All scannable QR codes created with CardQR have unlimited lifetime scans and never expire."
  },
  {
    question: "How do I embed custom logos?",
    answer: "During Step 2 (QR Customizer), you can choose standard icons or upload your own corporate/personal logo file in SVG, PNG, or JPG formats to be centered automatically."
  },
  {
    question: "Is CardQR free?",
    answer: "Yes. CardQR is 100% free. We generate revenue through unobtrusive Google AdSense ad slots placed inside our workspace and templates."
  }
];

export default function Homepage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroUrl, setHeroUrl] = useState('');

  // Schema markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SiteNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-4xl"
        >
          {/* Trust badge */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent-foreground bg-accent px-3.5 py-1.5 rounded-none border-2 border-hard">
            <Sparkles className="w-3.5 h-3.5" />
            Vibrant Designs & Vector Exports
          </span>

          <h1 className="heading-display text-4xl sm:text-6xl md:text-7xl text-primary leading-[0.95]">
            Generate QR Codes <span className="text-accent">Free</span>.<br />
            No Signup Required.
          </h1>

          <p className="text-sm md:text-base text-muted-text max-w-2xl mx-auto leading-relaxed">
            Create beautiful, custom styled QR codes in 60 seconds. Digital menus, business cards, Wi-Fi credentials, payment links, and files. Complete vector downloads.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/create/website-url"
              className="boxy h-12 px-8 bg-accent hover:brightness-105 text-accent-foreground font-bold rounded-none flex items-center justify-center gap-2"
            >
              <span>Create Free QR Card</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#templates"
              className="boxy h-12 px-8 bg-surface hover:bg-surface-2 text-primary font-bold rounded-none flex items-center justify-center"
            >
              Browse Templates
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex justify-center items-center gap-6 pt-8 text-[10px] font-bold text-muted-text uppercase tracking-wider">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Vector Exports</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-cyan" /> Instant Live</span>
            <span className="flex items-center gap-1"><Sliders className="w-4 h-4 text-accent" /> Color Customize</span>
          </div>
        </motion.div>

        {/* Hero instant URL-to-QR widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="boxy mt-16 w-full max-w-sm bg-surface rounded-none p-6 relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col gap-4.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-none bg-accent-dim text-accent border border-border-default flex items-center justify-center">
                <LinkIcon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-primary tracking-tight font-sans">Instant URL to QR Code</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider font-mono">Paste your Web URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={heroUrl}
                  onChange={(e) => setHeroUrl(e.target.value)}
                  placeholder="e.g. https://my-website.com"
                  className="flex-1 h-9 px-3 text-xs border border-border-default rounded-none focus:outline-none focus:border-accent font-medium text-primary bg-surface-2 font-mono"
                />
                {heroUrl && (
                  <button
                    onClick={() => setHeroUrl('')}
                    className="h-9 px-2 text-[10px] font-bold border border-border-default rounded-none hover:bg-surface-2/80 cursor-pointer text-muted-text bg-surface"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-border-default pt-4.5 flex flex-col items-center min-h-[220px] justify-center">
              {heroUrl.trim() ? (
                <div className="p-4 bg-white border border-border-default rounded-none">
                  <QRGenerator value={heroUrl.trim()} size={160} showDownloads={true} />
                </div>
              ) : (
                <div className="flex flex-col items-center text-center text-muted-text/40 gap-3 py-6">
                  <div className="w-14 h-14 rounded-none border border-dashed border-border-default flex items-center justify-center bg-surface-2">
                    <QrCode className="w-6 h-6 text-muted-text/50" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-text uppercase block font-mono">QR Code Preview</span>
                    <span className="text-[9px] text-muted-text/80 max-w-[200px] mt-1 block text-center">
                      Enter any link above to generate a downloadable high-resolution code.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Ad Slot 1 */}
      <div className="max-w-7xl mx-auto w-full px-4 mb-16">
        <AdSlot slotId="home-top-banner" />
      </div>

      {/* Templates Grid Section */}
      <section id="templates" className="pt-8 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-12 space-y-2">
          <h2 className="heading-display text-2xl md:text-3xl text-primary">Choose a Template Category</h2>
          <p className="text-xs text-muted-text max-w-md mx-auto">Select from our 20 specialized tools designed for fast execution. Click any card to start.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {TEMPLATE_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.slug}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03, duration: 0.3 }}
              >
                <Link
                  href={`/create/${card.slug}`}
                  className="boxy group relative block bg-surface hover:bg-surface-2 p-5 rounded-none h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-9 h-9 rounded-none bg-surface-2 border border-border-default flex items-center justify-center text-muted-text group-hover:text-accent transition-all">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[8px] font-bold text-cyan bg-cyan/10 px-2 py-0.5 rounded-none uppercase tracking-wider">{card.cat}</span>
                    </div>
                    <h3 className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{card.label}</h3>
                    <p className="text-[10px] text-muted-text mt-1.5 leading-relaxed font-semibold">{card.desc}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-[10px] font-bold text-muted-text group-hover:text-accent transition-colors">
                    <span>Create Free</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How it Works Stepper */}
      <section id="how-it-works" className="py-16 px-4 md:px-8 bg-surface/20 border-y border-border-default w-full">
        <div className="max-w-7xl mx-auto w-full text-center">
          <h2 className="heading-display text-2xl md:text-3xl text-primary mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Fill Content Details', desc: 'Select any of the 20 templates and input website URLs, document uploads, menus, Wi-Fi credentials, or text.' },
              { step: '02', title: 'Customize Layout & QR', desc: 'Choose patterns, modify dots, select gradient colors, and upload branding icons to be embedded in the center.' },
              { step: '03', title: 'Export & Deploy', desc: 'Download high-quality vector print assets in SVG, PDF, PNG, or JPEG formats. Scan and launch instantly.' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="boxy flex flex-col items-center text-center p-6 bg-surface rounded-none relative"
              >
                <span className="heading-display text-3xl text-accent font-mono block mb-4">{item.step}</span>
                <h3 className="text-base font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-[11px] text-muted-text leading-relaxed font-semibold max-w-[240px]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Slot 2 */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <AdSlot slotId="home-mid-banner" />
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 md:px-8 max-w-7xl mx-auto w-full z-10">
        <div className="text-center mb-12 space-y-2">
          <h2 className="heading-display text-2xl md:text-3xl text-primary">Designed for Modern Teams</h2>
          <p className="text-xs text-muted-text">Premium utilities that outperform standard generators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Vector formats', desc: 'Download clean vector files in SVG or print-ready PDF formats that look crisp on signboards, packaging, or brochures.', icon: FileText },
            { title: '100% Free layout', desc: 'CardQR has no subscription fees, scan count caps, hidden shutdowns, or sign-up walls. Simply build, print, and share.', icon: Zap },
            { title: 'Branding embedding', desc: 'Embed your logo in the middle of any code pattern. We support automatic center-clipping so scanners remain operational.', icon: Sparkles },
            { title: 'Redirection scan counts', desc: 'Dynamic template QR codes redirect through our short URL route, tracking scan counts inside Supabase database.', icon: Sliders },
            { title: 'Frosted Glass UI', desc: 'Destination pages look like native app sheets, bypassing messy browser elements on iOS or Android viewports.', icon: Briefcase },
            { title: 'No App downloads', desc: 'Visitors view menus, cards, and portfolios directly in their phone browsers instantly upon scanning.', icon: Globe }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="boxy p-6 bg-surface rounded-none flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-none bg-surface-2 border border-border-default flex items-center justify-center text-accent shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                  <p className="text-[11px] text-muted-text mt-1.5 leading-relaxed font-semibold">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 px-4 md:px-8 max-w-3xl mx-auto w-full z-10">
        <h2 className="heading-display text-2xl md:text-3xl text-primary text-center mb-10">Frequently Asked Questions</h2>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="boxy-sm bg-surface rounded-none overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4.5 text-left flex items-center justify-between text-xs font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-text transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4.5 pb-4.5 text-[11px] text-muted-text leading-relaxed border-t border-border-default pt-3 font-semibold">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bold lime CTA band */}
      <section className="cta-band w-full px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Join thousands of creators</span>
            <h2 className="heading-display text-3xl sm:text-5xl mt-2">Get started today</h2>
          </div>
          <Link
            href="/create/website-url"
            className="boxy h-12 px-8 bg-background text-primary font-bold rounded-none flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Try CardQR free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border-default bg-background py-8 px-4 md:px-8 w-full z-10 text-center font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="CardQR Logo" width={24} height={24} className="rounded-none border border-border-emphasis" />
            <span className="heading-display text-xs text-primary flex items-center gap-0.5">
              Card<span className="text-accent">QR</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-bold text-muted-text uppercase tracking-wider">
            <Link href="/qr-code/website-url" className="hover:text-primary transition-colors">Website URL QR</Link>
            <Link href="/qr-code/restaurant-menu" className="hover:text-primary transition-colors">Menu QR</Link>
            <Link href="/qr-code/business-card" className="hover:text-primary transition-colors">Business QR</Link>
          </div>

          <span className="text-[10px] text-muted-text/60">© 2026 CardQR Team. All scannables reserved.</span>
        </div>
      </footer>
    </div>
  );
}
