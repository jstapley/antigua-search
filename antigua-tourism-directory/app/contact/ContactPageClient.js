'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ContactForm from '@/components/ContactForm'

export default function ContactPageClient({ defaultSubject = '' }) {
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
              <Link
                href="/advertise"
                className="text-yellow-300 font-semibold underline hover:text-yellow-200 text-sm md:text-base whitespace-nowrap"
              >
                Advertise Your Business
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
              <Link href="/contact" className="text-brand-600 font-bold">Contact</Link>
              <Link href="/login" className="text-gray-700 hover:text-brand-600 font-medium">Login</Link>
              <Link href="/add-listing" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition">
                + Add Your Business
              </Link>
            </nav>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-gray-700 p-2" aria-label="Toggle menu">
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
              <Link href="/" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/parishes" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Browse Parishes</Link>
              <Link href="/categories" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link href="/about" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link href="/blog" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/contact" className="block text-brand-600 font-bold py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link href="/login" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/add-listing" className="block bg-brand-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-brand-700 transition text-center" onClick={() => setMobileMenuOpen(false)}>+ Add Your Business</Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-600 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto px-4">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-brand-100 p-3 rounded-lg flex-shrink-0"><span className="text-2xl">✉️</span></div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">Email Us</h3>
                  <a href="mailto:jeff@stapleyinc.com" className="text-brand-600 hover:text-brand-700 text-sm md:text-base break-all">jeff@stapleyinc.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-brand-100 p-3 rounded-lg flex-shrink-0"><span className="text-2xl">📍</span></div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">Location</h3>
                  <p className="text-gray-600 text-sm md:text-base">St. John&apos;s<br />Antigua & Barbuda</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-brand-100 p-3 rounded-lg flex-shrink-0"><span className="text-2xl">🕐</span></div>
                <div className="w-full">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm md:text-base">Business Hours</h3>
                  <div className="space-y-2 text-xs md:text-sm">
                    {[['Sunday', 'Closed'], ['Monday', '9:00 AM - 5:00 PM'], ['Tuesday', '9:00 AM - 5:00 PM'], ['Wednesday', '9:00 AM - 5:00 PM'], ['Thursday', '9:00 AM - 5:00 PM'], ['Friday', '9:00 AM - 5:00 PM'], ['Saturday', 'Closed']].map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600 font-medium">{day}:</span>
                        <span className="text-gray-900">{hours}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">AST (Atlantic Standard Time)</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 md:p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-sm md:text-base">Quick Links</h3>
              <div className="space-y-2 text-sm md:text-base">
                <Link href="/add-listing" className="block text-brand-600 hover:text-brand-700">→ List Your Business</Link>
                <Link href="/advertise" className="block text-brand-600 hover:text-brand-700">→ Advertise With Us</Link>
                <Link href="/about" className="block text-brand-600 hover:text-brand-700">→ About Us</Link>
                <Link href="/parishes" className="block text-brand-600 hover:text-brand-700">→ Browse Parishes</Link>
                <Link href="/categories" className="block text-brand-600 hover:text-brand-700">→ All Categories</Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <ContactForm defaultSubject={defaultSubject} />
          </div>
        </div>

        <div className="mt-12 md:mt-16 pt-12 md:pt-16 border-t border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">How do I list my business?</h3>
              <p className="text-gray-600 text-sm md:text-base">Click the &quot;Add Your Business&quot; button in the header or visit our <Link href="/add-listing" className="text-brand-600 hover:text-brand-700 font-semibold">Add Listing</Link> page.</p>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Is listing my business free?</h3>
              <p className="text-gray-600 text-sm md:text-base">Yes! Basic listings are completely free. We also offer premium features for enhanced visibility.</p>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">How long does approval take?</h3>
              <p className="text-gray-600 text-sm md:text-base">Most listings are reviewed and approved within 24-48 hours. You&apos;ll receive an email notification once your listing is live.</p>
            </div>
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">Can I edit my listing?</h3>
              <p className="text-gray-600 text-sm md:text-base">Yes! Log in to your account and visit your dashboard to edit your business information at any time.</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 md:py-12 mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
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
              <h6 className="font-bold mb-4 text-base md:text-lg">Websites</h6>
              <div className="space-y-2 text-sm">
                <a href="https://www.antiguasearch.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition">AntiguaSearch.com</a>
                <a href="https://www.grenadasearch.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition">GrenadaSearch.com</a>
                <a href="https://www.stapleyinc.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition">StapleyInc.com</a>
                <a href="https://www.antiguamarinesolutions.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition">AntiguaMarineSolutions.com</a>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-base md:text-lg">Contact</h6>
              <p className="text-gray-400 text-sm mb-2">jeff@stapleyinc.com</p>
              <p className="text-gray-400 text-sm">St. John&apos;s, Antigua & Barbuda</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 md:pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2026 AntiguaSearch.com. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
