export default function Header({ title, children }) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-surface-container/60 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-lg shadow-sm">
      <h2 className="font-headline-md text-headline-md font-bold text-primary">{title}</h2>
      <div className="flex items-center gap-md">
        {/* Search */}
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input
            className="bg-surface-container-highest/40 border border-white/10 rounded-full py-xs pl-xl pr-md text-label-md focus:ring-1 focus:ring-primary focus:border-primary w-64 outline-none transition-all placeholder:text-on-surface-variant/50"
            placeholder="Search projects..."
            type="text"
          />
        </div>
        {/* Actions slot */}
        {children}
        {/* Icons */}
        <button className="p-xs hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-xs hover:bg-white/5 rounded-full transition-colors text-on-surface-variant">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  )
}
