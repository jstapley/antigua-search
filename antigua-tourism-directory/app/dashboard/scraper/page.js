'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Modal from '@/components/Modal'

export default function ScraperPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingPermissions, setCheckingPermissions] = useState(true)
  const [categories, setCategories] = useState([])
  const [parishes, setParishes] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [scraping, setScraping] = useState(false)
  const [results, setResults] = useState([])
  const [importing, setImporting] = useState(false)

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    onClose: () => {}
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      checkAdminStatus()
    }
  }, [user])

  const checkAdminStatus = async () => {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    setIsAdmin(true)
    loadData()
    setCheckingPermissions(false)
  }

  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('*').order('name')
    const { data: pars } = await supabase.from('parishes').select('*').order('name')
    setCategories(cats || [])
    setParishes(pars || [])
  }

  const showModal = (title, message, type = 'success', onCloseCallback) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onClose: () => {
        setModal(prev => ({ ...prev, isOpen: false }))
        if (onCloseCallback) onCloseCallback()
      }
    })
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const scrapeBusinesses = async () => {
    if (!selectedCategory) {
      showModal('Error', 'Please select a category', 'error')
      return
    }

    setScraping(true)
    setResults([])

    const category = categories.find(c => c.id === selectedCategory)
    
    try {
      // Call our API route which handles the Claude API call server-side
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category_name: category.name
        })
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to scrape businesses')
      }

      const businesses = data.businesses

      // Match parishes to database IDs
      const enrichedBusinesses = businesses.map(business => {
        const parish = parishes.find(p => 
          p.name.toLowerCase().includes(business.parish?.toLowerCase() || '') ||
          business.parish?.toLowerCase().includes(p.name.toLowerCase() || '')
        )

        return {
          ...business,
          category_id: selectedCategory,
          parish_id: parish?.id || parishes[0]?.id, // Default to first parish if no match
          parish_name: parish?.name || business.parish,
          category_name: category.name,
          selected: true // Pre-select all for import
        }
      })

      setResults(enrichedBusinesses)
      showModal('Success!', `Found ${enrichedBusinesses.length} businesses`, 'success')

    } catch (error) {
      console.error('Scraping error:', error)
      showModal('Error', 'Failed to scrape businesses: ' + error.message, 'error')
    }

    setScraping(false)
  }

  const toggleSelection = (index) => {
    setResults(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ))
  }

  const importSelected = async () => {
    const selected = results.filter(r => r.selected)
    
    if (selected.length === 0) {
      showModal('Error', 'No businesses selected', 'error')
      return
    }

    setImporting(true)

    let successCount = 0
    let errorCount = 0

    for (const business of selected) {
      try {
        const listingData = {
          business_name: business.business_name,
          slug: generateSlug(business.business_name),
          category_id: business.category_id,
          parish_id: business.parish_id,
          short_description: business.short_description || '',
          description: business.description || '',
          phone: business.phone || '',
          email: business.email || '',
          website: business.website || '',
          address: business.address || '',
          status: 'active'
        }

        const { error } = await supabase
          .from('listings')
          .insert([listingData])

        if (error) {
          console.error('Import error:', error)
          errorCount++
        } else {
          successCount++
        }
      } catch (error) {
        console.error('Import error:', error)
        errorCount++
      }
    }

    setImporting(false)
    
    if (successCount > 0) {
      showModal(
        'Import Complete!',
        `Successfully imported ${successCount} businesses. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
        errorCount > 0 ? 'warning' : 'success',
        () => {
          setResults([])
          router.push('/dashboard/admin')
        }
      )
    } else {
      showModal('Import Failed', 'Could not import any businesses.', 'error')
    }
  }

  if (loading || checkingPermissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-red-200">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-lg text-gray-600 mb-6">
              This feature is only available to administrators.
            </p>
            <Link
              href="/dashboard"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal {...modal} />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard/admin" className="flex items-center gap-3">
              <Image 
                src="/antigua-flag.png" 
                alt="Antigua Flag" 
                width={50} 
                height={50}
                className="rounded-full"
              />
              <div>
                <div className="text-xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
                <div className="text-sm text-indigo-600 font-semibold">AI BUSINESS SCRAPER</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                🤖 AI Powered
              </span>
              <Link
                href="/dashboard/admin"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                ← Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            AI Business Scraper 🤖
          </h1>
          <p className="text-lg text-gray-600">
            Use AI to automatically discover and import businesses from the web
          </p>
        </div>

        {/* Scraper Controls */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Discover Businesses</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Category *
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={scraping}
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
          </div>

          <button
            onClick={scrapeBusinesses}
            disabled={scraping || !selectedCategory}
            className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scraping ? '🤖 Searching the web...' : '🔍 Find Businesses with AI'}
          </button>

          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
            <p className="text-sm text-gray-700">
              <strong>How it works:</strong> Claude AI will search the web for real businesses in Antigua, 
              extract their information, and present them for your review before importing.
            </p>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Found {results.length} Businesses
              </h2>
              <button
                onClick={importSelected}
                disabled={importing || !results.some(r => r.selected)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? 'Importing...' : `Import ${results.filter(r => r.selected).length} Selected`}
              </button>
            </div>

            <div className="space-y-4">
              {results.map((business, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-xl p-6 transition ${
                    business.selected
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={business.selected}
                      onChange={() => toggleSelection(index)}
                      className="mt-1 w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {business.business_name}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>Category:</strong> {business.category_name}
                        </div>
                        <div>
                          <strong>Parish:</strong> {business.parish_name}
                        </div>
                        <div>
                          <strong>Phone:</strong> {business.phone || 'N/A'}
                        </div>
                        <div>
                          <strong>Email:</strong> {business.email || 'N/A'}
                        </div>
                        <div className="col-span-2">
                          <strong>Website:</strong> {business.website || 'N/A'}
                        </div>
                        <div className="col-span-2">
                          <strong>Address:</strong> {business.address}
                        </div>
                        <div className="col-span-2">
                          <strong>Description:</strong> {business.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
