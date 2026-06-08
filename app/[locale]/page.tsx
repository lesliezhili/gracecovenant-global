import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Heart, Church, Sparkles, BookOpen, Globe2, Star } from 'lucide-react'
import HeroSearch from '@/components/HeroSearch'

const STATS = [
  { key: 'members', value: '2,847' },
  { key: 'matched', value: '156' },
  { key: 'testimonies', value: '43' },
  { key: 'churches', value: '12' },
]

const FEATURES = [
  { icon: Church, key: 'church' },
  { icon: Sparkles, key: 'ai' },
  { icon: Heart, key: 'prayer' },
  { icon: BookOpen, key: 'courses' },
  { icon: Globe2, key: 'global' },
  { icon: Star, key: 'testimony' },
]

const TESTIMONIES = [
  {
    couple: 'Jason & Mei', location: 'Sydney', year: 2024, verified: true,
    story: 'We met through our church singles fellowship. After a year of prayer and discernment, God led us into covenant marriage. We are now married and expecting our first child.',
    verse: '“Commit to the Lord whatever you do.” — Proverbs 16:3',
  },
  {
    couple: 'Timothy & Ruth', location: 'Melbourne', year: 2023, verified: true,
    story: 'Through prayer and patience, God brought us together across two cities. Our covenant marriage is founded on Christ.',
    verse: '“Where you go I will go...” — Ruth 1:16',
  },
]

const PRAYERS = [
  { author: 'Anonymous brother', date: '2026-06-01', amens: 23,
    text: 'Please pray that God will lead me to a suitable spouse and make His will clear.' },
  { author: 'Grace L.', date: '2026-06-02', amens: 41,
    text: 'Pray for all singles on this platform — may God’s perfect timing bring covenant love.' },
]

export default function HomePage() {
  const t = useTranslations()

  return (
    <div className="animate-fade-in">
      <section className="gradient-hero text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">{t('home.heroTitle')}</h1>
          <h2 className="text-2xl font-light mb-6 opacity-90">{t('home.heroSubtitle')}</h2>
          <p className="text-lg opacity-80 mb-10 max-w-2xl mx-auto">{t('home.heroDesc')}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/matches" className="bg-white text-covenant-700 font-semibold px-8 py-3 rounded-full hover:bg-covenant-50 transition-colors shadow-lg">
              {t('home.ctaStart')}
            </Link>
            <Link href="/courses" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
              {t('home.ctaLearnMore')}
            </Link>
          </div>

          <HeroSearch />
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="card-verse text-center text-gray-700">{t('home.verse')}</div>
      </div>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ key, value }) => (
            <div key={key} className="metric-card">
              <div className="text-3xl font-bold text-covenant-600">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{t(`home.stats.${key}`)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">✨ {t('home.features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, key }) => (
            <div key={key} className="card-covenant flex gap-4 items-start">
              <div className="p-2 rounded-lg bg-covenant-100">
                <Icon className="w-5 h-5 text-covenant-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{t(`home.features.${key}.title`)}</h3>
                <p className="text-sm text-gray-500 mt-1">{t(`home.features.${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">✨ {t('testimony.title')}</h2>
          <Link href="/testimony" className="text-covenant-600 text-sm hover:underline">{t('home.viewAll')}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIES.map((item) => (
            <div key={item.couple} className="card-testimony">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold">💍 {item.couple}</span>
                {item.verified && <span className="text-xs bg-grace-100 text-grace-700 px-2 py-0.5 rounded-full">✅ {t('testimony.verified')}</span>}
              </div>
              <p className="text-sm text-gray-500 mb-2">📍 {item.location} · {item.year}</p>
              <p className="text-gray-700 text-sm line-clamp-3">{item.story}</p>
              <p className="text-xs text-gray-400 mt-3 italic">📖 {item.verse}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🙏 {t('prayer.title')}</h2>
          <Link href="/prayer" className="text-covenant-600 text-sm hover:underline">{t('prayer.title')}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRAYERS.map((p) => (
            <div key={p.author + p.date} className="card-prayer">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{p.author}</span>
                <span className="text-xs text-gray-400">{p.date}</span>
              </div>
              <p className="text-gray-700 text-sm">{p.text}</p>
              <p className="text-xs text-covenant-600 mt-3">🙏 {p.amens} {t('prayer.praying')}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
