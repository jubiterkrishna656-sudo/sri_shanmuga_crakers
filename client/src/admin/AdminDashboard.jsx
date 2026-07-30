import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiUsers, HiCube, HiShoppingBag, HiCurrencyRupee, HiClock, HiTrendingUp } from 'react-icons/hi';
import { adminAPI } from '../utils/api';

const statsConfig = [
  { key: 'totalUsers', label: 'Total Users', icon: HiUsers, color: 'bg-blue-500', textColor: 'text-blue-600' },
  { key: 'totalProducts', label: 'Total Products', icon: HiCube, color: 'bg-green-500', textColor: 'text-green-600' },
  { key: 'totalOrders', label: 'Total Orders', icon: HiShoppingBag, color: 'bg-purple-500', textColor: 'text-purple-600' },
  { key: 'totalRevenue', label: 'Total Revenue', icon: HiCurrencyRupee, color: 'bg-orange-500', textColor: 'text-orange-600' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: HiClock, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">Dashboard</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5].map(i => <div key={i} className="bg-white rounded-2xl p-6 animate-pulse h-32"></div>)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsConfig.map((cfg, i) => (
              <motion.div key={cfg.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-500 text-sm">{cfg.label}</p>
                    <p className="text-3xl font-bold text-green-800 mt-1">
                      {cfg.key === 'totalRevenue' ? `₹${stats?.[cfg.key]?.toLocaleString() || 0}` : stats?.[cfg.key] || 0}
                    </p>
                  </div>
                  <div className={`${cfg.color} p-3 rounded-xl`}>
                    <cfg.icon className="text-white text-2xl" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg text-green-800 mb-4 flex items-center"><HiTrendingUp className="mr-2 text-orange-500" /> Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <a href="/admin/products" className="bg-orange-50 hover:bg-orange-100 rounded-xl p-4 text-center transition">
                  <HiCube className="text-3xl text-orange-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-700">Manage Products</p>
                </a>
                <a href="/admin/orders" className="bg-purple-50 hover:bg-purple-100 rounded-xl p-4 text-center transition">
                  <HiShoppingBag className="text-3xl text-purple-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-700">View Orders</p>
                </a>
                <a href="/admin/users" className="bg-blue-50 hover:bg-blue-100 rounded-xl p-4 text-center transition">
                  <HiUsers className="text-3xl text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-700">Manage Users</p>
                </a>
                <a href="/" className="bg-green-50 hover:bg-green-100 rounded-xl p-4 text-center transition">
                  <HiShoppingBag className="text-3xl text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-green-700">View Site</p>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-lg text-green-800 mb-4">Recent Activity</h3>
              <p className="text-green-500 text-sm">Orders needing attention: {stats?.pendingOrders || 0}</p>
              <div className="mt-4 bg-yellow-50 rounded-xl p-4">
                <p className="font-semibold text-yellow-700">Pending Orders</p>
                <p className="text-yellow-600 text-sm mt-1">You have {stats?.pendingOrders || 0} order(s) pending. Check the Orders section to process them.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
