/**
 * Header component with app logo, title, and tagline.
 * Premium dark design with gradient accent.
 */
export function Header() {
  return (
    <header className="relative overflow-hidden border-b border-white/5">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-violet-600/10" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-accent shadow-lg shadow-purple-500/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <path d="M12 8L8 10.5V15.5L12 18L16 15.5V10.5L12 8Z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="12" cy="13" r="2" fill="white" />
            </svg>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span className="gradient-text">Wayshift</span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] font-light tracking-wide">
              Plan once. Replan instantly. Understand why.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
