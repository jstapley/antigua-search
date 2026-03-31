'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ParishPageClient({ parish, listings, categories, totalCount, totalPages, currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Top Stats Banner */}
      <div className="bg-brand-600 text-white py-3 px-4">
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
              <Link href="/add-listing" className="text-yellow-300 font-semibold underline hover:text-yellow-200 text-sm md:text-base whitespace-nowrap">
                Get premium visibility
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/antigua-flag.png" alt="Antigua Flag" width={50} height={50} className="rounded-full" />
              <div>
                <div className="text-lg md:text-xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
                <div className="text-xs md:text-sm text-brand-600 font-semibold">ANTIGUA SEARCH</div>
              </div>
            </Link>

            <nav className="hidden lg:flex gap-6 items-center">
              <Link href="/" className="text-gray-700 hover:text-brand-600 font-medium">Home</Link>
              <Link href="/parishes" className="text-gray-700 hover:text-brand-600 font-medium">Browse Parishes</Link>
              <Link href="/categories" className="text-gray-700 hover:text-brand-600 font-medium">Categories</Link>
              <Link href="/about" className="text-gray-700 hover:text-brand-600 font-medium">About Us</Link>
              <Link href="/blog" className="text-gray-700 hover:text-brand-600 font-medium">Blog</Link>
              <Link href="/contact" className="text-gray-700 hover:text-brand-600 font-medium">Contact</Link>
              <Link href="/login" className="text-gray-700 hover:text-brand-600 font-medium">Login</Link>
              <Link href="/add-listing" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition">
                + Add Your Business
              </Link>
            </nav>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-gray-700 p-2" aria-label="Toggle menu">
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3">
              <Link href="/" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/parishes" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Browse Parishes</Link>
              <Link href="/categories" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link href="/about" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link href="/blog" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/contact" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link href="/login" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/add-listing" className="block bg-brand-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-brand-700 transition text-center" onClick={() => setMobileMenuOpen(false)}>
                + Add Your Business
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs md:text-sm overflow-x-auto">
            <Link href="/" className="text-brand-600 hover:text-brand-700 whitespace-nowrap">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/parishes" className="text-brand-600 hover:text-brand-700 whitespace-nowrap">Parishes</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-semibold truncate">{parish.name}</span>
          </div>
        </div>
      </div>

      {/* Parish Header */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-600 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl md:text-5xl">📍</span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">{parish.name}</h1>
          </div>
          <p className="text-base md:text-xl text-white/90 mb-6 max-w-3xl">{parish.description}</p>
          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 md:px-6 py-2 md:py-3 border border-white/20">
              <span className="text-2xl md:text-3xl font-bold text-yellow-300">{totalCount}</span>
              <span className="text-white ml-2 text-sm md:text-base">Businesses</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 md:px-6 py-2 md:py-3 border border-white/20">
              <span className="text-2xl md:text-3xl font-bold text-yellow-300">{categories.length}</span>
              <span className="text-white ml-2 text-sm md:text-base">Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <section className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-start md:items-center gap-3 flex-wrap">
              <span className="text-gray-700 font-semibold text-sm md:text-base whitespace-nowrap">Filter by:</span>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-brand-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium text-gray-700 hover:text-brand-700 transition"
                >
                  <span>{category.icon_emoji}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {listings.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="text-5xl md:text-6xl mb-4">🏝️</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No listings yet in {parish.name}</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base px-4">Be the first business to get listed in this parish!</p>
            <Link href="/add-listing" className="inline-block bg-brand-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-brand-700 transition text-sm md:text-base">
              Add Your Business
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Businesses in {parish.name}
              </h2>
              <p className="text-gray-500 text-sm">
                Showing {((currentPage - 1) * 24) + 1}–{Math.min(currentPage * 24, totalCount)} of {totalCount}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.slug}`}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:border-brand-400 transition-all duration-300 group bg-white"
                >
                  {listing.image_url ? (
                    <div className="aspect-video relative bg-gray-100">
                      <Image src={listing.image_url} alt={listing.business_name} fill className="object-cover" />
                      {listing.featured && (
                        <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-yellow-400 text-brand-900 px-2 md:px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-brand-100 to-blue-100 flex items-center justify-center relative">
                      <span className="text-5xl md:text-6xl">{listing.category?.icon_emoji || '🏢'}</span>
                      {listing.featured && (
                        <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-yellow-400 text-brand-900 px-2 md:px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-brand-600 transition flex-1">
                        {listing.business_name}
                      </h3>
                      {listing.category && (
                        <span className="text-xl md:text-2xl ml-2">{listing.category.icon_emoji}</span>
                      )}
                    </div>
                    {listing.category && (
                      <div className="text-xs md:text-sm text-brand-600 font-semibold mb-3">
                        {listing.category.name}
                      </div>
                    )}
                    {listing.short_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.short_description}</p>
                    )}
                    <div className="flex items-center justify-between gap-2">
                      {listing.address && (
                        <div className="text-gray-500 text-xs md:text-sm flex items-center gap-1 flex-1 min-w-0">
                          <span>📍</span>
                          <span className="truncate">{listing.address}</span>
                        </div>
                      )}
                      <div className="text-brand-600 font-semibold text-xs md:text-sm group-hover:translate-x-1 transition-transform whitespace-nowrap">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination — using Link tags for SEO crawlability */}
            {totalPages > 1 && (
              <div className="mt-10 md:mt-12 flex items-center justify-center gap-2 flex-wrap">
                {currentPage > 1 ? (
                  <Link
                    href={`/parish/${parish.slug}?page=${currentPage - 1}`}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-brand-600 hover:text-brand-600 transition"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-300 font-semibold cursor-not-allowed opacity-40">
                    ← Previous
                  </span>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                  .reduce((acc, page, idx, arr) => {
                    if (idx > 0 && page - arr[idx - 1] > 1) acc.push('...')
                    acc.push(page)
                    return acc
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <Link
                        key={item}
                        href={`/parish/${parish.slug}?page=${item}`}
                        className={`w-10 h-10 rounded-lg font-semibold transition flex items-center justify-center ${
                          currentPage === item
                            ? 'bg-brand-600 text-white'
                            : 'border-2 border-gray-200 text-gray-700 hover:border-brand-600 hover:text-brand-600'
                        }`}
                      >
                        {item}
                      </Link>
                    )
                  )}

                {currentPage < totalPages ? (
                  <Link
                    href={`/parish/${parish.slug}?page=${currentPage + 1}`}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:border-brand-600 hover:text-brand-600 transition"
                  >
                    Next →
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-300 font-semibold cursor-not-allowed opacity-40">
                    Next →
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 px-4">
            Own a business in {parish.name}?
          </h3>
          <p className="text-gray-600 mb-6 text-base md:text-lg px-4">
            Get your business listed and reach thousands of visitors exploring Antigua & Barbuda
          </p>
          <Link href="/add-listing" className="inline-block bg-brand-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-brand-700 transition shadow-lg">
            List Your Business - It&apos;s Free! →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/antigua-flag.png" alt="Antigua Flag" width={40} height={40} className="rounded-full" />
                <div>
                  <div className="font-bold text-base md:text-lg">Antigua Search</div>
                  <div className="text-xs md:text-sm text-gray-400">Directory</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Your complete guide to experiencing the best of Antigua & Barbuda</p>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-base md:text-lg">Quick Links</h6>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-gray-400 hover:text-white transition">Home</Link>
                <Link href="/parishes" className="block text-gray-400 hover:text-white transition">Browse Parishes</Link>
                <Link href="/categories" className="block text-gray-400 hover:text-white transition">All Categories</Link>
                <Link href="/about" className="block text-gray-400 hover:text-white transition">About Us</Link>
                <Link href="/blog" className="text-gray-700 hover:text-brand-600 font-medium">Blog</Link>
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
              <p className="text-gray-400 text-sm mb-2">jeff@stapleyinc.com</p>
              <p className="text-gray-400 text-sm">St. John&apos;s, Antigua & Barbuda</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 md:pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2026 Antigua Search. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}