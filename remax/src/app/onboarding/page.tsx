'use client'

import { useState, useRef } from 'react'
import { Check, ChevronRight, ChevronLeft, Upload, X, User, MapPin, Briefcase, Home, FileText } from 'lucide-react'
import Image from 'next/image'

const STEPS = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Background', icon: Briefcase },
  { id: 4, label: 'Preferences', icon: Home },
  { id: 5, label: 'Documents', icon: FileText },
]

const PREFERENCES = [
  'Ocean Front', 'Ocean View', 'Mountain View', 'Garden View',
  '1 Bedroom', '2 Bedroom', '3+ Bedroom',
  'Pool', 'Gated Community', 'Beach Access', 'Furnished',
]

const COUNTRIES = [
  'Antigua and Barbuda', 'United States', 'United Kingdom', 'Canada',
  'Australia', 'France', 'Germany', 'Italy', 'Spain', 'Switzerland',
  'United Arab Emirates', 'Other',
]

const MARITAL_STATUS = ['Single', 'Married', 'Common Law', 'Divorced', 'Widowed']

interface FormData {
  first_name: string
  last_name: string
  email: string
  phone: string
  street_address: string
  city: string
  state: string
  country: string
  postal_code: string
  nationality: string
  marital_status: string
  pep: boolean
  pep_affiliation: string
  occupation: string
  employer: string
  preferences: string[]
  budget: string
  notes: string
}

