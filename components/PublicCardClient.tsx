'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, QrCode } from 'lucide-react';
import { CardData } from '@/lib/db';
import PhysicalCard from '@/components/PhysicalCard';

interface PublicCardClientProps {
  card: CardData;
}

export default function PublicCardClient({ card }: PublicCardClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const isDark = card.data?.theme === 'dark';

  // Trigger quick skeleton loader simulation for smooth native app transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  // Viewfinder Corners Helper Component
  const Viewfinder = () => (
    <div className={`absolute inset-8 pointer-events-none z-0 border rounded-2xl hidden md:block transition-colors duration-300 ${
      isDark ? 'border-white/10' : 'border-border-default'
    }`}>
      {/* Top Left Corner */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-xl transition-colors duration-300 ${isDark ? 'border-white/20' : 'border-border-emphasis'}`} />
      {/* Top Right Corner */}
      <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-xl transition-colors duration-300 ${isDark ? 'border-white/20' : 'border-border-emphasis'}`} />
      {/* Bottom Left Corner */}
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-xl transition-colors duration-300 ${isDark ? 'border-white/20' : 'border-border-emphasis'}`} />
      {/* Bottom Right Corner */}
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl transition-colors duration-300 ${isDark ? 'border-white/20' : 'border-border-emphasis'}`} />
      
      {/* Pulse recording indicator */}
      <div className={`absolute top-4 left-4 flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase font-mono transition-colors duration-300 ${
        isDark ? 'text-white/40' : 'text-muted-text/60'
      }`}>
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
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
            <div className="w-24 h-24 rounded-full bg-surface-2 mt-6" />
            <div className="w-32 h-4.5 bg-surface-2 rounded-md" />
            <div className="w-48 h-3 bg-surface-2 rounded-md" />
            <div className="w-full h-12 bg-background rounded-xl mt-4" />
            <div className="grid grid-cols-4 gap-3 w-full mt-4">
              <div className="h-14 bg-background rounded-xl" />
              <div className="h-14 bg-background rounded-xl" />
              <div className="h-14 bg-background rounded-xl" />
              <div className="h-14 bg-background rounded-xl" />
            </div>
          </div>
        );
      case 'menu':
        return (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="w-full h-36 bg-surface-2" />
            <div className="px-5 -mt-8 flex items-end gap-3">
              <div className="w-16 h-16 rounded-xl bg-[#24262b] border-2 border-surface shrink-0" />
              <div className="w-32 h-4.5 bg-surface-2 rounded-md mb-1" />
            </div>
            <div className="px-5 flex gap-2 overflow-hidden mt-2">
              <div className="w-16 h-7 bg-surface-2 rounded-full shrink-0" />
              <div className="w-20 h-7 bg-surface-2 rounded-full shrink-0" />
              <div className="w-16 h-7 bg-surface-2 rounded-full shrink-0" />
            </div>
            <div className="px-5 flex flex-col gap-3 mt-4">
              <div className="h-20 bg-background rounded-xl" />
              <div className="h-20 bg-background rounded-xl" />
            </div>
          </div>
        );
      case 'event':
        return (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="w-full h-40 bg-surface-2" />
            <div className="px-5 -mt-6 flex gap-4">
              <div className="w-12 h-14 bg-[#24262b] rounded-xl shrink-0" />
              <div className="w-36 h-4 bg-surface-2 rounded-md mt-2" />
            </div>
            <div className="px-5 flex flex-col gap-3 mt-6">
              <div className="w-full h-10 bg-background rounded-xl" />
              <div className="w-full h-10 bg-background rounded-xl" />
              <div className="w-full h-24 bg-background rounded-xl mt-4" />
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 flex flex-col gap-4 animate-pulse">
            <div className="w-16 h-16 rounded-xl bg-surface-2 mt-6 mx-auto" />
            <div className="w-36 h-5 bg-surface-2 rounded-md mx-auto" />
            <div className="w-48 h-3.5 bg-surface-2 rounded-md mx-auto" />
            <div className="w-full h-12 bg-background rounded-xl mt-6" />
            <div className="w-full h-12 bg-background rounded-xl" />
            <div className="w-full h-12 bg-background rounded-xl" />
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center select-none relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-[#12110F]' : 'bg-background'
    }`}>
      {/* Camera-style focus background details */}
      <div className={`absolute inset-0 bg-[radial-gradient(var(--bg-dot)_1.5px,transparent_1.5px)] bg-[size:24px_24px] opacity-70 pointer-events-none`}
        style={{
          '--bg-dot': isDark ? '#2E2B25' : '#E8E2D6'
        } as React.CSSProperties}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark 
            ? 'radial-gradient(ellipse at center, rgba(26,24,21,0.3) 0%, #12110F 80%)'
            : 'radial-gradient(ellipse at center, rgba(250,248,244,0.3) 0%, #FAF8F4 80%)'
        }}
      />
      
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
            className={`w-[320px] h-[500px] rounded-[24px] card-shadow z-10 flex flex-col border overflow-hidden relative paper-grain ${
              isDark ? 'bg-[#1A1815] border-white/10' : 'bg-surface border-border-default'
            }`}
          >
            {/* Native card handle spacer */}
            <div className="w-full flex justify-center py-3 shrink-0">
              <div className={`w-10 h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-border-default'}`} />
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {renderSkeleton()}
            </div>
          </motion.div>
        ) : (
          /* Actual Card (Immersive 3D Experience) */
          <div className="flex flex-col items-center gap-6 z-10">
            <PhysicalCard card={card} />
            
            {/* Soft hint overlay at bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`text-[9px] font-bold uppercase tracking-widest pointer-events-none text-center border px-3.5 py-1.5 rounded-full font-sans ${
                isDark ? 'bg-[#282520] border-white/10 text-[#A69F90]' : 'bg-surface border-border-default text-muted-text'
              }`}
            >
              Premium Digital Experience
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
