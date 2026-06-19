'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Utensils, Calendar, Link2, Wifi, ShoppingBag, 
  ArrowRight, ShieldCheck, RefreshCw, Zap, Sliders, Check, 
  ChevronDown, User, Coffee, Star, Play, Sparkles, Smartphone, QrCode
} from 'lucide-react';
import PhoneMockup from '@/components/PhoneMockup';

// Testimonials data
const TESTIMONIALS = [
  {
    quote: "We printed CardQR codes on all our tables. Customers just scan to see our full lunch menu. No slow loading times, no PDF pinch-to-zoom, and updating pricing takes 10 seconds.",
    author: "Marco Rinaldi",
    role: "Owner, Gusto Bistro",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=100&h=100",
    rating: 5,
    tag: "Restaurant Menu"
  },
  {
    quote: "At networking conferences, I don't carry paper business cards anymore. I show people my phone's lock screen QR. They scan, and my profile card slides up immediately with a 'Save Contact' button.",
    author: "Sarah Jenkins",
    role: "Freelance Brand Architect",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
    rating: 5,
    tag: "Business Card"
  },
  {
    quote: "Setting up a gallery vernissage used to mean compiling RSVPs manually via emails. Now, the event QR code handles invitations and registers guests directly in the mobile sheet. Beautifully seamless.",
    author: "Julian Vance",
    role: "Lead Curator, District 4 Art",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
    rating: 5,
    tag: "Event Card"
  },
  {
    quote: "Our guest house visitors love the WiFi cards. They copy the WPA credentials with one tap. No more reading handwritten whiteboard characters or typing long passwords.",
    author: "Anna Kovalenko",
    role: "Host, Pinecrest Cabins",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
    rating: 5,
    tag: "WiFi Sharing"
  }
];

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

