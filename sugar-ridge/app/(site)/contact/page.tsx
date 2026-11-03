'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  property: z.string().optional(),
  message: z.string().min(10, 'Please include a brief message'),
})

type FormData = z.infer<typeof schema>

function ContactForm() {
  const params = useSearchParams()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      property: params.get('property') ?? '',
    },
  })

  async function onSubmit(data: FormData) {
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try calling us directly.')
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-10 shadow-sm border border-[#e8dfd0] text-center">
        <CheckCircle size={48} className="text-[#7BC9BF] mx-auto mb-4" />
        <h2 className="font-serif text-2xl text-[#19130b] mb-2">Thank You!</h2>
        <p className="text-gray-500">
          We&apos;ll be in touch within 24 hours to arrange your viewing.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-8 shadow-sm border border-[#e8dfd0] space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#19130b] mb-1.5">Full Name *</label>
          <input
            {...register('name')}
            className="w-full border border-[#e8dfd0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20 focus:border-[#3d0000]"
            placeholder="Your name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#19130b] mb-1.5">Email Address *</label>
          <input
            {...register('email')}
            type="email"
            className="w-full border border-[#e8dfd0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20 focus:border-[#3d0000]"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#19130b] mb-1.5">Phone Number</label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full border border-[#e8dfd0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20 focus:border-[#3d0000]"
            placeholder="+1 (268) ..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#19130b] mb-1.5">Property of Interest</label>
          <input
            {...register('property')}
            className="w-full border border-[#e8dfd0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20 focus:border-[#3d0000]"
            placeholder="e.g. Sea La Vie, Lot 10..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#19130b] mb-1.5">Message *</label>
        <textarea
          {...register('message')}
          rows={5}
          className="w-full border border-[#e8dfd0] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3d0000]/20 focus:border-[#3d0000] resize-none"
          placeholder="Tell us about your interest, preferred viewing dates, or any questions..."
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#3d0000] text-white py-3 rounded-lg font-semibold hover:bg-[#6b0000] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        <Send size={16} />
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-[#3d0000] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#7BC9BF] text-sm font-semibold tracking-widest uppercase mb-3">Get in Touch</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-[#19130b] mb-6">Request a Viewing</h2>
            <Suspense fallback={<div className="h-96 bg-white rounded-xl animate-pulse" />}>
              <ContactForm />
            </Suspense>
          </div>

          {/* Contact info */}
          <div>
            <h2 className="font-serif text-2xl text-[#19130b] mb-6">Our Details</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#3d0000]/10 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-[#3d0000]" />
                </div>
                <div>
                  <p className="font-semibold text-[#19130b] text-sm mb-0.5">Phone</p>
                  <a href="tel:+12685627701" className="text-gray-500 hover:text-[#3d0000] transition-colors text-sm">
                    +1 (268) 562-7701
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#3d0000]/10 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-[#3d0000]" />
                </div>
                <div>
                  <p className="font-semibold text-[#19130b] text-sm mb-0.5">Email</p>
                  <a href="mailto:info@sugarridgehomes.com" className="text-gray-500 hover:text-[#3d0000] transition-colors text-sm">
                    info@sugarridgehomes.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#3d0000]/10 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-[#3d0000]" />
                </div>
                <div>
                  <p className="font-semibold text-[#19130b] text-sm mb-0.5">Location</p>
                  <p className="text-gray-500 text-sm">
                    Sugar Ridge<br />
                    Antigua &amp; Barbuda<br />
                    West Indies
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-5 bg-[#f8f5f0] rounded-xl">
              <p className="font-semibold text-[#19130b] text-sm mb-1">Office Hours</p>
              <p className="text-gray-500 text-sm">Monday – Friday: 9am – 5pm</p>
              <p className="text-gray-500 text-sm">Saturday: 10am – 2pm</p>
              <p className="text-gray-400 text-xs mt-2">Atlantic Standard Time (AST)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
