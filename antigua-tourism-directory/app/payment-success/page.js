import Link from 'next/link'

export const metadata = {
  title: 'Payment Successful | AntiguaSearch.com',
  description: 'Your featured listing payment was successful.',
}

export default function PaymentSuccessPage({ searchParams }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          You&apos;re Featured!
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was successful. Your listing is now featured on AntiguaSearch.com with a gold border, top of category placement, and homepage visibility.
        </p>
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 font-semibold">
            ⭐ Featured listing active for 1 year
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            A confirmation email has been sent to you.
          </p>
        </div>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition"
          >
            Back to Homepage
          </Link>
          <Link
            href="/categories"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </div>
  )
}
