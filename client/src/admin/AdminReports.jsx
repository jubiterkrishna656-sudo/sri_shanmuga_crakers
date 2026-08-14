import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiDocumentReport, HiTrendingUp, HiCube, HiShoppingBag, HiCheck, HiX, HiClock, HiTruck, HiArchive } from 'react-icons/hi';
import { adminApi } from '../utils/adminApi';

const statusMeta = {
  pending: { icon: HiClock, color: 'from-amber-400 to-orange-500' },
  payment_verification: { icon: HiDocumentReport, color: 'from-amber-400 to-yellow-500' },
  confirmed: { icon: HiCheck, color: 'from-violet-400 to-purple-500' },
  packed: { icon: HiArchive, color: 'from-cyan-400 to-teal-500' },
  shipped: { icon: HiTruck, color: 'from-blue-400 to-indigo-500' },
  delivered: { icon: HiShoppingBag, color: 'from-emerald-400 to-green-500' },
  cancelled: { icon: HiX, color: 'from-red-400 to-rose-500' },
};

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getReports().then(res => { setData(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-slate-800 rounded-2xl animate-pulse border border-slate-700" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-24 bg-slate-800 rounded-2xl animate-pulse border border-slate-700" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-800 rounded-2xl animate-pulse border border-slate-700" />
          <div className="h-80 bg-slate-800 rounded-2xl animate-pulse border border-slate-700" />
        </div>
      </div>
    );
  }

  const totalOrders = Object.values(data?.orderStatusCount || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800 to-slate-750 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Reports</h1>
            <p className="text-slate-300 mt-1 text-sm">Sales overview and performance metrics</p>
          </div>
          <HiDocumentReport className="text-5xl text-slate-600" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {Object.entries(data?.orderStatusCount || {}).map(([status, count], i) => {
          const meta = statusMeta[status] || { icon: HiDocumentReport, color: 'from-slate-400 to-slate-500' };
          const Icon = meta.icon;
          const percent = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
          return (
            <motion.div key={status} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-slate-800 rounded-2xl p-4 border border-slate-700 hover:border-slate-600 transition-all hover:-translate-y-0.5 hover:shadow-xl">
              <div className={`bg-gradient-to-br ${meta.color} w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                <Icon className="text-white text-base" />
              </div>
              <p className="text-xl font-bold text-white">{count}</p>
              <p className="text-xs text-slate-400 mt-0.5 capitalize">{status.replace(/_/g, ' ')}</p>
              <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ delay: 0.3 + i * 0.04, duration: 0.6 }}
                  className={`h-full bg-gradient-to-r ${meta.color} rounded-full`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-5 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500" />
            Revenue (30 Days)
          </h3>
          {data?.revenueChart?.length > 0 ? (
            <div className="relative h-56">
              <div className="absolute inset-0 flex items-end justify-between gap-1.5 px-2">
                {data.revenueChart.map((day, i) => {
                  const maxRevenue = Math.max(...data.revenueChart.map(d => d.revenue), 1);
                  const height = (day.revenue / maxRevenue) * 100;
                  return (
                    <motion.div key={day.date} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ delay: i * 0.02, duration: 0.4 }}
                      className="flex-1 bg-gradient-to-t from-emerald-400 to-teal-400 rounded-t-lg hover:opacity-80 transition-opacity relative group cursor-default min-w-[6px]">
                      <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none shadow-lg z-10">
                        ₹{day.revenue.toLocaleString()}<br />
                        <span className="text-slate-400">{new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">No revenue data yet</div>
          )}
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-white font-bold mb-5 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-400 to-indigo-500" />
            Top Products
          </h3>
          {data?.topProducts?.length > 0 ? (
            <div className="space-y-4">
              {data.topProducts.map((product, i) => {
                const maxQty = Math.max(...data.topProducts.map(p => p.quantity), 1);
                const barWidth = (product.quantity / maxQty) * 100;
                return (
                  <motion.div key={product.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full ${i < 3 ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white' : 'bg-slate-700 text-slate-400'} text-[10px] font-bold flex items-center justify-center shrink-0`}>{i + 1}</span>
                        <p className="text-sm font-medium text-white truncate">{product.name}</p>
                      </div>
                      <p className="text-sm font-bold text-white shrink-0 ml-2">{product.quantity}</p>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${barWidth}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                        className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : i === 1 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : i === 2 ? 'bg-gradient-to-r from-sky-400 to-cyan-500' : 'bg-gradient-to-r from-slate-500 to-slate-400'}`} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">₹{product.revenue.toLocaleString()}</p>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <HiCube className="text-4xl text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No sales data yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-750 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Summary</p>
            <p className="text-xl font-bold text-white mt-1">{totalOrders} Total • {Object.entries(data?.orderStatusCount || {}).filter(([k]) => !['delivered', 'cancelled'].includes(k)).reduce((a, [, c]) => a + c, 0)} Active</p>
          </div>
          {data?.topProducts?.[0] && (
            <div className="text-right">
              <HiTrendingUp className="text-xl text-emerald-400 ml-auto" />
              <p className="text-sm font-bold text-white mt-0.5">{data.topProducts[0].name}</p>
              <p className="text-xs text-slate-400">Top Product</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}