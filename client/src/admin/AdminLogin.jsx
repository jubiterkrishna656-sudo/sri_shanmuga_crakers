import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiShieldCheck, HiEye, HiEyeOff, HiArrowLeft, HiExclamationCircle, HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      await adminLogin({ email, password });
      toast.success('Welcome Admin!');
      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid credentials';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-orange-900 to-green-900 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-orange-200/30">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
            <HiShieldCheck className="text-4xl text-white" />
          </div>
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full mb-3">Shop Owner Only</span>
          <h1 className="text-3xl font-bold text-green-800">Admin Login</h1>
          <p className="text-green-500 mt-1">Shanmuga Crackers Admin Panel</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <HiExclamationCircle className="text-red-500 text-lg shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1.5">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Enter admin email"
              className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition placeholder:text-green-400"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-green-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                className="w-full border border-green-300 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition placeholder:text-green-400"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-600 transition">
                {showPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 shadow-lg shadow-orange-200 flex items-center justify-center space-x-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Verifying...</span>
              </>
            ) : 'Login to Admin'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-green-500 hover:text-orange-500 transition space-x-1.5">
            <HiArrowLeft />
            <span>Back to Main Site</span>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
