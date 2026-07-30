import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiBan, HiCheck, HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { userAPI } from '../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getAll().then(res => { setUsers(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleToggleBlock = async (id) => {
    try {
      const res = await userAPI.toggleBlock(id);
      setUsers(users.map(u => u._id === id ? res.data : u));
      toast.success(res.data.isBlocked ? 'User blocked' : 'User unblocked');
    } catch (err) {
      toast.error('Failed to update user');
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">Users</h1>
      {loading ? (
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 bg-green-100 rounded-xl"></div>)}</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <HiSparkles className="text-5xl text-green-300 mx-auto mb-4" />
          <p className="text-green-500 font-semibold">No users yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 text-left">
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">User</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Email</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Phone</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Joined</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Status</th>
                  <th className="px-4 py-3 text-sm font-semibold text-green-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-t border-green-100 hover:bg-orange-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-medium text-green-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-green-500">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-green-500">{user.phone}</td>
                    <td className="px-4 py-3 text-sm text-green-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleBlock(user._id)} className={`p-2 rounded-lg transition ${user.isBlocked ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                        {user.isBlocked ? <HiCheck className="text-lg" /> : <HiBan className="text-lg" />}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
