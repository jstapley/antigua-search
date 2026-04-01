'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'

export default function UpgradeToFeatured({ listing }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [checkingOwnership, setCheckingOwnership] = useState(true)

  useEffect(() => {
    // If listing is already featured, no need to check
    if (listing.featured) {
      setCheckingOwnership(false)
      return
    }

    // If not logged in, stop checking
    if (!user) {
      setCheckingOwnership(false)
      return
    }

    // Check if user owns this listing
    const checkOwnership = async () => {
      const { data } = await supabase
        .from('claimed_listings')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('user_id', user.id)
        .single()
      setIsOwner(!!data)
      setCheckingOwnership(false)
    }

    checkOwnership()
  }, [user, listing.id, listing.featured])

  // Never show if already featured
  if (listing.featured) return null

  // Don't render anything while checking
  if (checkingOwnership) return null

  // Not logged in — show a prompt to log in
  if (!user) {
    return (
      <div className="mt-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">⭐</span>
          <h3 className="text-lg font-bold text-gray-900">Upgrade to Featured</h3>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          Get top placement in your category, a gold border badge, and homepage visibility.
        </p>
        <ul className="text-sm text-gray-600 mb-4 space-y-1">
          <li>✓ Gold border & featured badge</li>
          <li>✓ Top of category results</li>
          <li>✓ Homepage featured section</li>
        </ul>
        <p className="text-lg font-bold text-gray-900 mb-4">EC$350 / year</p>
        <Link
          href={`/login?redirect=/listing/${listing.slug}`}
          className="block w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-500 transition text-center"
        >
          Log in to Upgrade →
        </Link>
        <p className="text-xs text-gray-500 mt-2 text-center">
          You need to be logged in to upgrade your listing
        </p>
      </div>
    )
  }

  // Logged in but not the owner — don't show anything
  if (!isOwner) return null

  // Logged in and is the owner — show the payment button
  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)

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
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">⭐</span>
        <h3 className="text-lg font-bold text-gray-900">Upgrade to Featured</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">
        Get top placement in your category, a gold border badge, and homepage visibility.
      </p>
      <ul className="text-sm text-gray-600 mb-4 space-y-1">
        <li>✓ Gold border & featured badge</li>
        <li>✓ Top of category results</li>
        <li>✓ Homepage featured section</li>
      </ul>
      <p className="text-lg font-bold text-gray-900 mb-4">EC$350 / year</p>

      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}

      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {loading ? '⏳ Redirecting to payment...' : '⭐ Upgrade to Featured — EC$350/year'}
      </button>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Secure payment via Stripe
      </p>
    </div>
  )
}