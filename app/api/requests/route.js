import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const search     = searchParams.get('search')?.trim()     || ''
  const category   = searchParams.get('category')           || ''
  const client     = searchParams.get('client')             || ''
  const designerId = searchParams.get('designerId')         || ''
  const status     = searchParams.get('status')             || ''
  const month      = searchParams.get('month')              || '' // format: YYYY-MM
  const page       = Math.max(1, parseInt(searchParams.get('page')  || '1'))
  const limit      = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '8')))

  // Build where clause dinamis
  const where = {}

  if (search) {
    where.OR = [
      { title:  { contains: search } },
      { client: { contains: search } },
    ]
  }

  if (category) where.category = category
  if (client)   where.client   = { contains: client }
  if (status)   where.status   = status

  if (designerId) {
    where.assignedDesignerId = parseInt(designerId)
  }

  if (month) {
    // month = 'YYYY-MM' → filter berdasar createdAt dalam bulan tersebut
    const [year, mon] = month.split('-').map(Number)
    const start = new Date(year, mon - 1, 1)
    const end   = new Date(year, mon, 1)
    where.createdAt = { gte: start, lt: end }
  }

  // Jalankan count + data secara paralel
  const [total, data] = await Promise.all([
    prisma.designRequest.count({ where }),
    prisma.designRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        assignedDesigner: {
          select: { id: true, name: true, avatar: true },
        },
        tags: {
          include: { tag: { select: { name: true } } },
        },
      },
    }),
  ])

  // Flatten tags jadi array string
  const formatted = data.map((r) => ({
    ...r,
    tags: r.tags.map((rt) => rt.tag.name),
  }))

  return NextResponse.json({
    data:       formatted,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
  })
}