const defaultForm: FormData = {
  first_name: '', last_name: '', email: '', phone: '',
  street_address: '', city: '', state: '', country: '', postal_code: '', nationality: '',
  marital_status: '',
  pep: false, pep_affiliation: '', occupation: '', employer: '',
  preferences: [], budget: '', notes: '',
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(defaultForm)
  const [passport, setPassport] = useState<File | null>(null)
  const [passportPreview, setPassportPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof FormData, value: string | boolean | string[]) =>
    setForm(f => ({ ...f, [key]: value }))

  const togglePref = (pref: string) => {
    setForm(f => ({
      ...f,
      preferences: f.preferences.includes(pref)
        ? f.preferences.filter(p => p !== pref)
        : [...f.preferences, pref],
    }))
  }

  const handlePassport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPassport(file)
    if (file.type.startsWith('image/')) {
      setPassportPreview(URL.createObjectURL(file))
    } else {
      setPassportPreview(null)
    }
  }

  const validateStep = () => {
    if (step === 1 && !form.first_name.trim()) {
      setError('First name is required.')
      return false
    }
    if (step === 1 && !form.email.trim()) {
      setError('Email is required.')
      return false
    }
    setError('')
    return true
  }

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 5)) }
  const back = () => { setError(''); setStep(s => Math.max(s - 1, 1)) }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) fd.append(k, v.join(','))
        else fd.append(k, String(v))
      })
      if (passport) fd.append('passport', passport)

      const res = await fetch('/api/onboarding', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors bg-white'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5'

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#0c2749] mb-2">Thank You!</h2>
          <p className="text-gray-500 mb-6">Your onboarding form has been submitted successfully. A member of our team will be in touch shortly.</p>
          <a href="/" className="inline-block bg-[#0c2749] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#0a1f3a] transition-colors">
            Return to Website
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/website-logo.png"
            alt="RE/MAX 365 Antigua"
            className="h-14 w-auto mx-auto mb-4"
          />
          <h1 className="font-display text-3xl font-bold text-[#0c2749]">Client Onboarding</h1>
          <p className="text-gray-400 mt-2 text-sm">Please complete all sections so we can find your perfect property.</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  step > s.id ? 'bg-green-500' : step === s.id ? 'bg-[#0c2749]' : 'bg-gray-200'
                }`}>
                  {step > s.id
                    ? <Check size={16} className="text-white" />
                    : <s.icon size={16} className={step === s.id ? 'text-white' : 'text-gray-400'} />
                  }
                </div>
                <span className={`text-xs mt-1 font-medium hidden sm:block ${step === s.id ? 'text-[#0c2749]' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {/* ── Step 1: Personal Info ── */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-[#0c2749] mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>First Name *</label>
                  <input value={form.first_name} onChange={e => set('first_name', e.target.value)}
                    className={inputClass} placeholder="Jane" />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input value={form.last_name} onChange={e => set('last_name', e.target.value)}
                    className={inputClass} placeholder="Smith" />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    className={inputClass} placeholder="jane@example.com" />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                    className={inputClass} placeholder="+1 268-555-0000" />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Address ── */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-[#0c2749] mb-6">Address</h2>
              <div>
                <label className={labelClass}>Street Address</label>
                <input value={form.street_address} onChange={e => set('street_address', e.target.value)}
                  className={inputClass} placeholder="123 Main Street" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>City</label>
                  <input value={form.city} onChange={e => set('city', e.target.value)}
                    className={inputClass} placeholder="City" />
                </div>
                <div>
                  <label className={labelClass}>State / Province</label>
                  <input value={form.state} onChange={e => set('state', e.target.value)}
                    className={inputClass} placeholder="State" />
                </div>
                <div>
                  <label className={labelClass}>Country</label>
                  <select value={form.country} onChange={e => set('country', e.target.value)} className={inputClass}>
                    <option value="">— Select country —</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Postal Code</label>
                  <input value={form.postal_code} onChange={e => set('postal_code', e.target.value)}
                    className={inputClass} placeholder="Postal Code" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Nationality</label>
                  <input value={form.nationality} onChange={e => set('nationality', e.target.value)}
                    className={inputClass} placeholder="e.g. Canadian" />
                </div>
                <div>
                  <label className={labelClass}>Marital Status</label>
                  <select value={form.marital_status} onChange={e => set('marital_status', e.target.value)} className={inputClass}>
                    <option value="">— Select —</option>
                    {MARITAL_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Background ── */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-[#0c2749] mb-6">Background Information</h2>

              <div>
                <label className={labelClass}>Are you affiliated with a politically exposed person (PEP)?</label>
                <div className="flex gap-4 mt-2">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="pep" value={opt}
                        checked={form.pep === (opt === 'Yes')}
                        onChange={() => set('pep', opt === 'Yes')}
                        className="accent-[#0c2749]" />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {form.pep && (
                <div>
                  <label className={labelClass}>If yes, please state affiliation</label>
                  <input value={form.pep_affiliation} onChange={e => set('pep_affiliation', e.target.value)}
                    className={inputClass} placeholder="State affiliation..." />
                </div>
              )}

              <div>
                <label className={labelClass}>Occupation / Principal Business Activity</label>
                <input value={form.occupation} onChange={e => set('occupation', e.target.value)}
                  className={inputClass} placeholder="e.g. Software Engineer" />
              </div>

              <div>
                <label className={labelClass}>Employer Name / Business Name</label>
                <input value={form.employer} onChange={e => set('employer', e.target.value)}
                  className={inputClass} placeholder="e.g. Acme Corp" />
              </div>
            </div>
          )}

          {/* ── Step 4: Preferences ── */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-[#0c2749] mb-6">Property Preferences</h2>

              <div>
                <label className={labelClass}>Important to me</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
                  {PREFERENCES.map(pref => (
                    <button key={pref} type="button" onClick={() => togglePref(pref)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 transition-colors text-left ${
                        form.preferences.includes(pref)
                          ? 'border-[#0c2749] bg-[#0c2749]/5 text-[#0c2749]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Budget</label>
                <input value={form.budget} onChange={e => set('budget', e.target.value)}
                  className={inputClass} placeholder="e.g. $500,000 - $1,000,000" />
              </div>

              <div>
                <label className={labelClass}>Additional Notes</label>
                <textarea rows={4} value={form.notes} onChange={e => set('notes', e.target.value)}
                  className={inputClass + ' resize-none'}
                  placeholder="Anything else you'd like us to know about what you're looking for..." />
              </div>
            </div>
          )}

          {/* ── Step 5: Documents ── */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-[#0c2749] mb-2">Upload Passport</h2>
              <p className="text-sm text-gray-400 mb-6">
                Your passport is required for compliance purposes. It is stored securely and never shared publicly.
              </p>

              <input ref={fileInputRef} type="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                onChange={handlePassport} className="hidden" />

              {passport ? (
                <div className="border-2 border-[#0c2749] rounded-2xl p-5 bg-blue-50/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {passportPreview ? (
                        <img src={passportPreview} alt="Passport preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#0c2749]/10 flex items-center justify-center">
                          <FileText size={24} className="text-[#0c2749]" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-[#0c2749]">{passport.name}</p>
                        <p className="text-xs text-gray-400">{(passport.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => { setPassport(null); setPassportPreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-10 hover:border-[#0c2749] hover:bg-blue-50/30 transition-colors text-center group">
                  <Upload size={32} className="mx-auto mb-3 text-gray-300 group-hover:text-[#0c2749] transition-colors" />
                  <p className="text-sm font-medium text-gray-500 group-hover:text-[#0c2749] transition-colors">Click to upload passport</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC up to 10MB</p>
                </button>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                🔒 Your document is encrypted and stored securely. Only authorised RE/MAX 365 staff can access it.
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button type="button" onClick={back}
                className="flex items-center gap-2 px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:border-[#0c2749] transition-colors">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <div className="flex-1" />
            {step < 5 ? (
              <button type="button" onClick={next}
                className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                {submitting ? 'Submitting…' : 'Submit Application'} {!submitting && <Check size={16} />}
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          RE/MAX 365 Antigua · Your information is kept strictly confidential
        </p>
      </div>
    </div>
  )
}
