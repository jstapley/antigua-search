// hooks/useAnalytics.js
// React hook for easy analytics integration

import { useEffect } from 'react'
import { trackPageView, shouldTrack } from '@/lib/analytics'

/**
 * Hook to automatically track page views
 * Usage: useAnalytics({ pageType: 'listing', pageSlug: slug, listingId: id })
 */
export function usePageViewTracking({ pageType, pageSlug, listingId = null }) {
  useEffect(() => {
    if (!shouldTrack()) return
    
    // Track after a small delay to ensure page is loaded
    const timer = setTimeout(() => {
      trackPageView({ pageType, pageSlug, listingId })
    }, 500)
    
    return () => clearTimeout(timer)
  }, [pageType, pageSlug, listingId])
}

/**
 * Hook to track search
 */
export function useSearchTracking() {
  // This will be called manually from the search page
  // Not an auto-tracking hook
}
