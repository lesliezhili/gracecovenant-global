import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> }

const LOCALE_TO_LANG: Record<string, string> = {
  en: 'en',
  'zh-CN': 'zh-Hans',
  'zh-TW': 'zh-Hant',
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as 'en' | 'zh-CN' | 'zh-TW')) notFound()

  setRequestLocale(locale)
  const messages = await getMessages()
  const t = await getTranslations('header')
  const htmlLang = LOCALE_TO_LANG[locale] ?? locale

  return (
    <html lang={htmlLang}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen flex flex-col bg-background">
            <div className="bg-covenant-800 text-white/90 text-xs text-center py-2 px-4 italic">
              {t('verse')}
            </div>
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
