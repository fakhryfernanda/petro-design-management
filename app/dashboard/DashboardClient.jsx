'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import DesignerSelect from '../../components/ui/DesignerSelect'

const DOT = {
  'Pending':     'bg-outline shadow-outline/50',
  'In Progress': 'bg-primary shadow-primary/50',
  'Accepted':    'bg-tertiary shadow-tertiary/50',
  'On Revision': 'bg-secondary shadow-secondary/50',
  'Completed':   'bg-green-400 shadow-green-400/50',
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
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setCurrentUser(d.user))
      .catch(() => setCurrentUser(null))
  }, [])

  const canEdit = currentUser && (currentUser.role === 'super_admin' || currentUser.role === 'designer')

  if (loading || !data) {
    return (
      <AppLayout title="Dashboard">
        <div className="p-md sm:p-lg space-y-lg">
          <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {[1, 2, 3, 4].map((i) => <SummarySkeleton key={i} />)}
          </section>
          <div className="glass-card rounded-xl p-md animate-pulse h-64" />
          <div className="glass-card rounded-xl p-md animate-pulse h-64" />
        </div>
      </AppLayout>
    )
  }

  const { stats, recentRequests } = data

  const summaryCards = [
    { label: 'Total Requests', value: stats.totalRequests.toLocaleString(), sub: '+12% from last month', subColor: 'text-primary', icon: 'analytics', iconColor: 'text-primary' },
    { label: 'Pending',        value: String(stats.pending),               icon: 'hourglass_empty', iconColor: 'text-on-surface-variant' },
    { label: 'Active',         value: String(stats.active),                icon: 'pending_actions',  iconColor: 'text-secondary' },
    { label: 'Completed',      value: stats.completed.toLocaleString(),    icon: 'check_circle',     iconColor: 'text-tertiary-fixed-dim' },
  ]

  return (
    <AppLayout title="Dashboard">
      <div className="p-md sm:p-lg space-y-lg">
        {/* Summary Cards */}
        <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {summaryCards.map((c) => (
            <div key={c.label} className="glass-card rounded-xl p-md space-y-sm hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-on-surface-variant">{c.label}</span>
                <span className={`material-symbols-outlined ${c.iconColor}`}>{c.icon}</span>
              </div>
              <div>
                <h4 className="text-headline-lg font-bold text-on-surface">{c.value}</h4>
                {c.sub && <p className={`text-[12px] mt-1 ${c.subColor}`}>{c.sub}</p>}
              </div>
            </div>
          ))}
        </section>

        {/* Recent Requests Table */}
        <div className="glass-card rounded-xl overflow-hidden w-full min-w-0">
          <div className="px-md py-sm border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="font-label-md text-label-md text-on-surface">Recent Requests</h3>
            <button onClick={() => router.push('/archive')} className="text-primary font-label-sm text-label-sm hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Project Name</th>
                  <th className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant hidden sm:table-cell">Client</th>
                  <th className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">Status</th>
                  <th className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Designer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentRequests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-md py-lg text-center text-on-surface-variant">No requests yet</td>
                  </tr>
                ) : recentRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => router.push(`/requests/${r.id}`)}>
                    <td className="px-md py-sm max-w-[120px] sm:max-w-none">
                      <div className="flex items-center gap-xs">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT[r.status] || 'bg-outline'}`} />
                        <span className="font-label-md text-label-md text-on-surface truncate">{r.title}</span>
                      </div>
                    </td>
                    <td className="px-md py-sm text-label-md text-on-surface-variant hidden sm:table-cell">{r.client}</td>
                    <td className="px-md py-sm whitespace-nowrap"><StatusBadge status={r.status} /></td>
                    <td className="px-md py-sm">
                      {canEdit ? (
                        <DesignerSelect
                          requestId={r.id}
                          currentDesigner={r.assignedDesigner || null}
                          onChange={(updated) => {
                            setData((prev) => ({
                              ...prev,
                              recentRequests: prev.recentRequests.map((x) =>
                                x.id === r.id ? { ...x, ...updated } : x
                              ),
                            }))
                          }}
                        />
                      ) : (
                        <span className="text-label-md text-on-surface truncate">
                          {r.assignedDesigner?.name || <span className="text-on-surface-variant/50">Unassigned</span>}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Designer Workload Table */}
        <div className="glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="px-md py-sm border-b border-white/10 bg-white/5">
            <h3 className="font-label-md text-label-md text-on-surface">Designer Workload</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[520px]">
              <thead>
                <tr className="text-on-surface-variant text-label-sm uppercase tracking-wider bg-white/[0.02]">
                  <th className="px-md py-sm font-medium">Designer</th>
                  <th className="px-md py-sm font-medium">Pending</th>
                  <th className="px-md py-sm font-medium">Active</th>
                  <th className="px-md py-sm font-medium">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(data.designerWorkload || []).map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-md py-md">
                      <div>
                        <p className="font-label-md text-label-md text-on-surface font-medium">{d.name}</p>
                        <p className="text-[10px] text-on-surface-variant capitalize">{d.role.replace('_', ' ')}</p>
                      </div>
                    </td>
                    <td className="px-md py-md">
                      <span className="text-label-sm font-bold text-on-surface-variant">{d.pendingCount}</span>
                    </td>
                    <td className="px-md py-md">
                      <span className={`text-label-sm font-bold ${d.activeCount > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {d.activeCount}
                      </span>
                    </td>
                    <td className="px-md py-md">
                      <span className="text-label-sm text-green-400">{d.completedCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
