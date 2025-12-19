  import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { bookAPI } from '../services/api';

const BookReviewsModal = ({ bookId, bookTitle, isOpen, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [comment, setComment] = useState('');

  const storedUser = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = user?.id || user?._id || null;
  const isUserLoggedIn = !!currentUserId && role === 'user';

  useEffect(() => {
    if (!isOpen || !bookId) return;
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, bookId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const book = await bookAPI.getBookById(bookId);
      const populatedReviews = Array.isArray(book.book_reviews) ? book.book_reviews : [];
      setReviews(populatedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      console.log(error)
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!isUserLoggedIn) {
      toast.error('Please login as a user to add a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Review cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`http://localhost:5001/api/book/${bookId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ comment: comment.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to add review');
      }

      toast.success('Review added');
      setComment('');
      // Optimistically update list
      setReviews((prev) => [...prev, data.review]);
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error(error.message || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;

    try {
      setDeletingId(reviewId);
      const response = await fetch(`http://localhost:5001/api/book/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to delete review');
      }

      toast.success('Review deleted');
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.7)] w-full max-w-xl border border-white/30 max-h-[90vh] flex flex-col"
      >
        <div className="px-6 py-4 border-b border-white/40 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">Reviews</p>
            <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">{bookTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 overflow-y-auto">
          {loading ? (
            <div className="py-8 text-center text-slate-500 text-sm">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              No reviews yet. Be the first to share your thoughts!
            </div>
          ) : (
            <ul className="space-y-3">
              {reviews.map((review) => {
                const authorName =
                  review.user?.username ||
                  review.user?.email ||
                  'Anonymous';
                const isOwnReview =
                  currentUserId && review.user && (review.user._id === currentUserId || review.user === currentUserId);

                return (
                  <li
                    key={review._id}
                    className="border border-slate-200 rounded-xl p-3 bg-white/80 flex justify-between items-start gap-3"
                  >
                    <div>
                      <p className="text-sm text-slate-800 whitespace-pre-line">{review.comment}</p>
                      <p className="mt-1 text-xs text-slate-500">— {authorName}</p>
                    </div>
                    {isOwnReview && (
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        disabled={deletingId === review._id}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold"
                      >
                        {deletingId === review._id ? 'Deleting...' : 'Delete'}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          <div className="border-t border-slate-200 pt-4 mt-2">
            {isUserLoggedIn ? (
              <form onSubmit={handleAddReview} className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                  Add your review
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                  placeholder="Share your thoughts about this book..."
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-slate-500">
                Login as a user to write a review.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookReviewsModal;


