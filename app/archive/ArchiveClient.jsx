'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '../../components/layout/AppLayout'
import { CATEGORIES, getSubCategories1, getSubCategories2 } from '../../lib/categories'

// ── Status badge colors ──────────────────────────────────────
const STATUS_STYLE = {
  'Completed':   'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-emerald-500/30',
  'Pending':     'bg-outline/20 text-outline border border-outline/40',
  'In Progress': 'bg-primary/20 text-primary border border-primary/40',
  'Accepted':    'bg-tertiary/20 text-tertiary border border-tertiary/40',
  'On Revision': 'bg-secondary/20 text-secondary border border-secondary/40',
}

const getStatusStyle = (s) => STATUS_STYLE[s] ?? STATUS_STYLE['Pending']

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
function lastStatusUpdate(req) {
  const map = {
    'In Progress': req.startedAt,
    'Accepted':    req.acceptedAt,
    'On Revision': req.onRevisionAt,
    'Completed':   req.completedAt,
  }
  return map[req.status] || req.updatedAt
}

function ArchiveCard({ request, onClick }) {
  const thumbUrl = request.files?.[0]?.url
  const isImage  = (request.files?.[0]?.mimeType || '').startsWith('image/')

  return (
    <div
      className="glass-panel rounded-2xl overflow-hidden group flex flex-col cursor-pointer hover:border-white/20 transition-all"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-surface-container-high">
        {thumbUrl && isImage ? (
          <img
            src={thumbUrl}
            alt={request.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant">image</span>
          </div>
        )}
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
        {/* Title */}
        <h4 className="text-label-md text-on-surface font-bold mb-xs">{request.title}</h4>

        {/* 3 category badges */}
        <div className="flex flex-wrap gap-xs mb-xs">
          {request.category && (
            <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-xs py-px rounded">
              {request.category}
            </span>
          )}
          {request.subCategory1 && (
            <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-xs py-px rounded">
              {request.subCategory1}
            </span>
          )}
          {request.subCategory2 && (
            <span className="text-[10px] text-on-surface-variant bg-surface-container-high px-xs py-px rounded">
              {request.subCategory2}
            </span>
          )}
        </div>

        <p className="text-label-sm text-on-surface-variant mb-sm">Client: {request.client}</p>
        {request.assignedDesigner && (
          <p className="text-[11px] text-on-surface-variant/60 mb-sm">
            Designer: {request.assignedDesigner.name}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-sm border-t border-white/5">
          {/* Bottom-left: date label */}
          {request.status === 'Completed' ? (
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-400">Completed</span>
              <span className="text-label-sm text-on-surface">
                {new Date(lastStatusUpdate(request)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-on-surface-variant font-bold opacity-60">Last updated at</span>
              <span className="text-label-sm text-on-surface">
                {new Date(lastStatusUpdate(request)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}

          {/* Bottom-right: tag badge */}
          <span className={`px-sm py-0.5 rounded-full border text-[10px] ${
            request.tagType === 'Custom'
              ? 'border-secondary/40 text-secondary bg-secondary/10'
              : 'border-primary/40 text-primary bg-primary/10'
          }`}>
            {request.tagType === 'Regular' || request.tagType === 'Reguler' ? 'Regular' : request.tagType || 'Regular'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
const STATUSES   = ['Completed', 'Pending', 'In Progress', 'Accepted', 'On Revision']
const TAGS       = ['Regular', 'Custom']
const LIMIT = 8

export default function ArchiveClient() {
  const router = useRouter()

  // Filter state
  const [search,     setSearch]     = useState('')
  const [category,   setCategory]   = useState('')
  const [subCategory1, setSubCategory1] = useState('')
  const [subCategory2, setSubCategory2] = useState('')
  const [client,     setClient]     = useState('')
  const [designerId, setDesignerId] = useState('')
  const [status,     setStatus]     = useState('')
  const [tag,        setTag]        = useState('')
  const [month,      setMonth]      = useState('')
  const [page,       setPage]       = useState(1)

  const sub1FilterOptions = category ? getSubCategories1(category) : []
  const sub2FilterOptions = category && subCategory1 ? getSubCategories2(category, subCategory1) : []

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
    fetch('/api/users?role=designer')
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
  useEffect(() => { setPage(1) }, [category, subCategory1, subCategory2, client, designerId, status, tag, month])

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: LIMIT, page })
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (category)        params.set('category', category)
      if (subCategory1)    params.set('subCategory1', subCategory1)
      if (subCategory2)    params.set('subCategory2', subCategory2)
      if (client)          params.set('client', client)
      if (designerId)      params.set('designerId', designerId)
      if (status)          params.set('status', status)
      if (tag)             params.set('tagType', tag)
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
  }, [debouncedSearch, category, subCategory1, subCategory2, client, designerId, status, tag, month, page])

  useEffect(() => { fetchData() }, [fetchData])

  const resetFilters = () => {
    setSearch('')
    setCategory('')
    setSubCategory1('')
    setSubCategory2('')
    setClient('')
    setDesignerId('')
    setStatus('')
    setTag('')
    setMonth('')
    setPage(1)
  }

  const hasActiveFilters = search || category || subCategory1 || subCategory2 || client || designerId || status || tag || month

  // ── Render ──────────────────────────────────────────────────
  return (
    <AppLayout title="Design Archive">
      <div className="p-md sm:p-lg space-y-lg">

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

          <div className="space-y-md">
            {/* Row 1 — 5 filters */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-md">
            {/* Search */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Search</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-xs top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant">search</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Project name..."
                  className="w-full bg-surface-container-low border border-white/10 rounded-lg pl-7 pr-sm py-xs text-label-md focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setSubCategory1(''); setSubCategory2('') }}
                className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary outline-none appearance-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Sub-Category 1 */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Sub-Category 1</label>
              <select
                value={subCategory1}
                disabled={!category}
                onChange={(e) => { setSubCategory1(e.target.value); setSubCategory2('') }}
                className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All</option>
                {sub1FilterOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Sub-Category 2 */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Sub-Category 2</label>
              <select
                value={subCategory2}
                disabled={!subCategory1}
                onChange={(e) => setSubCategory2(e.target.value)}
                className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">All</option>
                {sub2FilterOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
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
            </div>

            {/* Row 2 — 4 filters (5-col grid, kolom terakhir kosong) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-md">
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

            {/* Tag */}
            <div className="space-y-xs">
              <label className="text-label-sm text-on-surface-variant ml-1 block">Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-surface-container-low border border-white/10 rounded-lg px-sm py-xs text-label-md focus:ring-1 focus:ring-primary outline-none appearance-none"
              >
                <option value="">All Tags</option>
                {TAGS.map((t) => <option key={t}>{t}</option>)}
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
          </div>

          <div className="mt-md pt-md border-t border-white/5 flex justify-between items-center">
            <p className="text-label-sm text-on-surface-variant">
              {loading
                ? 'Loading...'
                : `Showing ${Math.min((page - 1) * LIMIT + 1, total)}–${Math.min(page * LIMIT, total)} of ${total.toLocaleString()} results`
              }
            </p>
            <button
              onClick={resetFilters}
              className="text-label-md text-on-surface-variant hover:text-on-surface px-md py-xs transition-colors"
            >
              Reset Filters
            </button>
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
          <footer className="flex items-center justify-center pt-lg gap-xs">
            {/* Prev */}
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-8 h-8 glass-button rounded-lg flex items-center justify-center text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {/* Page numbers — max 3 visible + ellipsis */}
            {(() => {
              const items = []
              // Tentukan window 3 halaman di sekitar page aktif
              let start, end
              if (totalPages <= 3) {
                start = 1; end = totalPages
              } else if (page <= 2) {
                start = 1; end = 3
              } else if (page >= totalPages - 1) {
                start = totalPages - 2; end = totalPages
              } else {
                start = page - 1; end = page + 1
              }

              // Ellipsis kiri
              if (start > 1) {
                items.push(
                  <button key={1} onClick={() => setPage(1)}
                    className="w-8 h-8 rounded-lg glass-button text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center text-label-sm">
                    1
                  </button>
                )
                if (start > 2) items.push(<span key="el" className="text-on-surface-variant/50 text-label-sm px-0.5">…</span>)
              }

              // Window 3 halaman
              for (let p = start; p <= end; p++) {
                items.push(
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-label-sm flex items-center justify-center transition-colors ${
                      p === page
                        ? 'primary-gradient text-white font-bold shadow-lg'
                        : 'glass-button text-on-surface-variant hover:text-on-surface'
                    }`}>
                    {p}
                  </button>
                )
              }

              // Ellipsis kanan
              if (end < totalPages) {
                if (end < totalPages - 1) items.push(<span key="er" className="text-on-surface-variant/50 text-label-sm px-0.5">…</span>)
                items.push(
                  <button key={totalPages} onClick={() => setPage(totalPages)}
                    className="w-8 h-8 rounded-lg glass-button text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center text-label-sm">
                    {totalPages}
                  </button>
                )
              }

              return items
            })()}

            {/* Next */}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 glass-button rounded-lg flex items-center justify-center text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
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
