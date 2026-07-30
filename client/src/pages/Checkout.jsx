import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiSparkles } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!address.trim()) return toast.error('Please enter delivery address');
    if (!paymentScreenshot.trim()) return toast.error('Please enter Google Pay transaction ID or upload screenshot reference');
    setLoading(true);
    try {
      await orderAPI.place({ address, paymentScreenshot });
      toast.success('Order placed successfully!');
      await clearCart();
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h3 className="font-bold text-xl text-green-800 mb-4">1. Delivery Address</h3>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your full delivery address with pincode" className="w-full border border-green-300 rounded-xl p-4 h-32 focus:outline-none focus:border-orange-500 resize-none" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h3 className="font-bold text-xl text-green-800 mb-4">2. Payment via Google Pay</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4">
              <p className="font-semibold text-green-700">Google Pay Number:</p>
              <p className="text-2xl font-bold text-orange-500">9876543210</p>
              <p className="text-sm text-green-500 mt-1">Pay the total amount and enter the transaction reference below</p>
            </div>
            <div className="flex items-center justify-between bg-green-50 rounded-xl p-4 mb-4">
              <span className="font-semibold text-green-700">Total Amount to Pay:</span>
              <span className="text-3xl font-bold text-green-600">₹{cartTotal}</span>
            </div>
            <input type="text" value={paymentScreenshot} onChange={(e) => setPaymentScreenshot(e.target.value)} placeholder="Enter GPay transaction reference / UTR number" className="w-full border border-green-300 rounded-xl p-3 focus:outline-none focus:border-orange-500" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-white rounded-2xl p-6 shadow-md sticky top-20">
            <h3 className="font-bold text-xl text-green-800 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {cart.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <HiSparkles className="text-orange-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-green-800">{item.name}</p>
                      <p className="text-xs text-green-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-green-600"><span>Subtotal</span><span>₹{cartTotal}</span></div>
              <div className="flex justify-between text-green-600"><span>Shipping</span><span className="text-green-600">Free</span></div>
              <div className="flex justify-between text-xl font-bold text-green-800 border-t pt-2"><span>Total</span><span className="text-orange-500">₹{cartTotal}</span></div>
            </div>
            <button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition mt-6 disabled:opacity-50">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
