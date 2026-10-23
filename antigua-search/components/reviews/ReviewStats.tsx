'use client';

import { Star } from 'lucide-react';

interface ReviewStatsProps {
  averageRating?: number;
  reviewCount: number;
}

export default function ReviewStats({ averageRating, reviewCount }: ReviewStatsProps) {
  if (reviewCount === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Star className="w-5 h-5" />
        <span className="text-sm">No reviews yet</span>
      </div>
    );
  }

  const rating = averageRating || 0;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Math.round(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-semibold">{rating.toFixed(1)}</span>
        <span className="mx-1">·</span>
        <span>{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
      </div>
    </div>
  );
}