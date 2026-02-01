import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
                <div className="text-xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
                <div className="text-sm text-indigo-600 font-semibold">ANTIGUA SEARCH</div>
              </div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">
                Home
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-indigo-600 font-medium">
                Categories
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-6">About AntiguaSearch.com</h1>
          <p className="text-xl text-indigo-100">
            Making it easier for businesses to be found and for visitors to discover Antigua & Barbuda
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              My connection to Antigua & Barbuda began in 2000 when my wife and I got married at the beautiful Jolly Beach Resort. 
              What started as a destination wedding turned into a lifelong love affair with these incredible islands. We've been 
              visiting every year since, watching Antigua evolve and grow.
            </p>
            <p>
              During COVID, when you couldn't even fly to the island, we made what our friends thought was a crazy decision – 
              we purchased a villa in Jolly Harbour. While others saw uncertainty, we saw an opportunity of a lifetime. That leap 
              of faith changed everything.
            </p>
            <p>
              As I started establishing my own business in Antigua, I quickly understood the challenges that come with business 
              ownership here. Getting discovered by tourists and locals alike isn't always easy. Traditional marketing is expensive, 
              and there wasn't a single, comprehensive platform where businesses could list themselves and track their visibility.
            </p>
            <p className="font-semibold text-gray-900">
              That's why I created AntiguaSearch.com – to solve the exact problem I was facing.
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              If you own a business in Antigua & Barbuda, you know these challenges:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <span>Your business information is scattered across multiple platforms – Facebook, Instagram, TripAdvisor, Google Maps</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <span>You have no idea how many people are actually finding you online</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <span>Traditional advertising is expensive and results are hard to measure</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <span>Tourists struggle to find comprehensive, reliable information about local businesses</span>
              </li>
            </ul>
          </div>
        </section>

        {/* The Solution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Solution</h2>
          <div className="space-y-6">
            <p className="text-lg text-gray-700">
              AntiguaSearch.com is the single destination where businesses can showcase themselves and visitors can discover 
              everything Antigua & Barbuda has to offer.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">One Central Location</h3>
                <p className="text-gray-700">
                  All your business information in one place – making it effortless for customers to find you
                </p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Real Analytics</h3>
                <p className="text-gray-700">
                  See exactly how many people view your listing, click your phone number, visit your website, and more
                </p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <div className="text-3xl mb-3">✨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Easy to Manage</h3>
                <p className="text-gray-700">
                  Update your information anytime with our simple dashboard – no technical skills required
                </p>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200">
                <div className="text-3xl mb-3">🌴</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Reach More Visitors</h3>
                <p className="text-gray-700">
                  Connect with thousands of tourists and locals actively searching for businesses like yours
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits for Business Owners */}
        <section className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits for Business Owners</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Get Found Easily</h3>
                <p className="text-gray-700">
                  Tourists and locals searching for businesses in your category will discover you instantly
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Track Your Performance</h3>
                <p className="text-gray-700">
                  Know exactly how your listing is performing with detailed analytics on views, clicks, and searches
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Build Your Reputation</h3>
                <p className="text-gray-700">
                  Collect and showcase customer reviews that build trust and credibility
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Stay Competitive</h3>
                <p className="text-gray-700">
                  Keep your business visible alongside established competitors with professional listings
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                5
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Understand Your Analytics</h3>
                <p className="text-gray-700">
                  No complex dashboards or confusing metrics – we present your data in a way that's easy to understand and act on
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              As a business owner in Antigua myself, I understand the importance of reliable, affordable marketing that 
              actually works. AntiguaSearch.com isn't just another directory – it's built by someone who lives here, 
              understands the market, and genuinely wants to see local businesses thrive.
            </p>
            <p>
              We're committed to continuously improving the platform, adding features that matter to you, and ensuring 
              that your business gets the visibility it deserves. When you succeed, we succeed.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-indigo-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your Business Discovered?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join hundreds of businesses already using AntiguaSearch.com
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/add-listing"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-50 transition inline-block"
            >
              List Your Business Free
            </Link>
            <Link
              href="/contact"
              className="bg-indigo-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-800 transition inline-block border-2 border-white"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
                  <div className="font-bold">ANTIGUA & BARBUDA</div>
                  <div className="text-sm text-indigo-400">ANTIGUA SEARCH</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Your complete guide to discovering Antigua & Barbuda
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Explore</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
                <li><Link href="/parishes" className="hover:text-white">Browse by Parish</Link></li>
                <li><Link href="/search" className="hover:text-white">Search</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">For Businesses</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/add-listing" className="hover:text-white">Add Your Business</Link></li>
                <li><Link href="/login" className="hover:text-white">Business Login</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:contact@antiguasearch.com" className="hover:text-white">
                    contact@antiguasearch.com
                  </a>
                </li>
                <li>Jolly Harbour, Antigua</li>
                <li>
                  <Link href="/contact" className="hover:text-white">Contact Form</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2026 AntiguaSearch.com - All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  )
}