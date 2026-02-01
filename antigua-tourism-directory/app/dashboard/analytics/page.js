'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

export default function AnalyticsDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingPermissions, setCheckingPermissions] = useState(true)
  const [loadingData, setLoadingData] = useState(true)
  const [timeRange, setTimeRange] = useState(30) // days

  // Stats
  const [stats, setStats] = useState({
    totalPageviews: 0,
    uniqueSessions: 0,
    totalSearches: 0,
    totalClicks: 0,
    avgViewsPerDay: 0,
    clickThroughRate: 0
  })

  // Charts data
  const [trafficData, setTrafficData] = useState([])
  const [topListings, setTopListings] = useState([])
  const [topSearches, setTopSearches] = useState([])
  const [clickTypeData, setClickTypeData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [parishData, setParishData] = useState([])

  // Check admin permissions
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      checkAdminStatus()
    }
  }, [user, loading, router])

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data.role === 'admin') {
        setIsAdmin(true)
        loadAnalyticsData()
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
      router.push('/dashboard')
    } finally {
      setCheckingPermissions(false)
    }
  }

  const loadAnalyticsData = async () => {
    setLoadingData(true)
    try {
      await Promise.all([
        loadStats(),
        loadTrafficData(),
        loadTopListings(),
        loadTopSearches(),
        loadClickData(),
        loadCategoryData(),
        loadParishData()
      ])
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoadingData(false)
    }
  }

  const loadStats = async () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    // Total pageviews
    const { count: pageviews } = await supabase
      .from('analytics_pageviews')
      .select('*', { count: 'exact', head: true })
      .gte('viewed_at', startDate.toISOString())

    // Unique sessions
    const { data: sessions } = await supabase
      .from('analytics_pageviews')
      .select('session_id')
      .gte('viewed_at', startDate.toISOString())

    const uniqueSessions = new Set(sessions?.map(s => s.session_id)).size

    // Total searches
    const { count: searches } = await supabase
      .from('analytics_searches')
      .select('*', { count: 'exact', head: true })
      .gte('searched_at', startDate.toISOString())

    // Total clicks
    const { count: clicks } = await supabase
      .from('analytics_clicks')
      .select('*', { count: 'exact', head: true })
      .gte('clicked_at', startDate.toISOString())

    // Calculate CTR
    const ctr = pageviews > 0 ? ((clicks / pageviews) * 100).toFixed(2) : 0

    setStats({
      totalPageviews: pageviews || 0,
      uniqueSessions: uniqueSessions || 0,
      totalSearches: searches || 0,
      totalClicks: clicks || 0,
      avgViewsPerDay: pageviews ? Math.round(pageviews / timeRange) : 0,
      clickThroughRate: ctr
    })
  }

  const loadTrafficData = async () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    const { data } = await supabase
      .from('analytics_pageviews')
      .select('viewed_at')
      .gte('viewed_at', startDate.toISOString())
      .order('viewed_at', { ascending: true })

    // Group by day
    const grouped = {}
    data?.forEach(item => {
      const date = new Date(item.viewed_at).toISOString().split('T')[0]
      grouped[date] = (grouped[date] || 0) + 1
    })

    const chartData = Object.entries(grouped).map(([date, views]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      views
    }))

    setTrafficData(chartData)
  }

  const loadTopListings = async () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    const { data } = await supabase
      .from('analytics_pageviews')
      .select(`
        listing_id,
        listings(business_name, slug)
      `)
      .gte('viewed_at', startDate.toISOString())
      .not('listing_id', 'is', null)

    // Count views per listing
    const counts = {}
    data?.forEach(item => {
      if (item.listing_id) {
        if (!counts[item.listing_id]) {
          counts[item.listing_id] = {
            id: item.listing_id,
            name: item.listings?.business_name || 'Unknown',
            slug: item.listings?.slug,
            views: 0
          }
        }
        counts[item.listing_id].views++
      }
    })

    const sorted = Object.values(counts)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    setTopListings(sorted)
  }

  const loadTopSearches = async () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    const { data } = await supabase
      .from('analytics_searches')
      .select('search_term')
      .gte('searched_at', startDate.toISOString())

    // Count searches
    const counts = {}
    data?.forEach(item => {
      const term = item.search_term.toLowerCase()
      counts[term] = (counts[term] || 0) + 1
    })

    const sorted = Object.entries(counts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    setTopSearches(sorted)
  }

  const loadClickData = async () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    const { data } = await supabase
      .from('analytics_clicks')
      .select('click_type')
      .gte('clicked_at', startDate.toISOString())

    // Count by type
    const counts = {}
    data?.forEach(item => {
      counts[item.click_type] = (counts[item.click_type] || 0) + 1
    })

    const chartData = Object.entries(counts).map(([type, count]) => ({
      name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: count
    }))

    setClickTypeData(chartData)
  }

  const loadCategoryData = async () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    const { data } = await supabase
      .from('analytics_pageviews')
      .select(`
        listing_id,
        listings(category:categories(name))
      `)
      .gte('viewed_at', startDate.toISOString())
      .not('listing_id', 'is', null)

    // Count by category
    const counts = {}
    data?.forEach(item => {
      const category = item.listings?.category?.name
      if (category) {
        counts[category] = (counts[category] || 0) + 1
      }
    })

    const sorted = Object.entries(counts)
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8)

    setCategoryData(sorted)
  }

  const loadParishData = async () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - timeRange)

    const { data } = await supabase
      .from('analytics_pageviews')
      .select(`
        listing_id,
        listings(parish:parishes(name))
      `)
      .gte('viewed_at', startDate.toISOString())
      .not('listing_id', 'is', null)

    // Count by parish
    const counts = {}
    data?.forEach(item => {
      const parish = item.listings?.parish?.name
      if (parish) {
        counts[parish] = (counts[parish] || 0) + 1
      }
    })

    const sorted = Object.entries(counts)
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)

    setParishData(sorted)
  }

  const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1']

  if (loading || checkingPermissions) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your directory's performance and insights</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => {
                  setTimeRange(Number(e.target.value))
                  loadAnalyticsData()
                }}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
              <Link
                href="/dashboard/admin"
                className="text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                ← Back to Admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingData ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Total Views</span>
                  <span className="text-2xl">👁️</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalPageviews.toLocaleString()}</div>
                <p className="text-sm text-gray-500 mt-1">{stats.avgViewsPerDay} per day avg</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Unique Visitors</span>
                  <span className="text-2xl">👥</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.uniqueSessions.toLocaleString()}</div>
                <p className="text-sm text-gray-500 mt-1">Unique sessions</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Searches</span>
                  <span className="text-2xl">🔍</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalSearches.toLocaleString()}</div>
                <p className="text-sm text-gray-500 mt-1">Search queries</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm font-semibold">Click Rate</span>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stats.clickThroughRate}%</div>
                <p className="text-sm text-gray-500 mt-1">{stats.totalClicks} total clicks</p>
              </div>
            </div>

            {/* Traffic Chart */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📈 Traffic Over Time</h2>
              {trafficData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#4F46E5" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No traffic data yet</p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Top Listings */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">🏆 Top Performing Listings</h2>
                {topListings.length > 0 ? (
                  <div className="space-y-4">
                    {topListings.map((listing, index) => (
                      <div key={listing.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                          <div>
                            <Link
                              href={`/listing/${listing.slug}`}
                              className="font-semibold text-gray-900 hover:text-indigo-600"
                            >
                              {listing.name}
                            </Link>
                            <p className="text-sm text-gray-500">{listing.views} views</p>
                          </div>
                        </div>
                        <div className="text-indigo-600 font-bold text-lg">{listing.views}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No listing data yet</p>
                )}
              </div>

              {/* Top Searches */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">🔍 Popular Searches</h2>
                {topSearches.length > 0 ? (
                  <div className="space-y-4">
                    {topSearches.map((search, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                          <div>
                            <p className="font-semibold text-gray-900">"{search.term}"</p>
                            <p className="text-sm text-gray-500">{search.count} searches</p>
                          </div>
                        </div>
                        <div className="text-indigo-600 font-bold text-lg">{search.count}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No search data yet</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Click Types */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">🎯 Click Types</h2>
                {clickTypeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={clickTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {clickTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No click data yet</p>
                )}
              </div>

              {/* Category Performance */}
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Views by Category</h2>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-8">No category data yet</p>
                )}
              </div>
            </div>

            {/* Parish Distribution */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">📍 Views by Parish</h2>
              {parishData.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {parishData.map((parish, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">{parish.name}</p>
                      <p className="text-2xl font-bold text-indigo-600">{parish.views}</p>
                      <p className="text-xs text-gray-500">views</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No parish data yet</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}