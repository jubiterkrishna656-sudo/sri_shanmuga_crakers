import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '', pincode: user?.pincode || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.updateProfile(form);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-8">My <span className="text-orange-500">Profile</span></h1>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800">{user?.name}</h2>
            <p className="text-green-500 flex items-center"><HiMail className="mr-1" /> {user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1 flex items-center"><HiUser className="mr-1" /> Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1 flex items-center"><HiPhone className="mr-1" /> Phone</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1 flex items-center"><HiLocationMarker className="mr-1" /> Address</label>
            <textarea value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 h-24 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1 flex items-center"><HiLocationMarker className="mr-1" /> Pincode</label>
            <input type="text" value={form.pincode} onChange={(e) => setForm({...form, pincode: e.target.value})} maxLength={6} className="w-full border border-green-300 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" />
          </div>
          <button type="submit" disabled={loading} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
