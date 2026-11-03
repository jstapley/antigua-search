'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Home, MessageSquare, TrendingUp, BarChart2, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/properties', label: 'Properties', icon: Home, exact: false },
  { href: '/dashboard/sales', label: 'Sales', icon: TrendingUp, exact: false },
  { href: '/dashboard/metrics', label: 'Metrics', icon: BarChart2, exact: false },
  { href: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare, exact: false },
]

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/dashboard/login')
    router.refresh()
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/" className="block">
          <p className="text-[#7BC9BF] font-serif text-lg font-bold">Sugar Ridge</p>
          <p className="text-white/40 text-xs tracking-wider uppercase">CEO Dashboard</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5',
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-[#19130b] flex-col fixed inset-y-0 left-0 z-40">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden bg-[#19130b] text-white flex items-center justify-between px-4 py-3 sticky top-0 z-40">
        <div>
          <p className="text-[#7BC9BF] font-serif font-bold">Sugar Ridge</p>
          <p className="text-white/40 text-xs">CEO Dashboard</p>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-[#19130b] flex flex-col">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  )
}
