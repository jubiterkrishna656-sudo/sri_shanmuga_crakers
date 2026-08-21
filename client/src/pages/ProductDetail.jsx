import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiShoppingCart, HiMinus, HiPlus, HiArrowLeft, HiSparkles, HiShieldCheck, HiTruck, HiPlay, HiBadgeCheck, HiFire, HiCheck, HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [addedMsg, setAddedMsg] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    productAPI.getById(id).then(res => {
      setProduct(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    productAPI.getAll({ category: product.category, limit: 8 }).then(res => {
      const data = res.data;
      const list = Array.isArray(data) ? data : data.products || [];
      setRelated(list.filter(p => p._id !== product._id).slice(0, 4));
    }).catch(() => setRelated([]));
  }, [product]);

  const handleAddToCart = async () => {
    const added = await addToCart(product._id, quantity);
    if (added) {
      setAddedMsg(true);
      toast.success(`${quantity}× ${product.name} added!`, { icon: '🛒' });
      setTimeout(() => setAddedMsg(false), 1500);
    }
  };

  const handleBuyNow = async () => {
    const added = await addToCart(product._id, quantity);
    if (added) navigate('/checkout');
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded-full w-24" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-200 rounded-2xl h-72 md:h-96" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-full w-20" />
            <div className="h-8 bg-gray-200 rounded-full w-2/3" />
            <div className="h-10 bg-gray-200 rounded-full w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-24 px-4">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
        <HiSparkles className="text-4xl text-gray-300" />
      </div>
      <h2 className="text-xl font-black text-gray-900 mb-2">Product not found</h2>
      <Link to="/products" className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm mt-4 hover:bg-gray-800 transition-all">
        <HiArrowLeft /> Browse Products
      </Link>
    </div>
  );

  const save = product.discountPrice > 0 ? product.price - product.discountPrice : 0;
  const price = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={product?.name}
        description={product?.description || `Buy ${product?.name} at Sri Shanmuga Grand Crackers, Sivakasi. Certified premium quality.`}
      />

      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
        {/* Back */}
        <Link to="/products" className="inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 font-bold text-xs mb-4 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all">
          <HiArrowLeft className="text-sm" /> All Products
        </Link>

        {/* Main Grid */}
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-5 lg:gap-8 items-start pb-24 md:pb-8">

          {/* Image */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              {/* OFF Badge */}
              {product.discountPrice > 0 && (
                <motion.span
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="absolute top-3 left-3 z-10"
                >
                  <motion.span
                    animate={{ boxShadow: ['0 0 0px 0px rgba(0,0,0,0.8)', '0 0 12px 3px rgba(250,204,21,0.7)', '0 0 0px 0px rgba(0,0,0,0.8)'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-black border border-white/20"
                  >
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-yellow-400">⚡</motion.span>
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </motion.span>
                </motion.span>
              )}

              {/* HOT Badge */}
              {product.featured && (
                <span className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-amber-400 text-black text-[10px] px-2.5 py-1 rounded-lg font-black shadow-lg flex items-center gap-0.5">
                  <HiFire className="text-[10px]" /> HOT
                </span>
              )}

              <div className="p-6 md:p-10 flex items-center justify-center min-h-[260px] md:min-h-[380px]">
                {product.image ? (
                  <img src={product.image} alt={product.name} loading="lazy" className="max-w-full max-h-[220px] md:max-h-[300px] object-contain" />
                ) : product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} loading="lazy" className="max-w-full max-h-[220px] md:max-h-[300px] object-contain" />
                ) : (
                  <HiSparkles className="text-7xl text-gray-300" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>

            {/* Category + Item # */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider">{product.category}</span>
              {product.productNumber && <span className="px-2 py-1 rounded-lg bg-black text-yellow-400 text-[10px] font-bold">#{product.productNumber}</span>}
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h1>

            {/* Price Block */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
              <div className="flex items-center flex-wrap gap-3">
                {product.discountPrice > 0 ? (
                  <>
                    <span className="text-3xl md:text-4xl font-black text-gray-900">Rs. {product.discountPrice}</span>
                    <span className="text-lg text-gray-400 line-through font-bold">Rs. {product.price}</span>
                    <span className="inline-flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-lg text-xs font-black">
                      Save Rs. {save}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl md:text-4xl font-black text-gray-900">Rs. {product.price}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-500 mb-4 leading-relaxed text-sm">
              {product.description || 'Premium quality crackers from Shanmuga Grand Crackers. Safe and certified products for your celebrations.'}
            </p>

            {/* Badges */}
            <div className="flex items-center flex-wrap gap-2 mb-5">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 font-bold text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                  <HiShieldCheck className="text-green-500" /> In Stock ({product.stock})
                </span>
              ) : (
                <span className="text-red-500 text-xs font-bold bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">Out of Stock</span>
              )}
              <span className="inline-flex items-center gap-1.5 font-bold text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                <HiTruck className="text-yellow-500" /> Free Delivery
              </span>
              <span className="inline-flex items-center gap-1.5 font-bold text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                <HiBadgeCheck className="text-green-500" /> 100% Safe
              </span>
            </div>

            {product.stock > 0 ? (
              <>
                {/* Quantity */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-black text-gray-900 text-sm">Quantity</span>
                  <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-l-xl transition-all">
                      <HiMinus className="text-sm" />
                    </button>
                    <span className="px-5 font-black text-gray-900 text-lg min-w-[3rem] text-center border-x border-gray-100">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 rounded-r-xl transition-all">
                      <HiPlus className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Total + Actions Combined Card */}
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
                  {/* Total Row */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Order Total</p>
                      <p className="text-xs text-gray-500 font-medium">{quantity} × Rs. {price}</p>
                    </div>
                    <span className="text-2xl font-black text-gray-900">Rs. {price * quantity}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button onClick={handleAddToCart} className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl font-black bg-yellow-400 text-black hover:bg-yellow-500 active:scale-[0.98] transition-all shadow-sm">
                      <AnimatePresence mode="wait">
                        {addedMsg ? (
                          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                            <HiCheck className="text-lg" /> Added!
                          </motion.span>
                        ) : (
                          <motion.span key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                            <HiShoppingCart className="text-lg" /> Add to Cart
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <button onClick={handleBuyNow} className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl font-black bg-gray-900 text-white hover:bg-black active:scale-[0.98] transition-all shadow-sm">
                      Buy Now
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-200 flex items-center justify-center">
                  <HiX className="text-xl text-gray-400" />
                </div>
                <p className="font-black text-gray-900 text-sm mb-1">Out of Stock</p>
                <p className="text-xs text-gray-400">This product is currently unavailable</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Video */}
        {product.videoUrl && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-yellow-400 text-sm"><HiPlay /></span>
              Product Video
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black">
              <iframe
                src={getYouTubeEmbedUrl(product.videoUrl)}
                title="Product Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-yellow-400 text-sm"><HiSparkles /></span>
              More Products
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile Sticky Bottom Bar */}
      {product.stock > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-14 bg-white border-t border-gray-200 px-4 py-3 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</p>
              <p className="text-xl font-black text-gray-900">Rs. {price * quantity}</p>
            </div>
            <div className="flex items-center bg-gray-100 rounded-xl border border-gray-200">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-l-xl transition-all">
                <HiMinus className="text-xs" />
              </button>
              <span className="px-4 font-black text-gray-900 text-sm">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-r-xl transition-all">
                <HiPlus className="text-xs" />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddToCart} className="flex-1 h-11 text-sm font-black bg-yellow-400 text-black rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
              <HiShoppingCart className="text-base" /> Add to Cart
            </button>
            <button onClick={handleBuyNow} className="flex-1 h-11 text-sm font-black bg-gray-900 text-white rounded-xl flex items-center justify-center active:scale-[0.98] transition-all">
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
