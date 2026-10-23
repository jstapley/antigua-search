// app/forgot-password/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://www.antiguasearch.com/reset-password'
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <Image src="/antigua-flag.png" alt="AntiguaSearch" width={48} height={48} className="rounded-full" />
            <div className="text-left">
              <div className="text-lg font-bold text-gray-900">ANTIGUA & BARBUDA</div>
              <div className="text-sm text-brand-600 font-semibold">ANTIGUA SEARCH</div>
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Reset your password</h1>
          <p className="text-gray-600">Enter your email and we'll send you a reset link</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Check your inbox and click the link to reset your password.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive it? Check your spam folder or{' '}
              <button
                onClick={() => setSent(false)}
                className="text-brand-600 hover:underline font-medium"
              >
                try again
              </button>
            </p>
            <Link
              href="/login"
              className="block w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition text-center"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="text-brand-600 hover:underline font-medium">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
