'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

const INITIAL_PRAYERS = [
  { id: 1, author: '匿名弟兄', category: '婚恋', date: '2026-06-01', amens: 23,
    text: '求主带领在寻找配偶上，赐下合适的姐妹，愿主的旨意成就。' },
  { id: 2, author: 'Grace L.', category: 'General', date: '2026-06-02', amens: 41,
    text: "Pray for all singles on this platform — may God’s perfect timing bring covenant love." },
  { id: 3, author: '匿名姐妹', category: '婚恋', date: '2026-06-03', amens: 67,
    text: '为平台上所有寻找配偶的弟兄姐妹祷告，愿神的旨意成就在每个生命里。' },
  { id: 4, author: 'Pastor James', category: 'Platform', date: '2026-06-03', amens: 105,
    text: 'Praying for GraceCovenant — that God uses this platform to build Christ-centred families across the globe.' },
]

export default function PrayerPage() {
  const t = useTranslations('prayer')
  const tCommon = useTranslations('common')
  const [prayers, setPrayers] = useState(INITIAL_PRAYERS)
  const [form, setForm] = useState({ text: '', category: 'General', anon: true })
  const [submitted, setSubmitted] = useState(false)

  function handleAmen(id: number) {
    setPrayers(prev => prev.map(p => p.id === id ? { ...p, amens: p.amens + 1 } : p))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.text.trim()) return
    setPrayers(prev => [{
      id: Date.now(), author: form.anon ? '匿名' : 'You',
      category: form.category, date: new Date().toISOString().slice(0, 10),
      amens: 0, text: form.text,
    }, ...prev])
    setForm({ text: '', category: 'General', anon: true })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">🙏 {t('title')}</h1>
      <div className="card-verse mb-6">{t('verse')}</div>

      {/* Submit form */}
      <details className="card-covenant mb-6" open>
        <summary className="cursor-pointer font-semibold">➕ {t('submitTitle')}</summary>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-covenant-400 outline-none"
            rows={3}
            placeholder={t('prayerPlaceholder')}
            value={form.text}
            onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
          />
          <div className="flex gap-3 flex-wrap">
            <select
              className="border rounded-lg px-3 py-2 text-sm flex-1"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {['marriage', 'family', 'faith', 'general', 'platform'].map(c => (
                <option key={c} value={c}>{t(`categories.${c}`)}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.anon}
                onChange={e => setForm(f => ({ ...f, anon: e.target.checked }))}
                className="accent-covenant-600" />
              {tCommon('anonymous')}
            </label>
          </div>
          <button type="submit"
            className="bg-covenant-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-covenant-700 transition-colors">
            🙏 {tCommon('submit')}
          </button>
          {submitted && <p className="text-grace-600 text-sm">{t('submitted')}</p>}
        </form>
      </details>

      {/* Prayer list */}
      <div className="space-y-4">
        {prayers.map(p => (
          <div key={p.id} className="card-prayer">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{p.author}</span>
              <span className="text-xs text-gray-400">{p.date} · {p.category}</span>
            </div>
            <p className="text-gray-700 text-sm">{p.text}</p>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => handleAmen(p.id)}
                className="flex items-center gap-1.5 bg-covenant-100 text-covenant-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-covenant-200 transition-colors">
                🙏 {t('amen')}
              </button>
              <span className="text-xs text-gray-500">{p.amens} {t('praying')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
