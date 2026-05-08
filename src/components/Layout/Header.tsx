import { useState, useEffect, useCallback } from 'react';

interface HeaderProps {
  mode: 'planner' | 'replanner';
  onModeChange: (mode: 'planner' | 'replanner') => void;
  hasPlan: boolean;
}

/**
 * Unified header bar with logo, centered tabs, and dark mode toggle.
 * Reads/writes theme to localStorage under 'wayshift-theme'.
 */
export function Header({ mode, onModeChange, hasPlan }: HeaderProps) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('wayshift-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark class on <html> element
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('wayshift-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = useCallback(() => setIsDark((prev) => !prev), []);

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 sticky top-0 z-50">
      {/* Left: Logo + wordmark */}
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="28" height="28" rx="8" fill="#6366f1"/>
          <path d="M7 14 C7 9, 14 5, 21 9" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M7 14 C7 19, 14 23, 21 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" fill="none"/>
          <circle cx="21" cy="14" r="3" fill="white"/>
          <circle cx="7" cy="14" r="2" fill="#a5b4fc"/>
        </svg>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg text-slate-900 dark:text-white tracking-tight">Wayshift</span>
          <span className="hidden sm:block text-xs text-slate-400 dark:text-slate-500">Plan once. Replan instantly.</span>
        </div>
      </div>

      {/* Center: Tab buttons */}
      <div role="tablist" aria-label="Application mode" className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 gap-1">
        <button
          role="tab"
          id="tab-planner"
          aria-selected={mode === 'planner'}
          aria-controls="panel-planner"
          data-selected={mode === 'planner'}
          onClick={() => onModeChange('planner')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all
            ${mode === 'planner'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          ✈️ Plan a Trip
        </button>
        <button
          role="tab"
          id="tab-replanner"
          aria-selected={mode === 'replanner'}
          aria-controls="panel-replanner"
          data-selected={mode === 'replanner'}
          onClick={() => onModeChange('replanner')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5
            ${mode === 'replanner'
              ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
        >
          💬 Replan / Chat
          {hasPlan && <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />}
        </button>
      </div>

      {/* Right: Dark mode toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="w-8 h-8 flex items-center justify-center rounded-lg
          hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400
          transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
