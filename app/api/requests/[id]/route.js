import { prisma } from '../../../../lib/db'
import { NextResponse } from 'next/server'
import { requireApiAuth, ROLES } from '../../../../lib/auth'

export async function GET(request, { params }) {
  const { id } = await params
  const parsedId = parseInt(id)

  if (Number.isNaN(parsedId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const req = await prisma.designRequest.findUnique({
    where: { id: parsedId },
    include: {
      assignedDesigner: {
        select: { id: true, name: true, avatar: true },
      },
      createdBy: {
        select: { id: true, name: true },
      },
      files: {
        orderBy: { createdAt: 'asc' },
      },
      statusLogs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!req) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(req)
}

export async function PATCH(request, { params }) {
  // Designer & super admin bisa edit request
  const denied = await requireApiAuth([ROLES.SUPER_ADMIN, ROLES.DESIGNER])
  if (denied) return denied

  const { id } = await params
  const parsedId = parseInt(id)

  if (Number.isNaN(parsedId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const body = await request.json()

  const VALID_STATUSES = ['Pending', 'In Progress', 'Accepted', 'On Revision', 'Completed']
  const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent']

  // Ambil status saat ini — untuk timeline milestones
  const current = await prisma.designRequest.findUnique({
    where: { id: parsedId },
    select: { status: true },
  })

  if (!current) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const data = {}
  if (typeof body.description === 'string') data.description = body.description
  if (typeof body.priority === 'string' && VALID_PRIORITIES.includes(body.priority)) {
    data.priority = body.priority
  }
  if (typeof body.status === 'string' && VALID_STATUSES.includes(body.status)) {
    data.status = body.status
    // Timeline milestones — hanya set forward dari status lama ke baru
    const now = new Date()
    if (body.status !== current.status) {
      if (body.status === 'In Progress') data.startedAt = now
      if (body.status === 'Accepted')   data.acceptedAt = now
      if (body.status === 'On Revision') data.onRevisionAt = now
      if (body.status === 'Completed')  data.completedAt = now
    }
  }
  if (body.assignedDesignerId !== undefined) {
    // null → unassign; angka → assign ke user id
    data.assignedDesignerId = body.assignedDesignerId === null
      ? null
      : parseInt(body.assignedDesignerId)
    if (data.assignedDesignerId !== null && Number.isNaN(data.assignedDesignerId)) {
      return NextResponse.json({ error: 'Invalid designer id' }, { status: 400 })
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  try {
    await prisma.designRequest.update({
      where: { id: parsedId },
      data,
    })

    // Catat riwayat status jika status berubah
    if (data.status && data.status !== current.status) {
      await prisma.statusLog.create({
        data: {
          from: current.status,
          to: data.status,
          requestId: parsedId,
        },
      })
    }

    // Ambil ulang dengan log terbaru
    const updated = await prisma.designRequest.findUnique({
      where: { id: parsedId },
      include: {
        assignedDesigner: {
          select: { id: true, name: true, avatar: true },
        },
        statusLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (e) {
    if (e.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    throw e
  }
}
