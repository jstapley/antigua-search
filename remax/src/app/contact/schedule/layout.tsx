import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Schedule a Call — RE/MAX 365 Antigua',
  description: 'Book a call with a RE/MAX 365 Antigua agent to discuss buying or selling property in Antigua & Barbuda.',
  alternates: {
    canonical: 'https://www.remax-365-antigua.com/contact/schedule',
  },
  openGraph: {
    title: 'Schedule a Call | RE/MAX 365 Antigua',
    description: 'Book a call with a RE/MAX 365 Antigua agent to discuss buying or selling property in Antigua & Barbuda.',
    url: 'https://www.remax-365-antigua.com/contact/schedule',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'RE/MAX 365 Antigua — Real Estate' }],
  },
}

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
