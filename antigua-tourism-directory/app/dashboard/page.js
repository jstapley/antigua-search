'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import PointsWidget from '@/components/PointsWidget'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [claimedListings, setClaimedListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [upgradingId, setUpgradingId] = useState(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      checkAdminStatus()
      loadClaimedListings()
    }
  }, [user])

  const checkAdminStatus = async () => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    setIsAdmin(profile?.role === 'admin')
  }

  const loadClaimedListings = async () => {
    const { data } = await supabase
      .from('claimed_listings')
      .select(`
        *,
        listing:listings(
          id,
          business_name,
          slug,
          short_description,
          address,
          status,
          featured,
          featured_until,
          category:categories(name, icon_emoji),
          parish:parishes(name)
        )
      `)
      .eq('user_id', user.id)

    setClaimedListings(data || [])
    setLoadingListings(false)
  }

  const handleUpgradeToFeatured = async (listing) => {
    setUpgradingId(listing.id)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          listingName: listing.business_name,
          userEmail: user.email,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to create checkout session')
      window.location.href = data.url
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Could not start checkout: ' + err.message)
    } finally {
      setUpgradingId(null)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/antigua-flag.png" alt="Antigua Flag" width={50} height={50} className="rounded-full" />
              <div>
                <div className="text-xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
                <div className="text-sm text-brand-600 font-semibold">ANTIGUA SEARCH</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Admin
                </span>
              )}
              <Link href="/" className="text-gray-700 hover:text-brand-600 font-medium">
                View Directory
              </Link>
              <button onClick={handleSignOut} className="text-gray-700 hover:text-red-600 font-medium">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome back! 👋</h1>
          <p className="text-lg text-gray-600">Manage your business listings and reach more customers</p>
        </div>

        {/* Points Widget */}
        {!isAdmin && <PointsWidget userId={user.id} />}

        {/* Quick Actions */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 mb-12`}>
          <Link
            href="/dashboard/claim-listing"
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-brand-600 hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600">Claim a Listing</h3>
            <p className="text-gray-600">Already listed? Claim your business to manage it</p>
          </Link>

          <Link
            href="/add-listing"
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-brand-600 hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3">➕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600">Add New Listing</h3>
            <p className="text-gray-600">List a new business in the directory</p>
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/dashboard/import"
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-brand-600 hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-3">📤</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600">Import from CSV</h3>
                <p className="text-gray-600">Bulk upload multiple businesses at once</p>
              </Link>

              <Link
                href="/dashboard/admin"
                className="bg-white border-2 border-red-200 rounded-xl p-6 hover:border-red-600 hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600">Admin Panel</h3>
                <p className="text-gray-600">Manage all listings, users, and claims</p>
              </Link>
            </>
          )}

          <Link
            href="/pricing"
            className="bg-gradient-to-br from-brand-600 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition"
          >
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-bold mb-2">Go Featured</h3>
            <p className="text-white/90">Get premium placement and more visibility</p>
          </Link>
        </div>

        {/* My Listings Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">My Listings</h2>

          {loadingListings ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading your listings...</p>
            </div>
          ) : claimedListings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
              <div className="text-6xl mb-4">🏝️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Listings Yet</h3>
              <p className="text-gray-600 mb-6">
                Claim an existing listing or add a new business to get started
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard/claim-listing" className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition">
                  Claim a Listing
                </Link>
                <Link href="/add-listing" className="bg-white border-2 border-brand-600 text-brand-600 px-6 py-3 rounded-lg font-semibold hover:bg-brand-50 transition">
                  Add New Listing
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedListings.map((claim) => {
                if (!claim.listing) return null
                const listing = claim.listing
                const isFeatured = listing.featured && listing.featured_until && new Date(listing.featured_until) > new Date()

                return (
                  <div key={claim.id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition">
                    <div className="aspect-video bg-gradient-to-br from-brand-100 to-blue-100 flex items-center justify-center relative">
                      <span className="text-6xl">{listing.category?.icon_emoji || '🏢'}</span>
                      {isFeatured && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {listing.business_name || 'Unnamed Business'}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          listing.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {listing.status || 'unknown'}
                        </span>
                      </div>
                      {listing.parish && (
                        <p className="text-sm text-gray-600 mb-3">📍 {listing.parish.name}</p>
                      )}
                      {isFeatured && listing.featured_until && (
                        <p className="text-xs text-yellow-700 bg-yellow-50 rounded px-2 py-1 mb-3">
                          ⭐ Featured until {new Date(listing.featured_until).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      )}
                      <div className="flex gap-2 mb-2">
                        <Link
                          href={`/listing/${listing.slug}`}
                          className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/edit/${listing.id}`}
                          className="flex-1 text-center bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition"
                        >
                          Edit
                        </Link>
                      </div>
                      {!isFeatured && (
                        <button
                          onClick={() => handleUpgradeToFeatured(listing)}
                          disabled={upgradingId === listing.id}
                          className="w-full bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        >
                          {upgradingId === listing.id ? '⏳ Redirecting...' : '⭐ Upgrade to Featured — EC$350/yr'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
