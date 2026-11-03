'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Home' },
  {
    label: 'Properties',
    children: [
      { href: '/villas', label: 'Villas' },
      { href: '/condos', label: 'Condos' },
      { href: '/lots', label: 'Lots' },
    ],
  },
  { href: '/about', label: 'About' },
  { href: '/why-sugar-ridge', label: 'Why Sugar Ridge' },
  { href: '/citizenship', label: 'Citizenship' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [propertiesOpen, setPropertiesOpen] = useState(false)

  return (
    <header className="bg-[#3d0000] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-[#7BC9BF] font-serif text-xl font-bold tracking-wide">
              Sugar Ridge
            </span>
            <span className="text-white/80 text-xs tracking-widest uppercase">
              Homes
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group">
                  <button className="text-white/90 hover:text-[#7BC9BF] text-sm font-medium transition-colors flex items-center gap-1">
                    {link.label}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-36 bg-[#3d0000] border border-white/10 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-white/90 hover:text-[#7BC9BF] hover:bg-white/5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="text-white/90 hover:text-[#7BC9BF] text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+12685627701"
              className="flex items-center gap-2 text-white/80 hover:text-[#7BC9BF] text-sm transition-colors"
            >
              <Phone size={14} />
              +1 (268) 562-7701
            </a>
            <Link
              href="/contact"
              className="bg-[#7BC9BF] text-[#19130b] px-4 py-2 rounded text-sm font-semibold hover:bg-[#5aada3] transition-colors"
            >
              Request a Viewing
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#3d0000] pb-4">
          <div className="max-w-7xl mx-auto px-4 pt-2 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <button
                    onClick={() => setPropertiesOpen(!propertiesOpen)}
                    className="w-full text-left text-white/90 py-2 text-sm font-medium flex justify-between items-center"
                  >
                    {link.label}
                    <svg className={`w-4 h-4 transition-transform ${propertiesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {propertiesOpen && (
                    <div className="pl-4 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block text-white/80 py-1.5 text-sm hover:text-[#7BC9BF]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={() => setMobileOpen(false)}
                  className="block text-white/90 py-2 text-sm font-medium hover:text-[#7BC9BF]"
                >
                  {link.label}
                </Link>
              ),
            )}
            <div className="pt-3 border-t border-white/10">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center bg-[#7BC9BF] text-[#19130b] px-4 py-2.5 rounded text-sm font-semibold hover:bg-[#5aada3]"
              >
                Request a Viewing
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
