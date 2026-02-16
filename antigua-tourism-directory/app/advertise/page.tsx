// app/advertise/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Advertise Your Business | Antigua Search',
  description: 'Promote your business to thousands of visitors searching for services in Antigua & Barbuda. Featured listings and premium placement available.',
  alternates: {
    canonical: 'https://www.antiguasearch.com/advertise'
  }
}

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            Advertise Your Business
          </h1>
          <p className="text-xl text-gray-600">
            Reach thousands of visitors searching for businesses in Antigua & Barbuda
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Advertise on Antigua Search?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Targeted Audience</h3>
                <p className="text-gray-600 text-sm">Connect with locals and tourists actively searching for your services</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Premium Placement</h3>
                <p className="text-gray-600 text-sm">Stand out with featured listings at the top of search results</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Enhanced Visibility</h3>
                <p className="text-gray-600 text-sm">Boost your profile with photos, reviews, and detailed information</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Analytics & Insights</h3>
                <p className="text-gray-600 text-sm">Track views, clicks, and engagement with your listing</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Advertising Options</h2>
          <p className="text-purple-100 mb-6">
            Choose the plan that works best for your business
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Listing */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Free Listing</h3>
                <span className="bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-semibold">
                  $0/mo
                </span>
              </div>
              <ul className="space-y-2 text-purple-100">
                <li>✓ Basic business information</li>
                <li>✓ Contact details & location</li>
                <li>✓ Customer reviews</li>
                <li>✓ Standard search visibility</li>
              </ul>
            </div>

            {/* Featured Listing */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 border-2 border-yellow-400">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Featured Listing</h3>
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Coming Soon
                </span>
              </div>
              <ul className="space-y-2 text-purple-100">
                <li>✓ Everything in Free</li>
                <li>✓ Premium placement in search</li>
                <li>✓ Featured badge</li>
                <li>✓ Enhanced profile with photos</li>
                <li>✓ Priority support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            List your business today and start connecting with customers
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/add-listing"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all shadow-lg hover:shadow-xl"
            >
              Add Your Business
            </Link>
            
            <Link 
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  )
}