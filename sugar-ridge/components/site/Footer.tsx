import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#19130b' }} className="text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <p className="text-[#7BC9BF] font-serif text-2xl font-bold">Sugar Ridge</p>
              <p className="text-white/50 text-xs tracking-widest uppercase">Homes</p>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Exclusive luxury living nestled across 43 lush acres on Antigua&apos;s west coast.
              Breathtaking sea views, bespoke design, and a treasured haven.
            </p>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Properties</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/villas" className="hover:text-[#7BC9BF] transition-colors">Villas</Link></li>
              <li><Link href="/condos" className="hover:text-[#7BC9BF] transition-colors">Condos</Link></li>
              <li><Link href="/lots" className="hover:text-[#7BC9BF] transition-colors">Lots</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#7BC9BF] transition-colors">About Us</Link></li>
              <li><Link href="/why-sugar-ridge" className="hover:text-[#7BC9BF] transition-colors">Why Sugar Ridge</Link></li>
              <li><Link href="/citizenship" className="hover:text-[#7BC9BF] transition-colors">Citizenship by Investment</Link></li>
              <li><Link href="/contact" className="hover:text-[#7BC9BF] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+12685627701" className="flex items-center gap-2 hover:text-[#7BC9BF] transition-colors">
                  <Phone size={14} className="shrink-0" />
                  +1 (268) 562-7701
                </a>
              </li>
              <li>
                <a href="mailto:info@sugarridgehomes.com" className="flex items-center gap-2 hover:text-[#7BC9BF] transition-colors">
                  <Mail size={14} className="shrink-0" />
                  info@sugarridgehomes.com
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  Sugar Ridge, Antigua &amp; Barbuda
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Sugar Ridge Homes. All rights reserved.</p>
          <p>Antigua &amp; Barbuda • Caribbean</p>
        </div>
      </div>
    </footer>
  )
}
