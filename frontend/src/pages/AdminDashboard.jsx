import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookAPI, userAPI, assignmentAPI } from '../services/api';
import BookForm from '../components/BookForm';
import AssignBookModal from '../components/AssignBookModal';
import AssignmentsView from '../components/AssignmentsView';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookForm, setShowBookForm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }
    fetchData();
  }, [username, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksData, usersData, assignmentsData] = await Promise.all([
        bookAPI.getAllBooks(),
        userAPI.getAllUsers(),
        assignmentAPI.getAllAssignments().catch(() => []), // Handle if endpoint doesn't exist
      ]);
      setBooks(booksData);
      setUsers(usersData);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = () => {
    setEditingBook(null);
    setShowBookForm(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setShowBookForm(true);
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await bookAPI.deleteBook(id);
      toast.success('Book deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const handleAssignBook = (book) => {
    setSelectedBook(book);
    setShowAssignModal(true);
  };

  const handleBookFormSubmit = async (bookData) => {
    try {
      if (editingBook) {
        await bookAPI.updateBook(editingBook._id, bookData);
        toast.success('Book updated successfully');
      } else {
        await bookAPI.addBook(bookData);
        toast.success('Book added successfully');
      }
      setShowBookForm(false);
      setEditingBook(null);
      fetchData();
    } catch (error) {
      toast.error(editingBook ? 'Failed to update book' : 'Failed to add book');
    }
  };

  const handleAssignSubmit = async (assignmentData) => {
    try {
      await assignmentAPI.assignBook({
        bookId: selectedBook._id,
        ...assignmentData,
      });
      toast.success('Book assigned successfully');
      setShowAssignModal(false);
      setSelectedBook(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to assign book');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    navigate('/');
    toast.success('Logged out successfully');
  };

  const filteredBooks = books.filter(
    (book) =>
      book.book_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.book_author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.book_language?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleAddBook}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            Add New Book
          </button>
          <button
            onClick={() => setShowAssignments(!showAssignments)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
          >
            {showAssignments ? 'Hide' : 'View'} All Assignments
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books by title, author, or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
          />
        </div>

        {/* Assignments View */}
        {showAssignments && (
          <div className="mb-6">
            <AssignmentsView assignments={assignments} users={users} books={books} onRefresh={fetchData} />
          </div>
        )}

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Books ({filteredBooks.length})
            </h2>
          </div>

          {filteredBooks.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No books found matching your search' : 'No books available'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {book.book_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.book_author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.book_language}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{book.book_price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            book.book_quantity > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {book.book_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAssignBook(book)}
                            className="text-green-600 hover:text-green-900 font-medium"
                            disabled={book.book_quantity === 0}
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Book Form Modal */}
      {showBookForm && (
        <BookForm
          book={editingBook}
          onSubmit={handleBookFormSubmit}
          onClose={() => {
            setShowBookForm(false);
            setEditingBook(null);
          }}
        />
      )}

      {/* Assign Book Modal */}
      {showAssignModal && selectedBook && (
        <AssignBookModal
          book={selectedBook}
          users={users}
          onSubmit={handleAssignSubmit}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

