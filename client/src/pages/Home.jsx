import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles, HiStar, HiShoppingCart, HiArrowRight, HiFire, HiShieldCheck, HiTruck, HiBadgeCheck } from 'react-icons/hi';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const slides = [
  {
    tag: '🎆 Diwali Special 2025',
    title: ['Light Up Your', 'Festival'],
    desc: 'Premium quality crackers from Sri Shanmuga Crackers. Safe, vibrant, and affordable fireworks for every celebration.',
    cta: 'Shop Now', ctaLink: '/products',
    cta2: 'Gift Boxes', cta2Link: '/products?category=Gift%20Boxes',
    gradient: 'from-violet-600 via-purple-600 to-pink-600',
    bgImage: null,
    icon: '🎆',
    badge: 'Premium Quality since 2026'
  },
  {
    tag: '⚡ Mega Diwali Sale',
    title: ['Up to 40% OFF', 'on All Crackers'],
    desc: 'Limited period festival offers. Stock up on your favorites and save big this Diwali season!',
    cta: 'View Deals', ctaLink: '/products',
    cta2: 'Combo Packs', cta2Link: '/products?category=Combo%20Packs',
    gradient: 'from-rose-600 via-red-600 to-orange-600',
    bgImage: null,
    icon: '💥',
    badge: 'Limited Time Offer'
  },
  {
    tag: '✨ New Arrivals',
    title: ['Discover Our', 'New Collection'],
    desc: 'Brand new sparklers and crackers added. Explore the latest arrivals with exciting new designs!',
    cta: 'Explore', ctaLink: '/products',
    cta2: 'Kids Crackers', cta2Link: '/products?category=Kids%20Crackers',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    bgImage: null,
    icon: '🎇',
    badge: 'Just Launched'
  }
];

const categories = [
  { name: 'Sparklers', emoji: '🎆', color: 'from-yellow-400 to-orange-500', shadow: 'shadow-yellow-500/30' },
  { name: 'Flower Pots', emoji: '🎇', color: 'from-pink-400 to-rose-500', shadow: 'shadow-pink-500/30' },
  { name: 'Rockets', emoji: '🚀', color: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-500/30' },
  { name: 'Bombs', emoji: '💥', color: 'from-red-500 to-rose-600', shadow: 'shadow-red-500/30' },
  { name: 'Gift Boxes', emoji: '🎁', color: 'from-green-400 to-emerald-500', shadow: 'shadow-green-500/30' },
  { name: 'Kids Crackers', emoji: '🧨', color: 'from-cyan-400 to-sky-500', shadow: 'shadow-cyan-500/30' },
  { name: 'Combo Packs', emoji: '📦', color: 'from-purple-400 to-violet-500', shadow: 'shadow-purple-500/30' }
];

const features = [
  { icon: '🚚', title: 'Free Shipping', desc: 'On orders above ₹500', color: 'from-sky-400 to-blue-500' },
  { icon: '🛡️', title: '100% Safe', desc: 'Certified quality products', color: 'from-green-400 to-emerald-500' },
  { icon: '💰', title: 'Best Price', desc: 'Factory direct prices', color: 'from-yellow-400 to-orange-500' },
  { icon: '🎉', title: 'Festive Offers', desc: 'Exciting deals & combos', color: 'from-pink-400 to-rose-500' }
];

const floatAnim = {
  initial: { y: 0 },
  animate: { y: [-10, 10, -10], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }
};

const crackerColors = ['#ff6b35', '#ffd700', '#ff4500', '#ff8c00', '#ffdd57', '#ff3333', '#ffaa00', '#ff6347', '#ffa500', '#ffd700'];

function FirecrackerBurst({ index }) {
  const angle = (index * 137.5) % 360;
  const distance = 40 + Math.random() * 160;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance - 50;
  const color = crackerColors[index % crackerColors.length];

  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: color, boxShadow: `0 0 ${2 + Math.random() * 4}px ${color}` }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: [0, x, x * 0.7],
        y: [0, y, y * 0.9 + 10],
        opacity: [0, 1, 0.6, 0],
        scale: [0, 1.5 + Math.random(), 0.2]
      }}
      transition={{
        duration: 1.2 + Math.random() * 0.8,
        repeat: Infinity,
        repeatDelay: 0.5 + Math.random() * 2,
        delay: Math.random() * 3,
        ease: 'easeOut'
      }}
    />
  );
}

function TrailSpark({ index }) {
  const startX = Math.random() * 100;
  const startY = 80 + Math.random() * 20;
  const endX = startX + (Math.random() - 0.5) * 50;
  const endY = startY - 50 - Math.random() * 40;
  const color = crackerColors[index % crackerColors.length];

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{
        backgroundColor: color,
        left: `${startX}%`,
        top: `${startY}%`,
        boxShadow: `0 0 6px ${color}, 0 0 12px ${color}`
      }}
      animate={{
        x: [0, endX * 0.6, endX],
        y: [0, endY * 0.6, endY],
        opacity: [0.6, 1, 0],
        scale: [0.5, 1.5, 0]
      }}
      transition={{
        duration: 1.5 + Math.random() * 1.5,
        repeat: Infinity,
        delay: Math.random() * 4,
        ease: 'easeOut'
      }}
    />
  );
}

