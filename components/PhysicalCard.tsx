'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import TemplatePreview from '@/components/TemplatePreviews';

interface PhysicalCardProps {
  card: {
    templateType: 'business' | 'menu' | 'event' | 'link' | 'wifi' | 'catalog';
    data: any;
    slug: string;
  };
}

export default function PhysicalCard({ card }: PhysicalCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  
  const currentRotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const isPressed = useRef(false);

  // Helper to calculate tilt coordinates based on cursor/finger relative position
  const updateTilt = (clientX: number, clientY: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const cardCenterX = rect.left + cardWidth / 2;
    const cardCenterY = rect.top + cardHeight / 2;

    // Distance from center (-1 to 1) relative to half the card size
    const dx = (clientX - cardCenterX) / (cardWidth / 2);
    const dy = (clientY - cardCenterY) / (cardHeight / 2);

    // Clamp mapping to prevent excessive rotations if dragged outside bounds
    const clampedDx = Math.min(Math.max(dx, -1.5), 1.5);
    const clampedDy = Math.min(Math.max(dy, -1.5), 1.5);

    // Subtle tilt limit: max tilt rotateX: 6deg, rotateY: 6deg
    targetRotation.current = {
      x: -clampedDy * 6,
      y: clampedDx * 6
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only respond to primary click
    isPressed.current = true;
    updateTilt(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isPressed.current = true;
    if (e.touches.length > 0) {
      updateTilt(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Setup global window listeners to track movement and release during a press
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isPressed.current) return;
      updateTilt(e.clientX, e.clientY);
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (!isPressed.current) return;
      if (e.touches.length > 0) {
        updateTilt(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleGlobalRelease = () => {
      isPressed.current = false;
      targetRotation.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true });
    window.addEventListener('mouseup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    window.addEventListener('touchcancel', handleGlobalRelease);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('mouseup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
      window.removeEventListener('touchcancel', handleGlobalRelease);
    };
  }, []);

  // requestAnimationFrame loop for lerped physics
  useEffect(() => {
    let animId: number;

    const update = () => {
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      const { x, y } = currentRotation.current;

      // Apply transformations to ref
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
      }

      // Specular sheen highlight calculation (moves opposite to tilt direction)
      const sx = 50 + y * 4.5;
      const sy = 50 - x * 4.5;
      if (sheenRef.current) {
        sheenRef.current.style.background = `radial-gradient(circle at ${sx}% ${sy}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`;
      }

      // Backdrop light bloom matching tilt
      const bx = y * 1.8;
      const by = -x * 1.8;
      if (bloomRef.current) {
        bloomRef.current.style.transform = `translate3d(calc(-50% + ${bx}px), calc(-50% + ${by}px), -120px)`;
      }

      // Shimmer foil position updates
      const foilTexts = document.querySelectorAll('.foil-foil-effect');
      foilTexts.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.backgroundPosition = `${50 + y * 3}% ${50 - x * 3}%`;
      });

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full max-w-[340px] h-[540px] flex items-center justify-center z-10">
      
      {/* 1. Dynamic light bloom background */}
      <div 
        ref={bloomRef}
        className="absolute top-1/2 left-1/2 w-[460px] h-[460px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.04)_0%,_rgba(255,255,255,0.01)_40%,_transparent_70%)] pointer-events-none z-0"
        style={{
          transform: 'translate3d(-50%, -50%, -120px)',
          transition: 'transform 0.1s ease-out'
        }}
      />

      {/* 3D Perspective card viewport */}
      <div 
        ref={wrapperRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative w-[320px] h-[500px] select-none cursor-grab active:cursor-grabbing"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          ref={cardRef}
          className="relative w-full h-full transition-transform duration-500 shadow-2xl select-none"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(0deg) rotateY(0deg)'
          }}
          animate={{
            y: [-4, 4, -4]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{
            scale: 1.025,
            z: 15
          }}
        >
          {/* Stacked voxel layers sandwiched to simulate 3D thickness (3px) */}
          <div className="absolute inset-0 bg-zinc-400 dark:bg-zinc-800 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-0.4px)' }} />
          <div className="absolute inset-0 bg-zinc-500 dark:bg-zinc-700 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-0.8px)' }} />
          <div className="absolute inset-0 bg-zinc-600 dark:bg-zinc-600 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-1.2px)' }} />
          <div className="absolute inset-0 bg-zinc-700 dark:bg-zinc-500 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-1.6px)' }} />
          <div className="absolute inset-0 bg-zinc-800 dark:bg-zinc-400 rounded-[24px] pointer-events-none" style={{ transform: 'translateZ(-2.0px)' }} />

          {/* SINGLE FRONT FACE CONTAINING THE SCROLLABLE CARD LAYOUT */}
          <div 
            className="absolute inset-0 rounded-[24px] overflow-hidden border border-black/10 shadow-lg flex flex-col bg-white"
            style={{ 
              transform: 'translateZ(0px)',
            }}
          >
            {/* Render the unified TemplatePreview layout */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
              <TemplatePreview type={card.templateType} data={card.data} slug={card.slug} />
            </div>

            {/* Specular sheen overlay */}
            <div 
              ref={sheenRef}
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
