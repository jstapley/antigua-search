import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'RE/MAX 365 Antigua | Buy & Sell Property in Antigua',
  description:
    'The most trusted name in Antigua real estate. Browse exclusive listings, beachfront villas, luxury homes, and investment properties in Antigua.',
  keywords: 'Antigua real estate, buy house Antigua, property Antigua, RE/MAX 365',
  openGraph: {
    title: 'RE/MAX 365 Antigua | Buy & Sell Property in Antigua',
    description: 'The most trusted name in Antigua real estate.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
