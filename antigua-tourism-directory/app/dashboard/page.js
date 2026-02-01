'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [claimedListings, setClaimedListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

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
          category:categories(name, icon_emoji),
          parish:parishes(name)
        )
      `)
      .eq('user_id', user.id)

    setClaimedListings(data || [])
    setLoadingListings(false)
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
            <div className="flex items-center gap-4">
              {isAdmin && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Admin
                </span>
              )}
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">
                View Directory
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-red-600 font-medium"
              >
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
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Manage your business listings and reach more customers
          </p>
        </div>

        {/* Quick Actions */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 mb-12`}>
          <Link
            href="/dashboard/claim-listing"
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-600 hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600">
              Claim a Listing
            </h3>
            <p className="text-gray-600">
              Already listed? Claim your business to manage it
            </p>
          </Link>

          <Link
            href="/add-listing"
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-600 hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3">➕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600">
              Add New Listing
            </h3>
            <p className="text-gray-600">
              List a new business in the directory
            </p>
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/dashboard/import"
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-600 hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-3">📤</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600">
                  Import from CSV
                </h3>
                <p className="text-gray-600">
                  Bulk upload multiple businesses at once
                </p>
              </Link>

              <Link
                href="/dashboard/admin"
                className="bg-white border-2 border-red-200 rounded-xl p-6 hover:border-red-600 hover:shadow-lg transition group"
              >
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600">
                  Admin Panel
                </h3>
                <p className="text-gray-600">
                  Manage all listings, users, and claims
                </p>
              </Link>
            </>
          )}

          <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl p-6 text-white">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-xl font-bold mb-2">
              Go Featured
            </h3>
            <p className="text-white/90">
              Get premium placement and more visibility
            </p>
          </div>
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
                <Link
                  href="/dashboard/claim-listing"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Claim a Listing
                </Link>
                <Link
                  href="/add-listing"
                  className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
                >
                  Add New Listing
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {claimedListings.map((claim) => {
                // Safety check for null listing data
                if (!claim.listing) return null
                
                return (
                  <div
                    key={claim.id}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center">
                      <span className="text-6xl">{claim.listing.category?.icon_emoji || '🏢'}</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {claim.listing.business_name || 'Unnamed Business'}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          claim.listing.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {claim.listing.status || 'unknown'}
                        </span>
                      </div>
                      {claim.listing.parish && (
                        <p className="text-sm text-gray-600 mb-3">
                          📍 {claim.listing.parish.name}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Link
                          href={`/listing/${claim.listing.slug}`}
                          className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/edit/${claim.listing.id}`}
                          className="flex-1 text-center bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                        >
                          Edit
                        </Link>
                      </div>
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