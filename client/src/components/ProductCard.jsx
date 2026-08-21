import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingCart, HiStar, HiFire, HiSparkles, HiChevronRight, HiTag } from 'react-icons/hi';
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
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden group border border-gray-200 hover:border-yellow-400 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300"
    >
      <Link to={`/products/${product._id}`} className="block h-full">
        <div className="relative h-40 sm:h-44 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center overflow-hidden">
          {product.image || product.imageUrl ? (
            <img src={product.image || product.imageUrl} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
              <HiSparkles className="text-5xl text-yellow-400" />
            </motion.div>
          )}
          {product.discountPrice > 0 && (
            <motion.span
              initial={{ scale: 0, rotate: -12 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: (index % 4) * 0.06 }}
              className="absolute top-2.5 left-2.5"
            >
              <motion.span
                animate={{ boxShadow: ['0 0 0px 0px rgba(0,0,0,0.8)', '0 0 12px 3px rgba(250,204,21,0.7)', '0 0 0px 0px rgba(0,0,0,0.8)'] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center gap-0.5 bg-black text-white text-[10px] px-2.5 py-1 rounded-lg font-black border border-white/30"
              >
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-yellow-400 text-[10px]"
                >⚡</motion.span>
                {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
              </motion.span>
            </motion.span>
          )}
          {product.featured && (
            <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-black text-[10px] px-2 py-1 rounded-lg font-black shadow-lg flex items-center gap-0.5">
              <HiFire className="text-[10px]" /> HOT
            </span>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-[11px] font-black text-white bg-black px-4 py-2 rounded-xl shadow-lg">OUT OF STOCK</span>
            </div>
          )}
        </div>
        <div className="p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{product.category}</span>
            <div className="flex items-center gap-0.5">
              {product.reviewCount > 0 ? (
                <>
                  <HiStar className="text-[10px] text-yellow-400" />
                  <span className="text-[10px] font-bold text-gray-400">{product.avgRating ?? 0}</span>
                </>
              ) : (
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">New</span>
              )}
            </div>
          </div>
          <h3 className="font-black text-gray-900 text-sm mb-2 truncate group-hover:text-yellow-600 transition-colors leading-snug">{product.name}</h3>
          <div className="flex items-end justify-between">
            <div>
              {product.discountPrice > 0 ? (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-black text-gray-900">Rs. {product.discountPrice}</span>
                  <span className="text-[10px] text-gray-400 line-through">Rs. {product.price}</span>
                </div>
              ) : (
                <span className="text-base font-black text-gray-900">Rs. {product.price}</span>
              )}
              {product.discountPrice > 0 && (
                <p className="text-[10px] font-black flex items-center gap-0.5 mt-0.5 bg-gray-900 text-yellow-400 px-2 py-0.5 rounded-md w-fit">
                  <HiTag className="text-[10px]" /> Save Rs. {product.price - product.discountPrice}
                </p>
              )}
            </div>
            <motion.button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAdd(); }}
              disabled={product.stock <= 0}
              whileTap={{ scale: 0.85 }}
              className={`p-2 rounded-xl transition-all duration-200 ${
                product.stock > 0
                  ? 'bg-black text-white shadow-lg hover:bg-gray-800 hover:-translate-y-0.5'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <HiShoppingCart className="text-sm" />
            </motion.button>
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <motion.p
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[10px] font-black mt-2 flex items-center gap-1 text-red-500"
            >
              <HiFire className="text-[10px]" /> Only {product.stock} left!
            </motion.p>
          )}
          <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-600">View details</span>
            <motion.span
              className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-md shadow-yellow-400/30 group-hover:shadow-yellow-400/50 group-hover:bg-yellow-500 transition-all"
              whileHover={{ scale: 1.15 }}
            >
              <HiChevronRight className="text-[11px] text-black" />
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
