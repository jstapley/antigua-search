import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">RE</span>
            </div>
            <div>
              <div className="font-bold text-white text-sm">RE/MAX</div>
              <div className="text-xs text-gray-400 font-display italic">365 Antigua</div>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            The most trusted name in Antigua real estate. Your dream Caribbean property awaits.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-9 h-9 bg-navy-600 rounded-lg flex items-center justify-center hover:bg-gold-500 transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 bg-navy-600 rounded-lg flex items-center justify-center hover:bg-gold-500 transition-colors">
              <Instagram size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            {[
              { label: 'Home', href: '/' },
              { label: 'Properties', href: '/properties' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Contact Us', href: '/contact' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            {[
              { label: 'Buy a Property', href: '/properties' },
              { label: 'Sell Your Property', href: '/services/sell' },
              { label: 'Property Management', href: '/services/management' },
              { label: 'Citizenship by Investment', href: '/services/citizenship' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold-400 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact Us</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <Phone size={15} className="mt-0.5 flex-shrink-0 text-gold-400" />
              <a href="tel:+12687249308" className="hover:text-white transition-colors">+1 268-724-9308</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={15} className="mt-0.5 flex-shrink-0 text-gold-400" />
              <a href="mailto:info@remax365antigua.com" className="hover:text-white transition-colors">
                info@remax365antigua.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 flex-shrink-0 text-gold-400" />
              <span>St. John&apos;s, Antigua</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-700 py-5 px-4 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} RE/MAX 365 Antigua. All rights reserved. |{' '}
        <Link href="/admin/login" className="hover:text-gray-400 transition-colors">Admin</Link>
      </div>
    </footer>
  )
}
