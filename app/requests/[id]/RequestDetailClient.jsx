'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../../components/layout/AppLayout'

// ── Status style map ──────────────────────────────────────────
const STATUS_STYLE = {
  'Completed':   'bg-gradient-to-r from-green-500 to-emerald-400 text-white border-transparent',
  'In Progress': 'status-in-progress',
  'Review':      'border border-tertiary text-tertiary bg-tertiary/10',
  'Revision':    'border border-secondary text-secondary bg-secondary/10',
  'On Hold':     'border border-outline text-outline bg-outline/10',
}

const getStatusStyle = (s) => STATUS_STYLE[s] ?? STATUS_STYLE['On Hold']

// ── Format helpers ────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

function formatCurrency(num) {
  if (num == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)
}

// ── Skeleton ──────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="p-lg grid grid-cols-12 gap-gutter">
      <div className="col-span-12 lg:col-span-8 space-y-gutter">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-panel rounded-xl p-md animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/3 mb-md" />
            <div className="h-3 bg-white/5 rounded w-full mb-xs" />
            <div className="h-3 bg-white/5 rounded w-5/6 mb-xs" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        ))}
      </div>
      <div className="col-span-12 lg:col-span-4">
        <div className="glass-panel-high rounded-xl p-md animate-pulse h-96" />
      </div>
    </div>
  )
}

