'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4 md:mt-6">Welcome Back</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Sign in to manage your listings</p>
        </div>

        {/* Login Form - Mobile Responsive */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4 mb-4 md:mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
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
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-900">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs md:text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none text-sm md:text-base"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 md:py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 text-sm md:text-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 md:mt-6 text-center">
            <p className="text-gray-600 text-sm md:text-base">
              Don't have an account?{' '}
              <Link href="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Sign up
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