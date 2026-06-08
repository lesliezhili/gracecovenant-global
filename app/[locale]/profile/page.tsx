'use client'
import { useTranslations } from 'next-intl'
import { useState, useRef } from 'react'
import {
  User, Heart, ShieldCheck, Star, Church,
  CreditCard, Globe, FileText, BookOpen, Lock, Camera,
} from 'lucide-react'

// ---- tab id type ----
type Tab = 'spiritual' | 'relationship' | 'idverify' | 'preferences' | 'church'

const TABS: { id: Tab; icon: React.ElementType; labelKey: string }[] = [
  { id: 'spiritual',    icon: Church,      labelKey: 'spiritual'    },
  { id: 'relationship', icon: Heart,       labelKey: 'relationship' },
  { id: 'idverify',     icon: ShieldCheck, labelKey: 'idverify'     },
  { id: 'preferences',  icon: Star,        labelKey: 'preferences'  },
  { id: 'church',       icon: FileText,    labelKey: 'church'       },
]

const FAITH_LEVELS  = ['New','Growing','Mature','Leader'] as const
const DENOMINATIONS = ['Baptist','Presbyterian','Methodist','Evangelical Free','Anglican','Catholic','Others']
const COUNTRIES     = ['Australia','Canada','USA','Singapore','Malaysia','Hong Kong','New Zealand','UK','Other']
const _LOCATIONS     = ['Australia','Canada','USA','Singapore','Malaysia','Hong Kong','UK','No preference']
const LIFE_MISSIONS = ['Career+Ministry','Full-time Ministry','Missionary','Christian Education','Other']
const VISA_TYPES    = ['PR','Citizen','StudentVisa','WorkVisa','SpouseVisa','Other'] as const
const CERT_TYPES    = ['membership','pastor','baptism'] as const
const EDUCATION     = ['HighSchool','Diploma','Bachelor','Masters','PhD','NoPreference'] as const
const CHILDREN_OPTS = ['0','1','2','3','4+','No preference']
const LANG_OPTS     = ['Mandarin','Cantonese','English','Both','NoPreference'] as const

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-covenant-700 uppercase tracking-wide mb-3 mt-5 first:mt-0">
      {children}
    </h3>
  )
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`mt-6 px-6 py-2.5 rounded-full font-medium text-sm transition-colors ${
        saved
          ? 'bg-grace-100 text-grace-700 border border-grace-300'
          : 'bg-covenant-600 text-white hover:bg-covenant-700'
      }`}>
      {saved ? '✅ Saved!' : '💾 Save'}
    </button>
  )
}

