import { prisma } from '../../../../lib/db'
import { signSession, setSessionCookie } from '../../../../lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const body = await request.json()
  const email = body.email?.trim().toLowerCase()
  const password = body.password

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  // Plaintext password (prototype)
  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = await signSession(user)
  const response = NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })

  return setSessionCookie(response, token)
}
