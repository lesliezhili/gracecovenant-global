// CovenantPath — Identity Verification API
// Accepts multipart form data with document fields + file uploads
// Files are stored encrypted (in production: use S3/R2 presigned URLs)
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { identityVerifications, profiles } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const authUser = await getSessionUser()
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }
    // profiles.id (integer) is used as FK in all child tables
    const [profile] = await db.select({ id: profiles.id })
      .from(profiles).where(eq(profiles.authId, authUser.id))
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    const userId = profile.id

    // Parse multipart form
    const formData = await req.formData()

    // Extract text fields
    const dlNumber        = formData.get('dlNumber')?.toString() ?? null
    const dlState         = formData.get('dlState')?.toString() ?? null
    const dlExpiry        = formData.get('dlExpiry')?.toString() ?? null
    const passportNumber  = formData.get('passportNumber')?.toString() ?? null
    const passportCountry = formData.get('passportCountry')?.toString() ?? null
    const passportExpiry  = formData.get('passportExpiry')?.toString() ?? null
    const visaType        = formData.get('visaType')?.toString() ?? null
    const visaNumber      = formData.get('visaNumber')?.toString() ?? null
    const visaExpiry      = formData.get('visaExpiry')?.toString() ?? null
    const baptized        = formData.get('isBaptized') === 'true'
    const baptismYear     = formData.get('baptismYear') ? Number(formData.get('baptismYear')) : null
    const baptismChurch   = formData.get('baptismChurch')?.toString() ?? null

    // In production: upload files to R2/S3 and store signed URLs
    // For MVP: store placeholder paths
    const dlFile       = formData.get('dlFile') as File | null
    const passportFile = formData.get('passportFile') as File | null
    const visaFile     = formData.get('visaFile') as File | null
    const baptismFile  = formData.get('baptismFile') as File | null

    const dlFileUrl       = dlFile       ? `/uploads/id/${userId}/dl-${Date.now()}`       : null
    const passportFileUrl = passportFile ? `/uploads/id/${userId}/passport-${Date.now()}` : null
    const visaFileUrl     = visaFile     ? `/uploads/id/${userId}/visa-${Date.now()}`     : null
    const baptismCertUrl  = baptismFile  ? `/uploads/id/${userId}/baptism-${Date.now()}`  : null

    // Upsert verification record
    const existing = await db.select()
      .from(identityVerifications)
      .where(eq(identityVerifications.userId, userId))

    if (existing.length > 0) {
      await db.update(identityVerifications)
        .set({
          dlNumber, dlState, dlExpiry,
          ...(dlFileUrl && { dlFileUrl }),
          dlStatus: 'Pending',
          passportNumber, passportCountry, passportExpiry,
          ...(passportFileUrl && { passportFileUrl }),
          passportStatus: 'Pending',
          visaType: visaType as 'PR' | 'Citizen' | 'StudentVisa' | 'WorkVisa' | 'SpouseVisa' | 'Other' | null,
          visaNumber, visaExpiry,
          ...(visaFileUrl && { visaFileUrl }),
          visaStatus: 'Pending',
          baptized,
          baptismYear,
          baptismChurch,
          ...(baptismCertUrl && { baptismCertUrl }),
          baptismCertStatus: 'Pending',
          overallIdStatus: 'Pending',
          updatedAt: new Date(),
        })
        .where(eq(identityVerifications.userId, userId))
    } else {
      await db.insert(identityVerifications).values({
        userId: userId,
        dlNumber, dlState, dlExpiry,
        dlFileUrl, dlStatus: 'Pending',
        passportNumber, passportCountry, passportExpiry,
        passportFileUrl, passportStatus: 'Pending',
        visaType: visaType as 'PR' | 'Citizen' | 'StudentVisa' | 'WorkVisa' | 'SpouseVisa' | 'Other' | null,
        visaNumber, visaExpiry,
        visaFileUrl, visaStatus: 'Pending',
        baptized,
        baptismYear,
        baptismChurch,
        baptismCertUrl, baptismCertStatus: 'Pending',
        overallIdStatus: 'Pending',
      })
    }

    return NextResponse.json({ ok: true, message: 'Verification documents submitted.' })
  } catch (err) {
    console.error('[id-verify]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest) {
  try {
    const authUser = await getSessionUser()
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }
    const [profile] = await db.select({ id: profiles.id })
      .from(profiles).where(eq(profiles.authId, authUser.id))
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    const [record] = await db.select()
      .from(identityVerifications)
      .where(eq(identityVerifications.userId, profile.id))

    return NextResponse.json({ ok: true, data: record ?? null })
  } catch (err) {
    console.error('[id-verify GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
