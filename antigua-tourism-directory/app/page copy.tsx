import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600 // Revalidate every hour

async function getStats() {
  const { data: stats } = await supabase
    .from('site_stats')
    .select('*')
    .single()
  
  return stats || { total_listings: 0, total_parishes: 0, total_categories: 0 }
}

async function getParishes() {
  const { data: parishes } = await supabase
    .from('parishes')
    .select('*')
    .order('listing_count', { ascending: false })
  
  return parishes || []
}

async function getCategories() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('listing_count', { ascending: false })
    .limit(8)
  
  return categories || []
}

export default async function Home() {
  const stats = await getStats()
  const parishes = await getParishes()
  const categories = await getCategories()

  // Mock visitor count - you can make this dynamic later
  const monthlyVisitors = '1,247'

  return (
    <div className="min-h-screen bg-white">
      {/* Top Stats Banner */}
      <div className="bg-indigo-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="font-semibold">{monthlyVisitors} people</span>
            <span>browsing this month</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🏪 Own a business?</span>
            <Link href="/add-listing" className="underline font-semibold hover:text-yellow-300">
              Get premium visibility
            </Link>
          </div>
        </div>
      </div>

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
                <div className="text-sm text-indigo-600 font-semibold">TOURISM DIRECTORY</div>
              </div>
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
              <Link href="/parishes" className="text-gray-700 hover:text-indigo-600 font-medium">Browse Parishes</Link>
              <Link href="/categories" className="text-gray-700 hover:text-indigo-600 font-medium">Categories</Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">About Us</Link>
              <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</Link>
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</Link>
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

      {/* Hero Section - Dark Blue Background */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-extrabold text-white mb-4 tracking-tight">
            Discover Antigua & Barbuda
          </h1>
          <h2 className="text-3xl font-bold text-yellow-300 mb-6">
            Your Complete Island Guide
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-4xl mx-auto">
            Find the best restaurants, hotels, tours, and activities across the islands. 
            Discover hidden gems and popular destinations all in one place.
          </p>
          
          {/* Stats Boxes */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-12 py-8 border border-white/20">
              <div className="text-5xl font-extrabold text-yellow-300 mb-2">{stats.total_listings}</div>
              <div className="text-white font-semibold text-lg">Business Listings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-12 py-8 border border-white/20">
              <div className="text-5xl font-extrabold text-yellow-300 mb-2">{stats.total_parishes}</div>
              <div className="text-white font-semibold text-lg">Parishes Covered</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-12 py-8 border border-white/20">
              <div className="text-5xl font-extrabold text-yellow-300 mb-2">{stats.total_categories}</div>
              <div className="text-white font-semibold text-lg">Categories</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center">
            <Link 
              href="/parishes" 
              className="bg-yellow-400 text-indigo-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition shadow-lg"
            >
              Browse All Parishes →
            </Link>
            <Link 
              href="/categories" 
              className="bg-transparent text-white px-10 py-4 rounded-xl font-bold text-lg border-2 border-white/50 hover:bg-white/10 transition"
            >
              View Categories ↓
            </Link>
          </div>
        </div>
      </section>

      {/* Parishes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-4xl font-bold text-gray-900 mb-8">Browse by Parish</h3>
        <p className="text-gray-600 text-lg mb-8">
          Explore businesses and attractions across Antigua's parishes. Find everything from restaurants 
          to resorts in your preferred location.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parishes.map((parish) => (
            <Link 
              key={parish.id} 
              href={`/parish/${parish.slug}`}
              className="border-2 border-gray-200 rounded-xl p-8 hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group bg-white"
            >
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                  {parish.name}
                </h4>
                <span className="text-3xl">📍</span>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">{parish.description}</p>
              <div className="text-indigo-600 font-bold text-lg flex items-center gap-2">
                {parish.listing_count} listings
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-gray-900 mb-8">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group"
              >
                <div className="text-5xl mb-4">{category.icon_emoji}</div>
                <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                  {category.name}
                </h4>
                <div className="text-gray-600 font-semibold">
                  {category.listing_count} listings
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              href="/categories" 
              className="text-indigo-600 font-bold text-lg hover:text-indigo-700 inline-flex items-center gap-2"
            >
              View All Categories
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </div>
      </section>

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
                  <div className="font-bold text-lg">Antigua Tourism</div>
                  <div className="text-sm text-gray-400">Directory</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Your complete guide to experiencing the best of Antigua & Barbuda
              </p>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-lg">Quick Links</h6>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-white transition">Home</Link>
                <Link href="/parishes" className="block text-gray-400 hover:text-white transition">Browse Parishes</Link>
                <Link href="/categories" className="block text-gray-400 hover:text-white transition">All Categories</Link>
                <Link href="/about" className="block text-gray-400 hover:text-white transition">About Us</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-lg">For Business</h6>
              <div className="space-y-2">
                <Link href="/add-listing" className="block text-gray-400 hover:text-white transition">List Your Business</Link>
                <Link href="/advertise" className="block text-gray-400 hover:text-white transition">Advertise With Us</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white transition">Pricing</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-lg">Contact</h6>
              <p className="text-gray-400 text-sm mb-2">info@antiguatourismdirectory.com</p>
              <p className="text-gray-400 text-sm">St. John's, Antigua & Barbuda</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Antigua Tourism Directory. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              {stats.total_listings} Business Listings • {stats.total_parishes} Parishes • Discover Paradise
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}