import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    default: 'Sugar Ridge Homes — Exclusive Luxury Living in Antigua',
    template: '%s | Sugar Ridge Homes',
  },
  description:
    "Nestled across 43 lush acres on Antigua's west coast, Sugar Ridge offers bespoke villas, luxury condos, and prime lots with breathtaking Caribbean Sea views.",
  keywords: ['Antigua real estate', 'luxury villas Antigua', 'Caribbean homes', 'citizenship by investment', 'Sugar Ridge'],
  openGraph: {
    siteName: 'Sugar Ridge Homes',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  )
}
