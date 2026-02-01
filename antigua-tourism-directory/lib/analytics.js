// lib/analytics.js
// Analytics tracking utilities for Antigua Tourism Directory

import { createClient } from '@supabase/supabase-js'

// Create a browser-specific client for analytics
const supabaseBrowser = typeof window !== 'undefined' 
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  : null

/**
 * Generate a session ID for tracking unique visitors
 * Stored in sessionStorage (expires when browser closes)
 */
export function getSessionId() {
  if (typeof window === 'undefined') return null
  
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

/**
 * Get user's IP address (client-side approximation)
 * In production, you might want to use a server-side API
 */
export async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    return null
  }
}

/**
 * Track a page view
 * @param {Object} params - Tracking parameters
 * @param {string} params.pageType - Type of page ('listing', 'category', 'parish', 'search', 'home')
 * @param {string} params.pageSlug - Slug of the page
 * @param {string} params.listingId - UUID of listing (if applicable)
 */
export async function trackPageView({ pageType, pageSlug, listingId = null }) {
  if (typeof window === 'undefined') {
    console.log('⚠️ Analytics: Window is undefined (server-side)')
    return
  }

  if (!supabaseBrowser) {
    console.error('❌ Analytics: Browser client not initialized')
    return
  }
  
  console.log('📊 Analytics: Tracking page view', { pageType, pageSlug, listingId })
  
  try {
    const sessionId = getSessionId()
    const userAgent = navigator.userAgent
    const referrer = document.referrer || null
    
    console.log('📊 Analytics: Session ID:', sessionId)
    console.log('📊 Analytics: Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    const { data, error } = await supabaseBrowser
      .from('analytics_pageviews')
      .insert([{
        listing_id: listingId,
        page_type: pageType,
        page_slug: pageSlug,
        user_agent: userAgent,
        referrer: referrer,
        session_id: sessionId
      }])
    
    if (error) {
      console.error('❌ Analytics tracking error:', error)
      console.error('❌ Error details:', JSON.stringify(error))
    } else {
      console.log('✅ Analytics: Page view tracked successfully!', data)
    }
  } catch (err) {
    console.error('❌ Analytics error:', err)
  }
}

/**
 * Track a search query
 * @param {Object} params - Search parameters
 * @param {string} params.searchTerm - The search query
 * @param {number} params.resultCount - Number of results returned
 * @param {string} params.categoryFilter - Category filter UUID
 * @param {string} params.parishFilter - Parish filter UUID
 */
export async function trackSearch({ searchTerm, resultCount, categoryFilter = null, parishFilter = null }) {
  if (typeof window === 'undefined') return
  if (!supabaseBrowser) return
  
  try {
    const sessionId = getSessionId()
    
    const { error } = await supabaseBrowser
      .from('analytics_searches')
      .insert([{
        search_term: searchTerm,
        result_count: resultCount,
        category_filter: categoryFilter,
        parish_filter: parishFilter,
        session_id: sessionId
      }])
    
    if (error) {
      console.error('Search tracking error:', error)
    }
  } catch (err) {
    console.error('Search tracking error:', err)
  }
}

/**
 * Track a click event (phone, email, website, etc.)
 * @param {Object} params - Click parameters
 * @param {string} params.listingId - UUID of the listing
 * @param {string} params.clickType - Type of click ('phone', 'email', 'website', 'directions', 'view_details')
 */
export async function trackClick({ listingId, clickType }) {
  if (typeof window === 'undefined') return
  if (!supabaseBrowser) return
  
  try {
    const sessionId = getSessionId()
    
    const { error } = await supabaseBrowser
      .from('analytics_clicks')
      .insert([{
        listing_id: listingId,
        click_type: clickType,
        session_id: sessionId
      }])
    
    if (error) {
      console.error('Click tracking error:', error)
    }
  } catch (err) {
    console.error('Click tracking error:', err)
  }
}

/**
 * Batch track multiple events (for performance)
 */
export async function trackBatch(events) {
  if (typeof window === 'undefined') return
  
  try {
    const sessionId = getSessionId()
    const userAgent = navigator.userAgent
    const referrer = document.referrer || null
    
    // Add common fields to all events
    const enrichedEvents = events.map(event => ({
      ...event,
      session_id: sessionId,
      user_agent: userAgent,
      referrer: referrer
    }))
    
    // Insert based on event type
    // This is a simplified version - you might want to separate by table
    for (const event of enrichedEvents) {
      if (event.type === 'pageview') {
        await supabase.from('analytics_pageviews').insert([event])
      } else if (event.type === 'search') {
        await supabase.from('analytics_searches').insert([event])
      } else if (event.type === 'click') {
        await supabase.from('analytics_clicks').insert([event])
      }
    }
  } catch (err) {
    console.error('Batch tracking error:', err)
  }
}

/**
 * Get analytics for a specific listing (for business owners)
 * @param {string} listingId - UUID of the listing
 * @param {number} days - Number of days to look back (default 30)
 */
export async function getListingAnalytics(listingId, days = 30) {
  if (!supabaseBrowser) {
    console.error('Browser client not available')
    return null
  }

  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    // Get page views
    const { data: pageviews, error: pvError } = await supabaseBrowser
      .from('analytics_pageviews')
      .select('*')
      .eq('listing_id', listingId)
      .gte('viewed_at', startDate.toISOString())
    
    if (pvError) throw pvError
    
    // Get clicks
    const { data: clicks, error: clickError } = await supabaseBrowser
      .from('analytics_clicks')
      .select('*')
      .eq('listing_id', listingId)
      .gte('clicked_at', startDate.toISOString())
    
    if (clickError) throw clickError
    
    return {
      totalViews: pageviews?.length || 0,
      uniqueViews: new Set(pageviews?.map(pv => pv.session_id)).size || 0,
      totalClicks: clicks?.length || 0,
      clicksByType: clicks?.reduce((acc, click) => {
        acc[click.click_type] = (acc[click.click_type] || 0) + 1
        return acc
      }, {}),
      viewsByDay: groupByDay(pageviews),
      clicksByDay: groupByDay(clicks, 'clicked_at')
    }
  } catch (error) {
    console.error('Error fetching listing analytics:', error)
    return null
  }
}

/**
 * Helper function to group data by day
 */
function groupByDay(data, dateField = 'viewed_at') {
  if (!data || data.length === 0) return {}
  
  return data.reduce((acc, item) => {
    const date = new Date(item[dateField]).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})
}

/**
 * Privacy-friendly tracking
 * - No personal data stored
 * - Session-based only (no persistent cookies)
 * - IP addresses hashed (if needed for deduplication)
 */
export const ANALYTICS_CONFIG = {
  enabled: true,
  respectDoNotTrack: true, // Honor DNT header
  anonymizeIP: true
}

/**
 * Check if tracking should be enabled
 */
export function shouldTrack() {
  if (!ANALYTICS_CONFIG.enabled) {
    console.log('⚠️ Analytics: Tracking disabled in config')
    return false
  }
  
  // Respect Do Not Track
  if (ANALYTICS_CONFIG.respectDoNotTrack && navigator.doNotTrack === '1') {
    console.log('⚠️ Analytics: Do Not Track is enabled')
    return false
  }
  
  console.log('✅ Analytics: Tracking is enabled')
  return true
}
