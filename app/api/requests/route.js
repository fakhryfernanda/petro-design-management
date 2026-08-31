import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'
import { requireApiAuth, ROLES } from '../../../lib/auth'

export async function POST(request) {
  // Admin & super admin saja yang bisa create request
  const denied = await requireApiAuth([ROLES.SUPER_ADMIN, ROLES.ADMIN])
  if (denied) return denied

  const body = await request.json()

  const title = body.title?.trim()
  const category = body.category?.trim()
  const client = body.client?.trim()

  if (!title || !category || !client) {
    return NextResponse.json(
      { error: 'Title, category, and client are required' },
      { status: 400 }
    )
  }

  const req = await prisma.designRequest.create({
    data: {
      title,
      category,
      subCategory1: body.subCategory1?.trim() || null,
      subCategory2: body.subCategory2?.trim() || null,
      tagType:     body.tagType === 'Custom' ? 'Custom' : 'Regular',
      client,
      description: body.description?.trim() || null,
      priority:    body.priority           || 'Medium',
      status:      'Pending',
      deadline:    body.deadline ? new Date(body.deadline) : null,
    },
  })

  return NextResponse.json(req, { status: 201 })
}

export async function GET(request) {
  // Semua role yang login boleh baca
  const denied = await requireApiAuth()
  if (denied) return denied

  const { searchParams } = new URL(request.url)

  const search     = searchParams.get('search')?.trim()     || ''
  const category   = searchParams.get('category')           || ''
  const subCategory1 = searchParams.get('subCategory1')     || ''
  const subCategory2 = searchParams.get('subCategory2')     || ''
  const client     = searchParams.get('client')             || ''
  const designerId = searchParams.get('designerId')         || ''
  const status     = searchParams.get('status')             || ''
  const tagType    = searchParams.get('tagType')            || ''
  const month      = searchParams.get('month')              || '' // format: YYYY-MM
  const page       = Math.max(1, parseInt(searchParams.get('page')  || '1'))
  const limit      = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '8')))

  // Build where clause dinamis
  const where = {}

  if (search) {
    where.title = { contains: search }
  }

  if (category) where.category = category
  if (subCategory1) where.subCategory1 = subCategory1
  if (subCategory2) where.subCategory2 = subCategory2
  if (client)   where.client   = { contains: client }
  if (status)   where.status   = status
  if (tagType)  where.tagType  = tagType

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
        files: {
          where: { type: 'reference', mimeType: { startsWith: 'image/' } },
          orderBy: { createdAt: 'asc' },
          take: 1,
          select: { url: true, mimeType: true },
        },
      },
    }),
  ])

  return NextResponse.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    limit,
  })
}
