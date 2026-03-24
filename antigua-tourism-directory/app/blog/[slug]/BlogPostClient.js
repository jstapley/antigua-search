'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'

export default function BlogPostClient({ post }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const components = {
    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-10 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>,
    p: ({ children }) => <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">{children}</p>,
    a: ({ href, children }) => <a href={href} className="text-brand-600 hover:text-brand-700 underline font-medium" target="_blank" rel="noopener noreferrer">{children}</a>,
    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">{children}</ol>,
    li: ({ children }) => <li className="text-base md:text-lg leading-relaxed">{children}</li>,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-brand-600 pl-4 md:pl-6 my-6 italic text-gray-600 bg-brand-50 py-3 rounded-r-lg">{children}</blockquote>,
    hr: () => <hr className="border-gray-200 my-8" />,
    code: ({ children }) => <code className="bg-gray-100 text-brand-700 px-2 py-1 rounded text-sm font-mono">{children}</code>,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Stats Banner */}
      <div className="bg-brand-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <div>
              <span className="font-bold text-lg md:text-xl">1,247 people</span>
              <span className="text-sm md:text-base ml-1">browsing this month</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏪</span>
            <span className="text-sm md:text-base">Own a business?</span>
            <Link href="/add-listing" className="text-yellow-300 font-semibold underline hover:text-yellow-200 text-sm whitespace-nowrap">
              Get premium visibility
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/antigua-flag.png" alt="Antigua Flag" width={50} height={50} className="rounded-full" />
              <div>
                <div className="text-lg md:text-xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
                <div className="text-xs md:text-sm text-brand-600 font-semibold">ANTIGUA SEARCH</div>
              </div>
            </Link>
            <nav className="hidden lg:flex gap-6 items-center">
              <Link href="/" className="text-gray-700 hover:text-brand-600 font-medium">Home</Link>
              <Link href="/parishes" className="text-gray-700 hover:text-brand-600 font-medium">Browse Parishes</Link>
              <Link href="/categories" className="text-gray-700 hover:text-brand-600 font-medium">Categories</Link>
              <Link href="/about" className="text-gray-700 hover:text-brand-600 font-medium">About Us</Link>
              <Link href="/blog" className="text-brand-600 font-semibold">Blog</Link>
              <Link href="/contact" className="text-gray-700 hover:text-brand-600 font-medium">Contact</Link>
              <Link href="/login" className="text-gray-700 hover:text-brand-600 font-medium">Login</Link>
              <Link href="/add-listing" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-brand-700 transition">
                + Add Your Business
              </Link>
            </nav>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-gray-700 p-2" aria-label="Toggle menu">
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-3">
              <Link href="/" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/parishes" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Browse Parishes</Link>
              <Link href="/categories" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link href="/about" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link href="/blog" className="block text-brand-600 font-semibold py-2" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/contact" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              <Link href="/login" className="block text-gray-700 hover:text-brand-600 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link href="/add-listing" className="block bg-brand-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-brand-700 transition text-center" onClick={() => setMobileMenuOpen(false)}>+ Add Your Business</Link>
            </nav>
          )}
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm overflow-x-auto">
            <Link href="/" className="text-brand-600 hover:text-brand-700 whitespace-nowrap">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/blog" className="text-brand-600 hover:text-brand-700 whitespace-nowrap">Blog</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-semibold truncate">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="bg-brand-100 text-brand-700 text-xs px-3 py-1 rounded-full font-semibold">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          <span>By {post.author || 'AntiguaSearch Team'}</span>
          <span>•</span>
          <span>{new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="aspect-video relative rounded-2xl overflow-hidden mb-10">
            <Image src={post.featured_image} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <div className="bg-brand-50 border-l-4 border-brand-600 p-4 md:p-6 rounded-r-xl mb-8">
            <p className="text-base md:text-lg text-gray-800 font-medium">{post.excerpt}</p>
          </div>
        )}

        {/* Content */}
        <div className="blog-content">
          <ReactMarkdown components={components}>{post.content}</ReactMarkdown>
        </div>

        {/* Back to Blog */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/blog" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold">
            ← Back to Blog
          </Link>
        </div>
      </article>

      {/* CTA */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-blue-600 py-12 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Find Businesses in Antigua & Barbuda</h2>
          <p className="text-white/90 mb-6 text-lg">Browse 986+ verified local businesses across all parishes</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/categories" className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition">
              Browse Categories →
            </Link>
            <Link href="/add-listing" className="bg-white text-brand-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
              List Your Business Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image src="/antigua-flag.png" alt="Antigua Flag" width={40} height={40} className="rounded-full" />
                <div>
                  <div className="font-bold">Antigua Search</div>
                  <div className="text-sm text-gray-400">Directory</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Your complete guide to Antigua & Barbuda</p>
            </div>
            <div>
              <h6 className="font-bold mb-4">Quick Links</h6>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-gray-400 hover:text-white transition">Home</Link>
                <Link href="/parishes" className="block text-gray-400 hover:text-white transition">Browse Parishes</Link>
                <Link href="/categories" className="block text-gray-400 hover:text-white transition">All Categories</Link>
                <Link href="/blog" className="block text-gray-400 hover:text-white transition">Blog</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4">For Business</h6>
              <div className="space-y-2 text-sm">
                <Link href="/add-listing" className="block text-gray-400 hover:text-white transition">List Your Business</Link>
                <Link href="/advertise" className="block text-gray-400 hover:text-white transition">Advertise With Us</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white transition">Pricing</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4">Contact</h6>
              <p className="text-gray-400 text-sm mb-2">contact@antiguasearch.com</p>
              <p className="text-gray-400 text-sm">St. John&apos;s, Antigua & Barbuda</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2026 Antigua Search. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
