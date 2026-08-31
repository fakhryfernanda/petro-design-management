import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret')
const COOKIE_NAME = 'petro_session'

// Route yang butuh login
const PROTECTED = ['/dashboard', '/requests', '/archive', '/analytics', '/users']
// Route yang khusus super admin
const SUPER_ADMIN_ROUTES = ['/users']
// Route yang khusus admin/super admin (create request)
const CREATE_ROUTES = ['/requests/new']

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  let session = null
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET)
      session = payload
    } catch {
      session = null
    }
  }

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))

  // Sudah login tapi akses /login → redirect dashboard
  if (session && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Belum login, akses protected → redirect login
  if (!session && isProtected) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Login tapi bukan super admin, akses super admin route → redirect dashboard
  if (session && SUPER_ADMIN_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    if (session.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Login tapi bukan admin/super admin, akses create route → redirect dashboard
  if (session && CREATE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))) {
    if (!['admin', 'super_admin'].includes(session.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|uploads|api).*)'],
}
