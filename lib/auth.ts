/**
 * CovenantPath — Auth helpers (Supabase)
 *
 * Replaces iron-session. Session management is handled automatically
 * by @supabase/ssr via httpOnly cookies — no manual cookie code needed.
 *
 * Usage in Server Components / Route Handlers:
 *   const supabase = await createServerSupabaseClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 */
import { createServerSupabaseClient } from './supabase'

// Get the currently logged-in user (server-side, reads cookie session)
export async function getSessionUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

// Require auth — throws if not logged in (use in protected Route Handlers)
export async function requireAuth() {
  const user = await getSessionUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
