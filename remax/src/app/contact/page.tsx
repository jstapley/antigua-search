'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react'

function ContactForm() {
  const searchParams = useSearchParams()
  const propertySlug = searchParams.get('property')
  const propertyTitle = searchParams.get('title')
  const type = searchParams.get('type')

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: propertyTitle ? `I'm interested in: ${propertyTitle}` : '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, property_slug: propertySlug }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or call us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 size={56} className="text-green-500 mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold text-navy-700 mb-2">Message Sent!</h3>
        <p className="text-gray-500">We'll get back to you within 24 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          placeholder="+1 (268) 000-0000"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none"
          placeholder="Tell us what you're looking for..."
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        {submitting ? 'Sending...' : (<><Send size={16} /> Send Message</>)}
      </button>
    </form>
  )
}

export default function ContactPage() {
  return (
    <div className="pt-20 pb-20">
      <div className="bg-navy-700 py-16 text-center text-white mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
        <p className="text-gray-300">We're here to help you find your dream property</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-700 mb-6">Get In Touch</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-navy-700" />
                </div>
                <div>
                  <p className="font-semibold text-navy-700 text-sm">Phone</p>
                  <a href="tel:+12687249308" className="text-gray-600 hover:text-navy-700 transition-colors">+1 268-724-9308</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-navy-700" />
                </div>
                <div>
                  <p className="font-semibold text-navy-700 text-sm">Email</p>
                  <a href="mailto:info@remax365antigua.com" className="text-gray-600 hover:text-navy-700 transition-colors">info@remax365antigua.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-navy-700" />
                </div>
                <div>
                  <p className="font-semibold text-navy-700 text-sm">Location</p>
                  <p className="text-gray-600">St. John's, Antigua</p>
                </div>
              </div>
            </div>

            {/* Schedule a meeting */}
            <div className="mt-8 p-5 bg-gold-50 border border-gold-200 rounded-2xl">
              <h3 className="font-semibold text-navy-700 mb-2">📅 Schedule a Meeting</h3>
              <p className="text-sm text-gray-600 mb-4">
                Book a free consultation directly in our calendar.
              </p>
              <a
                href="/contact/schedule"
                className="block w-full text-center bg-gold-500 hover:bg-gold-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Book a Time Slot
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-navy-700 mb-6">Send Us a Message</h2>
            <Suspense fallback={<div className="animate-pulse">Loading form...</div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
