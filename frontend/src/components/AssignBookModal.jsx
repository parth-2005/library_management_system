import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { userAPI } from '../services/api';

const AssignBookModal = ({ book, users, onSubmit, onClose, onUserCreated }) => {
  const normalizeId = (u) => (u?._id || u?.id);

  const [formData, setFormData] = useState({
    userId: '',
    daysAllowed: '',
    rent: '',
  });
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
  });
  const [creatingUser, setCreatingUser] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewUserChange = (e) => {
    setNewUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find user by username or ID
    const selectedUser = users.find(u => {
      const id = normalizeId(u);
      return id === formData.userId || u.username === formData.userId;
    });
    
    if (!selectedUser) {
      alert('Please select a valid user');
      return;
    }

    onSubmit({
      userId: normalizeId(selectedUser),
      userName: selectedUser.username,
      daysAllowed: parseInt(formData.daysAllowed),
      rent: parseFloat(formData.rent),
    });
  };

  const handleCreateUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error('Fill all user fields');
      return;
    }
    try {
      setCreatingUser(true);
      const res = await userAPI.createUser(newUser);
      const created = res.user || res;
      const createdId = normalizeId(created);
      toast.success('User created');
      onUserCreated?.({ ...created, _id: createdId });
      setFormData((prev) => ({ ...prev, userId: createdId }));
      setShowAddUser(false);
      setNewUser({
        username: '',
        email: '',
        phone_number: '',
        password: '',
      });
    } catch (error) {
      toast.error(error.message || 'Could not create user');
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.65)] w-full max-w-xl border border-white/30"
      >
        <div className="px-6 py-4 border-b border-white/35 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-600 font-semibold">Assign</p>
            <h2 className="text-2xl font-bold text-slate-900">Assign Book</h2>
            <p className="text-sm text-slate-600 mt-1">
            {book.book_title} by {book.book_author}
          </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
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
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none shadow-sm"
            >
              <option value="">Select a user</option>
              {users.map((user) => {
                const id = normalizeId(user);
                return (
                  <option key={id || user.username} value={id}>
                    {user.username} ({user.email})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label htmlFor="daysAllowed" className="block text-sm font-semibold text-slate-700 mb-1">
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
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none shadow-sm"
              placeholder="Number of days"
            />
          </div>

          <div>
            <label htmlFor="rent" className="block text-sm font-semibold text-slate-700 mb-1">
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
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none shadow-sm"
              placeholder="Rent amount"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-sky-600 text-white py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition font-semibold"
            >
              Assign Book
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-slate-700 border border-slate-200 py-3 rounded-xl hover:bg-slate-50 transition font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => setShowAddUser((p) => !p)}
              className="text-sm text-sky-700 hover:text-sky-900 font-semibold transition"
            >
              {showAddUser ? 'Hide new user form' : 'Need to add a new user?'}
            </button>

            {showAddUser && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                <input
                  name="username"
                  value={newUser.username}
                  onChange={handleNewUserChange}
                  placeholder="Name"
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
                />
                <input
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  placeholder="Email"
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
                />
                <input
                  name="phone_number"
                  type="tel"
                  value={newUser.phone_number}
                  onChange={handleNewUserChange}
                  placeholder="Phone"
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
                />
                <input
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  placeholder="Password"
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
                />
                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={creatingUser}
                    onClick={handleCreateUser}
                    className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
                  >
                    {creatingUser ? 'Creating...' : 'Add & Select User'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AssignBookModal;

