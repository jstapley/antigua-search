import type { Metadata } from 'next'

export const metadata: Metadata = {
  manifest: '/manifest-admin.json',
  title: 'AntiguaSearch Admin',
  themeColor: '#991b1b',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
