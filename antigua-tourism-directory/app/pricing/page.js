// app/pricing/page.js
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Pricing - Free Business Listings | AntiguaSearch.com',
  description: 'List your business on AntiguaSearch.com completely FREE. Get a complete business profile with photos, social links, and contact information at no cost.',
  keywords: 'free business listing antigua, list business antigua, antigua business directory pricing, free advertising antigua'
}

export default function PricingPage() {
  return (
    <>
      {/* Standard Navigation */}
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-600 pt-24">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            List Your Business - FREE!
          </h1>
          <p className="text-xl md:text-2xl text-yellow-300 font-bold mb-3">
            No Hidden Fees. No Credit Card Required. Forever Free.
          </p>
          <p className="text-lg text-white/90 max-w-3xl mx-auto">
            Join 100+ businesses already listed on Antigua & Barbuda's premier business directory
          </p>
        </div>

        {/* Main Pricing Cards - Side by Side */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Free Tier Card */}
              <div className="bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm mb-4">
                    100% FREE FOREVER
                  </div>
                  <h2 className="text-3xl font-black text-white mb-3">
                    Complete Business Profile
                  </h2>
                  <p className="text-3xl text-yellow-300 font-bold mb-2">
                    $0<span className="text-lg">/month</span>
                  </p>
                  <p className="text-white/80 text-sm">
                    Everything you need to showcase your business
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="text-green-400 text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="text-white font-bold">Complete Business Profile</h3>
                      <p className="text-white/70 text-sm">Business name, category, location, and description</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-green-400 text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="text-white font-bold">Contact Information</h3>
                      <p className="text-white/70 text-sm">Phone, email, and physical address</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-green-400 text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="text-white font-bold">Website & Social Links</h3>
                      <p className="text-white/70 text-sm">Link to your website, Facebook, Instagram, and more</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-green-400 text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="text-white font-bold">Photo Gallery</h3>
                      <p className="text-white/70 text-sm">Showcase your business with multiple photos</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-green-400 text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="text-white font-bold">Google Maps Integration</h3>
                      <p className="text-white/70 text-sm">Help customers find you easily</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-green-400 text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="text-white font-bold">Customer Reviews & Ratings</h3>
                      <p className="text-white/70 text-sm">Build trust with verified reviews</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-green-400 text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="text-white font-bold">Category & Parish Listings</h3>
                      <p className="text-white/70 text-sm">Appear in relevant search results</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-green-400 text-xl flex-shrink-0">✓</div>
                    <div>
                      <h3 className="text-white font-bold">Mobile-Friendly Design</h3>
                      <p className="text-white/70 text-sm">Looks great on all devices</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Link 
                    href="/add-listing"
                    className="block bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black text-lg px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl"
                  >
                    Add Your Business Now →
                  </Link>
                  <p className="text-white/60 mt-3 text-xs">
                    No credit card required • Takes less than 5 minutes
                  </p>
                </div>
              </div>

              {/* Featured Listings - Coming Soon */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 border-2 border-indigo-400/50 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <div className="inline-block bg-yellow-400 text-indigo-900 px-6 py-2 rounded-full font-bold text-sm mb-4">
                    COMING SOON
                  </div>
                  
                  <h2 className="text-3xl font-black text-white mb-3">
                    Featured Listings
                  </h2>
                  
                  <p className="text-white/90 mb-4">
                    Want your business to stand out with premium placement, gold borders, and top-of-page visibility?
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">Featured Benefits Include:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 text-xl">⭐</span>
                      <span className="text-white font-semibold">Gold border & star badge</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 text-xl">📍</span>
                      <span className="text-white font-semibold">Top of category results</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 text-xl">🏠</span>
                      <span className="text-white font-semibold">Homepage featured section</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-400 text-xl">🚀</span>
                      <span className="text-white font-semibold">Priority placement</span>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-white font-bold mb-1">
                    Expected Launch: Q2 2026
                  </p>
                  <p className="text-yellow-300 text-2xl font-black">
                    ~$25<span className="text-lg">/month</span>
                  </p>
                </div>

                <div className="text-center">
                  <Link
                    href="/contact"
                    className="block bg-white hover:bg-gray-100 text-indigo-900 font-black text-lg px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-xl"
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
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-black text-white text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Is it really free?
                </h3>
                <p className="text-white/80 text-sm">
                  Yes! Creating a complete business profile on AntiguaSearch.com is 100% free with no hidden costs. We believe every business in Antigua & Barbuda deserves to be discovered.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Do I need a credit card to sign up?
                </h3>
                <p className="text-white/80 text-sm">
                  No credit card required. Simply fill out the business listing form and you're done!
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  How long does it take to get listed?
                </h3>
                <p className="text-white/80 text-sm">
                  Most listings are reviewed and published within 24-48 hours. You'll receive an email notification when your listing goes live.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Can I update my listing later?
                </h3>
                <p className="text-white/80 text-sm">
                  Absolutely! You can claim your listing and update your business information, photos, and details anytime.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  What are Featured Listings?
                </h3>
                <p className="text-white/80 text-sm">
                  Featured Listings (coming soon) will give your business premium placement with gold borders, star badges, and top-of-page visibility. Join the waitlist to be notified when this launches!
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Will my free listing stay free?
                </h3>
                <p className="text-white/80 text-sm">
                  Yes! Your basic listing will always remain free. Featured placement will be optional for businesses that want extra visibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto text-center bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/90 mb-6">
              Join 100+ businesses already listed on AntiguaSearch.com
            </p>
            <Link
              href="/add-listing"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black text-xl px-12 py-5 rounded-full transition-all transform hover:scale-105 shadow-2xl"
            >
              List Your Business Free →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}