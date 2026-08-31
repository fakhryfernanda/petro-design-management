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
      .then((d) => setIsAdmin(d.user?.role === 'super_admin'))
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
      {/* Slots: Dashboard | Archive | Users(admin) */}
      <div
        className="grid h-[64px]"
        style={{
          gridTemplateColumns: '1fr 1fr 1fr',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <NavItem icon="dashboard"   label="Dashboard" to="/dashboard" />
        <NavItem icon="inventory_2" label="Archive"   to="/archive"   />

        {isAdmin
          ? <NavItem icon="manage_accounts" label="Users" to="/users" />
          : <div />
        }
      </div>
    </nav>
  )
}
