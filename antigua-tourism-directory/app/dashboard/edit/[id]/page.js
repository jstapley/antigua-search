'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Modal from '@/components/Modal'
import { Loader } from '@googlemaps/js-api-loader'

export default function EditListingPage({ params }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const [categories, setCategories] = useState([])
  const [parishes, setParishes] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
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
    facebook_url: '',
    instagram_url: '',
    google_business_url: '',
    tripadvisor_url: '',
    twitter_url: '',
    image_url: ''
  })

  // Map state
  const [mapLoaded, setMapLoaded] = useState(false)
  const [showAdvancedLocation, setShowAdvancedLocation] = useState(false)
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)
  const autocompleteRef = useRef(null)
  const searchInputRef = useRef(null)
  const hasLoadedData = useRef(false)

  // Image upload state
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    confirmButton: null,
    onClose: () => {}
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
  if (user && !hasLoadedData.current) {
    loadData()
    hasLoadedData.current = true
  }
}, [user])

  const loadData = async () => {
    const resolvedParams = await params
    
    // Load listing
    const { data: listingData } = await supabase
      .from('listings')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (!listingData) {
      router.push('/dashboard')
      return
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'

    // Check if user owns this listing (if not admin)
    if (!isAdmin) {
      const { data: claim } = await supabase
        .from('claimed_listings')
        .select('*')
        .eq('listing_id', resolvedParams.id)
        .eq('user_id', user.id)
        .single()

      if (!claim) {
        router.push('/dashboard')
        return
      }
    }

    setListing(listingData)
    setFormData({
      business_name: listingData.business_name || '',
      category_id: listingData.category_id || '',
      parish_id: listingData.parish_id || '',
      short_description: listingData.short_description || '',
      description: listingData.description || '',
      phone: listingData.phone || '',
      email: listingData.email || '',
      website: listingData.website || '',
      address: listingData.address || '',
      latitude: listingData.latitude || '',
      longitude: listingData.longitude || '',
      facebook_url: listingData.facebook_url || '',
      instagram_url: listingData.instagram_url || '',
      google_business_url: listingData.google_business_url || '',
      tripadvisor_url: listingData.tripadvisor_url || '',
      twitter_url: listingData.twitter_url || '',
      image_url: listingData.image_url || ''
    })

    // Set image preview if image exists
    if (listingData.image_url) {
     setImagePreview(listingData.image_url)
    }

    // Load categories and parishes
    const { data: cats } = await supabase.from('categories').select('*').order('name')
    const { data: pars } = await supabase.from('parishes').select('*').order('name')
    
    setCategories(cats || [])
    setParishes(pars || [])
    setLoadingData(false)

// Initialize map AFTER state updates - increased delay
  setTimeout(() => {
    if (listingData.latitude && listingData.longitude) {
      initMap(parseFloat(listingData.latitude), parseFloat(listingData.longitude))
    } else {
      initMap()
    }
    }, 500) // Increased from 100 to 500ms
  }

  // Initialize Google Maps (same as add-listing)
  const initMap = async (lat, lng) => {
    try {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'geocoding']
      })

      const google = await loader.load()

      // Center on listing location or Antigua
      const center = lat && lng 
        ? { lat, lng }
        : { lat: 17.0608, lng: -61.7964 }

      const map = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: lat && lng ? 15 : 11,
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

      // Set marker position if coordinates exist
      if (lat && lng) {
        marker.setPosition({ lat, lng })
        marker.setVisible(true)
      }

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
          componentRestrictions: { country: 'ag' },
          fields: ['geometry', 'formatted_address', 'name']
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          
          if (place.geometry && place.geometry.location) {
            placeMarker(place.geometry.location, google)
            map.setCenter(place.geometry.location)
            map.setZoom(16)
            
            const address = place.formatted_address || place.name || ''
            setFormData(prev => ({ ...prev, address }))
          }
        })

        autocompleteRef.current = autocomplete
      }

      setMapLoaded(true)
    } catch (err) {
      console.error('Error loading map:', err)
    }
  }

  const placeMarker = (location, google) => {
    markerRef.current.setPosition(location)
    markerRef.current.setVisible(true)
    
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

  const showModal = (title, message, type = 'success', onCloseCallback) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      confirmButton: null,
      onClose: () => {
        setModal(prev => ({ ...prev, isOpen: false }))
        if (onCloseCallback) onCloseCallback()
      }
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        showModal('Error', 'Please select a valid image file', 'error')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showModal('Error', 'Image size must be less than 5MB', 'error')
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  // Upload image to Supabase Storage
  const uploadImage = async () => {
    if (!imageFile) return formData.image_url

    setUploadingImage(true)
    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${listing.id}-${Date.now()}.${fileExt}`
      const filePath = `listings/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath)

      setUploadingImage(false)
      return publicUrl
    } catch (error) {
      console.error('Image upload error:', error)
      setUploadingImage(false)
      showModal('Error', 'Failed to upload image: ' + error.message, 'error')
      return formData.image_url
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!listing || !listing.id) {
      showModal('Error', 'Listing ID not found. Please refresh the page.', 'error')
      return
    }
    
    setSaving(true)

    // Upload image if new one selected
    const imageUrl = await uploadImage()

    // Use RPC function
    const { error } = await supabase.rpc('update_listing_via_rpc', {
      listing_id: listing.id,
      p_business_name: formData.business_name,
      p_category_id: formData.category_id,
      p_parish_id: formData.parish_id,
      p_short_description: formData.short_description,
      p_description: formData.description,
      p_phone: formData.phone,
      p_email: formData.email,
      p_address: formData.address,
      p_website: formData.website || null,
      p_latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      p_longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      p_facebook_url: formData.facebook_url || null,
      p_instagram_url: formData.instagram_url || null,
      p_google_business_url: formData.google_business_url || null,
      p_tripadvisor_url: formData.tripadvisor_url || null,
      p_twitter_url: formData.twitter_url || null,
      p_image_url: imageUrl || null
    })

    setSaving(false)

    if (error) {
      console.error('Update error:', error)
      showModal(
        'Error',
        'Could not save changes: ' + error.message,
        'error'
      )
    } else {
      showModal(
        'Success!',
        'Your listing has been updated successfully.',
        'success',
        () => router.push('/dashboard')
      )
    }
  }

  const handleUnclaim = () => {
    setModal({
      isOpen: true,
      title: 'Unclaim Business?',
      message: 'Are you sure you want to unclaim this business? The listing will remain in the directory and you can claim it again later.',
      type: 'warning',
      confirmButton: {
        label: 'Yes, Unclaim',
        danger: true,
        onClick: async () => {
          setModal(prev => ({ ...prev, isOpen: false }))
          
          const { error } = await supabase
            .from('claimed_listings')
            .delete()
            .eq('listing_id', listing.id)
            .eq('user_id', user.id)

          if (error) {
            showModal(
              'Error',
              'Could not unclaim listing: ' + error.message,
              'error'
            )
          } else {
            showModal(
              'Unclaimed',
              'You have successfully unclaimed this business.',
              'success',
              () => router.push('/dashboard')
            )
          }
        }
      },
      onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
    })
  }

  if (loading || loadingData || !user) {
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
      <Modal {...modal} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
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
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Edit Listing</h1>
        <p className="text-lg text-gray-600 mb-8">
          Update your business information
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Current Image & Upload */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Business Image</h3>
            
          {/* Current Image or Preview */}
            {imagePreview && (
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-900 mb-2">
                  {imageFile ? 'New Image Preview:' : 'Current Image:'}
                </p>
                <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                {imageFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(formData.image_url || null)
                      setImageFile(null)
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-700 font-semibold"
                  >
                    ← Revert to Original Image
                  </button>
                )}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {formData.image_url ? 'Replace Image' : 'Upload Image'}
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Upload a high-quality image of your business (max 5MB, JPG/PNG)
              </p>
              
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
              <p className="text-gray-600 mb-1">
                {imagePreview ? 'Click to replace image' : 'Click to upload an image'}
              </p>
              <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
            </label>
          </div>
            </div>
          </div>

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
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none resize-none"
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

          {/* Action Buttons */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="flex gap-4 mb-4">
              <Link
                href="/dashboard"
                className="flex-1 text-center bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-300 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="flex-1 bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : uploadingImage ? 'Uploading Image...' : 'Save Changes'}
              </button>
            </div>

            {/* Unclaim Button */}
            <button
              type="button"
              onClick={handleUnclaim}
              className="w-full bg-red-50 text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-100 transition border-2 border-red-200"
            >
              Unclaim This Business
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">
              This will remove your ownership but keep the listing in the directory
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
