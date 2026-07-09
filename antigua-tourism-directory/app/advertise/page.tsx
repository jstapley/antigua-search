import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 300

export const metadata = {
  title: 'Advertise With Us | AntiguaSearch.com',
  description: 'Reach thousands of tourists and locals searching for businesses in Antigua & Barbuda. Advertise your business on the premier directory platform.',
  keywords: 'advertise antigua, business advertising antigua, tourism advertising, antigua marketing, business promotion'
}

async function getBusinessCount() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/business-count`, {
      next: { revalidate: 300 }
    })
    const data = await res.json()
    return data.display ?? '236'
  } catch {
    return '236'
  }
}

export default async function AdvertisePage() {
  const businessCount = await getBusinessCount()

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">Advertise Your Business</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-6">Reach Thousands of Potential Customers</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Connect with tourists and locals actively searching for businesses like yours in Antigua & Barbuda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="bg-yellow-400 text-brand-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition shadow-lg">
              View All Pricing Plans →
            </Link>
            <Link href="/contact?subject=Sponsored%20Ads%20Inquiry" className="bg-white/20 text-white px-10 py-4 rounded-xl font-bold text-lg border-2 border-white/50 hover:bg-white/30 transition">
              Enquire About Ads
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border-2 border-brand-100">
              <div className="text-5xl font-extrabold text-brand-600 mb-2">2,000+</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">Monthly Visitors</div>
              <div className="text-gray-600">Actively searching for businesses</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border-2 border-brand-100">
              <div className="text-5xl font-extrabold text-brand-600 mb-2">{businessCount}</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">Business Listings</div>
              <div className="text-gray-600">Across all categories & parishes</div>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border-2 border-brand-100">
              <div className="text-5xl font-extrabold text-brand-600 mb-2">12</div>
              <div className="text-xl font-semibold text-gray-900 mb-2">Categories</div>
              <div className="text-gray-600">From hotels to restaurants to tours</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — same three tiers as /pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the option that suits your business</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Free */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 border-4 border-green-400 rounded-2xl p-8 shadow-lg flex flex-col">
              <div className="text-center mb-6">
                <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">100% FREE FOREVER</div>
                <h3 className="text-2xl font-black text-white mb-3">Free Listing</h3>
                <p className="text-3xl text-white font-bold mb-2">EC$0<span className="text-lg">/year</span></p>
                <p className="text-white/90 text-sm">Everything you need to get found online</p>
              </div>
              <div className="space-y-3 mb-8 flex-1">
                {[
                  'Complete Business Profile',
                  'Contact Information',
                  'Website & Social Links',
                  'Claim & Manage Your Listing',
                  'Customer Reviews & Ratings',
                  'Mobile-Friendly Design'
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="text-green-400 text-xl flex-shrink-0">✓</span>
                    <span className="text-white font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/add-listing" className="block bg-yellow-400 hover:bg-yellow-300 text-brand-900 font-black text-lg px-8 py-4 rounded-xl transition shadow-lg text-center">
                Add Your Business Free →
              </Link>
              <p className="text-white/70 mt-3 text-xs text-center">No credit card required</p>
            </div>

            {/* Featured */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 border-4 border-yellow-400 rounded-2xl p-8 shadow-lg flex flex-col">
              <div className="text-center mb-6">
                <div className="inline-block bg-yellow-400 text-brand-900 px-6 py-2 rounded-full font-bold text-sm mb-4">FEATURED LISTING</div>
                <h3 className="text-2xl font-black text-white mb-3">Premium Placement</h3>
                <p className="text-3xl text-white font-bold mb-2">EC$300<span className="text-lg">/year</span></p>
                <p className="text-white/90 text-sm mb-1">Less than EC$1 per day</p>
                <p className="text-white/80 text-sm">Stand out from the competition</p>
              </div>
              <div className="space-y-3 mb-8 flex-1">
                <p className="text-white font-bold text-sm text-center mb-2">Everything in Free, plus:</p>
                {[
                  'Gold border & star badge',
                  'Top of category results',
                  'Homepage featured section',
                  'Priority in all search results',
                  'Annual renewal reminder'
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="text-yellow-400 text-xl flex-shrink-0">⭐</span>
                    <span className="text-white font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/login" className="block bg-yellow-400 hover:bg-yellow-300 text-brand-900 font-black text-lg px-8 py-4 rounded-xl transition shadow-lg text-center">
                Get Featured Now →
              </Link>
              <p className="text-white/70 mt-3 text-xs text-center">Login to upgrade • Secure payment via Stripe</p>
            </div>

            {/* Business Spotlight — Sponsored Ads */}
            <div className="bg-white border-4 border-brand-200 rounded-2xl p-8 shadow-lg flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-brand-600 text-white text-center py-2 text-xs font-bold tracking-wide">
                NOW AVAILABLE
              </div>
              <div className="text-center mb-6 mt-6">
                <div className="inline-block bg-brand-600 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">SPONSORED ADS</div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">Business Spotlight</h3>
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
                    <span className="text-brand-600 text-xl flex-shrink-0">✓</span>
                    <div>
                      <p className="text-gray-900 font-bold text-sm">{title}</p>
                      <p className="text-gray-500 text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/contact?subject=Sponsored%20Ads%20Inquiry" className="block bg-brand-600 hover:bg-brand-700 text-white font-black text-lg px-8 py-4 rounded-xl transition shadow-lg text-center">
                Contact for Pricing →
              </Link>
              <p className="text-gray-400 mt-3 text-xs text-center">Get in touch to discuss your campaign goals</p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Advertise */}
      <section className="py-20 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why Advertise on AntiguaSearch.com?</h2>
            <p className="text-xl text-gray-600">The premier platform for reaching tourists and locals in Antigua & Barbuda</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              ['🎯', 'Targeted Audience', 'Reach customers actively searching for businesses in your category and location'],
              ['📈', 'Growing Traffic', 'Our visitor count grows monthly as we become the go-to directory for Antigua'],
              ['💰', 'Affordable Pricing', 'Get premium visibility for less than EC$1 per day with an annual featured listing'],
              ['🌴', 'Tourism Focused', 'Perfect for hotels, restaurants, tours, and any business targeting visitors'],
              ['📱', 'Mobile Optimized', 'Your listing looks great on all devices — desktop, tablet, and mobile'],
              ['⚡', 'Quick Setup', 'Get your featured listing live in minutes — no complicated setup required']
            ].map(([emoji, title, desc]) => (
              <div key={title} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-5xl mb-4">{emoji}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-700 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl text-white/90 mb-8">Join {businessCount} businesses already listed on AntiguaSearch.com</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing" className="bg-yellow-400 hover:bg-yellow-300 text-brand-900 px-12 py-5 rounded-xl font-black text-xl transition shadow-2xl">
              See All Pricing Plans →
            </Link>
            <Link href="/contact?subject=Sponsored%20Ads%20Inquiry" className="bg-white/20 hover:bg-white/30 text-white px-12 py-5 rounded-xl font-black text-xl border-2 border-white transition">
              Enquire About Ads
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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