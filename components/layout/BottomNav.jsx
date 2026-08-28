'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setIsAdmin(d.user?.role === 'admin' || d.user?.role === 'studio_director'))
      .catch(() => {})
  }, [])

  const isActive = (to) => {
    if (to === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(to)
  }

  const NavItem = ({ icon, label, to }) => (
    <Link
      href={to}
      className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
        isActive(to) ? 'text-primary' : 'text-on-surface-variant'
      }`}
    >
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      <span className="text-[9px] font-semibold">{label}</span>
    </Link>
  )

  return (
    <nav className="fixed bottom-0 inset-x-0 z-[200] md:hidden bg-surface-container/80 backdrop-blur-xl border-t border-white/10">
      {/* 5-slot: Dashboard | Archive | FAB | Analytics | Users(admin) */}
      <div
        className="grid h-[64px]"
        style={{
          gridTemplateColumns: '1fr 1fr 64px 1fr 1fr',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <NavItem icon="dashboard"   label="Dashboard" to="/dashboard" />
        <NavItem icon="inventory_2" label="Archive"   to="/archive"   />

        {/* FAB — New Request */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => router.push('/requests/new')}
            className="w-12 h-12 rounded-full primary-gradient text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform -mt-4"
            aria-label="New Request"
          >
            <span className="material-symbols-outlined text-[24px]">add</span>
          </button>
        </div>

        <NavItem icon="bar_chart" label="Analytics" to="/analytics" />

        {/* Slot 5: Users untuk admin, kosong untuk non-admin */}
        {isAdmin
          ? <NavItem icon="manage_accounts" label="Users" to="/users" />
          : <div />
        }
      </div>
    </nav>
  )
}
