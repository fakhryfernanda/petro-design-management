import AppLayout from '../components/layout/AppLayout'

const KPI = [
  { icon: 'pending_actions', iconColor: 'text-primary',   value: '142', label: 'Active Requests',    delta: '+12%',  deltaColor: 'text-tertiary-fixed-dim' },
  { icon: 'check_circle',    iconColor: 'text-secondary', value: '89',  label: 'Completed This Week',delta: '+8%',   deltaColor: 'text-green-400' },
  { icon: 'schedule',        iconColor: 'text-tertiary',  value: '4.2d',label: 'Avg. Turnaround',    delta: '-2.4h', deltaColor: 'text-error' },
  { icon: 'groups',          iconColor: 'text-primary',   value: '12',  label: 'Active Designers',   delta: 'Steady',deltaColor: 'text-on-surface-variant' },
]

const BAR_DATA = [
  { day: 'MON', h: 65,  tip: 42,  highlight: false },
  { day: 'TUE', h: 85,  tip: 58,  highlight: false },
  { day: 'WED', h: 95,  tip: 64,  highlight: true  },
  { day: 'THU', h: 75,  tip: 51,  highlight: false },
  { day: 'FRI', h: 45,  tip: 30,  highlight: false },
]

const DESIGNERS = [
  {
    name: 'Elena Vance', role: 'UI/UX Senior',  projects: 8,  capacity: 80,  efficiency: '98.2%', effColor: 'text-tertiary', stars: 4.5,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXCwRXAHM0lMKBhVQNOqAaWYsNa-azpcxKw57roTiQf7PzffAMQVjXJBvdtuy6jkW2hVjMJJxUcLz3XNkb7ltN7pwnRPNbvlgVez1shVycaxGRZRXcCiwwKB9yhDnCXKeRxqBvCW0y7SuJeUE7-Ts_SM3c_HvxljYdGO8GN9cydTuHiu7oxmLsmYM2iCdnzFm3uKHz6h9rNV6p33-2_vdK-zUWIMg3npr1GSx6EGwCcGB2BPM3Eh-nTA',
    barColor: 'primary-gradient', full: false,
  },
  {
    name: 'Marcus Thorne', role: '3D Artist',     projects: 12, capacity: 100, efficiency: '85.4%', effColor: 'text-secondary', stars: 4,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2nQmc6DYN2posrGJ0KYzax_CRjcJACglUHPMwcX0pb-o812bLp86Yekop87dPXDkP91c4TcuvXPLPcRt6Xe4mLRbULn2LcXkUM7qEG4kSL0P2Knf2q8fRKAgjrlHglsSx1jS5-cCCxeIgt3FHUUfTKiyWsZl5uw01DtjlER6oJfVBJuRcmuIQ5gtdP7kNQDfbxi-gGkBrHExv-0EtejscBXdFl4-D1jmz4WloKrKfqz1QIQqa2yzM6w',
    barColor: 'bg-error', full: true,
  },
  {
    name: 'Sarah Jenkins', role: 'Illustrator',   projects: 5,  capacity: 45,  efficiency: '94.8%', effColor: 'text-tertiary', stars: 5,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmUJySXk0t0e8XuMfgMe6N9xyQUj0SpnsTaDfMKyLbH-WeV_7HvUgf1PZ6tkHqmorvA7upaBovJGTiGBnBgdZOwJaqEaRWxZYIWEbjTTJehDqZnLy5M4e4ICIbhPTxZc0Oaj3BWBOMGKz3Mj6ruLbXcyNx8JaukB7c1ADfwMj1tu1DE6xR1jpnXl-WSfE0gu1gzhn0e-v_vaoLLWV_qSIa3qjuKDeGL1X3LHZ90gMF874BCulRICQW4w',
    barColor: 'bg-green-500/60', full: false,
  },
]

