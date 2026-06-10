'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function PricingClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [businessCount, setBusinessCount] = useState('200+')

  useEffect(() => {
    fetch('/api/business-count')
      .then(res => res.json())
      .then(data => {
        if (data.display) setBusinessCount(data.display)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-center md:text-left">
              <span className="text-2xl">📊</span>
              <div>
                <span className="font-bold text-lg md:text-xl">2000+ visitors</span>
                <span className="text-sm md:text-base ml-1">each month</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-center">
              <span className="text-xl">🏪</span>
              <span className="text-sm md:text-base">Own a business?</span>
              <Link href="/pricing" className="text-yellow-300 font-semibold underline hover:text-yellow-200 text-sm md:text-base whitespace-nowrap">
                Add Your Business Free
              </Link>
            </div>
          </div>
        </div>
      </div>

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
              <Link href="/contact" className="text-gray-700 hover:text-brand-600 font-medium">Contact</Link>
              <Link href="/login" className="text-gray-700 hover:text-brand-600 font-medium">Login</Link>
              <Link href="/add-listing" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition">+ Add Your Business</Link>
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
              <Link href="/contact" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link href="/login" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/add-listing" className="block bg-brand-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-brand-700 transition text-center" onClick={() => setMobileMenuOpen(false)}>+ Add Your Business</Link>
            </nav>
          )}
        </div>
      </header>

      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl md:text-2xl text-yellow-300 font-bold mb-3">List for Free. Upgrade When You're Ready.</p>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Join {businessCount} businesses already listed on Antigua & Barbuda's premier business directory
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-yellow-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">

            {/* Free Plan */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 border-4 border-green-400 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition flex flex-col">
              <div className="text-center mb-6">
                <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">100% FREE FOREVER</div>
                <h2 className="text-2xl font-black text-white mb-3">Free Listing</h2>
                <p className="text-3xl text-white font-bold mb-2">EC$0<span className="text-lg">/year</span></p>
                <p className="text-white/90 text-sm">Everything you need to get found online</p>
              </div>
              <div className="space-y-3 mb-8 flex-1">
                {[
                  ['Complete Business Profile', 'Business name, category, location, and description'],
                  ['Contact Information', 'Phone, email, and physical address'],
                  ['Website & Social Links', 'Link to your website, Facebook, Instagram, and more'],
                  ['Claim & Manage Your Listing', 'Take ownership and keep your info up to date'],
                  ['Customer Reviews & Ratings', 'Build trust with verified customer reviews'],
                  ['Mobile-Friendly Design', 'Looks great on all devices']
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="text-green-400 text-xl flex-shrink-0">✓</div>
                    <div><p className="text-white font-bold text-sm">{title}</p><p className="text-white/80 text-xs">{desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link href="/add-listing" className="block bg-yellow-400 hover:bg-yellow-300 text-brand-900 font-black text-lg px-8 py-4 rounded-xl transition shadow-lg">Add Your Business Free →</Link>
                <p className="text-white/70 mt-3 text-xs">No credit card required • Takes less than 5 minutes</p>
              </div>
            </div>

            {/* Featured Plan */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 border-4 border-yellow-400 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition relative overflow-hidden flex flex-col">
              <div className="text-center mb-6">
                <div className="inline-block bg-yellow-400 text-brand-900 px-6 py-2 rounded-full font-bold text-sm mb-4">FEATURED LISTING</div>
                <h2 className="text-2xl font-black text-white mb-3">Premium Placement</h2>
                <p className="text-3xl text-white font-bold mb-2">EC$300<span className="text-lg">/year</span></p>
                <p className="text-white/90 text-sm mb-1">Less than EC$1 per day</p>
                <p className="text-white/80 text-sm">Stand out from the competition</p>
              </div>
              <div className="space-y-3 mb-8 flex-1">
                <p className="text-white font-bold text-sm text-center mb-2">Everything in Free, plus:</p>
                {[
                  ['Gold border & star badge', 'Stand out with premium styling across the directory'],
                  ['Top of category results', 'Appear first when customers browse your category'],
                  ['Homepage featured section', 'Maximum visibility — seen by every visitor'],
                  ['Priority in all search results', 'Always listed first across the directory'],
                  ['Annual renewal reminder', "We'll remind you before your listing expires"]
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="text-yellow-400 text-xl flex-shrink-0">⭐</div>
                    <div><p className="text-white font-bold text-sm">{title}</p><p className="text-white/80 text-xs">{desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link href="/login" className="block bg-yellow-400 hover:bg-yellow-300 text-brand-900 font-black text-lg px-8 py-4 rounded-xl transition shadow-lg">
                  Get Featured Now →
                </Link>
                <p className="text-white/70 mt-3 text-xs">Login to your listing to upgrade • Secure payment via Stripe</p>
              </div>
            </div>

            {/* Business Spotlight — Sponsored Ads */}
            <div className="bg-white border-4 border-brand-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-brand-600 text-white text-center py-2 text-xs font-bold tracking-wide">
                NOW AVAILABLE
              </div>
              <div className="text-center mb-6 mt-6">
                <div className="inline-block bg-brand-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">SPONSORED ADS</div>
                <h2 className="text-2xl font-black text-gray-900 mb-3">Business Spotlight</h2>
                <p className="text-3xl text-brand-600 font-bold mb-1">From EC$150<span className="text-lg">/month</span></p>
                <p className="text-gray-500 text-sm mb-1">Flexible weekly, monthly, or seasonal</p>
                <p className="text-gray-500 text-sm">Target customers actively browsing Antigua businesses</p>
              </div>
              <div className="space-y-3 mb-8 flex-1">
                <p className="text-gray-700 font-bold text-sm text-center mb-3">What's included:</p>
                {[
                  ['Homepage banner placement', 'Maximum exposure to every visitor on the site'],
                  ['Category page ads', 'Target customers browsing your specific niche'],
                  ['Parish page placement', 'Reach customers searching in your area'],
                  ['Custom ad design assistance', 'We help you create effective ads'],
                  ['Performance analytics', 'Track impressions, clicks, and conversions'],
                  ['Flexible campaign durations', 'Weekly, monthly, or seasonal campaigns']
                ].map(([title, desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="text-brand-600 text-xl flex-shrink-0">✓</div>
                    <div><p className="text-gray-900 font-bold text-sm">{title}</p><p className="text-gray-500 text-xs">{desc}</p></div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/contact?subject=Sponsored%20Ads%20Inquiry"
                  className="block bg-brand-600 hover:bg-brand-700 text-white font-black text-lg px-8 py-4 rounded-xl transition shadow-lg"
                >
                  Contact for Pricing →
                </Link>
                <p className="text-gray-400 mt-3 text-xs">Get in touch to discuss your campaign goals</p>
              </div>
            </div>

          </div>

          {/* How it works */}
          <div className="mt-12 bg-white rounded-2xl border-2 border-gray-200 p-8">
            <h2 className="text-2xl font-black text-gray-900 text-center mb-6">How to Get Featured</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl mb-3">1️⃣</div>
                <h3 className="font-bold text-gray-900 mb-2">Login or Register</h3>
                <p className="text-gray-600 text-sm">Log in to your account and find your business listing</p>
              </div>
              <div>
                <div className="text-4xl mb-3">2️⃣</div>
                <h3 className="font-bold text-gray-900 mb-2">Click Upgrade</h3>
                <p className="text-gray-600 text-sm">Click the "Upgrade to Featured" button on your listing page</p>
              </div>
              <div>
                <div className="text-4xl mb-3">3️⃣</div>
                <h3 className="font-bold text-gray-900 mb-2">Go Live Instantly</h3>
                <p className="text-gray-600 text-sm">Pay securely via Stripe and your featured badge appears immediately</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              ['Is the basic listing really free?', 'Yes — creating a complete business profile on AntiguaSearch.com is 100% free with no hidden costs, forever.'],
              ['How much is a Featured Listing?', 'EC$300 per year — less than EC$1 per day for premium placement across the entire directory.'],
              ['How long does featured status last?', "Your featured listing is active for one full year from the date of payment. We'll remind you 30 days before it expires."],
              ['Can I upgrade my existing listing?', 'Yes. Log in, visit your listing page, and click the "Upgrade to Featured" button to pay and upgrade instantly.'],
              ['What payment methods are accepted?', 'We accept all major credit and debit cards via Stripe, a secure international payment processor.'],
              ['What happens when it expires?', "Your listing stays active — it just reverts to a standard free listing. We'll email you a renewal link before expiry."]
            ].map(([q, a]) => (
              <div key={q} className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-600 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/antigua-flag.png" alt="Antigua Flag" width={40} height={40} className="rounded-full" />
                <div><div className="font-bold">Antigua Search</div><div className="text-sm text-gray-400">Directory</div></div>
              </div>
              <p className="text-gray-400 text-sm">Your complete guide to Antigua & Barbuda</p>
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
                <Link href="/advertise" className="block text-gray-400 hover:text-white">Advertise With Us</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4">Contact</h6>
              <p className="text-gray-400 text-sm">jeff@stapleyinc.com</p>
              <p className="text-gray-400 text-sm">St. John&apos;s, Antigua</p>
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