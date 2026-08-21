import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiEye, HiCheck, HiX, HiShoppingBag, HiDownload, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { adminApi } from '../utils/adminApi';

const fmtOrderNum = (order) => order.orderNumber || `SC${String(parseInt(order._id.slice(-6), 16) % 999 + 1).padStart(3, '0')}`;

const statuses = ['pending', 'payment_verification', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

const getThanksUrl = (order) => {
  if (!order.customerPhone) return null;
  const phone = `91${order.customerPhone}`;
  const orderNum = fmtOrderNum(order);
  const msg = encodeURIComponent(
    `🎆 Thank you for choosing *Shanmuga Crackers*!\n\nHi ${order.customerName || 'there'},\n\nYour order *${orderNum}* has been received successfully.\nTotal: *₹${order.totalAmount.toLocaleString('en-IN')}*\n\nWe will update you once your order is confirmed.\n\n— Sri Shanmuga Grand Crackers`
  );
  return `https://wa.me/${phone}?text=${msg}`;
};

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
  const headers = ['Order Number', 'Customer', 'Phone', 'Items', 'Total', 'Status', 'Date', 'Address'];
  const rows = orders.map(o => [
    o.orderNumber || o._id,
    o.customerName || o.userId?.name || 'User',
    o.customerPhone || o.userId?.phone || '',
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
  const [selectedIds, setSelectedIds] = useState([]);
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
    }).catch(() => { setLoading(false); });
  };

  const updateStatus = async (id, data) => {
    try {
      await adminApi.updateOrderStatus(id, data);
      toast.success('Status updated!');
      fetchOrders();
      setSelected(null);
    } catch { toast.error('Failed to update'); }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Delete this order? This cannot be undone.')) return;
    try {
      await adminApi.deleteOrder(id);
      toast.success('Order deleted!');
      fetchOrders();
      setSelected(null);
    } catch { toast.error('Failed to delete'); }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    const filteredIds = filtered.map(o => o._id);
    if (selectedIds.length === filteredIds.length && filteredIds.every(id => selectedIds.includes(id))) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredIds);
    }
  };

  const bulkDelete = async () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} order(s)? This cannot be undone.`)) return;
    try {
      await Promise.all(selectedIds.map(id => adminApi.deleteOrder(id)));
      toast.success(`${selectedIds.length} order(s) deleted!`);
      setSelectedIds([]);
      fetchOrders();
    } catch { toast.error('Failed to delete some orders'); }
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
            <span className="w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center"><HiShoppingBag className="text-white text-sm" /></span>
            Orders
          </h1>
          {selectedIds.length > 0 && (
            <motion.button initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={bulkDelete}
              className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all">
              <HiTrash className="text-sm" /> Delete {selectedIds.length} selected
            </motion.button>
          )}
        </div>
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

      <div className="flex flex-wrap items-center gap-2">
        {filtered.length > 0 && (
          <button onClick={toggleSelectAll}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              selectedIds.length > 0 && selectedIds.length === filtered.length
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-lg shadow-amber-500/30'
                : selectedIds.length > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border-slate-700'
            }`}>
            <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] ${selectedIds.length > 0 && selectedIds.length === filtered.length ? 'bg-white border-white text-amber-600' : 'border-slate-500'}`}>
              {selectedIds.length > 0 && selectedIds.length === filtered.length ? '✓' : selectedIds.length > 0 ? '—' : ''}
            </span>
            Select All
          </button>
        )}
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
            {/* Rainbow top bar */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500" />

            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10 px-6 pt-5 pb-4 border-b border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 shrink-0">
                    <HiEye className="text-white text-lg" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-black text-white">Order Details</h2>
                    <p className="text-xs text-amber-400 font-mono font-black uppercase tracking-wider">{fmtOrderNum(selected)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => deleteOrder(selected._id)}
                    className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-105 transition-all flex items-center gap-1.5">
                    <HiTrash className="text-xs" /> Delete
                  </button>
                  <button onClick={() => {
                    const o = selected;
                    const lines = [
                      `Order Number,${fmtOrderNum(o)}`,
                      `Customer,${o.customerName || o.userId?.name || 'User'}`,
                      `Phone,${o.customerPhone || o.userId?.phone || ''}`,
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
                    a.href = url; a.download = `${fmtOrderNum(o)}.csv`;
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
              {/* Status Hero Banner */}
              <div className={`relative rounded-2xl p-5 bg-gradient-to-r ${statusColors[selected.orderStatus].bg} shadow-xl overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full blur-2xl" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full blur-xl" />
                </div>
                <div className="relative flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-wider text-white/70">Current Status</p>
                    </div>
                    <p className="text-2xl font-black text-white mt-0.5">{statusColors[selected.orderStatus].icon} {sl(selected.orderStatus)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-white/70">Placed On</p>
                    <p className="text-sm font-black text-white mt-0.5">{new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-[10px] text-white/50 font-medium">{new Date(selected.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>

              {/* Customer + Order Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Customer Card */}
                <div className="bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 rounded-2xl p-4 border border-violet-500/20 hover:border-violet-500/40 transition-all group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-wider">👤 Customer</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-violet-500/30 group-hover:scale-110 transition-transform">
                      {(selected.customerName || selected.userId?.name)?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-white text-sm truncate">{selected.customerName || selected.userId?.name || 'User'}</p>
                      <a href={`tel:${selected.customerPhone || selected.userId?.phone}`} className="text-xs text-violet-300 break-all hover:text-violet-200 transition-colors">{selected.customerPhone || selected.userId?.phone || ''}</a>
                    </div>
                  </div>
                </div>

                {/* Order Info Card */}
                <div className="bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-indigo-500/10 rounded-2xl p-4 border border-sky-500/20 hover:border-sky-500/40 transition-all group">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider">📦 Order Info</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-sky-500/30 to-transparent" />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-amber-500/15 rounded-xl py-2 px-3 border border-amber-500/30 group-hover:border-amber-500/50 transition-all">
                      <span className="text-sm font-black text-amber-400 font-mono">{fmtOrderNum(selected)}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400/80">Units</p>
                      <p className="font-black text-sky-300 text-lg leading-none">{selected.products.reduce((s, p) => s + p.quantity, 0)}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{selected.products.length} product{selected.products.length > 1 ? 's' : ''}</span>
                    <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{selected.products.reduce((s, p) => s + p.quantity, 0)} packs</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              {selected.address && (
                <div className="bg-gradient-to-r from-cyan-500/10 via-teal-500/10 to-emerald-500/10 rounded-2xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">📍 Delivery Address</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
                  </div>
                  <p className="text-sm text-white leading-relaxed font-medium">{selected.address}</p>
                </div>
              )}

              {/* Items Table */}
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
                        <th className="px-2 py-2.5 font-black text-center">Qty</th>
                        <th className="px-2 py-2.5 font-black text-center">Price</th>
                        <th className="px-4 py-2.5 font-black text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.products.map((p, i) => {
                        const colors = ['from-violet-500 to-purple-600', 'from-emerald-500 to-teal-600', 'from-sky-500 to-blue-600', 'from-pink-500 to-rose-600', 'from-amber-500 to-orange-600'];
                        return (
                        <tr key={i} className="border-t border-slate-700/60 hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className={`w-7 h-7 rounded-xl inline-flex items-center justify-center text-xs font-black text-white bg-gradient-to-br ${colors[i % 5]} shadow-md shadow-${colors[i % 5].split(' ')[0].replace('from-', '')}/20`}>{i + 1}</span>
                          </td>
                          <td className="px-2 py-3 font-bold text-white">{p.name}</td>
                          <td className="px-2 py-3 text-center">
                            <span className="bg-cyan-500/15 text-cyan-300 text-xs font-black px-2.5 py-1 rounded-lg border border-cyan-500/20">{p.quantity}×{p.quantity > 1 ? 'box' : 'box'}</span>
                          </td>
                          <td className="px-2 py-3 text-center font-bold text-slate-300">₹{p.price}</td>
                          <td className="px-4 py-3 text-right font-black text-amber-300">₹{p.price * p.quantity}</td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gradient-to-r from-violet-500/15 via-purple-500/15 to-fuchsia-500/15 px-4 py-4 flex items-center justify-between border-t border-slate-700">
                  <span className="font-black text-white">Total</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Amount</span>
                    <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-purple-300 to-fuchsia-300">₹{selected.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Payment */}
              {selected.transactionId && (
                <div className="bg-gradient-to-br from-emerald-500/15 via-green-500/15 to-teal-500/15 rounded-2xl p-4 border border-emerald-500/25 hover:border-emerald-500/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                      <span className="text-white text-base">💳</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Payment Reference</p>
                      <p className="font-bold text-emerald-300 text-sm break-all">{selected.transactionId}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status History */}
              {selected.history?.length > 0 && (
                <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                  <p className="text-xs font-black text-violet-400 uppercase tracking-wider mb-3">🕘 Status History</p>
                  <div className="relative">
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-violet-500/40 via-sky-500/40 to-slate-700/40" />
                    <div className="space-y-3">
                      {[...selected.history].reverse().map((h, i) => (
                        <div key={i} className="flex items-start gap-3 relative">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm shrink-0 bg-gradient-to-br z-10 ${
                            h.action === 'Order placed' ? 'from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30'
                              : h.action === 'Order cancelled' ? 'from-red-500 to-rose-600 shadow-lg shadow-red-500/30'
                              : 'from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30'
                          }`}>
                            {h.action === 'Order placed' ? '🛒' : h.action === 'Order cancelled' ? '❌' : '⚙️'}
                          </div>
                          <div className="min-w-0 bg-slate-700/30 rounded-xl px-3 py-2 flex-1 border border-slate-700/50">
                            <p className="text-sm font-bold text-white">
                              {h.action}
                              {h.detail && <span className="text-slate-400 font-medium"> — {h.detail}</span>}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              <span className={h.action === 'Order cancelled' ? 'text-red-300 font-semibold' : 'text-violet-300 font-semibold'}>{h.byName || 'Customer'}</span>
                              <span> · {new Date(h.at).toLocaleString('en-IN')}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Update Status */}
              <div className="bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-purple-500/10 rounded-2xl p-4 border border-indigo-500/20">
                <p className="text-xs font-black text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                  Update Status
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(nextStatuses[selected.orderStatus] || []).map(s => {
                    const sc = statusColors[s];
                    return (
                    <button key={s} onClick={() => updateStatus(selected._id, { orderStatus: s })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selected.orderStatus === s
                          ? `bg-gradient-to-r ${sc.bg} text-white shadow-lg`
                          : 'bg-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-600 border border-slate-600 hover:border-slate-500'
                      }`}>
                      {sc.icon} {sl(s)}
                    </button>
                    );
                  })}
                  {selected.orderStatus === 'delivered' && (
                    <span className="text-xs text-emerald-400 font-semibold self-center bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">✓ Order completed</span>
                  )}
                  {selected.orderStatus === 'cancelled' && (
                    <span className="text-xs text-red-400 font-semibold self-center bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">✗ Order cancelled</span>
                  )}
                </div>
              </div>

              {/* Payment Verification */}
              {selected.orderStatus === 'payment_verification' && (
                <div className="flex gap-3">
                  <button onClick={() => updateStatus(selected._id, { paymentStatus: 'verified', orderStatus: 'confirmed' })}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-emerald-500/50 transition-all">
                    <HiCheck className="text-lg" /> Verify Payment
                  </button>
                  <button onClick={() => updateStatus(selected._id, { paymentStatus: 'rejected', orderStatus: 'cancelled' })}
                    className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-red-500/50 transition-all">
                    <HiX className="text-lg" /> Reject
                  </button>
                </div>
              )}

              {/* WhatsApp Actions */}
              {selected.customerPhone && (
                <div className="flex gap-2 flex-wrap">
                  {selected.adminWhatsAppUrl && (
                    <a href={selected.adminWhatsAppUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 min-w-[140px] bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-green-500/40 transition-all">
                      📲 Notify Admin
                    </a>
                  )}
                  {getThanksUrl(selected) && (
                    <a href={getThanksUrl(selected)} target="_blank" rel="noopener noreferrer"
                      className="flex-1 min-w-[140px] bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-emerald-500/40 transition-all">
                      💬 Send Thanks
                    </a>
                  )}
                  <a href={`https://wa.me/91${selected.customerPhone}`} target="_blank" rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] hover:shadow-green-600/40 transition-all">
                    💬 Chat
                  </a>
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
            const isChecked = selectedIds.includes(order._id);
            return (
            <motion.div key={order._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              onClick={() => setSelected(order)}
              className={`bg-slate-800 rounded-2xl px-4 md:px-5 py-3.5 border transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-xl border-l-4 relative overflow-hidden ${isChecked ? 'border-slate-600 ring-1 ring-amber-500/40 bg-amber-500/5' : `border-slate-700 hover:border-slate-600 ${sc.border}`}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/[0.02] to-transparent rounded-bl-full" />
              <div className="grid grid-cols-12 gap-2 items-center relative">
                {/* Checkbox */}
                <div className="col-span-1 flex items-center justify-center">
                  <button onClick={(e) => { e.stopPropagation(); toggleSelect(order._id); }}
                    className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-400 shadow-md shadow-amber-500/30' : 'border-slate-600 hover:border-slate-500 bg-slate-900/50'}`}>
                    {isChecked && <span className="text-white text-[10px] font-black">✓</span>}
                  </button>
                </div>

                {/* Order ID */}
                <div className="col-span-2">
                  <div className="bg-amber-700/15 rounded-lg py-1.5 px-2 border border-amber-700/30 inline-block">
                    <span className="text-sm font-black text-amber-700 font-mono">{fmtOrderNum(order)}</span>
                  </div>
                </div>

                {/* Customer */}
                <div className="col-span-3">
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
                <div className="col-span-1 text-center">
                  <span className="font-black text-yellow-300 text-sm">{order.products.length}</span>
                </div>

                {/* Date */}
                <div className="col-span-1 text-center">
                  <p className={`font-black text-xs ${dateColor}`}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
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
                    <button onClick={(e) => { e.stopPropagation(); deleteOrder(order._id); }}
                      className="p-1.5 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-lg text-xs shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:scale-110 transition-all">
                      <HiTrash className="text-sm" />
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