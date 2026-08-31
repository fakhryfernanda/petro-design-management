'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function DesignerSelect({ requestId, currentDesigner, onChange }) {
  const [open, setOpen] = useState(false)
  const [designers, setDesigners] = useState([])
  const [saving, setSaving] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    fetch('/api/users?role=designer')
      .then((r) => r.json())
      .then(setDesigners)
      .catch(() => setDesigners([]))
  }, [])

  const toggle = (e) => {
    e.stopPropagation()
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left })
    }
    setOpen((o) => !o)
  }

  useEffect(() => {
    if (!open) return
    const onClickOutside = (e) => {
      if (buttonRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const onClose = () => setOpen(false)
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('scroll', onClose, true)
    window.addEventListener('resize', onClose)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('scroll', onClose, true)
      window.removeEventListener('resize', onClose)
    }
  }, [open])

  const assign = async (designerId) => {
    const value = designerId ? parseInt(designerId) : null
    if (value === currentDesigner) {
      setOpen(false)
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedDesignerId: value }),
      })
      if (res.ok) {
        const updated = await res.json()
        onChange(updated)
      }
    } catch (err) {
      console.error('Assign error:', err)
    } finally {
      setSaving(false)
      setOpen(false)
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        className="flex items-center gap-xs max-w-full hover:bg-white/5 rounded-lg px-xs py-0.5 transition-colors"
      >
        <span className="text-label-md text-on-surface truncate">
          {currentDesigner?.name || <span className="text-on-surface-variant/50">Unassigned</span>}
        </span>
        <span className="material-symbols-outlined text-on-surface-variant/60 text-[14px] flex-shrink-0">expand_more</span>
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[100] min-w-[180px] bg-surface-container-high border border-white/15 rounded-xl overflow-hidden shadow-xl"
          style={{ top: pos.top, left: pos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => assign(null)}
            className={`w-full text-left px-md py-sm text-label-md hover:bg-white/10 transition-colors flex items-center gap-xs ${currentDesigner === null ? 'text-primary' : 'text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[14px]">person_off</span> Unassigned
          </button>
          {designers.map((d) => (
            <button
              key={d.id}
              onClick={() => assign(d.id)}
              className={`w-full text-left px-md py-sm text-label-md hover:bg-white/10 transition-colors flex items-center gap-xs ${d.id === currentDesigner?.id ? 'text-primary' : 'text-on-surface'}`}
            >
              {d.id === currentDesigner?.id && <span className="material-symbols-outlined text-[14px]">check</span>}
              {d.id !== currentDesigner?.id && <span className="w-[14px]" />}
              {d.name}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  )
}
