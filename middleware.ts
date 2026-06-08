/**
 * CovenantPath — Combined middleware
 * 1. next-intl: locale routing (/ → /zh-CN, prefix validation)
 * 2. Supabase: session refresh (locale headers preserved)
 */
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request)
  if (intlResponse.status >= 300) return intlResponse

  let supabaseResponse = NextResponse.next({ request })
  // Preserve x-next-intl-locale header so server components get the right locale
  intlResponse.headers.forEach((value, key) => supabaseResponse.headers.set(key, value))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          intlResponse.headers.forEach((value, key) => supabaseResponse.headers.set(key, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )
  await supabase.auth.getUser()
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\.ico|manifest\.json|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
