import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiEye, HiCheck, HiX, HiShoppingBag, HiDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { adminApi } from '../utils/adminApi';

const statuses = ['pending', 'payment_verification', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const nextStatuses = {
  pending: ['payment_verification', 'confirmed', 'cancelled'],
  payment_verification: ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const sl = (s) => s === 'payment_verification' ? 'Payment Pending' : s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const statusColors = {
  delivered: { bg: 'from-emerald-500 to-green-600', light: 'bg-emerald-500/15 border-emerald-500/30', border: 'border-l-emerald-500', icon: '✅', text: 'text-emerald-300' },
  cancelled: { bg: 'from-red-500 to-rose-600', light: 'bg-red-500/15 border-red-500/30', border: 'border-l-red-500', icon: '❌', text: 'text-red-300' },
  shipped: { bg: 'from-blue-500 to-indigo-600', light: 'bg-blue-500/15 border-blue-500/30', border: 'border-l-blue-500', icon: '🚚', text: 'text-blue-300' },
  confirmed: { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-500/15 border-violet-500/30', border: 'border-l-violet-500', icon: '✅', text: 'text-violet-300' },
  packed: { bg: 'from-cyan-500 to-teal-600', light: 'bg-cyan-500/15 border-cyan-500/30', border: 'border-l-cyan-500', icon: '📦', text: 'text-cyan-300' },
  payment_verification: { bg: 'from-amber-500 to-orange-600', light: 'bg-amber-500/15 border-amber-500/30', border: 'border-l-amber-500', icon: '⏳', text: 'text-amber-300' },
  pending: { bg: 'from-slate-500 to-gray-600', light: 'bg-slate-500/15 border-slate-500/30', border: 'border-l-slate-500', icon: '🕐', text: 'text-slate-300' },
};

const exportCSV = (orders) => {
  const headers = ['Order ID', 'Customer', 'Email', 'Items', 'Total', 'Status', 'Date', 'Address'];
  const rows = orders.map(o => [
    o._id,
    o.customerName || o.userId?.name || 'User',
    o.userId?.email || o.customerPhone || '',
    o.products.map(p => `${p.name}(${p.quantity})`).join('; '),
    o.totalAmount,
    sl(o.orderStatus),
    new Date(o.createdAt).toLocaleDateString('en-IN'),
    (o.address || '').replace(/,/g, ';'),
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Orders exported!');
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const prevCount = useRef(0);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => { if (!document.hidden) fetchOrders(); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = () => {
    adminApi.getAllOrders().then(res => {
      const data = res.data;
      if (prevCount.current > 0 && data.length > prevCount.current) {
        toast.success(`${data.length - prevCount.current} new order(s)!`, { duration: 4000 });
      }
      prevCount.current = data.length;
      setOrders(data);
      setLoading(false);
    });
  };

  const updateStatus = async (id, data) => {
    try {
      await adminApi.updateOrderStatus(id, data);
      toast.success('Status updated!');
      fetchOrders();
      setSelected(null);
    } catch { toast.error('Failed to update'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center"><HiShoppingBag className="text-white text-sm" /></span>
          Orders
        </h1>
        <div className="flex items-center gap-2">
          {orders.length > 0 && (
            <button onClick={() => exportCSV(filtered)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all">
              <HiDownload className="text-sm" /> Export CSV
            </button>
          )}
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full font-medium border border-slate-700">{orders.length} total</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', ...statuses].map(s => {
          const isActive = filter === s;
          const sc = s === 'all' ? { bg: 'from-violet-500 to-purple-600' } : statusColors[s];
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? `bg-gradient-to-r ${sc.bg} text-white shadow-lg`
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
              }`}>
              {s === 'all' ? '📋 All' : `${statusColors[s].icon} ${sl(s)}`} {s !== 'all' && `(${orders.filter(o => o.orderStatus === s).length})`}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700/50 shadow-2xl shadow-violet-500/5" onClick={e => e.stopPropagation()}>
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500" />
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 px-6 pt-5 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
                    <HiEye className="text-white text-lg" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-black text-white">Order Details</h2>
                    <p className="text-xs text-amber-400 font-mono font-black uppercase tracking-wider">#{selected._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => {
                    const o = selected;
                    const lines = [
                      `Order ID,#${o._id}`,
                      `Customer,${o.customerName || o.userId?.name || 'User'}`,
                      `Email,${o.userId?.email || ''}`,
                      `Status,${sl(o.orderStatus)}`,
                      `Date,${new Date(o.createdAt).toLocaleString('en-IN')}`,
                      `Address,${(o.address || '').replace(/,/g, ';')}`,
                      `Transaction ID,${o.transactionId || 'N/A'}`,
                      ``,
                      `Item Name,Quantity,Price,Total`,
                    ];
                    o.products.forEach(p => lines.push(`${p.name},${p.quantity},₹${p.price},₹${p.price * p.quantity}`));
                    lines.push(``);
                    lines.push(`Total Amount,₹${o.totalAmount}`);
                    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url; a.download = `order_${o._id.slice(-8)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success('Order exported!');
                  }} className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 transition-all flex items-center gap-1.5">
                    <HiDownload className="text-xs" /> Export
                  </button>
                  <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition-all">
                    <HiX className="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Status banner */}
              <div className={`rounded-2xl p-4 bg-gradient-to-r ${statusColors[selected.orderStatus].bg} shadow-xl flex items-center justify-between gap-3`}>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/70">Order Status</p>
                  <p className="text-xl font-black text-white mt-0.5">{statusColors[selected.orderStatus].icon} {sl(selected.orderStatus)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/70">Placed On</p>
                  <p className="text-sm font-black text-white mt-0.5">{new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              {/* Customer + Order info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-2xl p-4 border border-violet-500/20">
                  <p className="text-[10px] font-black text-violet-400 uppercase tracking-wider mb-2">👤 Customer</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center text-white font-black text-base shrink-0 shadow-lg shadow-violet-500/30">
                      {(selected.customerName || selected.userId?.name)?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-white text-sm truncate">{selected.customerName || selected.userId?.name || 'User'}</p>
                      <p className="text-xs text-violet-300 break-all">{selected.userId?.email}</p>
                      <p className="text-xs text-violet-300/80 truncate">{selected.customerPhone || selected.userId?.phone || ''}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 rounded-2xl p-4 border border-sky-500/20">
                  <p className="text-[10px] font-black text-sky-400 uppercase tracking-wider mb-2">📦 Order</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-amber-700/15 rounded-lg py-1.5 px-2.5 border border-amber-700/30 inline-block">
                      <span className="text-xs font-black text-amber-600 font-mono">#{selected._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400/80">Items</p>
                      <p className="font-black text-sky-300 text-sm">{selected.products.reduce((s, p) => s + p.quantity, 0)} units</p>
                    </div>
                  </div>
                  <p className="text-xs text-sky-300/80 mt-2">{selected.products.length} product{selected.products.length > 1 ? 's' : ''} in this order</p>
                </div>
              </div>

              {selected.address && (
                <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-2xl p-4 border border-cyan-500/20">
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-wider mb-2">📍 Delivery Address</p>
                  <p className="text-sm text-white leading-relaxed font-medium">{selected.address}</p>
                </div>
              )}

              {/* Items */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                  <p className="text-xs font-black text-violet-400 uppercase tracking-wider">🛍️ Items ({selected.products.length})</p>
                  <span className="text-xs font-bold text-slate-400">{selected.products.reduce((s, p) => s + p.quantity, 0)} packs total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/60">
                        <th className="px-4 py-2.5 font-black">#</th>
                        <th className="px-2 py-2.5 font-black">Item</th>
                        <th className="px-2 py-2.5 font-black text-center">Pack</th>
                        <th className="px-2 py-2.5 font-black text-center">Price</th>
                        <th className="px-4 py-2.5 font-black text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.products.map((p, i) => (
                        <tr key={i} className="border-t border-slate-700/60 hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className={`w-6 h-6 rounded-lg inline-flex items-center justify-center text-xs font-black text-white bg-gradient-to-br ${
                              ['from-violet-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-sky-500 to-blue-600', 'from-pink-500 to-rose-600', 'from-amber-500 to-orange-600'][i % 5]
                            }`}>{i + 1}</span>
                          </td>
                          <td className="px-2 py-3 font-bold text-white">{p.name}</td>
                          <td className="px-2 py-3 text-center font-black text-cyan-300">{p.quantity} box{p.quantity > 1 ? 'es' : ''}</td>
                          <td className="px-2 py-3 text-center font-bold text-slate-300">₹{p.price}</td>
                          <td className="px-4 py-3 text-right font-black text-amber-300">₹{p.price * p.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gradient-to-r from-violet-500/15 via-purple-500/15 to-fuchsia-500/15 px-4 py-3.5 flex items-center justify-between border-t border-slate-700">
                  <span className="font-black text-white">Total</span>
                  <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300">₹{selected.totalAmount}</span>
                </div>
              </div>

              {selected.transactionId && (
                <div className="bg-gradient-to-br from-emerald-500/15 to-green-500/15 rounded-2xl p-4 border border-emerald-500/25">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                      <span className="text-white text-sm">💳</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Payment Ref</p>
                      <p className="font-bold text-emerald-300 text-sm break-all">{selected.transactionId}</p>
                    </div>
                  </div>
                </div>
              )}

              {selected.history?.length > 0 && (
                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                  <p className="text-xs font-black text-violet-400 uppercase tracking-wider mb-3">🕘 Status History</p>
                  <div className="space-y-2.5">
                    {[...selected.history].reverse().map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm shrink-0 bg-gradient-to-br ${
                          h.action === 'Order placed' ? 'from-emerald-500 to-green-600'
                            : h.action === 'Order cancelled' ? 'from-red-500 to-rose-600'
                            : 'from-sky-500 to-blue-600'
                        }`}>
                          {h.action === 'Order placed' ? '🛒' : h.action === 'Order cancelled' ? '❌' : '⚙️'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white">
                            {h.action}
                            {h.detail && <span className="text-slate-400 font-medium"> — {h.detail}</span>}
                          </p>
                          <p className="text-xs text-slate-400">
                            <span className={h.action === 'Order cancelled' ? 'text-red-300 font-semibold' : 'text-violet-300 font-semibold'}>{h.byName || 'Customer'}</span>
                            <span> · {new Date(h.at).toLocaleString('en-IN')}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Update Status */}
              <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                <p className="text-xs font-black text-violet-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                  Update Status
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(nextStatuses[selected.orderStatus] || []).map(s => {
                    const sc = statusColors[s];
                    return (
                    <button key={s} onClick={() => updateStatus(selected._id, { orderStatus: s })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selected.orderStatus === s
                          ? `bg-gradient-to-r ${sc.bg} text-white shadow-md`
                          : 'bg-slate-700 text-slate-400 hover:text-white border border-slate-600'
                      }`}>
                      {sc.icon} {sl(s)}
                    </button>
                    );
                  })}
                  {selected.orderStatus === 'delivered' && (
                    <span className="text-xs text-slate-500 font-semibold self-center">Order completed — no further updates</span>
                  )}
                  {selected.orderStatus === 'cancelled' && (
                    <span className="text-xs text-slate-500 font-semibold self-center">Order cancelled</span>
                  )}
                </div>
              </div>

              {selected.orderStatus === 'payment_verification' && (
                <div className="flex gap-3">
                  <button onClick={() => updateStatus(selected._id, { paymentStatus: 'verified', orderStatus: 'confirmed' })}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                    <HiCheck /> Verify Payment
                  </button>
                  <button onClick={() => updateStatus(selected._id, { paymentStatus: 'rejected', orderStatus: 'cancelled' })}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                    <HiX /> Reject
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-slate-800 rounded-2xl h-24 animate-pulse border border-slate-700 border-l-4 border-l-slate-600" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl p-12 text-center border border-slate-700">
          <HiShoppingBag className="text-5xl text-slate-700 mx-auto mb-4" />
          <p className="text-white font-semibold text-lg">No orders found</p>
          <p className="text-slate-400 text-sm mt-1">New orders will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, idx) => {
            const sc = statusColors[order.orderStatus] || statusColors.pending;
            const dDiff = (Date.now() - new Date(order.createdAt).getTime()) / 86400000;
            const dateColor = dDiff < 1 ? 'text-emerald-300' : dDiff < 3 ? 'text-amber-300' : 'text-sky-300';
            return (
            <motion.div key={order._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              onClick={() => setSelected(order)}
              className={`bg-slate-800 rounded-2xl px-4 md:px-5 py-3.5 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-xl border-l-4 ${sc.border} relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent rounded-bl-full" />
              <div className="grid grid-cols-12 gap-2 items-center relative">
                {/* Order ID */}
                <div className="col-span-2">
                  <div className="bg-amber-700/15 rounded-lg py-1.5 px-2 border border-amber-700/30 inline-block">
                    <span className="text-sm font-black text-amber-700 font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>

                {/* Customer */}
                <div className="col-span-2">
                  <p className="font-black text-white text-sm truncate">{order.customerName || order.userId?.name || 'User'}</p>
                  {order.orderStatus === 'cancelled' && (
                    <p className="text-[10px] text-red-400 font-semibold truncate">
                      ❌ by {[...(order.history || [])].reverse().find(h => h.action === 'Order cancelled')?.byName || 'Admin'}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2 text-center">
                  <div className={`inline-block rounded-xl py-1.5 px-3 border ${sc.light}`}>
                    <span className={`text-xs font-black ${sc.text}`}>{sc.icon} {sl(order.orderStatus)}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="col-span-2 text-center">
                  <span className="font-black text-yellow-300 text-sm">{order.products.length} item{order.products.length > 1 ? 's' : ''}</span>
                </div>

                {/* Date */}
                <div className="col-span-2 text-center">
                  <p className={`font-black text-sm ${dateColor}`}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                </div>

                {/* Total + Action */}
                <div className="col-span-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-black text-purple-300 text-base tracking-tight flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white text-[10px] font-black shadow-md shadow-purple-500/30">₹</span>
                      {order.totalAmount}
                    </span>
                    <button className="p-1.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-lg text-xs shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:scale-110 transition-all">
                      <HiEye className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
          })}
        </div>
      )}
    </div>
  );
}