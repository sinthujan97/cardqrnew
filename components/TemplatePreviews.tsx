'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, Mail, MessageSquare, MapPin, Clock, Wifi, Copy, Check, 
  ChevronRight, Share2, Plus, Minus, ShoppingBag, Eye, EyeOff, 
  Globe, ExternalLink, 
  Star, Shield, Send, Sparkles, ArrowRight
} from 'lucide-react';
import QRCode from 'qrcode';
import { 
  BusinessCardData, RestaurantMenuData, EventCardData, 
  LinkCardData, WiFiCardData, ProductCatalogData 
} from '@/lib/templates';
import { submitRsvpAction } from '@/app/actions/card-actions';

// Custom SVG for Twitter (X logo)
const TwitterIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Custom SVG for YouTube
const YoutubeIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.86.508 9.388.508 9.388.508s7.528 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Custom SVG for Instagram
const InstagramIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

// Custom SVG for LinkedIn
const LinkedinIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

// Custom SVG for GitHub
const GithubIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

// A tiny, clean QR code canvas component for card corners
function CardCornerQR({ value, size = 40, dark = true }: { value: string; size?: number; dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 1,
        color: {
          dark: dark ? '#FFFFFF' : '#111111',
          light: dark ? '#00000000' : '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      },
      (error) => {
        if (error) console.error('Error generating corner QR:', error);
      }
    );
  }, [value, size, dark]);

  return (
    <div className="rounded-md overflow-hidden bg-white/5 p-0.5 border border-white/10 shrink-0 shadow-sm">
      <canvas ref={canvasRef} style={{ width: size, height: size }} />
    </div>
  );
}

// Event Countdown Timer Component
function EventCountdown({ eventDate }: { eventDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(eventDate).getTime();
    if (isNaN(target)) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <div className="grid grid-cols-4 gap-1.5 text-center mt-3 shrink-0">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-black/30 border border-white/5 rounded-lg py-1 px-0.5 flex flex-col items-center">
          <span className="text-xs font-black font-mono text-white leading-tight">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-[6.5px] text-white/40 uppercase tracking-wider font-sans mt-0.5">{unit}</span>
        </div>
      ))}
    </div>
  );
}

