'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Search, X } from 'lucide-react'

interface Props {
  value: string | null
  onChange: (embedUrl: string | null) => void
}

declare global {
  interface Window {
    google: any
    initMapPicker: () => void
  }
}

function buildEmbedUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${lat},${lng}&zoom=15`
}

function parseLatLngFromEmbed(url: string): { lat: number; lng: number } | null {
  try {
    const match = url.match(/q=([-\d.]+),([-\d.]+)/)
    if (match) return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) }
  } catch {}
  return null
}

export default function MapPicker({ value, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [pinned, setPinned] = useState<{ lat: number; lng: number } | null>(
    value ? parseLatLngFromEmbed(value) : null
  )

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) { setLoaded(true); return }
    if (document.getElementById('gmap-script')) {
      const interval = setInterval(() => {
        if (window.google?.maps) {
          setLoaded(true)
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    }
    window.initMapPicker = () => setLoaded(true)
    const script = document.createElement('script')
    script.id = 'gmap-script'
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMapPicker&loading=async`
    script.async = true
    document.head.appendChild(script)
  }, [])

  // Initialize map — use setTimeout(0) to ensure mapRef.current is committed to DOM
  useEffect(() => {
    if (!loaded) return

    setTimeout(() => {
      if (!mapRef.current || mapInstanceRef.current) return

      const initialCenter = pinned || { lat: 17.0747, lng: -61.8175 }
      const map = new window.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: pinned ? 15 : 11,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_CENTER,
        },
      })
      mapInstanceRef.current = map

      if (pinned) {
        const marker = new window.google.maps.Marker({
          position: pinned,
          map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
        })
        markerRef.current = marker
        marker.addListener('dragend', () => {
          const pos = marker.getPosition()
          if (pos) updatePin(pos.lat(), pos.lng())
        })
      }

      map.addListener('click', (e: any) => {
        if (!e.latLng) return
        placeMarker(e.latLng.lat(), e.latLng.lng(), map)
      })

      // Init autocomplete here after map is ready
      if (inputRef.current && !autocompleteRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['geometry', 'formatted_address'],
          componentRestrictions: { country: 'ag' },
        })
        autocompleteRef.current = autocomplete

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (!place.geometry?.location) return
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          map.setCenter({ lat, lng })
          map.setZoom(16)
          placeMarker(lat, lng, map)
        })
      }
    }, 0)
  }, [loaded])

  const placeMarker = (lat: number, lng: number, map: any) => {
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng })
    } else {
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      })
      markerRef.current = marker
      marker.addListener('dragend', () => {
        const pos = marker.getPosition()
        if (pos) updatePin(pos.lat(), pos.lng())
      })
    }
    updatePin(lat, lng)
  }

  const updatePin = (lat: number, lng: number) => {
    setPinned({ lat, lng })
    onChange(buildEmbedUrl(lat, lng))
  }

  const clearPin = () => {
    if (markerRef.current) {
      markerRef.current.setMap(null)
      markerRef.current = null
    }
    setPinned(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for the property address..."
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors"
          disabled={!loaded}
        />
      </div>

      {/* Always render map div so mapRef.current is always available */}
      {!loaded && (
        <div className="h-80 rounded-2xl bg-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-[#0c2749] rounded-full animate-spin" />
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className={`h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-sm ${!loaded ? 'hidden' : ''}`}
      />

      {pinned ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2 text-green-700 text-sm">
            <MapPin size={14} className="text-green-500 flex-shrink-0" />
            <span className="font-medium">Location pinned</span>
            <span className="text-green-500 text-xs">
              ({pinned.lat.toFixed(5)}, {pinned.lng.toFixed(5)})
            </span>
          </div>
          <button type="button" onClick={clearPin}
            className="text-gray-400 hover:text-red-500 transition-colors p-1">
            <X size={14} />
          </button>
        </div>
      ) : (
        <p className="text-gray-400 text-xs text-center py-1">
          Search for an address above or click anywhere on the map to drop a pin
        </p>
      )}
    </div>
  )
}