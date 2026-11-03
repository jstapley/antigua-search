import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // On admin subdomain: serve admin manifest and redirect root → /dashboard/admin
  if (hostname === 'admin.antiguasearch.com') {
    if (pathname === '/manifest.json') {
      return NextResponse.rewrite(new URL('/manifest-admin.json', request.url))
    }
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/manifest.json'],
}
