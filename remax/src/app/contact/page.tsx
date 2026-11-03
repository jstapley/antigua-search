'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Phone, Mail, Calendar, Send, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

const AGENTS = [
  {
    name: 'Michel Lamdan-Glass',
    title: 'Real Estate Agent',
    phone: '+1 268-724-9308',
    phoneHref: 'tel:+12687249308',
    whatsapp: 'https://wa.me/12687249308?text=Hi%20Michel%2C%20I%27m%20interested%20in%20a%20property%20on%20your%20website',
    email: 'michelglass@remax-365-antigua.com',
    image: 'https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/Michel-scaled.jpg',
    schedule: '/contact/schedule',
    showSchedule: true,
  },
  {
    name: 'Luka Bruschi',
    title: 'Real Estate Agent',
    phone: '+1 (268) 717-6720',
    phoneHref: 'tel:+12687176720',
    whatsapp: 'https://wa.me/12687176720?text=Hi%20Luka%2C%20I%27m%20interested%20in%20a%20property%20on%20your%20website',
    email: 'luka@remax-365-antigua.com',
    image: 'https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/luka-bruschi.jpeg',
    schedule: null,
    showSchedule: false,
  },
  {
    name: 'Ron Chapman',
    title: 'Real Estate Agent',
    phone: '+1 268-720-4504',
    phoneHref: 'tel:+12687204504',
    whatsapp: 'https://wa.me/12687204505?text=Hello%20I%27m%20interested%20in%20one%20of%20your%20listings',
    email: 'ron@remax-365-antigua.com',
    image: 'https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/ron.webp',
    schedule: null,
    showSchedule: false,
  },
  {
    name: 'Stephanie Murphy',
    title: 'Real Estate Agent',
    phone: '+1 570-877-4259',
    phoneHref: 'tel:+15708774259',
    whatsapp: '',
    email: 'Stephanie@remax-365-antigua.com',
    image: '',
    schedule: null,
    showSchedule: false,
  },
]

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ContactForm() {
  const searchParams = useSearchParams()
  const propertySlug = searchParams.get('property')
  const propertyTitle = searchParams.get('title')
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: propertyTitle ? `I'm interested in: ${propertyTitle}` : '',
  })
  const [honeypot, setHoneypot] = useState('')
  const loadedAt = useRef(Date.now())
  const [turnstileToken, setTurnstileToken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      if (turnstileRef.current && (window as any).turnstile) {
        widgetIdRef.current = (window as any).turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => setTurnstileToken(''),
          'error-callback': () => setTurnstileToken(''),
        })
      }
    }

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return // Bot filled the hidden field — silently drop
    if (!turnstileToken) {
      setError('Please complete the security check.')
      return
    }
    setSubmitting(true)
    setError('')
    const elapsed = Date.now() - loadedAt.current

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, property_slug: propertySlug, turnstileToken, elapsed }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to send')
      }
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again or call us directly.')
      // Reset Turnstile on error
      if (widgetIdRef.current && (window as any).turnstile) {
        (window as any).turnstile.reset(widgetIdRef.current)
        setTurnstileToken('')
      }
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

      {/* Honeypot — hidden from humans, bots fill it */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
      </div>

      {/* Turnstile widget */}
      <div ref={turnstileRef} />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !turnstileToken}
        className="w-full bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        {submitting ? 'Sending...' : (<><Send size={16} /> Send Message</>)}
      </button>
    </form>
  )
}

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0c2749] mb-8">Contact RE/MAX 365 Antigua</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left column — Agent cards */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-navy-700">Meet Our Agents</h2>
            {AGENTS.map(agent => (
              <div key={agent.name} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-navy-100 flex-shrink-0 bg-gray-100">
                    {agent.image ? (
                      <Image src={agent.image} alt={agent.name} fill className="object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#0c2749]">
                        <span className="text-white text-sm font-bold">
                          {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-navy-700">{agent.name}</h3>
                    <p className="text-gray-400 text-xs">{agent.title}</p>
                    {agent.phone && (
                      <a href={agent.phoneHref} className="flex items-center gap-1.5 text-gray-500 hover:text-navy-700 text-xs mt-1 transition-colors">
                        <Phone size={11} /> {agent.phone}
                      </a>
                    )}
                    {agent.email && (
                      <a href={`mailto:${agent.email}`} className="flex items-center gap-1.5 text-gray-500 hover:text-navy-700 text-xs mt-0.5 transition-colors truncate">
                        <Mail size={11} /> {agent.email}
                      </a>
                    )}
                  </div>
                </div>
                {(agent.whatsapp || agent.showSchedule) && (
                  <div className={`grid gap-2 ${agent.showSchedule ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    {agent.whatsapp && (
                      <a href={agent.whatsapp} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 rounded-xl font-semibold text-xs transition-colors">
                        <WhatsAppIcon /> WhatsApp
                      </a>
                    )}
                    {agent.showSchedule && agent.schedule && (
                      <a href={agent.schedule}
                        className="flex items-center justify-center gap-1.5 border-2 border-amber-400 text-amber-600 hover:bg-amber-400 hover:text-white py-2.5 rounded-xl font-semibold text-xs transition-colors">
                        <Calendar size={13} /> Schedule a Call
                      </a>
                    )}
                  </div>
                )}
                {!agent.whatsapp && !agent.showSchedule && (
                  <p className="text-xs text-gray-400 text-center italic">Contact details coming soon</p>
                )}
              </div>
            ))}
          </div>

          {/* Right column — Contact form */}
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