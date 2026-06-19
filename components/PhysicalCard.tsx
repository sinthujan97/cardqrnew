'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Mail, MessageSquare, UserPlus, MapPin, Clock, 
  Wifi, Copy, Check, ChevronRight, Share2, Plus, Minus, ShoppingBag 
} from 'lucide-react';
import QRCode from 'qrcode';
import { submitRsvpAction } from '@/app/actions/card-actions';

// vCard (vcf) download generator for business card
const downloadVCard = (data: any) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${(data.name || 'User').split(' ').reverse().join(';')}
FN:${data.name || 'User'}
ORG:${data.position || ''}
TEL;TYPE=CELL:${data.phone || ''}
EMAIL;TYPE=PREF,INTERNET:${data.email || ''}
NOTE:${data.bio || ''}
END:VCARD`;
  
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${(data.name || 'card').replace(/\s+/g, '_')}.vcf`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

// Canvas-based client-side QR renderer
function CardQRCode({ value, size = 72 }: { value: string; size?: number }) {
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
          dark: '#111111',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      },
      (error) => {
        if (error) console.error('Error generating QR Code on card:', error);
      }
    );
  }, [value, size]);

  return (
    <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center shrink-0">
      <canvas ref={canvasRef} className="rounded-md" style={{ width: size, height: size }} />
    </div>
  );
}

interface PhysicalCardProps {
  card: {
    templateType: 'business' | 'menu' | 'event' | 'link' | 'wifi' | 'catalog';
    data: any;
    slug: string;
  };
}

