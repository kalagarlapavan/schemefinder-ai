import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import FindSchemes from './pages/FindSchemes'
import EligibilityChecker from './pages/EligibilityChecker'
import AIAssistant from './pages/AIAssistant'
import SchemeDetail from './pages/SchemeDetail'

function NotFound() {
  return (
    <div className="max-w-2xl mx-auto text-center py-32 px-4">
      <div className="text-6xl mb-6">🔍</div>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">Page Not Found</h1>
      <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="btn-primary">Go Home</a>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schemes" element={<FindSchemes />} />
            <Route path="/schemes/:id" element={<SchemeDetail />} />
            <Route path="/eligibility" element={<EligibilityChecker />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
