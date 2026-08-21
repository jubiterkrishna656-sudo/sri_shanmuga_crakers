import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiSparkles, HiClock, HiCheckCircle, HiTruck, HiCube, HiXCircle, HiArrowRight, HiLocationMarker, HiCreditCard, HiPaperAirplane, HiDeviceMobile, HiSearch } from 'react-icons/hi';
import { orderAPI } from '../utils/api';

const fmtOrderNum = (order) => order.orderNumber || `SC${String(parseInt(order._id.slice(-6), 16) % 999 + 1).padStart(3, '0')}`;

const statusConfig = {
  pending: { label: 'Pending', icon: HiClock, color: 'text-amber-700', bg: 'bg-gradient-to-r from-amber-50 to-yellow-50', ring: 'ring-amber-200', dot: 'bg-amber-400', grad: 'from-amber-400 to-yellow-500', border: 'border-l-amber-400' },
  payment_verification: { label: 'Payment Verification', icon: HiCreditCard, color: 'text-blue-700', bg: 'bg-gradient-to-r from-blue-50 to-cyan-50', ring: 'ring-blue-200', dot: 'bg-blue-400', grad: 'from-blue-400 to-cyan-500', border: 'border-l-blue-400' },
  confirmed: { label: 'Confirmed', icon: HiCheckCircle, color: 'text-emerald-700', bg: 'bg-gradient-to-r from-emerald-50 to-green-50', ring: 'ring-emerald-200', dot: 'bg-emerald-400', grad: 'from-emerald-400 to-green-500', border: 'border-l-emerald-400' },
  packed: { label: 'Packed', icon: HiCube, color: 'text-purple-700', bg: 'bg-gradient-to-r from-purple-50 to-violet-50', ring: 'ring-purple-200', dot: 'bg-purple-400', grad: 'from-purple-400 to-violet-500', border: 'border-l-purple-400' },
  shipped: { label: 'Shipped', icon: HiPaperAirplane, color: 'text-indigo-700', bg: 'bg-gradient-to-r from-indigo-50 to-blue-50', ring: 'ring-indigo-200', dot: 'bg-indigo-400', grad: 'from-indigo-400 to-blue-500', border: 'border-l-indigo-400' },
  delivered: { label: 'Delivered', icon: HiCheckCircle, color: 'text-green-700', bg: 'bg-gradient-to-r from-green-50 to-emerald-50', ring: 'ring-green-300', dot: 'bg-green-500', grad: 'from-green-500 to-emerald-500', border: 'border-l-green-500' },
  cancelled: { label: 'Cancelled', icon: HiXCircle, color: 'text-red-700', bg: 'bg-gradient-to-r from-red-50 to-rose-50', ring: 'ring-red-200', dot: 'bg-red-400', grad: 'from-red-400 to-rose-500', border: 'border-l-red-400' }
};

const statusFlow = ['pending', 'payment_verification', 'confirmed', 'packed', 'shipped', 'delivered'];

const stepShort = { pending: 'Pend', payment_verification: 'Pay', confirmed: 'Conf', packed: 'Pack', shipped: 'Ship', delivered: 'Deliv' };

