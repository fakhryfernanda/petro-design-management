'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'

// ── Status badge colors ──────────────────────────────────────
const STATUS_STYLE = {
  'Completed':   'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-emerald-500/30',
  'In Progress': 'bg-primary/20 text-primary border border-primary/40',
  'Review':      'bg-tertiary/20 text-tertiary border border-tertiary/40',
  'Revision':    'bg-secondary/20 text-secondary border border-secondary/40',
  'On Hold':     'bg-outline/20 text-outline border border-outline/40',
}

const getStatusStyle = (s) => STATUS_STYLE[s] ?? STATUS_STYLE['On Hold']
const TAG_COLOR = {
  'UI/UX':        'border-primary/30 text-primary bg-primary/5',
  'Branding':     'border-secondary/30 text-secondary bg-secondary/5',
  'Social Media': 'border-tertiary/30 text-tertiary bg-tertiary/5',
  'Web Design':   'border-primary/30 text-primary bg-primary/5',
  '3D Assets':    'border-secondary/30 text-secondary bg-secondary/5',
  'Editorial':    'border-tertiary/30 text-tertiary bg-tertiary/5',
  'Product':      'border-primary/30 text-primary bg-primary/5',
  'Packaging':    'border-secondary/30 text-secondary bg-secondary/5',
  'Asset Library':'border-secondary/30 text-secondary bg-secondary/5',
  'Marketing':    'border-tertiary/30 text-tertiary bg-tertiary/5',
  'Mobile':       'border-primary/30 text-primary bg-primary/5',
}

const getTagColor = (tag) => TAG_COLOR[tag] ?? 'border-outline/30 text-outline bg-outline/5'

// ── Skeleton card ────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-video bg-white/5" />
      <div className="p-sm space-y-sm">
        <div className="h-3 bg-white/10 rounded w-3/4" />
        <div className="h-2 bg-white/5 rounded w-1/2" />
        <div className="h-px bg-white/5 mt-sm" />
        <div className="flex justify-between">
          <div className="h-2 bg-white/5 rounded w-1/3" />
          <div className="h-4 bg-white/5 rounded-full w-16" />
        </div>
      </div>
    </div>
  )
}

