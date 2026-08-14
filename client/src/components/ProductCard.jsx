import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingCart, HiStar, HiFire, HiSparkles, HiArrowRight } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, index = 0, delay = 0 }) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product._id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: delay || (index % 4) * 0.06 }}
      whileHover={{ y: -6 }}
      className="card overflow-hidden group"
    >
      <Link to={`/products/${product._id}`} className="block h-full">
        <div className="relative h-44 sm:h-48 bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-50 flex items-center justify-center overflow-hidden">
          {product.image || product.imageUrl ? (
            <img src={product.image || product.imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          ) : (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <HiSparkles className="text-6xl text-yellow-300" />
            </motion.div>
          )}
          {product.discountPrice > 0 && (
            <motion.span
              initial={{ scale: 0, rotate: -12 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: (index % 4) * 0.06 }}
              className="absolute top-3 left-3"
            >
              <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center gap-1 bg-white text-slate-900 text-xs px-3 py-1.5 rounded-full font-bold shadow-lg ring-1 ring-black/10"
              >
                <HiFire className="text-xs text-slate-900" />
                {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
              </motion.span>
            </motion.span>
          )}
          {product.featured && (
            <span className="absolute top-3 right-3 chip bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-900 shadow-lg">
              <HiFire className="text-xs" /> HOT
            </span>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-xs font-black text-red-600 bg-white/90 px-4 py-2 rounded-full shadow-lg">OUT OF STOCK</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-yellow-600">{product.category}</p>
            <div className="flex items-center gap-0.5">
              <HiStar className={`text-xs ${product.reviewCount > 0 ? 'text-amber-400' : 'text-red-500'}`} />
              <span className={`text-[10px] font-semibold ${product.reviewCount > 0 ? 'text-gray-400' : 'text-red-500 font-black'}`}>
                {product.reviewCount > 0 ? `${product.avgRating ?? 0} (${product.reviewCount})` : 'New'}
              </span>
            </div>
          </div>
          <h3 className="font-bold text-gray-800 mb-2 truncate group-hover:text-yellow-600 transition-colors">{product.name}</h3>
          <div className="flex items-center justify-between">
            <div>
              {product.discountPrice > 0 ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-black text-slate-900">₹{product.discountPrice}</span>
                  <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                </div>
              ) : (
                <span className="text-lg font-black text-slate-900">₹{product.price}</span>
              )}
            </div>
            <motion.button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(); }}
              disabled={product.stock <= 0}
              whileTap={{ scale: 0.85 }}
              className={`p-2.5 rounded-2xl transition-all duration-300 ${
                product.stock > 0
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/10 hover:shadow-lg hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <HiShoppingCart className="text-lg" />
            </motion.button>
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <motion.p
              animate={{ opacity: [1, 0.25, 1], color: ['#ef4444', '#dc2626', '#ef4444'] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[11px] font-black mt-2 flex items-center gap-1"
            >
              <HiFire className="text-xs text-red-500" /> Hurry! Only {product.stock} left
            </motion.p>
          )}
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-center gap-1 text-[11px] font-black uppercase tracking-wider text-yellow-600 group-hover:text-yellow-700 transition-colors">
            View Product <HiArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
