'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const INITIAL_TESTIMONIES = [
  { couple: 'Jason & Mei', year: 2024, location: 'Sydney', verified: true,
    story: '我们在教会单身团契认证，经过一年的了解和祷告，神带领我们进入婚约。现在我们已经结婚并期待迎接第一个孩子。',
    verse: '「你所做的，要交托耶和华。」 — 箴言 16:3' },
  { couple: 'Timothy & Ruth', year: 2023, location: 'Melbourne', verified: true,
    story: 'Through prayer and patience, God brought us together across two cities. Our covenant marriage is founded on Christ.',
    verse: '"Where you go I will go..." — Ruth 1:16' },
  { couple: 'Michael & Joy', year: 2025, location: 'Vancouver', verified: false,
    story: '我们都是离异后重新寻找盼望的人。神的恩典让我们在此相遇，现在我们的重组家庭成为教会中的祝福。',
    verse: '「我所做的你如今不知道，后来必明白。」 — 约翰福音 13:7' },
]

export default function TestimonyPage() {
  const t = useTranslations('testimony')
  const tCommon = useTranslations('common')
  const [testimonies, setTestimonies] = useState(INITIAL_TESTIMONIES)
  const [form, setForm] = useState({ couple: '', location: '', year: new Date().getFullYear(), verse: '', story: '' })
  const [done, setDone] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.couple || !form.story) return
    setTestimonies(prev => [{ ...form, verified: false }, ...prev])
    setForm({ couple: '', location: '', year: new Date().getFullYear(), verse: '', story: '' })
    setDone(true)
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">✨ {t('title')}</h1>
      <div className="card-verse mb-6">{t('verse')}</div>
      <p className="text-sm text-gray-500 mb-6">{t('count', { count: testimonies.length })}</p>

      {/* Testimony list */}
      <div className="space-y-4 mb-10">
        {testimonies.map((item, i) => (
          <div key={i} className="card-testimony">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold">💍 {item.couple}</span>
              {item.verified
                ? <span className="text-xs bg-grace-100 text-grace-700 px-2 py-0.5 rounded-full">✅ {t('verified')}</span>
                : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⏳ {t('pending')}</span>
              }
            </div>
            <p className="text-sm text-gray-500 mb-2">📍 {item.location} · {item.year}</p>
            <p className="text-gray-700 text-sm">{item.story}</p>
            {item.verse && <p className="text-xs text-gray-400 mt-3 italic">📖 {item.verse}</p>}
          </div>
        ))}
      </div>

      {/* Submit form */}
      <div className="card-covenant">
        <h2 className="font-semibold text-lg mb-4">📝 {t('shareTitle')}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500">{t('coupleNames')} *</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                placeholder="e.g. John & Mary"
                value={form.couple} onChange={e => setForm(f => ({ ...f, couple: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('city')}</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                placeholder="e.g. Sydney, AU"
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('weddingYear')}</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                value={form.year} onChange={e => setForm(f => ({ ...f, year: +e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500">{t('favouriteVerse')}</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                placeholder="e.g. Proverbs 3:5"
                value={form.verse} onChange={e => setForm(f => ({ ...f, verse: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">{t('story')} *</label>
            <textarea className="w-full border rounded-lg px-3 py-2 text-sm mt-1 resize-none"
              rows={4} placeholder={t('storyPlaceholder')}
              value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))} />
          </div>
          <button type="submit"
            className="bg-grace-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-grace-700 transition-colors">
            ✨ {tCommon('submit')}
          </button>
          {done && <p className="text-grace-600 text-sm mt-2">{t('submitSuccess')}</p>}
        </form>
      </div>
    </div>
  )
}
