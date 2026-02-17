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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
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

  // Filter Component (used in both desktop sidebar and mobile drawer)
  const FilterControls = () => (
    <>
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
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none text-sm md:text-base"
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
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none text-sm md:text-base"
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
          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none text-sm md:text-base"
        >
          <option value="relevance">Most Relevant</option>
          <option value="name">Name (A-Z)</option>
          <option value="rating">Highest Rated</option>
          <option value="newest">Newest First</option>
        </select>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Mobile Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
                <div className="text-lg md:text-xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
                <div className="text-xs md:text-sm text-indigo-600 font-semibold">ANTIGUA SEARCH</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-6 items-center">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
              <Link href="/parishes" className="text-gray-700 hover:text-indigo-600 font-medium">Browse Parishes</Link>
              <Link href="/categories" className="text-gray-700 hover:text-indigo-600 font-medium">Categories</Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">About Us</Link>
              <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</Link>
              <Link 
                href="/add-listing" 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                + Add Your Business
              </Link>
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-700 p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3">
              <Link href="/" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/parishes" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Browse Parishes
              </Link>
              <Link href="/categories" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Categories
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              <Link href="/add-listing" className="block bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-center" onClick={() => setMobileMenuOpen(false)}>
                + Add Your Business
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Search Header - Mobile Responsive */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 text-center">
            Search Antigua & Barbuda Businesses
          </h1>
          
          {/* Search Bar - Mobile Responsive */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <span className="absolute left-4 md:left-6 text-gray-500 text-xl md:text-2xl">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants, hotels..."
                className="w-full pl-12 md:pl-16 pr-28 md:pr-40 py-3 md:py-5 rounded-full text-base md:text-lg text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-4 focus:ring-yellow-300/50 shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-2 bg-yellow-400 text-indigo-900 px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg hover:bg-yellow-300 transition shadow-lg"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 font-semibold text-gray-900 flex items-center justify-center gap-2 hover:border-indigo-400 transition"
          >
            <span>⚙️</span>
            <span>Filters & Sort</span>
            {(filters.category || filters.parish || filters.sortBy !== 'relevance') && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">Active</span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sticky top-6">
              <FilterControls />
            </div>
          </div>

          {/* Mobile Filters Drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filters & Sort</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="text-gray-500 hover:text-gray-700 p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterControls />
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold mt-6 hover:bg-indigo-700 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Results - Mobile Responsive */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6">
              {query && (
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  Results for "{query}"
                </h2>
              )}
              <p className="text-gray-600 text-sm md:text-base">
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
              <div className="bg-white rounded-xl border-2 border-gray-200 p-8 md:p-12 text-center">
                <div className="text-5xl md:text-6xl mb-4">🔍</div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6 text-sm md:text-base px-4">
                  Try adjusting your search or filters to find what you're looking for
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

            {/* Results Grid - Mobile Responsive */}
            {!loading && results.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {results.map((listing) => (
                  <Link
                    key={listing.id}
                    href={`/listing/${listing.slug}`}
                    className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:border-indigo-400 transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image - Mobile: Full width, Desktop: Fixed width */}
                      <div className="w-full md:w-64 h-48 flex-shrink-0 bg-gray-200 relative overflow-hidden">
                        {listing.image_url ? (
                          <Image
                            src={listing.image_url}
                            alt={listing.business_name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl md:text-6xl">
                            {listing.category?.icon_emoji || '🏢'}
                          </div>
                        )}
                      </div>

                      {/* Content - Mobile Responsive */}
                      <div className="flex-1 p-4 md:p-6">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <h3 className="text-lg md:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition flex-1">
                            {listing.business_name}
                          </h3>
                          {listing.average_rating && (
                            <div className="flex items-center gap-1 bg-yellow-100 px-2 md:px-3 py-1 rounded-full flex-shrink-0">
                              <span className="text-yellow-600">⭐</span>
                              <span className="font-bold text-gray-900 text-sm md:text-base">{listing.average_rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 text-xs md:text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            {listing.category?.icon_emoji} {listing.category?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            📍 {listing.parish?.name}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2 text-sm md:text-base">
                          {listing.short_description || listing.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex gap-3 text-xs md:text-sm">
                            {listing.phone && (
                              <span className="text-gray-600">📞 {listing.phone}</span>
                            )}
                          </div>
                          <span className="text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform text-sm md:text-base whitespace-nowrap">
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

      {/* Footer - Mobile Responsive */}
      <footer className="bg-gray-900 text-white py-8 md:py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image 
                  src="/antigua-flag.png" 
                  alt="Antigua Flag" 
                  width={40} 
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-bold text-base md:text-lg">Antigua Search</div>
                  <div className="text-xs md:text-sm text-gray-400">Directory</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Your complete guide to experiencing the best of Antigua & Barbuda
              </p>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-base md:text-lg">Quick Links</h6>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-gray-400 hover:text-white transition">Home</Link>
                <Link href="/parishes" className="block text-gray-400 hover:text-white transition">Browse Parishes</Link>
                <Link href="/categories" className="block text-gray-400 hover:text-white transition">All Categories</Link>
                <Link href="/about" className="block text-gray-400 hover:text-white transition">About Us</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-base md:text-lg">For Business</h6>
              <div className="space-y-2 text-sm">
                <Link href="/add-listing" className="block text-gray-400 hover:text-white transition">List Your Business</Link>
                <Link href="/advertise" className="block text-gray-400 hover:text-white transition">Advertise With Us</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white transition">Pricing</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-base md:text-lg">Contact</h6>
              <p className="text-gray-400 text-sm mb-2">contact@antiguasearch.com</p>
              <p className="text-gray-400 text-sm">St. John's, Antigua & Barbuda</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 md:pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 AntiguaSearch.com. All rights reserved.
            </p>
          </div>
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