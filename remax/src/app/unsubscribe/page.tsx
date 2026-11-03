import { getServiceSupabase } from '@/lib/supabase'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <p className="text-red-500 text-sm">Invalid unsubscribe link.</p>
          <Link href="/" className="text-[#0c2749] text-sm font-medium hover:underline mt-4 inline-block">
            ← Back to homepage
          </Link>
        </div>
      </div>
    )
  }

  const supabase = getServiceSupabase()
  const { error } = await supabase
    .from('clients')
    .update({ newsletter_unsubscribed: true })
    .eq('unsubscribe_token', token)

  const success = !error

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">{success ? '✓' : '✗'}</span>
        </div>
        {success ? (
          <>
            <h1 className="font-display text-xl font-bold text-[#0c2749] mb-2">You've been unsubscribed</h1>
            <p className="text-gray-500 text-sm">
              You will no longer receive newsletters from RE/MAX 365 Antigua. If this was a mistake, please contact us.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-xl font-bold text-red-500 mb-2">Something went wrong</h1>
            <p className="text-gray-500 text-sm">
              We couldn't process your unsubscribe request. Please contact us directly.
            </p>
          </>
        )}
        <div className="mt-6 space-y-2">
          <Link href="/" className="block text-[#0c2749] text-sm font-medium hover:underline">
            ← Back to homepage
          </Link>
          <a href="mailto:info@remax-365-antigua.com" className="block text-gray-400 text-xs hover:underline">
            info@remax-365-antigua.com
          </a>
        </div>
      </div>
    </div>
  )
}