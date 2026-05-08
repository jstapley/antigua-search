'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent')
      if (!consent) {
        // Small delay so it doesn't flash on first paint
        const timer = setTimeout(() => setVisible(true), 1000)
        return () => clearTimeout(timer)
      }
    } catch (e) {}
  }, [])

  const updateConsent = (granted) => {
    try {
      localStorage.setItem('cookie_consent', granted ? 'accepted' : 'declined')
    } catch (e) {}

    // Update GA4 consent state
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'ad_storage': granted ? 'granted' : 'denied',
        'analytics_storage': granted ? 'granted' : 'denied',
        'ad_user_data': granted ? 'granted' : 'denied',
        'ad_personalization': granted ? 'granted' : 'denied'
      })
    }

    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🍪</span>
              <h3 className="font-bold text-white text-base">We use cookies</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              We use cookies to analyse site traffic and improve your experience on AntiguaSearch.com. 
              You can accept all cookies or decline non-essential ones. 
              <a href="/privacy" className="text-brand-400 hover:text-brand-300 underline ml-1">Privacy Policy</a>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full md:w-auto">
            <button
              onClick={() => updateConsent(false)}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-gray-700 hover:bg-gray-600 text-white transition border border-gray-600 whitespace-nowrap"
            >
              Decline
            </button>
            <button
              onClick={() => updateConsent(true)}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 text-white transition whitespace-nowrap"
            >
              Accept All
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}