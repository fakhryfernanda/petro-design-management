'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../../components/layout/AppLayout'
import { CATEGORIES, getSubCategories1, getSubCategories2 } from '../../../lib/categories'
import { isFileAllowed, isFileTooLarge } from '../../../lib/files'

const PRIORITIES = [
  { label: 'Low',    borderActive: 'border-tertiary-container',  bgActive: 'bg-tertiary-container/10',  dotActive: 'bg-tertiary' },
  { label: 'Medium', borderActive: 'border-primary-container',   bgActive: 'bg-primary-container/10',   dotActive: 'bg-primary' },
  { label: 'High',   borderActive: 'border-secondary-container', bgActive: 'bg-secondary-container/10', dotActive: 'bg-secondary' },
  { label: 'Urgent', borderActive: 'border-error',               bgActive: 'bg-error/10',               dotActive: 'bg-error', isError: true },
]

const isImage = (type) => (type || '').startsWith('image/')

function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function NewRequestClient() {
  const router = useRouter()

  // Basic info
  const [title,       setTitle]       = useState('')
  const [category,    setCategory]    = useState('')
  const [subCategory1, setSubCategory1] = useState('')
  const [subCategory2, setSubCategory2] = useState('')
  const [client,      setClient]      = useState('')

  // Project details
  const [deadline,    setDeadline]    = useState('')
  const [priority,    setPriority]    = useState('Medium')
  const [description, setDescription] = useState('')

  // Project tags
  const [tagType, setTagType] = useState('Regular')

  // Attachments
  const [files, setFiles] = useState([])
  const fileInputRef = useRef(null)

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null) // {done, total}
  const [error,      setError]      = useState('')
  const [failedFiles, setFailedFiles] = useState([]) // {name, reason}

  const sub1Options = category ? getSubCategories1(category) : []
  const sub2Options = category && subCategory1 ? getSubCategories2(category, subCategory1) : []

  const buildPayload = (status) => ({
    title, category, subCategory1, subCategory2, client,
    deadline, priority,
    description, tagType, status,
  })

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || [])
    e.target.value = ''
    if (selected.length === 0) return

    const rejected = []
    const accepted = []
    for (const f of selected) {
      if (!isFileAllowed(f.type)) {
        rejected.push({ name: f.name, reason: 'File type not supported' })
      } else if (isFileTooLarge(f.size)) {
        rejected.push({ name: f.name, reason: 'File too large (max 50MB)' })
      } else {
        accepted.push(f)
      }
    }
    if (rejected.length > 0) {
      setFailedFiles((prev) => [...prev, ...rejected])
    }
    if (accepted.length === 0) return

    setFiles((prev) => [
      ...prev,
      ...accepted.map((f) => ({
        id: `${f.name}-${f.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        previewUrl: isImage(f.type) ? URL.createObjectURL(f) : null,
      })),
    ])
  }

  const removeFailed = (index) => {
    setFailedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeFile = (id) => {
    setFiles((prev) => {
      const removed = prev.find((f) => f.id === id)
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((f) => f.id !== id)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setUploadProgress(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload('Pending')),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error || 'Something went wrong')
        setSubmitting(false)
        return
      }
      const created = await res.json()

      // Upload semua file (opsional) — paralel, dengan progres
      if (files.length > 0) {
        let done = 0
        const total = files.length
        setUploadProgress({ done: 0, total })
        const uploads = files.map(async ({ file }) => {
          const form = new FormData()
          form.append('file', file)
          form.append('type', 'reference')
          const upRes = await fetch(`/api/requests/${created.id}/files`, {
            method: 'POST',
            body: form,
          })
          done += 1
          setUploadProgress({ done, total })
          return upRes.ok
        })
        const results = await Promise.all(uploads)
        if (results.some((ok) => !ok)) {
          console.error('Some file uploads failed')
        }
      }
      setUploadProgress(null)

      files.forEach((f) => { if (f.previewUrl) URL.revokeObjectURL(f.previewUrl) })

      setSubmitting(false)
      router.push(`/requests/${created.id}`)
    } catch (e) {
      console.error('Submit error:', e)
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <AppLayout title="New Request">
      <div className="relative z-10 p-md sm:p-lg max-w-5xl mx-auto">
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <header className="flex justify-between items-end mb-xl">
          <div>
            <h2 className="text-headline-xl text-on-surface">New Request</h2>
            <p className="text-body-lg text-on-surface-variant">Initialize a new design project with the studio.</p>
          </div>
          <div className="flex gap-xs">
            {[1,2,3].map((i) => <div key={i} className="h-1 w-8 rounded-full bg-primary" />)}
          </div>
        </header>

        {error && (
          <div className="mb-lg flex items-center gap-xs bg-error/10 border border-error/30 text-error rounded-lg px-md py-sm text-label-md">
            <span className="material-symbols-outlined text-[18px]">error_outline</span>
            {error}
          </div>
        )}

        <form className="space-y-gutter" onSubmit={handleSubmit}>
          {/* Step 1 — Basic Information */}
          <section className="glass-panel rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">1</span>
              <h3 className="text-headline-md text-on-surface">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Request Title <span className="text-error">*</span></label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Brand Identity Refresh"
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Category <span className="text-error">*</span></label>
                <select
                  required
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setSubCategory1(''); setSubCategory2('') }}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="">— Select category —</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Sub-Category 1 <span className="text-error">*</span></label>
                <select
                  required
                  disabled={!category}
                  value={subCategory1}
                  onChange={(e) => { setSubCategory1(e.target.value); setSubCategory2('') }}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{category ? '— Select sub-category —' : 'Select category first'}</option>
                  {sub1Options.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Sub-Category 2 <span className="text-error">*</span></label>
                <select
                  required
                  disabled={!subCategory1}
                  value={subCategory2}
                  onChange={(e) => setSubCategory2(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{subCategory1 ? '— Select sub-category —' : 'Select sub-category first'}</option>
                  {sub2Options.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Client/Company <span className="text-error">*</span></label>
                <input type="text" required value={client} onChange={(e) => setClient(e.target.value)}
                  placeholder="Client Name"
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
            </div>
          </section>

          {/* Step 2 — Project Details */}
          <section className="glass-panel rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">2</span>
              <h3 className="text-headline-md text-on-surface">Project Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Deadline */}
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Project Deadline</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary appearance-none" />
              </div>

              {/* Priority */}
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Priority Level</label>
                <div className="grid grid-cols-2 gap-xs">
                  {PRIORITIES.map((p) => (
                    <label key={p.label} className="cursor-pointer">
                      <input type="radio" name="priority" value={p.label} checked={priority === p.label} onChange={() => setPriority(p.label)} className="hidden" />
                      <div className={`flex items-center justify-center gap-xs p-sm rounded-lg border transition-all ${
                        priority === p.label ? `${p.borderActive} ${p.bgActive} border` : p.isError ? 'border border-error/20 bg-error/5' : 'border border-white/10 bg-white/5'
                      }`}>
                        <div className={`w-2 h-2 rounded-full transition-colors ${priority === p.label ? p.dotActive : p.isError ? 'bg-error/50' : 'bg-on-surface-variant/50'}`} />
                        <span className={`text-label-md ${p.isError ? 'text-error' : 'text-on-surface'}`}>{p.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-xs md:col-span-2">
                <label className="text-label-md text-on-surface-variant block">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                  placeholder="Describe the project requirements..."
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-y" />
              </div>
            </div>
          </section>

          {/* Step 3 — Tags & Attachments */}
          <section className="glass-panel rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">3</span>
              <h3 className="text-headline-md text-on-surface">Tags &amp; Attachments</h3>
            </div>

            {/* Tag Type */}
            <div className="space-y-xs mb-lg">
              <label className="text-label-md text-on-surface-variant block">Project Tags <span className="text-error">*</span></label>
              <div className="grid grid-cols-2 gap-xs">
                {['Regular', 'Custom'].map((t) => (
                  <label key={t} className="cursor-pointer">
                    <input type="radio" name="tagType" value={t} checked={tagType === t} onChange={() => setTagType(t)} className="hidden" />
                    <div className={`flex items-center justify-center gap-xs p-sm rounded-lg border transition-all ${
                      tagType === t
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/10 bg-white/5 text-on-surface-variant'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">{t === 'Regular' ? 'category' : 'brush'}</span>
                      <span className="text-label-md">{t}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* File upload */}
            <div className="space-y-xs">
              <label className="text-label-md text-on-surface-variant block">Attachments</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl p-md py-lg text-center cursor-pointer hover:border-primary/40 transition-colors group"
              >
                <span className="material-symbols-outlined text-on-surface-variant/40 mb-xs group-hover:text-primary/50 transition-colors text-[28px]">upload_file</span>
                <span className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">Click to attach files</span>
                <span className="text-[11px] text-on-surface-variant/50 mt-xs">Images, PDF, DOC, XLS, PPT, ZIP — max 50MB per file</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                className="hidden"
                onChange={handleFileSelect}
              />

              {failedFiles.length > 0 && (
                <div className="space-y-sm">
                  {failedFiles.map((ff, i) => (
                    <div
                      key={`${ff.name}-${i}`}
                      className="flex items-center gap-sm px-sm py-xs rounded-lg bg-error/5 border border-error/30"
                    >
                      <span className="material-symbols-outlined text-error text-[20px] flex-shrink-0">error</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-label-md text-error truncate">{ff.name}</p>
                        <p className="text-[11px] text-error/70">{ff.reason}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFailed(i)}
                        className="p-xs rounded-lg text-error/70 hover:text-error hover:bg-error/10 transition-colors flex-shrink-0"
                        aria-label={`Dismiss ${ff.name}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {files.length > 0 && (
                <div className="space-y-sm">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-sm px-sm py-xs rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/15 transition-colors"
                    >
                      {f.previewUrl ? (
                        <img src={f.previewUrl} alt={f.name} className="w-10 h-10 rounded object-cover flex-shrink-0 border border-white/10" />
                      ) : (
                        <div className="w-10 h-10 rounded flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                          <span className="material-symbols-outlined text-[20px]">description</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-label-md text-on-surface truncate">{f.name}</p>
                        <p className="text-[11px] text-on-surface-variant/60">{formatSize(f.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        className="p-xs rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors flex-shrink-0"
                        aria-label={`Remove ${f.name}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="flex items-center justify-between pt-lg">
            <button type="button" onClick={() => router.push('/dashboard')}
              className="px-lg py-sm rounded-lg border border-white/10 glass-card text-label-md text-on-surface-variant hover:bg-white/10 transition-colors flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to List
            </button>
            <div className="flex gap-md">
              <button type="submit" disabled={submitting}
                className="gradient-primary px-xl py-sm rounded-lg text-label-md text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-xs">
                {submitting ? (
                  <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                    {uploadProgress
                      ? `Uploading ${uploadProgress.done}/${uploadProgress.total}...`
                      : 'Creating...'}
                  </>
                ) : 'Submit Request'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </AppLayout>
  )
}
