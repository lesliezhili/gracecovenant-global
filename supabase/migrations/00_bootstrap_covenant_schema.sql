-- GraceCovenant (恩約先) — Bootstrap Migration
-- Supabase project: ukgolkaejlfhcqhudmve  (SHARED project)
-- Run ONCE in Supabase Dashboard > SQL Editor before first `drizzle-kit push`
--
-- Schema separation strategy:
--   • gracecovenant schema — ALL GraceCovenant tables (this file)
--   • public schema         — SilverConnect (untouched by this migration)
--   • auth schema           — Supabase Auth (shared, untouched)
--
-- If migrating from old `covenant` schema, run FIRST:
--   ALTER SCHEMA covenant RENAME TO gracecovenant;
-- Then run this file.
--
-- Run subsequent schema changes via: npm run db:push

-- ============================================================
-- 1. Create schema
-- ============================================================
CREATE SCHEMA IF NOT EXISTS gracecovenant;

-- Grant usage to Supabase roles
GRANT USAGE ON SCHEMA gracecovenant TO anon, authenticated, service_role;

-- Future tables: automatically grant to authenticated/service_role
ALTER DEFAULT PRIVILEGES IN SCHEMA gracecovenant
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA gracecovenant
  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA gracecovenant
  GRANT USAGE, SELECT ON SEQUENCES TO authenticated, service_role;


-- ============================================================
-- 2. Storage buckets
--    (also available via Supabase Dashboard > Storage > New bucket)
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'gracecovenant-id-documents',
    'gracecovenant-id-documents',
    false,              -- PRIVATE: driver licences, passports, visas, baptism certs
    10485760,           -- 10 MB per file
    ARRAY['image/jpeg','image/png','image/webp','application/pdf']
  ),
  (
    'gracecovenant-profile-photos',
    'gracecovenant-profile-photos',
    true,               -- PUBLIC: avatar images
    5242880,            -- 5 MB per file
    ARRAY['image/jpeg','image/png','image/webp']
  )
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- 3. Storage RLS policies
-- ============================================================

-- Profile photos: owner can upload/update, anyone can read
CREATE POLICY "GC Public read profile photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'gracecovenant-profile-photos');

CREATE POLICY "GC Owner upload profile photo" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gracecovenant-profile-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "GC Owner update profile photo" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'gracecovenant-profile-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ID documents: owner can upload, service_role (admin) can read
CREATE POLICY "GC Owner upload ID document" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gracecovenant-id-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "GC Owner read own ID documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'gracecovenant-id-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================
-- 4. NOTE: Table RLS policies
--    Run AFTER `npm run db:push` creates the tables.
-- ============================================================
/*
ALTER TABLE gracecovenant.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON gracecovenant.profiles
  FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "Users update own profile" ON gracecovenant.profiles
  FOR UPDATE USING (auth_id = auth.uid());

CREATE POLICY "Users insert own profile" ON gracecovenant.profiles
  FOR INSERT WITH CHECK (auth_id = auth.uid());
*/


-- ============================================================
-- Verify
-- ============================================================
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'gracecovenant';
SELECT id, name, public FROM storage.buckets WHERE id LIKE 'gracecovenant-%';

-- Schema isolation check: ensure SilverConnect public schema is untouched
SELECT schema_name FROM information_schema.schemata WHERE schema_name IN ('public','gracecovenant','auth');
