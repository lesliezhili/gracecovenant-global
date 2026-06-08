'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { MessageCircle, Heart, SlidersHorizontal, MapPin, Users } from 'lucide-react'

const PROFILES = [
  { id: 1, name: 'Grace L.', age: 32, country: 'Australia', location: 'Sydney, AU', gender: 'Sister',
    denomination: 'Baptist', church: 'Sydney Chinese Baptist Church', baptized: 2015,
    ministry: 'Worship Team', faithMaturity: 'Mature',
    about: '热爱音乐事奉，盼望与志同道合的弟兄携手走天路。',
    familyVision: '希望有2-3个孩子，以基督为家庭中心',
    lifeMission: '普通职业+服事', openRelocation: true, matchScore: 94 },
  { id: 2, name: 'David W.', age: 35, country: 'Australia', location: 'Melbourne, AU', gender: 'Brother',
    denomination: 'Presbyterian', church: 'Melbourne Chinese Presbyterian', baptized: 2012,
    ministry: 'Deacon / Bible Study', faithMaturity: 'Leader',
    about: 'IT工程师，热忠圣经研习和宣教事工，寻找有使命感的姐妹。',
    familyVision: '以圣经为家庭蓝图，带领家庭灵命成长',
    lifeMission: '宣教', openRelocation: true, matchScore: 88 },
  { id: 3, name: 'Ruth C.', age: 29, country: 'Canada', location: 'Vancouver, CA', gender: 'Sister',
    denomination: 'Evangelical Free', church: 'Richmond Chinese EFC', baptized: 2018,
    ministry: 'Youth Ministry', faithMaturity: 'Growing',
    about: '教师职业，喜爱儿童事工，盼望建立以基督为中心的家庭。',
    familyVision: '期待3+孩子，在家教导信仰',
    lifeMission: '基督教教育', openRelocation: false, matchScore: 82 },
  { id: 4, name: 'Joshua T.', age: 38, country: 'Singapore', location: 'Singapore', gender: 'Brother',
    denomination: 'Methodist', church: 'Trinity Methodist Church SG', baptized: 2008,
    ministry: 'Cell Group Leader', faithMaturity: 'Leader',
    about: '商业顾问，在教会带领家庭小组，渴望建立以基督为中心的婚姻。',
    familyVision: '与配偶共同服事教会',
    lifeMission: '普通职业+服事', openRelocation: true, matchScore: 79 },
]

const COUNTRIES = ['Australia'] as const
const DENOMINATIONS = ['Baptist', 'Presbyterian', 'Methodist', 'Evangelical Free', 'Anglican', 'Catholic']

const SELECT_CLS = 'w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:border-covenant-500 focus:ring-2 focus:ring-covenant-100 transition-colors cursor-pointer'
const LABEL_CLS = 'text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5'

export default function MatchesPage() {
  const t = useTranslations('matches')
  const [minAge, setMinAge] = useState(22)
  const [maxAge, setMaxAge] = useState(50)
  const [country, setCountry] = useState('')
  const [denomination, setDenomination] = useState('')
  const [gender, setGender] = useState('')
  const [connected, setConnected] = useState<number[]>([])
  const [prayed, setPrayed] = useState<number[]>([])

  const filtered = PROFILES
    .filter(p => p.age >= minAge && p.age <= maxAge && (country === '' || p.country === country) && (denomination === '' || p.denomination === denomination) && (gender === '' || p.gender === gender))
    .sort((a, b) => b.matchScore - a.matchScore)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-6">{t('subtitle')}</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="font-semibold text-gray-700 mb-5 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-covenant-600" />
          {t('filter.title')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="sm:col-span-2">
            <label className={LABEL_CLS}><Users className="w-3.5 h-3.5" />{t('filter.ageRange')}: <span className="text-covenant-600 font-semibold">{minAge} – {maxAge}</span></label>
            <div className="flex gap-3 items-center">
              <span className="text-xs text-gray-400 w-6">{minAge}</span>
              <input type="range" min={18} max={maxAge} value={minAge} onChange={e => setMinAge(+e.target.value)} className="flex-1 accent-covenant-600 h-2 cursor-pointer" />
              <input type="range" min={minAge} max={80} value={maxAge} onChange={e => setMaxAge(+e.target.value)} className="flex-1 accent-covenant-600 h-2 cursor-pointer" />
              <span className="text-xs text-gray-400 w-6">{maxAge}</span>
            </div>
          </div>
          <div>
            <label className={LABEL_CLS}><MapPin className="w-3.5 h-3.5" />{t('filter.location')}</label>
            <select value={country} onChange={e => setCountry(e.target.value)} className={SELECT_CLS}>
              <option value="">{t('filter.all')}</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={LABEL_CLS}>⛪️ {t('filter.denomination')}</label>
            <select value={denomination} onChange={e => setDenomination(e.target.value)} className={SELECT_CLS}>
              <option value="">{t('filter.all')}</option>
              {DENOMINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          {['', 'Brother', 'Sister'].map(g => (
            <button key={g} onClick={() => setGender(g)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${gender === g ? 'bg-covenant-600 text-white border-covenant-600' : 'border-gray-200 text-gray-600 hover:border-covenant-300 bg-white'}`}>
              {g === '' ? t('filter.allGenders') : g === 'Brother' ? '♂️ ' + t('filter.brother') : '♀️ ' + t('filter.sister')}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">{t('found', { count: filtered.length })}</p>

      <div className="space-y-4">
        {filtered.map(p => (
          <div key={p.id} className="card-covenant">
            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-covenant-200 to-covenant-400 flex items-center justify-center text-white text-xl font-bold shrink-0">{p.name[0]}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{p.name} · {p.age} · 📍 {p.location}</h3>
                    <p className="text-sm text-gray-500">⛪️ {p.church}</p>
                    <p className="text-sm text-gray-500">🙏 {t('baptised')} {p.baptized} · {p.ministry}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-covenant-600">{p.matchScore}%</div>
                    <div className="text-xs text-gray-400">{t('matchScore')}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 my-2">{p.about}</p>
                <p className="text-sm text-gray-500">👨‍👩‍👧 {p.familyVision}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {[p.denomination, p.faithMaturity, p.lifeMission].map(tag => (<span key={tag} className="badge-faith">{tag}</span>))}
                  {p.openRelocation && <span className="badge-faith">✈️ {t('openRelocation')}</span>}
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setConnected(c => connected.includes(p.id) ? c : [...c, p.id])} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${connected.includes(p.id) ? 'bg-grace-100 text-grace-700' : 'bg-covenant-600 text-white hover:bg-covenant-700'}`}>
                    <MessageCircle className="w-4 h-4" />{connected.includes(p.id) ? '✅ ' + t('sent') : t('connect')}
                  </button>
                  <button onClick={() => setPrayed(pp => prayed.includes(p.id) ? pp : [...pp, p.id])} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${prayed.includes(p.id) ? 'border-covenant-200 text-covenant-600 bg-covenant-50' : 'border-gray-200 text-gray-600 hover:border-covenant-300'}`}>
                    <Heart className="w-4 h-4" />{prayed.includes(p.id) ? '🙏 ' + t('prayed') : t('pray')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
