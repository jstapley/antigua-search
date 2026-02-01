'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Papa from 'papaparse'
import Modal from '@/components/Modal'

export default function ImportPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingPermissions, setCheckingPermissions] = useState(true)
  const [categories, setCategories] = useState([])
  const [parishes, setParishes] = useState([])
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState(null)
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
      setIsAdmin(false)
      setCheckingPermissions(false)
      return
    }

    setIsAdmin(true)
    loadData()
    setCheckingPermissions(false)
  }

  const loadData = async () => {
    const { data: cats } = await supabase.from('categories').select('*')
    const { data: pars } = await supabase.from('parishes').select('*')
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

  const findCategoryId = (categoryName) => {
    const cat = categories.find(c => 
      c.name.toLowerCase() === categoryName.toLowerCase()
    )
    return cat?.id || null
  }

  const findParishId = (parishName) => {
    const par = parishes.find(p => 
      p.name.toLowerCase().includes(parishName.toLowerCase()) ||
      parishName.toLowerCase().includes(p.name.toLowerCase())
    )
    return par?.id || null
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      showModal('Error', 'Please upload a CSV file', 'error')
      return
    }

    setImporting(true)
    setResults(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        await processCSV(result.data)
      },
      error: (error) => {
        showModal('Error', 'Failed to parse CSV: ' + error.message, 'error')
        setImporting(false)
      }
    })
  }

  const processCSV = async (data) => {
    const results = {
      total: data.length,
      success: 0,
      failed: 0,
      errors: []
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      
      try {
        // Validate required fields
        if (!row.business_name || !row.category || !row.parish) {
          results.failed++
          results.errors.push({
            row: i + 2,
            error: 'Missing required fields (business_name, category, parish)'
          })
          continue
        }

        // Find category and parish IDs
        const categoryId = findCategoryId(row.category)
        const parishId = findParishId(row.parish)

        if (!categoryId) {
          results.failed++
          results.errors.push({
            row: i + 2,
            error: `Category "${row.category}" not found`
          })
          continue
        }

        if (!parishId) {
          results.failed++
          results.errors.push({
            row: i + 2,
            error: `Parish "${row.parish}" not found`
          })
          continue
        }

        // Prepare listing data
        const listingData = {
          business_name: row.business_name.trim(),
          slug: generateSlug(row.business_name),
          category_id: categoryId,
          parish_id: parishId,
          short_description: row.short_description?.trim() || '',
          description: row.description?.trim() || '',
          phone: row.phone?.trim() || '',
          email: row.email?.trim() || '',
          website: row.website?.trim() || '',
          address: row.address?.trim() || '',
          latitude: row.latitude ? parseFloat(row.latitude) : null,
          longitude: row.longitude ? parseFloat(row.longitude) : null,
          facebook_url: row.facebook_url?.trim() || '',
          instagram_url: row.instagram_url?.trim() || '',
          google_business_url: row.google_business_url?.trim() || '',
          tripadvisor_url: row.tripadvisor_url?.trim() || '',
          twitter_url: row.twitter_url?.trim() || '',
          status: 'active'
        }

        // Insert into database
        const { error } = await supabase
          .from('listings')
          .insert([listingData])

        if (error) {
          results.failed++
          results.errors.push({
            row: i + 2,
            error: error.message
          })
        } else {
          results.success++
        }

      } catch (error) {
        results.failed++
        results.errors.push({
          row: i + 2,
          error: error.message
        })
      }
    }

    setResults(results)
    setImporting(false)
    
    if (results.success > 0) {
      showModal(
        'Import Complete!',
        `Successfully imported ${results.success} of ${results.total} listings.`,
        results.failed > 0 ? 'warning' : 'success'
      )
    } else {
      showModal(
        'Import Failed',
        `Could not import any listings. Check the errors below.`,
        'error'
      )
    }
  }

  const downloadTemplate = () => {
    const template = `business_name,category,parish,short_description,description,phone,email,website,address,latitude,longitude,facebook_url,instagram_url,google_business_url,tripadvisor_url,twitter_url
"Sample Restaurant","Restaurants & Dining","St. John's","Great Caribbean food","Experience authentic Caribbean cuisine with stunning harbor views. Fresh seafood and local specialties.","+1 (268) 462-1234","info@sample.com","https://sample.com","Dickenson Bay, St. John's","17.0747","-61.8175","https://facebook.com/samplerestaurant","https://instagram.com/samplerestaurant","https://maps.google.com/samplerestaurant","https://tripadvisor.com/samplerestaurant","https://twitter.com/samplerestaurant"
"Sample Hotel","Hotels & Resorts","St. George","Luxury beachfront resort","Luxury beachfront resort offering rooms with private balconies.","+1 (268) 462-5678","reservations@hotel.com","https://hotel.com","Jolly Harbour","17.0408","-61.7694","","","","",""`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'listings_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-red-200">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-lg text-gray-600 mb-6">
              This feature is only available to directory administrators.
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
            <div className="flex items-center gap-4">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                Admin
              </span>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Import Listings from CSV
          </h1>
          <p className="text-lg text-gray-600">
            Bulk upload multiple businesses at once using a CSV file
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-indigo-600 p-6 rounded-r-xl mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📋 CSV Format Instructions</h3>
          <p className="text-gray-700 mb-3">Your CSV file should include these columns:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
            <li><strong>business_name</strong> (required)</li>
            <li><strong>category</strong> (required) - e.g., "Restaurants", "Hotels", "Tours"</li>
            <li><strong>parish</strong> (required) - e.g., "St. John's", "St. George"</li>
            <li><strong>short_description</strong></li>
            <li><strong>description</strong></li>
            <li><strong>phone</strong></li>
            <li><strong>email</strong></li>
            <li><strong>website</strong></li>
            <li><strong>address</strong></li>
            <li><strong>latitude</strong> (optional)</li>
            <li><strong>longitude</strong> (optional)</li>
            <li><strong>facebook_url</strong> (optional)</li>
            <li><strong>instagram_url</strong> (optional)</li>
            <li><strong>google_business_url</strong> (optional)</li>
            <li><strong>tripadvisor_url</strong> (optional)</li>
            <li><strong>twitter_url</strong> (optional)</li>
          </ul>
          <button
            onClick={downloadTemplate}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Download Template CSV
          </button>
        </div>

        {/* Available Categories & Parishes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Available Categories</h3>
            <div className="space-y-1">
              {categories.map(cat => (
                <div key={cat.id} className="text-sm text-gray-700">
                  {cat.icon_emoji} {cat.name}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Available Parishes</h3>
            <div className="space-y-1">
              {parishes.map(par => (
                <div key={par.id} className="text-sm text-gray-700">
                  📍 {par.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📤</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload CSV File</h3>
            <p className="text-gray-600 mb-6">
              Select a CSV file to import listings
            </p>
            
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className={`inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg cursor-pointer hover:bg-indigo-700 transition ${
                importing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {importing ? 'Importing...' : 'Choose CSV File'}
            </label>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="mt-8 bg-white border-2 border-gray-200 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Import Results</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-gray-900">{results.total}</div>
                <div className="text-sm text-gray-600">Total Rows</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{results.success}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>

            {results.errors.length > 0 && (
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Errors:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {results.errors.map((error, idx) => (
                    <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r text-sm">
                      <strong>Row {error.row}:</strong> {error.error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.success > 0 && (
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  View Directory →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}