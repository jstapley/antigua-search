'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Map from '@/components/Map'
import ReviewStats from '@/components/reviews/ReviewStats'
import ReviewList from '@/components/reviews/ReviewList'
import ReviewForm from '@/components/reviews/ReviewForm'
import ListingPageClient from '@/components/ListingPageClient'

export default function ListingDetailClient({ listing, isClaimed, relatedListings }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Top Stats Banner - Mobile Responsive */}
      <div className="bg-indigo-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-center md:text-left">
              <span className="text-2xl">📊</span>
              <div>
                <span className="font-bold text-lg md:text-xl">1,247 people</span>
                <span className="text-sm md:text-base ml-1">browsing this month</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-center">
              <span className="text-xl">🏪</span>
              <span className="text-sm md:text-base">Own a business?</span>
              <Link
                href="/add-listing"
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

      {/* Breadcrumbs - Mobile Responsive */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs md:text-sm overflow-x-auto">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 whitespace-nowrap">Home</Link>
            <span className="text-gray-400">/</span>
            {listing.category && (
              <>
                <Link href={`/category/${listing.category.slug}`} className="text-indigo-600 hover:text-indigo-700 whitespace-nowrap">
                  {listing.category.name}
                </Link>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-700 font-semibold truncate">{listing.business_name}</span>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Mobile: Contact Card Appears First (Only on Mobile) */}
        <div className="lg:hidden mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
            <ListingPageClient listing={listing} />
            {!isClaimed && (
              <div className="mt-6">
                <Link
                  href="/login"
                  className="block w-full bg-yellow-400 text-indigo-900 text-center px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
                >
                  🏢 Claim This Business
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Hero Image - Mobile Responsive */}
            {listing.image_url ? (
              <div className="aspect-video relative bg-gray-100 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={listing.image_url}
                  alt={listing.business_name}
                  fill
                  className="object-cover"
                />
                {listing.featured && (
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-yellow-400 text-indigo-900 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold">
                    ⭐ Featured
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 relative">
                <span className="text-6xl md:text-9xl">{listing.category?.icon_emoji || '🏢'}</span>
                {listing.featured && (
                  <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-yellow-400 text-indigo-900 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold">
                    ⭐ Featured
                  </div>
                )}
              </div>
            )}

            {/* Business Name & Badges - Mobile Responsive */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                {listing.business_name}
              </h1>
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                {listing.category && (
                  <Link
                    href={`/category/${listing.category.slug}`}
                    className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-indigo-200 transition"
                  >
                    <span>{listing.category.icon_emoji}</span>
                    <span>{listing.category.name}</span>
                  </Link>
                )}
                {listing.parish && (
                  <Link
                    href={`/parish/${listing.parish.slug}`}
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-gray-200 transition"
                  >
                    <span>📍</span>
                    <span>{listing.parish.name}</span>
                  </Link>
                )}
                {listing.verified && (
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold">
                    <span>✓</span>
                    <span>Verified</span>
                  </div>
                )}
                <ReviewStats 
                  averageRating={listing.average_rating}
                  reviewCount={listing.review_count || 0}
                />
              </div>
            </div>

            {/* Short Description - Mobile Responsive */}
            {listing.short_description && (
              <div className="bg-blue-50 border-l-4 border-indigo-600 p-4 md:p-6 rounded-r-xl mb-8">
                <p className="text-base md:text-lg text-gray-800 font-medium">
                  {listing.short_description}
                </p>
              </div>
            )}

            {/* Full Description - Mobile Responsive */}
            {listing.description && (
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">About</h2>
                <div className="prose prose-sm md:prose-lg max-w-none text-gray-600">
                  <p className="whitespace-pre-line text-sm md:text-base">{listing.description}</p>
                </div>
              </div>
            )}

            {/* Map - Mobile Responsive */}
            {(listing.latitude && listing.longitude) && (
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <div className="h-64 md:h-96">
                  <Map 
                    latitude={listing.latitude}
                    longitude={listing.longitude}
                    businessName={listing.business_name}
                  />
                </div>
                {listing.address && (
                  <p className="text-gray-600 mt-3 flex items-center gap-2 text-sm md:text-base">
                    <span>📍</span>
                    <span>{listing.address}</span>
                  </p>
                )}
              </div>
            )}

            {/* Amenities - Mobile Responsive */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                      <span className="text-indigo-600">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side (Hidden on Mobile) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <ListingPageClient listing={listing} />
              {!isClaimed && (
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="block w-full bg-yellow-400 text-indigo-900 text-center px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
                  >
                    🏢 Claim This Business
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section - Mobile Responsive */}
        <div className="mt-12 md:mt-16 border-t pt-12 md:pt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">Reviews & Ratings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Review List - Mobile: Full width, Desktop: 2/3 width */}
            <div className="lg:col-span-2">
              <ReviewList listingId={listing.id} />
            </div>

            {/* Review Form - Mobile: Full width, Desktop: 1/3 width */}
            <div className="lg:col-span-1">
              <ReviewForm listingId={listing.id} />
            </div>
          </div>
        </div>

        {/* Related Listings - Mobile Responsive */}
        {relatedListings.length > 0 && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {relatedListings.map((related) => (
                <Link
                  key={related.id}
                  href={`/listing/${related.slug}`}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group bg-white"
                >
                  {related.image_url ? (
                    <div className="aspect-video relative bg-gray-100">
                      <Image
                        src={related.image_url}
                        alt={related.business_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                      <span className="text-5xl md:text-6xl">{related.category?.icon_emoji || '🏢'}</span>
                    </div>
                  )}
                  <div className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition mb-2">
                      {related.business_name}
                    </h3>
                    {related.parish && (
                      <div className="text-xs md:text-sm text-gray-500 mb-3 flex items-center gap-1">
                        <span>📍</span>
                        <span>{related.parish.name}</span>
                      </div>
                    )}
                    {related.short_description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {related.short_description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Mobile Responsive */}
      <footer className="bg-gray-900 text-white py-8 md:py-12 mt-12 md:mt-16">
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
          </div>
        </div>
      </footer>
    </div>
  )
}