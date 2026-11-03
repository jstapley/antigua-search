import type { Metadata } from 'next'

export const metadata: Metadata = {
  manifest: '/manifest-consignee.json',
  title: 'Consignee Portal',
  themeColor: '#065f46',
}

export default function ConsigneeLayout({ children }: { children: React.ReactNode }) {
  return children
}
