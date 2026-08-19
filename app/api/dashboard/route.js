import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  // Status yang dianggap "aktif" (bukan completed)
  const ACTIVE_STATUSES = ['In Progress', 'Review', 'Revision', 'On Hold']

  const [
    totalRequests,
    completedCount,
    activeDesigners,
    recentRequests,
    statusCounts,
  ] = await Promise.all([
    prisma.designRequest.count(),

    prisma.designRequest.count({ where: { status: 'Completed' } }),

    prisma.user.count({ where: { role: 'designer' } }),

    prisma.designRequest.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        client: true,
        status: true,
        progress: true,
      },
    }),

    prisma.designRequest.groupBy({
      by: ['status'],
      _count: true,
    }),
  ])

  // pending = semua yang belum completed
  const pendingCount = totalRequests - completedCount

  // Map statusCounts ke object { status: count }
  const byStatus = {}
  for (const s of statusCounts) {
    byStatus[s.status] = s._count
  }

  // Distribusi untuk pie chart — hanya status aktif
  const activeTotal = ACTIVE_STATUSES.reduce((sum, s) => sum + (byStatus[s] || 0), 0)

  const statusDistribution = ACTIVE_STATUSES
    .map((status) => ({
      status,
      count: byStatus[status] || 0,
      pct: activeTotal > 0 ? Math.round(((byStatus[status] || 0) / activeTotal) * 100) : 0,
    }))
    .filter((d) => d.count > 0)

  return NextResponse.json({
    stats: {
      totalRequests,
      pending: pendingCount,
      completed: completedCount,
      activeDesigners,
      completedPct: totalRequests > 0 ? Math.round((completedCount / totalRequests) * 100) : 0,
    },
    recentRequests,
    statusDistribution,
    activeTotal,
  })
}
