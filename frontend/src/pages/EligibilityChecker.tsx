import { useState } from 'react'
import { Link } from 'react-router-dom'
import { checkEligibility, type CitizenProfile, type EligibilityResult } from '../services/api'
import { CheckCircle, AlertCircle, XCircle, ChevronRight, Loader, ArrowRight, Info } from 'lucide-react'
import SchemeCard from '../components/SchemeCard'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman & Nicobar Islands','Chandigarh',
  'Dadra & Nagar Haveli and Daman & Diu','Delhi','Jammu & Kashmir',
  'Ladakh','Lakshadweep','Puducherry'
]

const OCCUPATIONS = [
  'Student','Farmer','Agriculture','Salaried','Business Owner','Self-employed',
  'Daily Wage Worker','Domestic Worker','Street Vendor','Artisan','Fisherman',
  'Retired','Government Employee','Unemployed','Entrepreneur','Other'
]

const EDUCATION_LEVELS = [
  'No Formal Education','5th Pass','8th Pass','10th Pass',
  '12th Pass','Diploma','Graduate','Post Graduate','PhD'
]

const INITIAL_PROFILE: CitizenProfile = {
  age: 0, state: '', occupation: '', annual_income: 0, education: ''
}

type FormErrors = Partial<Record<keyof CitizenProfile, string>>

function validate(profile: CitizenProfile): FormErrors {
  const errors: FormErrors = {}
  if (!profile.age || profile.age < 1 || profile.age > 120)
    errors.age = 'Please enter a valid age between 1 and 120'
  if (!profile.state) errors.state = 'Please select your state'
  if (!profile.occupation) errors.occupation = 'Please select your occupation'
  if (profile.annual_income < 0) errors.annual_income = 'Income cannot be negative'
  if (!profile.education) errors.education = 'Please select your education level'
  return errors
}

