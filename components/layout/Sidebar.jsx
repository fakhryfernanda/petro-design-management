'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const ROLES = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  designer: 'Designer',
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : Promise.resolve({ user: null })))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  // Design Requests (create) hanya admin/super_admin; Users hanya super_admin
  const canCreate = user && (user.role === 'admin' || user.role === 'super_admin')
  const isSuperAdmin = user && user.role === 'super_admin'

  const NAV_ITEMS = [
    { icon: 'dashboard',       label: 'Dashboard',       to: '/dashboard' },
    ...(canCreate ? [{ icon: 'palette', label: 'Design Requests', to: '/requests/new' }] : []),
    { icon: 'inventory_2',     label: 'Archive',         to: '/archive' },
    ...(isSuperAdmin ? [{ icon: 'manage_accounts', label: 'Users', to: '/users' }] : []),
  ]

  const isActive = (to) => {
    if (!to) return false
    if (to === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(to)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-sidebar-collapsed lg:w-sidebar-width bg-surface-container/40 backdrop-blur-xl border-r border-white/10 flex-col py-lg z-50">
      {/* Logo */}
      <div className="mb-lg md:flex md:justify-center lg:justify-start lg:px-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">architecture</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="font-headline-md text-headline-md font-black text-on-surface leading-none">PETRO DESIGN</h1>
            <p className="font-label-md text-label-md text-on-surface-variant opacity-60 text-[10px]">Design Management</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar md:px-2 lg:px-0">
        {NAV_ITEMS.map(({ icon, label, to }) =>
          to ? (
            <Link
              key={label}
              href={to}
              title={label}
              className={`flex items-center md:justify-center lg:justify-start md:px-0 lg:px-md gap-xs py-sm transition-all duration-200 ${
                isActive(to)
                  ? 'text-primary border-l-4 border-primary bg-primary/5'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined flex-shrink-0">{icon}</span>
              <span className="hidden lg:block font-label-md text-label-md">{label}</span>
            </Link>
          ) : (
            <div
              key={label}
              title={label}
              className="cursor-pointer flex items-center md:justify-center lg:justify-start md:px-0 lg:px-md gap-xs py-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200"
            >
              <span className="material-symbols-outlined flex-shrink-0">{icon}</span>
              <span className="hidden lg:block font-label-md text-label-md">{label}</span>
            </div>
          )
        )}
      </nav>

      {/* user */}
      <div className="md:px-2 lg:px-md mt-auto pt-lg">
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            title={user?.name || 'Account'}
            className="w-full flex items-center gap-sm p-sm glass-card rounded-xl text-left transition-colors hover:bg-white/5 md:justify-center lg:justify-start"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30 flex-shrink-0">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
            <div className="hidden lg:block flex-1 min-w-0">
              <p className="font-label-md text-label-md text-on-surface truncate">{user?.name || '...'}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest truncate">
                {user ? (ROLES[user.role] || user.role) : 'Loading'}
              </p>
            </div>
            <span className="hidden lg:block material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
          </button>

          {menuOpen && (
            <div className="absolute bottom-full mb-xs left-0 right-0 glass-panel-high rounded-xl overflow-hidden z-50 shadow-xl">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-xs px-md py-sm text-label-md text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span className="hidden lg:block">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}