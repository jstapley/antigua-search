import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Get the AntiguaSearch App | Antigua & Barbuda Business Directory',
  description: 'Download the FIRST business directory app for Antigua & Barbuda. Find 200+ local businesses, hotels, restaurants, and services - even offline!',
  keywords: 'antiguasearch app, antigua app, download antigua business directory, antigua mobile app, barbuda app',
  alternates: {
    canonical: 'https://antiguasearch.com/get-app'
  },
  openGraph: {
    title: 'Get the AntiguaSearch App - Antigua\'s First Business Directory App',
    description: 'The FIRST business directory app for Antigua & Barbuda. Install now!',
    url: 'https://antiguasearch.com/get-app',
    siteName: 'AntiguaSearch.com',
    images: [
      {
        url: 'https://antiguasearch.com/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
  }
}

export default function GetAppPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Banner */}
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

      {/* Header */}
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
              <Link 
                href="/add-listing" 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                + Add Your Business
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-yellow-400 text-indigo-900 px-6 py-2 rounded-full font-bold text-sm mb-6 animate-pulse">
              🎉 ANTIGUA'S FIRST BUSINESS DIRECTORY APP
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
              Get the AntiguaSearch App
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Find 200+ local businesses, hotels, restaurants, and services - right from your home screen
            </p>

            <div className="flex justify-center mb-8">
              <Image 
                src="/icon-512.png" 
                alt="AntiguaSearch App Icon" 
                width={150} 
                height={150}
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-16">
            Why Install the App?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Instant access from your home screen. No typing URLs or searching - just tap and go!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-5xl mb-4">📡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Works Offline</h3>
              <p className="text-gray-600">
                Find businesses even without internet connection. Pages are cached for offline viewing.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-5xl mb-4">🏝️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Antigua's First</h3>
              <p className="text-gray-600">
                The ONLY business directory app made specifically for Antigua & Barbuda!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-16">
            How to Install
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* iPhone Instructions */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">📱</div>
                <h3 className="text-2xl font-bold text-gray-900">iPhone / iPad</h3>
              </div>

              <ol className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong>Open Safari</strong> and visit <span className="font-mono bg-yellow-100 px-2 py-1 rounded">antiguasearch.com</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    Tap the <strong>Share button</strong> (square with arrow pointing up) at the bottom of the screen
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    Scroll down and tap <strong>"Add to Home Screen"</strong>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    Tap <strong>"Add"</strong> in the top-right corner
                  </div>
                </li>
              </ol>

              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> You must use Safari browser on iPhone. Chrome won't work for installation.
                </p>
              </div>
            </div>

            {/* Android Instructions */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-4xl">🤖</div>
                <h3 className="text-2xl font-bold text-gray-900">Android</h3>
              </div>

              <ol className="space-y-4 text-gray-700">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong>Open Chrome</strong> and visit <span className="font-mono bg-yellow-100 px-2 py-1 rounded">antiguasearch.com</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    Look for the <strong>"Install app"</strong> banner at the bottom of the screen and tap it
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong>OR</strong> tap the menu button (⋮) in the top-right
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>
                  </div>
                </li>
              </ol>

              <div className="mt-6 bg-green-600 text-white p-4 rounded">
                <p className="text-sm font-semibold">
                  ✨ Chrome will automatically prompt you to install!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-16">
            What's Inside the App
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-3">🏨</div>
              <h4 className="font-bold text-gray-900 mb-2">Hotels & Resorts</h4>
              <p className="text-sm text-gray-600">Find the perfect place to stay across all parishes</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-3">🍽️</div>
              <h4 className="font-bold text-gray-900 mb-2">Restaurants & Cafes</h4>
              <p className="text-sm text-gray-600">Discover the best dining experiences in Antigua</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-3">🚤</div>
              <h4 className="font-bold text-gray-900 mb-2">Tours & Activities</h4>
              <p className="text-sm text-gray-600">Book exciting adventures and island experiences</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-4xl mb-3">🛍️</div>
              <h4 className="font-bold text-gray-900 mb-2">Shopping & Services</h4>
              <p className="text-sm text-gray-600">Find local shops and essential services</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Install?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join hundreds of users who have already installed Antigua's first business directory app
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-12 py-5 rounded-xl font-black text-xl transition shadow-2xl inline-block"
            >
              Install Now →
            </a>
            <Link
              href="/"
              className="bg-white/20 hover:bg-white/30 text-white px-12 py-5 rounded-xl font-black text-xl border-2 border-white transition inline-block"
            >
              Browse Online
            </Link>
          </div>
          <p className="text-white/70 text-sm mt-6">
            Free forever • Works on iPhone & Android • No download required
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-16">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Is this a real app or just a website?
              </h3>
              <p className="text-gray-700">
                It's a Progressive Web App (PWA) - the best of both worlds! It works like a native app (home screen icon, offline mode, fast loading) but doesn't require downloading from an app store.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Does it cost anything?
              </h3>
              <p className="text-gray-700">
                No! The AntiguaSearch app is completely free to install and use. Always.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                How much space does it take?
              </h3>
              <p className="text-gray-700">
                Minimal! Unlike traditional apps, PWAs only cache the pages you visit. Typically less than 5MB.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Will it work offline?
              </h3>
              <p className="text-gray-700">
                Yes! Pages you've visited are cached so you can browse them even without an internet connection.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Can I uninstall it?
              </h3>
              <p className="text-gray-700">
                Absolutely! Just long-press the app icon and select "Remove" or "Uninstall" like any other app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Antigua Search. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              200+ Business Listings • 12 Categories • Antigua's First App
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}