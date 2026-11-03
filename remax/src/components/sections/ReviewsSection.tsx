import { Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Review } from '@/types'

async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8)

  if (error || !data || data.length === 0) {
    return [
      { id: '1', author_name: 'Shawn', rating: 5, text: 'Michel was a wealth of knowledge. She took time to explain different scenarios, offered suggestions and show us a few places. It was a better than e...', time: 'Nov 21, 2025', profile_photo_url: null, source: 'google' },
      { id: '2', author_name: 'Jamie Arnan', rating: 5, text: "I had the absolute pleasure of working with Michel Glass Lamdan to find a long-term rental for my family, and I can't recommend her enough! She helped...", time: 'Jun 28, 2025', profile_photo_url: null, source: 'google' },
      { id: '3', author_name: 'Teddy Mack', rating: 5, text: 'Kind and friendly approach to service and a pleasure to work along with in finding your piece of paradise in Antigua.', time: 'Jun 26, 2025', profile_photo_url: null, source: 'google' },
      { id: '4', author_name: 'PAREB', rating: 5, text: 'Very professional highly recommend 👍', time: 'Jun 25, 2025', profile_photo_url: null, source: 'google' },
      { id: '5', author_name: 'Pete Reed', rating: 5, text: 'Michel is Amazing!! Takes time to understand my needs and interests and then shows me realistic options - WOW! The properties were amazing! Very cle...', time: 'Sep 11, 2025', profile_photo_url: null, source: 'google' },
      { id: '6', author_name: 'Gary Brown', rating: 5, text: 'Thanks so much for your tenacity in selling our property in Antigua. You dealt professionally and calmly with some very demanding potential buyers. We...', time: 'Jun 27, 2025', profile_photo_url: null, source: 'google' },
      { id: '7', author_name: 'Ross Harris', rating: 5, text: "We had a great experience working with Michel at RE/MAX 365. She's incredibly knowledgeable when it comes to Antigua and really helped guide us throug...", time: 'Jun 25, 2025', profile_photo_url: null, source: 'google' },
      { id: '8', author_name: 'Madison Stapley', rating: 5, text: 'Thank you so much for showing us the villa, it was so great meeting you!', time: 'Jun 25, 2025', profile_photo_url: null, source: 'google' },
    ]
  }
  return data as Review[]
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

// Consistent navy-family color per person
const AVATAR_COLORS = [
  'bg-[#0c2749]', 'bg-[#0a1f3a]', 'bg-blue-700', 'bg-indigo-700',
  'bg-[#0c2749]', 'bg-blue-800', 'bg-indigo-800', 'bg-[#0a1f3a]',
]
function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < rating ? 'text-[#0c2749] fill-[#0c2749]' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const initials = getInitials(review.author_name)
  const avatarColor = getAvatarColor(review.author_name)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      {/* Rating row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 text-lg leading-none">{review.rating}</span>
          <StarRating rating={review.rating} />
        </div>
        <span className="text-gray-400 text-xs">{review.time}</span>
      </div>

      {/* Review text */}
      <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-4">{review.text}</p>

      {/* Author row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          {review.profile_photo_url ? (
            <img src={review.profile_photo_url} alt={review.author_name} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
          )}
          <span className="text-sm font-medium text-gray-800">{review.author_name}</span>
        </div>
        <GoogleLogo />
      </div>
    </div>
  )
}

export default async function ReviewsSection() {
  const reviews = await getReviews()
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(2)

  const col1 = reviews.filter((_, i) => i % 4 === 0)
  const col2 = reviews.filter((_, i) => i % 4 === 1)
  const col3 = reviews.filter((_, i) => i % 4 === 2)
  const col4 = reviews.filter((_, i) => i % 4 === 3)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section heading — navy, brand styled */}
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#0c2749] mb-3">
            What Our Clients Are Saying About RE/MAX 365
          </h2>
          <div className="w-16 h-0.5 bg-[#0c2749] mx-auto" />
        </div>

        {/* Summary bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6 pb-8 border-b border-gray-100">
          <div>
            <p className="font-bold text-gray-900 text-base">What are people saying?</p>
            <p className="text-gray-500 text-sm mt-1 max-w-md leading-relaxed">
              From first impressions to lasting results, discover why people choose us again and again through their honest reviews.
            </p>
          </div>
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-black text-gray-900 leading-none">{avgRating}</span>
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className="text-[#0c2749] fill-[#0c2749]" />
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-1">{reviews.length} reviews</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <a
              href="https://g.page/r/YOUR_PLACE_ID/review"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#0c2749] text-sm hover:underline underline-offset-2 whitespace-nowrap"
            >
              Write a review
            </a>
          </div>
        </div>

        {/* 4-column masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-4">
            {col1.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
          <div className="flex flex-col gap-4">
            {col2.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
          <div className="flex flex-col gap-4">
            {col3.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
          <div className="flex flex-col gap-4">
            {col4.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>

      </div>
    </section>
  )
}
