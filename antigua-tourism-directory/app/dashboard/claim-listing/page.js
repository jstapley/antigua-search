'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Modal from '@/components/Modal'

export default function ClaimListingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [listings, setListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [claiming, setClaiming] = useState(null)
  
  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onClose: () => {}
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    // Load categories
    const { data: cats } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    setCategories(cats || [])

    // Load unclaimed listings
    const { data: allListings } = await supabase
      .from('listings')
      .select(`
        *,
        category:categories(name, icon_emoji),
        parish:parishes(name)
      `)
      .eq('status', 'active')
      .order('business_name')

    // Filter out already claimed listings
    const { data: claimedIds } = await supabase
      .from('claimed_listings')
      .select('listing_id')

    const claimedListingIds = claimedIds?.map(c => c.listing_id) || []
    const unclaimed = allListings?.filter(l => !claimedListingIds.includes(l.id)) || []

    setListings(unclaimed)
    setLoadingListings(false)
  }

  const showModal = (title, message, type = 'success', onCloseCallback) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onClose: () => {
        setModal(prev => ({ ...prev, isOpen: false }))
        if (onCloseCallback) onCloseCallback()
      }
    })
  }

  const handleClaim = async (listingId) => {
    setClaiming(listingId)

    const { error } = await supabase
      .from('claimed_listings')
      .insert([{
        user_id: user.id,
        listing_id: listingId,
        verified: false
      }])

    if (error) {
      showModal(
        'Error',
        'Could not claim listing: ' + error.message,
        'error',
        () => setClaiming(null)
      )
    } else {
      showModal(
        'Success!',
        'Listing claimed successfully! It will now appear in your dashboard.',
        'success',
        () => router.push('/dashboard')
      )
    }
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.address?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || listing.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      <Modal {...modal} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
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
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Claim Your Business
          </h1>
          <p className="text-lg text-gray-600">
            Find your business in our directory and claim it to start managing your listing
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl p-6 mb-8 border-2 border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Search by name or location
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., Paradise Resort, Dickenson Bay..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Filter by category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon_emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loadingListings ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Listings Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search filters' 
                : 'All listings have been claimed'}
            </p>
            <Link
              href="/add-listing"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Add Your Business Instead
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Found {filteredListings.length} unclaimed {filteredListings.length === 1 ? 'listing' : 'listings'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                    <span className="text-6xl">{listing.category?.icon_emoji || '🏢'}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {listing.business_name}
                    </h3>
                    {listing.category && (
                      <div className="text-sm text-indigo-600 font-semibold mb-2">
                        {listing.category.icon_emoji} {listing.category.name}
                      </div>
                    )}
                    {listing.parish && (
                      <p className="text-sm text-gray-600 mb-3">
                        📍 {listing.parish.name}
                      </p>
                    )}
                    {listing.short_description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {listing.short_description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Link
                        href={`/listing/${listing.slug}`}
                        target="_blank"
                        className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                      >
                        View Listing
                      </Link>
                      <button
                        onClick={() => handleClaim(listing.id)}
                        disabled={claiming === listing.id}
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        {claiming === listing.id ? 'Claiming...' : 'Claim This'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Can't Find Business */}
        <div className="mt-12 bg-blue-50 border-l-4 border-indigo-600 p-6 rounded-r-xl">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Can't find your business?
          </h3>
          <p className="text-gray-700 mb-4">
            If your business isn't listed yet, you can add it to the directory yourself.
          </p>
          <Link
            href="/add-listing"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Add Your Business →
          </Link>
        </div>
      </div>
    </div>
  )
}