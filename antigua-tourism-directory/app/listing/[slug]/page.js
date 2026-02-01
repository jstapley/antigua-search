import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Map from '@/components/Map'
import ReviewStats from '@/components/reviews/ReviewStats';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import ListingPageClient from '@/components/ListingPageClient';

export const revalidate = 3600

export async function generateStaticParams() {
  const { data: listings } = await supabase
    .from('listings')
    .select('slug')
    .eq('status', 'active')
  
  return listings?.map((listing) => ({
    slug: listing.slug,
  })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const { data: listing } = await supabase
    .from('listings')
    .select('business_name, short_description, meta_title, meta_description')
    .eq('slug', resolvedParams.slug)
    .eq('status', 'active')
    .single()

  if (!listing) {
    return {
      title: 'Business Not Found'
    }
  }

  return {
    title: listing.meta_title || `${listing.business_name} - Antigua Search`,
    description: listing.meta_description || listing.short_description || `Discover ${listing.business_name} in Antigua & Barbuda`,
  }
}

async function getListing(slug) {
  const { data: listing } = await supabase
    .from('listings')
    .select(`
      *,
      category:categories(id, name, slug, icon_emoji),
      parish:parishes(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()
  
  return listing
}

async function checkIfClaimed(listingId) {
  const { data, error } = await supabase
    .from('claimed_listings')
    .select('id')
    .eq('listing_id', listingId)
  
  // Return true if there's at least one claim
  return data && data.length > 0
}

async function getRelatedListings(categoryId, parishId, currentListingId) {
  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      category:categories(name, icon_emoji),
      parish:parishes(name, slug)
    `)
    .eq('status', 'active')
    .neq('id', currentListingId)
    .or(`category_id.eq.${categoryId},parish_id.eq.${parishId}`)
    .order('featured', { ascending: false })
    .limit(3)
  
  return listings || []
}

export default async function ListingPage({ params }) {
  const resolvedParams = await params
  const listing = await getListing(resolvedParams.slug)
  
  if (!listing) {
    notFound()
  }
  
  const isClaimed = await checkIfClaimed(listing.id)
  const relatedListings = await getRelatedListings(
    listing.category?.id,
    listing.parish?.id,
    listing.id
  )

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
              <Link href="/admin/reviews" className="text-gray-700 hover:text-indigo-600 font-medium">Admin</Link>
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
            {listing.category && (
              <>
                <Link href={`/category/${listing.category.slug}`} className="text-indigo-600 hover:text-indigo-700">
                  {listing.category.name}
                </Link>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-700 font-semibold">{listing.business_name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            {listing.image_url ? (
              <div className="aspect-video relative bg-gray-100 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={listing.image_url}
                  alt={listing.business_name}
                  fill
                  className="object-cover"
                />
                {listing.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ Featured Listing
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 relative">
                <span className="text-9xl">{listing.category?.icon_emoji || '🏢'}</span>
                {listing.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-indigo-900 px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ Featured Listing
                  </div>
                )}
              </div>
            )}

            {/* Business Name & Badges */}
            <div className="mb-6">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {listing.business_name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                {listing.category && (
                  <Link
                    href={`/category/${listing.category.slug}`}
                    className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-200 transition"
                  >
                    <span>{listing.category.icon_emoji}</span>
                    <span>{listing.category.name}</span>
                  </Link>
                )}
                {listing.parish && (
                  <Link
                    href={`/parish/${listing.parish.slug}`}
                    className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
                  >
                    <span>📍</span>
                    <span>{listing.parish.name}</span>
                  </Link>
                )}
                {listing.verified && (
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    <span>✓</span>
                    <span>Verified</span>
                  </div>
                )}
                {/* ADD REVIEW STATS HERE */}
                <ReviewStats 
                  averageRating={listing.average_rating}
                  reviewCount={listing.review_count || 0}
                />
              </div>
            </div>

            {/* Short Description */}
            {listing.short_description && (
              <div className="bg-blue-50 border-l-4 border-indigo-600 p-6 rounded-r-xl mb-8">
                <p className="text-lg text-gray-800 font-medium">
                  {listing.short_description}
                </p>
              </div>
            )}

            {/* Full Description */}
            {listing.description && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p className="whitespace-pre-line">{listing.description}</p>
                </div>
              </div>
            )}

            {/* Map */}
            {(listing.latitude && listing.longitude) && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
                <Map 
                  latitude={listing.latitude}
                  longitude={listing.longitude}
                  businessName={listing.business_name}
                />
                {listing.address && (
                  <p className="text-gray-600 mt-3 flex items-center gap-2">
                    <span>📍</span>
                    <span>{listing.address}</span>
                  </p>
                )}
              </div>
            )}

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 gap-3">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <span className="text-indigo-600">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            {/* Contact Card - NOW WITH ANALYTICS TRACKING */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <ListingPageClient listing={listing} />
              
              {!isClaimed && (
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="block w-full bg-yellow-400 text-indigo-900 text-center px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
                  >
                    🏢 Claim This Business
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION - ADD THIS */}
        <div className="mt-16 border-t pt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Reviews & Ratings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Review List - Left side, 2/3 width */}
            <div className="lg:col-span-2">
              <ReviewList listingId={listing.id} />
            </div>

            {/* Review Form - Right side, 1/3 width */}
            <div className="lg:col-span-1">
              <ReviewForm listingId={listing.id} />
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedListings.map((related) => (
                <Link
                  key={related.id}
                  href={`/listing/${related.slug}`}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 group bg-white"
                >
                  {related.image_url ? (
                    <div className="aspect-video relative bg-gray-100">
                      <Image
                        src={related.image_url}
                        alt={related.business_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                      <span className="text-6xl">{related.category?.icon_emoji || '🏢'}</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition mb-2">
                      {related.business_name}
                    </h3>
                    {related.parish && (
                      <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
                        <span>📍</span>
                        <span>{related.parish.name}</span>
                      </div>
                    )}
                    {related.short_description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {related.short_description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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