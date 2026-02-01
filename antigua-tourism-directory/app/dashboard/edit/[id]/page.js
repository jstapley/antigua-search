'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Modal from '@/components/Modal'

export default function EditListingPage({ params }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [listing, setListing] = useState(null)
  const [categories, setCategories] = useState([])
  const [parishes, setParishes] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [saving, setSaving] = useState(false)
  
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
    twitter_url: ''
  })

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
    if (user) {
      loadData()
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

    // Check if user owns this listing
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
      twitter_url: listingData.twitter_url || ''
    })

    // Load categories and parishes
    const { data: cats } = await supabase.from('categories').select('*').order('name')
    const { data: pars } = await supabase.from('parishes').select('*').order('name')
    
    setCategories(cats || [])
    setParishes(pars || [])
    setLoadingData(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!listing || !listing.id) {
      showModal('Error', 'Listing ID not found. Please refresh the page.', 'error')
      return
    }
    
    setSaving(true)

    // Use RPC function instead of direct update
    const { error } = await supabase.rpc('update_listing_via_rpc', {
      listing_id: listing.id,
      p_business_name: formData.business_name,
      p_category_id: formData.category_id,
      p_parish_id: formData.parish_id,
      p_short_description: formData.short_description,
      p_description: formData.description,
      p_phone: formData.phone,
      p_email: formData.email,
      p_website: formData.website || null,
      p_address: formData.address,
      p_latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      p_longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      p_facebook_url: formData.facebook_url || null,
      p_instagram_url: formData.instagram_url || null,
      p_google_business_url: formData.google_business_url || null,
      p_tripadvisor_url: formData.tripadvisor_url || null,
      p_twitter_url: formData.twitter_url || null
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
                <div className="text-sm text-indigo-600 font-semibold">TOURISM DIRECTORY</div>
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Edit Listing</h1>
        <p className="text-lg text-gray-600 mb-8">
          Update your business information
        </p>

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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
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

            <div className="mt-6">
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

          {/* Location Coordinates */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Map Location (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="17.0747"
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
                  placeholder="-61.8175"
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
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
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