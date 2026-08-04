import { useNavigate } from 'react-router'
import AppLayout from '../components/layout/AppLayout'
import StatusBadge from '../components/ui/StatusBadge'
import ProgressBar from '../components/ui/ProgressBar'

const SUMMARY_CARDS = [
  {
    label: 'Total Requests',
    value: '1,248',
    sub: '+12% from last month',
    subColor: 'text-primary',
    icon: 'analytics',
    iconColor: 'text-primary',
  },
  {
    label: 'Pending',
    value: '42',
    progress: 65,
    icon: 'hourglass_empty',
    iconColor: 'text-on-surface-variant',
  },
  {
    label: 'Completed',
    value: '1,180',
    sub: '94.5% Success Rate',
    subColor: 'text-tertiary-fixed-dim',
    icon: 'check_circle',
    iconColor: 'text-tertiary-fixed-dim',
  },
  {
    label: 'Active Designers',
    value: '18',
    icon: 'groups',
    iconColor: 'text-secondary',
    avatars: true,
  },
]

const RECENT_REQUESTS = [
  { name: 'Astra Mobile App',   client: 'SpaceX Solutions', status: 'In Progress', progress: 65 },
  { name: 'Lumina Web Portal',  client: 'Glow Inc.',        status: 'Review',      progress: 90 },
  { name: 'Neon Branding',      client: 'Cyberdyne Systems', status: 'Revision',   progress: 45 },
  { name: 'Velocity Logo Set',  client: 'Swift Media',       status: 'Completed',  progress: 100 },
]

const DOT_COLORS = {
  'In Progress': 'bg-primary shadow-primary/50',
  'Review':      'bg-tertiary shadow-tertiary/50',
  'Revision':    'bg-secondary shadow-secondary/50',
  'Completed':   'bg-green-400 shadow-green-400/50',
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <AppLayout title="Dashboard">
      <div className="p-lg space-y-lg">

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {SUMMARY_CARDS.map((card) => (
            <div key={card.label} className="glass-card rounded-xl p-md space-y-sm hover:border-white/20 transition-colors">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-on-surface-variant">{card.label}</span>
                <span className={`material-symbols-outlined ${card.iconColor}`}>{card.icon}</span>
              </div>
              <div>
                <h4 className="text-headline-lg font-bold text-on-surface">{card.value}</h4>
                {card.sub && <p className={`text-[12px] mt-1 ${card.subColor}`}>{card.sub}</p>}
                {card.progress != null && (
                  <div className="w-full h-1 bg-surface-container-highest rounded-full mt-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${card.progress}%` }} />
                  </div>
                )}
                {card.avatars && (
                  <div className="flex -space-x-2 mt-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-surface-container bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[12px]">person</span>
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-surface-container flex items-center justify-center text-[10px] text-on-surface-variant">
                      +15
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Recent Requests Table */}
          <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col">
            <div className="px-md py-sm border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-label-md text-label-md text-on-surface">Recent Requests</h3>
              <button
                onClick={() => navigate('/archive')}
                className="text-primary font-label-sm text-label-sm hover:underline"
              >
                View All
              </button>
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
                  {RECENT_REQUESTS.map((req) => (
                    <tr
                      key={req.name}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate('/requests/882')}
                    >
                      <td className="px-md py-sm">
                        <div className="flex items-center gap-xs">
                          <div className={`w-2 h-2 rounded-full shadow-sm ${DOT_COLORS[req.status]}`} />
                          <span className="font-label-md text-label-md text-on-surface">{req.name}</span>
                        </div>
                      </td>
                      <td className="px-md py-sm text-label-md text-on-surface-variant">{req.client}</td>
                      <td className="px-md py-sm">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-md py-sm">
                        <div className="flex items-center gap-sm">
                          <ProgressBar value={req.progress} />
                          <span className="text-[11px] text-on-surface-variant">{req.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Status Summary Pie Chart */}
          <div className="glass-card rounded-xl p-md flex flex-col items-center">
            <h3 className="font-label-md text-label-md text-on-surface w-full mb-lg">Status Summary</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-primary stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" strokeDasharray="60, 100" strokeLinecap="round" strokeWidth="4"
                />
                <path
                  className="text-tertiary stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" strokeDasharray="25, 100" strokeDashoffset="-60" strokeLinecap="round" strokeWidth="4"
                />
                <path
                  className="text-secondary stroke-current"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" strokeDasharray="15, 100" strokeDashoffset="-85" strokeLinecap="round" strokeWidth="4"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-headline-md font-bold">142</span>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Active</span>
              </div>
            </div>
            <div className="w-full mt-lg grid grid-cols-2 gap-sm">
              {[
                { color: 'bg-primary',   label: 'In Progress (60%)' },
                { color: 'bg-tertiary',  label: 'Review (25%)' },
                { color: 'bg-secondary', label: 'Revision (15%)' },
                { color: 'bg-surface-container-highest', label: 'On Hold' },
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
