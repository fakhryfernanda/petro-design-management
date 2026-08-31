import AccountMenu from './AccountMenu'

export default function Header({ title, children }) {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-surface-container/60 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-md sm:px-lg shadow-sm">
      <h2 className="font-headline-md text-headline-md font-bold text-primary truncate">{title}</h2>
      <div className="flex items-center gap-md flex-shrink-0">
        {children}
        <AccountMenu />
      </div>
    </header>
  )
}
