import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiSparkles, HiShoppingCart, HiLocationMarker, HiBadgeCheck, HiTruck, HiShieldCheck, HiUserCircle } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import { MIN_ORDER_AMOUNT, SHOP_CONTACT } from '../utils/constants';

export default function Checkout() {
  const { cart, cartTotal, clearCart, refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => { refreshCart(); }, [refreshCart]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!name.trim()) return toast.error('Please enter your name');
    if (!/^[0-9]{10}$/.test(phone.trim())) return toast.error('Please enter a valid 10-digit phone number');
    if (!address.trim()) return toast.error('Please enter delivery address');
    if (!transactionId.trim()) return toast.error('Please enter Google Pay transaction ID / UTR number');
    if (cartTotal < MIN_ORDER_AMOUNT) return toast.error(`Minimum order amount is ₹${MIN_ORDER_AMOUNT}`);
    setLoading(true);
    try {
      const products = cart.items.map(i => ({ productId: i.productId, quantity: i.quantity }));
      await orderAPI.place({ name: name.trim(), phone: phone.trim(), address, transactionId, products });
      localStorage.setItem('guestPhone', phone.trim());
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
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
        Check<span className="text-gradient">out</span>
      </h1>
      <div className="flex items-center gap-2 mb-8 text-xs font-bold">
        <span className="chip bg-orange-500 text-white">1. Your Details</span>
        <div className="w-8 h-0.5 bg-orange-200" />
        <span className="chip bg-orange-500 text-white">2. Address</span>
        <div className="w-8 h-0.5 bg-orange-200" />
        <span className="chip bg-orange-500 text-white">3. Payment</span>
        <div className="w-8 h-0.5 bg-orange-200" />
        <span className="chip bg-gray-100 text-gray-400">4. Confirm</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          {/* Your Details */}
          <div className="card p-6 mb-6">
            <h3 className="font-black text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white flex items-center justify-center text-sm font-black">1</span>
              Your Details <HiUserCircle className="text-orange-500 ml-1" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="field"
                />
              </div>
              <div className="sm:col-span-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  className="field"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card p-6 mb-6">
            <h3 className="font-black text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white flex items-center justify-center text-sm font-black">2</span>
              Delivery Address <HiLocationMarker className="text-orange-500 ml-1" />
            </h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address with pincode"
              className="field h-32 resize-none"
            />
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h3 className="font-black text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white flex items-center justify-center text-sm font-black">3</span>
              Payment via Google Pay
            </h3>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-5 mb-4 text-white shadow-lg shadow-blue-500/20">
              <div className="flex items-center gap-2">
                <p className="text-blue-100 font-semibold text-sm">Account Holder Name:</p>
                <p className="text-xl font-black text-yellow-300">{SHOP_CONTACT.gpayName}</p>
              </div>
              <p className="text-blue-100 font-semibold text-sm mt-2">Google Pay Number:</p>
              <p className="text-2xl font-black tracking-wide">{import.meta.env.VITE_GPAY_NUMBER || SHOP_CONTACT.gpayNumber}</p>
              <p className="text-blue-100 text-xs mt-1">Pay the total amount and enter the transaction reference below</p>
              <div className="mt-4 flex flex-col items-center gap-1">
                <img
                  src="/gpay-qr.png"
                  alt="GPay QR code"
                  className="w-44 h-44 rounded-xl bg-white p-2 object-contain shadow-lg"
                />
                <p className="text-blue-100 text-[11px] font-semibold">Scan & Pay via GPay / UPI</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl p-4 mb-4 ring-1 ring-orange-100">
              <span className="font-bold text-gray-700">Total Amount to Pay:</span>
              <span className="text-3xl font-black text-gradient">₹{cartTotal}</span>
            </div>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter GPay transaction reference / UTR number"
              className="field"
            />
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="card p-6 md:sticky md:top-24">
            <h3 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2">
              <HiShoppingCart className="text-orange-500" /> Order Summary
            </h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
              {cart.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center gap-3 p-3 rounded-2xl bg-orange-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" /> : <HiSparkles className="text-orange-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-sm shrink-0">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-bold">₹{cartTotal}</span></div>
              <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="chip bg-green-100 text-green-700"><HiTruck /> Free</span></div>
              <div className="flex justify-between text-xl font-black text-gray-900 border-t pt-2">
                <span>Total</span><span className="text-gradient">₹{cartTotal}</span>
              </div>
            </div>
            {cartTotal < MIN_ORDER_AMOUNT && (
              <div className="mt-4 flex items-center gap-2 bg-amber-50 ring-1 ring-amber-200 rounded-xl p-3 text-amber-700 text-xs font-bold">
                <HiSparkles className="text-amber-500 shrink-0" />
                Add ₹{MIN_ORDER_AMOUNT - cartTotal} more to reach the ₹{MIN_ORDER_AMOUNT} minimum order
              </div>
            )}
            <button onClick={handlePlaceOrder} disabled={loading || cartTotal < MIN_ORDER_AMOUNT} className="btn-primary w-full py-3.5 text-base mt-6 disabled:opacity-50">
              {cartTotal < MIN_ORDER_AMOUNT ? `Minimum order ₹${MIN_ORDER_AMOUNT}` : (loading ? 'Placing Order...' : 'Place Order')}
            </button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <HiBadgeCheck className="text-orange-400" /> <HiShieldCheck className="text-green-500" /> Your order will be confirmed after payment verification
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
