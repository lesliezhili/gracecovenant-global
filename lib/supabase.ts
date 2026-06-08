/**
 * CovenantPath — Supabase clients
 *
 * Three client variants for Next.js App Router:
 *   1. createBrowserClient   — client components (singleton, browser)
 *   2. createServerClient    — server components / API routes (reads cookies)
 *   3. createAdminClient     — server-only, service role (bypasses RLS)
 *
 * Supabase handles:
 *   ✓ Authentication (email+password, magic link ready)
 *   ✓ Session management (httpOnly cookie via @supabase/ssr)
 *   ✓ Storage (ID documents, profile photos — private/public buckets)
 *   ✓ Row-Level Security on PostgreSQL tables
 */
import { createBrowserClient as _createBrowserClient } from '@supabase/ssr'
import { createServerClient as _createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SRK  = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ── 1. Browser client (client components) ────────────────────────────────
export function createBrowserClient() {
  return _createBrowserClient(SUPABASE_URL, SUPABASE_ANON)
}

// ── 2. Server client (server components, Route Handlers, Server Actions) ─
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  return _createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll()              { return cookieStore.getAll() },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAll(cookiesToSet: { name: string; value: string; options: any }[])  {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // setAll called from Server Component — cookies are read-only there.
          // The middleware handles session refresh in those cases.
        }
      },
    },
  })
}

// ── 3. Admin client (service role — bypasses RLS, server-only) ───────────
// Use only in trusted server code: migrations, admin API routes, seeding.
export function createAdminClient() {
  if (!SUPABASE_SRK) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set')
  return createClient(SUPABASE_URL, SUPABASE_SRK, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// ── Type helpers ─────────────────────────────────────────────────────────
export type SupabaseUser = Awaited<
  ReturnType<ReturnType<typeof createBrowserClient>['auth']['getUser']>
>['data']['user']