// -------------------------------------------------------------
// 1. BUSINESS PREVIEW
// -------------------------------------------------------------
export function BusinessPreview({ data, slug = '' }: { data: BusinessCardData; slug?: string }) {
  const qrValue = typeof window !== 'undefined' 
    ? `${window.location.origin}/c/${slug || 'preview'}` 
    : `https://cardqr.com/c/${slug || 'preview'}`;

  // Helper for Lucide icons mapping
  const getSocialIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'instagram': return <InstagramIcon className="w-3.5 h-3.5" />;
      case 'linkedin': return <LinkedinIcon className="w-3.5 h-3.5" />;
      case 'twitter': return <TwitterIcon className="w-3.5 h-3.5" />;
      case 'github': return <GithubIcon className="w-3.5 h-3.5" />;
      case 'youtube': return <YoutubeIcon className="w-3.5 h-3.5" />;
      default: return <Globe className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#1a1a2e] text-white p-5 select-none relative overflow-hidden font-sans">
      {/* Matte Dark Texture & Light Reflection */}
      <div className="absolute inset-0 bg-[#1a1a2e] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />
      
      {/* Top Company / Logo Row */}
      <div className="flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#BF953F]" />
          <span className="text-[10px] font-bold tracking-widest text-[#FCF6BA] uppercase">Studio Arcs</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Globe className="w-3 h-3 text-[#FCF6BA]" />
        </div>
      </div>

      {/* Gold Divider Line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[#BF953F]/40 to-transparent my-4 z-10 shrink-0" />

      {/* Main Body */}
      <div className="flex-1 flex flex-col justify-center items-center text-center z-10 min-h-0 overflow-y-auto no-scrollbar py-2">
        {/* Avatar Profile Image */}
        {data.photo && (
          <div 
            className="w-20 h-20 rounded-full overflow-hidden border-2 mb-3.5 shadow-md shrink-0 transition-transform duration-75 ease-out"
            style={{
              borderColor: '#BF953F',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transform: 'translateZ(20px) translateX(calc(var(--tilt-y) * -1.5px)) translateY(calc(var(--tilt-x) * -1.5px))',
            }}
          >
            <img src={data.photo} alt={data.name} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Name with Gold Foil Shimmer shifting on tilt */}
        <h1 
          className="text-2xl font-bold tracking-tight font-serif drop-shadow-md py-1 leading-tight select-text"
          style={{
            background: 'linear-gradient(90deg, #BF953F, #FCF6BA, #B38728)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% auto',
            backgroundPosition: 'calc(50% + var(--tilt-y) * 3%) calc(50% + var(--tilt-x) * 3%)',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}
        >
          {data.name || 'Charlotte Dubois'}
        </h1>

        <p className="text-[9.5px] font-bold uppercase tracking-widest text-zinc-400 mt-2">
          {data.position || 'Principal Designer'}
        </p>

        {data.bio && (
          <p className="text-[10.5px] text-zinc-300 font-medium leading-relaxed max-w-xs mt-4 bg-white/5 border border-white/5 px-3 py-2.5 rounded-xl">
            {data.bio}
          </p>
        )}

        {/* Action icons row */}
        <div className="flex gap-4 mt-6">
          {data.phone && (
            <a 
              href={`tel:${data.phone}`}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          {data.email && (
            <a 
              href={`mailto:${data.email}`}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {data.whatsapp && (
            <a 
              href={`https://wa.me/${data.whatsapp.replace(/\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Social Network Row */}
        {data.socials && data.socials.length > 0 && (
          <div className="flex gap-2.5 justify-center mt-5 flex-wrap">
            {data.socials.map((social, idx) => (
              <a 
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-6 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-1.5 text-[9.5px] font-bold text-zinc-300 transition-colors"
              >
                {getSocialIcon(social.label)}
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. RESTAURANT MENU PREVIEW
// -------------------------------------------------------------
export function MenuPreview({ data, slug = '' }: { data: RestaurantMenuData; slug?: string }) {
  const [activeCategory, setActiveCategory] = useState(data.categories?.[0]?.id || '');
  const [featuredDishIndex, setFeaturedDishIndex] = useState(0);
  const [fadeState, setFadeState] = useState(true);

  const qrValue = typeof window !== 'undefined' 
    ? `${window.location.origin}/c/${slug || 'preview'}` 
    : `https://cardqr.com/c/${slug || 'preview'}`;
  
  const currency = data.currency || '$';

  // Get active category structure
  const currentCategory = data.categories?.find(cat => cat.id === activeCategory);
  const categoryDishes = currentCategory?.items || [];
  const featuredDish = categoryDishes[featuredDishIndex] || categoryDishes[0];

  const handleCategoryChange = (catId: string) => {
    setFadeState(false);
    setTimeout(() => {
      setActiveCategory(catId);
      setFeaturedDishIndex(0);
      setFadeState(true);
    }, 150);
  };

  const handleDishChange = (idx: number) => {
    setFadeState(false);
    setTimeout(() => {
      setFeaturedDishIndex(idx);
      setFadeState(true);
    }, 150);
  };

  const getWhatsAppOrderLink = (dishName: string, price: string) => {
    const text = encodeURIComponent(`Hi! I would like to order "${dishName}" (${currency}${price}) from Gusto Bistro.`);
    return `https://wa.me/15550192834?text=${text}`; // Static number or custom configs
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#1C0A00] text-amber-50 select-none p-4 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-radial-gradient(circle_at_top,_rgba(255,107,0,0.03)_0%,_transparent_60%) pointer-events-none" />
      
      {/* Restaurant Header */}
      <div className="flex flex-col items-center text-center shrink-0 z-10">
        <h1 className="text-lg font-black tracking-tight font-serif italic text-amber-500">
          {data.restaurantName || 'Gusto Bistro'}
        </h1>
        <p className="text-[8.5px] text-amber-100/50 mt-0.5 leading-tight truncate max-w-[240px]">
          {data.description || 'Contemporary Culinary Art'}
        </p>
      </div>

      {/* Category Selection Row */}
      <div className="flex gap-1.5 justify-center py-2.5 overflow-x-auto no-scrollbar shrink-0 z-15">
        {data.categories?.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`h-6 px-2.5 text-[8.5px] font-black rounded-full transition-all shrink-0 cursor-pointer ${
                isActive 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-white/5 border border-white/5 text-amber-200/70 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Dish Area (Swaps inline with fade animation) */}
      <div className="flex-1 flex flex-col min-h-0 z-10 py-1.5">
        <div className={`flex-1 flex flex-col justify-between transition-opacity duration-150 ${fadeState ? 'opacity-100' : 'opacity-0'}`}>
          {featuredDish ? (
            <div className="flex-1 flex flex-col justify-center">
              {/* Hero Image */}
              <div className="relative w-full aspect-[16/9] max-h-32 rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0 shadow-md">
                {featuredDish.image ? (
                  <img src={featuredDish.image} alt={featuredDish.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-amber-500/20">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Chef Special Badge */}
                {featuredDish.tags?.includes('recommended') && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-black text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm">
                    Chef Special
                  </div>
                )}
              </div>

              {/* Name & Price */}
              <div className="mt-2.5 flex items-start justify-between shrink-0">
                <h3 className="text-xs font-bold tracking-tight text-white line-clamp-1">{featuredDish.name}</h3>
                <span className="text-xs font-black text-amber-500 shrink-0 ml-4">{currency}{featuredDish.price}</span>
              </div>
              
              <p className="text-[10px] text-amber-100/60 leading-relaxed mt-1 line-clamp-2 shrink-0">
                {featuredDish.description}
              </p>

              {/* Order via WhatsApp Trigger button */}
              <div className="mt-3 shrink-0">
                <a
                  href={getWhatsAppOrderLink(featuredDish.name, featuredDish.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-8.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-0 shadow-lg shadow-amber-900/40"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white text-amber-600" /> Order on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[10px] text-amber-100/30">No items available</div>
          )}
        </div>

        {/* Carousel / Selectors below featured dish */}
        {categoryDishes.length > 1 && (
          <div className="flex gap-1.5 justify-center mt-3 shrink-0 overflow-x-auto no-scrollbar z-15">
            {categoryDishes.map((dish, idx) => (
              <button
                key={dish.id}
                onClick={() => handleDishChange(idx)}
                className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                  featuredDishIndex === idx ? 'bg-amber-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. EVENT CARD PREVIEW
// -------------------------------------------------------------
export function EventPreview({ data, slug = '' }: { data: EventCardData; slug?: string }) {
  const qrValue = typeof window !== 'undefined' 
    ? `${window.location.origin}/c/${slug || 'preview'}` 
    : `https://cardqr.com/c/${slug || 'preview'}`;

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#0d0221] text-pink-50 p-4 select-none relative overflow-hidden font-sans">
      {/* Holographic light gradient background */}
      <div className="absolute inset-0 bg-[#0d0221] bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.03)_0%,_transparent_60%)] pointer-events-none" />
      
      {/* Artwork Banner Top */}
      <div className="relative w-full aspect-[16/8] rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0 shadow-md">
        {data.banner ? (
          <img src={data.banner} alt={data.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-pink-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
        )}
        {/* Holographic Shimmer Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none mix-blend-color-dodge transition-all duration-75"
          style={{
            background: 'linear-gradient(135deg, rgba(255,0,128,0.15) 0%, rgba(0,255,200,0.15) 50%, rgba(128,0,255,0.15) 100%)',
            filter: 'hue-rotate(calc(var(--tilt-y) * 3deg))',
          }}
        />
      </div>

      {/* Main Details Body */}
      <div className="flex-1 flex flex-col min-h-0 py-2.5 justify-between">
        {/* Title */}
        <div className="shrink-0">
          <h1 className="text-sm font-black leading-snug tracking-tight text-white line-clamp-1 select-text">
            {data.title || 'Midsummer Gallery Vernissage'}
          </h1>
          
          {/* Info Details Row */}
          <div className="flex items-center gap-2 mt-1.5 text-[8.5px] text-pink-100/50">
            <Clock className="w-3 h-3 text-[#EC4899]" />
            <span className="truncate">{data.time}</span>
            <span className="text-white/20">•</span>
            <MapPin className="w-3 h-3 text-[#EC4899]" />
            <span className="truncate max-w-[120px]">{data.venue}</span>
          </div>
        </div>

        {/* Live countdown */}
        <EventCountdown eventDate={data.date || 'July 24, 2026'} />

        {/* RSVP/Lineup preview: 3 avatars */}
        <div className="flex items-center gap-2 mt-2 bg-black/20 border border-white/5 p-2 rounded-xl shrink-0">
          <div className="flex -space-x-2.5 overflow-hidden">
            <img className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-[#0d0221]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60&h=60" alt="Lineup" />
            <img className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-[#0d0221]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60&h=60" alt="Lineup" />
            <img className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-[#0d0221]" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=60&h=60" alt="Lineup" />
          </div>
          <span className="text-[8px] font-bold text-zinc-300">Guests & Artist Lineup</span>
        </div>

        {/* Get Tickets CTA */}
        <div className="mt-3.5 shrink-0">
          <button 
            onClick={() => alert('RSVP / Ticket confirmation simulated')}
            className="w-full h-8.5 rounded-lg bg-[#EC4899] hover:bg-pink-500 text-white font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-0 shadow-lg shadow-pink-900/40"
          >
            Get Tickets / RSVP
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. LINK HUB PREVIEW
// -------------------------------------------------------------
export function LinkPreview({ data, slug = '' }: { data: LinkCardData; slug?: string }) {
  const qrValue = typeof window !== 'undefined' 
    ? `${window.location.origin}/c/${slug || 'preview'}` 
    : `https://cardqr.com/c/${slug || 'preview'}`;

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#0f172a] text-teal-50 p-4 select-none relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[#0f172a] bg-[radial-gradient(circle_at_top,_rgba(29,158,117,0.03)_0%,_transparent_60%)] pointer-events-none" />
      
      {/* 3D Parallax Avatar Center-Top */}
      <div className="flex flex-col items-center shrink-0 z-20 mt-2">
        <div 
          className="relative w-18 h-18 rounded-full border-0 select-none transition-transform duration-75 ease-out"
          style={{
            boxShadow: '0 0 0 3px #1D9E75',
            transform: 'translateZ(30px) translateX(calc(var(--tilt-y) * -2px)) translateY(calc(var(--tilt-x) * -2px))',
          }}
        >
          {data.profileImage ? (
            <img src={data.profileImage} alt={data.displayName} className="w-full h-full object-cover rounded-full" />
          ) : (
            <div className="w-full h-full bg-[#1D9E75] text-white flex items-center justify-center text-xl font-black rounded-full font-serif">
              {data.displayName ? data.displayName.charAt(0) : 'C'}
            </div>
          )}
        </div>

        {/* Identity Details */}
        <h1 className="text-sm font-bold tracking-tight text-white mt-3 select-text font-serif">
          {data.displayName || 'Charlotte Dubois'}
        </h1>
        {data.bio && (
          <p className="text-[9px] text-teal-100/50 text-center leading-tight truncate mt-1 max-w-[220px]">
            {data.bio}
          </p>
        )}
      </div>

      {/* Scrollable Links List (max 5 visible, subtle scroll) */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-2 mt-4.5 px-1 pb-10 z-10">
        {data.links?.slice(0, 5).map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 px-3.5 bg-black/25 hover:bg-black/35 hover:border-[#1D9E75] border border-white/5 rounded-xl flex items-center justify-between transition-all shrink-0"
          >
            <div className="flex flex-col justify-center py-1">
              <span className="text-[10.5px] font-bold text-white leading-tight">{link.label}</span>
              {link.secondaryText && (
                <span className="text-[8px] text-teal-200/50 mt-0.5 leading-none">{link.secondaryText}</span>
              )}
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#1D9E75]" />
          </a>
        ))}
      </div>

      {/* Bottom stats and QR row */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-15">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white leading-none font-mono">1.2K</span>
            <span className="text-[7px] text-teal-100/40 uppercase font-sans mt-0.5">Scans</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black text-white leading-none font-mono">820</span>
            <span className="text-[7px] text-teal-100/40 uppercase font-sans mt-0.5">Clips</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. WiFi PREVIEW
// -------------------------------------------------------------
export function WifiPreview({ data }: { data: WiFiCardData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [wifiValue, setWifiValue] = useState('');

  // Generate WPA wifi config schema string
  useEffect(() => {
    const ssid = data.networkName || '';
    const password = data.password || '';
    const sec = data.security === 'none' ? 'nopass' : data.security || 'WPA';
    setWifiValue(`WIFI:S:${ssid};T:${sec};P:${password};;`);
  }, [data]);

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#001F3F] text-blue-50 p-4 select-none relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[#001F3F] bg-[radial-gradient(circle_at_top,_rgba(55,138,221,0.03)_0%,_transparent_60%)] pointer-events-none" />

      {/* Staggered pulsing WiFi Rings */}
      <div className="flex justify-center items-center h-18 shrink-0 mt-2 relative">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 border border-[#378ADD] rounded-full wifi-pulse wifi-ring-1" />
          <div className="absolute inset-0 border border-[#378ADD] rounded-full wifi-pulse wifi-ring-2" />
          <div className="absolute inset-0 border border-[#378ADD] rounded-full wifi-pulse wifi-ring-3" />
          <Wifi className="w-6 h-6 text-[#378ADD] z-10" />
        </div>
      </div>

      {/* Network Name (SSID) */}
      <div className="text-center shrink-0 z-10 mt-1">
        <h1 className="text-sm font-black tracking-tight text-white font-mono uppercase">
          {data.networkName || 'StudioArcs_Guest_5G'}
        </h1>
        <p className="text-[8px] text-blue-100/50 font-bold uppercase tracking-wider mt-0.5">
          Tap QR to connect instantly
        </p>
      </div>

      {/* Password Row + Visibility toggle */}
      <div className="mt-3 px-3 py-1.5 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between shrink-0 z-10">
        <div className="flex flex-col">
          <span className="text-[7px] text-blue-100/40 uppercase font-sans tracking-wide">Network Key</span>
          <span className={`text-[11.5px] font-mono tracking-wider mt-0.5 text-white transition-all duration-300 ${showPassword ? 'blur-none select-all' : 'blur-md select-none'}`}>
            {data.password || 'spaceandchroma'}
          </span>
        </div>
        <button 
          onClick={() => setShowPassword(!showPassword)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#378ADD] cursor-pointer"
        >
          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Center Large QR code (Main CTA) */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 py-2">
        <div className="rounded-2xl bg-white p-2.5 shadow-xl select-none ring-4 ring-[#378ADD]/30 border border-[#378ADD]/50">
          <CardCornerQR value={wifiValue} size={110} dark={false} />
        </div>
      </div>

      {/* Staggered Signal bars + security, share button bottom */}
      <div className="flex items-center justify-between shrink-0 z-10 mt-2 px-1">
        {/* Signal & Security */}
        <div className="flex items-center gap-3">
          {/* Signal Bars */}
          <div className="flex items-end gap-[2px] h-3.5">
            <div className="w-1.5 h-[4px] bg-[#378ADD] rounded-[1px]" />
            <div className="w-1.5 h-[6px] bg-[#378ADD] rounded-[1px]" />
            <div className="w-1.5 h-[9px] bg-[#378ADD] rounded-[1px]" />
            <div className="w-1.5 h-[12px] bg-[#378ADD] rounded-[1px]" />
          </div>
          <span className="text-[7.5px] bg-[#378ADD]/20 text-[#378ADD] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
            {data.security === 'none' ? 'OPEN' : `${data.security || 'WPA2'}`}
          </span>
        </div>

        {/* Share Button */}
        <button 
          onClick={() => navigator.clipboard.writeText(data.password || '')}
          className="h-6 px-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-[8.5px] rounded-lg cursor-pointer border-0 flex items-center gap-1 transition-colors"
        >
          <Copy className="w-3 h-3 text-[#378ADD]" /> Copy Key
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. PRODUCT CATALOG PREVIEW
// -------------------------------------------------------------
export function CatalogPreview({ data, slug = '' }: { data: ProductCatalogData; slug?: string }) {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [accentColor, setLocalAccentColor] = useState('#8B5CF6');
  const [fadeState, setFadeState] = useState(true);

  const qrValue = typeof window !== 'undefined' 
    ? `${window.location.origin}/c/${slug || 'preview'}` 
    : `https://cardqr.com/c/${slug || 'preview'}`;

  const productsList = data.products || [];
  const currentProduct = productsList[featuredIdx] || productsList[0];

  const handleColorClick = (color: string, e: React.MouseEvent) => {
    setLocalAccentColor(color);
    const parentCard = (e.currentTarget as HTMLElement).closest('.interactive-card') as HTMLElement;
    if (parentCard) {
      parentCard.style.setProperty('--accent-color', color);
    }
  };

  const handleProductChange = (idx: number) => {
    setFadeState(false);
    setTimeout(() => {
      setFeaturedIdx(idx);
      setFadeState(true);
    }, 150);
  };

  const getWhatsAppBuyLink = (prodName: string, price: string) => {
    const text = encodeURIComponent(`Hello! I want to buy "${prodName}" for $${price} from your Studio Arcs Print Shop.`);
    return `https://wa.me/${data.contactNumber || '15550192834'}?text=${text}`;
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col bg-[#1a0a2e] text-purple-50 p-4 select-none relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[#1a0a2e] bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.03)_0%,_transparent_60%)] pointer-events-none" />
      
      {/* Brand Header */}
      <div className="flex flex-col items-center shrink-0 z-10">
        <span className="text-[7.5px] font-black uppercase tracking-widest text-[#B38728] leading-none">Studio Arcs</span>
        <h1 className="text-sm font-black tracking-tight text-white font-serif mt-1">
          {data.catalogTitle || 'Limited Prints Shop'}
        </h1>
      </div>

      {/* Main product showcase section */}
      <div className="flex-1 flex flex-col min-h-0 z-10 py-2 justify-between">
        <div className={`flex-1 flex flex-col justify-center transition-opacity duration-150 ${fadeState ? 'opacity-100' : 'opacity-0'}`}>
          {currentProduct ? (
            <div className="flex-1 flex flex-col justify-center">
              {/* Parallax product image hovers above */}
              <div 
                className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0 shadow-md transition-transform duration-75 ease-out"
                style={{
                  transform: 'translateZ(40px) translateX(calc(var(--tilt-y) * -3px)) translateY(calc(var(--tilt-x) * -3px))',
                }}
              >
                {currentProduct.image ? (
                  <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-purple-500/25">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
                
                {/* Stock badge: limited count */}
                <div className="absolute top-2.5 left-2.5 bg-black/60 border border-red-500/30 text-red-400 text-[6.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span>Limited Edition</span>
                </div>
              </div>

              {/* Title & Details */}
              <div className="mt-2.5 flex items-start justify-between shrink-0">
                <h3 className="text-xs font-bold tracking-tight text-white line-clamp-1 select-text font-serif pr-4">
                  {currentProduct.name}
                </h3>
                {/* Shimmer price */}
                <span 
                  className="text-xs font-black shrink-0 text-transparent bg-clip-text shimmer-price bg-gradient-to-r from-[#9F7AEA] via-[#D6BCFA] to-[#9F7AEA]"
                  style={{ textShadow: '0 1px 1px rgba(0,0,0,0.2)' }}
                >
                  ${currentProduct.price}
                </span>
              </div>

              {/* Star ratings */}
              <div className="flex items-center gap-1 mt-1.5 shrink-0">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-[7.5px] text-purple-200/40 font-bold">(48 reviews)</span>
              </div>
              
              {/* Color picker accent pills */}
              <div className="flex gap-2 items-center mt-3 shrink-0">
                <span className="text-[7.5px] text-purple-200/40 font-bold uppercase tracking-wider">Accent</span>
                <div className="flex gap-1.5">
                  {['#8B5CF6', '#EC4899', '#10B981', '#FF6B00'].map((color) => {
                    const isSelected = accentColor === color;
                    return (
                      <button
                        key={color}
                        onClick={(e) => handleColorClick(color, e)}
                        className={`w-3.5 h-3.5 rounded-full border-0 cursor-pointer transition-transform relative ${isSelected ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Buy Now CTA */}
              <div className="mt-3.5 shrink-0">
                <a
                  href={getWhatsAppBuyLink(currentProduct.name, currentProduct.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-8.5 rounded-lg text-white font-black text-[9px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-0 shadow-lg"
                  style={{ 
                    backgroundColor: accentColor,
                    boxShadow: `0 10px 20px ${accentColor}40`
                  }}
                >
                  Buy Now
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[10px] text-purple-100/30">No products available</div>
          )}
        </div>

        {/* Carousel indicator points */}
        {productsList.length > 1 && (
          <div className="flex gap-1.5 justify-center mt-2.5 shrink-0 z-15">
            {productsList.map((prod, idx) => (
              <button
                key={prod.id}
                onClick={() => handleProductChange(idx)}
                className="w-1.5 h-1.5 rounded-full transition-colors cursor-pointer"
                style={{ backgroundColor: featuredIdx === idx ? accentColor : 'rgba(255,255,255,0.1)' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN MULTI-PREVIEW DISPATCHER
// -------------------------------------------------------------
export default function TemplatePreview({ 
  type, 
  data,
  slug = ''
}: { 
  type: 'business' | 'menu' | 'event' | 'link' | 'wifi' | 'catalog';
  data: any;
  slug?: string;
}) {
  switch (type) {
    case 'business':
      return <BusinessPreview data={data as BusinessCardData} slug={slug} />;
    case 'menu':
      return <MenuPreview data={data as RestaurantMenuData} slug={slug} />;
    case 'event':
      return <EventPreview data={data as EventCardData} slug={slug} />;
    case 'link':
      return <LinkPreview data={data as LinkCardData} slug={slug} />;
    case 'wifi':
      return <WifiPreview data={data as WiFiCardData} />;
    case 'catalog':
      return <CatalogPreview data={data as ProductCatalogData} slug={slug} />;
    default:
      return <div className="p-5 text-center text-xs">Invalid template selection</div>;
  }
}
