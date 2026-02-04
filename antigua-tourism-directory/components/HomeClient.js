'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function HomeClient({ stats, parishes, categories, featuredListings, monthlyVisitors }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Stats Banner - Mobile Responsive */}
      <div className="bg-indigo-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Visitor Count */}
            <div className="flex items-center gap-2 text-center md:text-left">
              <span className="text-2xl">📊</span>
              <div>
                <span className="font-bold text-lg md:text-xl">{monthlyVisitors} people</span>
                <span className="text-sm md:text-base ml-1">browsing this month</span>
              </div>
            </div>
            
            {/* Business Owner CTA */}
            <div className="flex items-center gap-2 text-center">
              <span className="text-xl">🏪</span>
              <span className="text-sm md:text-base">Own a business?</span>
              <Link
                href="/pricing"
                className="text-yellow-300 font-semibold underline hover:text-yellow-200 text-sm md:text-base whitespace-nowrap"
              >
                Get premium visibility
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Mobile Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
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
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">
                Home
              </Link>
              <Link href="/parishes" className="text-gray-700 hover:text-indigo-600 font-medium">
                Browse Parishes
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-indigo-600 font-medium">
                Categories
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">
                Contact
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 font-medium">
                Login
              </Link>
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
              <Link
                href="/"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/parishes"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Parishes
              </Link>
              <Link
                href="/categories"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/add-listing"
                className="block bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                + Add Your Business
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section - SEO OPTIMIZED WITH BUSINESS OWNER CTA */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Headline - SEO Optimized */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            Antigua & Barbuda Business Directory
          </h1>
          
          {/* Subheadline - Target Keywords */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-4 md:mb-6">
            Find Local Businesses, Hotels, Restaurants & Services
          </h2>
          
          {/* Description - Natural Keyword Integration */}
          <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-4xl mx-auto px-4">
            The complete tourism and business directory for Antigua and Barbuda. 
            Discover hotels, restaurants, tours, activities, and local services across the islands.
          </p>

          {/* Search Bar - Mobile Responsive */}
          <div className="max-w-3xl mx-auto mb-6 px-4">
            <form onSubmit={handleSearch}>
              <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-2xl p-3 shadow-2xl">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-2xl">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hotels, restaurants, tours, activities..."
                    className="w-full pl-14 pr-4 py-3 md:py-4 text-gray-900 placeholder-gray-400 bg-white rounded-xl focus:outline-none text-base md:text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-yellow-400 text-indigo-900 px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-yellow-300 transition shadow-lg whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </form>
            <p className="text-white text-xs md:text-sm mt-3">
              Popular: beach resorts, fine dining, water sports, cultural tours
            </p>
          </div>

          {/* Business Owner CTA - NEW! */}
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-4 md:p-6 mb-8 max-w-3xl mx-auto">
            <p className="text-white font-semibold text-base md:text-lg mb-3">
              🏪 Business Owner?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/add-listing"
                className="bg-yellow-400 text-indigo-900 px-6 md:px-8 py-3 rounded-lg font-bold text-base hover:bg-yellow-300 transition shadow-lg"
              >
                ➕ Add Your Business
              </Link>
              <span className="text-white/80 text-sm md:text-base">or</span>
              <Link
                href="/login"
                className="bg-white/20 text-white px-6 md:px-8 py-3 rounded-lg font-bold text-base hover:bg-white/30 transition border-2 border-white/50"
              >
                🔐 Claim Your Listing
              </Link>
            </div>
            <p className="text-white/80 text-xs md:text-sm mt-3">
              Don't see your business? Add it for free or claim it to update details
            </p>
          </div>
          
          {/* Stats Boxes - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12 px-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 md:px-12 py-6 md:py-8 border border-white/20">
              <div className="text-3xl md:text-5xl font-extrabold text-yellow-300 mb-2">{stats.total_listings}</div>
              <div className="text-white font-semibold text-base md:text-lg">Business Listings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 md:px-12 py-6 md:py-8 border border-white/20">
              <div className="text-3xl md:text-5xl font-extrabold text-yellow-300 mb-2">{stats.total_parishes}</div>
              <div className="text-white font-semibold text-base md:text-lg">Parishes Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 md:px-12 py-6 md:py-8 border border-white/20 sm:col-span-2 lg:col-span-1">
              <div className="text-3xl md:text-5xl font-extrabold text-yellow-300 mb-2">{stats.total_categories}</div>
              <div className="text-white font-semibold text-base md:text-lg">Categories</div>
            </div>
          </div>

          {/* CTA Buttons - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link 
              href="/parishes" 
              className="bg-yellow-400 text-indigo-900 px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-yellow-300 transition shadow-lg text-center"
            >
              Browse All Parishes →
            </Link>
            <Link 
              href="/categories" 
              className="bg-transparent text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg border-2 border-white/50 hover:bg-white/10 transition text-center"
            >
              View Categories ↓
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      {featuredListings && featuredListings.length > 0 && (
        <section className="bg-gradient-to-b from-yellow-50 to-white py-12 md:py-16 border-t-4 border-yellow-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full font-bold text-sm md:text-base mb-4">
                <span className="text-xl">⭐</span>
                <span>FEATURED BUSINESSES</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Premium Listings</h3>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Discover top-rated businesses offering exceptional service across Antigua & Barbuda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.slug}`}
                  className="relative bg-white rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 group"
                >
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <span className="text-lg">⭐</span>
                    <span>Featured</span>
                  </div>

                  {/* Image */}
                  <div className="relative h-56 md:h-64 bg-gray-200 overflow-hidden">
                    {listing.image_url ? (
                      <Image
                        src={listing.image_url}
                        alt={listing.business_name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl md:text-7xl">
                        {listing.category?.icon_emoji || '🏢'}
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition">
                      {listing.business_name}
                    </h4>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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

                    {/* Rating if available */}
                    {listing.average_rating && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                          <span className="text-yellow-600 mr-1">⭐</span>
                          <span className="font-bold text-gray-900">{listing.average_rating.toFixed(1)}</span>
                        </div>
                        {listing.review_count > 0 && (
                          <span className="text-sm text-gray-600">
                            ({listing.review_count} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-indigo-600 font-bold flex items-center gap-2 text-base md:text-lg">
                      View Details
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Link>
              ))}
            </div>

            {/* View All Featured Button */}
            <div className="text-center mt-8 md:mt-10">
              <Link 
                href="/featured" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-8 py-4 rounded-xl font-bold text-base md:text-lg hover:from-yellow-500 hover:to-yellow-700 transition shadow-lg"
              >
                <span>⭐</span>
                <span>View All Featured Businesses</span>
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories - Mobile Responsive (MOVED ABOVE PARISHES) */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Popular Categories</h3>
          <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8">
            Browse businesses by category. From dining to adventure, find exactly what you're looking for.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8 text-center hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group"
              >
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">{category.icon_emoji}</div>
                <h4 className="font-bold text-base md:text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                  {category.name}
                </h4>
                <div className="text-gray-600 font-semibold text-sm md:text-base">
                  {category.listing_count} listings
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 md:mt-10">
            <Link 
              href="/categories" 
              className="text-indigo-600 font-bold text-base md:text-lg hover:text-indigo-700 inline-flex items-center gap-2"
            >
              View All Categories
              <span className="text-xl md:text-2xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Parishes Grid - Mobile Responsive (MOVED BELOW CATEGORIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Browse by Parish</h3>
        <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8">
          Explore businesses and attractions across Antigua's parishes. Find everything from restaurants 
          to resorts in your preferred location.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {parishes.map((parish) => (
            <Link 
              key={parish.id} 
              href={`/parish/${parish.slug}`}
              className="border-2 border-gray-200 rounded-xl p-6 md:p-8 hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group bg-white"
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                  {parish.name}
                </h4>
                <span className="text-2xl md:text-3xl">📍</span>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base">{parish.description}</p>
              <div className="text-indigo-600 font-bold text-base md:text-lg flex items-center gap-2">
                {parish.listing_count} listings
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer - Mobile Responsive */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
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
              © 2026 Antigua Search. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              {stats.total_listings} Business Listings • {stats.total_parishes} Parishes • Discover Paradise
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}