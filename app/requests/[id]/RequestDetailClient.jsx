'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../../components/layout/AppLayout'

const TIMELINE = [
  { label: 'Status changed to', highlight: 'In Progress', highlightColor: 'text-primary',            time: 'Today, 10:45 AM by Sarah Chen',         active: true },
  { label: 'Status changed to', highlight: 'Review',      highlightColor: 'text-on-surface-variant', time: 'Yesterday, 04:20 PM by Design Bot',      active: false },
  { label: 'Project created',   highlight: null,                                                      time: 'Oct 24, 2023 by Alex Rivera',            active: false },
]

const TAGS = ['UI/UX', 'Figma', 'WebGL', 'React', 'Landing Page']

const MESSAGES = [
  {
    sender: 'Sarah Chen', time: '10:48 AM', isMine: false,
    text: "Hey team, I've updated the hero section with the glassmorphism effects. Let me know if the contrast on the CTA is sufficient for the dark theme.",
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCuwyWLVuLGA4P6UILIo-oh9c9bikL68Nv0q4kBicVjNX961roiu8ZiTaKlT2G-Ev26_E0usioLikYYNIW3O7f4SVELH_0bSO9SdRGNH5VOUlIJV4Qw2yvQIxVYXRWFt4M9yogAFzGHgF_VP9SwXDgWk1e6QcZWrPvfB906W2XibK-mLH80JQDeIKALTVdjGe2L_ghPdMygOH0RoPt2dXffitKB_HarDdCRuhzxShq1dxdoqUN8TAYSg',
  },
  {
    sender: 'Alex Rivera (You)', time: '11:02 AM', isMine: true,
    text: "The contrast looks great on my monitor. The blur radius is perfect. Let's proceed with the mobile responsive version next.",
  },
]

