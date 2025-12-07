import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assignmentAPI, userAPI } from '../services/api';

const UserDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/');
      return;
    }
    fetchUserData();
  }, [username, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // First, get all users to find the current user by username
      const users = await userAPI.getAllUsers();
      const currentUser = users.find(u => u.username === username);
      
      if (!currentUser) {
        toast.error('User not found');
        return;
      }
      
      setUser(currentUser);
      
      // Get user's book assignments
      // Note: This endpoint needs to be created in backend
      try {
        const userAssignments = await assignmentAPI.getUserAssignments(currentUser._id);
        setAssignments(userAssignments);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        // For now, show empty state if endpoint doesn't exist
        setAssignments([]);
      }
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
    dueDate.setDate(dueDate.getDate() + daysAllowed);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
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

  const totalRent = assignments.reduce((sum, assignment) => sum + (assignment.rent || 0), 0);
  const totalBooks = assignments.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Books</h3>
            <p className="text-3xl font-bold text-blue-600">{totalBooks}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Rent</h3>
            <p className="text-3xl font-bold text-green-600">₹{totalRent}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Active Books</h3>
            <p className="text-3xl font-bold text-purple-600">
              {assignments.filter(a => !a.returned).length}
            </p>
          </div>
        </div>

        {/* Books List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">My Books</h2>
          </div>
          
          {assignments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No books assigned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issued Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days Remaining
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment) => {
                    const daysRemaining = calculateDaysRemaining(
                      assignment.issuedDate,
                      assignment.daysAllowed
                    );
                    const isOverdue = daysRemaining < 0;
                    
                    return (
                      <tr key={assignment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {assignment.book?.book_title || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.book?.book_author || 'N/A'}
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
                          ₹{assignment.rent || 0}
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

