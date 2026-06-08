import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://covenantpath.com'

export const metadata: Metadata = {
  title: '\u6069\u7d04 CovenantPath | \u534e\u4eba\u57fa\u7763\u5f92\u5a5a\u604b\u793e\u7fa4',
  description: 'Building Christ-Centred Families for Chinese Communities Worldwide',
  keywords: ['Christian', 'Chinese', 'Marriage', '\u5a5a\u604b', '\u57fa\u7763\u5f92', '\u534e\u4eba',
             '\u7e41\u9ad4\u4e2d\u6587', '\u7b80\u4f53\u4e2d\u6587'],

  // -------------------------------------------------------
  // Canonical + hreflang alternates (Google SEO)
  // zh-Hans  = Simplified Chinese  (CN / SG / MY diaspora)
  // zh-Hant  = Traditional Chinese (TW / HK / AU/CA/NZ communities)
  // x-default = fallback to Simplified (default locale)
  // -------------------------------------------------------
  alternates: {
    canonical: `${APP_URL}/zh-CN`,
    languages: {
      'zh-Hans':  `${APP_URL}/zh-CN`,
      'zh-Hant':  `${APP_URL}/zh-TW`,
      'x-default': `${APP_URL}/zh-CN`,
    },
  },

  openGraph: {
    title: '\u6069\u7d04 CovenantPath',
    description: 'Building Christ-Centred Families for Chinese Communities Worldwide',
    type: 'website',
    // og:locale uses BCP 47 underscore format
    locale: 'zh_Hans',
    alternateLocale: ['zh_Hant'],
    url: `${APP_URL}/zh-CN`,
    siteName: '\u6069\u7d04 CovenantPath',
  },

  twitter: {
    card: 'summary_large_image',
    title: '\u6069\u7d04 CovenantPath',
    description: 'Building Christ-Centred Families for Chinese Communities Worldwide',
  },

  icons: { icon: '/favicon.ico' },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
