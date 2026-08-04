'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../../components/layout/AppLayout'

const PRIORITIES = [
  { label: 'Low',    borderActive: 'border-tertiary-container',  bgActive: 'bg-tertiary-container/10',  dotActive: 'bg-tertiary' },
  { label: 'Medium', borderActive: 'border-primary-container',   bgActive: 'bg-primary-container/10',   dotActive: 'bg-primary', defaultChecked: true },
  { label: 'High',   borderActive: 'border-secondary-container', bgActive: 'bg-secondary-container/10', dotActive: 'bg-secondary' },
  { label: 'Urgent', borderActive: 'border-error',               bgActive: 'bg-error/10',               dotActive: 'bg-error', isError: true },
]

const CATEGORIES = ['UI/UX Design', 'Brand Identity', 'Motion Graphics', 'Marketing Assets', '3D Rendering']

export default function NewRequestClient() {
  const router = useRouter()
  const [priority, setPriority] = useState('Medium')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); router.push('/dashboard') }, 2000)
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

        <form className="space-y-gutter" onSubmit={handleSubmit}>
          {/* Step 1 */}
          <section className="glass-panel rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">1</span>
              <h3 className="text-headline-md text-on-surface">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {[
                { label: 'Request Title',   placeholder: 'e.g. Q4 Brand Identity Refresh', type: 'text' },
                { label: 'Client/Company',  placeholder: 'Client Name',                    type: 'text' },
                { label: 'Product/Service', placeholder: 'Product Name',                   type: 'text' },
              ].map(({ label, placeholder, type }) => (
                <div key={label} className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant block">{label}</label>
                  <input type={type} placeholder={placeholder}
                    className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
                </div>
              ))}
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Category</label>
                <select className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary appearance-none">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section className="glass-panel rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">2</span>
              <h3 className="text-headline-md text-on-surface">Project Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant block">Project Deadline</label>
                <input type="date" className="w-full bg-surface-container-highest border border-white/10 rounded-lg px-md py-sm text-on-surface focus:outline-none focus:border-primary appearance-none" />
              </div>
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
            </div>
          </section>

          {/* Step 3 */}
          <section className="glass-panel rounded-xl p-lg">
            <div className="flex items-center gap-sm mb-lg">
              <span className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">3</span>
              <h3 className="text-headline-md text-on-surface">Attachments &amp; References</h3>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-xl flex flex-col items-center justify-center text-center space-y-md hover:border-primary/50 transition-colors cursor-pointer group bg-white/[0.02]">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-4xl">cloud_upload</span>
              </div>
              <div>
                <p className="text-body-lg text-on-surface">Click to upload or drag and drop</p>
                <p className="text-label-md text-on-surface-variant">PDF, PNG, JPG, or SVG (max. 50MB)</p>
              </div>
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
              <button type="button" className="px-lg py-sm rounded-lg border border-white/10 glass-card text-label-md text-on-surface-variant hover:bg-white/10 transition-colors">
                Save Draft
              </button>
              <button type="submit" disabled={submitting}
                className="gradient-primary px-xl py-sm rounded-lg text-label-md text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-xs">
                {submitting ? (
                  <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Sending...</>
                ) : 'Submit Request'}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </AppLayout>
  )
}
