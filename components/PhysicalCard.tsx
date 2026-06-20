'use client';

import React, { useEffect, useRef, useState } from 'react';
import TemplatePreview from '@/components/TemplatePreviews';

interface PhysicalCardProps {
  card: {
    templateType: 'business' | 'menu' | 'event' | 'link' | 'wifi' | 'catalog';
    data: any;
    slug: string;
  };
}

export default function PhysicalCard({ card }: PhysicalCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  const currentRotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  
  const currentLift = useRef(0);
  const targetLift = useRef(0);
  const currentScale = useRef(1);
  const targetScale = useRef(1);
  
  const currentTranslateY = useRef(0);
  const targetTranslateY = useRef(0);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [accentColor, setAccentColor] = useState('#8B5CF6');

  // Determine bloom background accent color
  const getBloomColor = () => {
    switch (card.templateType) {
      case 'business': return '#BF953F';
      case 'menu': return '#FF6B00';
      case 'event': return '#EC4899';
      case 'link': return '#1D9E75';
      case 'wifi': return '#378ADD';
      case 'catalog': return accentColor; // Can be dynamic via accentColor picker
      default: return '#8B5CF6';
    }
  };

  const getEdgeShadow = () => {
    return 'inset 0 0 0 1px rgba(28, 27, 25, 0.05)';
  };

  const bloomColor = getBloomColor();
  const edgeShadow = getEdgeShadow();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, []);

  // Monitor dynamic CSS custom properties (like product catalog's --accent-color updates)
  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const observer = new MutationObserver(() => {
      const computedColor = cardEl.style.getPropertyValue('--accent-color');
      if (computedColor) {
        setAccentColor(computedColor.trim());
      }
    });

    observer.observe(cardEl, { attributes: true, attributeFilter: ['style'] });
    return () => observer.disconnect();
  }, []);

  // Interaction handlers - Dynamic tilt removed, keeping hover depth lift transitions
  const handleMouseEnter = () => {
    targetLift.current = 16;
    targetScale.current = 1;
    targetTranslateY.current = -4;
    if (cardRef.current) {
      cardRef.current.style.boxShadow = `${edgeShadow}, 0 6px 20px rgba(28, 27, 25, 0.08)`;
    }
  };

  const handleMouseLeave = () => {
    targetRotation.current = { x: 0, y: 0 };
    targetLift.current = 0;
    targetScale.current = 1;
    targetTranslateY.current = 0;
    if (cardRef.current) {
      cardRef.current.style.boxShadow = `${edgeShadow}, 0 2px 8px rgba(28, 27, 25, 0.03)`;
    }
  };

  const handleTouchStart = () => {
    targetLift.current = 16;
    targetScale.current = 1;
    targetTranslateY.current = -4;
    if (cardRef.current) {
      cardRef.current.style.boxShadow = `${edgeShadow}, 0 6px 20px rgba(28, 27, 25, 0.08)`;
    }
  };

  // RequestAnimationFrame physics loop
  useEffect(() => {
    if (reducedMotion) {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1200px) translateZ(0px) scale(1) rotateX(0deg) rotateY(0deg)`;
        cardRef.current.style.setProperty('--tilt-x', '0');
        cardRef.current.style.setProperty('--tilt-y', '0');
      }
      return;
    }

    let animId: number;

    const update = () => {
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      currentLift.current += (targetLift.current - currentLift.current) * 0.1;
      currentScale.current += (targetScale.current - currentScale.current) * 0.1;
      currentTranslateY.current += (targetTranslateY.current - currentTranslateY.current) * 0.1;

      const { x, y } = currentRotation.current;
      const lift = currentLift.current;
      const scale = currentScale.current;
      const transY = currentTranslateY.current;

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1200px) translateY(${transY}px) translateZ(${lift}px) scale(${scale}) rotateX(${x}deg) rotateY(${y}deg)`;
        cardRef.current.style.setProperty('--tilt-x', `${x}`);
        cardRef.current.style.setProperty('--tilt-y', `${y}`);
      }

      const sx = 50 - y * 2;
      const sy = 50 + x * 2;
      if (sheenRef.current) {
        sheenRef.current.style.background = `radial-gradient(circle at ${sx}% ${sy}%, rgba(255, 255, 255, 0.18) 0%, transparent 55%)`;
      }

      const bx = -y * 1.5;
      const by = x * 1.5;
      if (bloomRef.current) {
        bloomRef.current.style.transform = `translate3d(calc(-50% + ${bx}px), calc(-50% + ${by}px), 0px)`;
      }

      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [reducedMotion, edgeShadow, accentColor]);

  return (
    <div className="relative w-full max-w-[340px] h-[540px] flex items-center justify-center z-10">
      {/* 1. Background Bloom */}
      <div 
        ref={bloomRef}
        className="absolute top-1/2 left-1/2 w-[460px] h-[460px] rounded-full pointer-events-none z-0 filter blur-[50px] transition-colors duration-300"
        style={{
          background: `radial-gradient(circle at center, ${bloomColor} 0%, transparent 70%)`,
          opacity: 0.15,
          transform: 'translate3d(-50%, -50%, -120px)',
        }}
      />

      {/* 2. Float Wrapper */}
      <div 
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseLeave}
        className={`relative w-[320px] h-[500px] select-none ${reducedMotion ? '' : 'float-card'}`}
        style={{
          perspective: '1200px',
        }}
      >
        {/* 3. Interactive Card */}
        <div
          ref={cardRef}
          className="relative w-full h-full select-none rounded-[20px] overflow-hidden flex flex-col transition-shadow duration-300 ease-out border border-border-default"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            boxShadow: `${edgeShadow}, 0 2px 8px rgba(28, 27, 25, 0.03)`,
          }}
        >
          {/* Card template content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <TemplatePreview type={card.templateType} data={card.data} slug={card.slug} />
          </div>

          {/* Gloss Sheen Overlay */}
          <div 
            ref={sheenRef}
            className="absolute inset-0 pointer-events-none mix-blend-overlay z-20 rounded-[20px]"
            style={{
              borderRadius: 'inherit',
            }}
          />
        </div>
      </div>
    </div>
  );
}
