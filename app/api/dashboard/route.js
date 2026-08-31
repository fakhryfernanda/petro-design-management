import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const [
    totalRequests,
    pendingCount,
    completedCount,
    activeDesigners,
    recentRequests,
    designerWorkloadRaw,
  ] = await Promise.all([
    prisma.designRequest.count(),

    prisma.designRequest.count({ where: { status: 'Pending' } }),

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
        assignedDesigner: {
          select: { id: true, name: true, avatar: true },
        },
      },
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

  // "Active" = sisa status selain Pending dan Completed
  const activeCount = totalRequests - pendingCount - completedCount

  // ── Designer workload ─────────────────────────────────────
  const designerWorkload = designerWorkloadRaw.map((d) => {
    const pending   = d.assignedRequests.filter((r) => r.status === 'Pending').length
    const active    = d.assignedRequests.filter((r) => r.status !== 'Pending' && r.status !== 'Completed').length
    const completed = d.assignedRequests.filter((r) => r.status === 'Completed').length
    return {
      id: d.id,
      name: d.name,
      role: d.role,
      pendingCount: pending,
      activeCount: active,
      completedCount: completed,
      totalCount: d.assignedRequests.length,
    }
  }).sort((a, b) => b.activeCount - a.activeCount)

  return NextResponse.json({
    stats: {
      totalRequests,
      pending: pendingCount,
      active: activeCount,
      completed: completedCount,
      activeDesigners,
      completedPct: totalRequests > 0 ? Math.round((completedCount / totalRequests) * 100) : 0,
    },
    recentRequests,
    designerWorkload,
  })
}
