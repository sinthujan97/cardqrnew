import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Sparkles, ArrowRight, Check, ChevronRight, HelpCircle } from 'lucide-react';
import SiteNav from '@/components/SiteNav';
import AdSlot from '@/components/AdSlot';

interface SEOContent {
  title: string;
  metaDesc: string;
  heroTitle: string;
  heroSub: string;
  features: string[];
  guide: string[];
  faqs: { q: string; a: string }[];
}

const TEMPLATE_SEO_CONTENT: Record<string, SEOContent> = {
  'website-url': {
    title: "Free Website URL QR Code Generator | CardQR",
    metaDesc: "Generate premium custom styled QR codes for any website URL. 100% free, permanent scans, color customization, and vector SVG/PDF downloads.",
    heroTitle: "Free Website URL QR Code Generator",
    heroSub: "Direct scannable web links with custom logos, patterns, and high-res vector downloads.",
    features: [
      "Custom color gradients & dot designs",
      "Upload corporate logos in the center",
      "Lifetime unlimited scans with zero expiration",
      "Direct vector SVG & print-ready PDF downloads"
    ],
    guide: [
      "Enter your target website URL (e.g. https://mybusiness.com)",
      "Customize dots styling patterns and colors in Step 2",
      "Embed center brand logos if desired",
      "Download high-res PNG, JPEG, SVG or PDF files"
    ],
    faqs: [
      { q: "Do these URL QR codes ever expire?", a: "No. All website URL QR codes created with CardQR have unlimited scans and never expire." },
      { q: "Can I edit the destination URL after printing?", a: "Since static URL codes encode the link details directly, they cannot be edited after printing. Try dynamic cards if you need post-print updates." }
    ]
  },
  'restaurant-menu': {
    title: "Free Restaurant Menu QR Code Generator | CardQR",
    metaDesc: "Create contactless QR menus for restaurants, bars, and cafes. Add categories, prices, items, images, and allergens. 100% free.",
    heroTitle: "Free Contactless QR Menu Generator",
    heroSub: "Build a beautiful digital restaurant menu guests scan to read instantly on their phones. Update prices anytime.",
    features: [
      "Add unlimited menu sections and items",
      "Specify item descriptions, pricing, and photos",
      "Checkboxes for gluten-free, vegan, spicy allergens",
      "Choose visual templates and colors with custom logos"
    ],
    guide: [
      "Provide restaurant details: Name, description, logo and cover photo",
      "Add menu sections (e.g. Appetizers, Mains, Drinks)",
      "Create menu items with description, prices, and allergen tags",
      "Go to Step 2 to customize patterns and download your table stand QR"
    ],
    faqs: [
      { q: "Can I change menu prices after printing table QRs?", a: "Yes! Use your Secret Edit Link to update items, descriptions, or prices anytime, and printed cards update instantly." },
      { q: "Do guests need an app to read the menu?", a: "No. The menu loads directly in their native phone browser window immediately when scanned." }
    ]
  },
  'business-card': {
    title: "Free Digital Business Card QR Code Generator | CardQR",
    metaDesc: "Design professional digital business cards with contact details, company information, social links, and direct vCard downloads. Free.",
    heroTitle: "Free Digital Business Card Generator",
    heroSub: "Share email, WhatsApp, phone numbers, profiles, and enable direct vCard address book downloads with one scan.",
    features: [
      "Digital vCard details auto-downloading",
      "Embed profile photos, job roles, company name",
      "Integrate social link icons",
      "Fully responsive mobile stationery cards"
    ],
    guide: [
      "Input contact card info: Name, position, phone, email, company, and bio",
      "Provide social media usernames/links",
      "Proceed to Step 2 to style your business card QR code",
      "Print on cards, badges, or display on phone screens"
    ],
    faqs: [
      { q: "Can recipients save my contacts directly?", a: "Yes. Scanners get a 'Save Contact' button that auto-downloads the vCard to their address book." },
      { q: "How do I edit my business card details?", a: "Open your Secret Edit Link to update phone numbers or positions instantly without changing the QR code." }
    ]
  },
  'social-media': {
    title: "Free Social Media QR Code Link Hub | CardQR",
    metaDesc: "Generate a central Link-in-Bio hub for all your social profiles. Custom style QR code, colors, logo uploads, and 100% free.",
    heroTitle: "Free Social Media Profile Link Hub",
    heroSub: "Share your Instagram, YouTube, Facebook, LinkedIn, TikTok, and custom links in one scannable dashboard.",
    features: [
      "Include profile photo, custom bio, and links list",
      "Add multiple platform shortcut buttons",
      "Clean layouts designed for mobile devices",
      "Track scan counts directly inside workspace analytics"
    ],
    guide: [
      "Input display name, short bio, and upload profile photo",
      "Add your target social platform links",
      "Style your QR pattern and dots details in Step 2",
      "Share link on bios or print scannable stickers"
    ],
    faqs: [
      { q: "Can I add custom URL links?", a: "Yes, you can add standard social buttons or custom portfolio URL links easily." },
      { q: "Are scan counts tracked?", a: "Yes. Scans go through our redirectional database route to log analytics." }
    ]
  },
  'wifi': {
    title: "Free Wi-Fi Sharing QR Code Generator | CardQR",
    metaDesc: "Create table signs and scannable cards for guest Wi-Fi connection. SSID, security types, password sharing, and vector downloads.",
    heroTitle: "Free Wi-Fi Credentials Sharing Generator",
    heroSub: "Let guests scan to connect to your office or diner Wi-Fi automatically without typing passwords.",
    features: [
      "WPA, WEP, and Open security configurations",
      "Autoconnect support for iOS & Android devices",
      "Printable signage downloads",
      "Completely standalone static encoding"
    ],
    guide: [
      "Provide network name SSID and security configuration",
      "Input connection password",
      "Design patterns and frame colors in Step 2",
      "Print Wi-Fi sign cards and place on tables/counters"
    ],
    faqs: [
      { q: "Is this secure?", a: "Yes, connection details are encoded directly in the QR code following standard Wi-Fi formatting protocols. Password data is not saved in our cloud." }
    ]
  }
};

