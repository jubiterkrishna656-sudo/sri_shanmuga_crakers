import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCube, HiShoppingBag, HiCurrencyRupee, HiClock, HiTrendingUp, HiArrowRight } from 'react-icons/hi';
import { adminApi } from '../utils/adminApi';

const statsConfig = [
  { key: 'totalRevenue', label: 'Total Revenue', icon: HiCurrencyRupee, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20', to: '/admin/orders' },
  { key: 'totalOrders', label: 'Total Orders', icon: HiShoppingBag, color: 'from-violet-400 to-purple-500', shadow: 'shadow-purple-500/20', to: '/admin/orders' },
  { key: 'totalProducts', label: 'Products', icon: HiCube, color: 'from-sky-400 to-blue-500', shadow: 'shadow-blue-500/20', to: '/admin/products' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: HiClock, color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/20', to: '/admin/orders' },
];

const actions = [
  { label: 'Products', to: '/admin/products', icon: HiCube, color: 'from-emerald-400 to-teal-500', desc: 'Add or manage products' },
  { label: 'Orders', to: '/admin/orders', icon: HiShoppingBag, color: 'from-violet-400 to-purple-500', desc: 'Process orders' },
  { label: 'Reports', to: '/admin/reports', icon: HiTrendingUp, color: 'from-cyan-400 to-teal-500', desc: 'View performance' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = () => {
      if (document.hidden) return;
      adminApi.getDashboard().then(res => {
        setStats(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    };
    fetch();
    const interval = setInterval(fetch, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-750 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Welcome back! 👋</h1>
            <p className="text-slate-300 mt-1 text-sm">Here is your store overview.</p>
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <HiTrendingUp className="text-2xl text-white" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <div key={i} className="bg-slate-800 rounded-2xl p-6 animate-pulse h-28" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {statsConfig.map((cfg, i) => (
              <motion.div
                key={cfg.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(cfg.to)}
                className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{cfg.label}</span>
                  <div className={`bg-gradient-to-br ${cfg.color} p-2.5 rounded-xl shadow-lg ${cfg.shadow}`}>
                    <cfg.icon className="text-white text-lg" />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${cfg.key === 'pendingOrders' && (stats?.[cfg.key] || 0) > 0 ? 'text-amber-400' : 'text-white'}`}>
                  {cfg.key === 'totalRevenue' ? `₹${stats?.[cfg.key]?.toLocaleString() || 0}` : stats?.[cfg.key] || 0}
                </p>
                <div className="mt-3 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cfg.key === 'pendingOrders' ? ((stats?.[cfg.key] || 0) / Math.max(stats?.totalOrders || 1, 1)) * 100 : 100}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    className={`h-full bg-gradient-to-r ${cfg.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-5 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {actions.map((a, i) => (
                  <motion.a
                    key={a.label}
                    href={a.to}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="group bg-slate-700/50 hover:bg-slate-700 rounded-xl p-4 text-center transition-all border border-slate-600/50 hover:border-slate-500"
                  >
                    <div className={`bg-gradient-to-br ${a.color} w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-all`}>
                      <a.icon className="text-white text-lg" />
                    </div>
                    <p className="font-semibold text-white text-sm">{a.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.desc}</p>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-bold mb-5 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
                Order Status
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-400 rounded-full" />
                      <span className="font-semibold text-white">Pending Orders</span>
                    </div>
                    <span className="text-2xl font-bold text-amber-400">{stats?.pendingOrders || 0}</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Awaiting processing and verification</p>
                  <a href="/admin/orders" className="mt-2 inline-flex items-center text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                    View all <HiArrowRight className="ml-1" />
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Orders', value: stats?.totalOrders || 0, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
                    { label: 'Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                    { label: 'Users', value: stats?.totalUsers || 0, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                  ].map(item => (
                    <div key={item.label} className={`${item.bg} rounded-xl p-3 text-center border ${item.border}`}>
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}