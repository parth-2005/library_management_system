import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assignmentAPI } from '../services/api';

const UserDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const username = storedUser ? JSON.parse(storedUser).username : null;

  useEffect(() => {
    if (!token || role !== 'user') {
      navigate('/');
      return;
    }
    fetchUserData();
  }, [token, role, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      setUser(currentUser);

      if (!currentUser) {
        toast.error('User not found');
        navigate('/');
        return;
      }

      const userAssignments = await assignmentAPI.getUserAssignments(currentUser.id || currentUser._id);
      setAssignments(userAssignments);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysRemaining = (assignmentDate, daysAllowed) => {
    const issuedDate = new Date(assignmentDate);
    const dueDate = new Date(issuedDate);
    const days = Number.isFinite(daysAllowed) ? daysAllowed : 0;
    dueDate.setDate(dueDate.getDate() + days);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

  // Only calculate rent for active (non-returned) assignments
  const totalRent = assignments
    .filter(assignment => !assignment.returned)
    .reduce((sum, assignment) => sum + (assignment.rent || 0), 0);
  const activeBooks = assignments.filter(assignment =>!assignment.returned).length;
  const visibleAssignments = showHistory
    ? assignments.filter(a => a.returned)
    : assignments;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          'linear-gradient(rgba(10,15,35,0.78), rgba(10,15,35,0.78)), url("https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <nav className="bg-white/85 backdrop-blur shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-600 font-semibold">Library</p>
              <h1 className="text-2xl font-bold text-slate-900">User Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-white/80 text-slate-700 rounded-lg hover:bg-white transition border border-slate-200"
              >
                Home
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
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/user/books')}
                className="px-4 py-2 bg-white text-slate-800 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
              >
                Browse & Review Books
              </button>
            </div>
          </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Books left to return</h3>
            <p className="text-3xl font-bold text-blue-600">{activeBooks}</p>
          </div>
          <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Rent (Active)</h3>
            <p className="text-3xl font-bold text-green-600">₹{totalRent}</p>
          </div>
          <div className="bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Books</h3>
            <p className="text-3xl font-bold text-purple-600">
              {assignments.filter(a => !a.returned).length}
            </p>
          </div>
        </div>

        {/* Books List */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {showHistory ? 'Borrowing History' : 'My Current Books'}
            </h2>
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className="text-sm px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
            >
              {showHistory ? 'Show Current' : 'View History'}
            </button>
          </div>
          
          {visibleAssignments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                {showHistory ? 'No past borrowed books yet' : 'No books assigned yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Book Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Issued Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Days Remaining
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visibleAssignments.map((assignment) => {
                    const daysRemaining = calculateDaysRemaining(
                      assignment.issuedDate,
                      assignment.daysAllowed
                    );
                    const isOverdue = daysRemaining < 0;
                    
                    return (
                      <tr key={assignment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {assignment.bookId?.book_title || assignment.book?.book_title || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.bookId?.book_author || assignment.book?.book_author || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(assignment.issuedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isOverdue
                                ? 'bg-red-100 text-red-800'
                                : daysRemaining <= 3
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assignment.returned ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            `₹${assignment.rent || 0}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              assignment.returned
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {assignment.returned ? 'Returned' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