function SparkleParticle({ index }) {
  const xPos = 5 + Math.random() * 90;
  const yPos = 10 + Math.random() * 80;
  const size = 2 + Math.random() * 4;
  const color = crackerColors[index % crackerColors.length];

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        left: `${xPos}%`,
        top: `${yPos}%`,
        boxShadow: `0 0 ${size * 3}px ${color}`
      }}
      animate={{
        opacity: [0, 1, 0.3, 0.8, 0],
        scale: [0, 1.2, 0.5, 0.8, 0],
      }}
      transition={{
        duration: 1 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: 'easeInOut'
      }}
    />
  );
}

function BigBloom({ index }) {
  const cx = 20 + Math.random() * 60;
  const cy = 20 + Math.random() * 50;
  const color = crackerColors[index % crackerColors.length];

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${cx}%`, top: `${cy}%` }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0.8, 0],
        scale: [0, 1, 1.5, 2],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        repeatDelay: 3 + Math.random() * 5,
        delay: Math.random() * 10,
        ease: 'easeOut'
      }}
    >
      {[...Array(16)].map((_, i) => {
        const a = (i / 16) * 360;
        const d = 40 + Math.random() * 30;
        const x2 = Math.cos((a * Math.PI) / 180) * d;
        const y2 = Math.sin((a * Math.PI) / 180) * d;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: [0, x2, x2 * 0.5],
              y: [0, y2, y2 * 0.5 + 10],
              opacity: [1, 0.8, 0],
              scale: [1, 0.3],
            }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
              repeat: Infinity,
              repeatDelay: 3 + Math.random() * 5,
              delay: 0,
            }}
          />
        );
      })}
    </motion.div>
  );
}

function GoldRain({ index }) {
  const x = Math.random() * 100;
  const delay = Math.random() * 8;
  const size = 1 + Math.random() * 2;
  return (
    <motion.div
      className="absolute w-1 h-2 rounded-full"
      style={{
        left: `${x}%`,
        top: '-2%',
        width: size,
        height: size * 3,
        backgroundColor: ['#ffd700', '#ffaa00', '#ffdd57', '#ff8c00'][index % 4],
        boxShadow: `0 0 ${size * 4}px ${['#ffd700', '#ffaa00', '#ffdd57', '#ff8c00'][index % 4]}`
      }}
      animate={{
        y: ['0vh', '100vh'],
        opacity: [0, 1, 0.8, 1, 0],
        x: [0, (Math.random() - 0.5) * 20],
      }}
      transition={{
        duration: 3 + Math.random() * 4,
        repeat: Infinity,
        delay,
        ease: 'linear'
      }}
    />
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getAll().then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const bestSellers = products.slice(0, 8);

  const handleAdd = (id) => {
    if (!user) { navigate('/register'); return; }
    addToCart(id);
  };

  return (
    <div className="overflow-hidden">
      {/* ──────── HERO SLIDER ──────── */}
      <section className={`relative bg-gradient-to-br ${slides[currentSlide].gradient} min-h-[85vh] flex items-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-pink-300 rounded-full blur-[80px]" />
        </div>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 text-6xl"
            style={{ top: `${15 + i * 15}%`, left: `${5 + i * 15}%` }}
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}
          >✦</motion.div>
        ))}
        {/* Firecracker burst particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <FirecrackerBurst key={`burst-${i}`} index={i} />
          ))}
          {[...Array(20)].map((_, i) => (
            <TrailSpark key={`trail-${i}`} index={i} />
          ))}
          {[...Array(30)].map((_, i) => (
            <SparkleParticle key={`sparkle-${i}`} index={i} />
          ))}
          {[...Array(4)].map((_, i) => (
            <BigBloom key={`bloom-${i}`} index={i} />
          ))}
          {[...Array(15)].map((_, i) => (
            <GoldRain key={`rain-${i}`} index={i} />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div key={currentSlide} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
              <motion.span
                className="inline-block px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {slides[currentSlide].tag}
              </motion.span>
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                {slides[currentSlide].title[0]}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  {slides[currentSlide].title[1]}
                </span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed max-w-lg">
                {slides[currentSlide].desc}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={slides[currentSlide].ctaLink} className="group inline-flex items-center gap-2 bg-white text-green-900 px-8 py-3.5 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <span>{slides[currentSlide].cta}</span>
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to={slides[currentSlide].cta2Link} className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-semibold text-lg hover:bg-white/10 hover:border-white/60 transition-all duration-300">
                  {slides[currentSlide].cta2}
                </Link>
              </div>
            </motion.div>
            <motion.div
              key={`img-${currentSlide}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="hidden md:flex justify-center"
            >
              <motion.div className="relative" {...floatAnim}>
                <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-yellow-300/30 to-orange-400/30 rounded-full blur-[80px] absolute -top-10 -left-10" />
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-[40px] p-10 border border-white/20 text-center shadow-2xl">
                  <motion.span
                    className="text-8xl md:text-9xl block"
                    animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >{slides[currentSlide].icon}</motion.span>
                  <p className="text-white font-bold text-xl mt-6">{slides[currentSlide].badge}</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }} className="text-yellow-300 text-lg">★</motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`h-3 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-10 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </section>

      {/* ──────── CATEGORIES ──────── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-12"
          >
            <span className="inline-block text-sm font-bold text-orange-500 tracking-[3px] uppercase mb-2">Categories</span>
            <h2 className="text-4xl md:text-5xl font-bold text-green-900">
              Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Category</span>
            </h2>
            <p className="text-green-500 mt-3 text-lg">Find the perfect crackers for your celebration</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={`/products?category=${cat.name}`} className="block group">
                  <motion.div
                    whileHover={{ y: -6, scale: 1.03 }}
                    className={`bg-gradient-to-br ${cat.color} rounded-2xl p-5 text-center shadow-lg ${cat.shadow} hover:shadow-xl transition-all duration-300`}
                  >
                    <motion.div
                      className="text-4xl mb-2 block"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    >{cat.emoji}</motion.div>
                    <p className="text-white font-bold text-sm">{cat.name}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── SALE BANNER ──────── */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-600 to-red-600" />
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{ background: 'radial-gradient(circle at 30% 50%, white 0%, transparent 50%), radial-gradient(circle at 70% 50%, white 0%, transparent 50%)', backgroundSize: '200% 200%' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="text-6xl block mb-4"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >⚡</motion.span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-3">Diwali Mega Sale!</h2>
            <p className="text-pink-200 text-xl md:text-2xl mb-8 font-light">Up to <span className="font-bold text-yellow-300">40% OFF</span> on all premium crackers. Limited period offer!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/products" className="inline-flex items-center gap-2 bg-yellow-400 text-purple-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 shadow-2xl shadow-yellow-400/30 transition-all duration-300">
                <HiFire className="text-xl" />
                Grab the Deal
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ──────── BEST SELLERS ──────── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-orange-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
          >
            <div>
              <span className="text-sm font-bold text-orange-500 tracking-[3px] uppercase">Best Sellers</span>
              <h2 className="text-4xl md:text-5xl font-bold text-green-900 mt-1">
                Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Popular</span>
              </h2>
              <p className="text-green-500 mt-2 text-lg">Top-rated crackers this season</p>
            </div>
            <Link to="/products" className="group inline-flex items-center gap-1 text-orange-500 font-semibold hover:text-orange-600 transition-colors">
              <span>View All</span>
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="bg-white/80 rounded-3xl h-80 animate-pulse shadow-sm" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {bestSellers.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <Link to={`/products/${product._id}`}>
                    <div className="relative h-48 bg-gradient-to-br from-orange-100 via-yellow-50 to-red-50 flex items-center justify-center overflow-hidden">
                      {product.image || product.imageUrl ? (
                        <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        >
                          <HiSparkles className="text-6xl text-orange-300" />
                        </motion.div>
                      )}
                      {product.discountPrice > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring' }}
                          className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg"
                        >
                          {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                        </motion.span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <p className="text-xs text-orange-500 font-semibold mb-1 tracking-wide">{product.category}</p>
                    <Link to={`/products/${product._id}`}>
                      <h3 className="font-bold text-green-800 mb-2 truncate group-hover:text-orange-500 transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, s) => <HiStar key={s} className="text-yellow-400 text-xs" />)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.discountPrice > 0 ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-orange-500 font-bold text-lg">₹{product.discountPrice}</span>
                            <span className="text-green-400 text-sm line-through">₹{product.price}</span>
                          </div>
                        ) : (
                          <span className="text-orange-500 font-bold text-lg">₹{product.price}</span>
                        )}
                      </div>
                      <motion.button
                        onClick={() => handleAdd(product._id)}
                        disabled={product.stock <= 0}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2.5 rounded-full transition-all duration-300 ${
                          product.stock > 0
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
                            : 'bg-green-100 text-green-400 cursor-not-allowed'
                        }`}
                      >
                        <HiShoppingCart className="text-lg" />
                      </motion.button>
                    </div>
                    {product.stock <= 0 && <p className="text-red-500 text-xs mt-2 font-medium">Out of stock</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ──────── FEATURES ──────── */}
      <section className="py-16 bg-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-bold text-orange-400 tracking-[3px] uppercase">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">
              We <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">Promise</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-green-800/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-green-700/50 hover:border-orange-500/30 transition-all duration-300"
              >
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl shadow-lg`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                >
                  {f.icon}
                </motion.div>
                <h3 className="font-bold text-white text-lg mb-1">{f.title}</h3>
                <p className="text-green-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="relative py-16 md:py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          style={{ background: 'radial-gradient(circle at 50% 50%, white 0%, transparent 60%)', backgroundSize: '200% 200%' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Ready to Light Up Your Festival?</h2>
            <p className="text-orange-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">Browse our collection of premium crackers and sparklers. Safe delivery across India.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/products" className="inline-flex items-center gap-2 bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300">
                <HiSparkles />
                Start Shopping
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}