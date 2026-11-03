// Add this export to src/app/contact/page.tsx at the top (before the ContactForm function)
// Since the page is 'use client', create src/app/contact/layout.tsx instead:

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us — RE/MAX 365 Antigua',
  description: 'Get in touch with RE/MAX 365 Antigua. Contact Michel Glass or Luka Bruschi to buy or sell property in Antigua & Barbuda.',
  alternates: {
    canonical: 'https://www.remax-365-antigua.com/contact',
  },
  openGraph: {
    title: 'Contact RE/MAX 365 Antigua',
    description: 'Get in touch with our team to buy or sell property in Antigua & Barbuda.',
    url: 'https://www.remax-365-antigua.com/contact',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'RE/MAX 365 Antigua — Real Estate' }],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}