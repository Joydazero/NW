'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-lg bg-[#F7F6F3] dark:bg-neutral-900 border border-[#E1E1E1] dark:border-neutral-800 hover:bg-[#E1E1E1] dark:hover:bg-neutral-800 transition-all active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        // Sun icon for Dark mode (Switch to light)
        <svg fill="none" className="w-4.5 h-4.5 text-yellow-500" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        // Moon icon for Light mode (Switch to dark) - Notion Style Charcoal color
        <svg fill="none" className="w-4.5 h-4.5 text-[#37352F]" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}
