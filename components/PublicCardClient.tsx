'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, QrCode } from 'lucide-react';
import { CardData } from '@/lib/db';
import TemplatePreview from '@/components/TemplatePreviews';

interface PublicCardClientProps {
  card: CardData;
}

export default function PublicCardClient({ card }: PublicCardClientProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Trigger quick skeleton loader simulation for smooth native app transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Viewfinder Corners Helper Component
  const Viewfinder = () => (
    <div className="absolute inset-8 pointer-events-none z-0 border border-white/5 rounded-2xl hidden md:block">
      {/* Top Left Corner */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-xl" />
      {/* Top Right Corner */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-xl" />
      {/* Bottom Left Corner */}
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-xl" />
      {/* Bottom Right Corner */}
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-xl" />
      
      {/* Pulse recording indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-white/40 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span>Scan Mode</span>
      </div>
    </div>
  );

  // Render template-specific skeleton UI
  const renderSkeleton = () => {
    switch (card.templateType) {
      case 'business':
        return (
          <div className="p-6 flex flex-col items-center gap-5 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-zinc-200 mt-6" />
            <div className="w-32 h-4.5 bg-zinc-200 rounded-md" />
            <div className="w-48 h-3 bg-zinc-200 rounded-md" />
            <div className="w-full h-12 bg-zinc-100 rounded-xl mt-4" />
            <div className="grid grid-cols-4 gap-3 w-full mt-4">
              <div className="h-14 bg-zinc-100 rounded-xl" />
              <div className="h-14 bg-zinc-100 rounded-xl" />
              <div className="h-14 bg-zinc-100 rounded-xl" />
              <div className="h-14 bg-zinc-100 rounded-xl" />
            </div>
          </div>
        );
      case 'menu':
        return (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="w-full h-36 bg-zinc-200" />
            <div className="px-5 -mt-8 flex items-end gap-3">
              <div className="w-16 h-16 rounded-xl bg-zinc-300 border-2 border-white shrink-0" />
              <div className="w-32 h-4.5 bg-zinc-200 rounded-md mb-1" />
            </div>
            <div className="px-5 flex gap-2 overflow-hidden mt-2">
              <div className="w-16 h-7 bg-zinc-200 rounded-full shrink-0" />
              <div className="w-20 h-7 bg-zinc-200 rounded-full shrink-0" />
              <div className="w-16 h-7 bg-zinc-200 rounded-full shrink-0" />
            </div>
            <div className="px-5 flex flex-col gap-3 mt-4">
              <div className="h-20 bg-zinc-100 rounded-xl" />
              <div className="h-20 bg-zinc-100 rounded-xl" />
            </div>
          </div>
        );
      case 'event':
        return (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="w-full h-40 bg-zinc-200" />
            <div className="px-5 -mt-6 flex gap-4">
              <div className="w-12 h-14 bg-zinc-300 rounded-xl shrink-0" />
              <div className="w-36 h-4 bg-zinc-200 rounded-md mt-2" />
            </div>
            <div className="px-5 flex flex-col gap-3 mt-6">
              <div className="w-full h-10 bg-zinc-100 rounded-xl" />
              <div className="w-full h-10 bg-zinc-100 rounded-xl" />
              <div className="w-full h-24 bg-zinc-100 rounded-xl mt-4" />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 flex flex-col gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-xl bg-zinc-200 mt-6 mx-auto" />
            <div className="w-36 h-5 bg-zinc-200 rounded-md mx-auto" />
            <div className="w-48 h-3.5 bg-zinc-200 rounded-md mx-auto" />
            <div className="w-full h-12 bg-zinc-100 rounded-xl mt-6" />
            <div className="w-full h-12 bg-zinc-100 rounded-xl" />
            <div className="w-full h-12 bg-zinc-100 rounded-xl" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090B] flex items-center justify-center select-none relative overflow-hidden">
      {/* Camera-style focus background details */}
      <div className="absolute inset-0 bg-[#09090B] bg-[radial-gradient(#1f1f23_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 via-black/80 to-black pointer-events-none" />
      
      <Viewfinder />

      {/* Background soft blur animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 backdrop-blur-md pointer-events-none z-0"
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          /* Loader Skeleton layout */
          <motion.div
            key="skeleton"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full h-dvh md:h-[680px] md:max-w-[360px] bg-white rounded-t-[32px] md:rounded-[32px] shadow-2xl z-10 flex flex-col border border-black/5 overflow-hidden fixed bottom-0 md:relative"
          >
            {/* Native sheet handle */}
            <div className="w-full flex justify-center py-3 shrink-0">
              <div className="w-10 h-1.5 bg-zinc-200 rounded-full" />
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {renderSkeleton()}
            </div>
          </motion.div>
        ) : (
          /* Actual Card (iOS Bottom Sheet Style) */
          <motion.div
            key="card"
            initial={
              typeof window !== 'undefined' && window.innerWidth >= 768
                ? { opacity: 0, scale: 0.95, y: 20 } // Desktop entry
                : { opacity: 0, y: "100%" } // Mobile bottom entry
            }
            animate={
              typeof window !== 'undefined' && window.innerWidth >= 768
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 1, y: "0%" }
            }
            transition={{ type: "spring", stiffness: 100, damping: 16 }}
            className="w-full h-dvh md:h-[680px] md:max-w-[360px] bg-white rounded-t-[32px] md:rounded-[32px] shadow-2xl z-10 flex flex-col border border-black/5 overflow-hidden fixed bottom-0 md:relative"
          >
            {/* Scroll bounds handled internally. Desktop has rounded-b, mobile goes to edge */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <TemplatePreview type={card.templateType} data={card.data} slug={card.slug} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
