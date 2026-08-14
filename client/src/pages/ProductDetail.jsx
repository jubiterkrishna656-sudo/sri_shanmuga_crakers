import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingCart, HiMinus, HiPlus, HiArrowLeft, HiSparkles, HiShieldCheck, HiTruck, HiPlay, HiBadgeCheck, HiFire } from 'react-icons/hi';
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

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
  };

  const handleBuyNow = async () => {
    const added = await addToCart(product._id, quantity);
    if (added) navigate('/checkout');
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16"><div className="card h-96 animate-pulse" /></div>;
  if (!product) return <div className="text-center py-24"><h2 className="text-2xl font-black text-yellow-600">Product not found</h2></div>;

  const save = product.discountPrice > 0 ? product.price - product.discountPrice : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/70 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <Seo
        title={product?.name}
        description={product?.description || `Buy ${product?.name} at Sri Shanmuga Grand Crackers, Sivakasi. Certified premium quality.`}
      />
      <Link to="/products" className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-black text-sm mb-6">
        <HiArrowLeft /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative p-[3px] rounded-[2.5rem] bg-gradient-to-br from-yellow-300 via-amber-400 to-fuchsia-500 shadow-2xl shadow-yellow-500/20"
        >
          <div className="relative rounded-[calc(2.5rem-3px)] p-8 md:p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center min-h-[320px] md:min-h-[440px] overflow-hidden">
            <div className="absolute top-6 left-6 w-40 h-40 bg-yellow-500/20 rounded-full blur-[80px]" />
            <div className="absolute bottom-6 right-6 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-[90px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-amber-400/10 rounded-full blur-[100px]" />
            <motion.span className="absolute top-10 left-10 text-yellow-400 text-xl animate-sparkle">✦</motion.span>
            <motion.span className="absolute bottom-12 right-10 text-amber-400 text-lg animate-sparkle" style={{ animationDelay: '0.5s' }}>✦</motion.span>
            <motion.span className="absolute top-16 right-16 text-fuchsia-400 text-base animate-sparkle" style={{ animationDelay: '0.9s' }}>✦</motion.span>
            {product.image ? (
              <img src={product.image} alt={product.name} loading="lazy" className="relative max-w-full max-h-[300px] md:max-h-[380px] object-contain drop-shadow-[0_20px_40px_rgba(250,204,21,0.25)]" />
            ) : product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} loading="lazy" className="relative max-w-full max-h-[300px] md:max-h-[380px] object-contain drop-shadow-[0_20px_40px_rgba(250,204,21,0.25)]" />
            ) : (
              <HiSparkles className="relative text-8xl text-yellow-400" />
            )}
            {product.discountPrice > 0 && (
              <motion.span
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute top-5 left-5"
              >
                <motion.span
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center gap-1 bg-white text-slate-900 px-4 py-2 rounded-full font-black shadow-xl ring-1 ring-black/10 text-sm"
                >
                  <HiFire className="text-sm" />
                  {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                </motion.span>
              </motion.span>
            )}
            {product.featured && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute top-5 right-5 chip bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-900 shadow-lg"
              >
                <HiFire /> HOT
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="chip bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 shadow-md shadow-yellow-500/40">{product.category}</span>
            <span className="chip bg-slate-900 text-yellow-300 border border-slate-800">{product.productNumber && `Item #${product.productNumber}`}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h1>

          <div className="flex items-center flex-wrap gap-4 mb-6">
            {product.discountPrice > 0 ? (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900 font-black flex items-center justify-center shadow-lg shadow-yellow-500/40 ring-1 ring-yellow-300/50">₹</span>
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 drop-shadow-sm"
                  >
                    {product.discountPrice}
                  </motion.span>
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-0.5">MRP</p>
                  <span className="text-2xl text-red-400 line-through font-bold decoration-red-400/70 decoration-2">₹{product.price}</span>
                </div>
                <motion.span
                  initial={{ scale: 0, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                  className="inline-flex"
                >
                  <motion.span
                    animate={{ scale: [1, 1.1, 1], rotate: [0, -3, 3, 0], boxShadow: ['0 0 0px rgba(16,185,129,0.4)', '0 0 18px rgba(16,185,129,0.7)', '0 0 0px rgba(16,185,129,0.4)'] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-black text-sm shadow-lg"
                  >
                    Save ₹{save}
                  </motion.span>
                </motion.span>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900 font-black flex items-center justify-center shadow-lg shadow-yellow-500/40 ring-1 ring-yellow-300/50">₹</span>
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 drop-shadow-sm"
                >
                  {product.price}
                </motion.span>
              </div>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description || 'Premium quality crackers from Shanmuga Grand Crackers. Safe and certified products for your celebrations.'}
          </p>

          <div className="flex items-center flex-wrap gap-3 mb-7">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-sm bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full ring-1 ring-emerald-200">
                <HiShieldCheck className="text-base" /> In Stock ({product.stock} units)
              </span>
            ) : (
              <span className="text-red-500 text-sm font-bold bg-red-50 px-4 py-2 rounded-full ring-1 ring-red-100">Out of Stock</span>
            )}
            <span className="inline-flex items-center gap-1.5 text-yellow-700 font-bold text-sm bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-2 rounded-full ring-1 ring-yellow-200">
              <HiTruck className="text-base" /> Free Delivery
            </span>
            <span className="inline-flex items-center gap-1.5 text-purple-600 font-bold text-sm bg-gradient-to-r from-purple-50 to-fuchsia-50 px-4 py-2 rounded-full ring-1 ring-purple-200">
              <HiBadgeCheck className="text-base" /> 100% Safe
            </span>
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center gap-5 mb-8">
                <span className="font-black text-gray-800">Quantity:</span>
                <div className="flex items-center bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full ring-1 ring-yellow-300 shadow-md shadow-yellow-500/10">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-yellow-700 hover:bg-yellow-200/70 rounded-l-full transition-all">
                    <HiMinus />
                  </button>
                  <span className="px-7 font-black text-gray-900 text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 text-yellow-700 hover:bg-yellow-200/70 rounded-r-full transition-all">
                    <HiPlus />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleAddToCart} className="flex-1 px-6 py-3.5 text-base inline-flex items-center justify-center gap-2 rounded-full font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 text-slate-900 shadow-xl shadow-yellow-500/30 ring-1 ring-yellow-300/50 transition-all duration-300 hover:shadow-yellow-500/50 hover:-translate-y-0.5 hover:ring-yellow-300 active:scale-95">
                  <HiShoppingCart className="text-xl" /> Add to Cart
                </button>
                <button onClick={handleBuyNow} className="flex-1 px-6 py-3.5 text-base inline-flex items-center justify-center gap-2 rounded-full font-black bg-slate-900 text-white shadow-xl shadow-slate-900/30 ring-2 ring-yellow-400 transition-all duration-300 hover:shadow-yellow-500/50 hover:-translate-y-0.5 hover:ring-yellow-300 active:scale-95">
                  Buy Now
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {product.videoUrl && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-14">
          <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-slate-900 shadow-md shadow-yellow-500/30"><HiPlay /></span>
            Product Video
          </h2>
          <div className="aspect-video rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/10 bg-black">
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

      {/* Related Products */}
      {related.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-14">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-slate-900 shadow-md shadow-yellow-500/30"><HiSparkles /></span>
            More Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
}
