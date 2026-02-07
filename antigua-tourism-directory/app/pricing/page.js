'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function PricingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Top Stats Banner */}
      <div className="bg-indigo-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-center md:text-left">
              <span className="text-2xl">📊</span>
              <div>
                <span className="font-bold text-lg md:text-xl">1247 people</span>
                <span className="text-sm md:text-base ml-1">browsing this month</span>
              </div>
            </div>
            
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
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            List Your Business - FREE!
          </h1>
          <p className="text-xl md:text-2xl text-yellow-300 font-bold mb-3">
            No Hidden Fees. No Credit Card Required. Forever Free.
          </p>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Join 118+ businesses already listed on Antigua & Barbuda's premier business directory
          </p>
        </div>
      </section>

      {/* Pricing Cards - Yellow Background to Match Featured Section */}
      <section className="bg-gradient-to-b from-yellow-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Free Tier Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition">
              <div className="text-center mb-6">
                <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">
                  100% FREE FOREVER
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  Complete Business Profile
                </h2>
                <p className="text-3xl text-indigo-600 font-bold mb-2">
                  $0<span className="text-lg">/month</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Everything you need to showcase your business
                </p>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl flex-shrink-0">✓</div>
                  <div>
                    <h3 className="text-gray-900 font-bold">Complete Business Profile</h3>
                    <p className="text-gray-600 text-sm">Business name, category, location, and description</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl flex-shrink-0">✓</div>
                  <div>
                    <h3 className="text-gray-900 font-bold">Contact Information</h3>
                    <p className="text-gray-600 text-sm">Phone, email, and physical address</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl flex-shrink-0">✓</div>
                  <div>
                    <h3 className="text-gray-900 font-bold">Website & Social Links</h3>
                    <p className="text-gray-600 text-sm">Link to your website, Facebook, Instagram, and more</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl flex-shrink-0">✓</div>
                  <div>
                    <h3 className="text-gray-900 font-bold">Photo Gallery</h3>
                    <p className="text-gray-600 text-sm">Showcase your business with multiple photos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl flex-shrink-0">✓</div>
                  <div>
                    <h3 className="text-gray-900 font-bold">Google Maps Integration</h3>
                    <p className="text-gray-600 text-sm">Help customers find you easily</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl flex-shrink-0">✓</div>
                  <div>
                    <h3 className="text-gray-900 font-bold">Customer Reviews & Ratings</h3>
                    <p className="text-gray-600 text-sm">Build trust with verified reviews</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl flex-shrink-0">✓</div>
                  <div>
                    <h3 className="text-gray-900 font-bold">Category & Parish Listings</h3>
                    <p className="text-gray-600 text-sm">Appear in relevant search results</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-500 text-xl flex-shrink-0">✓</div>
                  <div>
                    <h3 className="text-gray-900 font-bold">Mobile-Friendly Design</h3>
                    <p className="text-gray-600 text-sm">Looks great on all devices</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link 
                  href="/add-listing"
                  className="block bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black text-lg px-8 py-4 rounded-xl transition shadow-lg"
                >
                  Add Your Business Now →
                </Link>
                <p className="text-gray-500 mt-3 text-xs">
                  No credit card required • Takes less than 5 minutes
                </p>
              </div>
            </div>

            {/* Featured Listings - Coming Soon */}
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 border-4 border-yellow-400 rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-block bg-yellow-400 text-indigo-900 px-6 py-2 rounded-full font-bold text-sm mb-4">
                  COMING SOON
                </div>
                
                <h2 className="text-3xl font-black text-white mb-3">
                  Featured Listings
                </h2>
                
                <p className="text-white/90 mb-4 text-sm">
                  Want your business to stand out with premium placement, gold borders, and top-of-page visibility?
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-4 text-center">Featured Benefits Include:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 text-xl">⭐</span>
                    <span className="text-white font-semibold text-sm">Gold border & star badge</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 text-xl">📍</span>
                    <span className="text-white font-semibold text-sm">Top of category results</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 text-xl">🏠</span>
                    <span className="text-white font-semibold text-sm">Homepage featured section</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-yellow-400 text-xl">🚀</span>
                    <span className="text-white font-semibold text-sm">Priority placement</span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-white font-bold mb-1 text-sm">
                  Expected Launch: Q2 2026
                </p>
                <p className="text-yellow-300 text-2xl font-black">
                  ~$25<span className="text-base">/month</span>
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/contact"
                  className="block bg-white hover:bg-gray-100 text-indigo-900 font-black text-lg px-8 py-4 rounded-xl transition shadow-lg"
                >
                  Join the Waitlist →
                </Link>
                
                <p className="text-white/70 mt-3 text-xs">
                  Be the first to know when Featured Listings launch
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Is it really free?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! Creating a complete business profile on AntiguaSearch.com is 100% free with no hidden costs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Do I need a credit card?
              </h3>
              <p className="text-gray-600 text-sm">
                No credit card required. Simply fill out the form and you're done!
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How long to get listed?
              </h3>
              <p className="text-gray-600 text-sm">
                Most listings are reviewed and published within 24-48 hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Can I update my listing?
              </h3>
              <p className="text-gray-600 text-sm">
                Absolutely! Claim your listing and update anytime.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                What are Featured Listings?
              </h3>
              <p className="text-gray-600 text-sm">
                Premium placement with gold borders, star badges, and top visibility. Coming Q2 2026!
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Will my listing stay free?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! Your basic listing will always remain free. Featured is optional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
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
                  <div className="font-bold">Antigua Search</div>
                  <div className="text-sm text-gray-400">Directory</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Your complete guide to Antigua & Barbuda
              </p>
            </div>
            <div>
              <h6 className="font-bold mb-4">Quick Links</h6>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-gray-400 hover:text-white">Home</Link>
                <Link href="/parishes" className="block text-gray-400 hover:text-white">Browse Parishes</Link>
                <Link href="/categories" className="block text-gray-400 hover:text-white">Categories</Link>
                <Link href="/about" className="block text-gray-400 hover:text-white">About</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4">For Business</h6>
              <div className="space-y-2 text-sm">
                <Link href="/add-listing" className="block text-gray-400 hover:text-white">List Your Business</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4">Contact</h6>
              <p className="text-gray-400 text-sm">contact@antiguasearch.com</p>
              <p className="text-gray-400 text-sm">St. John's, Antigua</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2026 Antigua Search. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}