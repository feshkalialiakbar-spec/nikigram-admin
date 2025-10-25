import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('user_token')
  const userStatus = request.cookies.get('user_status')?.value

  if (
    request.nextUrl.pathname !== '/payment-status/success' &&
    request.nextUrl.pathname !== '/questions' &&
    request.nextUrl.pathname !== '/auth/sign-up' &&
    request.nextUrl.pathname !== '/test' &&
    request.nextUrl.pathname !== '/error'
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(
        new URL(
          `${process?.env?.NEXT_PUBLIC_APP_URL || ''}/auth/login`,
          request.url
        )
      )
    }

    if (userStatus === 'INACTIVE') {
      return NextResponse.redirect(
        new URL(
          `${process?.env?.NEXT_PUBLIC_APP_URL || ''}/auth/validator`,
          request.url
        )
      )
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth/login|auth/signup|auth/validator).*)',
  ],
}
