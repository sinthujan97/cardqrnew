'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('cardqr-theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      aria-label={mounted && isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`boxy-sm w-9 h-9 shrink-0 rounded-none bg-surface hover:bg-surface-2 text-primary flex items-center justify-center cursor-pointer ${className}`}
    >
      {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
