import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
  
  return categories?.map((category) => ({
    slug: category.slug,
  })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const { data: category } = await supabase
    .from('categories')
    .select('name, description')
    .eq('slug', resolvedParams.slug)
    .single()

  if (!category) {
    return {
      title: 'Category Not Found'
    }
  }

  return {
    title: `${category.name} in Antigua - ANTIGUA SEARCH`,
    description: category.description || `Discover the best ${category.name.toLowerCase()} in Antigua & Barbuda`,
  }
}

async function getCategory(slug) {
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  
  return category
}

async function getListings(categoryId) {
  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      parish:parishes(name, slug)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
  
  return listings || []
}

async function getParishes(categoryId) {
  const { data: parishes } = await supabase
    .from('listings')
    .select('parish:parishes(id, name, slug)')
    .eq('category_id', categoryId)
    .eq('status', 'active')
  
  // Get unique parishes
  const uniqueParishes = {}
  parishes?.forEach(item => {
    if (item.parish) {
      uniqueParishes[item.parish.id] = item.parish
    }
  })
  
  return Object.values(uniqueParishes)
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params
  const category = await getCategory(resolvedParams.slug)
  
  if (!category) {
    notFound()
  }
  
  const listings = await getListings(category.id)
  const parishes = await getParishes(category.id)

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
                <div className="text-sm text-indigo-600 font-semibold">ANTIGUA SEARCH</div>
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

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/categories" className="text-indigo-600 hover:text-indigo-700">Categories</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-semibold">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-6xl">{category.icon_emoji}</span>
            <h1 className="text-5xl font-extrabold text-white">{category.name}</h1>
          </div>
          {category.description && (
            <p className="text-xl text-white/90 mb-6 max-w-3xl">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
              <span className="text-3xl font-bold text-yellow-300">{listings.length}</span>
              <span className="text-white ml-2">Businesses</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
              <span className="text-3xl font-bold text-yellow-300">{parishes.length}</span>
              <span className="text-white ml-2">Parishes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Parish Filter Pills */}
      {parishes.length > 0 && (
        <section className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-gray-700 font-semibold">Filter by location:</span>
              {parishes.map((parish) => (
                <Link
                  key={parish.id}
                  href={`/parish/${parish.slug}`}
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-indigo-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-indigo-700 transition"
                >
                  <span>📍</span>
                  <span>{parish.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{category.icon_emoji}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No {category.name.toLowerCase()} yet</h3>
            <p className="text-gray-600 mb-6">Be the first business in this category to get listed!</p>
            <Link 
              href="/add-listing"
              className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Add Your Business
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {category.name} in Antigua & Barbuda
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.slug}`}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group bg-white"
                >
                  {listing.image_url ? (
                    <div className="aspect-video relative bg-gray-100">
                      <Image
                        src={listing.image_url}
                        alt={listing.business_name}
                        fill
                        className="object-cover"
                      />
                      {listing.featured && (
                        <div className="absolute top-3 right-3 bg-yellow-400 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center relative">
                      <span className="text-6xl">{category.icon_emoji}</span>
                      {listing.featured && (
                        <div className="absolute top-3 right-3 bg-yellow-400 text-indigo-900 px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                        {listing.business_name}
                      </h3>
                    </div>
                    {listing.parish && (
                      <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                        <span>📍</span>
                        <span>{listing.parish.name}</span>
                      </div>
                    )}
                    {listing.short_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {listing.short_description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {listing.address && (
                        <div className="text-gray-500 text-sm flex items-center gap-1 truncate">
                          <span>{listing.address}</span>
                        </div>
                      )}
                      <div className="text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform whitespace-nowrap">
                        View Details →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Is your {category.name.toLowerCase()} business listed?
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            Join our directory and connect with thousands of visitors exploring Antigua & Barbuda
          </p>
          <Link
            href="/add-listing"
            className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg"
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
                  <div className="font-bold text-lg">Antigua Search</div>
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
              <p className="text-gray-400 text-sm mb-2">contact@antiguasearch.com</p>
              <p className="text-gray-400 text-sm">St. John's, Antigua & Barbuda</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 Antigua Search. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}