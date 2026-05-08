interface HeaderProps {
  mode: 'planner' | 'replanner';
  onModeChange: (mode: 'planner' | 'replanner') => void;
  hasPlan: boolean;
}

/**
 * Header bar with Google-colored branding, centered tabs.
 * Light mode only — no dark toggle.
 */
export function Header({ mode, onModeChange, hasPlan }: HeaderProps) {
  return (
    <>
      {/* Google color bar at very top */}
      <div className="google-color-bar" />

      <header className="w-full flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-50">
        {/* Left: Logo + wordmark */}
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#4285F4"/>
            <path d="M8 16 C8 10, 16 6, 24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M8 16 C8 22, 16 26, 24 22" stroke="#FBBC04" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" fill="none"/>
            <circle cx="24" cy="16" r="3.5" fill="white"/>
            <circle cx="8" cy="16" r="2.5" fill="#34A853"/>
          </svg>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-gray-900 tracking-tight">Wayshift</span>
            <span className="hidden sm:block text-xs text-gray-400 font-medium">Plan once. Replan instantly.</span>
          </div>
        </div>

        {/* Center: Tab buttons */}
        <div role="tablist" aria-label="Application mode" className="flex bg-gray-100 rounded-lg p-1 gap-1">
          <button
            role="tab"
            id="tab-planner"
            aria-selected={mode === 'planner'}
            aria-controls="panel-planner"
            onClick={() => onModeChange('planner')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              mode === 'planner'
                ? 'bg-white shadow-sm text-[#4285F4]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            ✈️ Plan a Trip
          </button>
          <button
            role="tab"
            id="tab-replanner"
            aria-selected={mode === 'replanner'}
            aria-controls="panel-replanner"
            onClick={() => onModeChange('replanner')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
              mode === 'replanner'
                ? 'bg-white shadow-sm text-[#4285F4]'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            💬 Replan / Chat
            {hasPlan && <span className="w-2 h-2 bg-[#34A853] rounded-full inline-block" />}
          </button>
        </div>

        {/* Right: Powered by Gemini badge */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>Powered by</span>
          <span className="font-semibold text-[#4285F4]">Gemini</span>
        </div>
      </header>
    </>
  );
}
