'use client'

import { useState, useEffect, useCallback } from 'react'
import AppLayout from '../../components/layout/AppLayout'

const ROLE_LABEL = {
  designer:    'Designer',
  admin:       'Admin',
  super_admin: 'Super Admin',
}

const ROLE_STYLE = {
  designer:    'bg-primary/20 text-primary border border-primary/30',
  admin:       'bg-tertiary/20 text-tertiary border border-tertiary/30',
  super_admin: 'bg-secondary/20 text-secondary border border-secondary/30',
}

function RoleBadge({ role }) {
  return (
    <span className={`px-sm py-0.5 rounded-full text-[10px] font-bold ${ROLE_STYLE[role] || ROLE_STYLE.designer}`}>
      {ROLE_LABEL[role] || role}
    </span>
  )
}

export default function UserListClient() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | {mode:'create'} | {mode:'edit', user}
  const [form, setForm] = useState({ name: '', email: '', role: 'designer', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (res.ok) setUsers(await res.json())
    } catch (e) {
      console.error('Fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openCreate = () => {
    setForm({ name: '', email: '', role: 'designer', password: '' })
    setError('')
    setModal({ mode: 'create' })
  }

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role, password: '' })
    setError('')
    setModal({ mode: 'edit', user })
  }

  const handleSave = async () => {
    setError('')
    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required')
      return
    }
    if (modal.mode === 'create' && !form.password) {
      setError('Password is required')
      return
    }
    setSaving(true)
    try {
      const url = modal.mode === 'create'
        ? '/api/users'
        : `/api/users/${modal.user.id}`
      const res = await fetch(url, {
        method: modal.mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setModal(null)
        fetchUsers()
      } else {
        const json = await res.json().catch(() => ({}))
        setError(json.error || 'Failed to save')
      }
    } catch (e) {
      console.error('Save error:', e)
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    if (!confirm(`Delete ${user.name}? Their requests will be unassigned.`)) return
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
      if (res.ok) fetchUsers()
    } catch (e) {
      console.error('Delete error:', e)
    }
  }

  return (
    <AppLayout title="Users">
      <div className="p-md sm:p-lg space-y-lg">
        <div className="flex items-center justify-between">
          <p className="text-label-md text-on-surface-variant">{users.length} users</p>
          <button onClick={openCreate}
            className="primary-gradient text-white font-label-md text-label-md px-md py-sm rounded-xl flex items-center gap-xs shadow-lg hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add User
          </button>
        </div>

        <div className="glass-panel rounded-xl overflow-hidden w-full min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="text-on-surface-variant text-label-sm uppercase tracking-wider bg-white/[0.02]">
                  <th className="px-md py-sm font-medium">User</th>
                  <th className="px-md py-sm font-medium">Email</th>
                  <th className="px-md py-sm font-medium">Role</th>
                  <th className="px-md py-sm font-medium">Active</th>
                  <th className="px-md py-sm font-medium">Completed</th>
                  <th className="px-md py-sm font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [1,2,3,4].map((i) => (
                    <tr key={i}>
                      {[1,2,3].map((j) => (
                        <td key={j} className="px-md py-md"><div className="h-4 bg-white/10 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : users.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* User cell — shows name + role badge on mobile */}
                    <td className="px-md py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-primary text-[18px]">account_circle</span>
                        </div>
                        <span className="text-label-md font-medium text-on-surface">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-md py-md text-label-sm text-on-surface-variant max-w-[140px] truncate">{u.email}</td>
                    <td className="px-md py-md whitespace-nowrap"><RoleBadge role={u.role} /></td>
                    <td className="px-md py-md text-label-sm text-primary font-bold">{u.activeCount}</td>
                    <td className="px-md py-md text-label-sm text-green-400">{u.completedCount}</td>
                    <td className="px-md py-md">
                      <div className="flex gap-xs justify-end">
                        <button onClick={() => openEdit(u)}
                          className="p-xs rounded-lg text-on-surface-variant hover:text-primary hover:bg-white/5 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(u)}
                          className="p-xs rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-md" onClick={() => !saving && setModal(null)}>
          <div className="glass-panel-high rounded-2xl p-md w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-md">
              <h3 className="text-headline-md text-on-surface">{modal.mode === 'create' ? 'Add User' : 'Edit User'}</h3>
              <button onClick={() => setModal(null)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-sm">
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary appearance-none">
                  {Object.entries(ROLE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </div>
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">
                  Password {modal.mode === 'edit' && <span className="text-on-surface-variant/50 text-[11px]">(kosongkan utk tidak ubah)</span>}
                </label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={modal.mode === 'edit' ? '••••••' : ''}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>

              {error && (
                <p className="flex items-center gap-xs text-error text-label-sm bg-error/10 border border-error/30 rounded-lg px-sm py-xs">
                  <span className="material-symbols-outlined text-[16px]">error_outline</span>
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-sm pt-sm">
                <button onClick={() => setModal(null)} disabled={saving}
                  className="px-md py-xs rounded-lg border border-white/10 text-label-md text-on-surface-variant hover:bg-white/5 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="primary-gradient px-md py-xs rounded-lg text-label-md text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-xs">
                  {saving ? <><span className="material-symbols-outlined animate-spin text-[16px]">sync</span> Saving...</> : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}