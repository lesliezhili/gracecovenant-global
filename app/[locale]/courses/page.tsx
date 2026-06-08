'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { BookOpen, Clock, Globe, DollarSign } from 'lucide-react'

const COURSES = [
  { key: 'prep', title: '\u5a5a\u59fb\u9884\u5907\u8bfe\u7a0b', subtitle: 'Preparing for Marriage',
    provider: 'Focus on the Family', weeks: 8, format: 'Online + Offline', cost: 'Free',
    desc: '\u4ece\u795e\u7684\u89d2\u5ea6\u8ba4\u8bc6\u5a5a\u59fb\u7684\u672c\u8d28\u3001\u6c9f\u901a\u3001\u6027\u4e0e\u754c\u9650\u3002',
    modules: ['\u795e\u5b66\u57fa\u7840', '\u6c9f\u901a\u6280\u5de7', '\u8d22\u52a1\u89c4\u5212', '\u6027\u4e0e\u4eb2\u5bc6'], color: 'from-covenant-100 to-indigo-100', badge: 'Most Popular' },
  { key: 'dating', title: '\u5065\u5eb7\u7ea6\u4f1a\u5173\u7cfb', subtitle: 'Healthy Dating in Christ',
    provider: 'CovenantPath', weeks: 4, format: 'Online', cost: 'Free',
    desc: '\u5728\u4fe1\u4ef0\u6846\u67b6\u5185\u5efa\u7acb\u5065\u5eb7\u7684\u5f02\u6027\u5173\u7cfb\uff0c\u907f\u514d\u5e38\u89c1\u8bef\u533a\u3002',
    modules: ['\u754c\u9650\u8bbe\u7acb', '\u53cb\u8c0a\u57fa\u7840', '\u5c5e\u7075\u4e86\u89e3', '\u5bb6\u5ead\u89c2\u5339\u914d'], color: 'from-grace-100 to-emerald-100', badge: 'New' },
  { key: 'finance', title: '\u5bb6\u5ead\u8d22\u52a1\u4e0e\u7ba1\u7406', subtitle: 'Family Finance & Stewardship',
    provider: 'Crown Ministries', weeks: 6, format: 'Online', cost: 'Free',
    desc: '\u4ece\u5723\u7ecf\u539f\u5219\u5b66\u4e60\u5bb6\u5ead\u8d22\u52a1\u7ba1\u7406\u4e0e\u5949\u732e\u3002',
    modules: ['\u5723\u7ecf\u8d22\u52a1\u89c2', '\u9884\u7b97\u7ba1\u7406', '\u8d1f\u5e02\u6d88\u9664', '\u5949\u732e\u4e0e\u5434\u529b'], color: 'from-amber-100 to-yellow-100', badge: null },
]

export default function CoursesPage() {
  const t = useTranslations('courses')
  const [enrolled, setEnrolled] = useState<string[]>([])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">\ud83d\udcda {t('title')}</h1>
      <p className="text-gray-500 mb-2">{t('subtitle')}</p>
      <div className="card-verse mb-8">{t('verse')}</div>

      <div className="space-y-6">
        {COURSES.map(course => (
          <div key={course.key} className={`rounded-2xl p-6 bg-gradient-to-br ${course.color} border border-white/60 shadow-sm`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
                  {course.badge && (
                    <span className="text-xs bg-covenant-600 text-white px-2 py-0.5 rounded-full">
                      {course.badge}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm">{course.subtitle}</p>
              </div>
            </div>

            <div className="flex gap-4 text-sm text-gray-600 mb-3 flex-wrap">
              <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {course.provider}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {course.weeks} weeks</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {course.format}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {course.cost}</span>
            </div>

            <p className="text-gray-700 text-sm mb-4">{course.desc}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {course.modules.map(m => (
                <span key={m} className="text-xs bg-white/70 text-gray-600 px-2 py-1 rounded-full border">{m}</span>
              ))}
            </div>

            <button
              onClick={() => setEnrolled(e => enrolled.includes(course.key) ? e : [...e, course.key])}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                enrolled.includes(course.key)
                  ? 'bg-grace-100 text-grace-700 border border-grace-300'
                  : 'bg-covenant-600 text-white hover:bg-covenant-700'
              }`}>
              {enrolled.includes(course.key) ? '✅ ' + t('enrolled') : t('enrol')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
