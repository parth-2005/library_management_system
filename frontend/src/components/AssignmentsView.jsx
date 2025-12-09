import { useState } from 'react';
import toast from 'react-hot-toast';
import { assignmentAPI } from '../services/api';

const AssignmentsView = ({ assignments, users, books, onRefresh }) => {
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'returned'

  const filteredAssignments = assignments.filter((assignment) => {
    if (filterStatus === 'active') return !assignment.returned;
    if (filterStatus === 'returned') return assignment.returned;
    return true;
  });

  const getUserName = (userId) => {
    const id = typeof userId === 'object' ? userId._id : userId;
    const user = users.find(u => u._id === id);
    return user ? user.username : userId?.username || 'Unknown';
  };

  const getBookTitle = (bookId) => {
    const id = typeof bookId === 'object' ? bookId._id : bookId;
    const book = books.find(b => b._id === id);
    return book ? book.book_title : bookId?.book_title || 'Unknown';
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

  const handleReturnBook = async (assignmentId) => {
    if (!window.confirm('Mark this book as returned?')) {
      return;
    }

    try {
      await assignmentAPI.returnBook(assignmentId);
      toast.success('Book marked as returned');
      onRefresh();
    } catch (error) {
      toast.error('Failed to return book');
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl overflow-hidden mb-6 border border-amber-100">
      <div className="px-6 py-4 border-b border-amber-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">Overview</p>
            <h2 className="text-xl font-semibold text-gray-900">Book Assignments</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md'
                  : 'bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filterStatus === 'active'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('returned')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filterStatus === 'returned'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100'
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
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Issued Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Days Allowed
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.map((assignment) => {
                const daysRemaining = calculateDaysRemaining(
                  assignment.issuedDate,
                  assignment.daysAllowed
                );
                const isOverdue = daysRemaining < 0;

                return (
                  <tr key={assignment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getUserName(assignment.userId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getBookTitle(assignment.bookId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(assignment.issuedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.daysAllowed} days
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                      {!assignment.returned && (
                        <button
                          onClick={() => handleReturnBook(assignment._id)}
                          className="text-emerald-600 hover:text-emerald-800 font-semibold transition"
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignmentsView;

