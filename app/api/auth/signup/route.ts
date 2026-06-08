/**
 * POST /api/auth/signup
 * 1. Creates a Supabase Auth user (handles password hashing, email confirm)
 * 2. Inserts a profile row in our DB linked by auth_id (UUID)
 * @supabase/ssr sets the session cookie automatically.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { db } from '@/lib/db'
import { profiles } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, gender, country, church } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: '\u5bc6\u7801\u81f38\u4e2a\u5b57\u7b26 / Password must be 8+ characters' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()
    const normalEmail = email.toLowerCase().trim()

    // 1. Create Supabase Auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: normalEmail,
      password,
      options: {
        data: { full_name: name },
        // emailRedirectTo: set in Supabase Dashboard > Auth > Email Templates
      },
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: '\u90ae\u7bb1\u5df2\u6ce8\u518c / Email already registered' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
    }

    // 2. Insert profile row linked to Supabase Auth user
    // Guard against duplicate (idempotent re-register)
    const [existing] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.authId, authData.user.id))

    let profile = existing
    if (!existing) {
      const [inserted] = await db.insert(profiles).values({
        authId:  authData.user.id,
        name,
        email:   normalEmail,
        gender:  gender  ?? null,
        country: country ?? null,
        church:  church  ?? null,
      }).returning()
      profile = inserted
    }

    return NextResponse.json(
      { ok: true, user: { id: profile.id, name, email: normalEmail },
        emailConfirmRequired: !authData.session },
      { status: 201 }
    )
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
