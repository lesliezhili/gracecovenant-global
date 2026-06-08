// CovenantPath (恩約) — Drizzle ORM schema
// Database: Supabase project ukgolkaejlfhcqhudmve (SHARED project, dedicated schema)
// Schema  : `gracecovenant`  — isolated from SilverConnect and other apps on the same Supabase project
// Auth    : Supabase Auth — covenant.profiles.auth_id references auth.users(id)
//
// Schema isolation strategy:
//   • All GraceCovenant tables live in the `gracecovenant` schema
//   • Supabase Auth stays in the `auth` schema (unchanged, shared)
//   • Supabase Storage buckets are project-wide (use naming prefix: covenant-*)
//   • SilverConnect uses the `public` schema (untouched)
//   • Other apps on this project are fully isolated
import {
  pgSchema, serial, text, integer, boolean,
  timestamp, varchar, uuid,
} from 'drizzle-orm/pg-core'

// ── Dedicated schema — ALL tables + enums scoped here ────────────────────
const gracecovenant = pgSchema('gracecovenant')

// ── Enums (schema-scoped: gracecovenant.gender, gracecovenant.faith_maturity, ...)
export const genderEnum   = gracecovenant.enum('gender',   ['Brother', 'Sister'])
export const faithEnum    = gracecovenant.enum('faith_maturity', ['New', 'Growing', 'Mature', 'Leader'])
export const missionEnum  = gracecovenant.enum('life_mission', [
  'Career+Ministry', 'Full-time Ministry', 'Missionary', 'Christian Education', 'Other'
])
export const marryEnum    = gracecovenant.enum('marriage_history', ['Never', 'Divorced', 'Widowed'])
export const verifyEnum   = gracecovenant.enum('verify_status', ['Unverified', 'Pending', 'Verified'])
export const certEnum     = gracecovenant.enum('cert_type', ['Membership', 'Pastor', 'Baptism'])
export const categoryEnum = gracecovenant.enum('prayer_category', [
  'Marriage', 'Family', 'Faith', 'General', 'Platform'
])

