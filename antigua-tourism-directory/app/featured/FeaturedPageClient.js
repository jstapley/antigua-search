'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function FeaturedPageClient({ featuredListings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
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
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</Link>
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
              <Link href="/" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/parishes" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Browse Parishes</Link>
              <Link href="/categories" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link href="/about" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link href="/contact" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link href="/login" className="block text-gray-700 hover:text-indigo-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/add-listing" className="block bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition text-center" onClick={() => setMobileMenuOpen(false)}>+ Add Your Business</Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-4 md:mb-6">
            <Link href="/" className="text-yellow-900 hover:text-yellow-800 text-sm md:text-base">
              Home
            </Link>
            <span className="text-yellow-900 mx-2">→</span>
            <span className="text-yellow-900 font-semibold text-sm md:text-base">Featured Businesses</span>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-yellow-900 text-sm md:text-base">PREMIUM LISTINGS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              Featured Businesses
            </h1>
            <p className="text-base md:text-xl text-yellow-100 max-w-3xl mx-auto">
              Discover top-rated businesses offering exceptional service across Antigua & Barbuda. 
              These premium listings have been verified and recommended.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Results Count */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {featuredListings.length} Featured {featuredListings.length === 1 ? 'Business' : 'Businesses'}
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Premium listings receive priority placement and enhanced visibility
          </p>
        </div>

        {/* Featured Listings Grid */}
        {featuredListings.length > 0 ? (
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
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition">
                    {listing.business_name}
                  </h3>
                  
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
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Featured Businesses Yet</h3>
            <p className="text-gray-600 mb-6">
              Check back soon for premium listings!
            </p>
            <Link
              href="/"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* CTA Section */}
        {featuredListings.length > 0 && (
          <div className="mt-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Want Premium Visibility?</h3>
            <p className="text-base md:text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
              Get your business featured with priority placement, enhanced visibility, and a gold border that stands out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/add-listing"
                className="bg-yellow-400 text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition"
              >
                List Your Business
              </Link>
              <Link
                href="/contact"
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/30 transition border-2 border-white/50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
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