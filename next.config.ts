import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage (profile photos public bucket)
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: '*.supabase.in', pathname: '/storage/v1/object/public/**' },
    ],
  },

  // ----------------------------------------------------------------
  // SEO: hreflang alternate links for both Chinese script variants
  // Google uses these to serve zh-Hans (CN/SG/MY) vs zh-Hant (TW/HK)
  // app/[locale]/layout.tsx sets the matching HTML lang attribute.
  // ----------------------------------------------------------------
  async headers() {
    return [
      {
        source: '/zh-CN/:path*',
        headers: [
          { key: 'Content-Language', value: 'zh-Hans' },
        ],
      },
      {
        source: '/zh-TW/:path*',
        headers: [
          { key: 'Content-Language', value: 'zh-Hant' },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
