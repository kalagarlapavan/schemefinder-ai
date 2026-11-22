import { useEffect, useState, useCallback } from 'react'
import { Search, Filter, Loader } from 'lucide-react'
import { getSchemes, getCategories, type Scheme } from '../services/api'
import SchemeCard from '../components/SchemeCard'

export default function FindSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  // Fetch categories once
  useEffect(() => {
    getCategories()
      .then(res => setCategories(res.data.categories))
      .catch(() => {})
  }, [])

  // Fetch schemes on filter change
  const fetchSchemes = useCallback(() => {
    setLoading(true)
    setError('')
    getSchemes({
      search: debouncedSearch || undefined,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      limit: 50,
    })
      .then(res => setSchemes(res.data.schemes))
      .catch(() => setError('Failed to load schemes. Please check that the backend is running.'))
      .finally(() => setLoading(false))
  }, [debouncedSearch, selectedCategory])

  useEffect(() => { fetchSchemes() }, [fetchSchemes])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Government Schemes</h1>
        <p className="text-slate-500 mt-1">Browse all {schemes.length > 0 ? schemes.length : ''} verified government schemes</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            id="search-schemes"
            type="text"
            placeholder="Search schemes by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="relative sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            id="filter-category"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="input-field pl-10 appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader className="animate-spin mb-3" size={32} />
          <p>Loading schemes...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
          <p className="font-semibold mb-1">Could not load schemes</p>
          <p className="text-sm">{error}</p>
          <button onClick={fetchSchemes} className="mt-4 btn-primary text-sm py-2 px-4">
            Retry
          </button>
        </div>
      ) : schemes.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Search size={48} className="mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-semibold">No schemes found</p>
          <p className="text-sm mt-1">Try a different search term or category</p>
          <button onClick={() => { setSearch(''); setSelectedCategory('all') }} className="mt-4 btn-outline text-sm py-2 px-4">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map(scheme => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  )
}
