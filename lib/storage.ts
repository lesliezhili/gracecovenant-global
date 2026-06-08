/**
 * CovenantPath — Supabase Storage helpers
 *
 * Buckets (create these in Supabase Dashboard > Storage):
 *   id-documents   — PRIVATE  (driver licence, passport, visa, baptism cert)
 *   profile-photos — PUBLIC   (avatar images)
 *
 * Path convention:
 *   id-documents/  {userId}/{docType}/{filename}
 *   profile-photos/{userId}/avatar.{ext}
 */
import { createAdminClient } from './supabase'

export type DocType =
  | 'driving-licence'
  | 'passport'
  | 'visa'
  | 'baptism-cert'
  | 'church-cert'

// Bucket names prefixed with `gracecovenant-` to avoid collision with
// SilverConnect and other apps on the same Supabase project ukgolkaejlfhcqhudmve
const ID_BUCKET      = 'gracecovenant-id-documents'    // PRIVATE
const PHOTO_BUCKET   = 'gracecovenant-profile-photos'  // PUBLIC

// ── Upload an ID document (private bucket) ────────────────────────────
export async function uploadIdDocument(
  userId: string,
  docType: DocType,
  file: File,
): Promise<{ path: string; signedUrl: string }> {
  const supabase = createAdminClient()
  const ext  = file.name.split('.').pop() ?? 'bin'
  const path = `${userId}/${docType}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from(ID_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw new Error(`Storage upload failed: ${error.message}`)

  // Generate 1-hour signed URL for display after upload
  const { data: signed, error: signErr } = await supabase.storage
    .from(ID_BUCKET)
    .createSignedUrl(path, 3600)

  if (signErr || !signed) throw new Error(`Signed URL failed: ${signErr?.message}`)

  return { path, signedUrl: signed.signedUrl }
}

// ── Get a short-lived signed URL for a private document ─────────────────
export async function getSignedUrl(
  path: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage
    .from(ID_BUCKET)
    .createSignedUrl(path, expiresInSeconds)

  if (error || !data) throw new Error(`Signed URL error: ${error?.message}`)
  return data.signedUrl
}

// ── Upload a profile photo (public bucket) ────────────────────────────
export async function uploadProfilePhoto(
  userId: string,
  file: File,
): Promise<{ publicUrl: string }> {
  const supabase = createAdminClient()
  const ext  = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw new Error(`Photo upload failed: ${error.message}`)

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path)
  return { publicUrl: data.publicUrl }
}

// ── Delete a file from private bucket ─────────────────────────────────
export async function deleteDocument(path: string): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase.storage.from(ID_BUCKET).remove([path])
  if (error) throw new Error(`Delete failed: ${error.message}`)
}
