'use client'

import { useEffect } from 'react'

export default function SchedulePage() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
  <div className="pt-20 pb-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0c2749] mb-3">Schedule a Call</h1>
        <p className="text-gray-500 text-base">Book a time to speak with one of our agents about buying or selling property in Antigua.</p>
      </div>
      <div
        className="calendly-inline-widget rounded-2xl overflow-hidden shadow-sm border border-gray-100"
        data-url="https://calendly.com/remax-365-antigua/new-meeting"
        style={{ minWidth: '320px', height: '1200px' }}
      />
    </div>
  </div>
  )
}