const getEstimatedDelivery = (order) => {
  if (order.orderStatus === 'delivered') return null;
  if (order.orderStatus === 'cancelled') return null;
  const base = new Date(order.createdAt).getTime();
  const days = order.orderStatus === 'shipped' ? 3 : order.orderStatus === 'packed' ? 4 : 6;
  return new Date(base + days * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
};

export default function MyOrders() {
  const [phone, setPhone] = useState(localStorage.getItem('guestPhone') || '');
  const [inputPhone, setInputPhone] = useState(phone);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [updatedId, setUpdatedId] = useState(null);
  const prevStatuses = useRef({});

  const fetchOrders = (ph, notify = false) => {
    if (!ph) return;
    setLoading(true);
    orderAPI.getByPhone(ph).then(res => {
      const fresh = res.data;
      const changed = [];
      fresh.forEach(o => {
        if (prevStatuses.current[o._id] && prevStatuses.current[o._id] !== o.orderStatus) {
          changed.push(o);
        }
      });
      if (notify && changed.length > 0) {
        changed.forEach(o => {
          const cfg = statusConfig[o.orderStatus];
          toast(`Order #${o._id.slice(-6).toUpperCase()} is now ${cfg.label.toLowerCase()}`, { icon: cfg.icon({}), duration: 4000 });
          setUpdatedId(o._id);
        });
      }
      fresh.forEach(o => { prevStatuses.current[o._id] = o.orderStatus; });
      setOrders(fresh);
      setSearched(true);
    }).catch(() => {
      toast.error('Could not fetch orders. Please try again.');
    }).finally(() => setLoading(false));
  };

  const handleTrack = (e) => {
    e.preventDefault();
    const ph = inputPhone.trim();
    if (!/^[0-9]{10}$/.test(ph)) return toast.error('Enter a valid 10-digit phone number');
    localStorage.setItem('guestPhone', ph);
    setPhone(ph);
  };

  useEffect(() => {
    if (phone) fetchOrders(phone);
  }, [phone]);

  useEffect(() => {
    if (!searched || !phone) return;
    const interval = setInterval(() => { if (!document.hidden) fetchOrders(phone, true); }, 30000);
    const onFocus = () => fetchOrders(phone, true);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [searched, phone]);

  if (!searched) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-5 rounded-[2rem] bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center shadow-lg shadow-orange-200/50">
            <HiDeviceMobile className="text-5xl text-orange-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            Track <span className="text-gradient">Orders</span>
          </h1>
          <p className="text-gray-500 mt-2">Enter your phone number to see live order updates.</p>
        </div>

        <form onSubmit={handleTrack} className="card p-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
          <div className="flex items-center gap-2 bg-white ring-1 ring-orange-200 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-orange-400 transition-shadow">
            <HiDeviceMobile className="text-orange-400 text-lg shrink-0" />
            <input
              type="tel"
              value={inputPhone}
              onChange={(e) => setInputPhone(e.target.value)}
              placeholder="e.g. 90000 00000"
              className="w-full py-3 bg-transparent outline-none font-semibold text-gray-800"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 mt-5 text-base disabled:opacity-50">
            <HiSearch /> {loading ? 'Searching...' : 'Track My Orders'}
          </button>
          <p className="mt-3 text-center text-xs text-gray-400">No login needed. Enter your phone number to look up orders.</p>
        </form>
      </div>
    );
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16"><div className="animate-pulse space-y-4">{[1, 2, 3].map(i => <div key={i} className="card h-36" />)}</div></div>;
  }

  const active = orders.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus)).length;
  const delivered = orders.filter(o => o.orderStatus === 'delivered').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900">
            My <span className="text-gradient">Orders</span>
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Auto-updates when the shop updates your order
          </p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-orange-100">
            <HiClock className="text-sm" /> {active} active
          </span>
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-bold ring-1 ring-green-100">
            <HiCheckCircle className="text-sm" /> {delivered} delivered
          </span>
        </div>
      </div>

      <button
        onClick={() => { setSearched(false); setOrders([]); }}
        className="text-orange-500 font-bold text-sm hover:text-orange-600 mb-4 flex items-center gap-1"
      >
        <HiArrowRight className="rotate-180" /> Track another number
      </button>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-5 rounded-[2rem] bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center shadow-lg shadow-orange-200/50">
            <HiSparkles className="text-5xl text-orange-400" />
          </div>
          <h3 className="text-xl font-black text-gray-800">No orders found</h3>
          <p className="text-gray-500 mt-1 mb-6">No orders found for this phone number. Double-check and try again!</p>
          <button onClick={() => setSearched(false)} className="btn-primary px-8 py-3">Try Another Number</button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order, oi) => {
            const StatusIcon = statusConfig[order.orderStatus]?.icon || HiClock;
            const statusInfo = statusConfig[order.orderStatus] || statusConfig.pending;
            const stepIndex = statusFlow.indexOf(order.orderStatus);
            const cancelled = order.orderStatus === 'cancelled';
            const isUpdated = updatedId === order._id;
            const estDelivery = getEstimatedDelivery(order);

            return (
              <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: oi * 0.05 }}
                className={`rounded-3xl bg-white ring-1 ring-black/5 shadow-xl shadow-orange-900/5 p-6 relative overflow-hidden border-l-4 ${statusInfo.border} ${isUpdated ? 'ring-2 ring-orange-300 shadow-orange-300/20' : ''}`}>
                {isUpdated && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 animate-pulse" />}

                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-3.5 py-1.5 rounded-xl text-sm font-black shadow-lg shadow-orange-400/30 tracking-wide">
                        Order #{fmtOrderNum(order, oi)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 ml-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <motion.span
                    key={`${order._id}-${order.orderStatus}`}
                    initial={{ scale: 0.7, opacity: 0.5 }}
                    animate={isUpdated ? { scale: [1, 1.07, 1], opacity: [1, 0.6, 1], boxShadow: ['0 0 0px rgba(251,146,60,0.4)', '0 0 16px rgba(251,146,60,0.8)', '0 0 0px rgba(251,146,60,0.4)'] } : { scale: 1, opacity: 1 }}
                    transition={isUpdated ? { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } : { type: 'spring', stiffness: 300, damping: 20 }}
                    className={`inline-flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.color} px-4 py-1.5 rounded-full text-sm font-bold ring-1 ${statusInfo.ring}`}
                  >
                    <StatusIcon /> {statusInfo.label}
                  </motion.span>
                </div>

                {/* Status Tracker */}
                {!cancelled && (
                  <div className="flex items-center mb-6">
                    {statusFlow.map((s, i) => {
                      const cfg = statusConfig[s];
                      const Icon = cfg.icon;
                      const done = i <= stepIndex;
                      const isCurrent = i === stepIndex;
                      return (
                        <div key={s} className="flex items-center flex-1 min-w-0 last:flex-none" title={cfg.label}>
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-500 ${done ? `bg-gradient-to-br ${cfg.grad} text-white shadow-lg shadow-${s === 'delivered' ? 'green' : 'orange'}-400/30` : 'bg-gray-100 text-gray-400'} ${isCurrent && isUpdated ? 'scale-125 animate-pulse ring-2 ring-white shadow-xl' : ''}`}>
                              <Icon className="text-xs md:text-sm" />
                            </div>
                            <span className={`md:hidden text-[7px] font-bold uppercase tracking-wide whitespace-nowrap ${done ? cfg.color : 'text-gray-400'}`}>{stepShort[s]}</span>
                            <span className={`hidden md:block text-[9px] font-bold uppercase tracking-wide whitespace-nowrap ${done ? cfg.color : 'text-gray-400'}`}>{cfg.label.split(' ')[0]}</span>
                          </div>
                          {i < statusFlow.length - 1 && (
                            <div className={`flex-1 h-1 mx-0.5 md:mx-1 mb-4 rounded-full ${done ? `bg-gradient-to-r ${cfg.grad}` : 'bg-gray-200'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Estimated Delivery */}
                {estDelivery && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 px-4 py-2.5 rounded-2xl text-sm font-semibold ring-1 ring-indigo-100 mb-4">
                    <HiTruck className="text-base" /> Estimated delivery by <b>{estDelivery}</b>
                  </div>
                )}

                {/* Products */}
                <div className="bg-orange-50/40 rounded-2xl p-3 mb-4">
                  <div className="space-y-2">
                    {order.products.slice(0, expanded === order._id ? undefined : 2).map((p, i) => (
                      <div key={i} className="flex justify-between items-center py-2 px-2 bg-white rounded-xl ring-1 ring-orange-100/80">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white shadow-md shadow-orange-300/30">
                            <HiSparkles className="text-sm" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                            <p className="text-xs text-gray-400">Qty: {p.quantity} × ₹{p.price}</p>
                          </div>
                        </div>
                        <p className="font-black text-sm text-gray-700">₹{p.quantity * p.price}</p>
                      </div>
                    ))}
                  </div>
                  {order.products.length > 2 && (
                    <button onClick={() => setExpanded(expanded === order._id ? null : order._id)} className="text-orange-500 text-sm font-bold hover:text-orange-600 mt-2">
                      {expanded === order._id ? 'Show less' : `Show all ${order.products.length} items`}
                    </button>
                  )}
                </div>

                {/* Address + Total */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  {order.address && (
                    <div className="flex items-start gap-2 text-sm bg-gradient-to-r from-orange-50 to-rose-50 px-4 py-3 rounded-2xl ring-1 ring-orange-100/80 flex-1">
                      <HiLocationMarker className="text-orange-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-600 text-[10px] uppercase tracking-wider">Delivery to</p>
                        <p className="text-gray-600 text-sm font-medium">{order.address}</p>
                      </div>
                    </div>
                  )}
                  <div className="text-right shrink-0 bg-gradient-to-br from-orange-50 to-pink-50 px-5 py-3 rounded-2xl ring-1 ring-orange-100/80">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Payment Rejected */}
                <AnimatePresence>
                  {order.paymentStatus === 'rejected' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mt-4 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold ring-1 ring-red-200 flex items-center gap-2">
                      <HiXCircle className="text-base" /> Payment rejected. Please contact support.
                    </motion.div>
                  )}
                  {order.paymentStatus === 'verified' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-3 rounded-2xl text-sm font-semibold ring-1 ring-green-200 flex items-center gap-2">
                      <HiCheckCircle className="text-base" /> Payment confirmed. Thank you for shopping with us!
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}