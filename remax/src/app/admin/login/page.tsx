'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

const ALLOWED_EMAILS = [
  'jeff@stapleyinc.com',
  'michelglass@remax-365-antigua.com',
  'luka@remax-365-antigua.com',
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const getSupabase = () => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
        setError('This email is not authorised to access the admin panel.')
        setLoading(false)
        return
      }

      const supabase = getSupabase()
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError || !data.session) {
        setError('Invalid email or password.')
        setLoading(false)
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (!ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
        setError('This email is not registered.')
        setLoading(false)
        return
      }

      const supabase = getSupabase()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: 'https://remax-nu.vercel.app/admin/reset-password' }
    )

      if (resetError) {
        setError('Failed to send reset email. Please try again.')
      } else {
        setSuccess('Password reset email sent! Check your inbox.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c2749] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img
            src="https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/website-logo.png"
            alt="RE/MAX 365 Antigua"
            className="h-14 w-auto mx-auto"
          />
          <p className="text-gray-400 text-sm mt-3">
            {mode === 'login' ? 'Admin Panel — Sign in to continue' : 'Reset your password'}
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@remax-365-antigua.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors" />
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors text-sm mt-2">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <button type="button" onClick={() => { setMode('reset'); setError(''); setSuccess('') }}
              className="w-full text-center text-sm text-gray-400 hover:text-[#0c2749] transition-colors mt-2">
              Forgot your password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@remax-365-antigua.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors" />
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>}
            {success && <p className="text-green-700 text-sm bg-green-50 px-4 py-3 rounded-xl border border-green-200">{success}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
              {loading ? 'Sending…' : 'Send Reset Email'}
            </button>

            <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              className="w-full text-center text-sm text-gray-400 hover:text-[#0c2749] transition-colors">
              ← Back to Sign In
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">RE/MAX 365 Antigua · Admin Panel</p>
      </div>
    </div>
  )
}