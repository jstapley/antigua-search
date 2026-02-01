'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Star, Check, X, Trash2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  reviewer_name?: string;
  reviewer_email?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  listing?: {
    id: string;
    business_name: string;
    slug: string;
  };
}

interface AdminReviewsClientProps {
  initialReviews: Review[];
}

export default function AdminReviewsClient({ initialReviews }: AdminReviewsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState<string | null>(null);

  const filteredReviews = reviews.filter(review => 
    filter === 'all' ? true : review.status === filter
  );

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const rejectedCount = reviews.filter(r => r.status === 'rejected').length;

  async function handleApprove(reviewId: string) {
    setLoading(reviewId);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, status: 'approved' as const } : r
      ));
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review');
    } finally {
      setLoading(null);
    }
  }

  async function handleReject(reviewId: string) {
    setLoading(reviewId);
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'rejected' })
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.map(r => 
        r.id === reviewId ? { ...r, status: 'rejected' as const } : r
      ));
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert('Failed to reject review');
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete(reviewId: string) {
    if (!confirm('Are you sure you want to permanently delete this review?')) {
      return;
    }

    setLoading(reviewId);
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500 mb-1">Total Reviews</div>
          <div className="text-3xl font-bold text-gray-900">{reviews.length}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-6 border-2 border-yellow-200">
          <div className="text-sm text-yellow-700 mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-900">{pendingCount}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6 border-2 border-green-200">
          <div className="text-sm text-green-700 mb-1">Approved</div>
          <div className="text-3xl font-bold text-green-900">{approvedCount}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-6 border-2 border-red-200">
          <div className="text-sm text-red-700 mb-1">Rejected</div>
          <div className="text-3xl font-bold text-red-900">{rejectedCount}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  filter === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-2 bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs">
                  {tab === 'all' ? reviews.length :
                   tab === 'pending' ? pendingCount :
                   tab === 'approved' ? approvedCount :
                   rejectedCount}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No {filter !== 'all' && filter} reviews found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                review.status === 'pending' ? 'border-yellow-400' :
                review.status === 'approved' ? 'border-green-400' :
                'border-red-400'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Business Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {review.listing?.business_name || 'Unknown Business'}
                    </h3>
                    {review.listing?.slug && (
                      
                        <a href={`/listing/${review.listing.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                  )}

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                  )}

                  {/* Reviewer Info */}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{review.reviewer_name || 'Anonymous'}</span>
                    {review.reviewer_email && (
                      <span className="ml-2">({review.reviewer_email})</span>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    review.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {review.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    disabled={loading === review.id}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    {loading === review.id ? 'Approving...' : 'Approve'}
                  </button>
                )}

                {review.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(review.id)}
                    disabled={loading === review.id}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <X className="w-4 h-4" />
                    {loading === review.id ? 'Rejecting...' : 'Reject'}
                  </button>
                )}

                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={loading === review.id}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}