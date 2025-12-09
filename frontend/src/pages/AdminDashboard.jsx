import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookAPI, userAPI, assignmentAPI } from '../services/api';
import BookForm from '../components/BookForm';
import AssignBookModal from '../components/AssignBookModal';
import AssignmentsView from '../components/AssignmentsView';
import UserFormModal from '../components/UserFormModal';

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
  const [showUserForm, setShowUserForm] = useState(false);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const admin = storedUser ? JSON.parse(storedUser) : null;
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [token, role, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksData, usersData, assignmentsData] = await Promise.all([
        bookAPI.getAllBooks(),
        userAPI.getAllUsers(),
        assignmentAPI.getAllAssignments().catch(() => []),
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

  const handleUserCreated = (createdUser) => {
    if (!createdUser) return;
    const id = createdUser._id || createdUser.id;
    setUsers((prev) => [...prev, { ...createdUser, _id: id }]);
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
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          'linear-gradient(rgba(10,15,35,0.78), rgba(10,15,35,0.78)), url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <nav className="bg-white/85 backdrop-blur shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-600 font-semibold">Library</p>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-700">Welcome, {admin?.adminName || admin?.email}</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleAddBook}
            className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition font-semibold shadow-sky-200"
          >
            Add New Book
          </button>
          <button
            onClick={() => setShowAssignments(!showAssignments)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition font-semibold shadow-emerald-200"
          >
            {showAssignments ? 'Hide' : 'View'} All Assignments
          </button>
          <button
            onClick={() => setShowUserForm(true)}
            className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition font-semibold shadow-amber-200"
          >
            Create User
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books by title, author, or language..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none shadow-sm bg-white/80"
          />
        </div>

        {/* Assignments View */}
        {showAssignments && (
          <div className="mb-6">
            <AssignmentsView assignments={assignments} users={users} books={books} onRefresh={fetchData} />
          </div>
        )}

        {/* Books Table */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Books ({filteredBooks.length})
            </h2>
            <div className="text-sm text-gray-500">Curated collection</div>
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-slate-50 transition">
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
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${
                            book.book_quantity > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {book.book_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBook(book)}
                            className="text-sky-600 hover:text-sky-800 font-semibold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAssignBook(book)}
                            className="text-emerald-600 hover:text-emerald-800 font-semibold transition"
                            disabled={book.book_quantity === 0}
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => handleDeleteBook(book._id)}
                            className="text-amber-700 hover:text-amber-900 font-semibold transition"
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
          onUserCreated={handleUserCreated}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedBook(null);
          }}
        />
      )}

      {showUserForm && (
        <UserFormModal
          onClose={() => setShowUserForm(false)}
          onCreated={handleUserCreated}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

