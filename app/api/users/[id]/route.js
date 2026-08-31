import { prisma } from '../../../../lib/db'
import { NextResponse } from 'next/server'
import { requireApiAuth, ROLES } from '../../../../lib/auth'

const allowedRoles = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DESIGNER]

export async function PATCH(request, { params }) {
  // Hanya super admin yang bisa edit user
  const denied = await requireApiAuth([ROLES.SUPER_ADMIN])
  if (denied) return denied

  const { id } = await params
  const parsedId = parseInt(id)
  if (Number.isNaN(parsedId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await request.json()
  const data = {}

  if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim()
  if (typeof body.email === 'string' && body.email.trim()) {
    data.email = body.email.trim().toLowerCase()
    const existing = await prisma.user.findFirst({ where: { email: data.email, id: { not: parsedId } } })
    if (existing) return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }
  if (typeof body.role === 'string' && allowedRoles.includes(body.role)) data.role = body.role
  if (typeof body.password === 'string' && body.password.trim()) data.password = body.password

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  try {
    const user = await prisma.user.update({ where: { id: parsedId }, data })
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (e) {
    if (e.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    throw e
  }
}

export async function DELETE(request, { params }) {
  // Hanya super admin yang bisa hapus user
  const denied = await requireApiAuth([ROLES.SUPER_ADMIN])
  if (denied) return denied

  const { id } = await params
  const parsedId = parseInt(id)
  if (Number.isNaN(parsedId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  // Reassign/unlink dulu sebelum hapus (FK relation)
  await prisma.designRequest.updateMany({
    where: { assignedDesignerId: parsedId },
    data: { assignedDesignerId: null },
  })
  await prisma.designRequest.updateMany({
    where: { createdById: parsedId },
    data: { createdById: null },
  })

  try {
    await prisma.user.delete({ where: { id: parsedId } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
    throw e
  }
}