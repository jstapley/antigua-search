'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function AddListingPage() {
  const [formData, setFormData] = useState({
    business_name: '',
    category_id: '',
    parish_id: '',
    short_description: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    latitude: '',
    longitude: '',
    contact_name: '',
    contact_email: '',
    facebook_url: '',
    instagram_url: '',
    google_business_url: '',
    tripadvisor_url: '',
    twitter_url: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [categories, setCategories] = useState([])
  const [parishes, setParishes] = useState([])
  const [loadingData, setLoadingData] = useState(true)

  // Map state
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showAdvancedLocation, setShowAdvancedLocation] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteRef = useRef(null)
  const searchInputRef = useRef(null)

  // Load categories and parishes
  useEffect(() => {
    async function loadData() {
      const { data: cats } = await supabase.from('categories').select('*').order('name')
      const { data: pars } = await supabase.from('parishes').select('*').order('name')
      setCategories(cats || [])
      setParishes(pars || [])
      setLoadingData(false)
    }
    loadData()
  }, [])

  // Initialize Google Maps
  useEffect(() => {
    initMap()
  }, [])

  const initMap = async () => {
    try {
      // Load Google Maps API
      if (!window.google) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`
        script.async = true
        script.defer = true
        document.head.appendChild(script)
        
        await new Promise((resolve) => {
          script.onload = resolve
        })
      }

      const google = window.google

      // Center on Antigua & Barbuda
      const antiguaCenter = { lat: 17.0608, lng: -61.7964 }

      const map = new google.maps.Map(mapRef.current, {
        center: antiguaCenter,
        zoom: 11,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      })

      mapInstanceRef.current = map

      // Create draggable marker
      const marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: 'Drag me to your business location'
      })

      markerRef.current = marker

      // Click on map to place marker
      map.addListener('click', (e) => {
        placeMarker(e.latLng, google)
      })

      // Drag marker to update location
      marker.addListener('dragend', (e) => {
        updateLocation(e.latLng, google)
      })

      // Initialize autocomplete for address search
      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: 'ag' }, // Antigua & Barbuda
          fields: ['geometry', 'formatted_address', 'name']
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          
          if (place.geometry && place.geometry.location) {
            placeMarker(place.geometry.location, google)
            map.setCenter(place.geometry.location)
            map.setZoom(16)
            
            // Update address field
            const address = place.formatted_address || place.name || ''
            setFormData(prev => ({ ...prev, address }))
          }
        })

        autocompleteRef.current = autocomplete
      }

      setMapLoaded(true)
    } catch (err) {
      console.error('Error loading map:', err)
      setError('Failed to load map. You can still submit without map selection.')
    }
  }

  const placeMarker = (location, google) => {
    markerRef.current.setPosition(location)
    markerRef.current.setVisible(true)
    
    // Bounce animation
    markerRef.current.setAnimation(google.maps.Animation.BOUNCE)
    setTimeout(() => markerRef.current.setAnimation(null), 750)
    
    updateLocation(location, google)
  }

  const updateLocation = async (location, google) => {
    const lat = location.lat()
    const lng = location.lng()

    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    }))

    // Reverse geocode to get address
    const geocoder = new google.maps.Geocoder()
    try {
      const result = await geocoder.geocode({ location })
      if (result.results && result.results[0]) {
        const address = result.results[0].formatted_address
        setFormData(prev => ({ ...prev, address }))
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setImageFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const uploadImage = async () => {
    if (!imageFile) return null

    setUploadingImage(true)
    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `listings/${fileName}`

      const { data, error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (err) {
      console.error('Image upload error:', err)
      throw new Error('Failed to upload image: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadImage()
      }

      const slug = generateSlug(formData.business_name)
      
      const listingData = {
        ...formData,
        slug,
        status: 'pending',
        image_url: imageUrl,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      }

      const { error: submitError } = await supabase
        .from('listings')
        .insert([listingData])

      if (submitError) throw submitError

      setSuccess(true)
      
      // Reset form
      setFormData({
        business_name: '',
        category_id: '',
        parish_id: '',
        short_description: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        latitude: '',
        longitude: '',
        contact_name: '',
        contact_email: '',
        facebook_url: '',
        instagram_url: '',
        google_business_url: '',
        tripadvisor_url: '',
        twitter_url: ''
      })
      setImageFile(null)
      setImagePreview(null)
      
      // Clear marker
      if (markerRef.current) {
        markerRef.current.setVisible(false)
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">List Your Business</h1>
        <p className="text-lg text-gray-600 mb-8">
          Get your business in front of thousands of visitors exploring Antigua & Barbuda. 
          Fill out the form below and we'll review your submission.
        </p>

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8">
            <h3 className="text-lg font-bold text-green-800 mb-2">Success! 🎉</h3>
            <p className="text-green-700">
              Your listing has been submitted and is pending review. We'll be in touch soon!
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
              placeholder="e.g., Paradise Beach Resort"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Category *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon_emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Parish */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Parish *
            </label>
            <select
              name="parish_id"
              value={formData.parish_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
            >
              <option value="">Select a parish</option>
              {parishes.map(par => (
                <option key={par.id} value={par.id}>
                  {par.name}
                </option>
              ))}
            </select>
          </div>

          {/* Business Image Upload */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Image</h3>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Upload Main Image
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload a high-quality image of your business (max 5MB, JPG/PNG)
              </p>
              
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-gray-600 mb-1">Click to upload an image</p>
                    <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Short Description *
            </label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
              required
              maxLength="150"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
              placeholder="Brief one-line description (max 150 characters)"
            />
            <p className="text-sm text-gray-500 mt-1">{formData.short_description.length}/150</p>
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Full Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
              placeholder="Detailed description of your business, services, and what makes you unique"
            />
          </div>

          {/* Contact Information */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  placeholder="+1 (268) 462-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  placeholder="info@yourbusiness.com"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                placeholder="https://yourbusiness.com"
              />
            </div>
          </div>

          {/* Interactive Map Location Picker */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📍 Business Location</h3>
            <p className="text-sm text-gray-600 mb-4">
              Search for your address or click on the map to mark your exact location
            </p>

            {/* Address Search */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Search Address
              </label>
              <input
                ref={searchInputRef}
                type="text"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                placeholder="Start typing your address..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Type to search, or click on the map below
              </p>
            </div>

            {/* Interactive Map */}
            <div className="mb-4">
              <div 
                ref={mapRef}
                className="w-full h-96 rounded-lg border-2 border-gray-200 bg-gray-100"
              />
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Address Display */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                placeholder="Your business address"
              />
            </div>

            {/* Location Confirmation */}
            {formData.latitude && formData.longitude && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <div className="flex items-start">
                  <div className="text-green-400 mr-3">✓</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      Location Set Successfully
                    </p>
                    <p className="text-sm text-green-700 mb-2">
                      {formData.address || 'Location marked on map'}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Preview on Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced: Manual Coordinate Entry */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setShowAdvancedLocation(!showAdvancedLocation)}
                className="text-sm text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-2"
              >
                {showAdvancedLocation ? '▼' : '▶'} Advanced: Manual Coordinates
              </button>
              
              {showAdvancedLocation && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    For advanced users: manually enter coordinates
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                        placeholder="17.0608"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                        placeholder="-61.7964"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media & Business Profiles */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media & Business Profiles</h3>
            <p className="text-sm text-gray-600 mb-4">Add your social media and business profile links (optional)</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  📘 Facebook Page
                </label>
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  placeholder="https://facebook.com/yourbusiness"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  📸 Instagram
                </label>
                <input
                  type="url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  placeholder="https://instagram.com/yourbusiness"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  🔍 Google Business Profile
                </label>
                <input
                  type="url"
                  name="google_business_url"
                  value={formData.google_business_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  🦉 TripAdvisor
                </label>
                <input
                  type="url"
                  name="tripadvisor_url"
                  value={formData.tripadvisor_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  placeholder="https://tripadvisor.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  🐦 Twitter/X
                </label>
                <input
                  type="url"
                  name="twitter_url"
                  value={formData.twitter_url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                  placeholder="https://twitter.com/yourbusiness"
                />
              </div>
            </div>
          </div>
          
          {/* Owner Contact */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Contact Information</h3>
            <p className="text-sm text-gray-600 mb-4">We'll use this to contact you about your listing (not shown publicly)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImage ? 'Uploading Image...' : loading ? 'Submitting...' : 'Submit Listing'}
          </button>
        </form>
      </div>
    </div>
  )
}
