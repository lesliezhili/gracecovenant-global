/**
 * CovenantPath — Drizzle Kit config
 *
 * Shared Supabase project: ukgolkaejlfhcqhudmve
 * Schema: `gracecovenant`  (all GraceCovenant tables live here, separate from SilverConnect)
 *
 * Commands:
 *   npm run db:generate   — generate SQL migration files
 *   npm run db:push       — push schema directly (dev/staging)
 *   npm run db:studio     — open Drizzle Studio GUI
 *
 * IMPORTANT: Never run db:push against the Supabase `public` schema—
 * that would affect SilverConnect and other apps on this shared project.
 */
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema:      './drizzle/schema.ts',
  out:         './drizzle/migrations',
  dialect:     'postgresql',

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // ── Schema isolation: only touch the `gracecovenant` schema ───────────
  // This prevents drizzle-kit from scanning `public` (SilverConnect) or `auth`
  schemaFilter: ['gracecovenant'],

  // Verbose output in dev
  verbose: true,
  strict:  true,
})