export default function EligibilityChecker() {
  const [profile, setProfile] = useState<CitizenProfile>(INITIAL_PROFILE)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<EligibilityResult[] | null>(null)
  const [summary, setSummary] = useState({ eligible: 0, partial: 0, notEligible: 0, disclaimer: '' })
  const [apiError, setApiError] = useState('')
  const [activeTab, setActiveTab] = useState<'ELIGIBLE' | 'PARTIAL' | 'NOT_ELIGIBLE' | 'ALL'>('ELIGIBLE')

  const handleChange = (field: keyof CitizenProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(profile)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setApiError('')
    setResults(null)
    try {
      const res = await checkEligibility(profile)
      setResults(res.data.results)
      setSummary({
        eligible: res.data.total_eligible,
        partial: res.data.total_partial,
        notEligible: res.data.total_not_eligible,
        disclaimer: res.data.disclaimer
      })
      setActiveTab(res.data.total_eligible > 0 ? 'ELIGIBLE' : res.data.total_partial > 0 ? 'PARTIAL' : 'ALL')
      window.scrollTo({ top: document.getElementById('results')?.offsetTop ?? 0, behavior: 'smooth' })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Unable to check eligibility. Please ensure the backend is running.'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }

  const displayedResults = results
    ? (activeTab === 'ALL' ? results : results.filter(r => r.status === activeTab))
    : []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Eligibility Checker</h1>
        <p className="text-slate-500 mt-1">
          Enter your details to find government schemes you may qualify for.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex gap-3">
        <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          We only collect basic information needed to match schemes. No Aadhaar, bank details, or sensitive personal data is required or stored permanently.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Your Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Age */}
          <div>
            <label htmlFor="age" className="label">Age <span className="text-red-500">*</span></label>
            <input
              id="age" type="number" min="1" max="120"
              placeholder="e.g. 25"
              value={profile.age || ''}
              onChange={e => handleChange('age', parseInt(e.target.value) || 0)}
              className={`input-field ${errors.age ? 'border-red-400 ring-1 ring-red-300' : ''}`}
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="label">State / UT <span className="text-red-500">*</span></label>
            <select
              id="state"
              value={profile.state}
              onChange={e => handleChange('state', e.target.value)}
              className={`input-field ${errors.state ? 'border-red-400 ring-1 ring-red-300' : ''}`}
            >
              <option value="">Select your state</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>

          {/* Occupation */}
          <div>
            <label htmlFor="occupation" className="label">Occupation <span className="text-red-500">*</span></label>
            <select
              id="occupation"
              value={profile.occupation}
              onChange={e => handleChange('occupation', e.target.value)}
              className={`input-field ${errors.occupation ? 'border-red-400 ring-1 ring-red-300' : ''}`}
            >
              <option value="">Select your occupation</option>
              {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
          </div>

          {/* Annual Income */}
          <div>
            <label htmlFor="annual_income" className="label">Annual Family Income (₹) <span className="text-red-500">*</span></label>
            <input
              id="annual_income" type="number" min="0"
              placeholder="e.g. 250000"
              value={profile.annual_income || ''}
              onChange={e => handleChange('annual_income', parseInt(e.target.value) || 0)}
              className={`input-field ${errors.annual_income ? 'border-red-400 ring-1 ring-red-300' : ''}`}
            />
            {profile.annual_income > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                ₹{profile.annual_income.toLocaleString('en-IN')} per year
              </p>
            )}
            {errors.annual_income && <p className="text-red-500 text-xs mt-1">{errors.annual_income}</p>}
          </div>

          {/* Education */}
          <div className="sm:col-span-2">
            <label htmlFor="education" className="label">Highest Education Level <span className="text-red-500">*</span></label>
            <select
              id="education"
              value={profile.education}
              onChange={e => handleChange('education', e.target.value)}
              className={`input-field ${errors.education ? 'border-red-400 ring-1 ring-red-300' : ''}`}
            >
              <option value="">Select your education level</option>
              {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education}</p>}
          </div>
        </div>

        {apiError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            <strong>Error: </strong>{apiError}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? (
              <><Loader size={18} className="animate-spin" /> Checking eligibility...</>
            ) : (
              <>Check My Eligibility <ChevronRight size={18} /></>
            )}
          </button>
          <button
            type="button"
            onClick={() => { setProfile(INITIAL_PROFILE); setErrors({}); setResults(null); setApiError('') }}
            className="btn-outline py-3 px-4"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results */}
      {results && (
        <div id="results">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <CheckCircle size={24} className="text-emerald-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-emerald-700">{summary.eligible}</div>
              <div className="text-xs font-semibold text-emerald-600">Potentially Eligible</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <AlertCircle size={24} className="text-amber-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-amber-700">{summary.partial}</div>
              <div className="text-xs font-semibold text-amber-600">Verify Eligibility</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <XCircle size={24} className="text-red-500 mx-auto mb-1" />
              <div className="text-2xl font-bold text-red-600">{summary.notEligible}</div>
              <div className="text-xs font-semibold text-red-500">Not Eligible</div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
            <Info size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">{summary.disclaimer}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
            {(['ELIGIBLE', 'PARTIAL', 'NOT_ELIGIBLE', 'ALL'] as const).map(tab => {
              const count = tab === 'ALL' ? results.length
                : tab === 'ELIGIBLE' ? summary.eligible
                : tab === 'PARTIAL' ? summary.partial
                : summary.notEligible
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-blue-700 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'ELIGIBLE' ? '✓ Eligible' : tab === 'PARTIAL' ? '⚠ Verify' : tab === 'NOT_ELIGIBLE' ? '✗ Not Eligible' : 'All'}
                  <span className="ml-1.5 bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded-full">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Result Cards */}
          {displayedResults.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No schemes in this category</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedResults.map(result => (
                <SchemeCard
                  key={result.scheme_id}
                  scheme={result.scheme as never}
                  eligibilityStatus={result.status}
                  matchReason={result.match_reason}
                />
              ))}
            </div>
          )}

          {/* Ask AI CTA */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <p className="text-blue-800 font-semibold mb-2">Have questions about these results?</p>
            <p className="text-blue-600 text-sm mb-4">Ask our AI assistant about any scheme, documents needed, or how to apply.</p>
            <Link to="/assistant" className="btn-primary">
              Ask AI Assistant <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