// ── Archive card ──────────────────────────────────────────────
function ArchiveCard({ request, onClick }) {
  const primaryTag = request.tags?.[0]

  return (
    <div
      className="glass-panel rounded-2xl overflow-hidden group flex flex-col cursor-pointer hover:border-white/20 transition-all"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden bg-surface-container-high">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">image</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-sm right-sm">
          <span className={`font-bold text-[10px] px-sm py-0.5 rounded-full shadow-lg ${getStatusStyle(request.status)}`}>
            {request.status}
          </span>
        </div>
        <div className="absolute bottom-sm left-sm">
          <span className="text-[10px] text-on-surface-variant bg-surface-container/80 backdrop-blur-sm px-xs py-0.5 rounded">
            #{String(request.id).padStart(3, '0')}
          </span>
        </div>
      </div>

      <div className="p-sm flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-base gap-xs">
          <h4 className="text-label-md text-on-surface font-bold truncate">{request.title}</h4>
          <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-xs py-px rounded flex-shrink-0">
            {request.category}
          </span>
        </div>
        <p className="text-label-sm text-on-surface-variant mb-sm">Client: {request.client}</p>
        {request.assignedDesigner && (
          <p className="text-[11px] text-on-surface-variant/60 mb-sm">
            Designer: {request.assignedDesigner.name}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-sm border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-on-surface-variant font-bold opacity-60">Finished</span>
            <span className="text-label-sm text-on-surface">
              {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          {primaryTag && (
            <span className={`px-sm py-0.5 rounded-full border text-[10px] ${getTagColor(primaryTag)}`}>
              {primaryTag}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
const CATEGORIES = ['UI/UX Design', 'Brand Identity', 'Marketing Assets', 'Product Design', 'Motion Graphics', 'Editorial']
const STATUSES   = ['Completed', 'In Progress', 'Review', 'Revision', 'On Hold']
const LIMIT = 8

export default function ArchiveClient() {
  const router = useRouter()

  // Filter state
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState('')
  const [client,     setClient]     = useState('')
  const [designerId, setDesignerId] = useState('')
  const [status,     setStatus]     = useState('')
  const [month,      setMonth]      = useState('')
  const [page,       setPage]       = useState(1)

  // Data state
  const [requests,   setRequests]   = useState([])
  const [total,      setTotal]      = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading,    setLoading]    = useState(true)
  const [designers,  setDesigners]  = useState([])

  // Debounce ref untuk search
  const debounceRef = useRef(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Fetch designers sekali
  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setDesigners)
      .catch(console.error)
  }, [])

  // Debounce search input
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [search])

  // Reset page saat filter berubah
  useEffect(() => { setPage(1) }, [category, client, designerId, status, month])

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: LIMIT, page })
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (category)        params.set('category', category)
      if (client)          params.set('client', client)
      if (designerId)      params.set('designerId', designerId)
      if (status)          params.set('status', status)
      if (month)           params.set('month', month)

      const res  = await fetch(`/api/requests?${params}`)
      const json = await res.json()

      setRequests(json.data)
      setTotal(json.total)
      setTotalPages(json.totalPages)
    } catch (e) {
      console.error('Fetch error:', e)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, category, client, designerId, status, month, page])

  useEffect(() => { fetchData() }, [fetchData])

  const resetFilters = () => {
    setSearch('')
    setCategory('')
    setClient('')
    setDesignerId('')
    setStatus('')
    setMonth('')
    setPage(1)
  }

  const hasActiveFilters = search || category || client || designerId || status || month

  // ── Render ──────────────────────────────────────────────────
  return (
    <AppLayout title="Design Archive">
      <div className="p-lg space-y-lg">

        {/* ── Filters ── */}
        <section className="glass-panel p-md rounded-2xl">
          <div className="flex items-center gap-xs mb-md">
            <span className="material-symbols-outlined text-primary">tune</span>
            <h3 className="text-label-md text-on-surface font-bold uppercase tracking-widest">Advanced Filters</h3>
            {hasActiveFilters && (
              <span className="ml-auto text-[10px] text-primary bg-primary/10 border border-primary/20 px-xs py-0.5 rounded-full">
                Filters active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-md">
            {/* Search */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Search</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-xs top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Title or client..."
                  className="w-full bg-surface-container-low border border-white/10 rounded-lg pl-7 pr-sm py-xs text-label-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary outline-none appearance-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Client */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Client / Company</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="Client name..."
                className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>

            {/* Designer */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Designer</label>
              <select
                value={designerId}
                onChange={(e) => setDesignerId(e.target.value)}
                className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary outline-none appearance-none"
              >
                <option value="">Any Designer</option>
                {designers.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary outline-none appearance-none"
              >
                <option value="">All Statuses</option>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Month */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Date Period</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="mt-md pt-md border-t border-white/5 flex justify-between items-center">
            <p className="text-label-sm text-on-surface-variant">
              {loading
                ? 'Loading...'
                : `Showing ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} of ${total.toLocaleString()} results`
              }
            </p>
            <div className="flex gap-sm">
              <button
                onClick={resetFilters}
                className="text-label-md text-on-surface-variant hover:text-on-surface px-md py-xs transition-colors"
              >
                Reset All
              </button>
              <button
                onClick={fetchData}
                className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors text-label-md px-md py-xs rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </section>

        {/* ── Grid ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
          {loading
            ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
            : requests.length === 0
              ? (
                <div className="col-span-4 flex flex-col items-center justify-center py-xl text-center">
                  <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30 mb-md">search_off</span>
                  <p className="text-body-md text-on-surface-variant">No results found</p>
                  <p className="text-label-sm text-on-surface-variant/60 mt-xs">Try adjusting your filters</p>
                </div>
              )
              : requests.map((req) => (
                <ArchiveCard
                  key={req.id}
                  request={req}
                  onClick={() => router.push(`/requests/${req.id}`)}
                />
              ))
          }
        </section>

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <footer className="flex items-center justify-between pt-lg">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="glass-button px-md py-sm rounded-xl flex items-center gap-xs text-label-md text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
              Previous
            </button>

            <div className="flex items-center gap-base">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Sliding window di sekitar halaman aktif
                let p
                if (totalPages <= 5) {
                  p = i + 1
                } else if (page <= 3) {
                  p = i + 1
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i
                } else {
                  p = page - 2 + i
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-lg text-label-md flex items-center justify-center transition-colors ${
                      p === page
                        ? 'primary-gradient text-white font-bold shadow-lg'
                        : 'glass-button text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className="text-on-surface-variant px-xs">...</span>
                  <button onClick={() => setPage(totalPages)}
                    className="w-10 h-10 rounded-lg glass-button text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center">
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="glass-button px-md py-sm rounded-xl flex items-center gap-xs text-label-md text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              Next
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </footer>
        )}

      </div>

      {/* Floating atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </AppLayout>
  )
}
