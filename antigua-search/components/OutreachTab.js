'use client'

import { useState, useEffect } from 'react'

const DEFAULT_TEMPLATES = [
  {
    id: 'unclaimed_listing',
    name: 'Unclaimed Listing',
    campaign_type: 'unclaimed_listing',
    subject: 'Your business is listed on AntiguaSearch.com',
    html_body: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <img src="https://www.antiguasearch.com/antigua-flag.png" alt="AntiguaSearch" style="width:48px;border-radius:50%;margin-bottom:16px;" />
  <h2 style="color:#1d4ed8;margin:0 0 16px;">Your business is on AntiguaSearch.com!</h2>
  <p>Hi {{contact_name}},</p>
  <p>Great news — <strong>{{business_name}}</strong> has been listed on <a href="https://www.antiguasearch.com">AntiguaSearch.com</a>, Antigua & Barbuda's local business directory.</p>
  <p>Your listing is live right now:</p>
  <p style="margin:24px 0;">
    <a href="{{listing_url}}" style="background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View Your Listing →</a>
  </p>
  <p>Claiming your listing is <strong>completely free</strong> and takes just 2 minutes. Once claimed, you can:</p>
  <ul>
    <li>Update your business information</li>
    <li>Add photos and contact details</li>
    <li>Respond to customer reviews</li>
    <li>Track how many people view your listing</li>
  </ul>
  <p style="margin:24px 0;">
    <a href="https://www.antiguasearch.com/login" style="background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Claim Your Free Listing →</a>
  </p>
  <p style="color:#666;font-size:13px;">Questions? Reply to this email and we'll help you get set up.</p>
  <p style="color:#666;font-size:13px;">— The AntiguaSearch Team</p>
</div>`
  },
  {
    id: 'featured_upsell',
    name: 'Featured Listing Upsell',
    campaign_type: 'featured_upsell',
    subject: 'Stand out on AntiguaSearch — Featured listings now available',
    html_body: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <img src="https://www.antiguasearch.com/antigua-flag.png" alt="AntiguaSearch" style="width:48px;border-radius:50%;margin-bottom:16px;" />
  <h2 style="color:#1d4ed8;margin:0 0 16px;">⭐ Get more customers with a Featured Listing</h2>
  <p>Hi {{contact_name}},</p>
  <p>Thanks for being part of AntiguaSearch.com. Your listing for <strong>{{business_name}}</strong> is live and visible to visitors searching for {{category}} in {{parish}}.</p>
  <p>Did you know you could appear <strong>at the very top</strong> of your category?</p>
  <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:16px;margin:20px 0;">
    <p style="margin:0;font-weight:600;">⭐ Featured Listing — EC$350/year</p>
    <ul style="margin:8px 0 0;">
      <li>Priority placement at the top of {{category}}</li>
      <li>Featured badge on your listing</li>
      <li>Highlighted in search results</li>
      <li>More visibility, more customers</li>
    </ul>
  </div>
  <p style="margin:24px 0;">
    <a href="https://www.antiguasearch.com/pricing" style="background:#f59e0b;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Upgrade to Featured →</a>
  </p>
  <p style="color:#666;font-size:13px;">Questions about featured listings? Just reply to this email.</p>
  <p style="color:#666;font-size:13px;">— The AntiguaSearch Team</p>
</div>`
  },
  {
    id: 'advertising_pitch',
    name: 'Advertising Pitch',
    campaign_type: 'advertising_pitch',
    subject: 'Advertise on AntiguaSearch.com — Reach thousands of visitors',
    html_body: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <img src="https://www.antiguasearch.com/antigua-flag.png" alt="AntiguaSearch" style="width:48px;border-radius:50%;margin-bottom:16px;" />
  <h2 style="color:#1d4ed8;margin:0 0 16px;">Advertise {{business_name}} on AntiguaSearch.com</h2>
  <p>Hi {{contact_name}},</p>
  <p>AntiguaSearch.com is Antigua & Barbuda's fastest-growing business directory, reaching thousands of tourists and locals every month who are actively searching for businesses, restaurants, activities and services.</p>
  <p>We'd love to offer <strong>{{business_name}}</strong> a premium advertising spot that puts your brand in front of exactly the right audience.</p>
  <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin:20px 0;">
    <p style="margin:0;font-weight:600;">📢 Advertising Packages</p>
    <ul style="margin:8px 0 0;">
      <li><strong>Banner Ad:</strong> EC$200/month — prominent placement across category pages</li>
      <li><strong>Sponsored Listing:</strong> EC$300/month — top-of-page sponsored result</li>
      <li><strong>Premium Package:</strong> EC$500/month — banner + sponsored listing + featured</li>
    </ul>
  </div>
  <p>All packages include monthly performance reports showing impressions and clicks.</p>
  <p style="margin:24px 0;">
    <a href="mailto:jeff@stapleyinc.com?subject=Advertising Enquiry — {{business_name}}" style="background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Get in Touch →</a>
  </p>
  <p style="color:#666;font-size:13px;">Reply to this email or call us to discuss the right package for {{business_name}}.</p>
  <p style="color:#666;font-size:13px;">— Jeff Stapley, AntiguaSearch.com</p>
</div>`
  },
  {
  id: 'review_exchange',
  name: 'Free Featured Listing (Review Exchange)',
  campaign_type: 'follow_up',
  subject: 'A free gift for {{business_name}} — no strings attached',
  html_body: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <img src="https://www.antiguasearch.com/antigua-flag.png" alt="AntiguaSearch" style="width:48px;border-radius:50%;margin-bottom:16px;" />
  <h2 style="color:#1d4ed8;margin:0 0 16px;">⭐ A free gift for {{business_name}}</h2>
  <p>Hi {{business_name}} team,</p>
  <p>Your business is listed on <a href="{{listing_url}}">AntiguaSearch.com</a> — Antigua & Barbuda's local business directory, visited by thousands of tourists and locals every month.</p>
  <p>We'd love to feature {{business_name}} at the top of your category for <strong>3 months, completely free</strong>. No payment, no commitment.</p>
  <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:20px 0;">
    <p style="margin:0;font-weight:600;">🎁 Here's the deal:</p>
    <ul style="margin:8px 0 0;">
      <li>Leave us a <strong>Google review</strong> sharing your experience with AntiguaSearch</li>
      <li>We'll upgrade {{business_name}} to a <strong>Featured Listing for 3 months</strong> — no charge</li>
      <li>Featured listings appear at the top of search results with a highlighted badge</li>
    </ul>
  </div>
  <p style="margin:24px 0;">
    <a href="https://g.page/r/CZyWPtFyWLYCEBM/review" style="background:#10b981;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Leave a Google Review →</a>
  </p>
  <p>Once you've left a review, just reply to this email and we'll activate your featured listing within 24 hours.</p>
  <p style="color:#666;font-size:13px;">Questions? Just reply to this email.</p>
  <p style="color:#666;font-size:13px;">— Jeff Stapley, AntiguaSearch.com</p>
  <p style="color:#999;font-size:11px;text-align:center;">Don't want to hear from us? <a href="mailto:jeff@stapleyinc.com?subject=Unsubscribe&body=Please remove me from your mailing list" style="color:#999;">Unsubscribe</a></p>
</div>`
}
]

