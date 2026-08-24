'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [editing, setEditing] = useState(false)
  const [descDraft, setDescDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

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

  const startEdit = () => {
    setDescDraft(request.description || '')
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setDescDraft('')
  }

  const saveDescription = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: descDraft }),
      })
      if (res.ok) {
        const updated = await res.json()
        setRequest((prev) => ({ ...prev, ...updated }))
        setEditing(false)
        notify()
      }
    } catch (e) {
      console.error('Save error:', e)
    } finally {
      setSaving(false)
    }
  }

  const files      = request?.files || []
  const imageFiles = files.filter((f) => f.mimeType !== 'application/pdf')
  const pdfFiles   = files.filter((f) => f.mimeType === 'application/pdf')

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = () => setLightboxIndex((i) => (i + 1) % imageFiles.length)
  const prevImage = () => setLightboxIndex((i) => (i - 1 + imageFiles.length) % imageFiles.length)

  function formatSize(bytes) {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`/api/requests/${id}/files`, { method: 'POST', body: form })
      if (res.ok) {
        const newFile = await res.json()
        setRequest((prev) => ({ ...prev, files: [...prev.files, newFile] }))
        notify()
      } else {
        const json = await res.json().catch(() => ({}))
        console.error('Upload failed:', json.error)
      }
    } catch (e) {
      console.error('Upload error:', e)
    } finally {
      setUploading(false)
    }
  }

  // Keyboard navigation untuk lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, files.length])

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
              {!editing && (
                <button onClick={startEdit} className="text-on-surface-variant hover:text-primary flex items-center gap-xs transition-colors">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  <span className="text-label-md">Edit</span>
                </button>
              )}
            </div>

            {editing ? (
              <div>
                <textarea
                  value={descDraft}
                  onChange={(e) => setDescDraft(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg p-sm text-body-md text-on-surface placeholder:text-on-surface-variant/40 resize-y min-h-[120px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="Write a description..."
                  autoFocus
                />
                <div className="flex justify-end gap-sm mt-sm">
                  <button
                    onClick={cancelEdit}
                    className="px-md py-xs rounded-lg border border-white/10 text-label-md text-on-surface-variant hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveDescription}
                    disabled={saving}
                    className="primary-gradient px-md py-xs rounded-lg text-label-md text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-xs"
                  >
                    {saving ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                        Saving...
                      </>
                    ) : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {request.description || 'No description provided.'}
              </p>
            )}
            <div className="mt-lg pt-md border-t border-white/10 space-y-md">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h4 className="text-label-md text-on-surface">Reference Files ({files.length})</h4>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-xs text-label-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  {uploading
                    ? <><span className="material-symbols-outlined animate-spin text-[16px]">sync</span> Uploading...</>
                    : <><span className="material-symbols-outlined text-[16px]">upload</span> Upload</>
                  }
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.svg"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Empty state */}
              {files.length === 0 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-sm py-lg text-center cursor-pointer hover:border-primary/40 transition-colors group"
                >
                  <span className="material-symbols-outlined text-on-surface-variant/40 mb-xs group-hover:text-primary/50 transition-colors">upload_file</span>
                  <span className="text-[12px] text-on-surface-variant/60 group-hover:text-on-surface-variant transition-colors">Click to upload a reference file</span>
                </div>
              )}

              {/* Images grid */}
              {imageFiles.length > 0 && (
                <div>
                  <p className="text-[11px] text-on-surface-variant/50 uppercase tracking-widest mb-xs">Images</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
                    {imageFiles.map((file, i) => (
                      <div
                        key={file.id}
                        className="group relative aspect-video rounded-lg overflow-hidden glass-panel border border-white/10 cursor-pointer"
                      >
                        <img
                          src={file.url}
                          alt={file.name}
                          onClick={() => openLightbox(i)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-sm transition-opacity">
                          <button
                            onClick={() => openLightbox(i)}
                            className="p-xs rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-sm hover:border-primary/50 transition-colors cursor-pointer group aspect-video"
                    >
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary mb-xs">add_photo_alternate</span>
                      <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary uppercase tracking-tighter">Add Image</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents list */}
              {pdfFiles.length > 0 && (
                <div>
                  <p className="text-[11px] text-on-surface-variant/50 uppercase tracking-widest mb-xs">Documents</p>
                  <div className="space-y-xs">
                    {pdfFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-sm px-sm py-xs rounded-lg glass-card hover:border-white/20 hover:bg-white/5 transition-all group"
                      >
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-sm flex-1 min-w-0"
                        >
                          <span className="material-symbols-outlined text-error text-[24px] flex-shrink-0">picture_as_pdf</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-label-md text-on-surface truncate">{file.name}</p>
                            {file.size && <p className="text-[11px] text-on-surface-variant/60">{formatSize(file.size)}</p>}
                          </div>
                          <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[18px] flex-shrink-0">open_in_new</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add file button when files exist but no images yet */}
              {files.length > 0 && imageFiles.length === 0 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-xs text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                  Add image reference
                </button>
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
                { label: 'Client',       value: request.client,             cls: '' },
                { label: 'Deadline',     value: deadline,                   cls: 'text-error', icon: 'calendar_today' },
                { label: 'Project Type', value: request.projectType || '—', cls: '' },
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

      {/* Lightbox — images only */}
      {lightboxIndex !== null && imageFiles[lightboxIndex] && (() => {
        const current = imageFiles[lightboxIndex]
        return (
          <div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md"
            onClick={closeLightbox}
          >
            <img
              src={current.url}
              alt={current.name}
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close */}
            <div className="absolute top-lg right-lg flex gap-sm z-10">
              <button
                onClick={closeLightbox}
                className="p-sm rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Prev / Next */}
            {imageFiles.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage() }}
                  className="absolute left-md top-1/2 -translate-y-1/2 p-md rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[28px]">chevron_left</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage() }}
                  className="absolute right-md top-1/2 -translate-y-1/2 p-md rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[28px]">chevron_right</span>
                </button>
              </>
            )}

            {/* Caption + counter + thumbnails */}
            <div className="absolute bottom-lg inset-x-0 flex flex-col items-center gap-sm pointer-events-none">
              <p className="text-white text-label-md font-medium drop-shadow">{current.name}</p>
              {imageFiles.length > 1 && (
                <p className="text-white/60 text-label-sm">{lightboxIndex + 1} / {imageFiles.length}</p>
              )}
              {imageFiles.length > 1 && (
                <div className="mt-xs flex gap-sm flex-wrap justify-center pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  {imageFiles.map((f, i) => (
                    <button
                      key={f.id}
                      onClick={() => setLightboxIndex(i)}
                      className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === lightboxIndex ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    >
                      <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })()}

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
