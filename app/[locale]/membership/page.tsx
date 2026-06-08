'use client'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Check, Sparkles } from 'lucide-react'

const PLANS = ['free', 'supporter', 'church'] as const

// Inner component that uses useSearchParams — must be inside <Suspense>
function MembershipContent() {
  const t = useTranslations('membership')
  const locale = useLocale()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  async function handleSubscribe() {
    setLoading(true)
    try {
      const res = await fetch('/api/payment/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Payment service unavailable. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">✝ {t('title')}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">{t('subtitle')}</p>
      </div>

      {success && (
        <div className="max-w-md mx-auto mb-8 bg-grace-50 border border-grace-200 rounded-xl p-4 text-center">
          <Sparkles className="w-6 h-6 text-grace-600 mx-auto mb-2" />
          <p className="text-grace-700 font-medium">{t('thankYou')}</p>
        </div>
      )}
      {canceled && (
        <div className="max-w-md mx-auto mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-amber-700 text-sm">{t('canceled')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLANS.map((plan) => (
          <div key={plan} className={`card-covenant flex flex-col ${
            plan === 'supporter' ? 'ring-2 ring-covenant-500 relative' : ''
          }`}>
            {plan === 'supporter' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-covenant-600 text-white text-xs px-3 py-0.5 rounded-full">
                ❤️
              </span>
            )}
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">{t(`${plan}.name`)}</h3>
              <div className="text-2xl font-bold text-covenant-600 mt-1">{t(`${plan}.price`)}</div>
              <p className="text-sm text-gray-500 mt-1">{t(`${plan}.desc`)}</p>
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              {(t.raw(`${plan}.features`) as string[]).map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-grace-600 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            {plan === 'supporter' ? (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full py-2.5 rounded-full text-sm font-medium bg-covenant-600 text-white hover:bg-covenant-700 transition-colors disabled:opacity-50">
                {loading ? t('processing') : t('getStarted')}
              </button>
            ) : (
              <button className={`w-full py-2.5 rounded-full text-sm font-medium transition-colors ${
                plan === 'free'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'border border-covenant-300 text-covenant-600 hover:bg-covenant-50'
              }`}>
                {plan === 'church' ? t('contactUs') : t('currentPlan')}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">{t('faq.title')}</h2>
        <div className="space-y-4">
          {(['q1', 'q2', 'q3'] as const).map((q) => (
            <details key={q} className="card-covenant">
              <summary className="cursor-pointer font-medium text-gray-800">{t(`faq.${q}`)}</summary>
              <p className="mt-2 text-sm text-gray-600">{t(`faq.a${q[1]}`)}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  )
}

// useSearchParams() requires Suspense in Next.js 15
export default function MembershipPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-400">
        Loading...
      </div>
    }>
      <MembershipContent />
    </Suspense>
  )
}
