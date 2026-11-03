'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Check if there's already an active session (token already exchanged)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })

    // Listen for PASSWORD_RECOVERY event from hash token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setReady(true)
      }
    })

    // Fallback — if nothing fires after 5s, mark as invalid
    const timeout = setTimeout(() => {
      setInvalid(true)
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  // Clear invalid state once ready
  useEffect(() => {
    if (ready) setInvalid(false)
  }, [ready])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError(updateError.message)
      } else {
        router.push('/admin/login?reset=success')
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
          <p className="text-gray-400 text-sm mt-3">Set your new password</p>
        </div>

        {ready ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0c2749]/20 focus:border-[#0c2749] transition-colors" />
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl border border-red-100">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#0c2749] hover:bg-[#0a1f3a] disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-colors text-sm">
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        ) : invalid ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <button onClick={() => router.push('/admin/login')}
              className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:border-[#0c2749] transition-colors text-sm">
              Back to Login
            </button>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400">Verifying reset link…</p>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">RE/MAX 365 Antigua · Admin Panel</p>
      </div>
    </div>
  )
}