// ============================================================
// TAB 1 — Spiritual Profile
// ============================================================
function SpiritualTab() {
  const t = useTranslations('profile.spiritual')
  const [form, setForm] = useState({
    denomination: 'Baptist', church: '', baptismYear: 2015,
    regularAttend: true, ministry: '', faithMaturity: 'Growing',
  })
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div>
      <SectionTitle>{t('title')}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('denomination')}</label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.denomination} onChange={e => setForm(f => ({ ...f, denomination: e.target.value }))}>
            {DENOMINATIONS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('church')}</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. Sydney Chinese Baptist Church"
            value={form.church} onChange={e => setForm(f => ({ ...f, church: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('baptismYear')}</label>
          <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.baptismYear} onChange={e => setForm(f => ({ ...f, baptismYear: +e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('ministry')}</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. Worship, Youth, Deacon"
            value={form.ministry} onChange={e => setForm(f => ({ ...f, ministry: e.target.value }))} />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-500 block mb-2">{t('faithMaturity')}</label>
          <div className="flex gap-2 flex-wrap">
            {FAITH_LEVELS.map(level => (
              <button key={level}
                onClick={() => setForm(f => ({ ...f, faithMaturity: level }))}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  form.faithMaturity === level
                    ? 'bg-covenant-600 text-white border-covenant-600'
                    : 'border-gray-200 text-gray-600 hover:border-covenant-400'
                }`}>{level}</button>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="checkbox" className="accent-covenant-600"
              checked={form.regularAttend}
              onChange={e => setForm(f => ({ ...f, regularAttend: e.target.checked }))} />
            {t('regularAttendance')}
          </label>
        </div>
      </div>
      <SaveButton onClick={save} saved={saved} />
    </div>
  )
}

// ============================================================
// TAB 2 — Relationship Profile
// ============================================================
function RelationshipTab() {
  const t = useTranslations('profile.relationship')
  const [form, setForm] = useState({
    age: 30, location: '', marriageHistory: 'Never',
    hasChildren: false, familyVision: '', lifeMission: 'Career+Ministry',
    openRelocation: true,
  })
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div>
      <SectionTitle>{t('title')}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('age')}</label>
          <input type="number" min={18} max={80} className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.age} onChange={e => setForm(f => ({ ...f, age: +e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('location')}</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. Sydney, Australia"
            value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('marriageHistory')}</label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.marriageHistory} onChange={e => setForm(f => ({ ...f, marriageHistory: e.target.value }))}>
            <option value="Never">{t('histories.never')}</option>
            <option value="Divorced">{t('histories.divorced')}</option>
            <option value="Widowed">{t('histories.widowed')}</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('lifeMission')}</label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.lifeMission} onChange={e => setForm(f => ({ ...f, lifeMission: e.target.value }))}>
            {LIFE_MISSIONS.map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-500 block mb-1">{t('familyVision')}</label>
          <textarea rows={3} className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
            placeholder={t('familyVisionPlaceholder')}
            value={form.familyVision} onChange={e => setForm(f => ({ ...f, familyVision: e.target.value }))} />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-covenant-600"
              checked={form.hasChildren}
              onChange={e => setForm(f => ({ ...f, hasChildren: e.target.checked }))} />
            {t('hasChildren')}
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-covenant-600"
              checked={form.openRelocation}
              onChange={e => setForm(f => ({ ...f, openRelocation: e.target.checked }))} />
            {t('openRelocation')}
          </label>
        </div>
      </div>
      <SaveButton onClick={save} saved={saved} />
    </div>
  )
}

// ============================================================
// TAB 3 — Identity Verification (DL + Passport + Visa + Baptism)
// ============================================================
function IdVerifyTab() {
  const t = useTranslations('idVerify')
  const [form, setForm] = useState({
    // DL
    dlNumber: '', dlState: '', dlExpiry: '', dlFile: null as File | null,
    // Passport
    passportNumber: '', passportCountry: '', passportExpiry: '', passportFile: null as File | null,
    // Visa
    hasVisa: false, visaType: 'PR', visaNumber: '', visaExpiry: '', visaFile: null as File | null,
    // Baptism
    isBaptized: false, baptismYear: 2015, baptismChurch: '', baptismFile: null as File | null,
  })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Privacy notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
        <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">{t('privacy')}</p>
      </div>

      {/* === DRIVER'S LICENCE === */}
      <SectionTitle><CreditCard className="w-4 h-4 inline mr-1" />{t('dlSection')}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('dlNumber')}</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. NSW12345678"
            value={form.dlNumber} onChange={e => setForm(f => ({ ...f, dlNumber: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('dlState')}</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. NSW, VIC, QLD"
            value={form.dlState} onChange={e => setForm(f => ({ ...f, dlState: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('dlExpiry')}</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.dlExpiry} onChange={e => setForm(f => ({ ...f, dlExpiry: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">{t('dlUpload')}</label>
        <input type="file" accept="image/*,application/pdf"
          className="block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-covenant-100 file:text-covenant-700 hover:file:bg-covenant-200"
          onChange={e => setForm(f => ({ ...f, dlFile: e.target.files?.[0] ?? null }))} />
        {form.dlFile && <p className="text-xs text-grace-600 mt-1">✅ {form.dlFile.name}</p>}
      </div>

      {/* === PASSPORT === */}
      <SectionTitle><Globe className="w-4 h-4 inline mr-1" />{t('passportSection')}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('passportNumber')}</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. PA1234567"
            value={form.passportNumber} onChange={e => setForm(f => ({ ...f, passportNumber: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('passportCountry')}</label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.passportCountry} onChange={e => setForm(f => ({ ...f, passportCountry: e.target.value }))}>
            <option value="">Select...</option>
            {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            <option>China</option><option>Taiwan</option><option>Hong Kong</option><option>Malaysia</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('passportExpiry')}</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.passportExpiry} onChange={e => setForm(f => ({ ...f, passportExpiry: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-1">{t('passportUpload')}</label>
        <input type="file" accept="image/*,application/pdf"
          className="block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-covenant-100 file:text-covenant-700 hover:file:bg-covenant-200"
          onChange={e => setForm(f => ({ ...f, passportFile: e.target.files?.[0] ?? null }))} />
        {form.passportFile && <p className="text-xs text-grace-600 mt-1">✅ {form.passportFile.name}</p>}
      </div>

      {/* === VISA (optional toggle) === */}
      <div className="mt-5 mb-2">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
          <input type="checkbox" className="accent-covenant-600"
            checked={form.hasVisa} onChange={e => setForm(f => ({ ...f, hasVisa: e.target.checked }))} />
          <Globe className="w-4 h-4 text-covenant-600" />
          {t('visaSection')}
        </label>
      </div>
      {form.hasVisa && (
        <div className="bg-covenant-50 rounded-xl p-4 border border-covenant-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <div>
              <label className="text-xs text-gray-500 block mb-1">{t('visaType')}</label>
              <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                value={form.visaType} onChange={e => setForm(f => ({ ...f, visaType: e.target.value }))}>
                {VISA_TYPES.map(v => (
                  <option key={v} value={v}>{t(`visaTypes.${v}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{t('visaNumber')}</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                placeholder="e.g. 500-XXXXXXX"
                value={form.visaNumber} onChange={e => setForm(f => ({ ...f, visaNumber: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{t('visaExpiry')}</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                value={form.visaExpiry} onChange={e => setForm(f => ({ ...f, visaExpiry: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">{t('visaUpload')}</label>
            <input type="file" accept="image/*,application/pdf"
              className="block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-white file:text-covenant-700"
              onChange={e => setForm(f => ({ ...f, visaFile: e.target.files?.[0] ?? null }))} />
            {form.visaFile && <p className="text-xs text-grace-600 mt-1">✅ {form.visaFile.name}</p>}
          </div>
        </div>
      )}

      {/* === BAPTISM CERTIFICATE === */}
      <SectionTitle><BookOpen className="w-4 h-4 inline mr-1" />{t('baptismSection')}</SectionTitle>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-700 mb-3">✝ {t('baptismNote')}</p>
        <label className="flex items-center gap-2 cursor-pointer text-sm mb-4">
          <input type="checkbox" className="accent-covenant-600"
            checked={form.isBaptized} onChange={e => setForm(f => ({ ...f, isBaptized: e.target.checked }))} />
          <strong>{t('isBaptized')}</strong>
        </label>
        {form.isBaptized && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 block mb-1">{t('baptismYear')}</label>
              <input type="number" min={1950} max={2026}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                value={form.baptismYear} onChange={e => setForm(f => ({ ...f, baptismYear: +e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">{t('baptismChurch')}</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                placeholder="e.g. Sydney Chinese Baptist Church"
                value={form.baptismChurch} onChange={e => setForm(f => ({ ...f, baptismChurch: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-500 block mb-1">{t('baptismUpload')}</label>
              <input type="file" accept="image/*,application/pdf"
                className="block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-white file:text-covenant-700"
                onChange={e => setForm(f => ({ ...f, baptismFile: e.target.files?.[0] ?? null }))} />
              {form.baptismFile && <p className="text-xs text-grace-600 mt-1">✅ {form.baptismFile.name}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button type="submit"
          className="bg-covenant-600 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-covenant-700 transition-colors">
          📤 {t('submitId')}
        </button>
        {submitted && <p className="text-grace-600 text-sm mt-2">✅ {t('submitSuccess')}</p>}
      </div>
    </form>
  )
}

// ============================================================
// TAB 4 — Partner Preferences
// ============================================================
function PartnerPrefsTab() {
  const t = useTranslations('partnerPrefs')
  const [form, setForm] = useState({
    minAge: 24, maxAge: 45,
    requireBaptized: true, requireRegularChurch: true,
    minFaithMaturity: 'Growing',
    selectedDenoms: [] as string[],
    openToChildrenFromPrev: false, desiredChildren: '2',
    selectedLocations: ['Australia'] as string[],
    requireSameCountry: false,
    languagePref: 'NoPreference',
    heritagePreference: '',
    minEducation: 'NoPreference',
    careerExpectation: '',
    selectedMissions: [] as string[],
    openToFullTimeMission: false,
    personalityNotes: '',
    dealbreakers: '',
    additionalNotes: '',
  })
  const [saved, setSaved] = useState(false)

  function toggleArray(arr: string[], val: string): string[] {
    return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
  }

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{t('subtitle')}</p>

      {/* Age */}
      <SectionTitle>{t('ageSection')}</SectionTitle>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('minAge')}: {form.minAge}</label>
          <input type="range" min={18} max={form.maxAge - 1} value={form.minAge}
            onChange={e => setForm(f => ({ ...f, minAge: +e.target.value }))}
            className="w-full accent-covenant-600" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('maxAge')}: {form.maxAge}</label>
          <input type="range" min={form.minAge + 1} max={70} value={form.maxAge}
            onChange={e => setForm(f => ({ ...f, maxAge: +e.target.value }))}
            className="w-full accent-covenant-600" />
        </div>
      </div>

      {/* Faith */}
      <SectionTitle>{t('faithSection')}</SectionTitle>
      <div className="space-y-2 mb-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="accent-covenant-600"
            checked={form.requireBaptized}
            onChange={e => setForm(f => ({ ...f, requireBaptized: e.target.checked }))} />
          {t('requireBaptized')}
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="accent-covenant-600"
            checked={form.requireRegularChurch}
            onChange={e => setForm(f => ({ ...f, requireRegularChurch: e.target.checked }))} />
          {t('requireRegularChurch')}
        </label>
      </div>
      <div className="mb-2">
        <label className="text-xs text-gray-500 block mb-1">{t('minFaithMaturity')}</label>
        <div className="flex gap-2 flex-wrap">
          {FAITH_LEVELS.map(level => (
            <button key={level}
              onClick={() => setForm(f => ({ ...f, minFaithMaturity: level }))}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                form.minFaithMaturity === level
                  ? 'bg-covenant-600 text-white border-covenant-600'
                  : 'border-gray-200 text-gray-600 hover:border-covenant-400'
              }`}>{level}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-2">{t('preferredDenom')}</label>
        <div className="flex flex-wrap gap-2">
          {(t.raw('denomOptions') as string[]).map((d: string) => (
            <button key={d}
              onClick={() => setForm(f => ({ ...f, selectedDenoms: toggleArray(f.selectedDenoms, d) }))}
              className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                form.selectedDenoms.includes(d)
                  ? 'bg-covenant-100 text-covenant-700 border-covenant-400'
                  : 'border-gray-200 text-gray-500 hover:border-gray-400'
              }`}>{d}</button>
          ))}
        </div>
      </div>

      {/* Family */}
      <SectionTitle>{t('familySection')}</SectionTitle>
      <div className="space-y-2 mb-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" className="accent-covenant-600"
            checked={form.openToChildrenFromPrev}
            onChange={e => setForm(f => ({ ...f, openToChildrenFromPrev: e.target.checked }))} />
          {t('openToChildrenFromPrev')}
        </label>
      </div>
      <div>
        <label className="text-xs text-gray-500 block mb-2">{t('desiredChildren')}</label>
        <div className="flex gap-2 flex-wrap">
          {CHILDREN_OPTS.map(c => (
            <button key={c}
              onClick={() => setForm(f => ({ ...f, desiredChildren: c }))}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                form.desiredChildren === c
                  ? 'bg-covenant-600 text-white border-covenant-600'
                  : 'border-gray-200 text-gray-600 hover:border-covenant-400'
              }`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Location */}
      <SectionTitle>{t('locationSection')}</SectionTitle>
      <div className="flex flex-wrap gap-2 mb-2">
        {(t.raw('locationOptions') as string[]).map((loc: string) => (
          <button key={loc}
            onClick={() => setForm(f => ({ ...f, selectedLocations: toggleArray(f.selectedLocations, loc) }))}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              form.selectedLocations.includes(loc)
                ? 'bg-grace-100 text-grace-700 border-grace-400'
                : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}>{loc}</button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" className="accent-covenant-600"
          checked={form.requireSameCountry}
          onChange={e => setForm(f => ({ ...f, requireSameCountry: e.target.checked }))} />
        {t('requireSameCountry')}
      </label>

      {/* Culture */}
      <SectionTitle>{t('cultureSection')}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('languagePref')}</label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.languagePref} onChange={e => setForm(f => ({ ...f, languagePref: e.target.value }))}>
            {LANG_OPTS.map(l => <option key={l} value={l}>{t(`languageOptions.${l}`)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('heritagePreference')}</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder={t('heritagePlaceholder')}
            value={form.heritagePreference} onChange={e => setForm(f => ({ ...f, heritagePreference: e.target.value }))} />
        </div>
      </div>

      {/* Education */}
      <SectionTitle>{t('educationSection')}</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('minEducation')}</label>
          <select className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.minEducation} onChange={e => setForm(f => ({ ...f, minEducation: e.target.value }))}>
            {EDUCATION.map(e => <option key={e} value={e}>{t(`educationOptions.${e}`)}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('careerExpectation')}</label>
          <input className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder={t('careerPlaceholder')}
            value={form.careerExpectation} onChange={e => setForm(f => ({ ...f, careerExpectation: e.target.value }))} />
        </div>
      </div>

      {/* Mission */}
      <SectionTitle>{t('missionSection')}</SectionTitle>
      <div className="flex flex-wrap gap-2 mb-2">
        {LIFE_MISSIONS.map(m => (
          <button key={m}
            onClick={() => setForm(f => ({ ...f, selectedMissions: toggleArray(f.selectedMissions, m) }))}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              form.selectedMissions.includes(m)
                ? 'bg-covenant-100 text-covenant-700 border-covenant-400'
                : 'border-gray-200 text-gray-500'
            }`}>{m}</button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" className="accent-covenant-600"
          checked={form.openToFullTimeMission}
          onChange={e => setForm(f => ({ ...f, openToFullTimeMission: e.target.checked }))} />
        {t('openToFullTimeMission')}
      </label>

      {/* Personality */}
      <SectionTitle>{t('personalitySection')}</SectionTitle>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('personalityNotes')}</label>
          <textarea rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
            placeholder={t('personalityPlaceholder')}
            value={form.personalityNotes} onChange={e => setForm(f => ({ ...f, personalityNotes: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('dealbreakers')}</label>
          <textarea rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
            placeholder={t('dealbreakersPlaceholder')}
            value={form.dealbreakers} onChange={e => setForm(f => ({ ...f, dealbreakers: e.target.value }))} />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">{t('additionalNotes')}</label>
          <textarea rows={2} className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
            placeholder={t('additionalPlaceholder')}
            value={form.additionalNotes} onChange={e => setForm(f => ({ ...f, additionalNotes: e.target.value }))} />
        </div>
      </div>

      <SaveButton onClick={save} saved={saved} />
      {saved && <p className="text-grace-600 text-sm mt-2">{t('saveSuccess')}</p>}
    </div>
  )
}

// ============================================================
// TAB 5 — Church Verification
// ============================================================
function ChurchVerifyTab() {
  const t = useTranslations('profile.verification')
  const [certType, setCertType] = useState<typeof CERT_TYPES[number]>('membership')
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div>
      <SectionTitle>{t('title')}</SectionTitle>
      <div className="bg-covenant-50 border border-covenant-200 rounded-xl p-4 mb-4">
        <p className="text-sm text-covenant-700">{t('info')}</p>
      </div>
      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-2">{t('certType')}</label>
        <div className="flex flex-col gap-2">
          {CERT_TYPES.map(ct => (
            <label key={ct} className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="radio" name="certType" className="accent-covenant-600"
                checked={certType === ct} onChange={() => setCertType(ct)} />
              {t(`types.${ct}`)}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">{t('upload')}</label>
        <input type="file" accept="image/*,application/pdf"
          className="block text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-covenant-100 file:text-covenant-700 hover:file:bg-covenant-200"
          onChange={e => setFile(e.target.files?.[0] ?? null)} />
        {file && <p className="text-xs text-grace-600 mt-1">✅ {file.name}</p>}
      </div>
      {file && (
        <button
          onClick={() => setSubmitted(true)}
          className="bg-covenant-600 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-covenant-700 transition-colors">
          📤 {t('submitVerification')}
        </button>
      )}
      {submitted && <p className="text-grace-600 text-sm mt-2">✅ {t('successMsg')}</p>}
    </div>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================
// ============================================================
// AVATAR UPLOAD CARD
// ============================================================
function AvatarUpload() {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5 MB'); return }

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    // Upload to Supabase Storage via API
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/profile/avatar', { method: 'POST', body: form })
      if (res.ok) { setUploaded(true) }
    } catch { /* silent — preview still shows */ }
    setUploading(false)
  }

  return (
    <div className="flex items-center gap-5 mb-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-20 h-20 rounded-full bg-gradient-to-br from-covenant-200 to-covenant-400 flex items-center justify-center overflow-hidden cursor-pointer group shadow-md"
      >
        {preview ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <User className="w-8 h-8 text-white" />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-5 h-5 text-white" />
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div>
        <p className="text-sm text-gray-600">
          {uploading ? '⏳ Uploading...' : uploaded ? '✅ Photo saved!' : 'Click to upload profile photo'}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP · Max 5 MB</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const tp = useTranslations('profile')
  const tid = useTranslations('idVerify')
  const tpp = useTranslations('partnerPrefs')
  const [activeTab, setActiveTab] = useState<Tab>('spiritual')

  const TAB_LABELS: Record<Tab, string> = {
    spiritual:    tp('spiritual.title'),
    relationship: tp('relationship.title'),
    idverify:     tid('title'),
    preferences:  tpp('title'),
    church:       tp('verification.title'),
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{tp('title')}</h1>

      {/* Avatar upload */}
      <AvatarUpload />

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap mb-8 border-b pb-2">
        {TABS.map(({ id, icon: Icon, labelKey: _labelKey }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2 ${
              activeTab === id
                ? 'border-covenant-600 text-covenant-700 bg-covenant-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}>
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {TAB_LABELS[id]}
            </span>
            <span className="sm:hidden">
              {id === 'idverify' ? 'ID' :
               id === 'preferences' ? '♥' :
               id === 'church' ? '⛪' :
               id === 'spiritual' ? '🙏' : '💛'}
            </span>
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className="card-covenant min-h-[500px]">
        {activeTab === 'spiritual'    && <SpiritualTab />}
        {activeTab === 'relationship' && <RelationshipTab />}
        {activeTab === 'idverify'     && <IdVerifyTab />}
        {activeTab === 'preferences'  && <PartnerPrefsTab />}
        {activeTab === 'church'       && <ChurchVerifyTab />}
      </div>
    </div>
  )
}
