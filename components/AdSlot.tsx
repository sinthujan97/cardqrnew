'use client';

import React from 'react';
import { ADSENSE_CONFIG } from '@/lib/adConfig';

interface AdSlotProps {
  slotId: string;
  variant?: 'horizontal' | 'vertical' | 'leaderboard';
}

export default function AdSlot({ slotId, variant = 'horizontal' }: AdSlotProps) {
  const adUnitCode = ADSENSE_CONFIG.AD_UNITS[slotId] || 'ad-unit-placeholder';
  const publisherId = ADSENSE_CONFIG.PUBLISHER_ID;

  if (variant === 'leaderboard') {
    return (
      <div className="flex flex-col items-center gap-1 select-none" aria-hidden="true">
        <span className="text-[8px] font-mono tracking-widest text-muted-text/40 uppercase">
          Advertisement
        </span>
        {/* Reserved container — min-h prevents CLS when ad loads late */}
        <div className="w-[320px] min-h-[50px] md:w-[728px] md:min-h-[90px] bg-surface-2/30 border border-border-default flex items-center justify-center relative overflow-hidden">
          {/* TODO: Once approved, replace placeholder below with the real AdSense <ins> tag:

              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '320px', height: '50px' }}
                   data-ad-client={publisherId}
                   data-ad-slot={adUnitCode}
                   data-ad-format="fixed"
                   data-full-width-responsive="false"></ins>
              <script>
                   (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
          */}
          <div className="flex flex-col items-center gap-0.5 text-center">
            <span className="text-[10px] font-mono text-muted-text/45 uppercase tracking-wider">
              Ad space
            </span>
            <span className="text-[8px] font-mono text-muted-text/30">
              ID: {slotId}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className="flex flex-col items-center gap-1.5 select-none shrink-0" aria-hidden="true">
        {/* Required by Google AdSense policy: Ads must be clearly labeled */}
        <span className="text-[9px] font-mono tracking-widest text-muted-text/50 uppercase">
          Advertisement
        </span>

        {/* Skyscraper container matching a standard 300x600 unit */}
        <div className="w-[300px] min-h-[600px] bg-surface-2/30 paper-grain border border-border-default rounded-xl flex items-center justify-center relative overflow-hidden">
          {/* TODO: Once approved, replace the placeholder below with the real AdSense <ins> tag:
              
              <ins className="adsbygoogle"
                   style={{ display: 'block', width: '300px', height: '600px' }}
                   data-ad-client={publisherId}
                   data-ad-slot={adUnitCode}
                   data-ad-format="vertical"
                   data-full-width-responsive="false"></ins>
              <script>
                   (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
          */}
          <div className="flex flex-col items-center gap-1 text-center px-4">
            <span className="text-[10px] font-mono text-muted-text/45 uppercase tracking-wider">
              Ad space
            </span>
            <span className="text-[8px] font-mono text-muted-text/30">
              ID: {slotId}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-1.5 py-8 select-none my-6" aria-hidden="true">
      {/* Required by Google AdSense policy: Ads must be clearly labeled */}
      <span className="text-[9px] font-mono tracking-widest text-muted-text/50 uppercase">
        Advertisement
      </span>

      {/* Ad container with reserved heights to prevent cumulative layout shift (CLS) */}
      <div className="w-full max-w-[300px] md:max-w-[728px] min-h-[250px] md:min-h-[90px] bg-surface-2/30 border border-border-default rounded-xl flex items-center justify-center relative overflow-hidden">
        
        {/* TODO: Once approved, replace the placeholder below with the real AdSense <ins> tag:
            
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client={publisherId}
                 data-ad-slot={adUnitCode}
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        */}
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-[10px] font-mono text-muted-text/45 uppercase tracking-wider">
            Ad space
          </span>
          <span className="text-[8px] font-mono text-muted-text/30">
            ID: {slotId}
          </span>
        </div>

      </div>
    </div>
  );
}
