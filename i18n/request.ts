import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  let messages
  try {
    messages = (await import(`../messages/${locale}.json`)).default
  } catch {
    // Fallback to English for locales without dedicated message file
    messages = (await import('../messages/en.json')).default
  }

  return { locale, messages }
})
