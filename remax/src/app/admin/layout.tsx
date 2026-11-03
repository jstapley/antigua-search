'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  BarChart3,
  ClipboardList,
  Upload,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Mail,
  FileDown,
  FolderOpen,
  FileText,
} from 'lucide-react'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/properties', icon: Building2, label: 'Properties' },
  { href: '/admin/clients', icon: Users, label: 'Clients' },
  { href: '/admin/showings', icon: Calendar, label: 'Showings' },
  { href: '/admin/reports', icon: BarChart3, label: 'Reports' },
  { href: '/admin/onboarding', icon: ClipboardList, label: 'Onboarding' },
  { href: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
  { href: '/admin/flyer', icon: FileDown, label: 'Flyer' },
  { href: '/admin/import', icon: Upload, label: 'Import' },
  { href: '/admin/forms', icon: FileText, label: 'Forms' },
  { href: '/admin/resources', icon: FolderOpen, label: 'Resources' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [agentName, setAgentName] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/admin/login')
        return
      }
      // Fetch agent name
      const { data } = await supabase
        .from('agents')
        .select('name')
        .eq('id', session.user.id)
        .single()
      if (data?.name) setAgentName(data.name)
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const initials = agentName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <p className="text-white font-display font-bold text-lg leading-tight">RE/MAX 365</p>
        <p className="text-white/40 text-xs">Admin Dashboard</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon size={17} className="flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        {agentName && (
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
            <p className="text-white/80 text-sm font-medium truncate">
              Signed in as <span className="text-white font-semibold">{agentName}</span>
            </p>
          </div>
        )}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink size={17} className="flex-shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LogOut size={17} className="flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0 bg-[#0c2749] min-h-screen sticky top-0 h-screen">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0c2749] flex items-center justify-between px-4 py-3 shadow-md">
        <p className="text-white font-display font-bold text-base">RE/MAX 365</p>
        <button onClick={() => setMobileOpen(true)} className="text-white p-1">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-[#0c2749] flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <p className="text-white font-display font-bold">RE/MAX 365</p>
              <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavContent />
            </div>
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:pt-0 pt-14">
        {children}
      </main>
    </div>
  )
}