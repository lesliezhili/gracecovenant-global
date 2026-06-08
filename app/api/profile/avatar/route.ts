/**
 * POST /api/profile/avatar
 * Accepts: multipart/form-data  { file: File }
 * 1. Reads auth session → gets userId
 * 2. Uploads image to `gracecovenant-profile-photos` Supabase Storage
 * 3. Updates gracecovenant.profiles.avatar_url
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase'
import { db } from '@/lib/db'
import { profiles } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const PHOTO_BUCKET = 'gracecovenant-profile-photos'
const MAX_BYTES    = 5 * 1024 * 1024  // 5 MB

export async function POST(req: NextRequest) {
  try {
    // 1. Auth — who is this?
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authErr } = await supabase.auth.getUser()
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Read the uploaded file from multipart form
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })
    }

    // 3. Upload to Supabase Storage
    //    Path: {userId}/avatar.{ext}  — always overwrites previous photo
    const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${user.id}/avatar.${ext}`

    const admin = createAdminClient()
    const buffer = await file.arrayBuffer()
    const { error: uploadErr } = await admin.storage
      .from(PHOTO_BUCKET)
      .upload(path, buffer, {
        contentType:  file.type,
        upsert:       true,   // overwrite existing
      })

    if (uploadErr) {
      console.error('[avatar upload]', uploadErr)
      return NextResponse.json({ error: 'Upload failed: ' + uploadErr.message }, { status: 500 })
    }

    // 4. Get public URL
    const { data: { publicUrl } } = admin.storage
      .from(PHOTO_BUCKET)
      .getPublicUrl(path)

    // 5. Update profile row with new avatar URL
    await db
      .update(profiles)
      .set({ avatarUrl: publicUrl, updatedAt: new Date() })
      .where(eq(profiles.authId, user.id))

    return NextResponse.json({ ok: true, avatarUrl: publicUrl })
  } catch (err) {
    console.error('[avatar]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
