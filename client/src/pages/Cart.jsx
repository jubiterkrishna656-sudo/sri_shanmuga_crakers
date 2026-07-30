import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiTrash, HiMinus, HiPlus, HiShoppingCart, HiArrowLeft, HiSparkles } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <HiShoppingCart className="text-8xl text-green-300 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-green-500 mb-2">Your Cart is Empty</h2>
        <p className="text-green-400 mb-6">Add some crackers to light up your festival!</p>
        <Link to="/products" className="inline-flex items-center bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition"><HiArrowLeft className="mr-2" /> Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-8">Shopping <span className="text-orange-500">Cart</span></h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item, i) => (
            <motion.div key={item.productId?._id || i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4">
              <Link to={`/products/${item.productId?._id}`}>
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center">
                  {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : <HiSparkles className="text-3xl text-orange-300" />}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId?._id}`}>
                  <h3 className="font-semibold text-green-800 hover:text-orange-500">{item.name}</h3>
                </Link>
                <p className="text-orange-500 font-bold">₹{item.price}</p>
              </div>
              <div className="flex items-center border border-green-300 rounded-full">
                <button onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)} className="p-1.5 hover:bg-orange-50 rounded-l-full"><HiMinus className="text-sm" /></button>
                <span className="px-4 font-semibold text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)} className="p-1.5 hover:bg-orange-50 rounded-r-full"><HiPlus className="text-sm" /></button>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-800">₹{item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.productId?._id)} className="text-red-500 hover:text-red-700 text-sm flex items-center"><HiTrash className="mr-1" /> Remove</button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-md h-fit sticky top-20">
          <h3 className="font-bold text-xl text-green-800 mb-4">Order Summary</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-green-600"><span>Items ({cart.items.length})</span><span>₹{cartTotal}</span></div>
            <div className="flex justify-between text-green-600"><span>Shipping</span><span className="text-green-600">Free</span></div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold text-green-800"><span>Total</span><span className="text-orange-500">₹{cartTotal}</span></div>
          </div>
          <Link to="/checkout" className="block w-full bg-orange-500 text-white text-center py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition">Proceed to Checkout</Link>
          <Link to="/products" className="block w-full text-center py-2 text-orange-500 hover:text-orange-600 mt-2">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
