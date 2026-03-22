import Link from 'next/link'

export const metadata = {
  title: 'Payment Cancelled | AntiguaSearch.com',
}

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          No worries — your payment was cancelled and you have not been charged. You can upgrade to a featured listing anytime from your listing page.
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition"
          >
            Back to Homepage
          </Link>
          <Link
            href="/pricing"
            className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  )
}
