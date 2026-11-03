import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'

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
  metadataBase: new URL('https://www.remax-365-antigua.com'),
  title: {
    default: 'RE/MAX 365 Antigua | Buy & Sell Property in Antigua',
    template: '%s | RE/MAX 365 Antigua',
  },
  description: 'The most trusted name in Antigua real estate. Browse exclusive listings, beachfront villas, luxury homes, and investment properties in Antigua & Barbuda.',
  keywords: [
    'Antigua real estate',
    'buy property Antigua',
    'sell property Antigua',
    'houses for sale Antigua',
    'villas for sale Antigua',
    'Antigua & Barbuda property',
    'RE/MAX 365 Antigua',
    'real estate agent Antigua',
    'Jolly Harbour property',
    'beachfront property Antigua',
  ],
  authors: [{ name: 'RE/MAX 365 Antigua' }],
  creator: 'RE/MAX 365 Antigua',
  publisher: 'RE/MAX 365 Antigua',
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.remax-365-antigua.com',
    siteName: 'RE/MAX 365 Antigua',
    title: 'RE/MAX 365 Antigua | Buy & Sell Property in Antigua',
    description: 'The most trusted name in Antigua real estate. Browse exclusive listings, beachfront villas, luxury homes, and investment properties.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RE/MAX 365 Antigua — Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RE/MAX 365 Antigua | Buy & Sell Property in Antigua',
    description: 'The most trusted name in Antigua real estate.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.remax-365-antigua.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: 'RE/MAX 365 Antigua',
              url: 'https://www.remax-365-antigua.com',
              logo: 'https://www.remax-365-antigua.com/logo-white.png',
              image: 'https://www.remax-365-antigua.com/og-image.jpg',
              description: 'The most trusted name in Antigua real estate. Browse exclusive listings, beachfront villas, luxury homes, and investment properties in Antigua & Barbuda.',
              telephone: '+1-268-724-9308',
              email: 'info@remax-365-antigua.com',
              address: {
                '@type': 'PostalAddress',
                addressLocality: "St. John's",
                addressRegion: 'Saint John',
                addressCountry: 'AG',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 17.1274,
                longitude: -61.8468,
              },
              areaServed: {
                '@type': 'Country',
                name: 'Antigua and Barbuda',
              },
              sameAs: [
                'https://www.facebook.com/michel.glass.9',
                'https://www.instagram.com/michelglassrealty/',
              ],
              employee: [
                {
                  '@type': 'Person',
                  name: 'Michel Lamdan-Glass',
                  jobTitle: 'Real Estate Agent',
                  telephone: '+1-268-724-9308',
                  email: 'michelglass@remax-365-antigua.com',
                },
                {
                  '@type': 'Person',
                  name: 'Luka Bruschi',
                  jobTitle: 'Real Estate Agent',
                  telephone: '+1-268-717-6720',
                  email: 'luka@remax-365-antigua.com',
                },
                {
                  '@type': 'Person',
                  name: 'Ron Chapman',
                  jobTitle: 'Real Estate Agent',
                  telephone: '+1-268-720-4504',
                  email: 'ron@remax-365-antigua.com',
                },
                {
                  '@type': 'Person',
                  name: 'Stephanie Murphy',
                  jobTitle: 'Real Estate Agent',
                  telephone: '+1-570-877-4259',
                  email: 'Stephanie@remax-365-antigua.com',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="font-sans bg-white text-gray-900 antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}