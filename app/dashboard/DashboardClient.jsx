'use client'

import { useRouter } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import StatusBadge from '../../components/ui/StatusBadge'
import ProgressBar from '../../components/ui/ProgressBar'

const SUMMARY_CARDS = [
  { label: 'Total Requests',   value: '1,248', sub: '+12% from last month', subColor: 'text-primary',           icon: 'analytics',      iconColor: 'text-primary' },
  { label: 'Pending',          value: '42',    progress: 65,                                                    icon: 'hourglass_empty', iconColor: 'text-on-surface-variant' },
  { label: 'Completed',        value: '1,180', sub: '94.5% Success Rate',   subColor: 'text-tertiary-fixed-dim', icon: 'check_circle',   iconColor: 'text-tertiary-fixed-dim' },
  { label: 'Active Designers', value: '18',    avatars: true,                                                   icon: 'groups',         iconColor: 'text-secondary' },
]

const RECENT_REQUESTS = [
  { name: 'Astra Mobile App',  client: 'SpaceX Solutions',  status: 'In Progress', progress: 65 },
  { name: 'Lumina Web Portal', client: 'Glow Inc.',         status: 'Review',      progress: 90 },
  { name: 'Neon Branding',     client: 'Cyberdyne Systems', status: 'Revision',    progress: 45 },
  { name: 'Velocity Logo Set', client: 'Swift Media',       status: 'Completed',   progress: 100 },
]

const DOT = { 'In Progress': 'bg-primary', Review: 'bg-tertiary', Revision: 'bg-secondary', Completed: 'bg-green-400' }

export default function DashboardClient() {
  const router = useRouter()

  return (
    <AppLayout title="Dashboard">
      <div className="p-lg space-y-lg">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {SUMMARY_CARDS.map((c) => (
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
                    {[1,2,3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-surface-container bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[12px]">person</span>
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-surface-container flex items-center justify-center text-[10px] text-on-surface-variant">+15</div>
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
                    {['Project Name','Client','Status','Progress'].map((h) => (
                      <th key={h} className="px-md py-sm font-label-sm text-label-sm text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RECENT_REQUESTS.map((r) => (
                    <tr key={r.name} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => router.push('/requests/882')}>
                      <td className="px-md py-sm">
                        <div className="flex items-center gap-xs">
                          <div className={`w-2 h-2 rounded-full ${DOT[r.status]}`} />
                          <span className="font-label-md text-label-md text-on-surface">{r.name}</span>
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
                <path className="text-primary stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="60, 100" strokeLinecap="round" strokeWidth="4" />
                <path className="text-tertiary stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="25, 100" strokeDashoffset="-60" strokeLinecap="round" strokeWidth="4" />
                <path className="text-secondary stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeDasharray="15, 100" strokeDashoffset="-85" strokeLinecap="round" strokeWidth="4" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-headline-md font-bold">142</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Active</span>
              </div>
            </div>
            <div className="w-full mt-lg grid grid-cols-2 gap-sm">
              {[
                { color: 'bg-primary',                    label: 'In Progress (60%)' },
                { color: 'bg-tertiary',                   label: 'Review (25%)' },
                { color: 'bg-secondary',                  label: 'Revision (15%)' },
                { color: 'bg-surface-container-highest',  label: 'On Hold' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-xs">
                  <div className={`w-3 h-3 rounded-sm ${color}`} />
                  <span className="text-[12px] text-on-surface-variant">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
