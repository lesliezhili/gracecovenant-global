'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'

const COUNTRIES = ['Australia'] as const
const DENOMINATIONS = ['Baptist','Presbyterian','Methodist','Evangelical Free','Anglican','Catholic','Others']

export default function RegisterPage() {
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    gender: 'Brother', country: 'Australia', church: '',
    agree1: false, agree2: false, agree3: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.agree1 || !form.agree2 || !form.agree3) {
      setError(t('fillAllFields'))
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        window.location.href = '/profile'
      } else {
        const data = await res.json()
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">✝</div>
          <h1 className="text-2xl font-bold text-gray-800">{t('registerTitle')}</h1>
          <p className="text-gray-500 text-sm mt-1">恩约 CovenantPath</p>
        </div>

        <div className="card-covenant">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 md:col-span-1">
                <label className="text-sm text-gray-600 block mb-1">{t('fullName')} *</label>
                <input required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-covenant-400 outline-none"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="text-sm text-gray-600 block mb-1">{t('email')} *</label>
                <input type="email" required className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-covenant-400 outline-none"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-600 block mb-1">{t('passwordHint')} *</label>
                <input type="password" required minLength={8} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-covenant-400 outline-none"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">{t('gender')}</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                  <option value="Brother">{t('genderBrother')}</option>
                  <option value="Sister">{t('genderSister')}</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">{t('country')}</label>
                <select className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                  {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-600 block mb-1">{t('church')}</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-covenant-400 outline-none"
                  placeholder="e.g. Sydney Chinese Baptist Church"
                  value={form.church} onChange={e => setForm(f => ({ ...f, church: e.target.value }))} />
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              {(['agree1','agree2','agree3'] as const).map(key => (
                <label key={key} className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 accent-covenant-600"
                    checked={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                  <span className="text-sm text-gray-700">{t(key)}</span>
                </label>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-covenant-600 text-white py-2.5 rounded-lg font-medium hover:bg-covenant-700 transition-colors disabled:opacity-50">
              {loading ? tCommon('loading') : '✝ ' + t('registerBtn')}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            {t('hasAccount')}{' '}
            <Link href="/login" className="text-covenant-600 hover:underline font-medium">
              {t('loginBtn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