export default function PhysicalCard({ card }: PhysicalCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [activeCategory, setActiveCategory] = useState(card.data.categories?.[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [cardUrl, setCardUrl] = useState('');
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenFrontRef = useRef<HTMLDivElement>(null);
  const sheenBackRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  
  const currentRotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  // Resolve card scanned url
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCardUrl(`${window.location.origin}/c/${card.slug}`);
    }
  }, [card.slug]);

  // Mouse tilt tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      const cardCenterX = rect.left + cardWidth / 2;
      const cardCenterY = rect.top + cardHeight / 2;

      // Distance from center (-1 to 1)
      const dx = (e.clientX - cardCenterX) / (window.innerWidth / 2);
      const dy = (e.clientY - cardCenterY) / (window.innerHeight / 2);

      // Max tilt: rotateX: 16deg, rotateY: 16deg
      targetRotation.current = {
        x: -dy * 16,
        y: dx * 16
      };
    };

    const handleMouseLeave = () => {
      targetRotation.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Gyroscope tilt tracking (mobile)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;

      // beta: X tilt (holding angle is typically ~45deg)
      // gamma: Y tilt
      const pitch = Math.min(Math.max(e.beta - 45, -30), 30);
      const roll = Math.min(Math.max(e.gamma, -30), 30);

      targetRotation.current = {
        x: -pitch * 0.45,
        y: roll * 0.45
      };
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  // requestAnimationFrame loop for lerped physics
  useEffect(() => {
    let animId: number;

    const update = () => {
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      const { x, y } = currentRotation.current;
      const rotationAngleY = y + (flipped ? 180 : 0);

      // Apply transformations to ref
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${x}deg) rotateY(${rotationAngleY}deg)`;
      }

      // Specular sheen highlight calculation (moves opposite to tilt direction)
      const sxFront = 50 + y * 2.5;
      const syFront = 50 - x * 2.5;
      if (sheenFrontRef.current) {
        sheenFrontRef.current.style.background = `radial-gradient(circle at ${sxFront}% ${syFront}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`;
      }

      const sxBack = 50 - y * 2.5;
      const syBack = 50 - x * 2.5;
      if (sheenBackRef.current) {
        sheenBackRef.current.style.background = `radial-gradient(circle at ${sxBack}% ${syBack}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`;
      }

      // Backdrop light bloom matching tilt
      const bx = y * 1.5;
      const by = -x * 1.5;
      if (bloomRef.current) {
        bloomRef.current.style.transform = `translate3d(calc(-50% + ${bx}px), calc(-50% + ${by}px), -150px)`;
      }

      // Foil shimmer updates on text gradient position
      const logoTextFront = document.getElementById('foil-text-front');
      if (logoTextFront) {
        logoTextFront.style.backgroundPosition = `${50 + y * 3}% ${50 - x * 3}%`;
      }
      const logoTextBack = document.getElementById('foil-text-back');
      if (logoTextBack) {
        logoTextBack.style.backgroundPosition = `${50 - y * 3}% ${50 - x * 3}%`;
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [flipped]);

  const handleCardClick = (e: React.MouseEvent) => {
    // Avoid flipping when clicking interactive buttons, inputs, links
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('a') || 
      target.closest('input') || 
      target.closest('textarea') || 
      target.closest('select') ||
      target.closest('.no-flip-target')
    ) {
      return;
    }
    setFlipped(!flipped);
  };

  // -------------------------------------------------------------
  // RENDER DYNAMIC CARD CONTENT FACES
  // -------------------------------------------------------------
  
  // 1. Business Card Front/Back
  const renderBusinessFront = () => (
    <div className="w-full h-full p-6 flex flex-col justify-between select-none relative bg-neutral-50 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] bg-[size:16px_16px] text-primary">
      <div className="absolute inset-4 border border-zinc-950/5 rounded-xl pointer-events-none" />
      {/* Top Left: Logo */}
      <div className="flex items-center gap-1.5 z-10">
        <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">
          {card.data.name ? card.data.name.charAt(0) : 'Q'}
        </div>
        <span id="foil-text-front" className="text-[10px] font-black uppercase tracking-widest text-primary font-sans bg-[linear-gradient(135deg,#c0c0c0_0%,#ffffff_25%,#e0e0e0_50%,#b0b0b0_75%,#d8d8d8_100%)] bg-[size:200%_200%] bg-clip-text text-transparent">
          CardQR
        </span>
      </div>

      {/* Center Details */}
      <div className="my-auto z-10">
        <h1 
          className="text-2xl font-serif font-black tracking-tight text-primary leading-tight"
          style={{ textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.8), -0.5px -0.5px 0px rgba(0,0,0,0.15)' }}
        >
          {card.data.name || 'Your Name'}
        </h1>
        <p className="text-[9px] text-muted-text font-bold tracking-widest uppercase mt-1">
          {card.data.position || 'Your Position'}
        </p>
        
        {card.data.bio && (
          <p className="text-[11px] text-primary/70 leading-relaxed mt-4 bg-black/[0.02] border border-black/5 px-3 py-2.5 rounded-xl">
            {card.data.bio}
          </p>
        )}
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-end z-10">
        {/* Social Icons row */}
        <div className="flex gap-2">
          {card.data.phone && (
            <div className="w-6 h-6 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
              <Phone className="w-3 h-3" />
            </div>
          )}
          {card.data.email && (
            <div className="w-6 h-6 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
              <Mail className="w-3 h-3" />
            </div>
          )}
          {card.data.whatsapp && (
            <div className="w-6 h-6 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366]">
              <MessageSquare className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Small QR */}
        {cardUrl && <CardQRCode value={cardUrl} size={54} />}
      </div>
    </div>
  );

  const renderBusinessBack = () => (
    <div className="w-full h-full p-6 flex flex-col justify-between bg-zinc-950 text-white relative">
      <div className="absolute inset-4 border border-white/5 rounded-xl pointer-events-none" />
      {/* Top Center: Monogram */}
      <div className="flex flex-col items-center mt-6 z-10">
        <div className="w-12 h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white font-serif font-black text-xl shadow-inner mb-3">
          {card.data.name ? card.data.name.charAt(0) : 'Q'}
        </div>
        <p className="text-xs font-serif italic text-zinc-400 text-center px-4">
          "Create a beautiful destination in 60 seconds."
        </p>
      </div>

      {/* Center actions */}
      <div className="grid grid-cols-4 gap-2 w-full mt-4 z-10 no-flip-target">
        <a
          href={card.data.phone ? `tel:${card.data.phone}` : '#'}
          className="flex flex-col items-center gap-1 p-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 active:scale-95"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <Phone className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] font-bold text-zinc-300">Call</span>
        </a>
        
        <a
          href={card.data.email ? `mailto:${card.data.email}` : '#'}
          className="flex flex-col items-center gap-1 p-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 active:scale-95"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] font-bold text-zinc-300">Email</span>
        </a>

        <a
          href={card.data.whatsapp ? `https://wa.me/${card.data.whatsapp.replace(/\+/g, '')}` : '#'}
          className="flex flex-col items-center gap-1 p-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 active:scale-95"
        >
          <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] font-bold text-zinc-300">WhatsApp</span>
        </a>

        <button
          onClick={() => downloadVCard(card.data)}
          className="flex flex-col items-center gap-1 p-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 active:scale-95 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
            <UserPlus className="w-3.5 h-3.5" />
          </div>
          <span className="text-[9px] font-bold text-zinc-300">Save</span>
        </button>
      </div>

      {/* Bottom URL */}
      <div className="text-center z-10 mb-2">
        <span id="foil-text-back" className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase bg-[linear-gradient(135deg,#e59866_0%,#f8c471_25%,#fdebd0_50%,#f8c471_75%,#e59866_100%)] bg-[size:200%_200%] bg-clip-text text-transparent">
          {card.slug}.cardqr.me
        </span>
      </div>
    </div>
  );

  // 2. Menu Card Front/Back
  const renderMenuFront = () => (
    <div className="w-full h-full flex flex-col justify-between bg-zinc-900 text-white select-none relative overflow-hidden">
      {/* Cover background */}
      <div className="absolute inset-0 z-0 opacity-40">
        {card.data.coverImage ? (
          <img src={card.data.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-zinc-900" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between flex-1 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-white/10 flex-shrink-0">
            {card.data.logo ? (
              <img src={card.data.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/20 text-white flex items-center justify-center font-bold text-xs">M</div>
            )}
          </div>
          <h2 className="text-sm font-bold tracking-tight text-white">{card.data.restaurantName || 'Restaurant Name'}</h2>
        </div>

        <div className="text-center py-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Menu Destination
          </span>
          <h1 className="text-3xl font-serif font-black tracking-tight mt-3 text-white leading-tight">
            Gourmet Collection
          </h1>
          <p className="text-[11px] text-zinc-400 mt-2 px-6 line-clamp-2">
            {card.data.description || 'View our chef-selected organic courses.'}
          </p>
        </div>

        {/* Swipe indicator */}
        <div className="flex flex-col items-center gap-2.5 z-10 no-flip-target">
          <div className="w-full overflow-x-auto no-scrollbar flex gap-2 justify-center py-1">
            {card.data.categories?.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setFlipped(true); // Auto flip to show menu items!
                }}
                className={`h-7 px-3 text-[9px] font-bold rounded-full transition-all border border-white/10 whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 text-zinc-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="text-[9px] font-bold text-zinc-500 flex items-center gap-1.5 animate-bounce">
            <span>Tap Card to Browse Dishes</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMenuBack = () => {
    const currency = card.data.currency || '$';
    const activeCat = card.data.categories?.find((c: any) => c.id === activeCategory);

    return (
      <div className="w-full h-full p-5 flex flex-col bg-[#0C0C0E] text-white relative overflow-hidden">
        {/* Back header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 z-10 shrink-0 no-flip-target">
          <button 
            onClick={() => setFlipped(false)}
            className="text-[9px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 cursor-pointer"
          >
            ← Cover
          </button>
          <span className="text-[11px] font-bold text-amber-500">{activeCat?.name || 'Menu'}</span>
          <div className="w-12" />
        </div>

        {/* Scrollable menu items list */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3 flex flex-col gap-3 z-10 no-flip-target">
          {activeCat?.items && activeCat.items.length > 0 ? (
            activeCat.items.map((item: any) => (
              <div key={item.id} className="p-3 bg-zinc-900/60 border border-white/5 rounded-xl flex gap-3.5">
                {item.image && (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="text-xs font-bold text-zinc-200 truncate">{item.name}</h4>
                    <span className="text-xs font-extrabold text-amber-400 shrink-0">{currency}{item.price}</span>
                  </div>
                  <p className="text-[9px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-zinc-600 text-xs py-8">No dishes in this category</div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-white/5 pt-2.5 text-center text-[8px] font-bold text-zinc-600 z-10 shrink-0">
          Tap empty space to flip card
        </div>
      </div>
    );
  };

  // 3. Link Tree Card Front/Back
  const renderLinkFront = () => (
    <div className="w-full h-full p-6 flex flex-col justify-between select-none relative bg-neutral-900 text-white overflow-hidden">
      {/* Dynamic background light */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/30 via-zinc-950 to-zinc-950" />
      <div className="absolute inset-4 border border-white/5 rounded-xl pointer-events-none" />

      {/* Top spacing */}
      <div className="w-12 h-1 z-10 bg-white/20 rounded-full mx-auto" />

      {/* Profile info */}
      <div className="flex flex-col items-center z-10 my-auto text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-zinc-800 mb-4 shadow-xl">
          {card.data.profileImage ? (
            <img src={card.data.profileImage} alt={card.data.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-700 text-white flex items-center justify-center text-xl font-bold">L</div>
          )}
        </div>

        <h1 className="text-lg font-serif font-black tracking-tight text-white leading-tight">
          {card.data.displayName || 'Display Name'}
        </h1>
        
        {card.data.bio && (
          <p className="text-[11px] text-zinc-400 mt-2 px-6 line-clamp-3 leading-relaxed">
            {card.data.bio}
          </p>
        )}
      </div>

      {/* Tap hint indicator */}
      <div className="flex flex-col items-center gap-1.5 z-10">
        <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase">Tap Card to Open Links</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 animate-pulse rotate-90" />
      </div>
    </div>
  );

  const renderLinkBack = () => (
    <div className="w-full h-full p-5 flex flex-col bg-zinc-950 text-white relative">
      <div className="absolute inset-4 border border-white/5 rounded-xl pointer-events-none" />
      
      {/* Back Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2.5 z-10 shrink-0 no-flip-target">
        <button 
          onClick={() => setFlipped(false)}
          className="text-[9px] font-bold text-zinc-400 hover:text-white bg-white/5 px-2 py-1 rounded-md border border-white/5 cursor-pointer"
        >
          ← Bio
        </button>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Link Collection</span>
        <div className="w-8" />
      </div>

      {/* Dynamic Buttons Stack */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 flex flex-col gap-3 z-10 no-flip-target">
        {card.data.links && card.data.links.length > 0 ? (
          card.data.links.map((link: any) => {
            let styleClass = 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-white/10';
            if (link.theme === 'accent') {
              styleClass = 'bg-white hover:bg-zinc-200 text-zinc-950 border border-white/5 font-extrabold';
            } else if (link.theme === 'outline') {
              styleClass = 'bg-transparent hover:bg-white/5 border border-white/20 text-white';
            }

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full min-h-[46px] px-4 py-2.5 rounded-xl flex flex-col justify-center transition-all active:scale-98 ${styleClass}`}
              >
                <span className="text-[11px] font-bold leading-tight">{link.label || 'Link'}</span>
                {link.secondaryText && (
                  <span className="text-[8px] mt-0.5 opacity-60 leading-none">
                    {link.secondaryText}
                  </span>
                )}
              </a>
            );
          })
        ) : (
          <div className="text-center text-zinc-600 text-xs py-8">No links configured</div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[8px] font-bold text-zinc-700 z-10 shrink-0">
        Tap empty space to flip
      </div>
    </div>
  );

  // 4. Event Card Front/Back
  const renderEventFront = () => {
    // Extract month/day
    let month = 'JUL';
    let day = '24';
    try {
      const parts = card.data.date?.split(' ');
      if (parts && parts.length >= 2) {
        month = parts[0].substring(0, 3).toUpperCase();
        day = parts[1].replace(',', '');
      }
    } catch (e) {}

    return (
      <div className="w-full h-full flex flex-col justify-between bg-zinc-900 text-white select-none relative overflow-hidden">
        {/* Banner image background */}
        <div className="absolute inset-0 z-0 opacity-50">
          {card.data.banner ? (
            <img src={card.data.banner} alt={card.data.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-zinc-900" />
        </div>

        {/* Dynamic header cards */}
        <div className="p-5 flex flex-col justify-between flex-1 z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Special Event
            </span>
            
            {/* Calendar Badge */}
            <div className="w-11 h-12 bg-white rounded-xl border border-black/10 overflow-hidden flex flex-col items-center justify-between shadow-md">
              <div className="w-full bg-red-600 py-0.5 text-[7px] font-bold text-white text-center tracking-wider">{month}</div>
              <div className="flex-1 flex items-center justify-center text-base font-black text-zinc-950 leading-none">{day}</div>
            </div>
          </div>

          <div className="text-center py-6 mt-auto">
            <h1 className="text-2xl font-serif font-black tracking-tight text-white leading-tight">
              {card.data.title || 'Event Title'}
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-300 mt-2">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{card.data.time || '19:00'}</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-3 font-medium px-4 line-clamp-2">
              {card.data.venue || 'Venue Address'}
            </p>
          </div>

          {/* Swipe indicator */}
          <div className="flex flex-col items-center gap-1 mt-auto">
            <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase">Tap Card to RSVP</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600 animate-pulse rotate-90" />
          </div>
        </div>
      </div>
    );
  };

  const renderEventBack = () => {
    const [rsvpForm, setRsvpForm] = useState({ name: '', email: '', guests: 1 });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleRsvpSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!rsvpForm.name || !rsvpForm.email) return;

      setLoading(true);
      setErrorMsg('');
      try {
        if (!card.slug) {
          setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
          }, 1000);
          return;
        }

        const res = await submitRsvpAction(card.slug, rsvpForm);
        if (res.success) {
          setSubmitted(true);
        } else {
          setErrorMsg(res.error || 'Failed to submit RSVP');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="w-full h-full p-5 flex flex-col bg-zinc-950 text-white relative">
        <div className="absolute inset-4 border border-white/5 rounded-xl pointer-events-none" />

        {/* Back Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 z-10 shrink-0 no-flip-target">
          <button 
            onClick={() => setFlipped(false)}
            className="text-[9px] font-bold text-zinc-400 hover:text-white bg-white/5 px-2 py-1 rounded-md border border-white/5 cursor-pointer"
          >
            ← Event Info
          </button>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Registration</span>
          <div className="w-8" />
        </div>

        {/* Form area / details */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3.5 z-10 no-flip-target">
          <div className="flex gap-2 items-start mb-4">
            <div className="w-6.5 h-6.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
            </div>
            <div>
              <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Location details</h4>
              <p className="text-[11px] text-zinc-300 font-medium leading-tight mt-0.5">{card.data.venue || 'Venue Address'}</p>
            </div>
          </div>

          {card.data.description && (
            <p className="text-[10px] text-zinc-400 border-t border-white/5 pt-3 mb-4 leading-relaxed font-normal">
              {card.data.description}
            </p>
          )}

          {/* Form */}
          <div className="border-t border-white/5 pt-4">
            {submitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto mb-2 font-bold">✓</div>
                <h4 className="text-xs font-bold text-zinc-200">RSVP Confirmed</h4>
                <p className="text-[9px] text-zinc-400 mt-1">Details registered. Tap card to flip.</p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="flex flex-col gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={rsvpForm.name}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                  className="w-full h-8 px-3 text-[11px] bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white font-medium"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email"
                  value={rsvpForm.email}
                  onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                  className="w-full h-8 px-3 text-[11px] bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white font-medium"
                />

                <div className="flex items-center justify-between bg-white/5 border border-white/5 p-2 rounded-lg mt-1">
                  <span className="text-[10px] font-bold text-zinc-400">Guests</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, guests: Math.max(1, rsvpForm.guests - 1) })}
                      className="w-5.5 h-5.5 rounded bg-white/10 flex items-center justify-center active:bg-white/20 text-white text-xs cursor-pointer border-0"
                    >
                      -
                    </button>
                    <span className="text-[10px] font-bold w-3 text-center">{rsvpForm.guests}</span>
                    <button
                      type="button"
                      onClick={() => setRsvpForm({ ...rsvpForm, guests: Math.min(10, rsvpForm.guests + 1) })}
                      className="w-5.5 h-5.5 rounded bg-white/10 flex items-center justify-center active:bg-white/20 text-white text-xs cursor-pointer border-0"
                    >
                      +
                    </button>
                  </div>
                </div>

                {errorMsg && <p className="text-[9px] text-red-500 font-bold">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-8.5 bg-white text-black font-bold text-xs rounded-lg hover:bg-zinc-200 active:scale-98 transition-all disabled:opacity-50 mt-1 cursor-pointer border-0"
                >
                  {loading ? 'Confirming...' : (card.data.rsvpButtonText || 'Confirm RSVP')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer URL / Brand */}
        <div className="text-center text-[8px] font-bold text-zinc-700 z-10 shrink-0 border-t border-white/5 pt-2.5">
          Tap empty space to flip
        </div>
      </div>
    );
  };

  // 5. WiFi Card Front/Back
  const renderWifiFront = () => (
    <div className="w-full h-full p-6 flex flex-col justify-between select-none bg-gradient-to-b from-[#1E293B] to-[#0F172A] text-white relative">
      <div className="absolute inset-4 border border-white/5 rounded-xl pointer-events-none" />
      
      {/* Top Header */}
      <div className="flex items-center gap-1.5 z-10">
        <div className="w-6.5 h-6.5 rounded bg-white/10 flex items-center justify-center text-white font-bold text-xs">W</div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Wireless Access</span>
      </div>

      {/* Main Connection Pulsing Icon */}
      <div className="flex flex-col items-center my-auto z-10">
        <div className="relative w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 border border-white/20 rounded-full" 
          />
          <motion.div 
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-2 border border-white/25 rounded-full" 
          />
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-zinc-950 shadow-md">
            <Wifi className="w-6 h-6" />
          </div>
        </div>

        <h1 className="text-base font-serif font-black tracking-tight text-white leading-tight text-center">
          {card.data.networkName || 'Network Name'}
        </h1>
        <p className="text-[9px] text-zinc-400 font-medium tracking-widest uppercase mt-1">
          {card.data.security || 'WPA2 SECURE'}
        </p>
      </div>

      {/* Bottom Hint */}
      <div className="flex flex-col items-center gap-1 z-10">
        <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase">Tap Card for Key</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 animate-pulse rotate-90" />
      </div>
    </div>
  );

  const renderWifiBack = () => {
    const handleCopy = () => {
      if (!card.data.password) return;
      navigator.clipboard.writeText(card.data.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <div className="w-full h-full p-6 flex flex-col justify-between bg-zinc-950 text-white relative">
        <div className="absolute inset-4 border border-white/5 rounded-xl pointer-events-none" />

        {/* Back Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 z-10 shrink-0 no-flip-target">
          <button 
            onClick={() => setFlipped(false)}
            className="text-[9px] font-bold text-zinc-400 hover:text-white bg-white/5 px-2 py-1 rounded-md border border-white/5 cursor-pointer"
          >
            ← SSID
          </button>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Network Credentials</span>
          <div className="w-8" />
        </div>

        {/* Center Details */}
        <div className="flex flex-col gap-4 z-10 my-auto no-flip-target">
          <div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">SSID Name</span>
            <div className="text-xs font-bold text-zinc-200 mt-0.5">{card.data.networkName || 'Network Name'}</div>
          </div>
          
          <div className="border-t border-white/5 pt-3">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Security</span>
            <div className="text-xs font-bold text-zinc-200 mt-0.5">{card.data.security || 'WPA'}</div>
          </div>

          {card.data.password && (
            <div className="border-t border-white/5 pt-3">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Password key</span>
              <div className="text-xs font-bold text-amber-400 mt-0.5 font-mono select-all bg-white/5 px-2.5 py-2 rounded-lg border border-white/5 overflow-x-auto no-scrollbar">
                {card.data.password}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="z-10 no-flip-target">
          {card.data.password ? (
            <button
              onClick={handleCopy}
              className="w-full h-9 bg-white text-zinc-950 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all active:scale-98 cursor-pointer border-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied Key
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy WiFi Key
                </>
              )}
            </button>
          ) : (
            <div className="w-full text-center py-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              Open Connection
            </div>
          )}
        </div>
      </div>
    );
  };

  // 6. Product Catalog Card Front/Back
  const renderCatalogFront = () => (
    <div className="w-full h-full flex flex-col justify-between bg-zinc-900 text-white select-none relative overflow-hidden">
      {/* Banner image background */}
      <div className="absolute inset-0 z-0 opacity-55">
        {card.data.bannerImage ? (
          <img src={card.data.bannerImage} alt={card.data.catalogTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-zinc-900" />
      </div>

      <div className="p-5 flex flex-col justify-between flex-1 z-10">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Catalog Card
          </span>
          <div className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/10">
            {card.data.products?.length || 0} Pieces
          </div>
        </div>

        <div className="text-center py-6 mt-auto">
          <h1 className="text-2xl font-serif font-black tracking-tight text-white leading-tight">
            {card.data.catalogTitle || 'Product Catalog'}
          </h1>
          <p className="text-[10px] text-zinc-400 mt-2 px-4 line-clamp-2 leading-relaxed">
            {card.data.catalogDescription || 'Explore our custom catalog collections.'}
          </p>
        </div>

        {/* Gallery Thumbnails */}
        {card.data.products && card.data.products.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2 w-full">
            {card.data.products.slice(0, 2).map((p: any) => (
              <div key={p.id} className="p-1.5 bg-zinc-950/60 border border-white/5 rounded-lg flex items-center gap-2">
                {p.image && <img src={p.image} alt={p.name} className="w-7 h-7 object-cover rounded" />}
                <div className="min-w-0">
                  <div className="text-[8px] text-zinc-300 font-bold truncate leading-none">{p.name}</div>
                  <div className="text-[8px] text-amber-400 font-extrabold mt-0.5">${p.price}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Swipe */}
        <div className="flex flex-col items-center gap-1 mt-auto">
          <span className="text-[9px] font-bold text-zinc-500 tracking-wider uppercase">Tap Card to Browse</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 animate-pulse rotate-90" />
        </div>
      </div>
    </div>
  );

  const renderCatalogBack = () => {
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    const getInquiryLink = (productName: string) => {
      if (!card.data.contactNumber) return '#';
      const message = encodeURIComponent(`Hi, I am interested in "${productName}" from your CardQR catalog. Can you provide details?`);
      return `https://wa.me/${card.data.contactNumber.replace(/\+/g, '')}?text=${message}`;
    };

    return (
      <div className="w-full h-full p-5 flex flex-col bg-zinc-950 text-white relative overflow-hidden">
        {/* Back Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 z-10 shrink-0 no-flip-target">
          <button 
            onClick={() => setFlipped(false)}
            className="text-[9px] font-bold text-zinc-400 hover:text-white bg-white/5 px-2 py-1 rounded-md border border-white/5 cursor-pointer"
          >
            ← Cover
          </button>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Catalog Gallery</span>
          <div className="w-8" />
        </div>

        {/* Scrollable list of products */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-3.5 grid grid-cols-2 gap-3.5 z-10 no-flip-target">
          {card.data.products && card.data.products.length > 0 ? (
            card.data.products.map((prod: any) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden flex flex-col justify-between transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-full aspect-square bg-zinc-800 overflow-hidden relative">
                  {prod.image && <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-2 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-[10px] font-bold text-zinc-200 line-clamp-1 leading-tight">{prod.name}</h4>
                    <p className="text-[8px] text-zinc-500 line-clamp-1 mt-0.5 leading-relaxed">{prod.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                    <span className="text-[10px] font-extrabold text-amber-400">${prod.price}</span>
                    <ChevronRight className="w-3 h-3 text-zinc-500" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-zinc-600 text-xs py-8">No products listed</div>
          )}
        </div>

        {/* Product detailed modal sheet overlay */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="absolute inset-0 z-50 flex flex-col justify-end overflow-hidden no-flip-target">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs" 
                onClick={() => setSelectedProduct(null)} 
              />
              
              {/* Sheet container */}
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="relative bg-zinc-900 border-t border-white/10 rounded-t-2xl p-4 flex flex-col gap-3 shadow-xl z-20 max-h-[85%] overflow-y-auto no-scrollbar text-white"
              >
                <div className="w-8 h-1 bg-white/20 rounded-full mx-auto -mt-1.5 mb-1" />
                <div className="w-full aspect-square bg-zinc-800 rounded-xl overflow-hidden shadow-sm">
                  {selectedProduct.image && <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />}
                </div>

                <div>
                  <div className="flex justify-between items-baseline gap-4">
                    <h2 className="text-xs font-bold text-zinc-100 truncate pr-2">{selectedProduct.name}</h2>
                    <span className="text-xs font-black text-amber-400">${selectedProduct.price}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="flex flex-col gap-2 mt-1 border-t border-white/5 pt-3">
                  {card.data.contactNumber && (
                    <a
                      href={getInquiryLink(selectedProduct.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-8.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer border-0 text-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white text-[#25D366]" /> Inquire via WhatsApp
                    </a>
                  )}
                  {selectedProduct.link && (
                    <a
                      href={selectedProduct.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full h-8.5 bg-white text-zinc-950 font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs transition-all cursor-pointer border-0 text-center"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Purchase Details
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="w-full h-8 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg text-xs transition-all cursor-pointer border-0"
                  >
                    Close Details
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="text-center text-[8px] font-bold text-zinc-700 z-10 shrink-0 border-t border-white/5 pt-2.5">
          Tap empty space to flip
        </div>
      </div>
    );
  };

  // Switch selector for template faces
  const renderCardFace = (isBack: boolean) => {
    switch (card.templateType) {
      case 'business':
        return isBack ? renderBusinessBack() : renderBusinessFront();
      case 'menu':
        return isBack ? renderMenuBack() : renderMenuFront();
      case 'link':
        return isBack ? renderLinkBack() : renderLinkFront();
      case 'event':
        return isBack ? renderEventBack() : renderEventFront();
      case 'wifi':
        return isBack ? renderWifiBack() : renderWifiFront();
      case 'catalog':
        return isBack ? renderCatalogBack() : renderCatalogFront();
      default:
        return <div className="p-6 text-center text-xs">Invalid template type</div>;
    }
  };

  return (
    <div className="relative w-full max-w-[340px] h-[540px] flex items-center justify-center z-10">
      
      {/* 1. Dynamic light bloom background that moves slightly with mouse tilt */}
      <div 
        ref={bloomRef}
        className="absolute top-1/2 left-1/2 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.06)_0%,_rgba(255,255,255,0.02)_40%,_transparent_70%)] pointer-events-none z-0"
        style={{
          transform: 'translate3d(-50%, -50%, -150px)',
          transition: 'transform 0.1s ease-out'
        }}
      />

      {/* 3D Perspective card viewport */}
      <div 
        ref={wrapperRef}
        onClick={handleCardClick}
        className="relative w-[320px] h-[500px] cursor-pointer"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          ref={cardRef}
          className="relative w-full h-full transition-transform duration-700 select-none shadow-2xl"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${flipped ? 180 : 0}deg)`
          }}
          animate={{
            y: [-5, 5, -5]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            scale: 1.035,
            z: 20
          }}
        >
          {/* Stacked voxel layers sandwiched between front & back to simulate 3D thickness (3px) */}
          <div className="absolute inset-0 bg-zinc-400 dark:bg-zinc-800 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-0.4px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute inset-0 bg-zinc-500 dark:bg-zinc-700 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-0.8px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute inset-0 bg-zinc-600 dark:bg-zinc-600 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-1.2px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute inset-0 bg-zinc-700 dark:bg-zinc-500 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-1.6px)', backfaceVisibility: 'hidden' }} />
          <div className="absolute inset-0 bg-zinc-800 dark:bg-zinc-400 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-2.0px)', backfaceVisibility: 'hidden' }} />

          {/* FRONT FACE */}
          <div 
            className="absolute inset-0 rounded-[24px] overflow-hidden border border-black/10 shadow-lg flex flex-col bg-white"
            style={{ 
              transform: 'translateZ(0px)',
              backfaceVisibility: 'hidden'
            }}
          >
            {renderCardFace(false)}

            {/* Gloss sheen overlay */}
            <div 
              ref={sheenFrontRef}
              className="absolute inset-0 pointer-events-none mix-blend-overlay z-20"
              style={{
                transition: 'background 0.05s ease-out'
              }}
            />
          </div>

          {/* BACK FACE */}
          <div 
            className="absolute inset-0 rounded-[24px] overflow-hidden border border-white/5 shadow-lg flex flex-col bg-black"
            style={{ 
              transform: 'rotateY(180deg) translateZ(0px)',
              backfaceVisibility: 'hidden'
            }}
          >
            {renderCardFace(true)}

            {/* Gloss sheen overlay for back */}
            <div 
              ref={sheenBackRef}
              className="absolute inset-0 pointer-events-none mix-blend-overlay z-20"
              style={{
                transition: 'background 0.05s ease-out'
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
