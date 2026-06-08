// CovenantPath — Partner Preferences API
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { partnerPreferences, profiles } from '@/drizzle/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const authUser = await getSessionUser()
    if (!authUser) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    const [profile] = await db.select({ id: profiles.id })
      .from(profiles).where(eq(profiles.authId, authUser.id))
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    const userId = profile.id

    const body = await req.json()
    const {
      minAge, maxAge,
      requireBaptized, requireRegularChurch, minFaithMaturity,
      selectedDenoms, openToChildrenFromPrev, desiredChildren,
      selectedLocations, requireSameCountry, languagePref,
      heritagePreference, minEducation, careerExpectation,
      selectedMissions, openToFullTimeMission,
      personalityNotes, dealbreakers, additionalNotes,
    } = body

    const values = {
      userId,
      minAge:              minAge ?? 22,
      maxAge:              maxAge ?? 55,
      requireBaptized:     requireBaptized ?? true,
      requireRegularChurch: requireRegularChurch ?? true,
      minFaithMaturity:    minFaithMaturity ?? null,
      preferredDenom:      JSON.stringify(selectedDenoms ?? []),
      openToChildrenFromPrev: openToChildrenFromPrev ?? false,
      desiredChildren:     desiredChildren ?? null,
      preferredLocations:  JSON.stringify(selectedLocations ?? []),
      requireSameCountry:  requireSameCountry ?? false,
      languagePref:        (languagePref ?? 'NoPreference') as 'Mandarin' | 'Cantonese' | 'English' | 'Both' | 'NoPreference',
      heritagePreference:  heritagePreference ?? null,
      minEducation:        (minEducation ?? 'NoPreference') as 'HighSchool' | 'Diploma' | 'Bachelor' | 'Masters' | 'PhD' | 'NoPreference',
      careerExpectation:   careerExpectation ?? null,
      missionAlignment:    JSON.stringify(selectedMissions ?? []),
      openToFullTimeMission: openToFullTimeMission ?? false,
      personalityNotes:    personalityNotes ?? null,
      dealbreakers:        dealbreakers ?? null,
      additionalNotes:     additionalNotes ?? null,
      updatedAt:           new Date(),
    }

    const existing = await db.select().from(partnerPreferences)
      .where(eq(partnerPreferences.userId, userId))
    if (existing.length > 0) {
      await db.update(partnerPreferences).set(values)
        .where(eq(partnerPreferences.userId, userId))
    } else {
      await db.insert(partnerPreferences).values(values)
    }
    return NextResponse.json({ ok: true, message: 'Partner preferences saved.' })
  } catch (err) {
    console.error('[preferences POST]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest) {
  try {
    const authUser = await getSessionUser()
    if (!authUser) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    const [profile] = await db.select({ id: profiles.id })
      .from(profiles).where(eq(profiles.authId, authUser.id))
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    const [record] = await db.select().from(partnerPreferences)
      .where(eq(partnerPreferences.userId, profile.id))
    if (record) {
      return NextResponse.json({
        ok: true,
        data: {
          ...record,
          preferredDenom:     JSON.parse(record.preferredDenom     ?? '[]'),
          preferredLocations: JSON.parse(record.preferredLocations ?? '[]'),
          missionAlignment:   JSON.parse(record.missionAlignment   ?? '[]'),
        },
      })
    }
    return NextResponse.json({ ok: true, data: null })
  } catch (err) {
    console.error('[preferences GET]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