// ── Profiles (extends Supabase auth.users via auth_id FK)
// auth_id = Supabase Auth UUID (auth.users.id) — set on signup
// No password hash — Supabase Auth owns credentials
export const profiles = gracecovenant.table('profiles', {
  id:        serial('id').primaryKey(),
  authId:    uuid('auth_id').notNull().unique(),  // FK → auth.users(id)
  email:     varchar('email', { length: 255 }).notNull().unique(),
  name:      varchar('name', { length: 120 }).notNull(),
  gender:    genderEnum('gender'),
  country:   varchar('country', { length: 80 }),
  church:    varchar('church', { length: 200 }),
  avatarUrl: text('avatar_url'),                  // Supabase Storage public URL
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Backward-compat alias so old imports don't break immediately
export const users = profiles  // backward-compat alias

// ── Spiritual profiles
export const spiritualProfiles = gracecovenant.table('spiritual_profiles', {
  id:             serial('id').primaryKey(),
  userId:         integer('user_id').references(() => profiles.id).notNull(),
  denomination:   varchar('denomination', { length: 80 }),
  churchName:     varchar('church_name', { length: 200 }),
  baptismYear:    integer('baptism_year'),
  regularAttend:  boolean('regular_attend').default(true),
  ministry:       varchar('ministry', { length: 200 }),
  faithMaturity:  faithEnum('faith_maturity'),
  updatedAt:      timestamp('updated_at').defaultNow(),
})

// ── Relationship profiles
export const relationshipProfiles = gracecovenant.table('relationship_profiles', {
  id:              serial('id').primaryKey(),
  userId:          integer('user_id').references(() => profiles.id).notNull(),
  age:             integer('age'),
  location:        varchar('location', { length: 120 }),
  marriageHistory: marryEnum('marriage_history'),
  hasChildren:     boolean('has_children').default(false),
  familyVision:    text('family_vision'),
  lifeMission:     missionEnum('life_mission'),
  openRelocation:  boolean('open_relocation').default(true),
  matchScore:      integer('match_score').default(0),
  about:           text('about'),
  updatedAt:       timestamp('updated_at').defaultNow(),
})

// ── Church verification
export const verifications = gracecovenant.table('verifications', {
  id:         serial('id').primaryKey(),
  userId:     integer('user_id').references(() => users.id).notNull(),
  certType:   certEnum('cert_type'),
  fileUrl:    text('file_url'),
  status:     verifyEnum('status').default('Pending'),
  reviewedAt: timestamp('reviewed_at'),
  createdAt:  timestamp('created_at').defaultNow(),
})

// ── Prayer wall
export const prayers = gracecovenant.table('prayers', {
  id:        serial('id').primaryKey(),
  userId:    integer('user_id').references(() => users.id),
  anonymous: boolean('anonymous').default(true),
  text:      text('text').notNull(),
  category:  categoryEnum('category').default('General'),
  amens:     integer('amens').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

// ── Testimonies
export const testimonies = gracecovenant.table('testimonies', {
  id:           serial('id').primaryKey(),
  userId:       integer('user_id').references(() => users.id),
  coupleNames:  varchar('couple_names', { length: 200 }).notNull(),
  city:         varchar('city', { length: 120 }),
  weddingYear:  integer('wedding_year'),
  story:        text('story').notNull(),
  verse:        varchar('verse', { length: 300 }),
  verified:     boolean('verified').default(false),
  createdAt:    timestamp('created_at').defaultNow(),
})

// ── Identity verifications
export const idTypeEnum    = gracecovenant.enum('id_type', ['DriversLicense', 'Passport', 'Visa'])
export const idStatusEnum  = gracecovenant.enum('id_status', ['Pending', 'Verified', 'Rejected'])
export const visaTypeEnum  = gracecovenant.enum('visa_type', [
  'PR', 'Citizen', 'StudentVisa', 'WorkVisa', 'SpouseVisa', 'Other'
])

export const identityVerifications = gracecovenant.table('identity_verifications', {
  id:              serial('id').primaryKey(),
  userId:          integer('user_id').references(() => users.id).notNull(),
  // Driver's licence
  dlNumber:        varchar('dl_number', { length: 40 }),
  dlState:         varchar('dl_state', { length: 60 }),
  dlExpiry:        varchar('dl_expiry', { length: 20 }),
  dlFileUrl:       text('dl_file_url'),
  dlStatus:        idStatusEnum('dl_status').default('Pending'),
  // Passport
  passportNumber:  varchar('passport_number', { length: 40 }),
  passportCountry: varchar('passport_country', { length: 60 }),
  passportExpiry:  varchar('passport_expiry', { length: 20 }),
  passportFileUrl: text('passport_file_url'),
  passportStatus:  idStatusEnum('passport_status').default('Pending'),
  // Visa (international / non-citizen)
  visaType:        visaTypeEnum('visa_type'),
  visaNumber:      varchar('visa_number', { length: 40 }),
  visaExpiry:      varchar('visa_expiry', { length: 20 }),
  visaFileUrl:     text('visa_file_url'),
  visaStatus:      idStatusEnum('visa_status').default('Pending'),
  // Baptism certificate
  baptized:          boolean('baptized').default(false),
  baptismYear:       integer('baptism_year'),
  baptismChurch:     varchar('baptism_church', { length: 200 }),
  baptismCertUrl:    text('baptism_cert_url'),
  baptismCertStatus: idStatusEnum('baptism_cert_status').default('Pending'),
  overallIdStatus:   idStatusEnum('overall_id_status').default('Pending'),
  verifiedAt:        timestamp('verified_at'),
  updatedAt:         timestamp('updated_at').defaultNow(),
})

// ── Partner preferences
export const educationEnum = gracecovenant.enum('education_level', [
  'HighSchool', 'Diploma', 'Bachelor', 'Masters', 'PhD', 'NoPreference'
])
export const languageEnum  = gracecovenant.enum('language_pref', ['Mandarin', 'Cantonese', 'English', 'Both', 'NoPreference'])

export const partnerPreferences = gracecovenant.table('partner_preferences', {
  id:                 serial('id').primaryKey(),
  userId:             integer('user_id').references(() => users.id).notNull(),
  // Age
  minAge:             integer('min_age').default(22),
  maxAge:             integer('max_age').default(55),
  // Faith essentials
  requireBaptized:    boolean('require_baptized').default(true),
  requireRegularChurch: boolean('require_regular_church').default(true),
  minFaithMaturity:   faithEnum('min_faith_maturity'),
  preferredDenom:     text('preferred_denom'),          // JSON array of strings
  // Family preferences
  openToChildrenFromPrev: boolean('open_to_children_from_prev').default(false),
  desiredChildren:    varchar('desired_children', { length: 40 }), // e.g. '1-3', '0', '4+'
  // Location
  preferredLocations: text('preferred_locations'),      // JSON array of country strings
  requireSameCountry: boolean('require_same_country').default(false),
  // Language & culture
  languagePref:       languageEnum('language_pref').default('NoPreference'),
  heritagePreference: varchar('heritage_pref', { length: 200 }),  // e.g. 'Chinese', 'No preference'
  // Education & career
  minEducation:       educationEnum('min_education').default('NoPreference'),
  careerExpectation:  text('career_expectation'),
  // Life mission alignment
  missionAlignment:   text('mission_alignment'),        // JSON array of missionEnum values
  openToFullTimeMission: boolean('open_to_full_time_mission').default(false),
  // Personality
  personalityNotes:   text('personality_notes'),
  dealbreakers:       text('dealbreakers'),
  // Additional free text
  additionalNotes:    text('additional_notes'),
  updatedAt:          timestamp('updated_at').defaultNow(),
})

// ── Matches
export const matches = gracecovenant.table('matches', {
  id:        serial('id').primaryKey(),
  userId1:   integer('user_id_1').references(() => users.id).notNull(),
  userId2:   integer('user_id_2').references(() => users.id).notNull(),
  score:     integer('score').default(0),
  connected: boolean('connected').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})
