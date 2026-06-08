'use client'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MapPin, Globe2, Search } from 'lucide-react'
import { Suspense } from 'react'

const COUNTRIES = ['Australia'] as const

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'id', label: 'Bahasa Indonesia' },
] as const

function HeroSearchInner() {
  const t = useTranslations('home.search')
  const locale = useLocale()
  const router = useRouter()
  const [country, setCountry] = useState('')
  const [lang, setLang] = useState(locale)

  function handleSearch() {
    // Always navigate to the selected language's matches page
    const targetLocale = LANGUAGES.find(l => l.code === lang) ? lang : 'en'
    const path = `/${targetLocale}/matches${country ? `?country=${encodeURIComponent(country)}` : ''}`
    router.push(path)
  }

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Country */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {t('countryPlaceholder')}
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:border-covenant-500 focus:ring-2 focus:ring-covenant-100 transition-colors cursor-pointer"
            >
              <option value="">-- {t('countryPlaceholder')} --</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              Language
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:border-covenant-500 focus:ring-2 focus:ring-covenant-100 transition-colors cursor-pointer"
            >
              {LANGUAGES.map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="w-full py-3.5 rounded-xl bg-covenant-600 text-white font-semibold text-sm hover:bg-covenant-700 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          {t('findMatches')}
        </button>
      </div>
    </div>
  )
}

export default function HeroSearch() {
  return (
    <Suspense fallback={null}>
      <HeroSearchInner />
    </Suspense>
  )
}
