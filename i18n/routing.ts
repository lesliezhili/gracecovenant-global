import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'zh-CN', 'zh-TW', 'ko', 'ja', 'ms', 'id'],
  defaultLocale: 'en',
  pathnames: {
    '/':          '/',
    '/matches':   '/matches',
    '/prayer':    '/prayer',
    '/testimony': '/testimony',
    '/courses':   '/courses',
    '/profile':   '/profile',
    '/login':     '/login',
    '/register':  '/register',
    '/membership': '/membership',
  },
})

export type Locale = (typeof routing.locales)[number]
