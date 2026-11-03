'use client'

import { useEffect } from 'react'

interface Props {
  propertyId: string
  propertySlug: string
}

export function PropertyViewTracker({ propertyId, propertySlug }: Props) {
  useEffect(() => {
    // Small delay to ensure page is fully hydrated
    const timer = setTimeout(() => {
      console.log('[Tracker] Sending view for:', propertySlug, 'id:', propertyId)
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property_id: propertyId,
          property_slug: propertySlug,
          event_type: 'view',
        }),
      })
        .then(r => r.json())
        .then(d => console.log('[Tracker] View response:', d))
        .catch(e => console.error('[Tracker] View failed:', e))
    }, 500)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export function EnquiryButton({
  propertyId,
  propertySlug,
  href,
  children,
}: Props & { href: string; children: React.ReactNode }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log('[Tracker] Enquiry click for:', propertySlug)
    // Fire and don't wait — navigation proceeds normally
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: propertyId,
        property_slug: propertySlug,
        event_type: 'enquiry_click',
      }),
    })
      .then(r => r.json())
      .then(d => console.log('[Tracker] Enquiry response:', d))
      .catch(e => console.error('[Tracker] Enquiry failed:', e))
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className="block w-full bg-[#0c2749] hover:bg-[#0a1f3a] text-white text-center py-3 rounded-xl font-semibold transition-colors text-sm"
    >
      {children}
    </a>
  )
}