// Fill in other generic templates to prevent crashes
const GENERIC_SEO_CONTENT = (slug: string): SEOContent => ({
  title: `Free ${slug.replace('-', ' ')} QR Code Generator | CardQR`,
  metaDesc: `Generate custom styled, high-res scannable QR codes for ${slug.replace('-', ' ')}. 100% free, unlimited scans, color presets.`,
  heroTitle: `Free ${slug.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} QR Generator`,
  heroSub: `Create scannable styled QR codes linking to your ${slug.replace('-', ' ')} assets in 60 seconds.`,
  features: [
    "Vector SVG & PDF exports",
    "Unlimited lifetime scans",
    "Logo embedding options",
    "Custom color styling"
  ],
  guide: [
    "Enter details on the left form",
    "Customize dots and shapes in Step 2",
    "Upload custom brand logo files",
    "Download high-res final print assets"
  ],
  faqs: [
    { q: "Does this code expire?", a: "No, all scannable codes generated with CardQR remain functional forever." }
  ]
});

export async function generateStaticParams() {
  const VALID_SLUGS = [
    'website-url', 'restaurant-menu', 'business-card', 'social-media', 'wifi',
    'pdf', 'images', 'video', 'simple-text', 'facebook-page', 'app-download',
    'google-review', 'instagram-profile', 'event', 'email', 'sms', 'phone-call',
    'location', 'youtube-channel', 'payment'
  ];
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const content = TEMPLATE_SEO_CONTENT[slug] || GENERIC_SEO_CONTENT(slug);
  
  return {
    title: content.title,
    description: content.metaDesc,
    alternates: {
      canonical: `https://getcardqr.com/qr-code/${slug}`
    },
    openGraph: {
      title: content.title,
      description: content.metaDesc,
      url: `https://getcardqr.com/qr-code/${slug}`,
      images: [{ url: 'https://getcardqr.com/og-image.png', width: 1200, height: 630 }]
    }
  };
}

