'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Link } from '@/i18n/navigation'

export default function LoginPage() {
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        window.location.href = '/'
      } else {
        const data = await res.json()
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">✝</div>
          <h1 className="text-2xl font-bold text-gray-800">{t('loginTitle')}</h1>
          <p className="text-gray-500 text-sm mt-1">恩约 GraceCovenant</p>
        </div>

        <div className="card-covenant">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">{t('email')}</label>
              <input
                type="email" required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-covenant-400 outline-none"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">{t('password')}</label>
              <input
                type="password" required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-covenant-400 outline-none"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full bg-covenant-600 text-white py-2.5 rounded-lg font-medium hover:bg-covenant-700 transition-colors disabled:opacity-50">
              {loading ? tCommon('loading') : t('loginBtn')}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            {t('noAccount')}{' '}
            <Link href="/register" className="text-covenant-600 hover:underline font-medium">
              {t('registerBtn')}
            </Link>
          </div>
        </div>

        {/* Verse */}
        <div className="card-verse mt-6 text-center text-sm">
          「我这个稏明的主。」 — 尼希米亚书 1:7
        </div>
      </div>
    </div>
  )
}
