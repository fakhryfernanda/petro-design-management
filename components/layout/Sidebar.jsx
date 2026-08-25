'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const ROLES = {
  admin: 'Admin',
  studio_director: 'Studio Director',
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

  const isAdmin = user && (user.role === 'admin' || user.role === 'studio_director')

  const NAV_ITEMS = [
    { icon: 'dashboard',       label: 'Dashboard',       to: '/dashboard' },
    { icon: 'palette',         label: 'Design Requests', to: '/requests/new' },
    { icon: 'inventory_2',     label: 'Archive',         to: '/archive' },
    { icon: 'bar_chart',       label: 'Analytics',       to: '/analytics' },
    ...(isAdmin ? [{ icon: 'manage_accounts', label: 'Users', to: '/users' }] : []),
    { icon: 'settings',        label: 'Settings',         to: null },
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
    <aside className="fixed left-0 top-0 h-screen w-sidebar-width bg-surface-container/40 backdrop-blur-xl border-r border-white/10 flex flex-col py-lg z-50">
      {/* Logo */}
      <div className="px-md mb-lg">
        <h1 className="font-headline-md text-headline-md font-black text-on-surface">PETRO DESIGN</h1>
        <p className="font-label-md text-label-md text-on-surface-variant opacity-60">Design Management</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-base overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map(({ icon, label, to }) =>
          to ? (
            <Link
              key={label}
              href={to}
              className={`flex items-center gap-xs px-md py-sm transition-all duration-200 ${
                isActive(to)
                  ? 'text-primary border-l-4 border-primary bg-primary/5'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="font-label-md text-label-md">{label}</span>
            </Link>
          ) : (
            <div
              key={label}
              className="cursor-pointer flex items-center gap-xs px-md py-sm text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200"
            >
              <span className="material-symbols-outlined">{icon}</span>
              <span className="font-label-md text-label-md">{label}</span>
            </div>
          )
        )}
      </nav>

      {/* New Request + user */}
      <div className="px-md mt-auto pt-lg">
        <button
          onClick={() => router.push('/requests/new')}
          className="w-full primary-gradient text-white font-label-md text-label-md py-sm rounded-xl shadow-lg active:opacity-80 transition-all flex items-center justify-center gap-xs"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Request
        </button>

        <div className="mt-lg relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-full flex items-center gap-sm p-sm glass-card rounded-xl text-left transition-colors hover:bg-white/5"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/30 flex-shrink-0">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label-md text-label-md text-on-surface truncate">{user?.name || '...'}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest truncate">
                {user ? (ROLES[user.role] || user.role) : 'Loading'}
              </p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
          </button>

          {menuOpen && (
            <div className="absolute bottom-full mb-xs left-0 right-0 glass-panel-high rounded-xl overflow-hidden z-50 shadow-xl">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-xs px-md py-sm text-label-md text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}