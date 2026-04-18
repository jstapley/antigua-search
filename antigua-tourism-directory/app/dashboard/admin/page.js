'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Modal from '@/components/Modal'
import { Star, Check, X, Trash2, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import OutreachTab from '@/components/OutreachTab'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingPermissions, setCheckingPermissions] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    totalUsers: 0,
    totalCategories: 0,
    pendingClaims: 0,
    totalReviews: 0,
    pendingReviews: 0,
    approvedReviews: 0
  })
  const [listings, setListings] = useState([])
  const [claims, setClaims] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [loadingData, setLoadingData] = useState(true)
  const [loadingReview, setLoadingReview] = useState(null)
  const [loadingListing, setLoadingListing] = useState(null)

  // Blog state
  const [blogPosts, setBlogPosts] = useState([])
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [blogForm, setBlogForm] = useState({
    title: '', slug: '', excerpt: '', content: '',
    featured_image: '', author: 'AntiguaSearch Team',
    status: 'draft', meta_title: '', meta_description: '', tags: ''
  })

  // Search and filter state
  const [listingSearch, setListingSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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
    loadAllData()
    setCheckingPermissions(false)
  }

  const loadAllData = async () => {
    setLoadingData(true)

    const [statsRes, listingsRes] = await Promise.all([
      fetch('/api/admin/listings?type=stats'),
      fetch('/api/admin/listings?type=listings')
    ])

    const statsData = await statsRes.json()
    const listingsData = await listingsRes.json()

    setStats({
      totalListings: statsData.totalListings || 0,
      activeListings: statsData.activeListings || 0,
      pendingListings: statsData.pendingListings || 0,
      totalUsers: statsData.totalUsers || 0,
      totalCategories: statsData.totalCategories || 0,
      pendingClaims: statsData.pendingClaims || 0,
      totalReviews: statsData.totalReviews || 0,
      pendingReviews: statsData.pendingReviews || 0,
      approvedReviews: statsData.approvedReviews || 0,
    })

    setListings(Array.isArray(listingsData) ? listingsData : [])

    const { data: claimsData } = await supabase
      .from('claimed_listings')
      .select('*')
      .eq('verified', false)
      .order('claimed_at', { ascending: false })

    if (claimsData && claimsData.length > 0) {
      const enrichedClaims = await Promise.all(
        claimsData.map(async (claim) => {
          const { data: listing } = await supabase
            .from('listings')
            .select('id, business_name, slug')
            .eq('id', claim.listing_id)
            .single()

          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('id, email, full_name')
            .eq('id', claim.user_id)
            .single()

          return { ...claim, listing, user: userProfile }
        })
      )
      setClaims(enrichedClaims)
    } else {
      setClaims([])
    }

    const { data: usersData } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    setUsers(usersData || [])

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select(`*, listing:listings(id, business_name, slug)`)
      .order('created_at', { ascending: false })
    setReviews(reviewsData || [])

    const { data: blogData } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    setBlogPosts(blogData || [])

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

  // Blog handlers
  const generateBlogSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleBlogFormChange = (e) => {
    const { name, value } = e.target
    setBlogForm(prev => {
      const updated = { ...prev, [name]: value }
      if (name === 'title' && !editingPost) {
        updated.slug = generateBlogSlug(value)
      }
      return updated
    })
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setBlogForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      featured_image: post.featured_image || '',
      author: post.author || 'AntiguaSearch Team',
      status: post.status || 'draft',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      tags: post.tags ? post.tags.join(', ') : ''
    })
    setShowBlogForm(true)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
  }

  const handleBlogSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...blogForm,
      tags: blogForm.tags ? blogForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published_at: blogForm.status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    }

    let error
    if (editingPost) {
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', editingPost.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert([payload])
      error = insertError
    }

    if (error) {
      showModal('Error', 'Could not save post: ' + error.message, 'error')
    } else {
      showModal('Saved!', `Blog post ${editingPost ? 'updated' : 'created'} successfully.`, 'success', () => {
        setShowBlogForm(false)
        setEditingPost(null)
        setBlogForm({ title: '', slug: '', excerpt: '', content: '', featured_image: '', author: 'AntiguaSearch Team', status: 'draft', meta_title: '', meta_description: '', tags: '' })
        loadAllData()
      })
    }
  }

  const handleDeletePost = (postId, title) => {
    setModal({
      isOpen: true,
      title: 'Delete Post?',
      message: `Are you sure you want to delete "${title}"? This cannot be undone.`,
      type: 'warning',
      confirmButton: {
        label: 'Yes, Delete',
        danger: true,
        onClick: async () => {
          setModal(prev => ({ ...prev, isOpen: false }))
          const { error } = await supabase.from('blog_posts').delete().eq('id', postId)
          if (error) {
            showModal('Error', 'Could not delete post: ' + error.message, 'error')
          } else {
            showModal('Deleted', 'Blog post deleted.', 'success', loadAllData)
          }
        }
      },
      onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
    })
  }

  // Listing handlers
  const handleApproveListing = async (listingId, businessName) => {
    setLoadingListing(listingId)
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'active' })
        .eq('id', listingId)
      if (error) throw error

      const res = await fetch(`/api/admin/get-listing?id=${listingId}`)
      const listing = await res.json()

      if (listing?.contact_email) {
        await fetch('/api/notify-approval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_name: businessName,
            category: listing.category?.name,
            parish: listing.parish?.name,
            contact_email: listing.contact_email,
            contact_name: listing.contact_name,
            listing_slug: listing.slug
          })
        })
      }

      showModal('Approved', `"${businessName}" is now active and visible to the public.`, 'success', loadAllData)
    } catch (error) {
      showModal('Error', 'Could not approve listing: ' + error.message, 'error')
    } finally {
      setLoadingListing(null)
    }
  }

  const handleRejectListing = async (listingId, businessName) => {
    setLoadingListing(listingId)
    try {
      const { error } = await supabase.from('listings').update({ status: 'rejected' }).eq('id', listingId)
      if (error) throw error
      showModal('Rejected', `"${businessName}" has been rejected.`, 'success', loadAllData)
    } catch (error) {
      showModal('Error', 'Could not reject listing: ' + error.message, 'error')
    } finally {
      setLoadingListing(null)
    }
  }

  const handleSetPending = async (listingId, businessName) => {
    setLoadingListing(listingId)
    try {
      const { error } = await supabase.from('listings').update({ status: 'pending' }).eq('id', listingId)
      if (error) throw error
      showModal('Status Changed', `"${businessName}" has been set to pending review.`, 'success', loadAllData)
    } catch (error) {
      showModal('Error', 'Could not change status: ' + error.message, 'error')
    } finally {
      setLoadingListing(null)
    }
  }

  const handleApproveReview = async (reviewId) => {
    setLoadingReview(reviewId)
    try {
      const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', reviewId)
      if (error) throw error
      showModal('Approved', 'Review approved successfully.', 'success', loadAllData)
    } catch (error) {
      showModal('Error', 'Could not approve review: ' + error.message, 'error')
    } finally {
      setLoadingReview(null)
    }
  }

  const handleRejectReview = async (reviewId) => {
    setLoadingReview(reviewId)
    try {
      const { error } = await supabase.from('reviews').update({ status: 'rejected' }).eq('id', reviewId)
      if (error) throw error
      showModal('Rejected', 'Review rejected successfully.', 'success', loadAllData)
    } catch (error) {
      showModal('Error', 'Could not reject review: ' + error.message, 'error')
    } finally {
      setLoadingReview(null)
    }
  }

  const handleDeleteReview = (reviewId, businessName) => {
    setModal({
      isOpen: true,
      title: 'Delete Review?',
      message: `Are you sure you want to permanently delete this review for "${businessName}"? This cannot be undone.`,
      type: 'warning',
      confirmButton: {
        label: 'Yes, Delete',
        danger: true,
        onClick: async () => {
          setModal(prev => ({ ...prev, isOpen: false }))
          const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
          if (error) {
            showModal('Error', 'Could not delete review: ' + error.message, 'error')
          } else {
            showModal('Deleted', 'Review deleted successfully.', 'success', loadAllData)
          }
        }
      },
      onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
    })
  }

  const handleDeleteListing = (listingId, businessName) => {
    setModal({
      isOpen: true,
      title: 'Delete Listing?',
      message: `Are you sure you want to permanently delete "${businessName}"? This cannot be undone.`,
      type: 'warning',
      confirmButton: {
        label: 'Yes, Delete',
        danger: true,
        onClick: async () => {
          setModal(prev => ({ ...prev, isOpen: false }))
          const { error } = await supabase.from('listings').delete().eq('id', listingId)
          if (error) {
            showModal('Error', 'Could not delete listing: ' + error.message, 'error')
          } else {
            showModal('Deleted', 'Listing deleted successfully.', 'success', loadAllData)
          }
        }
      },
      onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
    })
  }

  const handleApproveClaim = async (claimId) => {
    const claim = claims.find(c => c.id === claimId)

    const { error } = await supabase
      .from('claimed_listings')
      .update({ verified: true })
      .eq('id', claimId)

    if (error) {
      showModal('Error', 'Could not approve claim: ' + error.message, 'error')
      return
    }

    if (claim?.listing && claim?.user?.email) {
      const { data: listing } = await supabase
        .from('listings')
        .select('slug, category:categories(name), parish:parishes(name)')
        .eq('id', claim.listing_id)
        .single()

      await fetch('/api/notify-claim-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: claim.listing.business_name,
          category: listing?.category?.name,
          parish: listing?.parish?.name,
          user_email: claim.user.email,
          listing_slug: listing?.slug
        })
      })
    }

    showModal('Approved', 'Claim approved successfully.', 'success', loadAllData)
  }

  const handleRejectClaim = (claimId) => {
    setModal({
      isOpen: true,
      title: 'Reject Claim?',
      message: 'Are you sure you want to reject this claim?',
      type: 'warning',
      confirmButton: {
        label: 'Yes, Reject',
        danger: true,
        onClick: async () => {
          setModal(prev => ({ ...prev, isOpen: false }))
          const { error } = await supabase.from('claimed_listings').delete().eq('id', claimId)
          if (error) {
            showModal('Error', 'Could not reject claim: ' + error.message, 'error')
          } else {
            showModal('Rejected', 'Claim rejected successfully.', 'success', loadAllData)
          }
        }
      },
      onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
    })
  }

  const handleChangeUserRole = (userId, userName, currentRole) => {
    const newRole = currentRole === 'admin' ? 'business_owner' : 'admin'
    setModal({
      isOpen: true,
      title: 'Change User Role?',
      message: `Change ${userName}'s role from "${currentRole}" to "${newRole}"?`,
      type: 'info',
      confirmButton: {
        label: 'Yes, Change Role',
        danger: false,
        onClick: async () => {
          setModal(prev => ({ ...prev, isOpen: false }))
          const { error } = await supabase.from('user_profiles').update({ role: newRole }).eq('id', userId)
          if (error) {
            showModal('Error', 'Could not change role: ' + error.message, 'error')
          } else {
            showModal('Success', `Role changed to ${newRole}.`, 'success', loadAllData)
          }
        }
      },
      onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
    })
  }

  const handleDeleteUser = (userId, userName) => {
    if (userId === user.id) {
      showModal('Cannot Delete', 'You cannot delete your own account.', 'error')
      return
    }
    setModal({
      isOpen: true,
      title: 'Delete User?',
      message: `Are you sure you want to permanently delete "${userName}"? This will remove their account and cannot be undone.`,
      type: 'warning',
      confirmButton: {
        label: 'Yes, Delete User',
        danger: true,
        onClick: async () => {
          setModal(prev => ({ ...prev, isOpen: false }))
          try {
            const res = await fetch('/api/admin/delete-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId })
            })
            const result = await res.json()
            if (!res.ok) throw new Error(result.error || 'Failed to delete user')
            showModal('Deleted', `User "${userName}" has been deleted.`, 'success', loadAllData)
          } catch (error) {
            showModal('Error', 'Could not delete user: ' + error.message, 'error')
          }
        }
      },
      onClose: () => setModal(prev => ({ ...prev, isOpen: false }))
    })
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
            <p className="text-lg text-gray-600 mb-6">This area is restricted to administrators only.</p>
            <Link href="/dashboard" className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const pendingReviews = reviews.filter(r => r.status === 'pending')
  const approvedReviews = reviews.filter(r => r.status === 'approved')
  const rejectedReviews = reviews.filter(r => r.status === 'rejected')

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal {...modal} />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Image src="/antigua-flag.png" alt="Antigua Flag" width={50} height={50} className="rounded-full" />
              <div>
                <div className="text-xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
                <div className="text-sm text-brand-600 font-semibold">ADMIN PANEL</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/analytics" className="bg-brand-100 text-brand-700 px-4 py-2 rounded-lg font-semibold hover:bg-brand-200 transition flex items-center gap-2">
                📊 Analytics
              </Link>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">🛡️ Admin</span>
              <Link href="/dashboard" className="text-gray-700 hover:text-brand-600 font-medium">← My Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your directory, users, and content</p>
        </div>

        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-4 overflow-x-auto">
            {['overview', 'listings', 'reviews', 'claims', 'users', 'blog'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold border-b-2 transition whitespace-nowrap ${
                  activeTab === tab ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'overview' && '📊 Overview'}
                {tab === 'listings' && `📋 All Listings ${stats.pendingListings > 0 ? `(${stats.pendingListings})` : ''}`}
                {tab === 'reviews' && `⭐ Reviews ${stats.pendingReviews > 0 ? `(${stats.pendingReviews})` : ''}`}
                {tab === 'claims' && '🏢 Pending Claims'}
                {tab === 'users' && '👥 Users'}
                {tab === 'blog' && '📝 Blog'}
                {tab === 'outreach' && '📧 Outreach'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalListings}</div>
                <div className="text-gray-600">Total Listings</div>
                <div className="mt-2 text-sm text-gray-500">{stats.activeListings} active, {stats.pendingListings} pending</div>
                {stats.pendingListings > 0 && (
                  <button onClick={() => setActiveTab('listings')} className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-semibold">Review →</button>
                )}
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalReviews}</div>
                <div className="text-gray-600">Total Reviews</div>
                <div className="mt-2 text-sm text-gray-500">{stats.pendingReviews} pending, {stats.approvedReviews} approved</div>
                {stats.pendingReviews > 0 && (
                  <button onClick={() => setActiveTab('reviews')} className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-semibold">Review →</button>
                )}
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="text-3xl mb-2">⏳</div>
                <div className="text-3xl font-bold text-gray-900">{stats.pendingClaims}</div>
                <div className="text-gray-600">Pending Claims</div>
                {stats.pendingClaims > 0 && (
                  <button onClick={() => setActiveTab('claims')} className="mt-2 text-sm text-brand-600 hover:text-brand-700 font-semibold">Review →</button>
                )}
              </div>
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                <div className="text-gray-600">Registered Users</div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link href="/dashboard/import" className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-brand-600 hover:shadow-lg transition group">
                  <div className="text-4xl mb-3">📤</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600">Import CSV</h3>
                  <p className="text-gray-600">Bulk upload businesses</p>
                </Link>
                <Link href="/add-listing" className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-brand-600 hover:shadow-lg transition group">
                  <div className="text-4xl mb-3">➕</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600">Add Listing</h3>
                  <p className="text-gray-600">Create a new business</p>
                </Link>
                <Link href="/dashboard/scraper" className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:border-purple-600 hover:shadow-lg transition group">
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600">AI Scraper</h3>
                  <p className="text-gray-600">Discover businesses with AI</p>
                </Link>
                <button onClick={() => setActiveTab('reviews')} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-brand-600 hover:shadow-lg transition group text-left">
                  <div className="text-4xl mb-3">⭐</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600">Moderate Reviews</h3>
                  <p className="text-gray-600">Approve or reject reviews</p>
                  {stats.pendingReviews > 0 && (
                    <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">{stats.pendingReviews} pending</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Moderation</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 mb-1">Total Reviews</div>
                <div className="text-3xl font-bold text-gray-900">{reviews.length}</div>
              </div>
              <div className="bg-yellow-50 rounded-lg shadow p-6 border-2 border-yellow-200">
                <div className="text-sm text-yellow-700 mb-1">Pending</div>
                <div className="text-3xl font-bold text-yellow-900">{pendingReviews.length}</div>
              </div>
              <div className="bg-green-50 rounded-lg shadow p-6 border-2 border-green-200">
                <div className="text-sm text-green-700 mb-1">Approved</div>
                <div className="text-3xl font-bold text-green-900">{approvedReviews.length}</div>
              </div>
              <div className="bg-red-50 rounded-lg shadow p-6 border-2 border-red-200">
                <div className="text-sm text-red-700 mb-1">Rejected</div>
                <div className="text-3xl font-bold text-red-900">{rejectedReviews.length}</div>
              </div>
            </div>
            {loadingData ? (
              <div className="text-center py-12"><p className="text-gray-600">Loading reviews...</p></div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Reviews will appear here once customers start submitting them</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                    review.status === 'pending' ? 'border-yellow-400' : review.status === 'approved' ? 'border-green-400' : 'border-red-400'
                  }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{review.listing?.business_name || 'Unknown Business'}</h3>
                          {review.listing?.slug && (
                            <a href={`/listing/${review.listing.slug}`} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className={`w-5 h-5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</span>
                        </div>
                        {review.title && <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>}
                        {review.comment && <p className="text-gray-700 mb-3">{review.comment}</p>}
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{review.reviewer_name || 'Anonymous'}</span>
                          {review.reviewer_email && <span className="ml-2">({review.reviewer_email})</span>}
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : review.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>{review.status.toUpperCase()}</span>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      {review.status !== 'approved' && (
                        <button onClick={() => handleApproveReview(review.id)} disabled={loadingReview === review.id}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                          <Check className="w-4 h-4" />
                          {loadingReview === review.id ? 'Approving...' : 'Approve'}
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button onClick={() => handleRejectReview(review.id)} disabled={loadingReview === review.id}
                          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                          <X className="w-4 h-4" />
                          {loadingReview === review.id ? 'Rejecting...' : 'Reject'}
                        </button>
                      )}
                      <button onClick={() => handleDeleteReview(review.id, review.listing?.business_name || 'Unknown')} disabled={loadingReview === review.id}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ml-auto">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Listings</h2>
              <Link href="/add-listing" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition">+ Add Listing</Link>
            </div>
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-900 mb-2">🔍 Search Listings</label>
                  <input type="text" value={listingSearch} onChange={(e) => setListingSearch(e.target.value)}
                    placeholder="Search by business name, category, or parish..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" />
                </div>
                <div className="w-64">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Filter by Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none">
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="pending">Pending Only</option>
                    <option value="rejected">Rejected Only</option>
                  </select>
                </div>
                {(listingSearch || statusFilter !== 'all') && (
                  <button onClick={() => { setListingSearch(''); setStatusFilter('all') }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">Clear</button>
                )}
              </div>
              {(listingSearch || statusFilter !== 'all') && (
                <div className="mt-4 text-sm text-gray-600">
                  Showing {listings.filter(listing => {
                    const matchesSearch = !listingSearch ||
                      listing.business_name.toLowerCase().includes(listingSearch.toLowerCase()) ||
                      listing.category?.name.toLowerCase().includes(listingSearch.toLowerCase()) ||
                      listing.parish?.name.toLowerCase().includes(listingSearch.toLowerCase())
                    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
                    return matchesSearch && matchesStatus
                  }).length} of {listings.length} listings
                </div>
              )}
            </div>
            {loadingData ? (
              <div className="text-center py-12"><p className="text-gray-600">Loading listings...</p></div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Parish</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {listings.filter(listing => {
                      const matchesSearch = !listingSearch ||
                        listing.business_name.toLowerCase().includes(listingSearch.toLowerCase()) ||
                        listing.category?.name.toLowerCase().includes(listingSearch.toLowerCase()) ||
                        listing.parish?.name.toLowerCase().includes(listingSearch.toLowerCase())
                      const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
                      return matchesSearch && matchesStatus
                    }).map(listing => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{listing.business_name}</div>
                          <div className="text-sm text-gray-500">{listing.slug}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">{listing.category?.icon_emoji} {listing.category?.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{listing.parish?.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            listing.status === 'active' ? 'bg-green-100 text-green-700' :
                            listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>{listing.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {listing.status === 'pending' && (
                              <>
                                <button onClick={() => handleApproveListing(listing.id, listing.business_name)} disabled={loadingListing === listing.id}
                                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                                  <Check className="w-3 h-3" /> Approve
                                </button>
                                <button onClick={() => handleRejectListing(listing.id, listing.business_name)} disabled={loadingListing === listing.id}
                                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                                  <X className="w-3 h-3" /> Reject
                                </button>
                              </>
                            )}
                            {listing.status === 'active' && (
                              <button onClick={() => handleSetPending(listing.id, listing.business_name)} disabled={loadingListing === listing.id}
                                className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                                Set Pending
                              </button>
                            )}
                            {listing.status === 'rejected' && (
                              <button onClick={() => handleApproveListing(listing.id, listing.business_name)} disabled={loadingListing === listing.id}
                                className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                                <Check className="w-3 h-3" /> Approve
                              </button>
                            )}
                            <Link href={`/listing/${listing.slug}`} target="_blank" className="text-brand-600 hover:text-brand-700 font-semibold text-xs">View</Link>
                            <Link href={`/dashboard/edit/${listing.id}`} className="text-blue-600 hover:text-blue-700 font-semibold text-xs">Edit</Link>
                            <button onClick={() => handleDeleteListing(listing.id, listing.business_name)} className="text-red-600 hover:text-red-700 font-semibold text-xs">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {listings.filter(listing => {
                  const matchesSearch = !listingSearch ||
                    listing.business_name.toLowerCase().includes(listingSearch.toLowerCase()) ||
                    listing.category?.name.toLowerCase().includes(listingSearch.toLowerCase()) ||
                    listing.parish?.name.toLowerCase().includes(listingSearch.toLowerCase())
                  const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
                  return matchesSearch && matchesStatus
                }).length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                    <button onClick={() => { setListingSearch(''); setStatusFilter('all') }} className="text-brand-600 hover:text-brand-700 font-semibold">Clear filters</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'claims' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Claims</h2>
            {loadingData ? (
              <div className="text-center py-12"><p className="text-gray-600">Loading claims...</p></div>
            ) : claims.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">No pending claims to review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {claims.map(claim => (
                  <div key={claim.id} className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{claim.listing?.business_name || 'Unknown Business'}</h3>
                        <div className="text-gray-600 mb-2"><strong>Claimed by:</strong> {claim.user?.full_name || 'Unknown'} ({claim.user?.email || 'No email'})</div>
                        <div className="text-sm text-gray-500">Claimed: {new Date(claim.claimed_at).toLocaleDateString()}</div>
                      </div>
                      <div className="flex gap-2">
                        {claim.listing?.slug && (
                          <Link href={`/listing/${claim.listing.slug}`} target="_blank" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">View Listing</Link>
                        )}
                        <button onClick={() => handleApproveClaim(claim.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition">✓ Approve</button>
                        <button onClick={() => handleRejectClaim(claim.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition">✗ Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Users</h2>
            {loadingData ? (
              <div className="text-center py-12"><p className="text-gray-600">Loading users...</p></div>
            ) : (
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(userItem => (
                      <tr key={userItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{userItem.full_name || 'No name'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{userItem.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${userItem.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{userItem.role}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(userItem.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => handleChangeUserRole(userItem.id, userItem.full_name || userItem.email, userItem.role)}
                              className="text-brand-600 hover:text-brand-700 font-semibold text-sm">
                              Change Role
                            </button>
                            {userItem.id !== user.id && (
                              <button onClick={() => handleDeleteUser(userItem.id, userItem.full_name || userItem.email)}
                                className="text-red-600 hover:text-red-700 font-semibold text-sm">
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
{activeTab === 'blog' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
              <button
                onClick={() => { setShowBlogForm(!showBlogForm); setEditingPost(null); setBlogForm({ title: '', slug: '', excerpt: '', content: '', featured_image: '', author: 'AntiguaSearch Team', status: 'draft', meta_title: '', meta_description: '', tags: '' }) }}
                className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition"
              >
                {showBlogForm ? 'Cancel' : '+ New Post'}
              </button>
            </div>

            {showBlogForm && (
              <form onSubmit={handleBlogSubmit} className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">{editingPost ? 'Edit Post' : 'New Post'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Title *</label>
                    <input type="text" name="title" value={blogForm.title} onChange={handleBlogFormChange} required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Slug *</label>
                    <input type="text" name="slug" value={blogForm.slug} onChange={handleBlogFormChange} required
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Author</label>
                    <input type="text" name="author" value={blogForm.author} onChange={handleBlogFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Status</label>
                    <select name="status" value={blogForm.status} onChange={handleBlogFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Featured Image URL</label>
                  <input type="url" name="featured_image" value={blogForm.featured_image} onChange={handleBlogFormChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Tags (comma separated)</label>
                  <input type="text" name="tags" value={blogForm.tags} onChange={handleBlogFormChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" placeholder="Hotels, Antigua, Travel" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Excerpt</label>
                  <textarea name="excerpt" value={blogForm.excerpt} onChange={handleBlogFormChange} rows="2"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-1">Content (Markdown) *</label>
                  <textarea name="content" value={blogForm.content} onChange={handleBlogFormChange} required rows="16"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none font-mono text-sm resize-y" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Meta Title</label>
                    <input type="text" name="meta_title" value={blogForm.meta_title} onChange={handleBlogFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Meta Description</label>
                    <input type="text" name="meta_description" value={blogForm.meta_description} onChange={handleBlogFormChange}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="submit" className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition">
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                  <button type="button" onClick={() => { setShowBlogForm(false); setEditingPost(null) }}
                    className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition">Cancel</button>
                </div>
              </form>
            )}

            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogPosts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No blog posts yet. Create your first post above.</td>
                    </tr>
                  ) : blogPosts.map(post => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{post.title}</div>
                        <div className="text-sm text-gray-500">{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>{post.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(post.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          {post.status === 'published' && (
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700 font-semibold text-sm">View</a>
                          )}
                          <button onClick={() => handleEditPost(post)} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">Edit</button>
                          <button onClick={() => handleDeletePost(post.id, post.title)} className="text-red-600 hover:text-red-700 font-semibold text-sm">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'outreach' && (
          <OutreachTab listings={listings} />
        )}

      </div>
    </div>
  )
}