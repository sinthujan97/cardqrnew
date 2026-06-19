'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  dark?: boolean;
}

export default function PhoneMockup({ children, className = '', animate = true, dark = false }: PhoneMockupProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  } as const;

  const content = (
    <div className={`relative mx-auto w-full max-w-[340px] aspect-[9/19.5] bg-[#09090B] rounded-[48px] p-3 premium-border card-shadow select-none ${className}`}>
      {/* Outer Phone Bezel Trim */}
      <div className="absolute inset-0 rounded-[48px] border-[4px] border-[#27272A] pointer-events-none z-30" />
      
      {/* Phone Screen Case */}
      <div className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col z-20 ${dark ? 'bg-black' : 'bg-white'}`}>
        
        {/* Status Bar */}
        <div className={`w-full h-10 px-6 pt-3 flex items-center justify-between text-[11px] font-medium select-none z-30 ${dark ? 'text-white bg-black' : 'text-black bg-white'}`}>
          <span>9:41</span>
          
          {/* Dynamic Island / Speaker */}
          <div className="absolute left-1/2 -translate-x-1/2 top-3 w-24 h-4.5 bg-black rounded-full z-40 flex items-center justify-center">
            {/* Camera dot */}
            <div className="absolute right-3 w-1.5 h-1.5 bg-[#18181B] rounded-full" />
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Network */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-1.2 0-2.4.4-3.4 1.2L3.2 9.6c-.8.6-.8 1.8 0 2.4l1.4 1.1c.4.3.9.3 1.3 0L12 8.4l6.1 4.7c.4.3.9.3 1.3 0l1.4-1.1c.8-.6.8-1.8 0-2.4L15.4 4.2C14.4 3.4 13.2 3 12 3z" />
            </svg>
            {/* Battery */}
            <div className={`w-5 h-2.5 border rounded-sm p-0.5 flex items-center ${dark ? 'border-white/80' : 'border-black/80'}`}>
              <div className={`h-full w-full rounded-2xs ${dark ? 'bg-white' : 'bg-black'}`} />
            </div>
          </div>
        </div>

        {/* Dynamic Inner Screen Content */}
        <div className={`relative w-full flex-1 overflow-y-auto no-scrollbar flex flex-col ${dark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]'}`}>
          {children}
        </div>
        
        {/* Home Indicator Bar */}
        <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full pointer-events-none z-35 ${dark ? 'bg-white/45' : 'bg-black/45'}`} />
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
