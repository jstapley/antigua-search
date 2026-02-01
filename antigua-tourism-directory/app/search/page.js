'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    parish: '',
    sortBy: 'relevance'
  })
  
  const [categories, setCategories] = useState([])
  const [parishes, setParishes] = useState([])

  // Load filter options
  useEffect(() => {
    loadFilterOptions()
  }, [])

  // Search when query changes
  useEffect(() => {
    if (query) {
      performSearch(query)
    } else {
      setLoading(false)
    }
  }, [query, filters])

  const loadFilterOptions = async () => {
    const { data: cats } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name')
    
    const { data: pars } = await supabase
      .from('parishes')
      .select('id, name, slug')
      .order('name')
    
    setCategories(cats || [])
    setParishes(pars || [])
  }

  const performSearch = async (searchTerm) => {
    setLoading(true)
    
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          category:categories(name, icon_emoji),
          parish:parishes(name)
        `)
        .eq('status', 'active')

      // Apply search filter
      if (searchTerm) {
        query = query.or(`business_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%`)
      }

      // Apply category filter
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }

      // Apply parish filter
      if (filters.parish) {
        query = query.eq('parish_id', filters.parish)
      }

      // Apply sorting
      if (filters.sortBy === 'name') {
        query = query.order('business_name', { ascending: true })
      } else if (filters.sortBy === 'rating') {
        query = query.order('average_rating', { ascending: false, nullsLast: true })
      } else if (filters.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      setResults(data || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      parish: '',
      sortBy: 'relevance'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/antigua-flag.png" 
                alt="Antigua Flag" 
                width={50} 
                height={50}
                className="rounded-full"
              />
              <div>
                <div className="text-xl font-bold text-gray-900">ANTIGUA</div>
                <div className="text-sm text-indigo-600 font-semibold">SEARCH.COM</div>
              </div>
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
              <Link href="/parishes" className="text-gray-700 hover:text-indigo-600 font-medium">Browse Parishes</Link>
              <Link href="/categories" className="text-gray-700 hover:text-indigo-600 font-medium">Categories</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Header */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-6 text-center">
            Search Results
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <span className="absolute left-6 text-gray-500 text-2xl">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, hotels, activities..."
                className="w-full pl-16 pr-40 py-5 rounded-full text-lg text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-2 bg-yellow-400 text-indigo-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition shadow-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                {(filters.category || filters.parish || filters.sortBy !== 'relevance') && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Parish Filter */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Parish
                </label>
                <select
                  value={filters.parish}
                  onChange={(e) => handleFilterChange('parish', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                >
                  <option value="">All Parishes</option>
                  {parishes.map(par => (
                    <option key={par.id} value={par.id}>{par.name}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              {query && (
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Results for "{query}"
                </h2>
              )}
              <p className="text-gray-600">
                {loading ? 'Searching...' : `${results.length} ${results.length === 1 ? 'result' : 'results'} found`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-gray-600">Searching...</p>
              </div>
            )}

            {/* No Results */}
            {!loading && results.length === 0 && query && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={clearFilters}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                  >
                    Clear Filters
                  </button>
                  <Link
                    href="/"
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!loading && results.length > 0 && (
              <div className="grid grid-cols-1 gap-6">
                {results.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listing/${listing.slug}`}
                    className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-400 transition-all duration-300 group"
                  >
                    <div className="flex">
                      {/* Image */}
                      <div className="w-64 h-48 flex-shrink-0 bg-gray-200 relative overflow-hidden">
                        {listing.image_url ? (
                          <Image
                            src={listing.image_url}
                            alt={listing.business_name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            {listing.category?.icon_emoji || '🏢'}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                            {listing.business_name}
                          </h3>
                          {listing.average_rating && (
                            <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                              <span className="text-yellow-600">⭐</span>
                              <span className="font-bold text-gray-900">{listing.average_rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            {listing.category?.icon_emoji} {listing.category?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            📍 {listing.parish?.name}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2">
                          {listing.short_description || listing.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-3 text-sm">
                            {listing.phone && (
                              <span className="text-gray-600">📞 {listing.phone}</span>
                            )}
                          </div>
                          <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2026 AntiguaSearch.com. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}