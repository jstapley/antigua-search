import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export const revalidate = 3600

export const metadata = {
  title: 'Browse All Parishes - Antigua Tourism Directory',
  description: 'Explore businesses and attractions across all parishes in Antigua & Barbuda',
}

async function getParishes() {
  const { data: parishes, error } = await supabase
    .from('parishes')
    .select('*')
    .order('listing_count', { ascending: false })
  
  console.log('Supabase parishes query result:', { parishes, error })
  console.log('Number of parishes:', parishes?.length)
  
  return parishes || []
}

export default async function ParishesPage() {
  const parishes = await getParishes()

  return (
    <div className="min-h-screen bg-white">
      {/* Top Stats Banner */}
      <div className="bg-indigo-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="font-semibold">1,247 people</span>
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
              <Link href="/parishes" className="text-indigo-600 font-semibold">Browse Parishes</Link>
              <Link href="/categories" className="text-gray-700 hover:text-indigo-600 font-medium">Categories</Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">About Us</Link>
              <Link href="/contact" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</Link>
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

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-semibold">All Parishes</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl font-extrabold text-white mb-4">
            Browse All Parishes
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Explore businesses and attractions across all six parishes of Antigua & Barbuda. 
            From the capital city to coastal communities, discover what makes each parish unique.
          </p>
        </div>
      </section>

      {/* Parishes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parishes.map((parish) => (
            <Link 
              key={parish.id} 
              href={`/parish/${parish.slug}`}
              className="border-2 border-gray-200 rounded-xl p-8 hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group bg-white"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                  {parish.name}
                </h2>
                <span className="text-4xl">📍</span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                {parish.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-indigo-600 font-bold text-xl">
                  {parish.listing_count} listings
                </div>
                <div className="text-indigo-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About Parishes Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">About Antigua's Parishes</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Antigua is divided into six parishes, each with its own unique character and attractions. 
              From the bustling capital of St. John's to the historic English Harbour in St. Paul, 
              every parish offers something special for visitors and residents alike.
            </p>
            <p>
              Browse our comprehensive directory to find restaurants, hotels, tours, activities, and 
              local businesses in each parish. Whether you're planning a vacation or looking for local 
              services, our parish-by-parish guide makes it easy to discover the best of Antigua & Barbuda.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Own a Business in Antigua?
          </h3>
          <p className="text-gray-600 mb-8 text-xl max-w-2xl mx-auto">
            Get your business listed and reach thousands of visitors exploring the islands
          </p>
          <Link
            href="/add-listing"
            className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-indigo-700 transition shadow-lg"
          >
            List Your Business - It's Free! →
          </Link>
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
          </div>
        </div>
      </footer>
    </div>
  )
}