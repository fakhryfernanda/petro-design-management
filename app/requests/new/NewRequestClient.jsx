'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../../components/layout/AppLayout'

const PRIORITIES = [
  { label: 'Low',    borderActive: 'border-tertiary-container',  bgActive: 'bg-tertiary-container/10',  dotActive: 'bg-tertiary' },
  { label: 'Medium', borderActive: 'border-primary-container',   bgActive: 'bg-primary-container/10',   dotActive: 'bg-primary' },
  { label: 'High',   borderActive: 'border-secondary-container', bgActive: 'bg-secondary-container/10', dotActive: 'bg-secondary' },
  { label: 'Urgent', borderActive: 'border-error',               bgActive: 'bg-error/10',               dotActive: 'bg-error', isError: true },
]

const CATEGORIES    = ['UI/UX Design', 'Brand Identity', 'Motion Graphics', 'Marketing Assets', '3D Rendering']
const PROJECT_TYPES = ['Web Design', 'Mobile Design', 'Branding', 'Marketing', 'Packaging', '3D Design', 'Editorial', 'Asset Library']

export default function NewRequestClient() {
  const router = useRouter()

  // Basic info
  const [title,       setTitle]       = useState('')
  const [category,    setCategory]    = useState(CATEGORIES[0])
  const [client,      setClient]      = useState('')
  const [product,     setProduct]     = useState('')

  // Project details
  const [deadline,    setDeadline]    = useState('')
  const [priority,    setPriority]    = useState('Medium')
  const [projectType, setProjectType] = useState('')
  const [description, setDescription] = useState('')

  // Tags
  const [allTags,     setAllTags]     = useState([])
  const [selectedTags, setSelectedTags] = useState([])

  // UI state
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  // Fetch available tags on mount
  useEffect(() => {
    fetch('/api/tags')
      .then((r) => r.json())
      .then(setAllTags)
      .catch(console.error)
  }, [])

  const toggleTag = (name) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    )
  }

  const buildPayload = (status) => ({
    title, category, client, product,
    deadline, priority, projectType,
    description, tags: selectedTags, status,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload('In Progress')),
      })
      if (res.ok) {
        const created = await res.json()
        router.push(`/requests/${created.id}`)
      } else {
        const json = await res.json().catch(() => ({}))
        setError(json.error || 'Something went wrong')
        setSubmitting(false)
      }
    } catch (e) {
      console.error('Submit error:', e)
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <AppLayout title="New Request">
      <div className="relative z-10 p-lg max-w-5xl mx-auto">
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
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary appearance-none">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Client/Company <span className="text-error">*</span></label>
                <input type="text" required value={client} onChange={(e) => setClient(e.target.value)}
                  placeholder="Client Name"
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
              </div>
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Product/Service</label>
                <input type="text" value={product} onChange={(e) => setProduct(e.target.value)}
                  placeholder="Product Name"
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

              {/* Project Type */}
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Project Type</label>
                <select value={projectType} onChange={(e) => setProjectType(e.target.value)}
                  className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary appearance-none">
                  <option value="">— Select type —</option>
                  {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
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

            {/* Tags */}
            <div className="space-y-xs mb-lg">
              <label className="text-label-md text-on-surface-variant block">Project Tags</label>
              <div className="flex flex-wrap gap-xs">
                {allTags.map((tag) => {
                  const active = selectedTags.includes(tag.name)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.name)}
                      className={`px-sm py-1 rounded-lg text-[12px] border transition-all ${
                        active
                          ? 'bg-primary/20 border-primary text-primary'
                          : 'bg-white/5 border-white/10 text-on-surface-variant hover:border-primary/40'
                      }`}
                    >
                      {active && <span className="material-symbols-outlined text-[12px] mr-0.5 align-middle">check</span>}
                      {tag.name}
                    </button>
                  )
                })}
              </div>
              {selectedTags.length > 0 && (
                <p className="text-[11px] text-on-surface-variant/60">{selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected</p>
              )}
            </div>

            {/* File upload */}
            {/* File upload — available after submit */}
            <div className="flex items-start gap-sm p-md rounded-xl bg-white/[0.02] border border-white/5">
              <span className="material-symbols-outlined text-on-surface-variant/50 mt-0.5">info</span>
              <p className="text-label-md text-on-surface-variant/70">
                Reference files can be uploaded from the project detail page after the request is created.
              </p>
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
                  <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Creating...</>
                ) : 'Submit Request'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </AppLayout>
  )
}
