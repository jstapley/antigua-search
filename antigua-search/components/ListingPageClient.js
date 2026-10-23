'use client'

import { useEffect } from 'react'
import { trackPageView, trackClick, shouldTrack } from '@/lib/analytics'

export default function ListingPageClient({ listing }) {
  // Track page view when listing loads
  useEffect(() => {
    if (shouldTrack() && listing) {
      trackPageView({
        pageType: 'listing',
        pageSlug: listing.slug,
        listingId: listing.id
      })
    }
  }, [listing])

  // Track phone click
  const handlePhoneClick = () => {
    if (shouldTrack()) {
      trackClick({
        listingId: listing.id,
        clickType: 'phone'
      })
    }
  }

  // Track email click
  const handleEmailClick = () => {
    if (shouldTrack()) {
      trackClick({
        listingId: listing.id,
        clickType: 'email'
      })
    }
  }

  // Track website click
  const handleWebsiteClick = () => {
    if (shouldTrack()) {
      trackClick({
        listingId: listing.id,
        clickType: 'website'
      })
    }
  }

  // Track social media clicks
  const handleSocialClick = (platform) => {
    if (shouldTrack()) {
      trackClick({
        listingId: listing.id,
        clickType: `social_${platform}`
      })
    }
  }

  // Track directions click
  const handleDirectionsClick = () => {
    if (shouldTrack()) {
      trackClick({
        listingId: listing.id,
        clickType: 'directions'
      })
    }
  }

  return (
    <>
      {/* Contact Links with Tracking */}
      <div className="space-y-4">
        {listing.address && (
          <div>
            <div className="text-sm text-gray-500 mb-1">Address</div>
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <span className="text-gray-900">{listing.address}</span>
            </div>
          </div>
        )}

        {listing.phone && (
          <div>
            <div className="text-sm text-gray-500 mb-1">Phone</div>
            <a 
              href={`tel:${listing.phone}`}
              onClick={handlePhoneClick}
              className="flex items-center gap-3 text-brand-600 hover:text-brand-700 font-semibold"
            >
              <span className="text-xl">📞</span>
              <span>{listing.phone}</span>
            </a>
          </div>
        )}

        {listing.email && (
          <div>
            <div className="text-sm text-gray-500 mb-1">Email</div>
            <a 
              href={`mailto:${listing.email}`}
              onClick={handleEmailClick}
              className="flex items-center gap-3 text-brand-600 hover:text-brand-700 font-semibold break-all"
            >
              <span className="text-xl">✉️</span>
              <span>{listing.email}</span>
            </a>
          </div>
        )}

        {/* Website & Social Links */}
        {(listing.website || listing.facebook_url || listing.instagram_url || listing.google_business_url || listing.tripadvisor_url || listing.twitter_url) && (
          <div>
            <div className="text-sm text-gray-500 mb-2">Online Presence</div>
            <div className="space-y-2">
              {listing.website && (
                <a 
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWebsiteClick}
                  className="flex items-center gap-3 text-brand-600 hover:text-brand-700 font-semibold"
                >
                  <span className="text-xl">🌐</span>
                  <span>Website</span>
                </a>
              )}
              {listing.facebook_url && (
                <a 
                  href={listing.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick('facebook')}
                  className="flex items-center gap-3 text-brand-600 hover:text-brand-700 font-semibold"
                >
                  <span className="text-xl">📘</span>
                  <span>Facebook</span>
                </a>
              )}
              {listing.instagram_url && (
                <a 
                  href={listing.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick('instagram')}
                  className="flex items-center gap-3 text-brand-600 hover:text-brand-700 font-semibold"
                >
                  <span className="text-xl">📸</span>
                  <span>Instagram</span>
                </a>
              )}
              {listing.google_business_url && (
                <a 
                  href={listing.google_business_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick('google')}
                  className="flex items-center gap-3 text-brand-600 hover:text-brand-700 font-semibold"
                >
                  <span className="text-xl">🔍</span>
                  <span>Google Business</span>
                </a>
              )}
              {listing.tripadvisor_url && (
                <a 
                  href={listing.tripadvisor_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick('tripadvisor')}
                  className="flex items-center gap-3 text-brand-600 hover:text-brand-700 font-semibold"
                >
                  <span className="text-xl">🦉</span>
                  <span>TripAdvisor</span>
                </a>
              )}
              {listing.twitter_url && (
                <a 
                  href={listing.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleSocialClick('twitter')}
                  className="flex items-center gap-3 text-brand-600 hover:text-brand-700 font-semibold"
                >
                  <span className="text-xl">🐦</span>
                  <span>Twitter</span>
                </a>
              )}
            </div>
          </div>
        )}

        {listing.price_range && (
          <div>
            <div className="text-sm text-gray-500 mb-1">Price Range</div>
            <div className="flex items-center gap-3">
              <span className="text-xl">💰</span>
              <span className="text-gray-900 font-semibold">{listing.price_range}</span>
            </div>
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="mt-6 space-y-3">
        {listing.phone && (
          <a 
            href={`tel:${listing.phone}`}
            onClick={handlePhoneClick}
            className="block w-full bg-brand-600 text-white text-center px-6 py-3 rounded-lg font-bold hover:bg-brand-700 transition"
          >
            Call Now
          </a>
        )}
        {listing.website && (
          <a 
            href={listing.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWebsiteClick}
            className="block w-full bg-white border-2 border-brand-600 text-brand-600 text-center px-6 py-3 rounded-lg font-bold hover:bg-brand-50 transition"
          >
            Visit Website →
          </a>
        )}
      </div>
    </>
  )
}