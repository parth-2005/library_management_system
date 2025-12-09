import { useState } from 'react';
import toast from 'react-hot-toast';
import { userAPI } from '../services/api';

const UserFormModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await userAPI.createUser(formData);
      toast.success('User created');
      onCreated?.(res.user);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-sky-600 font-semibold">Admin</p>
            <h2 className="text-2xl font-bold text-slate-900">Create User</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                name="phone_number"
                type="tel"
                required
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent shadow-sm"
              placeholder="Secure password"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-sky-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-slate-700 border border-slate-200 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;

