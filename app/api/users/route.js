import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') || ''

  const users = await prisma.user.findMany({
    where: role ? { role } : {},
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      assignedRequests: {
        select: { status: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  const formatted = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    activeCount:  u.assignedRequests.filter((r) => r.status !== 'Completed').length,
    completedCount: u.assignedRequests.filter((r) => r.status === 'Completed').length,
  }))

  return NextResponse.json(formatted)
}

export async function POST(request) {
  const body = await request.json()
  const name = body.name?.trim()
  const email = body.email?.trim().toLowerCase()
  const role = body.role || 'designer'
  const password = body.password

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
  }

  const allowedRoles = ['designer', 'admin', 'studio_director']
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const user = await prisma.user.create({
    data: { name, email, role, password },
  })

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    activeCount: 0,
    completedCount: 0,
  }, { status: 201 })
}