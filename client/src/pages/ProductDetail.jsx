import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiShoppingCart, HiStar, HiMinus, HiPlus, HiArrowLeft, HiSparkles, HiShieldCheck, HiTruck, HiPlay } from 'react-icons/hi';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    productAPI.getById(id).then(res => {
      setProduct(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) { navigate('/register'); return; }
    addToCart(product._id, quantity);
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/register'); return; }
    try {
      await addToCart(product._id, quantity);
      navigate('/checkout');
    } catch {
      // error handled in addToCart
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16"><div className="animate-pulse bg-white rounded-2xl h-96"></div></div>;
  if (!product) return <div className="text-center py-20"><h2 className="text-2xl font-bold text-green-500">Product not found</h2></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-6"><HiArrowLeft className="mr-1" /> Back to Products</Link>
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px] relative">
          {product.image ? (
            <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
          ) : product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <HiSparkles className="text-8xl text-orange-300" />
          )}
          {product.discountPrice > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-lg">{Math.round((1 - product.discountPrice/product.price) * 100)}% OFF</span>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-orange-500 font-medium mb-2">{product.category}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">{product.name}</h1>
          <div className="flex items-center space-x-1 mb-4">
            {[1,2,3,4,5].map(s => <HiStar key={s} className="text-yellow-400 text-xl" />)}
            <span className="text-green-500 ml-2">(4.5 stars)</span>
          </div>
          <div className="flex items-baseline space-x-3 mb-4">
            {product.discountPrice > 0 ? (
              <>
                <span className="text-4xl font-bold text-orange-500">₹{product.discountPrice}</span>
                <span className="text-2xl text-green-400 line-through">₹{product.price}</span>
                <span className="text-green-600 font-semibold">You save ₹{product.price - product.discountPrice}</span>
              </>
            ) : (
              <span className="text-4xl font-bold text-orange-500">₹{product.price}</span>
            )}
          </div>
          <p className="text-green-600 mb-6 leading-relaxed">{product.description || 'Premium quality crackers from Shanmuga Crackers. Safe and certified products for your celebrations.'}</p>

          <div className="flex items-center space-x-2 mb-4">
            {product.stock > 0 ? (
              <span className="flex items-center text-green-600 text-sm"><HiShieldCheck className="mr-1" /> In Stock ({product.stock} units)</span>
            ) : (
              <span className="text-red-500 text-sm">Out of Stock</span>
            )}
            <span className="flex items-center text-green-500 text-sm"><HiTruck className="mr-1" /> Free Delivery</span>
          </div>

          {product.stock > 0 && (
            <>
              <div className="flex items-center space-x-4 mb-6">
                <span className="font-semibold text-green-700">Quantity:</span>
                <div className="flex items-center border border-green-300 rounded-full">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-orange-50 rounded-l-full"><HiMinus /></button>
                  <span className="px-6 font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-2 hover:bg-orange-50 rounded-r-full"><HiPlus /></button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleAddToCart} className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition flex items-center justify-center space-x-2">
                  <HiShoppingCart /><span>Add to Cart</span>
                </button>
                <button onClick={handleBuyNow} className="flex-1 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition">
                  Buy Now
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {product.videoUrl && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
          <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
            <HiPlay className="text-orange-500 mr-2" /> Product Video
          </h2>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
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
    </div>
  );
}
