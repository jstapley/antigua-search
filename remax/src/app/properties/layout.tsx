import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Properties for Sale in Antigua',
  description: 'Browse all properties for sale in Antigua & Barbuda. Houses, villas, condos, and land available across Antigua including Jolly Harbour, English Harbour, and more.',
  keywords: [
    'properties for sale Antigua',
    'houses for sale Antigua',
    'villas for sale Antigua',
    'Antigua property listings',
    'real estate Antigua',
  ],
  alternates: {
    canonical: 'https://www.remax-365-antigua.com/properties',
  },
  openGraph: {
    title: 'Properties for Sale in Antigua | RE/MAX 365 Antigua',
    description: 'Browse all properties for sale in Antigua & Barbuda. Houses, villas, condos, and land available.',
    url: 'https://www.remax-365-antigua.com/properties',
  },
}

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}