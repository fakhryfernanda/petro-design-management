import { prisma } from '../../../../lib/db'
import { NextResponse } from 'next/server'

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
      tags: {
        include: { tag: { select: { name: true } } },
      },
      files: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!req) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Flatten tags
  const formatted = {
    ...req,
    tags: req.tags.map((rt) => rt.tag.name),
  }

  return NextResponse.json(formatted)
}

export async function PATCH(request, { params }) {
  const { id } = await params
  const parsedId = parseInt(id)

  if (Number.isNaN(parsedId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const body = await request.json()

  const data = {}
  if (typeof body.description === 'string') data.description = body.description

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  try {
    const updated = await prisma.designRequest.update({
      where: { id: parsedId },
      data,
    })
    return NextResponse.json(updated)
  } catch (e) {
    if (e.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    throw e
  }
}
