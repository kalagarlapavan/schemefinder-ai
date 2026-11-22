import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getScheme, type Scheme } from '../services/api'
import {
  ArrowLeft, ExternalLink, CheckCircle, FileText,
  BookOpen, Loader, AlertCircle, ChevronRight
} from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  'Agriculture': 'bg-green-100 text-green-800',
  'Health': 'bg-red-100 text-red-800',
  'Housing': 'bg-blue-100 text-blue-800',
  'Education': 'bg-purple-100 text-purple-800',
  'Business & Entrepreneurship': 'bg-orange-100 text-orange-800',
  'Women & Child': 'bg-pink-100 text-pink-800',
  'Social Welfare': 'bg-teal-100 text-teal-800',
  'Skill Development': 'bg-indigo-100 text-indigo-800',
}

export default function SchemeDetail() {
  const { id } = useParams<{ id: string }>()
  const [scheme, setScheme] = useState<Scheme | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getScheme(id)
      .then(res => setScheme(res.data))
      .catch(() => setError('Scheme not found or backend is unavailable.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-500">
      <Loader className="animate-spin mb-3" size={32} />
      <p>Loading scheme details...</p>
    </div>
  )

  if (error || !scheme) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <AlertCircle size={48} className="text-red-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-slate-900 mb-2">Scheme Not Found</h2>
      <p className="text-slate-500 mb-6">{error}</p>
      <Link to="/schemes" className="btn-primary">Back to Schemes</Link>
    </div>
  )

  const categoryColor = CATEGORY_COLORS[scheme.category] || 'bg-slate-100 text-slate-700'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link to="/schemes" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to all schemes
      </Link>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${categoryColor}`}>
            {scheme.category}
          </span>
          {scheme.is_central && (
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              Central Government
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">{scheme.name}</h1>
        <p className="text-slate-600 leading-relaxed">{scheme.description}</p>

        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Apply Now <ExternalLink size={16} />
          </a>
          <Link to="/eligibility" className="btn-outline">
            Check My Eligibility <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Benefits */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Benefits</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">{scheme.benefits}</p>
        </div>

        {/* Eligibility */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Eligibility Criteria</h2>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            {scheme.min_age > 0 || scheme.max_age < 120 ? (
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Age: {scheme.min_age} – {scheme.max_age < 120 ? scheme.max_age : 'No upper limit'} years</span>
              </li>
            ) : null}
            {scheme.max_annual_income < 9999999999 && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Annual income: Up to ₹{scheme.max_annual_income.toLocaleString('en-IN')}</span>
              </li>
            )}
            {scheme.eligible_occupations && !scheme.eligible_occupations.includes('all') && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Occupation: {scheme.eligible_occupations.join(', ')}</span>
              </li>
            )}
            {scheme.eligible_states && !scheme.eligible_states.includes('all') && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>States: {scheme.eligible_states.join(', ')}</span>
              </li>
            )}
            {scheme.eligible_education && !scheme.eligible_education.includes('all') && (
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Education: {scheme.eligible_education.join(' / ')}</span>
              </li>
            )}
            {(!scheme.min_age || scheme.min_age === 0) && scheme.max_age >= 120 &&
             (!scheme.max_annual_income || scheme.max_annual_income >= 9999999999) &&
             scheme.eligible_occupations?.includes('all') &&
             scheme.eligible_states?.includes('all') && (
              <li className="text-slate-500 italic">Open to all eligible citizens. See official website for full criteria.</li>
            )}
          </ul>
        </div>

        {/* Documents */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Documents Required</h2>
          </div>
          <ul className="space-y-2">
            {scheme.documents_required?.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                {doc}
              </li>
            ))}
          </ul>
        </div>

        {/* How to Apply */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <ChevronRight size={18} className="text-orange-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">How to Apply</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{scheme.application_procedure}</p>
          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-blue-700 hover:text-blue-800 text-sm font-semibold"
          >
            Go to Official Application Portal <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Source & Disclaimer */}
      <div className="card mt-6 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-700 mb-2">Information Source</h3>
        <a
          href={scheme.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm flex items-center gap-1 break-all"
        >
          {scheme.source_url} <ExternalLink size={12} />
        </a>
        <p className="text-xs text-slate-500 mt-3">
          ⚠️ This information is provided for guidance only. Eligibility criteria and benefits may change.
          Always verify current details at the official government website before applying.
        </p>
      </div>
    </div>
  )
}
