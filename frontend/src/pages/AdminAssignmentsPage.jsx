import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { assignmentAPI } from '../services/api';

const AdminAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('active'); // 'all', 'active', 'returned' - default to 'active' to hide returned books
  const [sendingEmail, setSendingEmail] = useState(null); // Track which assignment is sending email
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const storedUser = localStorage.getItem('user');
  const admin = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!token || role !== 'admin') {
      navigate('/');
      return;
    }
    fetchAssignments();
  }, [token, role, navigate]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const assignmentsData = await assignmentAPI.getAllAssignments();
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filterStatus === 'active') return !assignment.returned;
    if (filterStatus === 'returned') return assignment.returned;
    return true;
  });

  const getUserName = (userId) => {
    if (!userId) return 'Unknown';
    if (typeof userId === 'object' && userId !== null) {
      return userId.username || userId.email || 'Unknown';
    }
    return 'Unknown';
  };

  const getUserEmail = (userId) => {
    if (!userId) return null;
    if (typeof userId === 'object' && userId !== null) {
      return userId.email || null;
    }
    return null;
  };

  const getBookTitle = (bookId) => {
    if (!bookId) return 'Unknown';
    if (typeof bookId === 'object' && bookId !== null) {
      return bookId.book_title || 'Unknown';
    }
    return 'Unknown';
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

  const handleSendReminderEmail = async (assignmentId, userEmail) => {
    if (!userEmail) {
      toast.error('User email not found');
      return;
    }

    try {
      setSendingEmail(assignmentId);
      await assignmentAPI.sendReminderEmail(assignmentId);
      toast.success(`Reminder email sent to ${userEmail}`);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send reminder email');
    } finally {
      setSendingEmail(null);
    }
  };

  const handleReturnBook = async (assignmentId) => {
    if (!window.confirm('Mark this book as returned?')) {
      return;
    }

    try {
      await assignmentAPI.returnBook(assignmentId);
      toast.success('Book marked as returned');
      fetchAssignments();
    } catch (error) {
      toast.error('Failed to return book');
    }
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
          'linear-gradient(120deg, rgba(14,18,34,0.8), rgba(18,24,42,0.78)), url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <nav className="bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-sky-600 font-semibold">Library</p>
              <h1 className="text-2xl font-bold text-slate-900">Assignments Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 bg-white/80 text-slate-700 rounded-lg hover:bg-white transition border border-white/30 backdrop-blur"
              >
                Back to Dashboard
              </button>
              <span className="text-slate-700">Welcome, {admin?.adminName || admin?.email}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('role');
                  localStorage.removeItem('user');
                  localStorage.removeItem('token');
                  navigate('/');
                  toast.success('Logged out successfully');
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:shadow-md hover:-translate-y-0.5 transition border border-white/30 backdrop-blur"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_24px_80px_-50px_rgba(0,0,0,0.6)] overflow-hidden border border-white/70">
          <div className="px-6 py-4 border-b border-white/70">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-sky-600 font-semibold">Overview</p>
                <h2 className="text-xl font-semibold text-slate-900">
                  All Assignments ({filteredAssignments.length})
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filterStatus === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filterStatus === 'active'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('returned')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    filterStatus === 'returned'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Returned
                </button>
              </div>
            </div>
          </div>

          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No assignments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/80 backdrop-blur">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Issued Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Days Remaining
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Rent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white backdrop-blur divide-y divide-slate-100">
                  {filteredAssignments.map((assignment) => {
                    const daysRemaining = calculateDaysRemaining(
                      assignment.issuedDate,
                      assignment.daysAllowed
                    );
                    const isOverdue = daysRemaining < 0;
                    const userEmail = getUserEmail(assignment.userId);
                    const dueDate = new Date(assignment.issuedDate);
                    dueDate.setDate(dueDate.getDate() + assignment.daysAllowed);

                    return (
                      <tr key={assignment._id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          {getUserName(assignment.userId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {userEmail || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {getBookTitle(assignment.bookId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {new Date(assignment.issuedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {dueDate.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isOverdue
                                ? 'bg-rose-100 text-rose-800'
                                : daysRemaining <= 3
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isOverdue
                              ? `${Math.abs(daysRemaining)} days overdue`
                              : `${daysRemaining} days`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          ₹{assignment.rent || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              assignment.returned
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {assignment.returned ? 'Returned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2 flex-wrap">
                            {!assignment.returned && userEmail && (
                              <button
                                onClick={() => handleSendReminderEmail(assignment._id, userEmail)}
                                disabled={sendingEmail === assignment._id}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                                  sendingEmail === assignment._id
                                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                                title={`Send reminder email to ${userEmail}`}
                              >
                                {sendingEmail === assignment._id ? 'Sending...' : '📧 Send Reminder'}
                              </button>
                            )}
                            {!assignment.returned && (
                              <button
                                onClick={() => handleReturnBook(assignment._id)}
                                className="text-emerald-600 hover:text-emerald-800 font-semibold transition text-xs"
                              >
                                Mark Returned
                              </button>
                            )}
                          </div>
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

export default AdminAssignmentsPage;