export default function RequestDetailClient({ id }) {
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [showToast, setShowToast] = useState(false)

  const postComment = () => {
    setShowToast(true)
    setComment('')
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <AppLayout
      title="PROJECT-882: Neo-Genesis Landing Page"
      headerActions={<span className="px-sm py-1 rounded-full text-[12px] font-bold status-in-progress">IN PROGRESS</span>}
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
              Design a high-conversion landing page for the &apos;Neo-Genesis&apos; NFT platform. The aesthetic should align with our &apos;Digital Studio&apos; vibe: deep, immersive backgrounds contrasted with vibrant, translucent UI layers. Ensure the layout is fluid and supports a 12-column grid. Key sections include: Hero with animated shader, Live Auction grid, Artist Spotlight bento-grid, and a translucent Footer.
            </p>
            <div className="mt-lg pt-md border-t border-white/10">
              <h4 className="text-label-md text-on-surface mb-sm">Reference Files (2)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
                {[
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuB4dJ6ezCaf9BW8FgA6wGw1jE07LoqjYsKe0XupIaOp-M3TtzMKZpZ7o5vOY4SZhNKYpijpFBJXowLUzESTzJRPmr732ehxm8PjaMlkRy71fsfbUT-vI-4IQtBYYcSfOd80B22WPIoYZCiYhMN-A7rnnVLHA-D0qRHqnIxi3WQ8dA8e7g6yOp-qrMrgi0Feg3wFU7uj_SSqF3XKJoiJerPc7mSu4laO5nNCa61FD0e3ihZPJBfPceVFbw',
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBxICXbNpxAqFhlVsSScnevdTYK6CtHvpKHFEC8rDXsY6NZqrHZ8LUWtDqwSUW2MCoJ2VmwNUHj8QDoNmz1m4jm1S_E7S4Q8Ayt91PLCmzIqXsMlfEQLBziPNG79jo0fFkaCsFN-ViorE83osVivMoo0BW0U6PgPmwEmVulm7c9mnZaQMAjhOZNb4f51msiKhgnkdS1IZoW25O1tFkHSu2SjD6nZ4nBFkz71XgGVH6WQCvW0yRlT81x8w',
                ].map((src, i) => (
                  <div key={i} className="group relative aspect-video rounded-lg overflow-hidden glass-panel border border-white/10 cursor-pointer">
                    <img src={src} alt={`Reference ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
            </div>
          </section>

          {/* Timeline */}
          <section className="glass-panel rounded-xl p-md">
            <h3 className="text-headline-md text-on-surface mb-md">Timeline</h3>
            <div className="space-y-sm">
              {TIMELINE.map((item, i) => (
                <div key={i} className={`relative pl-8 ${i < TIMELINE.length - 1 ? 'before:absolute before:left-[7px] before:top-6 before:bottom-0 before:w-0.5 before:bg-white/10' : ''}`}>
                  <div className={`absolute left-0 top-1 w-4 h-4 rounded-full ${item.active ? 'bg-primary ring-4 ring-primary/10' : 'bg-on-surface-variant/40'}`} />
                  <p className="text-label-md text-on-surface">
                    {item.label}{' '}
                    {item.highlight && <span className={`font-bold ${item.highlightColor}`}>{item.highlight}</span>}
                  </p>
                  <p className="text-[12px] text-on-surface-variant opacity-60">{item.time}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Discussion */}
          <section className="glass-panel rounded-xl p-md">
            <h3 className="text-headline-md text-on-surface mb-lg">Discussion</h3>
            <div className="space-y-md mb-lg">
              {MESSAGES.map((msg, i) => (
                <div key={i} className={`flex gap-sm ${msg.isMine ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-full flex-shrink-0 border border-white/10 overflow-hidden bg-primary/20">
                    {msg.avatar
                      ? <img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-primary text-[20px]">account_circle</span></div>
                    }
                  </div>
                  <div className={`p-sm rounded-xl max-w-lg shadow-lg ${msg.isMine ? 'primary-gradient rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none'}`}>
                    <div className="flex justify-between items-center mb-xs gap-md">
                      <span className={`text-label-md font-medium ${msg.isMine ? 'text-white' : 'text-primary'}`}>{msg.sender}</span>
                      <span className={`text-[10px] opacity-60 ${msg.isMine ? 'text-white' : 'text-on-surface-variant'}`}>{msg.time}</span>
                    </div>
                    <p className={`text-body-md ${msg.isMine ? 'text-white' : 'text-on-surface-variant'}`}>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-panel-high rounded-xl p-sm">
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Write feedback or ask a question..."
                className="w-full bg-transparent border-none outline-none text-body-md placeholder:text-on-surface-variant/40 resize-none min-h-[80px] custom-scrollbar text-on-surface" />
              <div className="flex justify-between items-center mt-sm pt-sm border-t border-white/10">
                <div className="flex items-center gap-xs">
                  {['attach_file','sentiment_satisfied'].map((icon) => (
                    <button key={icon} className="p-xs hover:bg-white/5 rounded-lg text-on-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </button>
                  ))}
                </div>
                <button onClick={postComment} className="bg-primary/20 text-primary border border-primary/30 px-md py-sm rounded-lg text-label-md hover:bg-primary/30 transition-colors active:scale-95">
                  Post Comment
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          <div className="glass-panel-high rounded-xl p-md space-y-md sticky top-24">
            <h3 className="text-label-md text-on-surface-variant uppercase tracking-widest mb-sm">Project Info</h3>
            <div className="space-y-sm">
              {[
                { label: 'Client',       value: 'Genesis Collective', cls: '' },
                { label: 'Deadline',     value: 'Oct 31, 2023',       cls: 'text-error', icon: 'calendar_today' },
                { label: 'Project Type', value: 'Web Design',          cls: '' },
                { label: 'Budget',       value: '$4,500',              cls: 'text-tertiary' },
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
                <span className="text-on-surface font-bold text-label-md">Sarah Chen</span>
              </div>
            </div>
            <div className="pt-md">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-xs">Progress</p>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full primary-gradient w-[65%] rounded-full" />
              </div>
              <div className="flex justify-between mt-xs">
                <span className="text-[12px] text-on-surface-variant">65% Completed</span>
                <span className="text-[12px] text-on-surface-variant">Milestone 3/5</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-sm pt-md">
              {[{icon:'download',label:'Export PDF',color:'text-primary'},{icon:'history',label:'Version Log',color:'text-secondary'}].map(({icon,label,color})=>(
                <button key={label} className="flex flex-col items-center justify-center p-sm glass-panel rounded-xl hover:bg-white/10 transition-colors group">
                  <span className={`material-symbols-outlined mb-xs group-hover:scale-110 transition-transform ${color}`}>{icon}</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">{label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => router.push('/archive')}
              className="w-full py-sm rounded-xl border border-white/10 text-on-surface-variant text-label-md hover:bg-error/10 hover:text-error hover:border-error/20 transition-all flex items-center justify-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">archive</span>
              Archive Project
            </button>
          </div>
          <section className="glass-panel rounded-xl p-md">
            <h3 className="text-label-md text-on-surface-variant uppercase tracking-widest mb-md">Project Tags</h3>
            <div className="flex flex-wrap gap-xs">
              {TAGS.map((tag) => (
                <span key={tag} className="px-sm py-1 bg-white/5 border border-white/10 rounded-lg text-[12px] text-on-surface-variant hover:border-primary/40 cursor-default transition-colors">{tag}</span>
              ))}
            </div>
          </section>
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
