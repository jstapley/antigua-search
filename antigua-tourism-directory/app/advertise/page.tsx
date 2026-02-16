// app/advertise/page.tsx
import Link from 'next/link'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Advertise Your Business | Antigua Search',
  description: 'Promote your business to thousands of visitors searching for services in Antigua & Barbuda. Featured listings and premium placement available.',
  alternates: {
    canonical: 'https://www.antiguasearch.com/advertise'
  }
}

export default function AdvertisePage() {
  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        
        {/* Hero Section - matches your blue/purple theme */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Advertise Your Business
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Reach thousands of visitors searching for businesses in Antigua & Barbuda
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Why Advertise on Antigua Search?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Benefit 1 */}
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Targeted Audience</h3>
                    <p className="text-gray-600">
                      Connect with locals and tourists actively searching for your services
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Placement</h3>
                    <p className="text-gray-600">
                      Stand out with featured listings at the top of search results
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Enhanced Visibility</h3>
                    <p className="text-gray-600">
                      Boost your profile with photos, reviews, and detailed information
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics & Insights</h3>
                    <p className="text-gray-600">
                      Track views, clicks, and engagement with your listing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Advertising Options
              </h2>
              <p className="text-xl text-blue-100">
                Choose the plan that works best for your business
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              {/* Free Listing */}
              <div className="bg-white rounded-2xl shadow-xl p-8 relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Free Listing</h3>
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    $0/mo
                  </span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">✓</span>
                    <span className="text-gray-700">Basic business information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">✓</span>
                    <span className="text-gray-700">Contact details & location</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">✓</span>
                    <span className="text-gray-700">Customer reviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 text-xl">✓</span>
                    <span className="text-gray-700">Standard search visibility</span>
                  </li>
                </ul>

                <Link 
                  href="/add-listing"
                  className="block w-full text-center bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Featured Listing */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-xl p-8 relative border-4 border-yellow-300">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Coming Soon
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-6 mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">Featured Listing</h3>
                  <span className="bg-gray-900 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold">
                    TBA
                  </span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-3 text-xl">✓</span>
                    <span className="text-gray-900 font-medium">Everything in Free</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-3 text-xl">✓</span>
                    <span className="text-gray-900 font-medium">Premium placement in search</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-3 text-xl">✓</span>
                    <span className="text-gray-900 font-medium">Featured badge</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-3 text-xl">✓</span>
                    <span className="text-gray-900 font-medium">Enhanced profile with photos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-3 text-xl">✓</span>
                    <span className="text-gray-900 font-medium">Priority support</span>
                  </li>
                </ul>

                <button 
                  disabled
                  className="block w-full text-center bg-gray-900 text-yellow-400 font-bold py-3 px-6 rounded-lg opacity-75 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              List your business today and start connecting with customers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/add-listing"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                + Add Your Business
              </Link>
              
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg font-bold rounded-lg transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section - matches your homepage style */}
        <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">175+</div>
                <div className="text-blue-100 text-lg">Business Listings</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">6</div>
                <div className="text-blue-100 text-lg">Parishes Covered</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">12</div>
                <div className="text-blue-100 text-lg">Categories</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}