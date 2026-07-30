import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', pincode: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, address: form.address, pincode: form.pincode, password: form.password });
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <HiSparkles className="text-5xl text-orange-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-green-800">Create Account</h1>
          <p className="text-green-500">Join Shanmuga Crackers family</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" placeholder="Enter your full name" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Email Address <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" placeholder="Phone number" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 h-20 resize-none" placeholder="Enter your delivery address" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Pincode</label>
              <input type="text" name="pincode" value={form.pincode} onChange={handleChange} maxLength={6} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" placeholder="6-digit pincode" />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Password <span className="text-red-500">*</span></label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" placeholder="Min 6 characters" required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4 text-green-500">Already have an account? <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-600">Login</Link></p>
      </motion.div>
    </div>
  );
}
