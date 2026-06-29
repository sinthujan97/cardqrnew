'use client';

import { useEffect } from 'react';

const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2616045881002465';

export default function AdSenseLoader() {
  useEffect(() => {
    if (document.querySelector(`script[src="${ADSENSE_SRC}"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = ADSENSE_SRC;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, []);

  return null;
}
