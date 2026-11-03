'use client'

import { useState, useEffect } from 'react'
import { Mail, Send, Eye, RefreshCw, Users, Home, Calendar, FlaskConical } from 'lucide-react'

interface Property {
  id: string
  title: string
  slug: string
  price: number
  currency: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  location: string
  images: string[]
  short_description: string | null
  created_at: string
}

interface NewsletterHistory {
  id: string
  sent_at: string
  subject: string
  property_count: number
  recipient_count: number
  status: string
}

function formatPrice(price: number, currency: string) {
  return `${currency} $${price.toLocaleString()}`
}

export default function NewsletterPage() {
  const [lastSent, setLastSent] = useState<NewsletterHistory | null>(null)
  const [newProperties, setNewProperties] = useState<Property[]>([])
  const [recipientCount, setRecipientCount] = useState(0)
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [testSending, setTestSending] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [showTestInput, setShowTestInput] = useState(false)
  const [preview, setPreview] = useState(false)
  const [sent, setSent] = useState(false)
  const [testSent, setTestSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [historyRes, recipientsRes] = await Promise.all([
        fetch('/api/admin/newsletters'),
        fetch('/api/admin/newsletters/recipients'),
      ])
      const history = await historyRes.json()
      const recipients = await recipientsRes.json()

      const last = Array.isArray(history) && history.length > 0 ? history[0] : null
      setLastSent(last)
      setRecipientCount(recipients.count || 0)

      const now = new Date()
      const quarter = Math.ceil((now.getMonth() + 1) / 3)
      setSubject(`RE/MAX 365 Antigua — New Listings | Q${quarter} ${now.getFullYear()}`)
    } catch (e) {
      setError('Failed to load newsletter data')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    try {
      const since = lastSent?.sent_at || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
      const res = await fetch(`/api/admin/newsletters/properties?since=${since}`)
      const data = await res.json()
      setNewProperties(Array.isArray(data) ? data : [])
      setPreview(true)
    } catch (e) {
      setError('Failed to generate newsletter')
    } finally {
      setGenerating(false)
    }
  }

  const handleTestSend = async () => {
    if (!testEmail.trim()) { setError('Please enter a test email address'); return }
    setTestSending(true)
    setError('')
    setTestSent(false)
    try {
      const res = await fetch('/api/admin/newsletters/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: `[TEST] ${subject}`, properties: newProperties, testEmail: testEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send test')
      setTestSent(true)
      setShowTestInput(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send test email')
    } finally {
      setTestSending(false)
    }
  }

  const handleSend = async () => {
    if (!confirm(`Send newsletter to ${recipientCount} recipients?`)) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/admin/newsletters/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, properties: newProperties }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setSent(true)
      setPreview(false)
      loadData()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send newsletter')
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-64">
      <div className="w-6 h-6 border-2 border-[#0c2749] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#0c2749]">Newsletter</h1>
        <p className="text-gray-400 text-sm mt-0.5">Generate and send property newsletters to your client list.</p>
      </div>

      {sent && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm mb-6 flex items-center gap-2">
          <Send size={15} /> Newsletter sent successfully!
        </div>
      )}

      {testSent && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-blue-700 text-sm mb-6 flex items-center gap-2">
          <FlaskConical size={15} /> Test email sent to {testEmail}!
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-500 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Calendar size={18} className="text-[#0c2749]" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Last Sent</p>
            <p className="font-semibold text-[#0c2749] text-sm">
              {lastSent ? new Date(lastSent.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Users size={18} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Recipients</p>
            <p className="font-semibold text-[#0c2749] text-sm">{recipientCount} clients</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Home size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Last Newsletter</p>
            <p className="font-semibold text-[#0c2749] text-sm">
              {lastSent ? `${lastSent.property_count} properties` : '—'}
            </p>
          </div>
        </div>
      </div>

      {!preview ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-[#0c2749] mb-4">Generate Newsletter</h2>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749]"
            />
          </div>
          <p className="text-sm text-gray-500 mb-5">
            This will pull all properties added since{' '}
            <strong>{lastSent ? new Date(lastSent.sent_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'the beginning'}</strong>
            {' '}and generate a preview for you to review before sending.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            {generating ? <RefreshCw size={15} className="animate-spin" /> : <Eye size={15} />}
            {generating ? 'Generating...' : 'Generate Preview'}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#0c2749]">Preview</h2>
              <button onClick={() => { setPreview(false); setTestSent(false) }} className="text-sm text-gray-400 hover:text-gray-600">← Back</button>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-5">
              <span className="bg-blue-50 text-[#0c2749] px-3 py-1 rounded-full font-medium">{newProperties.length} properties</span>
              <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium">{recipientCount} recipients</span>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749]"
              />
            </div>

            {newProperties.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Home size={32} className="mx-auto mb-3 text-gray-200" />
                <p className="text-sm">No new properties since the last newsletter.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {/* Test send */}
                <div>
                  {!showTestInput ? (
                    <button
                      onClick={() => { setShowTestInput(true); setTestSent(false) }}
                      className="flex items-center gap-2 border-2 border-[#0c2749] text-[#0c2749] hover:bg-[#0c2749] hover:text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                      <FlaskConical size={15} /> Send Test Email
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        value={testEmail}
                        onChange={e => setTestEmail(e.target.value)}
                        placeholder="test@example.com"
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] w-56"
                        onKeyDown={e => e.key === 'Enter' && handleTestSend()}
                      />
                      <button
                        onClick={handleTestSend}
                        disabled={testSending}
                        className="flex items-center gap-1.5 bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                      >
                        {testSending ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                        {testSending ? 'Sending...' : 'Send'}
                      </button>
                      <button onClick={() => setShowTestInput(false)} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
                    </div>
                  )}
                </div>

                {/* Real send */}
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  {sending ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
                  {sending ? 'Sending...' : `Send to ${recipientCount} Recipients`}
                </button>
              </div>
            )}
          </div>

          {/* Property preview cards */}
          {newProperties.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-[#0c2749] mb-4">Properties in this Newsletter</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {newProperties.map(p => (
                  <div key={p.id} className="flex gap-3 border border-gray-100 rounded-xl p-3">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt={p.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-[#0c2749] text-sm truncate">{p.title}</p>
                      <p className="text-gray-400 text-xs">{p.location}</p>
                      <p className="text-blue-600 font-semibold text-sm mt-1">{formatPrice(p.price, p.currency)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Send history */}
      {lastSent && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-[#0c2749] mb-4">Recent Sends</h2>
          <div className="text-sm text-gray-600">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span>{lastSent.subject}</span>
              <span className="text-gray-400 text-xs">{new Date(lastSent.sent_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span>{lastSent.property_count} properties</span>
              <span>{lastSent.recipient_count} recipients</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}