export default function RequestDetailClient({ id }) {
  const router = useRouter()
  const [request, setRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    fetch(`/api/requests/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true)
          return null
        }
        return r.json()
      })
      .then((data) => { if (data) setRequest(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const notify = () => {
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  if (loading) {
    return <AppLayout title="Loading..."><DetailSkeleton /></AppLayout>
  }

  if (notFound || !request) {
    return (
      <AppLayout title="Project Not Found">
        <div className="p-lg flex flex-col items-center justify-center py-xl text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-md">error_outline</span>
          <p className="text-body-md text-on-surface-variant">Project not found</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-lg px-md py-sm rounded-xl primary-gradient text-white text-label-md"
          >
            Back to Dashboard
          </button>
        </div>
      </AppLayout>
    )
  }

  const deadline = request.deadline ? formatDate(request.deadline) : '—'

  // Timeline sederhana dari createdAt + updatedAt
  const timeline = [
    {
      label: 'Last updated',
      highlight: null,
      time: formatDateTime(request.updatedAt),
      active: true,
    },
    {
      label: 'Project created',
      highlight: null,
      time: formatDateTime(request.createdAt),
      active: false,
    },
  ]

  return (
    <AppLayout
      title={request.title}
      headerActions={
        <span className={`px-sm py-1 rounded-full text-[12px] font-bold ${getStatusStyle(request.status)}`}>
          {request.status.toUpperCase()}
        </span>
      }
    >
      <div className="px-lg pt-md">
        <button onClick={() => router.push('/dashboard')}
          className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors text-label-md">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Dashboard
        </button>
      </div>

      <div className="p-lg grid grid-cols-12 gap-gutter">
        {/* Left */}
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          {/* Tags */}
          <section className="glass-panel rounded-xl p-md">
            <h3 className="text-label-md text-on-surface-variant uppercase tracking-widest mb-md">Project Tags</h3>
            <div className="flex flex-wrap gap-xs">
              {request.tags.length === 0 ? (
                <span className="text-[12px] text-on-surface-variant/50">No tags</span>
              ) : request.tags.map((tag) => (
                <span key={tag} className="px-sm py-1 bg-white/5 border border-white/10 rounded-lg text-[12px] text-on-surface-variant hover:border-primary/40 cursor-default transition-colors">{tag}</span>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="glass-panel rounded-xl p-md">
            <div className="flex justify-between items-start mb-md">
              <h3 className="text-headline-md text-on-surface">Description</h3>
              <button className="text-on-surface-variant hover:text-primary flex items-center gap-xs transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span className="text-label-md">Edit</span>
              </button>
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {request.description || 'No description provided.'}
            </p>
            <div className="mt-lg pt-md border-t border-white/10">
              <h4 className="text-label-md text-on-surface mb-sm">Reference Files ({request.files.length})</h4>
              {request.files.length === 0 ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-sm py-lg text-center">
                  <span className="material-symbols-outlined text-on-surface-variant/40 mb-xs">image</span>
                  <span className="text-[12px] text-on-surface-variant/60">No reference files</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
                  {request.files.map((file) => (
                    <div key={file.id} className="group relative aspect-video rounded-lg overflow-hidden glass-panel border border-white/10 cursor-pointer">
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="material-symbols-outlined text-white">visibility</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-sm hover:border-primary/50 transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary mb-xs">add_circle</span>
                    <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary uppercase tracking-tighter">Add Reference</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Timeline */}
          <section className="glass-panel rounded-xl p-md">
            <h3 className="text-headline-md text-on-surface mb-md">Timeline</h3>
            <div className="space-y-sm">
              {timeline.map((item, i) => (
                <div key={i} className={`relative pl-8 ${i < timeline.length - 1 ? 'before:absolute before:left-[7px] before:top-6 before:bottom-0 before:w-0.5 before:bg-white/10' : ''}`}>
                  <div className={`absolute left-0 top-1 w-4 h-4 rounded-full ${item.active ? 'bg-primary ring-4 ring-primary/10' : 'bg-on-surface-variant/40'}`} />
                  <p className="text-label-md text-on-surface">
                    {item.label}{' '}
                    {item.highlight && <span className="font-bold text-primary">{item.highlight}</span>}
                  </p>
                  <p className="text-[12px] text-on-surface-variant opacity-60">{item.time}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="col-span-12 lg:col-span-4">
          <div className="glass-panel-high rounded-xl p-md space-y-md sticky top-24">
            <h3 className="text-label-md text-on-surface-variant uppercase tracking-widest mb-sm">Project Info</h3>
            <div className="space-y-sm">
              {[
                { label: 'Client',       value: request.client,        cls: '' },
                { label: 'Deadline',     value: deadline,              cls: 'text-error', icon: 'calendar_today' },
                { label: 'Project Type', value: request.projectType || '—', cls: '' },
                { label: 'Budget',       value: formatCurrency(request.budget), cls: 'text-tertiary' },
              ].map(({ label, value, cls, icon }) => (
                <div key={label} className="flex justify-between items-center py-sm border-b border-white/5">
                  <span className="text-on-surface-variant opacity-60 text-label-md">{label}</span>
                  <span className={`font-bold text-label-md flex items-center gap-xs ${cls || 'text-on-surface'}`}>
                    {icon && <span className="material-symbols-outlined text-[16px]">{icon}</span>}
                    {value}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center py-sm border-b border-white/5">
                <span className="text-on-surface-variant opacity-60 text-label-md">Assigned Designer</span>
                <span className="text-on-surface font-bold text-label-md">{request.assignedDesigner?.name || 'Unassigned'}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="pt-md">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-xs">Progress</p>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full primary-gradient rounded-full" style={{ width: `${request.progress || 0}%` }} />
              </div>
              <div className="flex justify-between mt-xs">
                <span className="text-[12px] text-on-surface-variant">{request.progress || 0}% Completed</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-sm pt-md">
              {[
                { icon: 'download', label: 'Export PDF',  color: 'text-primary' },
                { icon: 'history',  label: 'Version Log', color: 'text-secondary' },
              ].map(({ icon, label, color }) => (
                <button key={label} className="flex flex-col items-center justify-center p-sm glass-panel rounded-xl hover:bg-white/10 transition-colors group">
                  <span className={`material-symbols-outlined mb-xs group-hover:scale-110 transition-transform ${color}`}>{icon}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">{label}</span>
                </button>
              ))}
            </div>

            <button onClick={notify}
              className="w-full py-sm rounded-xl border border-white/10 text-on-surface-variant text-label-md hover:bg-error/10 hover:text-error hover:border-error/20 transition-all flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">archive</span>
              Archive Project
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={`fixed bottom-lg right-lg glass-panel-high rounded-xl p-md flex items-center gap-md transition-all duration-500 z-50 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
        <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
          <span className="material-symbols-outlined">check_circle</span>
        </div>
        <div>
          <p className="font-bold text-on-surface text-label-md">Update Saved</p>
          <p className="text-[12px] text-on-surface-variant">Changes have been synced successfully.</p>
        </div>
      </div>
    </AppLayout>
  )
}
