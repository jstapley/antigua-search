'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const services = [
  { label: 'Buy a Property', href: '/services/buying-property-antigua' },
  { label: 'Sell a Property', href: '/services/selling-property-antigua' },
  { label: 'Citizenship by Investment (CBI)', href: '/services/citizenship-by-investment-antigua' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300', scrolled ? 'shadow-md' : 'shadow-sm')}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="https://yhblxzdydirndlprmnan.supabase.co/storage/v1/object/public/media/website-logo.png"
            alt="RE/MAX 365 Antigua"
            width={180}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[{ label: 'Home', href: '/' }, { label: 'Properties', href: '/properties' }, { label: 'FAQ', href: '/faq' }].map(item => (
            <Link key={item.href} href={item.href} className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors">
              {item.label}
            </Link>
          ))}

          <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
            <button className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors">
              Services <ChevronDown size={14} className={cn('transition-transform duration-200', servicesOpen && 'rotate-180')} />
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 z-50 pt-2">
                <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                  {services.map(s => (
                    <Link key={s.href} href={s.href} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#0c2749] transition-colors">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors">
            Contact Us
          </Link>
        </nav>

        {/* Phone */}
        <a href="tel:+12687249308" className="hidden md:flex items-center gap-2 text-[#0c2749] font-semibold text-sm hover:text-blue-700 transition-colors">
          <div className="w-7 h-7 bg-[#0c2749] rounded flex items-center justify-center">
            <Phone size={13} className="text-white" />
          </div>
          +1 268-724-9308
        </a>

        <button className="md:hidden p-2 text-gray-700" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-1">
          {[
            { label: 'Home', href: '/' },
            { label: 'Properties', href: '/properties' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Contact Us', href: '/contact' },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-3 text-gray-700 font-medium border-b border-gray-50 text-sm">
              {item.label}
            </Link>
          ))}
          <p className="py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Services</p>
          {services.map(s => (
            <Link key={s.href} href={s.href} onClick={() => setOpen(false)} className="py-2.5 pl-3 text-gray-600 border-b border-gray-50 text-sm">
              {s.label}
            </Link>
          ))}
          <a href="tel:+12687249308" className="flex items-center gap-2 text-[#0c2749] font-semibold pt-3 text-sm">
            <Phone size={15} /> +1 268-724-9308
          </a>
        </div>
      )}
    </header>
  )
}