export default async function SEOTemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const VALID_SLUGS = [
    'website-url', 'restaurant-menu', 'business-card', 'social-media', 'wifi',
    'pdf', 'images', 'video', 'simple-text', 'facebook-page', 'app-download',
    'google-review', 'instagram-profile', 'event', 'email', 'sms', 'phone-call',
    'location', 'youtube-channel', 'payment'
  ];

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  const content = TEMPLATE_SEO_CONTENT[slug] || GENERIC_SEO_CONTENT(slug);

  // Generate FAQ schema markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <SiteNav />

      {/* Hero section */}
      <section className="relative pt-16 pb-12 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12 z-10">
        <div className="flex-1 space-y-6 text-left">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-none border border-accent/30">
            Professional Styled QR
          </span>

          <h1 className="heading-display text-3xl sm:text-5xl text-primary leading-[0.98]">
            {content.heroTitle}
          </h1>

          <p className="text-xs md:text-sm text-muted-text leading-relaxed max-w-lg">
            {content.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/create/${slug}`}
              className="boxy h-11 px-6 bg-accent hover:brightness-105 text-accent-foreground text-xs font-bold rounded-none flex items-center justify-center gap-1.5"
            >
              <span>Generate Free {slug.replace('-', ' ').toUpperCase()} QR</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hero Features Panel (Bento right column) */}
        <div className="boxy w-full md:w-[400px] bg-surface rounded-none p-6 space-y-4 shrink-0">
          <span className="text-[10px] font-bold text-cyan uppercase tracking-widest block">Features & Assets</span>
          <div className="space-y-3">
            {content.features.map((feat, idx) => (
              <div key={idx} className="flex gap-2.5 items-start">
                <div className="w-4.5 h-4.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-xs text-muted-text font-semibold">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Slot 4 (Mid content) */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <AdSlot slotId="seo-mid-banner" />
      </div>

      {/* How to Guide / Steps */}
      <section className="py-12 px-4 md:px-8 bg-surface/20 border-y border-border-default w-full">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="heading-display text-xl md:text-2xl text-primary text-center mb-10">Step-by-Step Guide</h2>

          <div className="space-y-4">
            {content.guide.map((step, idx) => (
              <div key={idx} className="boxy-sm flex gap-4 p-4 bg-surface rounded-none">
                <span className="text-lg font-mono font-bold text-accent">0{idx + 1}</span>
                <div>
                  <h3 className="text-xs font-bold text-primary mb-0.5">Step {idx + 1}</h3>
                  <p className="text-[11px] text-muted-text font-semibold leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="py-12 px-4 md:px-8 max-w-3xl mx-auto w-full">
        <h2 className="heading-display text-xl md:text-2xl text-primary text-center mb-8">FAQs</h2>

        <div className="space-y-3">
          {content.faqs.map((faq, idx) => (
            <div key={idx} className="boxy-sm bg-surface rounded-none p-4.5">
              <h3 className="text-xs font-bold text-primary flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-accent" /> {faq.q}
              </h3>
              <p className="text-[11px] text-muted-text mt-2.5 leading-relaxed font-semibold pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Templates Grid */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <h2 className="heading-display text-lg text-primary mb-6 border-l-2 border-accent pl-3">Explore Related QR Templates</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VALID_SLUGS.filter(s => s !== slug).slice(0, 4).map((rel) => (
            <Link
              key={rel}
              href={`/qr-code/${rel}`}
              className="boxy-sm p-4 bg-surface hover:bg-accent hover:text-accent-foreground rounded-none flex items-center justify-between text-xs font-bold text-primary group"
            >
              <span className="capitalize">{rel.replace('-', ' ')} QR</span>
              <ChevronRight className="w-4 h-4 text-muted-text group-hover:text-accent-foreground transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Ad Slot 5 (Bottom) */}
      <div className="max-w-7xl mx-auto w-full px-4 py-8">
        <AdSlot slotId="seo-bottom-banner" />
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-border-default bg-background py-8 px-4 md:px-8 w-full text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-text">
          <span className="heading-display text-primary">CardQR Creator</span>
          <div className="flex gap-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/create/website-url" className="hover:text-primary">Workspace</Link>
          </div>
          <span>© 2026 CardQR</span>
        </div>
      </footer>
    </div>
  );
}
