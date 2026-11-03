import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Check for the specific Supabase session cookie for this project
  const supabaseCookie = request.cookies.get('sb-yhblxzdydirndlprmnan-auth-token')
  
  // Also check chunked cookie variant (Supabase sometimes splits large tokens)
  const supabaseCookie0 = request.cookies.get('sb-yhblxzdydirndlprmnan-auth-token.0')

  // Legacy password cookie
  const legacyCookie = request.cookies.get('admin_session')
  const hasLegacySession = legacyCookie?.value === process.env.ADMIN_PASSWORD

  const hasSession = !!supabaseCookie || !!supabaseCookie0 || hasLegacySession

  if (!hasSession) {
    const allCookies = request.cookies.getAll().map(c => c.name).join(', ')
    console.log('[Middleware] No session found. Cookies present:', allCookies)
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}