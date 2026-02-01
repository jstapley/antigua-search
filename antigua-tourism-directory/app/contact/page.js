import Link from 'next/link'
import Image from 'next/image'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Contact Us - AntiguaSearch.com',
  description: 'Get in touch with AntiguaSearch.com. Questions about listings, advertising, or general inquiries.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Stats Banner */}
      <div className="bg-indigo-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="font-semibold">1,247 people</span>
            <span>browsing this month</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">🏪 Own a business?</span>
            <Link href="/add-listing" className="underline font-semibold hover:text-yellow-300">
              Get premium visibility
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/antigua-flag.png" 
                alt="Antigua Flag" 
                width={50} 
                height={50}
                className="rounded-full"
              />
              <div>
                <div className="text-xl font-bold text-gray-900">ANTIGUA & BARBUDA</div>
                <div className="text-sm text-indigo-600 font-semibold">AntiguaSearch.com</div>
              </div>
            </Link>
            <nav className="flex gap-6 items-center">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
              <Link href="/parishes" className="text-gray-700 hover:text-indigo-600 font-medium">Browse Parishes</Link>
              <Link href="/categories" className="text-gray-700 hover:text-indigo-600 font-medium">Categories</Link>
              <Link href="/about" className="text-gray-700 hover:text-indigo-600 font-medium">About Us</Link>
              <Link href="/contact" className="text-indigo-600 font-bold">Contact</Link>
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 font-medium">Login</Link>
              <Link 
                href="/add-listing" 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                + Add Your Business
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <span className="text-2xl">✉️</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                  <a href="mailto:contact@AntiguaSearch.com" className="text-indigo-600 hover:text-indigo-700">
                    contact@AntiguaSearch.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <span className="text-2xl">📍</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">
                    St. John's<br />
                    Antigua & Barbuda
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <span className="text-2xl">🕐</span>
                </div>
                <div className="w-full">
                  <h3 className="font-bold text-gray-900 mb-3">Business Hours</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Sunday:</span>
                      <span className="text-gray-900">Closed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Monday:</span>
                      <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Tuesday:</span>
                      <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Wednesday:</span>
                      <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Thursday:</span>
                      <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Friday:</span>
                      <span className="text-gray-900">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Saturday:</span>
                      <span className="text-gray-900">Closed</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">AST (Atlantic Standard Time)</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/add-listing" className="block text-indigo-600 hover:text-indigo-700">
                  → List Your Business
                </Link>
                <Link href="/about" className="block text-indigo-600 hover:text-indigo-700">
                  → About Us
                </Link>
                <Link href="/parishes" className="block text-indigo-600 hover:text-indigo-700">
                  → Browse Parishes
                </Link>
                <Link href="/categories" className="block text-indigo-600 hover:text-indigo-700">
                  → All Categories
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <ContactForm />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">How do I list my business?</h3>
              <p className="text-gray-600">
                Click the "Add Your Business" button in the header or visit our <Link href="/add-listing" className="text-indigo-600 hover:text-indigo-700 font-semibold">Add Listing</Link> page. Fill out the form and submit for review.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Is listing my business free?</h3>
              <p className="text-gray-600">
                Yes! Basic listings are completely free. We also offer premium features for enhanced visibility. Contact us for details.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">How long does approval take?</h3>
              <p className="text-gray-600">
                Most listings are reviewed and approved within 24-48 hours. You'll receive an email notification once your listing is live.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Can I edit my listing?</h3>
              <p className="text-gray-600">
                Yes! Log in to your account and visit your dashboard to edit your business information, photos, and details at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image 
                  src="/antigua-flag.png" 
                  alt="Antigua Flag" 
                  width={40} 
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-bold text-lg">Antigua Tourism</div>
                  <div className="text-sm text-gray-400">Directory</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Your complete guide to experiencing the best of Antigua & Barbuda
              </p>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-lg">Quick Links</h6>
              <div className="space-y-2">
                <Link href="/" className="block text-gray-400 hover:text-white transition">Home</Link>
                <Link href="/parishes" className="block text-gray-400 hover:text-white transition">Browse Parishes</Link>
                <Link href="/categories" className="block text-gray-400 hover:text-white transition">All Categories</Link>
                <Link href="/about" className="block text-gray-400 hover:text-white transition">About Us</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-lg">For Business</h6>
              <div className="space-y-2">
                <Link href="/add-listing" className="block text-gray-400 hover:text-white transition">List Your Business</Link>
                <Link href="/advertise" className="block text-gray-400 hover:text-white transition">Advertise With Us</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white transition">Pricing</Link>
              </div>
            </div>
            <div>
              <h6 className="font-bold mb-4 text-lg">Contact</h6>
              <p className="text-gray-400 text-sm mb-2">contact@AntiguaSearch.com</p>
              <p className="text-gray-400 text-sm">St. John's, Antigua & Barbuda</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2026 AntiguaSearch.com. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}