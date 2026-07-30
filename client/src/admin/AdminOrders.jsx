import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiEye, HiCheck, HiX, HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { orderAPI } from '../utils/api';

const statuses = ['pending', 'payment_verification', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    orderAPI.getAll().then(res => { setOrders(res.data); setLoading(false); });
  };

  const handleStatusUpdate = async (orderId, data) => {
    try {
      await orderAPI.updateStatus(orderId, data);
      toast.success('Order status updated!');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">Orders</h1>
      
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...statuses].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === s ? 'bg-orange-500 text-white' : 'bg-white text-green-600 hover:bg-orange-50'}`}>
            {s === 'all' ? 'All' : s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-green-800">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)}><HiX className="text-2xl text-green-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-green-500">Order #</p>
                <p className="font-semibold">{selectedOrder._id}</p>
              </div>
              <div>
                <p className="text-sm text-green-500">Customer</p>
                <p className="font-semibold">{selectedOrder.userId?.name} ({selectedOrder.userId?.email})</p>
                <p className="text-sm text-green-500">{selectedOrder.userId?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-green-500">Delivery Address</p>
                <p className="font-medium">{selectedOrder.address}</p>
              </div>
              <div>
                <p className="text-sm text-green-500">Items</p>
                {selectedOrder.products.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm"><span>{p.name} × {p.quantity}</span><span>₹{p.price * p.quantity}</span></div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-orange-500">₹{selectedOrder.totalAmount}</span>
              </div>
              {selectedOrder.paymentScreenshot && (
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-sm font-medium text-green-700">Payment Reference:</p>
                  <p className="text-sm text-green-600">{selectedOrder.paymentScreenshot}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                {statuses.map(s => (
                  <button key={s} onClick={() => handleStatusUpdate(selectedOrder._id, { orderStatus: s })} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${selectedOrder.orderStatus === s ? 'bg-orange-500 text-white' : 'bg-green-100 text-green-600 hover:bg-orange-50'}`}>
                    {s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => handleStatusUpdate(selectedOrder._id, { paymentStatus: 'verified', orderStatus: 'confirmed' })} className="flex-1 bg-green-500 text-white py-2 rounded-xl font-medium hover:bg-green-600 flex items-center justify-center space-x-1">
                  <HiCheck /> <span>Verify Payment</span>
                </button>
                <button onClick={() => handleStatusUpdate(selectedOrder._id, { paymentStatus: 'rejected', orderStatus: 'cancelled' })} className="flex-1 bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-600 flex items-center justify-center space-x-1">
                  <HiX /> <span>Reject Payment</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-24 animate-pulse"></div>)}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <HiSparkles className="text-5xl text-green-300 mx-auto mb-4" />
          <p className="text-green-500 font-semibold">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {order.userId?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">{order.userId?.name || 'User'}</p>
                    <p className="text-sm text-green-500">#{order._id.slice(-8).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold text-orange-500 text-lg">₹{order.totalAmount}</p>
                    <p className="text-xs text-green-400">{order.products.length} items</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                    order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.orderStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <button className="text-orange-500 hover:text-orange-600"><HiEye className="text-xl" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
