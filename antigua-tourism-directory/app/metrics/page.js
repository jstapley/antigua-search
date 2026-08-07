'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MONTHLY_VISITOR_COUNT } from '@/lib/constants'

export default function MetricsDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // July 2026 - 30-day trend data
  const trendData = [
    { date: '1 Jul', users: 101 },
    { date: '2 Jul', users: 116 },
    { date: '3 Jul', users: 100 },
    { date: '4 Jul', users: 106 },
    { date: '5 Jul', users: 91 },
    { date: '6 Jul', users: 149 },
    { date: '7 Jul', users: 225 },
    { date: '8 Jul', users: 150 },
    { date: '9 Jul', users: 122 },
    { date: '10 Jul', users: 122 },
    { date: '11 Jul', users: 114 },
    { date: '12 Jul', users: 117 },
    { date: '13 Jul', users: 126 },
    { date: '14 Jul', users: 103 },
    { date: '15 Jul', users: 107 },
    { date: '16 Jul', users: 89 },
    { date: '17 Jul', users: 127 },
    { date: '18 Jul', users: 103 },
    { date: '19 Jul', users: 117 },
    { date: '20 Jul', users: 137 },
    { date: '21 Jul', users: 141 },
    { date: '22 Jul', users: 115 },
    { date: '23 Jul', users: 162 },
    { date: '24 Jul', users: 138 },
    { date: '25 Jul', users: 146 },
    { date: '26 Jul', users: 102 },
    { date: '27 Jul', users: 142 },
    { date: '28 Jul', users: 143 },
    { date: '29 Jul', users: 134 },
    { date: '30 Jul', users: 139 },
  ]

  // Top countries - July 2026
  const countries = [
    { name: 'Antigua & Barbuda', sessions: 1911 },
    { name: 'United States', sessions: 1135 },
    { name: 'Singapore', sessions: 374 },
    { name: 'United Kingdom', sessions: 274 },
    { name: 'Canada', sessions: 176 },
  ]

  // Top channels - July 2026
  const channels = [
    { name: 'Organic Search', sessions: 3581 },
    { name: 'Direct', sessions: 936 },
    { name: 'AI Assistant', sessions: 117 },
    { name: 'Unassigned', sessions: 20 },
    { name: 'Referral', sessions: 12 },
  ]

  // Top blog posts - July 2026
  const blogPosts = [
    { title: 'Antigua Carnival 2026: Costumes, Mas Bands & Playing', sessions: 242 },
    { title: 'Shirley Heights Antigua: Complete Guide', sessions: 155 },
    { title: 'Sir Vivian Richards Stadium: Visitor Guide', sessions: 104 },
    { title: 'Getting Around Antigua Without a Car', sessions: 72 },
    { title: 'Private Clinics, Medical Labs & Urgent Care Guide', sessions: 57 },
  ]

  // Top listings - July 2026
  const listings = [
    { name: 'Woods Urgent Care', sessions: 63 },
    { name: 'Perry Bay Supermarket', sessions: 47 },
    { name: 'Jackson Trucking, Backhoe & Water Delivery Services', sessions: 35 },
    { name: 'Antigua & Barbuda Transport Board Inspection Centre', sessions: 33 },
    { name: 'Veg International', sessions: 24 },
  ]

  const maxCountry = Math.max(...countries.map(c => c.sessions))
  const maxChannel = Math.max(...channels.map(c => c.sessions))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/antigua-flag.png" alt="Antigua Flag" width={50} height={50} className="rounded-full" />
              <div>
                <div className="text-lg md:text-xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
                <div className="text-xs md:text-sm text-brand-600 font-semibold">ANTIGUA SEARCH</div>
              </div>
            </Link>

            <nav className="hidden lg:flex gap-6 items-center">
              <Link href="/" className="text-gray-700 hover:text-brand-600 font-medium">Home</Link>
              <Link href="/parishes" className="text-gray-700 hover:text-brand-600 font-medium">Browse Parishes</Link>
              <Link href="/categories" className="text-gray-700 hover:text-brand-600 font-medium">Categories</Link>
              <Link href="/about" className="text-gray-700 hover:text-brand-600 font-medium">About Us</Link>
              <Link href="/blog" className="text-gray-700 hover:text-brand-600 font-medium">Blog</Link>
              <Link href="/contact" className="text-gray-700 hover:text-brand-600 font-medium">Contact</Link>
              <Link href="/login" className="text-gray-700 hover:text-brand-600 font-medium">Login</Link>
              <Link href="/add-listing" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition">
                + Add Your Business
              </Link>
            </nav>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-gray-700 p-2" aria-label="Toggle menu">
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3">
              <Link href="/" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/parishes" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Browse Parishes</Link>
              <Link href="/categories" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link href="/about" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link href="/blog" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/contact" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link href="/login" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/add-listing" className="block bg-brand-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-brand-700 transition text-center" onClick={() => setMobileMenuOpen(false)}>+ Add Your Business</Link>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">AntiguaSearch Traffic & Metrics</h1>
          <p className="text-xl text-white/90 max-w-2xl mb-2">
            Real-time data showing thousands of visitors discovering businesses in Antigua & Barbuda every month. See why businesses choose to advertise with us.
          </p>
          <p className="text-white/70 text-sm mb-8">Report period: July 1 – July 31, 2026</p>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <div className="text-white/80 text-sm font-medium mb-2">Active Users (July)</div>
              <div className="text-4xl font-bold">3,738</div>
              <div className="text-green-200 text-sm mt-2">↑ 29.5% growth</div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <div className="text-white/80 text-sm font-medium mb-2">Total Sessions</div>
              <div className="text-4xl font-bold">4,695</div>
              <div className="text-green-200 text-sm mt-2">↑ 37.0% increase</div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <div className="text-white/80 text-sm font-medium mb-2">New Users</div>
              <div className="text-4xl font-bold">3,642</div>
              <div className="text-green-200 text-sm mt-2">↑ 28.3% growth</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* 30-Day Trend */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">July Active Users Trend</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                interval={1}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar
                dataKey="users"
                fill="#2563eb"
                label={{ position: 'top', fill: '#1f2937', fontSize: 11, fontWeight: 500 }}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-gray-600 text-sm mt-4">Peak traffic on July 7th with 225 active users. Consistent upward trend through the month, closing with a strong final week.</p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Top Countries */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top 5 Countries</h3>
            <div className="space-y-4">
              {countries.map((country, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-brand-600">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-900">{country.name}</span>
                    </div>
                    <div className="ml-11 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-600 h-full transition-all"
                        style={{ width: `${(country.sessions / maxCountry) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-gray-900">{country.sessions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">sessions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Channels */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top 5 Traffic Channels</h3>
            <div className="space-y-4">
              {channels.map((channel, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-brand-600">
                        {idx + 1}
                      </div>
                      <span className="font-medium text-gray-900">{channel.name}</span>
                    </div>
                    <div className="ml-11 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-brand-600 h-full transition-all"
                        style={{ width: `${(channel.sessions / maxChannel) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-bold text-gray-900">{channel.sessions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">sessions</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Blog Posts & Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Top Blog Posts */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top 5 Blog Posts</h3>
            <div className="space-y-3">
              {blogPosts.map((post, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700 truncate">{post.title}</span>
                  </div>
                  <span className="font-semibold text-brand-600 ml-2 flex-shrink-0">{post.sessions}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Listings */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Top 5 Business Listings</h3>
            <div className="space-y-3">
              {listings.map((listing, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700 truncate">{listing.name}</span>
                  </div>
                  <span className="font-semibold text-brand-600 ml-2 flex-shrink-0">{listing.sessions}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-brand-600 to-blue-600 rounded-lg shadow-lg p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Reach 3,700+ Active Users Monthly
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            Your business could be featured in front of thousands of potential customers searching for services in Antigua & Barbuda every single day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/advertise?tier=featured"
              className="bg-white text-brand-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block"
            >
              Upgrade to a featured listing today
            </Link>
            <Link
              href="/contact?subject=Featured%20Listing%20Inquiry"
              className="bg-white/20 border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/30 transition inline-block"
            >
              Learn More
            </Link>
          </div>

          <p className="text-sm text-white/80 mt-6">
            Featured listings get priority placement and appear in organic search results, driving more qualified leads to your business.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Engagement Rate</h4>
            <p className="text-3xl font-bold text-gray-900">44.05%</p>
            <p className="text-sm text-gray-600 mt-2">Visitors actively engage with business listings and content</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Avg. Views Per User</h4>
            <p className="text-3xl font-bold text-gray-900">1.72</p>
            <p className="text-sm text-gray-600 mt-2">Users browse multiple listings and pages per visit</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bounce Rate</h4>
            <p className="text-3xl font-bold text-gray-900">55.95%</p>
            <p className="text-sm text-gray-600 mt-2">Slight increase but engagement rate remains healthy</p>
          </div>
        </div>
      </div>
    </div>
  )
}