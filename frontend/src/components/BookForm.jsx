import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BookForm = ({ book, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    book_title: '',
    book_author: '',
    book_language: '',
    book_price: '',
    book_quantity: '',
  });

  useEffect(() => {
    if (book) {
      setFormData({
        book_title: book.book_title || '',
        book_author: book.book_author || '',
        book_language: book.book_language || '',
        book_price: book.book_price || '',
        book_quantity: book.book_quantity || '',
      });
    }
  }, [book]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert quantity to number for backend
    const submitData = {
      ...formData,
      book_quantity: parseInt(formData.book_quantity, 10),
    };
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.65)] w-full max-w-md border border-white/30"
      >
        <div className="px-6 py-4 border-b border-white/40">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">Books</p>
          <h2 className="text-xl font-semibold text-gray-900">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label htmlFor="book_title" className="block text-sm font-semibold text-gray-700 mb-1">
              Book Title *
            </label>
            <input
              type="text"
              id="book_title"
              name="book_title"
              value={formData.book_title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="book_author" className="block text-sm font-semibold text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              id="book_author"
              name="book_author"
              value={formData.book_author}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="book_language" className="block text-sm font-semibold text-gray-700 mb-1">
              Language *
            </label>
            <input
              type="text"
              id="book_language"
              name="book_language"
              value={formData.book_language}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="book_price" className="block text-sm font-semibold text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="text"
              id="book_price"
              name="book_price"
              value={formData.book_price}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="book_quantity" className="block text-sm font-semibold text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              id="book_quantity"
              name="book_quantity"
              value={formData.book_quantity}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-3 border border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none shadow-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition font-semibold"
            >
              {book ? 'Update' : 'Add'} Book
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border border-amber-100 py-3 rounded-xl hover:bg-amber-50 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BookForm;

