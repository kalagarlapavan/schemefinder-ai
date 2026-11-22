import { Link } from 'react-router-dom'
import { type Scheme } from '../services/api'
import { ExternalLink, ArrowRight } from 'lucide-react'

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

interface SchemeCardProps {
  scheme: Scheme
  eligibilityStatus?: 'ELIGIBLE' | 'PARTIAL' | 'NOT_ELIGIBLE'
  matchReason?: string
}

export default function SchemeCard({ scheme, eligibilityStatus, matchReason }: SchemeCardProps) {
  const categoryColor = CATEGORY_COLORS[scheme.category] || 'bg-slate-100 text-slate-700'

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColor}`}>
              {scheme.category}
            </span>
            {scheme.is_central && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Central Govt
              </span>
            )}
            {eligibilityStatus && (
              <span className={
                eligibilityStatus === 'ELIGIBLE' ? 'badge-eligible' :
                eligibilityStatus === 'PARTIAL' ? 'badge-partial' :
                'badge-not-eligible'
              }>
                {eligibilityStatus === 'ELIGIBLE' ? '✓ Potentially Eligible' :
                 eligibilityStatus === 'PARTIAL' ? '⚠ Verify Eligibility' :
                 '✗ Not Eligible'}
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-900 text-lg leading-tight">{scheme.name}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-sm line-clamp-2">{scheme.description}</p>

      {/* Match reason */}
      {matchReason && (
        <div className={`text-xs rounded-lg p-3 ${
          eligibilityStatus === 'ELIGIBLE' ? 'bg-emerald-50 text-emerald-800' :
          eligibilityStatus === 'PARTIAL' ? 'bg-amber-50 text-amber-800' :
          'bg-red-50 text-red-800'
        }`}>
          {matchReason}
        </div>
      )}

      {/* Benefits */}
      <div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Benefits</span>
        <p className="text-sm text-slate-700 mt-1 line-clamp-2">{scheme.benefits}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
        <a
          href={scheme.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          Official Site <ExternalLink size={14} />
        </a>
        <Link
          to={`/schemes/${scheme.id}`}
          className="text-slate-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
