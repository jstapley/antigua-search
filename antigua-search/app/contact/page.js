import ContactPageClient from './ContactPageClient'

export const metadata = {
  title: 'Contact Us - AntiguaSearch.com',
  description: 'Get in touch with AntiguaSearch.com. Questions about listings, advertising, or general inquiries.',
  alternates: {
    canonical: 'https://www.antiguasearch.com/contact'
  }
}

export default async function ContactPage({ searchParams }) {
  const resolvedParams = await searchParams
  const defaultSubject = resolvedParams?.subject || ''

  return <ContactPageClient defaultSubject={defaultSubject} />
}
