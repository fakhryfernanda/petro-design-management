'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../../components/layout/AppLayout'

// ── Status style map ──────────────────────────────────────────
const STATUS_STYLE = {
  'Completed':   'bg-gradient-to-r from-green-500 to-emerald-400 text-white border-transparent shadow-sm',
  'Pending':     'bg-white/10 text-on-surface-variant border border-white/20 shadow-sm',
  'In Progress': 'bg-primary/20 text-primary border border-primary/50 shadow-sm',
  'Accepted':    'bg-tertiary/20 text-tertiary border border-tertiary/50 shadow-sm',
  'On Revision': 'bg-secondary/20 text-secondary border border-secondary/50 shadow-sm',
}

const getStatusStyle = (s) => STATUS_STYLE[s] ?? STATUS_STYLE['Pending']

// ── Priority style map ────────────────────────────────────────
const PRIORITY_STYLE = {
  'Low':    'bg-tertiary/20 text-tertiary border border-tertiary/50',
  'Medium': 'bg-primary/20 text-primary border border-primary/50',
  'High':   'bg-secondary/20 text-secondary border border-secondary/50',
  'Urgent': 'bg-error/20 text-error border border-error/50',
}

const getPriorityStyle = (p) => PRIORITY_STYLE[p] ?? PRIORITY_STYLE['Medium']

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

// Ikon per ekstensi dokumen
function docIcon(name = '', mimeType = '') {
  const ext = (name.split('.').pop() || '').toLowerCase()
  if (ext === 'pdf' || mimeType === 'application/pdf') return 'picture_as_pdf'
  if (['doc', 'docx'].includes(ext)) return 'description'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'table_chart'
  if (['ppt', 'pptx'].includes(ext)) return 'slideshow'
  if (['zip'].includes(ext)) return 'folder_zip'
  return 'description'
}

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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

