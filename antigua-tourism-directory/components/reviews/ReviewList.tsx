'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  reviewer_name?: string;
  helpful_count: number;
  created_at: string;
  user_id?: string;
}

interface ReviewListProps {
  listingId: string;
}

export default function ReviewList({ listingId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('listing_id', listingId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleHelpful(reviewId: string) {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      const { error } = await supabase
        .from('reviews')
        .update({ helpful_count: review.helpful_count + 1 })
        .eq('id', reviewId);

      if (error) throw error;

      // Update local state
      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, helpful_count: r.helpful_count + 1 }
          : r
      ));
    } catch (error) {
      console.error('Error updating helpful count:', error);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6 last:border-b-0">
          {/* Rating Stars */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </span>
          </div>

          {/* Review Title */}
          {review.title && (
            <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
          )}

          {/* Review Comment */}
          {review.comment && (
            <p className="text-gray-700 mb-3">{review.comment}</p>
          )}

          {/* Reviewer Info & Helpful Button */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {review.reviewer_name || 'Anonymous'}
            </span>
            
            <button
              onClick={() => handleHelpful(review.id)}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpful_count})</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}