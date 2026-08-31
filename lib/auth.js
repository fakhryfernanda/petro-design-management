import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret')
const COOKIE_NAME = 'petro_session'
const MAX_AGE = 7 * 24 * 60 * 60 // 7 hari (detik)

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DESIGNER: 'designer',
}

/** Sign a JWT session token for a user. */
export async function signSession(user) {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(SECRET)
}

/** Verify + decode a session token. Returns payload or null. */
export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch {
    return null
  }
}

/** Read the session from the request cookie. Returns payload or null. */
export async function getSession() {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySession(token)
}

/** Set the session cookie on a response. */
export async function setSessionCookie(response, token) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
  return response
}

/** Clear the session cookie. */
export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

/** Server-side guard: if no session, redirect to login. */
export function requireAuth(session) {
  if (!session) {
    return NextResponse.redirect(new URL('/login', process.env.NEXTAUTH_URL || 'http://localhost:3001'))
  }
  return null
}

/** Server-side guard: require one of the given roles. */
export function requireRole(session, roles) {
  if (!session || !roles.includes(session.role)) {
    return NextResponse.redirect(new URL('/dashboard', process.env.NEXTAUTH_URL || 'http://localhost:3001'))
  }
  return null
}

/**
 * API auth guard. Jika session tidak ada → 401; jika role tidak diizinkan → 403.
 * Return response error atau null jika lolos.
 */
export async function requireApiAuth(roles = null) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (roles && !roles.includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}
