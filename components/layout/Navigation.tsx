'use client'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/matches', key: 'matches' },
  { href: '/prayer', key: 'prayer' },
  { href: '/testimony', key: 'testimony' },
  { href: '/courses', key: 'courses' },
  { href: '/membership', key: 'membership' },
] as const

const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ms', label: 'Melayu', flag: '🇲🇾' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
] as const

const COUNTRIES = ['Australia'] as const

// Maps ipapi.co country_name → our dropdown values
const GEO_MAP: Record<string, string> = {
  'Australia': 'Australia',
}

export default function Navigation() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        const mapped = GEO_MAP[data.country_name] ?? ''
        if (mapped) setSelectedCountry(mapped)
      })
      .catch(() => {/* silent — geolocation is best-effort */})
  }, [])

  function switchLocale(nextLocale: string) {
    const stripped = pathname.replace(new RegExp(`^/${locale}`), '') || '/'
    router.push(`/${nextLocale}${stripped}`)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-covenant-700 text-lg">
          ✝ <span className="hidden sm:inline">GraceCovenant</span>
          <span className="sm:hidden">GC</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, key }) => (
            <Link key={href} href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.includes(href)
                  ? 'bg-covenant-100 text-covenant-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Country select — auto-detected via ipapi.co */}
          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="hidden sm:block text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-covenant-400"
          >
            <option value="">🌏 Country</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Language select */}
          <select
            value={locale}
            onChange={(e) => switchLocale(e.target.value)}
            className="hidden sm:block text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-covenant-400"
          >
            {LOCALES.map(({ code, label, flag }) => (
              <option key={code} value={code}>{flag} {label}</option>
            ))}
          </select>

          <Link href="/login"
            className="hidden sm:block text-sm text-gray-600 hover:text-covenant-600 px-3 py-1.5 transition-colors">
            {t('login')}
          </Link>
          <Link href="/register"
            className="hidden sm:block bg-covenant-600 text-white text-sm px-4 py-1.5 rounded-full hover:bg-covenant-700 transition-colors">
            {t('register')}
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden p-1">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
          <div className="pb-2 border-b space-y-2">
            <select
              value={locale}
              onChange={(e) => switchLocale(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700"
            >
              {LOCALES.map(({ code, label, flag }) => (
                <option key={code} value={code}>{flag} {label}</option>
              ))}
            </select>
            <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700">
              <option value="">🌏 Country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {NAV_LINKS.map(({ href, key }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-covenant-50">
              {t(key)}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t">
            <Link href="/login" onClick={() => setOpen(false)}
              className="flex-1 text-center border rounded-lg py-2 text-sm text-gray-600">
              {t('login')}
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}
              className="flex-1 text-center bg-covenant-600 text-white rounded-lg py-2 text-sm">
              {t('register')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
