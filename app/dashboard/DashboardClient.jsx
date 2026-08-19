'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import ProgressBar from '../../components/ui/ProgressBar'

const DOT = {
  'In Progress': 'bg-primary shadow-primary/50',
  'Review':      'bg-tertiary shadow-tertiary/50',
  'Revision':    'bg-secondary shadow-secondary/50',
  'Completed':   'bg-green-400 shadow-green-400/50',
  'On Hold':     'bg-outline shadow-outline/50',
}

// Warna untuk pie chart per status
const PIE_COLORS = {
  'In Progress': 'text-primary',
  'Review':      'text-tertiary',
  'Revision':    'text-secondary',
  'On Hold':     'text-surface-container-highest',
}

const DOT_COLORS = {
  'In Progress': 'bg-primary',
  'Review':      'bg-tertiary',
  'Revision':    'bg-secondary',
  'On Hold':     'bg-surface-container-highest',
}

function SummarySkeleton() {
  return (
    <div className="glass-card rounded-xl p-md space-y-sm animate-pulse">
      <div className="h-3 bg-white/10 rounded w-1/2" />
      <div className="h-8 bg-white/10 rounded w-1/3" />
    </div>
  )
}

export default function DashboardClient() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <AppLayout title="Dashboard">
        <div className="p-lg space-y-lg">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {[1, 2, 3, 4].map((i) => <SummarySkeleton key={i} />)}
          </section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 glass-card rounded-xl p-md animate-pulse h-64" />
            <div className="glass-card rounded-xl p-md animate-pulse h-64" />
          </div>
        </div>
      </AppLayout>
    )
  }

  const { stats, recentRequests, statusDistribution, activeTotal } = data

  // Hitung stroke-dasharray untuk pie chart dinamis
  let offset = 0
  const segments = statusDistribution.map((s) => {
    const seg = { ...s, offset }
    offset += s.pct
    return seg
  })

  const summaryCards = [
    { label: 'Total Requests',   value: stats.totalRequests.toLocaleString(), sub: '+12% from last month', subColor: 'text-primary',           icon: 'analytics',      iconColor: 'text-primary' },
    { label: 'Pending',          value: String(stats.pending),              progress: stats.pending,                                         icon: 'hourglass_empty', iconColor: 'text-on-surface-variant' },
    { label: 'Completed',        value: stats.completed.toLocaleString(),   sub: `${stats.completedPct}% Success Rate`, subColor: 'text-tertiary-fixed-dim', icon: 'check_circle',   iconColor: 'text-tertiary-fixed-dim' },
    { label: 'Active Designers', value: String(stats.activeDesigners),      avatars: true,                                                   icon: 'groups',         iconColor: 'text-secondary' },
  ]

  return (
    <AppLayout title="Dashboard">
      <div className="p-lg space-y-lg">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {summaryCards.map((c) => (
            <div key={c.label} className="glass-card rounded-xl p-md space-y-sm hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-on-surface-variant">{c.label}</span>
                <span className={`material-symbols-outlined ${c.iconColor}`}>{c.icon}</span>
              </div>
              <div>
                <h4 className="text-headline-lg font-bold text-on-surface">{c.value}</h4>
                {c.sub && <p className={`text-[12px] mt-1 ${c.subColor}`}>{c.sub}</p>}
                {c.progress != null && (
                  <div className="w-full h-1 bg-surface-container-highest rounded-full mt-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                  </div>
                )}
                {c.avatars && (
                  <div className="flex -space-x-2 mt-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-surface-container bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[12px]">person</span>
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-surface-container flex items-center justify-center text-[10px] text-on-surface-variant">
                      +{Math.max(0, stats.activeDesigners - 3)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Table */}
          <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="px-md py-sm border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-label-md text-label-md text-on-surface">Recent Requests</h3>
              <button onClick={() => router.push('/archive')} className="text-primary font-label-sm text-label-sm hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    {['Project Name', 'Client', 'Status', 'Progress'].map((h) => (
                      <th key={h} className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentRequests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-md py-lg text-center text-on-surface-variant">No requests yet</td>
                    </tr>
                  ) : recentRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => router.push(`/requests/${r.id}`)}>
                      <td className="px-md py-sm">
                        <div className="flex items-center gap-xs">
                          <div className={`w-2 h-2 rounded-full ${DOT[r.status] || 'bg-outline'}`} />
                          <span className="font-label-md text-label-md text-on-surface">{r.title}</span>
                        </div>
                      </td>
                      <td className="px-md py-sm text-label-md text-on-surface-variant">{r.client}</td>
                      <td className="px-md py-sm"><StatusBadge status={r.status} /></td>
                      <td className="px-md py-sm">
                        <div className="flex items-center gap-sm">
                          <ProgressBar value={r.progress} />
                          <span className="text-[11px] text-on-surface-variant">{r.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="glass-card rounded-xl p-md flex flex-col items-center">
            <h3 className="font-label-md text-label-md text-on-surface w-full mb-lg">Status Summary</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {segments.map((s) => (
                  <path
                    key={s.status}
                    className={`${PIE_COLORS[s.status] || 'text-outline'} stroke-current`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeDasharray={`${s.pct}, 100`}
                    strokeDashoffset={-s.offset}
                    strokeLinecap="round"
                    strokeWidth="4"
                  />
                ))}
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-headline-md font-bold">{activeTotal}</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Active</span>
              </div>
            </div>
            <div className="w-full mt-lg grid grid-cols-2 gap-sm">
              {statusDistribution.map((s) => (
                <div key={s.status} className="flex items-center gap-xs">
                  <div className={`w-3 h-3 rounded-sm ${DOT_COLORS[s.status]}`} />
                  <span className="text-[12px] text-on-surface-variant">{s.status} ({s.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
