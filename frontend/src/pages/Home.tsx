import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, CheckCircle, FileText, ExternalLink, Users, Landmark, BookOpen, Heart } from 'lucide-react'
import { getSchemes, type Scheme } from '../services/api'
import SchemeCard from '../components/SchemeCard'

const FEATURED_SCHEMES = [
  { name: 'PM-KISAN Samman Nidhi', category: 'Agriculture', icon: '🌾', desc: '₹6,000/year for farmer families' },
  { name: 'Ayushman Bharat PM-JAY', category: 'Health', icon: '🏥', desc: '₹5 lakh health cover per family' },
  { name: 'PMAY Housing Scheme', category: 'Housing', icon: '🏠', desc: 'Affordable housing with interest subsidy' },
  { name: 'National Scholarship Portal', category: 'Education', icon: '🎓', desc: '₹10,000–₹20,000/year for students' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'Enter Your Details', desc: 'Share basic info: age, state, occupation, income, education. No Aadhaar or sensitive data required.', icon: <FileText size={24} /> },
  { step: '2', title: 'Automatic Matching', desc: 'Our rule-based engine compares your profile against 12+ verified government schemes.', icon: <Search size={24} /> },
  { step: '3', title: 'View Your Results', desc: 'See which schemes you may qualify for, with benefits, documents needed, and official links.', icon: <CheckCircle size={24} /> },
]

const STATS = [
  { label: 'Government Schemes', value: '12+', icon: <Landmark size={20} /> },
  { label: 'Citizens Helped', value: 'Free', icon: <Users size={20} /> },
  { label: 'Official Sources', value: '100%', icon: <BookOpen size={20} /> },
  { label: 'AI-Powered', value: 'Yes', icon: <Heart size={20} /> },
]

export default function Home() {
  const [popularSchemes, setPopularSchemes] = useState<Scheme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSchemes({ limit: 3 })
      .then(res => setPopularSchemes(res.data.schemes.slice(0, 3)))
      .catch(() => setPopularSchemes([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/40 text-blue-100 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-blue-500/40">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            IDEA//FORGE Hackathon · Civic Pulse Track
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Find Government Schemes<br />
            <span className="text-emerald-400">You May Be Eligible For</span>
          </h1>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Enter your basic details and discover which central and state government schemes 
            match your profile — instantly, accurately, and for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/eligibility" className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 text-lg transition-colors">
              Check My Eligibility <ArrowRight size={20} />
            </Link>
            <Link to="/schemes" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 text-lg transition-colors border border-white/20">
              Browse All Schemes
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 text-blue-700 rounded-lg mb-2">
                  {stat.icon}
                </div>
                <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">How It Works</h2>
        <p className="text-slate-500 text-center mb-10">Simple 3-step process to find your eligible schemes</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-700 text-white rounded-2xl mb-4">
                {step.icon}
              </div>
              <div className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Step {step.step}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/eligibility" className="btn-primary">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Popular Schemes */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Popular Schemes</h2>
              <p className="text-slate-500 mt-1">Most searched government schemes</p>
            </div>
            <Link to="/schemes" className="btn-outline hidden sm:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-slate-200 rounded mb-3 w-24"></div>
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-16 bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : popularSchemes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularSchemes.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURED_SCHEMES.map((s) => (
                <div key={s.name} className="card text-center">
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{s.category}</span>
                  <h3 className="font-bold text-slate-900 mt-2 text-sm">{s.name}</h3>
                  <p className="text-slate-500 text-xs mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-6 sm:hidden">
            <Link to="/schemes" className="btn-outline">View All Schemes <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-2xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Not sure which schemes you qualify for?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Answer 5 simple questions and get a personalised list of government schemes matched to your profile.
          </p>
          <Link to="/eligibility" className="bg-white text-blue-800 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
            Check Eligibility Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Official Sources Banner */}
      <section className="bg-slate-50 border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 mb-4 font-medium">Data sourced from official government portals</p>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-slate-600">
            {['myscheme.gov.in', 'india.gov.in', 'scholarships.gov.in', 'pmkisan.gov.in', 'pmjay.gov.in', 'pmaymis.gov.in'].map(src => (
              <a key={src} href={`https://${src}`} target="_blank" rel="noopener noreferrer"
                className="hover:text-blue-700 flex items-center gap-1 transition-colors">
                {src} <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
