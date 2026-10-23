'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('cookie_notice_dismissed')
      if (!dismissed) {
        const timer = setTimeout(() => setVisible(true), 1000)
        return () => clearTimeout(timer)
      }
    } catch (e) {}
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem('cookie_notice_dismissed', 'true')
    } catch (e) {}
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
              AntiguaSearch.com uses cookies to analyse site traffic and improve your experience.
              By continuing to use this site you agree to our use of cookies.
              <a href="/privacy" className="text-brand-400 hover:text-brand-300 underline ml-1">Learn more</a>
            </p>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <button
              onClick={dismiss}
              className="w-full md:w-auto px-8 py-3 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-500 text-white transition whitespace-nowrap"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}