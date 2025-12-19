import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { bookAPI } from '../services/api';
import BookReviewsModal from '../components/BookReviewsModal';

const UserBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookForReviews, setSelectedBookForReviews] = useState(null);

  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!token || role !== 'user') {
      navigate('/');
      return;
    }
    fetchBooks();
  }, [token, role, navigate]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookAPI.getAllBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewsClick = (book) => {
    setSelectedBookForReviews(book);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.book_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.book_author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.book_language?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(14,18,34,0.85), rgba(18,24,42,0.85)), url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <nav className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-600 font-semibold">Library</p>
              <h1 className="text-2xl font-bold text-slate-900">All Books</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/user/dashboard')}
                className="px-4 py-2 bg-white/80 text-slate-700 rounded-lg hover:bg-white transition border border-slate-200"
              >
                Go to Dashboard
              </button>
              <span className="text-slate-700">Welcome, {user?.username || user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:shadow-md hover:-translate-y-0.5 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white/80 border border-white/60 backdrop-blur-2xl rounded-3xl shadow-[0_24px_80px_-45px_rgba(0,0,0,0.55)] p-6">
          <input
            type="text"
            placeholder="Search books by title, author, or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none shadow-sm bg-white/90 text-slate-900 placeholder:text-slate-400 backdrop-blur"
          />
        </div>

        {filteredBooks.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_24px_80px_-50px_rgba(0,0,0,0.6)] p-12 text-center border border-white/70">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No books found matching your search' : 'No books available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_8px_30px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-white/70 hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-1"
              >
                <div className="relative h-64 bg-gradient-to-br from-amber-50 to-rose-50 flex items-center justify-center overflow-hidden">
                  {book.book_cover ? (
                    <img
                      src={book.book_cover}
                      alt={book.book_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <svg
                        className="mx-auto h-16 w-16 text-amber-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <p className="text-xs text-amber-400 mt-2">No Cover</p>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 mb-1">
                      {book.book_title}
                    </h3>
                    <p className="text-sm text-slate-600">by {book.book_author}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Price</p>
                      <p className="text-xl font-bold text-amber-600">₹{book.book_price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Language</p>
                      <p className="text-sm font-medium text-slate-700">{book.book_language}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReviewsClick(book)}
                    className="w-full py-2.5 rounded-xl font-semibold text-sm bg-sky-600 text-white hover:bg-sky-700 transition"
                  >
                    View & Add Reviews
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedBookForReviews && (
        <BookReviewsModal
          bookId={selectedBookForReviews._id}
          bookTitle={selectedBookForReviews.book_title}
          isOpen={!!selectedBookForReviews}
          onClose={() => setSelectedBookForReviews(null)}
        />
      )}
    </div>
  );
};

export default UserBooks;


