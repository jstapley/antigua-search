// app/pricing/page.js
import Link from 'next/link'

export const metadata = {
  title: 'Pricing - Free Business Listings | AntiguaSearch.com',
  description: 'List your business on AntiguaSearch.com completely FREE. Get a complete business profile with photos, social links, and contact information at no cost.',
  keywords: 'free business listing antigua, list business antigua, antigua business directory pricing, free advertising antigua'
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-600">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
          List Your Business - FREE!
        </h1>
        <p className="text-2xl md:text-3xl text-yellow-300 font-bold mb-4">
          No Hidden Fees. No Credit Card Required. Forever Free.
        </p>
        <p className="text-xl text-white/90 max-w-3xl mx-auto">
          Join 100+ businesses already listed on Antigua & Barbuda's premier business directory
        </p>
      </div>

      {/* Main Pricing Card */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Free Tier Card */}
          <div className="bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-8 md:p-12 mb-12">
            <div className="text-center mb-8">
              <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold text-lg mb-4">
                100% FREE FOREVER
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Complete Business Profile
              </h2>
              <p className="text-2xl text-yellow-300 font-bold mb-2">
                $0 / month
              </p>
              <p className="text-white/80">
                Everything you need to showcase your business
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="text-green-400 text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-white font-bold text-lg">Complete Business Profile</h3>
                  <p className="text-white/70">Business name, category, location, and description</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-green-400 text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-white font-bold text-lg">Contact Information</h3>
                  <p className="text-white/70">Phone, email, and physical address</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-green-400 text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-white font-bold text-lg">Website & Social Links</h3>
                  <p className="text-white/70">Link to your website, Facebook, Instagram, and more</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-green-400 text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-white font-bold text-lg">Photo Gallery</h3>
                  <p className="text-white/70">Showcase your business with multiple photos</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-green-400 text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-white font-bold text-lg">Google Maps Integration</h3>
                  <p className="text-white/70">Help customers find you easily</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-green-400 text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-white font-bold text-lg">Customer Reviews & Ratings</h3>
                  <p className="text-white/70">Build trust with verified reviews</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-green-400 text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-white font-bold text-lg">Category & Parish Listings</h3>
                  <p className="text-white/70">Appear in relevant search results</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="text-green-400 text-2xl flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-white font-bold text-lg">Mobile-Friendly Design</h3>
                  <p className="text-white/70">Looks great on all devices</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Link 
                href="/add-listing"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black text-xl px-12 py-5 rounded-full transition-all transform hover:scale-105 shadow-2xl"
              >
                Add Your Business Now →
              </Link>
              <p className="text-white/60 mt-4 text-sm">
                No credit card required • Takes less than 5 minutes
              </p>
            </div>
          </div>

          {/* Coming Soon - Featured Listings */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-8 md:p-12 text-center">
            <div className="inline-block bg-indigo-900 text-white px-6 py-2 rounded-full font-bold text-sm mb-6">
              COMING SOON
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-indigo-900 mb-4">
              Featured Listings
            </h2>
            
            <p className="text-xl text-indigo-900/80 mb-6 max-w-2xl mx-auto">
              Want your business to stand out with premium placement, gold borders, and top-of-page visibility?
            </p>

            <div className="bg-white/30 backdrop-blur rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-indigo-900 mb-4">Featured Benefits Include:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-900 text-xl">⭐</span>
                  <span className="text-indigo-900 font-semibold">Gold border & star badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-900 text-xl">📍</span>
                  <span className="text-indigo-900 font-semibold">Top of category results</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-900 text-xl">🏠</span>
                  <span className="text-indigo-900 font-semibold">Homepage featured section</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-900 text-xl">🚀</span>
                  <span className="text-indigo-900 font-semibold">Priority placement</span>
                </div>
              </div>
            </div>

            <p className="text-lg text-indigo-900 font-bold mb-6">
              Expected Launch: Q2 2026 • Pricing: ~$25/month
            </p>

            <Link
              href="/contact"
              className="inline-block bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xl px-10 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl"
            >
              Join the Waitlist →
            </Link>
            
            <p className="text-indigo-900/70 mt-4 text-sm">
              Be the first to know when Featured Listings launch
            </p>
          </div>

        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Is it really free?
              </h3>
              <p className="text-white/80">
                Yes! Creating a complete business profile on AntiguaSearch.com is 100% free with no hidden costs. We believe every business in Antigua & Barbuda deserves to be discovered.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Do I need a credit card to sign up?
              </h3>
              <p className="text-white/80">
                No credit card required. Simply fill out the business listing form and you're done!
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                How long does it take to get listed?
              </h3>
              <p className="text-white/80">
                Most listings are reviewed and published within 24-48 hours. You'll receive an email notification when your listing goes live.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Can I update my listing later?
              </h3>
              <p className="text-white/80">
                Absolutely! You can claim your listing and update your business information, photos, and details anytime.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                What are Featured Listings?
              </h3>
              <p className="text-white/80">
                Featured Listings (coming soon) will give your business premium placement with gold borders, star badges, and top-of-page visibility. Perfect for businesses that want maximum exposure. Join the waitlist to be notified when this launches!
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Will my free listing stay free?
              </h3>
              <p className="text-white/80">
                Yes! Your basic listing will always remain free. Featured placement will be optional for businesses that want extra visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto text-center bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join 100+ businesses already listed on AntiguaSearch.com
          </p>
          <Link
            href="/add-listing"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black text-2xl px-16 py-6 rounded-full transition-all transform hover:scale-105 shadow-2xl"
          >
            List Your Business Free →
          </Link>
        </div>
      </div>
    </div>
  )
}