const CAMPAIGN_LABELS = {
  unclaimed_listing: 'Unclaimed Listing',
  featured_upsell: 'Featured Upsell',
  advertising_pitch: 'Advertising Pitch',
  follow_up: 'Follow Up'
}

const STATUS_STYLES = {
  sent: 'bg-blue-100 text-blue-700',
  opened: 'bg-green-100 text-green-700',
  clicked: 'bg-purple-100 text-purple-700',
  failed: 'bg-red-100 text-red-700'
}

const PAGE_SIZE = 20

export default function OutreachTab({ listings }) {
  const [activeSection, setActiveSection] = useState('compose')
  const [templates, setTemplates] = useState(DEFAULT_TEMPLATES)

  // Compose state
  const [selectedListingId, setSelectedListingId] = useState('')
  const [selectedListing, setSelectedListing] = useState(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [overrideEmail, setOverrideEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [htmlBody, setHtmlBody] = useState('')
  const [notes, setNotes] = useState('')
  const [preview, setPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState(null)
  const [listingSearch, setListingSearch] = useState('')

  // Contact log state
  const [contacts, setContacts] = useState([])
  const [loadingContacts, setLoadingContacts] = useState(false)
  const [campaignFilter, setCampaignFilter] = useState('all')
  const [contactSearch, setContactSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingNotes, setEditingNotes] = useState(null)
  const [notesValue, setNotesValue] = useState('')

  // Template editor state
  const [editingTemplate, setEditingTemplate] = useState(null)

  // Bulk send state
  const [bulkListings, setBulkListings] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkSelected, setBulkSelected] = useState(new Set())
  const [bulkTemplateId, setBulkTemplateId] = useState('')
  const [bulkSubject, setBulkSubject] = useState('')
  const [bulkHtmlBody, setBulkHtmlBody] = useState('')
  const [bulkSending, setBulkSending] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(null)
  const [bulkSearch, setBulkSearch] = useState('')

  useEffect(() => {
    if (activeSection === 'log') loadContacts()
    if (activeSection === 'bulk') loadBulkListings()
    setCurrentPage(1)
  }, [activeSection, campaignFilter])

  useEffect(() => {
    if (!bulkTemplateId) return
    const template = templates.find(t => t.id === bulkTemplateId)
    if (template) {
      setBulkSubject(template.subject)
      setBulkHtmlBody(template.html_body)
    }
    // Reload to update previously_contacted flags for this campaign
    loadBulkListings(template?.campaign_type)
  }, [bulkTemplateId])

  useEffect(() => {
    if (selectedListingId) {
      const listing = listings.find(l => l.id === selectedListingId)
      setSelectedListing(listing || null)
      setOverrideEmail(listing?.contact_email?.trim() || listing?.email?.trim() || '[email not provided]')
    } else {
      setSelectedListing(null)
      setOverrideEmail('')
    }
  }, [selectedListingId, listings])

  useEffect(() => {
    if (selectedTemplateId) {
      const template = templates.find(t => t.id === selectedTemplateId)
      if (template) {
        setSubject(template.subject)
        setHtmlBody(template.html_body)
      }
    }
  }, [selectedTemplateId, templates])

  const loadBulkListings = async (campaign_type) => {
    setBulkLoading(true)
    try {
      const params = new URLSearchParams()
      const ct = campaign_type || templates.find(t => t.id === bulkTemplateId)?.campaign_type
      if (ct) params.set('campaign_type', ct)
      const res = await fetch(`/api/admin/bulk-outreach?${params}`)
      const data = await res.json()
      setBulkListings(Array.isArray(data) ? data : [])
      setBulkSelected(new Set())
    } catch (err) {
      console.error(err)
    } finally {
      setBulkLoading(false)
    }
  }

  const loadContacts = async () => {
    setLoadingContacts(true)
    try {
      const params = new URLSearchParams()
      if (campaignFilter !== 'all') params.set('campaign_type', campaignFilter)
      const res = await fetch(`/api/admin/email-contacts?${params}`)
      const data = await res.json()
      setContacts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingContacts(false)
    }
  }

  const mergeTags = (text) => {
    if (!selectedListing) return text
    return text
      .replaceAll('{{business_name}}', selectedListing.business_name || '')
      .replaceAll('{{category}}', selectedListing.category?.name || '')
      .replaceAll('{{parish}}', selectedListing.parish?.name || '')
      .replaceAll('{{listing_url}}', `https://www.antiguasearch.com/listing/${selectedListing.slug}`)
      .replaceAll('{{contact_name}}', selectedListing.contact_name || '')
      .replaceAll('{{phone}}', selectedListing.phone || '')
      .replaceAll('{{website}}', selectedListing.website || '')
  }

  const handleSend = async () => {
    if (!selectedListingId || !overrideEmail || overrideEmail === '[email not provided]' || !subject || !htmlBody) {
      alert('Please select a business, enter a valid email address, and fill in the subject and body.')
      return
    }
    const template = templates.find(t => t.id === selectedTemplateId)
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch('/api/admin/send-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: selectedListingId,
          template_id: null,
          campaign_type: template?.campaign_type || 'follow_up',
          sent_to: overrideEmail,
          subject,
          html_body: htmlBody,
          notes
        })
      })
      const data = await res.json()
      if (data.success) {
        setSendResult({ type: 'success', message: `Email sent successfully to ${overrideEmail}` })
        setNotes('')
      } else {
        setSendResult({ type: 'error', message: data.error || 'Failed to send' })
      }
    } catch (err) {
      setSendResult({ type: 'error', message: err.message })
    } finally {
      setSending(false)
    }
  }

  const handleBulkSend = async () => {
    const selectedIds = [...bulkSelected]
    if (!selectedIds.length || !bulkSubject || !bulkHtmlBody || !bulkTemplateId) return
    const template = templates.find(t => t.id === bulkTemplateId)
    if (!confirm(`Send "${bulkSubject}" to ${selectedIds.length} business${selectedIds.length !== 1 ? 'es' : ''}?`)) return

    setBulkSending(true)
    setBulkProgress({ sent: 0, failed: 0, total: selectedIds.length, errors: [], current: '' })

    for (let i = 0; i < selectedIds.length; i++) {
      const listing = bulkListings.find(l => l.id === selectedIds[i])
      setBulkProgress(prev => ({ ...prev, current: listing?.business_name || '' }))
      try {
        const res = await fetch('/api/admin/send-outreach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listing_id: selectedIds[i],
            campaign_type: template?.campaign_type || 'unclaimed_listing',
            sent_to: listing?.effective_email,
            subject: bulkSubject,
            html_body: bulkHtmlBody,
          })
        })
        const data = await res.json()
        if (data.success) {
          setBulkProgress(prev => ({ ...prev, sent: prev.sent + 1 }))
        } else {
          setBulkProgress(prev => ({
            ...prev,
            failed: prev.failed + 1,
            errors: [...prev.errors, { business: listing?.business_name, error: data.error || 'Unknown error' }]
          }))
        }
      } catch (err) {
        setBulkProgress(prev => ({
          ...prev,
          failed: prev.failed + 1,
          errors: [...prev.errors, { business: listing?.business_name, error: err.message }]
        }))
      }
      if (i < selectedIds.length - 1) await new Promise(r => setTimeout(r, 300))
    }

    setBulkSending(false)
    setBulkProgress(prev => ({ ...prev, current: '' }))
    // Reload to update previously_contacted flags
    loadBulkListings(template?.campaign_type)
    setBulkSelected(new Set())
  }

  const handleSaveNotes = async (contactId) => {
    await fetch('/api/admin/email-contacts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: contactId, notes: notesValue })
    })
    setContacts(prev => prev.map(c => c.id === contactId ? { ...c, notes: notesValue } : c))
    setEditingNotes(null)
  }

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Delete this contact log entry?')) return
    const res = await fetch('/api/admin/email-contacts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: contactId })
    })
    if (res.ok) {
      setContacts(prev => prev.filter(c => c.id !== contactId))
    } else {
      alert('Could not delete entry. Please try again.')
    }
  }

  const handleSaveTemplate = (templateId) => {
    setTemplates(prev => prev.map(t => t.id === templateId ? { ...t, ...editingTemplate } : t))
    setEditingTemplate(null)
  }

  const filteredListings = listings
    .filter(l =>
      !listingSearch ||
      l.business_name?.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.category?.name?.toLowerCase().includes(listingSearch.toLowerCase()) ||
      l.parish?.name?.toLowerCase().includes(listingSearch.toLowerCase())
    )
    .sort((a, b) => (a.business_name || '').localeCompare(b.business_name || ''))

  const filteredContacts = contacts.filter(c =>
    !contactSearch || c.listing?.business_name?.toLowerCase().includes(contactSearch.toLowerCase())
  )
  const totalPages = Math.ceil(filteredContacts.length / PAGE_SIZE)
  const paginatedContacts = filteredContacts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {[
          { id: 'compose', label: '✉️ Compose & Send' },
          { id: 'bulk', label: '📦 Bulk Send' },
          { id: 'log', label: '📋 Contact Log' },
          { id: 'templates', label: '📝 Templates' }
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 font-semibold border-b-2 transition whitespace-nowrap ${
              activeSection === s.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Select Business *</label>
              <input
                type="text"
                placeholder="Search businesses..."
                value={listingSearch}
                onChange={e => setListingSearch(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none mb-2 text-sm"
              />
              <select
                value={selectedListingId}
                onChange={e => setSelectedListingId(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
              >
                <option value="">— Choose a business —</option>
                {filteredListings.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.business_name} ({l.category?.name}, {l.parish?.name})
                  </option>
                ))}
              </select>
            </div>

            {selectedListing && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
                <div className="font-semibold text-gray-900">{selectedListing.business_name}</div>
                <div className="text-gray-500">{selectedListing.category?.name} · {selectedListing.parish?.name}</div>
                {(selectedListing.contact_email?.trim() || selectedListing.email?.trim()) && (
                  <div className="text-gray-500">📧 {selectedListing.contact_email?.trim() || selectedListing.email?.trim()}</div>
                )}
                {selectedListing.phone && <div className="text-gray-500">📞 {selectedListing.phone}</div>}
                {selectedListing.contact_name && <div className="text-gray-500">👤 {selectedListing.contact_name}</div>}
                <a href={`/listing/${selectedListing.slug}`} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline text-xs">View listing →</a>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Send To (Email) *</label>
              <input
                type="email"
                placeholder="recipient@email.com"
                value={overrideEmail}
                onChange={e => setOverrideEmail(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Template</label>
              <select
                value={selectedTemplateId}
                onChange={e => setSelectedTemplateId(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
              >
                <option value="">— Start from scratch —</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-900">Email Body (HTML) *</label>
                <button onClick={() => setPreview(!preview)} className="text-xs text-brand-600 hover:underline">
                  {preview ? 'Edit HTML' : 'Preview'}
                </button>
              </div>
              {preview ? (
                <div
                  className="border-2 border-gray-200 rounded-lg p-4 min-h-64 bg-white overflow-auto"
                  dangerouslySetInnerHTML={{ __html: mergeTags(htmlBody) }}
                />
              ) : (
                <textarea
                  value={htmlBody}
                  onChange={e => setHtmlBody(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none font-mono text-xs resize-y"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Internal Notes (not sent)</label>
              <input
                type="text"
                placeholder="e.g. Owner called back, interested in featured..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
              />
            </div>

            {sendResult && (
              <div className={`p-4 rounded-lg text-sm font-medium ${
                sendResult.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {sendResult.message}
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={sending || !selectedListingId || !overrideEmail || overrideEmail === '[email not provided]' || !subject || !htmlBody}
              className="w-full bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {sending ? 'Sending...' : '✉️ Send Email'}
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Available merge tags</h3>
            <div className="space-y-2">
              {[
                ['{{business_name}}', 'Business name'],
                ['{{category}}', 'Category'],
                ['{{parish}}', 'Parish'],
                ['{{listing_url}}', 'Full listing URL'],
                ['{{contact_name}}', 'Contact name'],
                ['{{phone}}', 'Phone number'],
                ['{{website}}', 'Website URL'],
              ].map(([tag, desc]) => (
                <div key={tag} className="flex items-center gap-3 text-sm">
                  <code className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs font-mono text-brand-700 whitespace-nowrap">{tag}</code>
                  <span className="text-gray-500">{desc}</span>
                  {selectedListing && (
                    <span className="text-gray-400 text-xs truncate">{mergeTags(tag)}</span>
                  )}
                </div>
              ))}
            </div>
            {selectedListing && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Subject preview</h3>
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700">
                  {mergeTags(subject) || <span className="text-gray-400">Enter a subject...</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === 'bulk' && (() => {
        const filteredBulk = bulkListings.filter(l =>
          !bulkSearch ||
          l.business_name?.toLowerCase().includes(bulkSearch.toLowerCase()) ||
          l.category?.name?.toLowerCase().includes(bulkSearch.toLowerCase()) ||
          l.parish?.name?.toLowerCase().includes(bulkSearch.toLowerCase()) ||
          l.effective_email?.toLowerCase().includes(bulkSearch.toLowerCase())
        )
        const allSelected = filteredBulk.length > 0 && filteredBulk.every(l => bulkSelected.has(l.id))
        return (
          <div className="space-y-6">
            {/* Template selection */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">1. Choose a Template</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Template *</label>
                    <select
                      value={bulkTemplateId}
                      onChange={e => setBulkTemplateId(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
                    >
                      <option value="">— Choose a template —</option>
                      {templates.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  {bulkTemplateId && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Subject</label>
                        <input
                          type="text"
                          value={bulkSubject}
                          onChange={e => setBulkSubject(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Email Body (HTML)</label>
                        <textarea
                          value={bulkHtmlBody}
                          onChange={e => setBulkHtmlBody(e.target.value)}
                          rows={8}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none font-mono text-xs resize-y"
                        />
                      </div>
                    </>
                  )}
                </div>
                {bulkTemplateId && bulkListings.length > 0 && (() => {
                  const preview = bulkSelected.size > 0
                    ? bulkListings.find(l => bulkSelected.has(l.id))
                    : bulkListings[0]
                  const previewMerge = (text) => !preview ? text : text
                    .replaceAll('{{business_name}}', preview.business_name || '')
                    .replaceAll('{{category}}', preview.category?.name || '')
                    .replaceAll('{{parish}}', preview.parish?.name || '')
                    .replaceAll('{{listing_url}}', `https://www.antiguasearch.com/listing/${preview.slug}`)
                    .replaceAll('{{contact_name}}', preview.contact_name || '')
                    .replaceAll('{{phone}}', preview.phone || '')
                    .replaceAll('{{website}}', preview.website || '')
                  return (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Preview — {preview?.business_name}
                      </div>
                      <div className="text-xs text-gray-600 mb-3 font-medium">{previewMerge(bulkSubject)}</div>
                      <div
                        className="bg-white border border-gray-200 rounded-lg p-3 text-xs overflow-auto max-h-64"
                        dangerouslySetInnerHTML={{ __html: previewMerge(bulkHtmlBody) }}
                      />
                    </div>
                  )
                })()}
              </div>
            </div>

            {/* Business selector */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-gray-900">
                  2. Select Businesses
                  {bulkListings.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {bulkListings.length} unclaimed with email
                    </span>
                  )}
                </h3>
                {bulkListings.length > 0 && (
                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => setBulkSelected(allSelected ? new Set() : new Set(filteredBulk.map(l => l.id)))}
                      className="text-sm text-brand-600 hover:underline font-semibold"
                    >
                      {allSelected ? 'Deselect all' : `Select all ${filteredBulk.length}`}
                    </button>
                    <button
                      onClick={() => loadBulkListings()}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>

              {bulkLoading ? (
                <div className="text-center py-8 text-gray-500">Loading unclaimed businesses...</div>
              ) : bulkListings.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No unclaimed businesses with email addresses found.
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Search by name, category, parish, or email..."
                    value={bulkSearch}
                    onChange={e => setBulkSearch(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none text-sm mb-4"
                  />
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {filteredBulk.length === 0 ? (
                      <div className="text-center py-6 text-gray-400">No results for "{bulkSearch}"</div>
                    ) : filteredBulk.map(l => (
                      <label
                        key={l.id}
                        className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                          bulkSelected.has(l.id) ? 'border-brand-600 bg-brand-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={bulkSelected.has(l.id)}
                          onChange={e => {
                            setBulkSelected(prev => {
                              const next = new Set(prev)
                              e.target.checked ? next.add(l.id) : next.delete(l.id)
                              return next
                            })
                          }}
                          className="w-4 h-4 accent-brand-600 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-gray-900 truncate">{l.business_name}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {l.category?.name}{l.parish?.name ? ` · ${l.parish.name}` : ''} · {l.effective_email}
                          </div>
                        </div>
                        {l.previously_contacted && (
                          <span className="shrink-0 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            Already contacted
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    {bulkSelected.size} selected
                  </div>
                </>
              )}
            </div>

            {/* Send / progress */}
            {bulkProgress ? (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">
                    {bulkSending ? 'Sending...' : 'Done'}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {bulkProgress.sent + bulkProgress.failed} / {bulkProgress.total}
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-300 bg-brand-600"
                    style={{ width: `${((bulkProgress.sent + bulkProgress.failed) / bulkProgress.total) * 100}%` }}
                  />
                </div>
                <div className="flex gap-6 text-sm">
                  <span className="text-green-600 font-semibold">✓ {bulkProgress.sent} sent</span>
                  {bulkProgress.failed > 0 && (
                    <span className="text-red-600 font-semibold">✗ {bulkProgress.failed} failed</span>
                  )}
                  {bulkSending && bulkProgress.current && (
                    <span className="text-gray-500">Sending to {bulkProgress.current}...</span>
                  )}
                </div>
                {bulkProgress.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs space-y-1">
                    {bulkProgress.errors.map((e, i) => (
                      <div key={i} className="text-red-700"><strong>{e.business}:</strong> {e.error}</div>
                    ))}
                  </div>
                )}
                {!bulkSending && (
                  <button
                    onClick={() => setBulkProgress(null)}
                    className="text-sm text-brand-600 hover:underline"
                  >
                    ← Send another batch
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={handleBulkSend}
                disabled={bulkSending || bulkSelected.size === 0 || !bulkTemplateId || !bulkSubject || !bulkHtmlBody}
                className="w-full bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                📦 Send to {bulkSelected.size} business{bulkSelected.size !== 1 ? 'es' : ''}
              </button>
            )}
          </div>
        )
      })()}

      {activeSection === 'log' && (
        <div>
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <input
              type="text"
              placeholder="Search business name..."
              value={contactSearch}
              onChange={e => { setContactSearch(e.target.value); setCurrentPage(1) }}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none text-sm w-56"
            />
            <select
              value={campaignFilter}
              onChange={e => setCampaignFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
            >
              <option value="all">All campaigns</option>
              <option value="unclaimed_listing">Unclaimed Listing</option>
              <option value="featured_upsell">Featured Upsell</option>
              <option value="advertising_pitch">Advertising Pitch</option>
              <option value="follow_up">Follow Up</option>
            </select>
            <button onClick={loadContacts} className="text-sm text-brand-600 hover:underline">Refresh</button>
            <span className="text-sm text-gray-500 ml-auto">{filteredContacts.length} records</span>
          </div>

          {loadingContacts ? (
            <div className="text-center py-12 text-gray-500">Loading...</div>
          ) : contacts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No outreach yet</h3>
              <p className="text-gray-600">Emails you send will appear here with open and click tracking.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl border-2 border-gray-200 overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Business</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Campaign</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Sent To</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Notes</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedContacts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-12 text-center text-gray-500">
                          No results for "{contactSearch}"
                        </td>
                      </tr>
                    ) : paginatedContacts.map(contact => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-sm text-gray-900">{contact.listing?.business_name || 'Unknown'}</div>
                          {contact.listing?.slug && (
                            <a href={`/listing/${contact.listing.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:underline">View →</a>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-gray-600">
                          {CAMPAIGN_LABELS[contact.campaign_type] || contact.campaign_type}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-[160px] truncate">{contact.sent_to}</td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${STATUS_STYLES[contact.status] || 'bg-gray-100 text-gray-700'}`}>
                              {contact.status}
                            </span>
                            {contact.opened_at && (
                              <div className="text-xs text-gray-400">Opened {new Date(contact.opened_at).toLocaleDateString()}</div>
                            )}
                            {contact.clicked_at && (
                              <div className="text-xs text-purple-500">Clicked {new Date(contact.clicked_at).toLocaleDateString()}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(contact.sent_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {editingNotes === contact.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={notesValue}
                                onChange={e => setNotesValue(e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 w-32 focus:outline-none focus:border-brand-600"
                                onKeyDown={e => e.key === 'Enter' && handleSaveNotes(contact.id)}
                                autoFocus
                              />
                              <button onClick={() => handleSaveNotes(contact.id)} className="text-xs text-green-600 font-semibold">Save</button>
                              <button onClick={() => setEditingNotes(null)} className="text-xs text-gray-400">Cancel</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingNotes(contact.id); setNotesValue(contact.notes || '') }}
                              className="text-xs text-gray-500 hover:text-brand-600 text-left"
                            >
                              {contact.notes || <span className="text-gray-300 italic">Add note</span>}
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-xs text-red-400 hover:text-red-600 font-semibold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages} ({filteredContacts.length} records)
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                          ? totalPages - 4 + i
                          : currentPage - 2 + i
                      if (page < 1 || page > totalPages) return null
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 text-sm border rounded-lg transition ${
                            currentPage === page
                              ? 'bg-brand-600 text-white border-brand-600'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeSection === 'templates' && (
        <div className="space-y-6">
          {templates.map(template => (
            <div key={template.id} className="bg-white border-2 border-gray-200 rounded-xl p-6">
              {editingTemplate?.id === template.id ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">{template.name}</h3>
                    <div className="flex gap-3">
                      <button onClick={() => handleSaveTemplate(template.id)} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-700 transition">Save</button>
                      <button onClick={() => setEditingTemplate(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition">Cancel</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Subject</label>
                    <input
                      type="text"
                      value={editingTemplate.subject}
                      onChange={e => setEditingTemplate(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">HTML Body</label>
                    <textarea
                      value={editingTemplate.html_body}
                      onChange={e => setEditingTemplate(prev => ({ ...prev, html_body: e.target.value }))}
                      rows={14}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none font-mono text-xs resize-y"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{template.name}</h3>
                      <span className="text-xs text-gray-500">{CAMPAIGN_LABELS[template.campaign_type]}</span>
                    </div>
                    <button
                      onClick={() => setEditingTemplate({ ...template })}
                      className="text-sm text-brand-600 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Subject:</span> {template.subject}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-500 max-h-32 overflow-y-auto">
                    {template.html_body.substring(0, 300)}...
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}