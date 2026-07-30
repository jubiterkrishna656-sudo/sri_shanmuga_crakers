import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSparkles, HiClock, HiCheckCircle, HiTruck, HiCube, HiXCircle, HiEye } from 'react-icons/hi';
import { orderAPI } from '../utils/api';

const statusConfig = {
  pending: { label: 'Pending', icon: HiClock, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  payment_verification: { label: 'Payment Verification', icon: HiEye, color: 'text-blue-500', bg: 'bg-blue-100' },
  confirmed: { label: 'Confirmed', icon: HiCheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
  packed: { label: 'Packed', icon: HiCube, color: 'text-purple-500', bg: 'bg-purple-100' },
  shipped: { label: 'Shipped', icon: HiTruck, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  delivered: { label: 'Delivered', icon: HiCheckCircle, color: 'text-green-600', bg: 'bg-green-200' },
  cancelled: { label: 'Cancelled', icon: HiXCircle, color: 'text-red-500', bg: 'bg-red-100' }
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    orderAPI.getMyOrders().then(res => {
      setOrders(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16"><div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-32"></div>)}</div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-8">My <span className="text-orange-500">Orders</span></h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <HiSparkles className="text-6xl text-green-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-500">No orders yet</h3>
          <p className="text-green-400">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const StatusIcon = statusConfig[order.orderStatus]?.icon || HiClock;
            const statusInfo = statusConfig[order.orderStatus] || statusConfig.pending;

            return (
              <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <p className="text-sm text-green-500">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-green-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <span className={`${statusInfo.bg} ${statusInfo.color} px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1`}>
                      <StatusIcon /><span>{statusInfo.label}</span>
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.products.slice(0, expanded === order._id ? undefined : 2).map((p, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-green-100 last:border-0">
                      <div>
                        <p className="font-medium text-green-800">{p.name}</p>
                        <p className="text-sm text-green-500">Qty: {p.quantity} × ₹{p.price}</p>
                      </div>
                      <p className="font-semibold">₹{p.quantity * p.price}</p>
                    </div>
                  ))}
                  {order.products.length > 2 && (
                    <button onClick={() => setExpanded(expanded === order._id ? null : order._id)} className="text-orange-500 text-sm hover:text-orange-600">
                      {expanded === order._id ? 'Show less' : `Show all ${order.products.length} items`}
                    </button>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-green-200">
                  <div>
                    <p className="text-sm font-medium">Delivery to:</p>
                    <p className="text-sm text-green-500">{order.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-500">Total:</p>
                    <p className="text-xl font-bold text-orange-500">₹{order.totalAmount}</p>
                  </div>
                </div>
                {order.paymentStatus === 'rejected' && (
                  <div className="mt-3 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-medium">Payment rejected. Please contact support.</div>
                )}
                {order.paymentStatus === 'pending' && order.orderStatus !== 'cancelled' && (
                  <div className="mt-3 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl text-sm font-medium">Payment pending verification. We will update once confirmed.</div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
