// CovenantPath — Database connection
// Supabase PostgreSQL via Transaction Pooler (port 6543)
// DATABASE_URL: Supabase Dashboard > Project Settings > Database > URI (Transaction Pooler)
// Format: postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/drizzle/schema'

// Transaction Pooler (PgBouncer) requires prepare:false
// options.connection sets search_path so all queries resolve to gracecovenant schema
// gracecovenant = GraceCovenant tables (separate from SilverConnect public schema)
const createDb = () => {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    return new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
      get() {
        throw new Error('DATABASE_URL is not set. See .env.example')
      },
    })
  }

  const client = postgres(databaseUrl, {
    prepare: false,
    connection: {
      // gracecovenant: GraceCovenant app tables
      // public: SilverConnect (read-only, never written by this app)
      // auth: Supabase Auth (shared)
      search_path: 'gracecovenant,auth,public',
    },
  })

  return drizzle(client, { schema })
}

export const db = createDb()

export type DB = typeof db
