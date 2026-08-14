import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiTrash, HiMinus, HiPlus, HiShoppingCart, HiArrowRight, HiSparkles, HiBadgeCheck, HiTruck, HiShieldCheck } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, refreshCart } = useCart();

  useEffect(() => { refreshCart(); }, [refreshCart]);

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-28 h-28 mx-auto mb-6 rounded-[2rem] bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center shadow-lg ring-1 ring-yellow-200">
            <HiShoppingCart className="text-6xl text-yellow-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Your Cart is <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500">Empty</span></h2>
          <p className="text-gray-500 mb-8">Add some crackers to light up your festival!</p>
          <Link to="/products" className="inline-flex items-center justify-center gap-2 rounded-full font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 text-slate-900 px-8 py-3.5 shadow-xl shadow-yellow-500/30 transition-all duration-300 hover:shadow-yellow-500/50 hover:-translate-y-0.5 active:scale-95">
            <HiArrowRight /> Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8">
        Shopping <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500">Cart</span>
      </h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-4 md:p-5"
            >
              <div className="flex items-center gap-4">
                <Link to={`/products/${item.productId}`}>
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm ring-1 ring-yellow-200">
                    {item.image ? <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" /> : <HiSparkles className="text-3xl text-yellow-500" />}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.productId}`}>
                    <h3 className="font-bold text-gray-800 hover:text-yellow-600 truncate">{item.name}</h3>
                  </Link>
                  <p className="text-yellow-600 font-black mt-0.5">₹{item.price}</p>
                </div>
                <div className="hidden md:flex items-center bg-yellow-50 rounded-full ring-1 ring-yellow-200 shrink-0">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-l-full transition-all">
                    <HiMinus className="text-sm" />
                  </button>
                  <span className="px-4 font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-r-full transition-all">
                    <HiPlus className="text-sm" />
                  </button>
                </div>
                <div className="hidden md:block text-right shrink-0">
                  <p className="font-black text-gray-900">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 ml-auto mt-1">
                    <HiTrash className="text-xs" /> Remove
                  </button>
                </div>
              </div>
              <div className="md:hidden flex items-center justify-between mt-3 pt-3 border-t border-yellow-100">
                <div className="flex items-center bg-yellow-50 rounded-full ring-1 ring-yellow-200">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2.5 text-yellow-600 hover:bg-yellow-100 rounded-l-full transition-all">
                    <HiMinus className="text-sm" />
                  </button>
                  <span className="px-4 font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2.5 text-yellow-600 hover:bg-yellow-100 rounded-r-full transition-all">
                    <HiPlus className="text-sm" />
                  </button>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-gray-900">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 ml-auto mt-0.5">
                    <HiTrash className="text-xs" /> Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card p-6 h-fit lg:sticky lg:top-24">
          <h3 className="font-black text-xl text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-600"><span>Items ({cart.items.length})</span><span className="font-bold">₹{cartTotal}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span className="chip bg-green-100 text-green-700"><HiTruck /> Free</span></div>
            <div className="flex justify-between text-gray-600"><span>Safety</span><span className="chip bg-blue-100 text-blue-700"><HiShieldCheck /> Certified</span></div>
            <div className="border-t pt-3 flex justify-between text-lg font-black text-gray-900">
              <span>Total</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500">₹{cartTotal}</span>
            </div>
          </div>
          <Link to="/checkout" className="w-full py-3.5 text-base inline-flex items-center justify-center gap-2 rounded-full font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 text-slate-900 shadow-xl shadow-yellow-500/30 transition-all duration-300 hover:shadow-yellow-500/50 hover:-translate-y-0.5 active:scale-95">Proceed to Checkout</Link>
          <Link to="/products" className="block w-full text-center py-2.5 text-yellow-600 font-semibold hover:text-yellow-700 mt-2">
            Continue Shopping
          </Link>
          <div className="mt-4 pt-4 border-t border-yellow-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <HiBadgeCheck className="text-yellow-500" /> 100% Safe & Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
}
