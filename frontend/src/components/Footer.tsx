import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="font-bold text-white text-lg">SchemeFinder AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Helping Indian citizens discover government schemes they may be eligible for.
              AI-powered. Accurate. Free.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/schemes" className="hover:text-white transition-colors">Browse Schemes</Link></li>
              <li><Link to="/eligibility" className="hover:text-white transition-colors">Check Eligibility</Link></li>
              <li><Link to="/assistant" className="hover:text-white transition-colors">AI Assistant</Link></li>
            </ul>
          </div>

          {/* Official Sources */}
          <div>
            <h4 className="font-semibold text-white mb-3">Official Sources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  myScheme.gov.in
                </a>
              </li>
              <li>
                <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  india.gov.in
                </a>
              </li>
              <li>
                <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  scholarships.gov.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-xs text-slate-500">
          <p>
            ⚠️ <strong className="text-slate-400">Disclaimer:</strong> SchemeFinder AI provides indicative information only. 
            Final eligibility is determined by the relevant government department. 
            Always verify details at official government websites before applying.
          </p>
          <p className="mt-2">
            Built for IDEA//FORGE Hackathon · Civic Pulse Track · Data sourced from official government portals.
          </p>
        </div>
      </div>
    </footer>
  )
}
