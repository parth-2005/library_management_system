import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BookForm = ({ book, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    book_title: '',
    book_author: '',
    book_language: '',
    book_price: '',
    book_quantity: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  useEffect(() => {
    if (book) {
      setFormData({
        book_title: book.book_title || '',
        book_author: book.book_author || '',
        book_language: book.book_language || '',
        book_price: book.book_price || '',
        book_quantity: book.book_quantity || '',
      });
      if (book.book_cover) {
        setPreview(book.book_cover);
      }
    }
  }, [book]);

  const validateFile = (file) => {
    setError('');
    
    // Check file type
    if (file.type !== 'image/png') {
      setError('Only PNG images are allowed');
      return false;
    }
    
    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    
    if (validateFile(file)) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate file for new books
    if (!book && !selectedFile) {
      setError('Please upload a book cover image');
      return;
    }
    
    // Convert quantity to number for backend
    const submitData = {
      ...formData,
      book_quantity: parseInt(formData.book_quantity, 10),
    };
    
    // Only include book_cover if a new file is selected
    if (selectedFile) {
      submitData.book_cover = selectedFile;
    }
    
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
          {/* Book Cover Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Book Cover * {!book && '(PNG only, max 10MB)'}
            </label>
            <div
              ref={dropZoneRef}
              onClick={handleClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-amber-200 hover:border-amber-300 bg-amber-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Book cover preview"
                    className="max-h-48 mx-auto rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition shadow-lg"
                  >
                    ×
                  </button>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedFile?.name || 'Current cover'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to change or drag a new image
                  </p>
                </div>
              ) : (
                <div>
                  <svg
                    className="mx-auto h-12 w-12 text-amber-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-amber-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG only, max 10MB</p>
                </div>
              )}
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

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

