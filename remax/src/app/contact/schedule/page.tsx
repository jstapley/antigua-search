'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const TIMES = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function SchedulePage() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [step, setStep] = useState<'pick' | 'details' | 'done'>('pick')
  const [submitting, setSubmitting] = useState(false)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day)
    return d < today || d.getDay() === 0 // no Sundays, no past
  }

  const handleBook = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, time: selectedTime, ...form }),
      })
      if (!res.ok) throw new Error()
      setStep('done')
    } catch {
      alert('Failed to book. Please try calling us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'done') {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-5" />
          <h2 className="font-display text-3xl font-bold text-navy-700 mb-3">Meeting Scheduled!</h2>
          <p className="text-gray-500 mb-2">
            Your consultation is booked for <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong>.
          </p>
          <p className="text-gray-500 text-sm">You'll receive a confirmation email shortly. We look forward to speaking with you!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-navy-700 text-center mb-2">Schedule a Consultation</h1>
        <p className="text-gray-500 text-center mb-10">Book a free 30-minute call with our team</p>

        {step === 'pick' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            {/* Calendar */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronLeft size={20} /></button>
              <h3 className="font-semibold text-navy-700">{monthName}</h3>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><ChevronRight size={20} /></button>
            </div>

            <div className="grid grid-cols-7 text-center mb-2">
              {DAYS.map(d => <div key={d} className="text-xs font-medium text-gray-400 py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 mb-6">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const disabled = isDisabled(day)
                const selected = selectedDate === dateStr
                return (
                  <button
                    key={day}
                    disabled={disabled}
                    onClick={() => { setSelectedDate(dateStr); setSelectedTime(null) }}
                    className={cn(
                      'h-10 w-full rounded-xl text-sm font-medium transition-colors',
                      disabled && 'text-gray-300 cursor-not-allowed',
                      !disabled && !selected && 'hover:bg-navy-50 text-gray-700',
                      selected && 'bg-navy-700 text-white'
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            {/* Time slots */}
            {selectedDate && (
              <>
                <h4 className="font-semibold text-navy-700 mb-3 flex items-center gap-2"><Clock size={16} /> Available Times</h4>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={cn(
                        'py-2.5 rounded-xl text-sm font-medium border transition-colors',
                        selectedTime === t
                          ? 'bg-navy-700 text-white border-navy-700'
                          : 'border-gray-200 hover:border-navy-300 text-gray-700'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep('details')}
              className="w-full bg-navy-700 hover:bg-navy-800 disabled:opacity-40 text-white py-4 rounded-xl font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'details' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="bg-navy-50 rounded-xl p-4 mb-6 text-sm">
              <p className="font-semibold text-navy-700">📅 {selectedDate} at {selectedTime}</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500" placeholder="+1 (268) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none" placeholder="What are you looking for?" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep('pick')} className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-navy-300 transition-colors">
                Back
              </button>
              <button
                disabled={!form.name || !form.email || submitting}
                onClick={handleBook}
                className="flex-2 w-full bg-navy-700 hover:bg-navy-800 disabled:opacity-40 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                {submitting ? 'Booking...' : 'Confirm Meeting'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
