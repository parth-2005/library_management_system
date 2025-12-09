import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';

const Login = () => {
  const [userType, setUserType] = useState('user'); // 'user' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      const payload = { email, password };
      const data = userType === 'admin'
        ? await authAPI.adminLogin(payload)
        : await authAPI.userLogin(payload);

      const actor = data.admin || data.user;
      const role = actor?.role || userType;

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(actor));

      toast.success(`Logged in as ${userType}`);
      
      if (userType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage:
          'linear-gradient(rgba(8,15,40,0.70), rgba(8,15,40,0.70)), url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_40%)]" />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.65)] w-full max-w-md border border-white/30"
      >
        <div className="flex items-center justify-center mb-2">
          <div className="h-12 w-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-bold shadow-lg">
            LMS
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900">
          Library Management System
        </h1>
        <p className="text-center text-sm text-slate-500 mb-6">
          Borrow smarter. Manage seamlessly.
        </p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-400 text-center">
              Admin setup is available at <code>/admin/setup</code>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login As
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  userType === 'user'
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                  userType === 'admin'
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all shadow-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;