// Core template preview data (Simplified mockup content)
const MOCK_TEMPLATES = [
  {
    id: 'business',
    title: 'Business Card',
    description: 'Photo, job title, contact links, and Save Contact vCard.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    fields: ['Charlotte Dubois', 'Studio Arcs', 'Save Contact'],
    icon: Briefcase
  },
  {
    id: 'menu',
    title: 'Restaurant Menu',
    description: 'Visual categories, items list, prices, and food details.',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=120&h=120',
    fields: ['Truffle Arancini - $14', 'Burrata & Tomato - $16', 'Contemporary Italian'],
    icon: Utensils
  },
  {
    id: 'event',
    title: 'Event Card',
    description: 'Calendar details, maps, agenda description, and RSVP signup.',
    avatar: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=120&h=120',
    fields: ['Gallery Vernissage', 'July 24, 7:00 PM', 'Confirm RSVP Form'],
    icon: Calendar
  },
  {
    id: 'link',
    title: 'Link Hub',
    description: 'Premium alternative to bio-links. Highlight custom URLs.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    fields: ['Latest Exhibition', 'Figma Library', 'Read Articles'],
    icon: Link2
  },
  {
    id: 'wifi',
    title: 'WiFi Sharing',
    description: 'Secure credentials card with instant click-to-copy button.',
    avatar: '',
    fields: ['StudioArcs_Guest_5G', 'Copy Password', 'Auto-WPA Setup'],
    icon: Wifi
  },
  {
    id: 'catalog',
    title: 'Product Catalog',
    description: 'Grid cards with photos, prices, and WhatsApp order checkout.',
    avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=120&h=120',
    fields: ['Chroma Print - $120', 'Space Print - $160', 'Direct Whatsapp Order'],
    icon: ShoppingBag
  }
];

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Hero Animation Loop State
  const [heroCardStep, setHeroCardStep] = useState<'scan' | 'sheet'>('scan');
  
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroCardStep(prev => prev === 'scan' ? 'sheet' : 'scan');
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Simulator Section State
  const [simTemplate, setSimTemplate] = useState<'menu' | 'business' | 'event'>('menu');
  const [simScanned, setSimScanned] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col flex-1 bg-[#FAFAFA] font-sans selection:bg-accent selection:text-white">
      
      {/* Sticky Premium Navbar */}
      <nav className="h-16 px-6 bg-white/70 backdrop-blur-md border-b border-black/5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-base font-black tracking-tight text-primary flex items-center gap-1.5">
            Card<span className="text-muted-text font-medium">QR</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#templates" className="text-xs font-bold text-muted-text hover:text-primary transition-all">Templates</a>
            <a href="#how-it-works" className="text-xs font-bold text-muted-text hover:text-primary transition-all">How It Works</a>
            <a href="#features" className="text-xs font-bold text-muted-text hover:text-primary transition-all">Features</a>
            <a href="#pricing" className="text-xs font-bold text-muted-text hover:text-primary transition-all">Pricing</a>
          </div>
        </div>
        
        <div>
          <Link 
            href="/create"
            className="h-9 px-4.5 bg-primary hover:bg-accent text-white text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs"
          >
            Create Free Card
          </Link>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Info Column */}
        <div className="flex-1 max-w-xl text-center md:text-left">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full text-[10px] font-bold text-primary mb-5 uppercase tracking-wide">
            <Sparkles className="w-3 h-3 text-primary" /> Create a beautiful QR destination in 60 seconds
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-primary tracking-tight leading-[1.08] font-heading">
            Turn Any QR Code Into a Branded Experience
          </h1>
          
          <p className="text-xs md:text-sm text-muted-text leading-relaxed mt-5 max-w-md mx-auto md:mx-0">
            Create digital business cards, menus, event pages, WiFi cards, and link hubs in under a minute. Generate a QR code that opens a beautiful mobile experience instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 mt-8">
            <Link 
              href="/create"
              className="h-11 w-full sm:w-auto px-6 bg-primary hover:bg-accent text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              Create Free Card <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#simulator"
              className="h-11 w-full sm:w-auto px-6 border border-black/10 hover:bg-[#F4F4F5] text-primary text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-primary text-primary" /> Watch Live Scan
            </a>
          </div>
        </div>

        {/* Right Visual Column (Interactive loop) */}
        <div className="flex-1 flex items-center justify-center w-full relative">
          <div className="absolute inset-0 bg-[#FAFAFA] bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-12 z-10 w-full max-w-[500px]">
            
            {/* Scanning QR visual card */}
            <div className="bg-white p-4.5 rounded-2xl border border-black/5 card-shadow flex flex-col items-center gap-3 shrink-0">
              <span className="text-[9px] font-extrabold tracking-wider text-muted-text uppercase">Scan to Preview</span>
              <div className="w-36 h-36 border border-black/5 rounded-xl flex items-center justify-center p-2.5 relative overflow-hidden bg-white">
                <QrCode className="w-full h-full text-primary" />
                {/* Simulated scan line */}
                <motion.div 
                  className="absolute left-0 w-full h-0.5 bg-success/80 shadow-md"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
                />
              </div>
              <span className="text-[10px] font-bold text-primary mt-1">Gusto Bistro Lunch Menu</span>
            </div>

            {/* Mobile Mockup with Sheet Slideup */}
            <div className="w-full max-w-[280px]">
              <PhoneMockup animate={false}>
                <div className="w-full h-full flex flex-col bg-[#FAFAFA] relative overflow-hidden">
                  
                  {/* Backdrop placeholder before scan */}
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-300">
                    <Smartphone className="w-12 h-12 stroke-[1] mb-2 text-zinc-200 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">Awaiting QR scan...</span>
                  </div>

                  {/* Slide up sheet simulating Apple Pay / Wallet sheet */}
                  <AnimatePresence>
                    {heroCardStep === 'sheet' && (
                      <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 120, damping: 16 }}
                        className="absolute inset-0 bg-white flex flex-col z-20 overflow-hidden"
                      >
                        {/* Drag indicator */}
                        <div className="w-full flex justify-center py-2 shrink-0">
                          <div className="w-10 h-1 bg-zinc-200 rounded-full" />
                        </div>
                        
                        {/* Interactive mini menu layout inside mockup */}
                        <div className="relative w-full h-24 bg-[#E4E4E7] overflow-hidden shrink-0">
                          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=300&h=150" alt="Cover" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        
                        <div className="px-4 -mt-6 flex items-end gap-2 relative z-10 shrink-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white bg-white">
                            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=60&h=60" alt="Logo" className="w-full h-full object-cover" />
                          </div>
                          <div className="pb-0.5">
                            <h4 className="text-[11px] font-bold text-white tracking-tight drop-shadow-sm">Gusto Bistro</h4>
                          </div>
                        </div>

                        <div className="flex-1 px-4 py-3 overflow-y-auto no-scrollbar flex flex-col gap-2">
                          <div className="p-2 border border-black/5 rounded-lg flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-bold text-primary">Truffle Arancini</div>
                              <div className="text-[8px] text-muted-text">Mushroom, black truffle, house aioli</div>
                            </div>
                            <span className="text-[10px] font-bold text-primary">$14.00</span>
                          </div>
                          
                          <div className="p-2 border border-black/5 rounded-lg flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-bold text-primary">Burrata & Heirloom</div>
                              <div className="text-[8px] text-muted-text">burrata, basil oil, grilled sourdough</div>
                            </div>
                            <span className="text-[10px] font-bold text-primary">$16.50</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </PhoneMockup>
            </div>

          </div>
        </div>

      </section>

      {/* 2. TEMPLATE SHOWCASE */}
      <section id="templates" className="px-6 py-20 bg-white border-t border-b border-black/5 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight font-heading">6 Core Templates to Cover Any Idea</h2>
            <p className="text-xs text-muted-text mt-2.5">
              Choose your profile style, fill details, and get your QR code instantly. No manual coding or website builder layout dragging needed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {MOCK_TEMPLATES.map((tpl) => {
              const Icon = tpl.icon;
              return (
                <Link 
                  href={`/create?t=${tpl.id}`}
                  key={tpl.id}
                  className="group block bg-[#FAFAFA] p-5.5 rounded-2xl border border-black/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 card-shadow cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-primary tracking-tight">{tpl.title}</h3>
                      <p className="text-[10px] text-muted-text leading-tight mt-0.5">{tpl.description}</p>
                    </div>
                  </div>

                  {/* Animated card fields list mockup inside page */}
                  <div className="mt-4.5 bg-white p-3 rounded-xl border border-black/5 flex flex-col gap-2 transition-all">
                    {tpl.fields.map((field, fIdx) => (
                      <div key={fIdx} className="h-6.5 px-2 bg-muted-bg/50 rounded-md flex items-center justify-between text-[9px] font-bold text-primary">
                        <span>{field}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-[#10B981] transition-all" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-muted-text group-hover:text-primary transition-all">
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="px-6 py-20 w-full max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight font-heading">Create and Deploy in Seconds</h2>
          <p className="text-xs text-muted-text mt-2.5">
            CardQR streamlines publication into 4 linear steps. No accounts required to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          
          {[
            {
              step: 'Step 1',
              title: 'Choose template',
              desc: 'Select from 6 beautiful target profiles built specifically for restaurants, networking, events, or local stores.'
            },
            {
              step: 'Step 2',
              title: 'Fill in your info',
              desc: 'Type your contact handles, upload items, dates, network names, or banner screens. Changes reflect live.'
            },
            {
              step: 'Step 3',
              title: 'Generate QR instantly',
              desc: 'Our engine processes details and renders print-ready, high-resolution vector SVG or PNG files.'
            },
            {
              step: 'Step 4',
              title: 'Print and share',
              desc: 'Place the QR code on tables, business card backs, or flyers. Update the details anytime online.'
            }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col bg-white p-5 rounded-2xl border border-black/5 card-shadow relative">
              <div className="absolute top-4 right-4 text-[10px] font-extrabold text-primary/10 select-none">0{idx + 1}</div>
              <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary text-xs font-black flex items-center justify-center mb-4">{item.step}</div>
              <h3 className="text-xs font-bold text-primary tracking-tight">{item.title}</h3>
              <p className="text-[11px] text-muted-text leading-relaxed mt-2">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* 4. QR EXPERIENCE SIMULATOR */}
      <section id="simulator" className="px-6 py-20 bg-white border-t border-b border-black/5 w-full">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          
          {/* Info column */}
          <div>
            <div className="inline-block px-3 py-1 bg-[#10B981]/10 rounded-full text-[10px] font-bold text-success mb-4.5 uppercase tracking-wide">
              The Centerpiece Scan
            </div>
            
            <h2 className="text-2xl md:text-4xl font-black text-primary tracking-tight font-heading leading-tight">
              Not a Website.<br />An Experience.
            </h2>
            
            <p className="text-xs md:text-sm text-muted-text leading-relaxed mt-4 max-w-md">
              TapQR cards remove browser headers, URL navigation bars, and typical website clutter. They load inside a mobile browser but look and feel exactly like a premium native Apple Wallet or Pay sheet.
            </p>

            {/* Interactive simulator controls */}
            <div className="mt-8 flex flex-col gap-3.5 max-w-sm">
              <span className="text-[10px] font-extrabold text-muted-text uppercase tracking-wider">Choose Card to Scan:</span>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'menu', label: 'Bistro Menu', icon: Utensils },
                  { id: 'business', label: 'Designer ID', icon: Briefcase },
                  { id: 'event', label: 'Vernissage', icon: Calendar }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSimTemplate(item.id as any);
                      setSimScanned(false);
                    }}
                    className={`h-9 px-2.5 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                      simTemplate === item.id 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-black/5 hover:bg-zinc-100 text-primary/80'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSimScanned(true)}
                disabled={simScanned}
                className="w-full h-11 bg-[#10B981] hover:bg-[#0da471] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4" /> {simScanned ? 'Card Loaded' : 'Trigger Scanner Scan'}
              </button>
            </div>
          </div>

          {/* Device Mockup Column */}
          <div className="flex justify-center relative">
            <PhoneMockup animate={false}>
              <div className="w-full h-full flex flex-col bg-[#FAFAFA] relative overflow-hidden">
                
                {/* Default placeholder camera view */}
                {!simScanned ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-zinc-900 text-white/40">
                    <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center mb-4 relative">
                      <QrCode className="w-8 h-8 text-white/50" />
                      {/* Scanning crosshairs */}
                      <div className="absolute -top-1.5 -left-1.5 w-4.5 h-4.5 border-t-2 border-l-2 border-success" />
                      <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 border-t-2 border-r-2 border-success" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-4.5 h-4.5 border-b-2 border-l-2 border-success" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-4.5 h-4.5 border-b-2 border-r-2 border-success" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">Scan the QR code</span>
                    <p className="text-[9px] text-zinc-500 mt-1.5 px-4 leading-normal">Tap "Trigger Scanner Scan" above to view app sheet</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col bg-white overflow-hidden relative">
                    
                    {/* Simulated native app sheet top drag indicator */}
                    <div className="w-full flex justify-center py-2 shrink-0 bg-white">
                      <div className="w-10 h-1 bg-zinc-200 rounded-full" />
                    </div>

                    {/* Specific rendering inside preview */}
                    {simTemplate === 'menu' && (
                      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                        <div className="relative w-full h-24 bg-zinc-100 shrink-0">
                          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=300&h=150" alt="Cover" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="text-xs font-bold text-primary">Gusto Bistro</h3>
                          <div className="mt-3 flex flex-col gap-2.5">
                            <div className="p-2 border border-black/5 rounded-lg flex items-center justify-between text-[10px]">
                              <span className="font-bold">Truffle Arancini</span>
                              <span className="font-bold">$14.00</span>
                            </div>
                            <div className="p-2 border border-black/5 rounded-lg flex items-center justify-between text-[10px]">
                              <span className="font-bold">Seared Wild Salmon</span>
                              <span className="font-bold">$34.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {simTemplate === 'business' && (
                      <div className="flex-1 flex flex-col items-center p-4 overflow-y-auto no-scrollbar">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md mb-3" />
                        <h3 className="text-xs font-bold text-primary">Charlotte Dubois</h3>
                        <p className="text-[9px] text-muted-text">Principal Designer at Studio Arcs</p>
                        
                        <div className="w-full grid grid-cols-3 gap-2 mt-4 text-[9px] font-bold">
                          <div className="p-2 bg-[#F4F4F5] rounded-lg text-center">Call</div>
                          <div className="p-2 bg-[#F4F4F5] rounded-lg text-center">Email</div>
                          <div className="p-2 bg-primary text-white rounded-lg text-center">Save ID</div>
                        </div>
                      </div>
                    )}

                    {simTemplate === 'event' && (
                      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
                        <div className="relative w-full h-24 bg-zinc-100 shrink-0">
                          <img src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=300&h=150" alt="Cover" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="text-xs font-bold text-primary">Gallery Vernissage</h3>
                          <p className="text-[9px] text-muted-text mt-1">July 24, 7:00 PM • Studio Arcs Gallery</p>
                          <div className="mt-4 p-3 bg-muted-bg rounded-lg text-center text-[10px] font-bold border border-black/5 text-primary">
                            RSVP Registered (Simulated)
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reset Button */}
                    <button
                      onClick={() => setSimScanned(false)}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-[8px] font-bold rounded-full cursor-pointer"
                    >
                      Reset Scanner
                    </button>

                  </div>
                )}

              </div>
            </PhoneMockup>
          </div>

        </div>
      </section>

      {/* 5. FEATURES GRID SECTION */}
      <section id="features" className="px-6 py-20 w-full max-w-7xl mx-auto select-none">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight font-heading">Engineered for Fast Real-World Use</h2>
          <p className="text-xs text-muted-text mt-2.5">
            CardQR handles the hosting, files, QR compiling, and rendering details. You just input info.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div key={idx} className="bg-white p-5 rounded-2xl border border-black/5 card-shadow flex flex-col justify-between">
              <div>
                <div className="w-8.5 h-8.5 rounded-lg bg-primary/5 text-primary flex items-center justify-center mb-4">
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs font-bold text-primary tracking-tight">{item.title}</h3>
                <p className="text-[11px] text-muted-text leading-relaxed mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="px-6 py-20 bg-white border-t border-b border-black/5 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight font-heading">Sane, Predictable Pricing</h2>
            <p className="text-xs text-muted-text mt-2.5">Start free without a credit card. Upgrade for branding controls.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto w-full">
            
            {/* Free Plan */}
            <div className="bg-[#FAFAFA] p-6.5 rounded-3xl border border-black/5 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider text-muted-text uppercase">Free Plan</span>
                <div className="flex items-baseline gap-1 mt-3 mb-4">
                  <span className="text-3xl font-black text-primary tracking-tight">$0</span>
                  <span className="text-xs text-muted-text">forever</span>
                </div>
                <p className="text-xs text-muted-text leading-relaxed">Perfect for personal cards, home WiFi networks, or small single-event RSVPs.</p>
                
                <ul className="flex flex-col gap-2.5 mt-6 border-t border-black/5 pt-5">
                  {['1 Active Card', 'Standard QR Code Files (PNG)', 'Unlimited Scans', 'Satoshi Typography', 'Basic Templates'].map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-primary font-medium">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                href="/create"
                className="w-full h-10 border border-black/15 hover:bg-[#F4F4F5] rounded-xl flex items-center justify-center text-xs font-bold text-primary transition-all mt-8 cursor-pointer"
              >
                Create Free Card
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#FAFAFA] p-6.5 rounded-3xl border border-primary/20 flex flex-col justify-between shadow-sm relative overflow-hidden bg-white">
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 bg-primary text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Popular</div>
              
              <div>
                <span className="text-[10px] font-extrabold tracking-wider text-primary uppercase">Pro Plan</span>
                <div className="flex items-baseline gap-1 mt-3 mb-4">
                  <span className="text-3xl font-black text-primary tracking-tight">$8</span>
                  <span className="text-xs text-muted-text">/ month</span>
                </div>
                <p className="text-xs text-muted-text leading-relaxed">Designed for restaurants, real estate, design agencies, and commercial stores.</p>
                
                <ul className="flex flex-col gap-2.5 mt-6 border-t border-black/5 pt-5">
                  {['Unlimited Active Cards', 'Vector SVG + High-Res PNG downloads', 'Custom Branding (Remove Badge)', 'Analytics and Scan Counters', 'Custom Themes & Fonts (Clash Display)', 'Dynamic QR redirects'].map((f, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-xs text-primary font-medium">
                      <Check className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                href="/create"
                className="w-full h-10 bg-primary hover:bg-accent text-white rounded-xl flex items-center justify-center text-xs font-bold transition-all mt-8 shadow-xs cursor-pointer"
              >
                Upgrade to Pro
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="px-6 py-20 w-full max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight font-heading">Loved by Small Business Owners</h2>
          <p className="text-xs text-muted-text mt-2.5">Here is how individuals and stores use CardQR to optimize transactions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-black/5 card-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-4">
                  {[...Array(t.rating)].map((_, rIdx) => (
                    <Star key={rIdx} className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-primary/95 leading-relaxed font-medium">"{t.quote}"</p>
              </div>
              
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-black/5">
                <img src={t.avatar} alt={t.author} className="w-9 h-9 rounded-full object-cover border border-black/5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-primary">{t.author}</h4>
                  <p className="text-[10px] text-muted-text leading-tight mt-0.5">{t.role}</p>
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 bg-primary/5 text-primary rounded-md shrink-0">
                  {t.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="px-6 py-20 bg-white border-t border-black/5 w-full">
        <div className="max-w-2xl mx-auto w-full">
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight font-heading">Frequently Asked Questions</h2>
            <p className="text-xs text-muted-text mt-2.5">Clear responses to common workflow questions.</p>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-black/5 rounded-2xl overflow-hidden bg-[#FAFAFA] shadow-2xs">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left transition-all hover:bg-zinc-100 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-primary">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-text transition-all ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-muted-text leading-relaxed font-medium">
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
      <footer className="py-12 px-6 border-t border-black/5 text-center text-[11px] text-muted-text bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-primary text-xs">CardQR</span>
            <span>© 2026 CardQR Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-all font-semibold">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-all font-semibold">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-all font-semibold">Contact Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
