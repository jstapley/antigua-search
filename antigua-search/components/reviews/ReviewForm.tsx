'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  listingId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ listingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();

      // Validate
      if (rating === 0) {
        setError('Please select a rating');
        setSubmitting(false);
        return;
      }

      if (!comment.trim()) {
        setError('Please write a review');
        setSubmitting(false);
        return;
      }

      if (!user && !reviewerName.trim()) {
        setError('Please enter your name');
        setSubmitting(false);
        return;
      }

      // Insert review
      const { error: insertError } = await supabase
        .from('reviews')
        .insert({
          listing_id: listingId,
          user_id: user?.id || null,
          rating,
          title: title.trim() || null,
          comment: comment.trim(),
          reviewer_name: user ? null : reviewerName.trim(),
          reviewer_email: user ? null : reviewerEmail.trim() || null,
          status: 'pending' // Requires moderation
        });

      if (insertError) throw insertError;

      // Success!
      setSuccess(true);
      setRating(0);
      setTitle('');
      setComment('');
      setReviewerName('');
      setReviewerEmail('');
      
      if (onSuccess) onSuccess();

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);

    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Thank you! Your review has been submitted and is pending approval.
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating *
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title (optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sum up your experience"
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={5}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Name (for non-authenticated users) */}
        <div>
          <label htmlFor="reviewer_name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="reviewer_name"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Email (optional, for non-authenticated users) */}
        <div>
          <label htmlFor="reviewer_email" className="block text-sm font-medium text-gray-700 mb-2">
            Your Email (optional)
          </label>
          <input
            type="email"
            id="reviewer_email"
            value={reviewerEmail}
            onChange={(e) => setReviewerEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            We'll never share your email publicly
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Your review will be visible after moderation
        </p>
      </form>
    </div>
  );
}