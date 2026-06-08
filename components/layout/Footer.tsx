import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const PLATFORM_LINKS = [
  { href: '/matches', key: 'matches' },
  { href: '/prayer', key: 'prayer' },
  { href: '/testimony', key: 'testimony' },
  { href: '/courses', key: 'courses' },
] as const

export default function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')

  return (
    <footer className="border-t bg-white mt-16 pt-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="font-bold text-covenant-700 text-lg mb-2">✝ GraceCovenant</div>
            <p className="text-sm text-gray-500">{t('tagline')}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3 text-sm">{t('platform')}</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {PLATFORM_LINKS.map(({ href, key }) => (
                <li key={key}><Link href={href} className="hover:text-covenant-600">{tNav(key)}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bible verse */}
        <div className="border-t pt-6 pb-4 text-center">
          <p className="text-sm text-gray-600 italic">{t('verse')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('verseRef')}</p>
        </div>

        {/* Credits */}
        <div className="border-t pt-6 pb-8 text-center text-xs text-gray-400">
          <p className="italic mb-1">{t('copyright')}</p>
          <p>✝ GraceCovenant · {t('inspiredBy')}</p>
          <p className="mt-3">Powered by <a href="https://phledger.com" target="_blank" rel="noreferrer" className="text-covenant-600 hover:underline font-medium">PHLedger</a></p>
          <p className="mt-1 max-w-md mx-auto text-gray-300">{t('phledgerDesc')}</p>
          <p className="mt-1"><a href="https://linkedin.com/company/phledger" target="_blank" rel="noreferrer" className="text-covenant-500 hover:underline">linkedin.com/company/phledger</a></p>
          <p className="mt-3 text-gray-300">© {new Date().getFullYear()} Grace Covenant Foundation</p>
        </div>
      </div>
    </footer>
  )
}
