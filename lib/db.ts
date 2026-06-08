// CovenantPath — Database connection
// Supabase PostgreSQL via Transaction Pooler (port 6543)
// DATABASE_URL: Supabase Dashboard > Project Settings > Database > URI (Transaction Pooler)
// Format: postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/drizzle/schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. See .env.example')
}

// Transaction Pooler (PgBouncer) requires prepare:false
// options.connection sets search_path so all queries resolve to gracecovenant schema
// gracecovenant = GraceCovenant tables (separate from SilverConnect public schema)
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  connection: {
    // gracecovenant: GraceCovenant app tables
    // public: SilverConnect (read-only, never written by this app)
    // auth: Supabase Auth (shared)
    search_path: 'gracecovenant,auth,public',
  },
})
export const db = drizzle(client, { schema })

export type DB = typeof db
