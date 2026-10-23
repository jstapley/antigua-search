'use client'

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

export default function BusinessMap({ latitude, longitude, businessName }) {
  // Return early if no coordinates
  if (!latitude || !longitude) {
    return null
  }

  // Parse coordinates
  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)
  
  // Validate parsed coordinates
  if (isNaN(lat) || isNaN(lng)) {
    return null
  }

  const center = { lat, lng }
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  // Check if API key exists
  if (!apiKey) {
    return (
      <div className="w-full h-[400px] rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Map API key not configured</p>
      </div>
    )
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div className="w-full h-[400px] rounded-xl overflow-hidden border-2 border-gray-200">
        <Map
          defaultCenter={center}
          defaultZoom={15}
          mapId="antigua-tourism-map"
        >
          <Marker position={center} title={businessName} />
        </Map>
      </div>
    </APIProvider>
  )
}