function Stars({ count }) {
  return (
    <div className="flex items-center gap-0.5 text-primary">
      {[1,2,3,4,5].map((i) => (
        <span
          key={i}
          className="material-symbols-outlined text-[16px]"
          style={{ fontVariationSettings: i <= Math.floor(count) ? '"FILL" 1' : i - 0.5 === count ? '"FILL" 0.5' : '"FILL" 0' }}
        >
          {i - 0.5 === count ? 'star_half' : 'star'}
        </span>
      ))}
    </div>
  )
}

const headerActions = (
  <div className="flex items-center gap-sm">
    <div className="flex items-center gap-xs bg-surface-container-low px-sm py-1.5 rounded-full border border-white/5 cursor-pointer hover:bg-surface-container transition-colors">
      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
      <span className="text-label-sm">Oct 1 – Oct 31, 2023</span>
      <span className="material-symbols-outlined text-[18px]">expand_more</span>
    </div>
    <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
      {[
        { icon: 'picture_as_pdf', label: 'PDF' },
        { icon: 'table_view',    label: 'Excel' },
      ].map(({ icon, label }, i) => (
        <button key={label} className="px-sm py-1.5 text-label-sm hover:bg-white/5 rounded-md flex items-center gap-1 transition-all">
          <span className="material-symbols-outlined text-[16px]">{icon}</span> {label}
        </button>
      ))}
    </div>
  </div>
)

