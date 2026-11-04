import type { Metadata } from 'next'

export const metadata: Metadata = {
  manifest: '/manifest-admin.json',
  title: 'Admin',
  themeColor: '#991b1b',
  appleWebApp: {
    title: 'Admin',
    statusBarStyle: 'default',
    capable: true,
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
