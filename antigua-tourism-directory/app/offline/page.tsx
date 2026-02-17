import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Offline | AntiguaSearch',
  description: 'You are currently offline',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image 
          src="/antigua-flag.png" 
          alt="Antigua Flag" 
          width={120} 
          height={120}
          className="rounded-full mx-auto mb-8 shadow-2xl"
        />
        
        <h1 className="text-4xl font-bold text-white mb-4">
          You're Offline
        </h1>
        
        <p className="text-xl text-white/90 mb-8">
          No internet connection detected. Some features may be limited.
        </p>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8">
          <p className="text-white mb-4">
            📱 You can still browse cached listings while offline!
          </p>
          <p className="text-white/80 text-sm">
            Your connection will be restored automatically when you're back online.
          </p>
        </div>

        <Link
          href="/"
          className="inline-block bg-yellow-400 text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition shadow-2xl"
        >
          Go to Homepage
        </Link>

        <p className="text-white/60 text-sm mt-6">
          AntiguaSearch - Antigua & Barbuda's Business Directory
        </p>
      </div>
    </div>
  )
}