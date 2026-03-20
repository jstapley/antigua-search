'use client'

import { useState, useRef } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'

export default function ContactForm({ defaultSubject = '' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: defaultSubject,
    message: '',
    businessInquiry: false
  })
  
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  })

  const [turnstileToken, setTurnstileToken] = useState(null)
  const turnstileRef = useRef(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!turnstileToken) {
      setStatus({ submitting: false, submitted: false, error: 'Please complete the security check.' })
      return
    }

    setStatus({ submitting: true, submitted: false, error: null })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstileToken })
      })

      if (!response.ok) throw new Error('Failed to submit form')

      setStatus({ submitting: false, submitted: true, error: null })
      setFormData({ name: '', email: '', phone: '', subject: defaultSubject, message: '', businessInquiry: false })
      setTurnstileToken(null)
      turnstileRef.current?.reset()

      setTimeout(() => {
        setStatus({ submitting: false, submitted: false, error: null })
      }, 5000)

    } catch (error) {
      console.error('Contact form error:', error)
      setStatus({ submitting: false, submitted: false, error: 'Failed to send message. Please try again or email us directly.' })
      turnstileRef.current?.reset()
      setTurnstileToken(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {status.submitted && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="text-xl font-bold text-green-900 mb-2">Message Sent!</h3>
          <p className="text-green-700">Thank you for contacting us. We&apos;ll get back to you within 24 hours.</p>
        </div>
      )}

      {status.error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">❌</div>
          <h3 className="text-xl font-bold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{status.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border-2 border-gray-200 p-8">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">Your Name *</label>
          <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" placeholder="John Doe" />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">Email Address *</label>
          <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" placeholder="john@example.com" />
        </div>
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" placeholder="+1 268 XXX XXXX" />
        </div>
        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-bold text-gray-900 mb-2">Subject *</label>
          <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none" placeholder="How can we help you?" />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">Message *</label>
          <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none resize-none"
            placeholder="Tell us more about your inquiry..." />
        </div>
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="businessInquiry" checked={formData.businessInquiry} onChange={handleChange}
              className="mt-1 w-5 h-5 text-brand-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-brand-600" />
            <span className="text-sm text-gray-700">This is a business inquiry (listing your business, advertising, partnerships)</span>
          </label>
        </div>

        {/* Cloudflare Turnstile */}
        <div className="mb-6">
          <Turnstile
            ref={turnstileRef}
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onExpire={() => setTurnstileToken(null)}
            onError={() => {
              setTurnstileToken(null)
              setStatus(prev => ({ ...prev, error: 'Security check failed. Please refresh and try again.' }))
            }}
          />
        </div>

        <button type="submit" disabled={status.submitting || !turnstileToken}
          className="w-full bg-brand-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-brand-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
          {status.submitting ? '✉️ Sending...' : '📨 Send Message'}
        </button>
        <p className="text-sm text-gray-500 text-center mt-4">* Required fields. We typically respond within 24 hours.</p>
      </form>
    </div>
  )
}