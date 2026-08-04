import { useState } from 'react'
import { useNavigate } from 'react-router'
import AppLayout from '../components/layout/AppLayout'

const ARCHIVE_CARDS = [
  { id: '#PX-901', title: 'Nexus Platform UI',   client: 'Stellar Tech',   date: 'Oct 12, 2023', tag: 'UI/UX',        tagColor: 'border-primary/30 text-primary bg-primary/5',       img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRYiPhEoOn1gFIhvf4OzF-0jGXsqQkuBk5u0aWhEDjFtcNhRqf5ExpaM23i9sBjLSm9F6clDffk6L7GTVq0wHvU6iN3gFivDcPcW326rowB94KgpYP5_DV2lk0u9duSNyHz-G_6ssUvfJrfijGwLJU9EeQlV_xpr0jXgM18AjuzSaDtvq40alj3z5TDtibgdvMivmcnwSAFCT-k0gYRhdXa7NWFfCm4Pk36EBjA1q44UGouL6M2XJEWQ' },
  { id: '#PX-884', title: 'Neon Rebranding',     client: 'Neon Dynamics',  date: 'Sep 28, 2023', tag: 'Branding',     tagColor: 'border-secondary/30 text-secondary bg-secondary/5',   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxNdQBkQaDpUR6GGy-zyTvHxjjrFHo3J8TDfN-Ep0R39mQCcnayCEH1JKteCZ3QuuUsz4yjlkpWQJychcqR-pzD5jK4WNDJcsAuM6185zqeCv3ofKnmj3YEjUJuocCQ2qdncd8Q84RcBmCmXeTILDqFfkkNpSpwdzTpatKaHyaCBaC7BAUMNfJWEZRosgD9ngfZdzbt2lk1hWTTDiJRwNEDwy6RaMzGiT4a3zDWq_gtKZlENh2F6nJ_w' },
  { id: '#PX-872', title: 'Q3 Ad Campaign',      client: 'Aura Ventures',  date: 'Aug 15, 2023', tag: 'Social',       tagColor: 'border-tertiary/30 text-tertiary bg-tertiary/5',       img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAH9FRhVraurYlA8ZdccpQAukJxHoXu0PQ5V69qnnnW8Dn4uf8fYNvdOzXWFPeSoZDiLX061EaDctTQMZg-ADwKKzsmE__ZG1dL2_gFlwRQv7ZVczB_JLpQ8194hVH3a_G9MivbieVSYc3fX0AwdrJAZmDHlDaI0eOq2owimtvzpJkS7oszCLMXi9Zfb5wHor3kfbThNMn8s8D44QQD3Tzl647HaOoFeWIh45oWilRQGwOrFPxGH7sgfA' },
  { id: '#PX-851', title: 'Nova Pack Design',    client: 'Orion Audio',    date: 'Jul 30, 2023', tag: 'Product',      tagColor: 'border-primary/30 text-primary bg-primary/5',           img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE-NJvMu2PsJiybVyNPj1_kv7zPCWVINAchCM4plLXLkksCPSxXHhc-4Kg1mndsKrOJOYdZN_Mu1lUFWVUDWIFmeZMIsBcyobaNnJrFyoX6iBr_nRiX3bz-FC6WhV0sjAiFf9_zCHHLo6-d0zvsDaUwfD1BhyUXhT-mHIeUMeispidamSXQbEmxBhSJHqu488ea5RFfjx9Pw75tGXkGQ9WJVNv3RGIpuYI5mnHd23SKE_dQTIUx3E0Uw' },
  { id: '#PX-842', title: 'Aether Characters',   client: 'GameSpire',      date: 'Jun 12, 2023', tag: '3D Assets',    tagColor: 'border-secondary/30 text-secondary bg-secondary/5',    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxtzoOhzY-w8EtJz0qkTVAQj57emuTx0cfP10sR4HWJKnPSbFApcZxMFiy7HAgJk24HbfuzPoW3DL8D4a1eaLlOpDAIyTy45fr5te9BfTxAhFncE081F3JZpMrUw6yeR9BNCfotCSBgu861IgyvNuZFqaMWnaj7dCINKVd2zkMHMPPX6Fsy86__EZvnqKpHGRNW9NKmQpVdEyKnAfS85qCi1tlMlLIiakvxOxEEabmI66vc5-FYoKrAA' },
  { id: '#PX-820', title: '2023 Annual Report',  client: 'EcoTrust',       date: 'May 05, 2023', tag: 'Editorial',    tagColor: 'border-tertiary/30 text-tertiary bg-tertiary/5',       img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF1pwYex80d1XKcpL_uNLFbLJwptdjnJtf2MnPanlikAhEv7LaaNzt0V97C8Jb4SkKWdeHOPXeUOBHu_OY-9TChKJP-01jh-dP6Iob1o8xDHXq0xQgAhx6yZWEIlK8Gv1-UIum_FDsh6n_mDvsaHT3E46cxmnEGdm2j-AEWSZI9BV_Gk-2G4oLnyGvlqEgQgnSSSdBm_HK7bmpBuOuazJYWgl1mOBt9lLbLgwwi1AsJDugUkVY1sNmOQ' },
  { id: '#PX-799', title: 'Horizon Travel Web',  client: 'Horizon Lux',    date: 'Apr 21, 2023', tag: 'Web Design',   tagColor: 'border-primary/30 text-primary bg-primary/5',           img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj4IOfelr88rTaBzAO7-UUnDm40N1mffKxLqv2et8LfbZ-SfIbN17J_qP-B7tOLR66yXAT2TWyk8FuO5sSe0b39qhL0x55yAXZ1sJfbUJsqhhLPdrBqy15DCKTIJfIBE-xDAUz7bOvQRZgt5N-cu0jiWDEi4R-BIzNOPK28swD5-RK3DZQSqddScBh26M-YyYuNLVTOxo0YABe4FhUHCaOS-2FKA11L8Ibt2IJjO-BJuKCPCA-isTp1Q' },
  { id: '#PX-765', title: 'Prism Icon Set',      client: 'Internal',       date: 'Mar 10, 2023', tag: 'Asset Library',tagColor: 'border-secondary/30 text-secondary bg-secondary/5',   img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd7K65AyDv34wKHFl53zrJQo4GjnhE85MyblYXazLdw0iugBeVPLWxo7CPYJKYAg8cJKldVfFWL_LfqFqHv_1S1CRPU7N75b8iAjI6M9MGrAEV6KtWqxlocy915VUk7OZoJoBCltAgLRnlqonk8xpSNoq_gtnUU_RiiNNpwkjzRJz1srj-9DF0XA48xgxjZzX_JvXOGw1Q4mIDKJCc0k8j4WaLI6sxetYoi_2TyTU3StM-Lifrp6fr0A' },
]

export default function Archive() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  return (
    <AppLayout title="Design Archive">
      <div className="p-lg space-y-lg">
        {/* Advanced Filters */}
        <section className="glass-panel p-md rounded-2xl">
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-primary">tune</span>
            <h3 className="text-label-md text-on-surface font-bold uppercase tracking-widest">Advanced Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-md">
            {[
              { label: 'Project ID / Title', placeholder: 'e.g. #PX-402', type: 'text' },
            ].map(({ label, placeholder, type }) => (
              <div key={label} className="space-y-xs">
                <label className="text-label-sm text-on-surface-variant ml-1 block">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            ))}
            {[
              { label: 'Category',       opts: ['All Categories','UI/UX Design','Branding','Social Media','Motion Graphics'] },
              { label: 'Client/Company', opts: ['All Clients','Stellar Tech','Neon Dynamics','Aura Ventures'] },
              { label: 'Designer',       opts: ['Any Designer','Alex Rivera','Jordan Smith','Casey Moore'] },
              { label: 'Status',         opts: ['Completed','Archived','Canceled','All Statuses'] },
            ].map(({ label, opts }) => (
              <div key={label} className="space-y-xs">
                <label className="text-label-sm text-on-surface-variant ml-1 block">{label}</label>
                <select className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-primary focus:border-primary outline-none appearance-none">
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Date Period</label>
              <input type="month" className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-primary focus:border-primary outline-none" />
            </div>
          </div>
          <div className="mt-md pt-md border-t border-white/5 flex justify-between items-center">
            <p className="text-label-sm text-on-surface-variant">Showing 8 of 1,284 results</p>
            <div className="flex gap-sm">
              <button className="text-label-md text-on-surface-variant hover:text-on-surface px-md py-xs">Reset All</button>
              <button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors text-label-md px-md py-xs rounded-lg">Apply Filters</button>
            </div>
          </div>
        </section>

        {/* Grid Gallery */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
          {ARCHIVE_CARDS.map((card) => (
            <div
              key={card.id}
              className="glass-panel rounded-2xl overflow-hidden group flex flex-col cursor-pointer hover:border-white/20 transition-all"
              onClick={() => navigate('/requests/882')}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-sm">
                  {['download','visibility'].map((icon) => (
                    <button key={icon} className="p-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all">
                      <span className="material-symbols-outlined text-white">{icon}</span>
                    </button>
                  ))}
                </div>
                <div className="absolute top-sm right-sm">
                  <span className="bg-emerald-500 text-white font-bold text-[10px] px-sm py-0.5 rounded-full shadow-lg shadow-emerald-500/30">Completed</span>
                </div>
              </div>
              <div className="p-sm flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-base">
                  <h4 className="text-label-md text-on-surface font-bold truncate">{card.title}</h4>
                  <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-xs py-px rounded ml-2 flex-shrink-0">{card.id}</span>
                </div>
                <p className="text-label-sm text-on-surface-variant mb-sm">Client: {card.client}</p>
                <div className="mt-auto flex items-center justify-between pt-sm border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-on-surface-variant font-bold opacity-60">Finished</span>
                    <span className="text-label-sm text-on-surface">{card.date}</span>
                  </div>
                  <span className={`px-sm py-0.5 rounded-full border text-[10px] ${card.tagColor}`}>{card.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Pagination */}
        <footer className="flex items-center justify-between pt-lg">
          <button className="glass-button px-md py-sm rounded-xl flex items-center gap-xs text-label-md text-on-surface-variant opacity-50 cursor-not-allowed">
            <span className="material-symbols-outlined">chevron_left</span>
            Previous
          </button>
          <div className="flex items-center gap-base">
            <button className="w-10 h-10 rounded-lg primary-gradient text-white font-bold flex items-center justify-center">1</button>
            {[2,3].map((n) => (
              <button key={n} className="w-10 h-10 rounded-lg glass-button text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center">{n}</button>
            ))}
            <span className="text-on-surface-variant px-sm">...</span>
            <button className="w-10 h-10 rounded-lg glass-button text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center">12</button>
          </div>
          <button className="glass-button px-md py-sm rounded-xl flex items-center gap-xs text-label-md text-on-surface-variant">
            Next
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </footer>
      </div>

      {/* Floating atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </AppLayout>
  )
}
