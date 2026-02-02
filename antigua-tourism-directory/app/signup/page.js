'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, fullName)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand - Mobile Responsive */}
        <div className="text-center mb-6 md:mb-8">
          <Link href="/" className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <Image 
              src="/antigua-flag.png" 
              alt="Antigua Flag" 
              width={50} 
              height={50}
              className="rounded-full md:w-[60px] md:h-[60px]"
            />
            <div className="text-left">
              <div className="text-xl md:text-2xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
              <div className="text-xs md:text-sm text-indigo-600 font-semibold">ANTIGUA SEARCH</div>
            </div>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 md:mt-6">Create Account</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Join to manage your business listings</p>
        </div>

        {/* Signup Form - Mobile Responsive */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 mb-4 md:mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none text-sm md:text-base"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none text-sm md:text-base"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none text-sm md:text-base"
                placeholder="••••••••"
              />
              <p className="text-xs md:text-sm text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 md:py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 text-sm md:text-base"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 md:mt-6 text-center">
            <p className="text-gray-600 text-sm md:text-base">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-4 md:mt-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm md:text-base">
            ← Back to Directory
          </Link>
        </div>
      </div>
    </div>
  )
}