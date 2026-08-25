'use client'

import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'

// ── Helpers ───────────────────────────────────────────────────
const STATUS_COLOR = {
  'Completed':   '#22c55e',
  'In Progress': '#3B82F6',
  'Review':      '#4cd7f6',
  'Revision':    '#8B5CF6',
  'On Hold':     '#8c909f',
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/10 rounded-lg ${className}`} />
}

// ── Pie chart (dynamic segments) ─────────────────────────────
function PieChart({ data, total }) {
  let offset = 0
  const segments = data.map((d) => {
    const seg = { ...d, offset }
    offset += d.pct
    return seg
  })
  return (
    <div className="flex flex-1 items-center gap-lg">
      <div className="relative w-44 h-44 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" fill="none" r="15.9" stroke="#2d3449" strokeWidth="3" />
          {segments.map((s) => (
            <circle key={s.status} cx="18" cy="18" fill="none" r="15.9"
              stroke={STATUS_COLOR[s.status] || '#8c909f'}
              strokeDasharray={`${s.pct} 100`}
              strokeDashoffset={-s.offset}
              strokeLinecap="round" strokeWidth="3"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-headline-md font-bold">{total}</span>
          <span className="text-[10px] text-on-surface-variant">Total</span>
        </div>
      </div>
      <div className="flex-1 space-y-sm">
        {data.map((d) => (
          <div key={d.status} className="flex items-center justify-between">
            <div className="flex items-center gap-sm">
              <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[d.status] || '#8c909f' }} />
              <span className="text-label-sm">{d.status}</span>
            </div>
            <span className="text-label-sm text-on-surface-variant">{d.count} <span className="text-on-surface-variant/50">({d.pct}%)</span></span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Line chart (monthly) ─────────────────────────────────────
function LineChart({ data }) {
  if (!data?.length) return <Skeleton className="flex-1 min-h-[220px]" />
  const max = Math.max(...data.map((d) => d.count), 1)
  const W = 800, H = 220, PAD = 20
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((d.count / max) * (H - PAD * 2))
    return [x, y]
  })
  const pathD = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const areaD = `${pathD} L ${pts[pts.length - 1][0]} ${H} L ${pts[0][0]} ${H} Z`

  return (
    <div className="flex-1 w-full min-h-[220px] relative">
      <svg className="absolute inset-0 w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${W} ${H + 20}`}>
        <defs>
          <linearGradient id="lg-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
          <filter id="ln-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={areaD} fill="url(#lg-area)" />
        <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth="3" filter="url(#ln-glow)" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="5" fill="#3B82F6" />
            <text x={x} y={y - 12} textAnchor="middle" fontSize="10" fill="#adc6ff" fontWeight="bold">
              {data[i].count > 0 ? data[i].count : ''}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = PAD + (i / (data.length - 1)) * (W - PAD * 2)
          return (
            <text key={i} x={x} y={H + 15} textAnchor="middle" fontSize="9"
              fill="#c2c6d6" fontWeight="bold" letterSpacing="1">
              {d.label.toUpperCase()}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

// ── Category bar chart (horizontal) ──────────────────────────
function CategoryChart({ data }) {
  if (!data?.length) return <Skeleton className="h-64" />
  const max = Math.max(...data.map((d) => d.count), 1)
  const COLORS = ['primary-gradient', 'bg-secondary/60', 'bg-tertiary/60', 'bg-error/60', 'bg-outline/60', 'bg-surface-bright']

  return (
    <div className="space-y-sm">
      {data.map((d, i) => (
        <div key={d.category} className="flex items-center gap-sm">
          <span className="text-label-sm text-on-surface-variant w-36 truncate flex-shrink-0">{d.category}</span>
          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${COLORS[i] || 'bg-primary/50'}`}
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="text-label-sm text-on-surface w-6 text-right flex-shrink-0">{d.count}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function AnalyticsClient() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const kpi = data?.kpi
  const KPI_CARDS = kpi ? [
    { icon: 'pending_actions', iconColor: 'text-primary',   value: kpi.activeRequests,    label: 'Active Requests',    delta: null },
    { icon: 'check_circle',    iconColor: 'text-green-400', value: kpi.completedRequests, label: 'Completed',          delta: null },
    { icon: 'analytics',       iconColor: 'text-secondary', value: kpi.totalRequests,     label: 'Total Requests',     delta: null },
    { icon: 'groups',          iconColor: 'text-tertiary',  value: kpi.activeDesigners,   label: 'Active Designers',   delta: null },
  ] : []

  return (
    <AppLayout title="Reports &amp; Analytics">
      <div className="p-lg space-y-gutter">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-4 grid grid-cols-2 gap-sm">
            {loading
              ? [1,2,3,4].map((i) => <Skeleton key={i} className="h-24" />)
              : KPI_CARDS.map((k) => (
                <div key={k.label} className="glass-panel p-md rounded-xl flex flex-col justify-between hover:-translate-y-1 transition-transform">
                  <span className={`material-symbols-outlined ${k.iconColor}`}>{k.icon}</span>
                  <div>
                    <h4 className="text-headline-md font-bold">{k.value}</h4>
                    <p className="text-label-sm text-on-surface-variant">{k.label}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Line chart */}
          <div className="lg:col-span-8 glass-panel p-md rounded-xl flex flex-col">
            <div className="flex items-center justify-between mb-md">
              <div>
                <h3 className="text-label-md text-on-surface font-bold">Requests per Month</h3>
                <p className="text-xs text-on-surface-variant opacity-60">Last 6 months</p>
              </div>
              <div className="flex items-center gap-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Volume</span>
              </div>
            </div>
            {loading
              ? <Skeleton className="flex-1 min-h-[220px]" />
              : <LineChart data={data?.requestsByMonth} />
            }
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Category chart */}
          <div className="lg:col-span-6 glass-panel p-md rounded-xl">
            <h3 className="text-label-md text-on-surface mb-lg">Requests by Category</h3>
            {loading
              ? <Skeleton className="h-48" />
              : <CategoryChart data={data?.requestsByCategory} />
            }
          </div>

          {/* Status pie */}
          <div className="lg:col-span-6 glass-panel p-md rounded-xl flex flex-col">
            <h3 className="text-label-md text-on-surface mb-lg">Status Distribution</h3>
            {loading
              ? <Skeleton className="h-48" />
              : <PieChart data={data?.statusDistribution || []} total={data?.kpi?.totalRequests || 0} />
            }
          </div>
        </div>

        {/* Designer workload table */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-md border-b border-white/5">
            <h3 className="text-label-md text-on-surface">Designer Workload</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-on-surface-variant text-label-sm uppercase tracking-wider bg-white/[0.02]">
                  {['Designer', 'Active', 'Completed', 'Capacity', ''].map((h) => (
                    <th key={h} className="px-md py-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading
                  ? [1,2,3].map((i) => (
                    <tr key={i}>
                      {[1,2,3,4,5].map((j) => (
                        <td key={j} className="px-md py-md"><Skeleton className="h-4" /></td>
                      ))}
                    </tr>
                  ))
                  : (data?.designerWorkload || []).map((d) => (
                    <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-md py-md">
                        <div>
                          <p className="text-label-sm font-medium">{d.name}</p>
                          <p className="text-[10px] text-on-surface-variant capitalize">{d.role.replace('_', ' ')}</p>
                        </div>
                      </td>
                      <td className="px-md py-md">
                        <span className={`text-label-sm font-bold ${d.activeCount > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {d.activeCount}
                        </span>
                      </td>
                      <td className="px-md py-md">
                        <span className="text-label-sm text-green-400">{d.completedCount}</span>
                      </td>
                      <td className="px-md py-md">
                        <div className="flex items-center gap-sm">
                          <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${d.capacityPct >= 80 ? 'bg-error' : 'primary-gradient'}`}
                              style={{ width: `${d.capacityPct}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-on-surface-variant">{d.capacityPct}%</span>
                        </div>
                      </td>
                      <td className="px-md py-md text-right">
                        <span className={`text-[10px] font-bold px-xs py-0.5 rounded-full ${
                          d.activeCount === 0
                            ? 'bg-green-500/20 text-green-400'
                            : d.capacityPct >= 80
                              ? 'bg-error/20 text-error'
                              : 'bg-primary/20 text-primary'
                        }`}>
                          {d.activeCount === 0 ? 'Available' : d.capacityPct >= 80 ? 'Full' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
