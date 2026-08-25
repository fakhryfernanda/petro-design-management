import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const [
    totalRequests,
    completedCount,
    activeDesigners,
    allRequests,
    designerWorkloadRaw,
  ] = await Promise.all([
    prisma.designRequest.count(),
    prisma.designRequest.count({ where: { status: 'Completed' } }),
    prisma.user.count({ where: { role: 'designer' } }),
    prisma.designRequest.findMany({
      select: { status: true, category: true, createdAt: true },
    }),
    prisma.user.findMany({
      where: { role: 'designer' },
      select: {
        id: true,
        name: true,
        role: true,
        assignedRequests: {
          select: { status: true },
        },
      },
    }),
  ])

  const activeRequests = totalRequests - completedCount

  // ── Status distribution ───────────────────────────────────
  const statusMap = {}
  allRequests.forEach((r) => {
    statusMap[r.status] = (statusMap[r.status] || 0) + 1
  })
  const statusDistribution = Object.entries(statusMap)
    .map(([status, count]) => ({
      status,
      count,
      pct: Math.round((count / totalRequests) * 100),
    }))
    .sort((a, b) => b.count - a.count)

  // ── Requests by month (last 8 months) ────────────────────
  const now = new Date()

  // Helper: format YYYY-MM tanpa timezone shift
  const toMonthKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(toMonthKey(d))
  }
  const monthMap = {}
  months.forEach((m) => (monthMap[m] = 0))
  allRequests.forEach((r) => {
    const key = toMonthKey(r.createdAt)
    if (monthMap[key] !== undefined) monthMap[key]++
  })
  const requestsByMonth = months.map((m) => ({
    month: m,
    label: new Date(m + '-02').toLocaleString('en-US', { month: 'short' }),
    count: monthMap[m],
  }))

  // ── Requests by category ──────────────────────────────────
  const catMap = {}
  allRequests.forEach((r) => {
    catMap[r.category] = (catMap[r.category] || 0) + 1
  })
  const requestsByCategory = Object.entries(catMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  // ── Designer workload ─────────────────────────────────────
  const designerWorkload = designerWorkloadRaw.map((d) => {
    const active    = d.assignedRequests.filter((r) => r.status !== 'Completed').length
    const completed = d.assignedRequests.filter((r) => r.status === 'Completed').length
    return {
      id: d.id,
      name: d.name,
      role: d.role,
      activeCount: active,
      completedCount: completed,
      totalCount: d.assignedRequests.length,
      capacityPct: Math.min(100, Math.round((active / 5) * 100)), // 5 = kapasitas normal
    }
  }).sort((a, b) => b.activeCount - a.activeCount)

  return NextResponse.json({
    kpi: {
      totalRequests,
      activeRequests,
      completedRequests: completedCount,
      activeDesigners,
    },
    statusDistribution,
    requestsByMonth,
    requestsByCategory,
    designerWorkload,
  })
}