// ── File card (Reference / Designer) ─────────────────────────
function FileCard({
  title,
  type,
  files,
  images,
  documents,
  uploading,
  uploadError,
  onUpload,
  onOpenLightbox,
  canUpload,
  alwaysShowImages = false,
}) {
  const inputRef = useRef(null)

  return (
    <section className="glass-panel rounded-xl p-md">
      <div className="flex items-center justify-between mb-md">
        <h3 className="text-headline-md text-on-surface">
          {title}
          <span className="text-on-surface-variant/60 ml-xs">({files.length})</span>
        </h3>
        {canUpload && (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-xs text-label-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            {uploading
              ? <><span className="material-symbols-outlined animate-spin text-[16px]">sync</span> Uploading...</>
              : <><span className="material-symbols-outlined text-[16px]">upload</span> Upload</>
            }
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
          className="hidden"
          onChange={(e) => onUpload(e, type)}
        />
      </div>

      {uploadError && (
        <div className="flex items-center gap-sm px-sm py-xs rounded-lg bg-error/5 border border-error/30 mb-md">
          <span className="material-symbols-outlined text-error text-[18px] flex-shrink-0">error</span>
          <p className="text-label-md text-error flex-1">{uploadError}</p>
        </div>
      )}

      {files.length === 0 && (
        <div
          onClick={() => canUpload && inputRef.current?.click()}
          className={`flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-sm py-lg text-center ${canUpload ? 'cursor-pointer hover:border-primary/40 transition-colors group' : ''}`}
        >
          <span className="material-symbols-outlined text-on-surface-variant/40 mb-xs group-hover:text-primary/50 transition-colors">upload_file</span>
          <span className="text-[12px] text-on-surface-variant/60 group-hover:text-on-surface-variant transition-colors">
            {canUpload ? 'Click to upload a file' : 'No files yet'}
          </span>
        </div>
      )}

      {(images.length > 0 || alwaysShowImages) && (
        <div>
          <p className="text-[11px] text-on-surface-variant/50 uppercase tracking-widest mb-xs">Images</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
            {images.map((file, i) => (
              <div
                key={file.id}
                className="group relative aspect-video rounded-lg overflow-hidden glass-panel border border-white/10 cursor-pointer"
              >
                <img
                  src={file.url}
                  alt={file.name}
                  onClick={() => onOpenLightbox(type, i)}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
            {canUpload && (
              <div
                onClick={() => inputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-sm hover:border-primary/50 transition-colors cursor-pointer group aspect-video"
              >
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary mb-xs">add_photo_alternate</span>
                <span className="text-[10px] font-bold text-on-surface-variant group-hover:text-primary uppercase tracking-tighter">Add Image</span>
              </div>
            )}
            {!canUpload && images.length === 0 && (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-lg p-sm aspect-video">
                <span className="material-symbols-outlined text-on-surface-variant/40 mb-xs">image</span>
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter">No Image</span>
              </div>
            )}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div>
          <p className="text-[11px] text-on-surface-variant/50 uppercase tracking-widest mb-xs">Documents</p>
          <div className="space-y-xs">
            {documents.map((file) => (
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
                  <span className="material-symbols-outlined text-primary text-[24px] flex-shrink-0">{docIcon(file.name, file.mimeType)}</span>
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

      {files.length > 0 && images.length === 0 && canUpload && (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-xs text-label-sm text-on-surface-variant hover:text-primary transition-colors mt-md"
        >
          <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
          Add image
        </button>
      )}
    </section>
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
  const [lightboxType, setLightboxType] = useState('reference')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const uploadErrorTimer = useRef(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [designers, setDesigners] = useState([])
  const [savingDesigner, setSavingDesigner] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const STATUSES = ['Pending', 'In Progress', 'Accepted', 'On Revision', 'Completed']

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

  // Fetch available designers untuk dropdown assignment
  useEffect(() => {
    fetch('/api/users?role=designer')
      .then((r) => r.json())
      .then(setDesigners)
      .catch(() => setDesigners([]))
  }, [])

  // Fetch current user role untuk kontrol upload designer files
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setCurrentUser(data.user))
      .catch(() => setCurrentUser(null))
  }, [])

  useEffect(() => {
    return () => clearTimeout(uploadErrorTimer.current)
  }, [])

  const handleAssignDesigner = async (designerId) => {
    const value = designerId ? parseInt(designerId) : null
    if (value === request.assignedDesignerId) return
    setSavingDesigner(true)
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedDesignerId: value }),
      })
      if (res.ok) {
        const updated = await res.json()
        setRequest((prev) => ({ ...prev, ...updated }))
        notify()
      }
    } catch (e) {
      console.error('Assign error:', e)
    } finally {
      setSavingDesigner(false)
    }
  }

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

  const changeStatus = async (newStatus) => {
    setStatusOpen(false)
    if (newStatus === request.status) return
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        const updated = await res.json()
        setRequest((prev) => ({ ...prev, ...updated }))
        notify()
      }
    } catch (e) {
      console.error('Status error:', e)
    }
  }

  const files              = request?.files || []
  const referenceFiles     = files.filter((f) => f.type !== 'designer')
  const designerFiles      = files.filter((f) => f.type === 'designer')
  const referenceImages    = referenceFiles.filter((f) => (f.mimeType || '').startsWith('image/'))
  const referenceDocuments = referenceFiles.filter((f) => !(f.mimeType || '').startsWith('image/'))
  const designerImages     = designerFiles.filter((f) => (f.mimeType || '').startsWith('image/'))
  const designerDocuments  = designerFiles.filter((f) => !(f.mimeType || '').startsWith('image/'))

  // Designer & super admin bisa edit; admin view-only
  const canEdit           = currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'designer')
  const canUploadDesigner = canEdit
  const canUploadReference = !!currentUser

  const openLightbox = (type, index) => {
    setLightboxType(type)
    setLightboxIndex(index)
  }
  const closeLightbox = () => setLightboxIndex(null)
  const activeImages = lightboxType === 'designer' ? designerImages : referenceImages
  const nextImage = () => setLightboxIndex((i) => (i + 1) % activeImages.length)
  const prevImage = () => setLightboxIndex((i) => (i - 1 + activeImages.length) % activeImages.length)

  const handleFileSelect = async (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploadError('')
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('type', type)
      const res = await fetch(`/api/requests/${id}/files`, { method: 'POST', body: form })
      if (res.ok) {
        const newFile = await res.json()
        setRequest((prev) => ({ ...prev, files: [...prev.files, newFile] }))
        notify()
      } else {
        const json = await res.json().catch(() => ({}))
        setUploadError(json.error || 'Upload failed')
        clearTimeout(uploadErrorTimer.current)
        uploadErrorTimer.current = setTimeout(() => setUploadError(''), 3000)
      }
    } catch (e) {
      console.error('Upload error:', e)
      setUploadError('Upload failed')
      clearTimeout(uploadErrorTimer.current)
      uploadErrorTimer.current = setTimeout(() => setUploadError(''), 3000)
    } finally {
      setUploading(false)
    }
  }

  // Keyboard navigation untuk lightbox
  useEffect(() => {
    if (!statusOpen) return
    const close = (e) => { if (!e.target.closest('[data-status-dropdown]')) setStatusOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [statusOpen])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, lightboxType, files.length])

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

  // Timeline — riwayat perubahan status (terbaru di atas) + Project created
  const timeline = [
    ...(request.statusLogs || []).map((log) => ({
      label: 'Project status changed to',
      highlight: log.to,
      time: formatDateTime(log.createdAt),
      active: true,
    })),
    {
      label: 'Project created',
      time: formatDateTime(request.createdAt),
      active: true,
    },
  ].sort((a, b) => new Date(b.time) - new Date(a.time))

  return (
    <AppLayout
      title="Project Details"
    >
      <div className="px-md sm:px-lg pt-md">
        <button onClick={() => router.push('/dashboard')}
          className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors text-label-md">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Dashboard
        </button>
      </div>

      <div className="p-md sm:p-lg grid grid-cols-12 gap-gutter">
        {/* Left */}
        <div className="col-span-12 lg:col-span-8 space-y-gutter">
          {/* Title */}
          <div className="px-xs">
            <h1 className="text-headline-lg text-on-surface font-black leading-tight">{request.title}</h1>
          </div>

          {/* Description */}
          <section className="glass-panel rounded-xl p-md">
            <div className="flex justify-between items-start mb-md">
              <h3 className="text-headline-md text-on-surface">Description</h3>
              {canEdit && !editing && (
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
          </section>

          {/* Reference Files */}
          <FileCard
            title="Reference Files"
            type="reference"
            files={referenceFiles}
            images={referenceImages}
            documents={referenceDocuments}
            uploading={uploading}
            uploadError={uploadError}
            onUpload={handleFileSelect}
            onOpenLightbox={openLightbox}
            canUpload={canUploadReference}
            alwaysShowImages
          />

          {/* Designer Files */}
          <FileCard
            title="Designer Files"
            type="designer"
            files={designerFiles}
            images={designerImages}
            documents={designerDocuments}
            uploading={uploading}
            uploadError={uploadError}
            onUpload={handleFileSelect}
            onOpenLightbox={openLightbox}
            canUpload={canUploadDesigner}
          />

          {/* Timeline */}
          <section className="glass-panel rounded-xl p-md">
            <h3 className="text-headline-md text-on-surface mb-md">Timeline</h3>
            <div className="space-y-sm">
              {timeline.map((item, i) => (
                <div key={i} className={`relative pl-8 ${i < timeline.length - 1 ? 'before:absolute before:left-[7px] before:top-6 before:bottom-0 before:w-0.5 before:bg-white/10' : ''}`}>
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/10" />
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
          <div className="glass-panel-high rounded-xl p-md space-y-md lg:sticky lg:top-24">
            <h3 className="text-label-md text-on-surface-variant uppercase tracking-widest mb-sm">Project Info</h3>
            <div className="space-y-sm">
              {/* Project Tags */}
              <div className="flex justify-between items-center py-sm border-b border-white/5">
                <span className="text-on-surface-variant opacity-60 text-label-md">Project Tags</span>
                <span className={`px-sm py-1 rounded-lg text-[12px] inline-flex items-center gap-xs border ${
                  request.tagType === 'Custom'
                    ? 'border-secondary/40 text-secondary bg-secondary/10'
                    : 'border-primary/40 text-primary bg-primary/10'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">{request.tagType === 'Custom' ? 'brush' : 'category'}</span>
                  {request.tagType === 'Regular' || request.tagType === 'Reguler' ? 'Regular' : request.tagType || 'Regular'}
                </span>
              </div>
              {/* Status */}
              <div className="flex justify-between items-center py-sm border-b border-white/5">
                <span className="text-on-surface-variant opacity-60 text-label-md">Status</span>
                {canEdit ? (
                  <div className="relative" data-status-dropdown>
                    <button
                      onClick={() => setStatusOpen((o) => !o)}
                      className={`px-sm py-1 rounded-full text-[12px] font-bold flex items-center gap-xs hover:opacity-80 transition-opacity ${getStatusStyle(request.status)}`}
                    >
                      {request.status}
                      <span className="material-symbols-outlined text-[14px]">expand_more</span>
                    </button>
                    {statusOpen && (
                      <div className="absolute right-0 top-full mt-xs glass-panel-high rounded-xl overflow-hidden z-50 min-w-[160px] shadow-xl">
                        {STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => changeStatus(s)}
                            className={`w-full text-left px-md py-sm text-label-md hover:bg-white/10 transition-colors flex items-center gap-xs ${s === request.status ? 'text-primary' : 'text-on-surface'}`}
                          >
                            {s === request.status && <span className="material-symbols-outlined text-[14px]">check</span>}
                            {s !== request.status && <span className="w-[14px]" />}
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className={`px-sm py-1 rounded-full text-[12px] font-bold ${getStatusStyle(request.status)}`}>
                    {request.status}
                  </span>
                )}
              </div>
              {/* Priority */}
              <div className="flex justify-between items-center py-sm border-b border-white/5">
                <span className="text-on-surface-variant opacity-60 text-label-md">Priority</span>
                <span className={`px-sm py-1 rounded-full text-[12px] font-bold ${getPriorityStyle(request.priority)}`}>
                  {request.priority}
                </span>
              </div>
              {[
                { label: 'Client',       value: request.client,             cls: '' },
                { label: 'Deadline',     value: deadline,                   cls: 'text-error', icon: 'calendar_today' },
                { label: 'Category',     value: request.category,           cls: '' },
                ...(request.subCategory1 ? [{ label: 'Sub-Category', value: request.subCategory1, cls: '' }] : []),
                ...(request.subCategory2 ? [{ label: 'Detail', value: request.subCategory2, cls: '' }] : []),
              ].map(({ label, value, cls, icon }) => (
                <div key={label} className="flex justify-between items-center py-sm border-b border-white/5">
                  <span className="text-on-surface-variant opacity-60 text-label-md">{label}</span>
                  <span className={`font-bold text-label-md flex items-center gap-xs ${cls || 'text-on-surface'}`}>
                    {icon && <span className="material-symbols-outlined text-[16px]">{icon}</span>}
                    {value}
                  </span>
                </div>
              ))}
              <div className="flex flex-col gap-xs py-sm border-b border-white/5">
                <span className="text-on-surface-variant opacity-60 text-label-md">Assigned Designer</span>
                {canEdit ? (
                  <div className="flex items-center gap-xs">
                    {savingDesigner && <span className="material-symbols-outlined animate-spin text-[14px] text-on-surface-variant">sync</span>}
                    <select
                      value={request.assignedDesignerId || ''}
                      onChange={(e) => handleAssignDesigner(e.target.value)}
                      className="flex-1 bg-surface-container-highest border border-white/10 rounded-lg px-sm py-xs text-label-md text-on-surface focus:outline-none focus:border-primary appearance-none cursor-pointer hover:border-white/20 transition-colors"
                    >
                      <option value="">Unassigned</option>
                      {designers.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <span className="text-label-md text-on-surface">
                    {request.assignedDesigner?.name || <span className="text-on-surface-variant/50">Unassigned</span>}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox — images only */}
      {lightboxIndex !== null && activeImages[lightboxIndex] && (() => {
        const current = activeImages[lightboxIndex]
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
            {activeImages.length > 1 && (
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
              {activeImages.length > 1 && (
                <p className="text-white/60 text-label-sm">{lightboxIndex + 1} / {activeImages.length}</p>
              )}
              {activeImages.length > 1 && (
                <div className="mt-xs flex gap-sm flex-wrap justify-center pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                  {activeImages.map((f, i) => (
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
