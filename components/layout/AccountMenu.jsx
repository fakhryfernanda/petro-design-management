'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const ROLES = {
  admin: 'Admin',
  studio_director: 'Studio Director',
  designer: 'Designer',
}

export default function AccountMenu() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user))
      .catch(() => {})
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  const handleLogout = async () => {
    setOpen(false)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center hover:bg-primary/30 transition-colors"
      >
        <span className="material-symbols-outlined text-primary text-[18px]">account_circle</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-xs glass-panel-high rounded-xl shadow-2xl z-50 min-w-[180px] overflow-hidden">
          {user && (
            <div className="px-md py-sm border-b border-white/5">
              <p className="text-label-md text-on-surface font-medium truncate">{user.name}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                {ROLES[user.role] || user.role}
              </p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-xs px-md py-sm text-label-md text-error hover:bg-error/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
