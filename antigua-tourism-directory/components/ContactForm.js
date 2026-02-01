'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    businessInquiry: false
  })
  
  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ submitting: true, submitted: false, error: null })

    try {
      // Option 1: Send to GHL via API endpoint (if you have API key)
      // Option 2: Send to your own API route that forwards to GHL
      // Option 3: Just save to Supabase and manually import to GHL
      
      // For now, let's use a Next.js API route that will handle GHL integration
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      // Success!
      setStatus({ submitting: false, submitted: true, error: null })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        businessInquiry: false
      })

      // Hide success message after 5 seconds
      setTimeout(() => {
        setStatus({ submitting: false, submitted: false, error: null })
      }, 5000)

    } catch (error) {
      console.error('Contact form error:', error)
      setStatus({ 
        submitting: false, 
        submitted: false, 
        error: 'Failed to send message. Please try again or email us directly.' 
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Message */}
      {status.submitted && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">✅</div>
          <h3 className="text-xl font-bold text-green-900 mb-2">Message Sent!</h3>
          <p className="text-green-700">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
        </div>
      )}

      {/* Error Message */}
      {status.error && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">❌</div>
          <h3 className="text-xl font-bold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{status.error}</p>
        </div>
      )}

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border-2 border-gray-200 p-8">
        {/* Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
            placeholder="+1 268 XXX XXXX"
          />
        </div>

        {/* Subject */}
        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-bold text-gray-900 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
            placeholder="How can we help you?"
          />
        </div>

        {/* Message */}
        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none resize-none"
            placeholder="Tell us more about your inquiry..."
          />
        </div>

        {/* Business Inquiry Checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="businessInquiry"
              checked={formData.businessInquiry}
              onChange={handleChange}
              className="mt-1 w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-indigo-600"
            />
            <span className="text-sm text-gray-700">
              This is a business inquiry (listing your business, advertising, partnerships)
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status.submitting}
          className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {status.submitting ? '✉️ Sending...' : '📨 Send Message'}
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          * Required fields. We typically respond within 24 hours.
        </p>
      </form>
    </div>
  )
}