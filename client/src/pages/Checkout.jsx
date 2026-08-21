import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { HiSparkles, HiShoppingCart, HiLocationMarker, HiShieldCheck, HiUserCircle, HiArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
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
      {/* Back button */}
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 font-bold text-xs mb-3 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all">
        <HiArrowLeft /> Back to Cart
      </Link>

      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
        Check<span className="text-yellow-400">out</span>
      </h1>
      <div className="hidden md:flex items-center gap-2 mb-8 text-xs font-bold">
        <span className="chip bg-gray-900 text-white">1. Your Details</span>
        <div className="w-8 h-0.5 bg-gray-300" />
        <span className="chip bg-gray-900 text-white">2. Address</span>
        <div className="w-8 h-0.5 bg-gray-300" />
        <span className="chip bg-gray-900 text-white">3. Payment</span>
        <div className="w-8 h-0.5 bg-gray-300" />
        <span className="chip bg-gray-100 text-gray-400">4. Confirm</span>
      </div>
      <div className="flex md:hidden items-center gap-2 mb-6 text-[11px] font-bold overflow-x-auto">
        <span className="shrink-0 px-3 py-1.5 rounded-lg bg-gray-900 text-white">1 Details</span>
        <span className="shrink-0 px-3 py-1.5 rounded-lg bg-gray-900 text-white">2 Address</span>
        <span className="shrink-0 px-3 py-1.5 rounded-lg bg-gray-900 text-white">3 Pay</span>
        <span className="shrink-0 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400">4 OK</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          {/* Your Details */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="font-black text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gray-900 text-yellow-400 flex items-center justify-center text-sm font-black">1</span>
              Your Details <HiUserCircle className="text-gray-400 ml-1" />
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit phone number (for WhatsApp updates)"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-6">
            <h3 className="font-black text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gray-900 text-yellow-400 flex items-center justify-center text-sm font-black">2</span>
              Delivery Address <HiLocationMarker className="text-gray-400 ml-1" />
            </h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address with pincode"
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all h-32 resize-none"
            />
          </div>

          {/* Payment */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <h3 className="font-black text-lg text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gray-900 text-yellow-400 flex items-center justify-center text-sm font-black">3</span>
              Payment via Google Pay
            </h3>
            <div className="bg-gray-900 rounded-2xl p-5 mb-4 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-gray-400 font-semibold text-sm">Account Holder Name:</p>
                <p className="text-xl font-black text-yellow-400">{SHOP_CONTACT.gpayName}</p>
              </div>
              <p className="text-gray-400 font-semibold text-sm mt-2">Google Pay Number:</p>
              <p className="text-2xl font-black tracking-wide">{import.meta.env.VITE_GPAY_NUMBER || SHOP_CONTACT.gpayNumber}</p>
              <p className="text-gray-400 text-xs mt-1">Pay the total amount and enter the transaction reference below</p>
              <div className="mt-4 flex flex-col items-center gap-1">
                <img
                  src="/gpay-qr.png"
                  alt="GPay QR code"
                  className="w-44 h-44 rounded-xl bg-white p-2 object-contain shadow-lg"
                />
                <p className="text-gray-400 text-[11px] font-semibold">Scan & Pay via GPay / UPI</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-yellow-400 rounded-2xl p-4 mb-4 shadow-sm">
              <span className="font-bold text-black text-sm">Total Amount to Pay:</span>
              <span className="text-3xl font-black text-black">Rs. {cartTotal}</span>
            </div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Transaction ID / UTR</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Paste the reference number from GPay"
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all"
            />
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden md:sticky md:top-24 shadow-sm">
            {/* Header */}
            <div className="bg-gray-900 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiShoppingCart className="text-yellow-400" />
                <span className="font-black text-white text-sm">Order Summary</span>
              </div>
              <span className="bg-yellow-400 text-black text-xs font-black px-2.5 py-1 rounded-lg">{cart.items.length} items</span>
            </div>

            {/* Items */}
            <div className="px-5 pt-4 pb-3">
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200">
                      {item.image ? <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" /> : <HiSparkles className="text-gray-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: <span className="font-bold text-gray-700">{item.quantity}</span></p>
                    </div>
                    <span className="font-black text-sm text-gray-900 shrink-0">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="mx-5 border-t border-dashed border-gray-200" />

            {/* Totals */}
            <div className="px-5 py-4 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Subtotal</span>
                <span className="text-sm font-bold text-gray-700">Rs. {cartTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-medium">Delivery</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">FREE</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                <span className="font-black text-gray-900">Total</span>
                <span className="font-black text-xl text-gray-900">Rs. {cartTotal}</span>
              </div>
            </div>

            {/* Minimum Order Warning */}
            {cartTotal < MIN_ORDER_AMOUNT && (
              <div className="mx-5 mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 text-base leading-none mt-0.5">!</span>
                  <div>
                    <p className="text-xs font-bold text-yellow-700">Minimum order not met</p>
                    <p className="text-[11px] text-yellow-600 mt-0.5">Add <span className="font-bold">Rs. {MIN_ORDER_AMOUNT - cartTotal}</span> more to reach the Rs. {MIN_ORDER_AMOUNT} minimum</p>
                  </div>
                </div>
              </div>
            )}

            {/* Place Order Button */}
            <div className="px-5 pb-5">
              <button onClick={handlePlaceOrder} disabled={loading || cartTotal < MIN_ORDER_AMOUNT}
                className="w-full py-3.5 rounded-xl font-black bg-yellow-400 text-black hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-sm shadow-sm">
                {cartTotal < MIN_ORDER_AMOUNT ? `Add Rs. ${MIN_ORDER_AMOUNT - cartTotal} more` : (loading ? 'Placing Order...' : 'Place Order — Rs. ' + cartTotal)}
              </button>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <HiShieldCheck className="text-gray-300 shrink-0" /> Confirmed after payment verification
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
