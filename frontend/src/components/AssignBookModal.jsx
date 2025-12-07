import { useState } from 'react';

const AssignBookModal = ({ book, users, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    userId: '',
    daysAllowed: '',
    rent: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find user by username or ID
    const selectedUser = users.find(u => 
      u._id === formData.userId || u.username === formData.userId
    );
    
    if (!selectedUser) {
      alert('Please select a valid user');
      return;
    }

    onSubmit({
      userId: selectedUser._id,
      userName: selectedUser.username,
      daysAllowed: parseInt(formData.daysAllowed),
      rent: parseFloat(formData.rent),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Assign Book</h2>
          <p className="text-sm text-gray-600 mt-1">
            {book.book_title} by {book.book_author}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
              User *
            </label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="daysAllowed" className="block text-sm font-medium text-gray-700 mb-1">
              Days Allowed *
            </label>
            <input
              type="number"
              id="daysAllowed"
              name="daysAllowed"
              value={formData.daysAllowed}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Number of days"
            />
          </div>

          <div>
            <label htmlFor="rent" className="block text-sm font-medium text-gray-700 mb-1">
              Rent (₹) *
            </label>
            <input
              type="number"
              id="rent"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Rent amount"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Assign Book
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignBookModal;