export default function Analytics() {
  return (
    <AppLayout title="Reports &amp; Analytics" headerActions={headerActions}>
      <div className="p-lg space-y-gutter">

        {/* Row 1: KPI + Line Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* KPI Cards */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-sm">
            {KPI.map((k) => (
              <div key={k.label} className="glass-panel p-md rounded-xl flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between">
                  <span className={`material-symbols-outlined ${k.iconColor}`}>{k.icon}</span>
                  <span className={`text-label-sm ${k.deltaColor}`}>{k.delta}</span>
                </div>
                <div>
                  <h4 className="text-headline-md font-bold">{k.value}</h4>
                  <p className="text-label-sm text-on-surface-variant">{k.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Line Chart */}
          <div className="lg:col-span-8 glass-panel p-md rounded-xl flex flex-col">
            <div className="flex items-center justify-between mb-md">
              <div>
                <h3 className="text-label-md text-on-surface font-bold">Monthly Productivity Growth</h3>
                <p className="text-xs text-on-surface-variant opacity-60">Total output volume vs. resources</p>
              </div>
              <div className="flex items-center gap-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(173,198,255,0.6)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface">Volume</span>
              </div>
            </div>
            <div className="flex-1 w-full min-h-[240px] relative">
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet" viewBox="0 0 800 240">
                <defs>
                  <linearGradient id="line-grad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path d="M0 180 Q 50 140 100 160 T 200 100 T 300 120 T 400 60 T 500 80 T 600 40 T 700 90 T 800 30" fill="none" stroke="#3B82F6" strokeWidth="3" filter="url(#glow)" />
                <path d="M0 180 Q 50 140 100 160 T 200 100 T 300 120 T 400 60 T 500 80 T 600 40 T 700 90 T 800 30 V 240 H 0 Z" fill="url(#line-grad)" />
                {[[100,160],[300,120],[500,80],[700,90]].map(([cx,cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="5" fill="#3B82F6" className="cursor-pointer" />
                ))}
              </svg>
              <div className="absolute bottom-0 left-0 w-full flex justify-between text-[10px] font-bold text-on-surface-variant opacity-80 tracking-widest px-2">
                {['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG'].map((m) => <span key={m}>{m}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Bar Chart + Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Bar Chart */}
          <div className="lg:col-span-6 glass-panel p-md rounded-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="text-label-md text-on-surface">Weekly Request Volume</h3>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer">more_horiz</span>
            </div>
            <div className="flex items-end justify-between px-sm" style={{ height: '280px' }}>
              {BAR_DATA.map(({ day, h, tip, highlight }) => (
                <div key={day} className="flex flex-col items-center gap-xs flex-1 h-full justify-end">
                  <div
                    className={`w-full rounded-t-lg transition-all cursor-help group relative ${highlight ? 'primary-gradient opacity-80 hover:opacity-100 shadow-lg shadow-primary/10' : 'bg-white/10 hover:bg-primary/20'}`}
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-bright text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {tip}
                    </div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="lg:col-span-6 glass-panel p-md rounded-xl flex flex-col">
            <h3 className="text-label-md text-on-surface mb-lg">Status Distribution</h3>
            <div className="flex flex-1 items-center gap-lg">
              <div className="relative w-48 h-48 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="none" r="15.9" stroke="#2d3449" strokeWidth="3" />
                  <circle cx="18" cy="18" fill="none" r="15.9" stroke="#3B82F6" strokeDasharray="60 100" strokeLinecap="round" strokeWidth="3" className="chart-glow" />
                  <circle cx="18" cy="18" fill="none" r="15.9" stroke="#8B5CF6" strokeDasharray="25 100" strokeDashoffset="-60" strokeLinecap="round" strokeWidth="3" />
                  <circle cx="18" cy="18" fill="none" r="15.9" stroke="#4cd7f6" strokeDasharray="15 100" strokeDashoffset="-85" strokeLinecap="round" strokeWidth="3" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-headline-md font-bold">100%</span>
                  <span className="text-[10px] text-on-surface-variant">Allocated</span>
                </div>
              </div>
              <div className="flex-1 space-y-md">
                {[
                  { color: 'bg-primary',   label: 'In Progress', pct: '60%' },
                  { color: 'bg-secondary', label: 'Review',      pct: '25%' },
                  { color: 'bg-tertiary',  label: 'Revision',    pct: '15%' },
                ].map(({ color, label, pct }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                      <div className={`w-2 h-2 rounded-full ${color}`} />
                      <span className="text-label-sm">{label}</span>
                    </div>
                    <span className="text-label-sm">{pct}</span>
                  </div>
                ))}
                <div className="w-full h-[1px] bg-white/5 my-xs" />
                <button className="w-full py-1.5 border border-white/10 rounded-lg text-xs hover:bg-white/5 transition-colors">View detailed breakdown</button>
              </div>
            </div>
          </div>
        </div>

        {/* Designer Performance Table */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="p-md border-b border-white/5 flex items-center justify-between">
            <h3 className="text-label-md text-on-surface">Designer Performance &amp; Workload</h3>
            <div className="flex items-center gap-sm">
              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Available
              </span>
              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error" /> Full Capacity
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-on-surface-variant text-label-sm uppercase tracking-wider bg-white/[0.02]">
                  {['Designer','Active Load','Capacity','Efficiency','Avg. Rating',''].map((h) => (
                    <th key={h} className="px-md py-sm font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {DESIGNERS.map((d) => (
                  <tr key={d.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-md py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden">
                          <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-label-sm">{d.name}</p>
                          <p className="text-[10px] text-on-surface-variant">{d.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md">
                      <span className="text-label-sm">{d.projects} Projects</span>
                    </td>
                    <td className="px-md py-md">
                      <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${d.barColor}`} style={{ width: `${d.capacity}%` }} />
                      </div>
                    </td>
                    <td className={`px-md py-md ${d.effColor}`}>{d.efficiency}</td>
                    <td className="px-md py-md"><Stars count={d.stars} /></td>
                    <td className="px-md py-md text-right">
                      <button className="p-1 hover:bg-white/5 rounded-md transition-colors">
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-md bg-white/[0.02] flex justify-between items-center">
            <p className="text-xs text-on-surface-variant">Showing 1-3 of 12 Designers</p>
            <div className="flex items-center gap-base">
              <button className="p-1 rounded bg-white/5 border border-white/10 opacity-50">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="px-3 py-1 rounded primary-gradient text-white font-bold text-xs">1</button>
              {[2,3].map((n) => (
                <button key={n} className="px-3 py-1 rounded hover:bg-white/5 text-xs">{n}</button>
              ))}
              <button className="p-1 rounded bg-white/5 border border-white/10">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}
