/**
 * POST /api/auth/login
 * Supabase email+password sign-in.
 * @supabase/ssr automatically sets the session cookie in the response.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { db } from '@/lib/db'
import { profiles } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (error || !data.user) {
      // Supabase returns 'Invalid login credentials' for both wrong email and password
      return NextResponse.json(
        { error: '\u90ae\u7bb1\u6216\u5bc6\u7801\u9519\u8bef / Invalid email or password' },
        { status: 401 }
      )
    }

    // Fetch profile from our DB for display name etc.
    const [profile] = await db
      .select({ id: profiles.id, name: profiles.name, email: profiles.email })
      .from(profiles)
      .where(eq(profiles.authId, data.user.id))

    return NextResponse.json({
      ok: true,
      user: {
        id:    profile?.id ?? data.user.id,
        name:  profile?.name ?? data.user.email,
        email: data.user.email,
      },
    })
  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
