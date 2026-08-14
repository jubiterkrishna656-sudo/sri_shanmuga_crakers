import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiChevronLeft, HiChevronRight, HiFire, HiSparkles } from 'react-icons/hi';
import { productAPI } from '../utils/api';
import { categories } from '../utils/categories';
import { FREE_SHIPPING_THRESHOLD } from '../utils/constants';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';

const slides = [
  {
    tag: '🎆 Diwali Special 2025',
    title: ['Light Up Your', 'Festival'],
    desc: 'Premium quality crackers from Sri Shanmuga Grand Crackers. Safe, vibrant, and affordable fireworks for every celebration.',
    cta: 'Shop Now', ctaLink: '/products',
    cta2: 'Gift Boxes', cta2Link: '/products?category=Gift%20Boxes',
    gradient: 'from-violet-700 via-purple-700 to-fuchsia-600',
    glow: 'bg-violet-400/30',
    icon: '🎆',
    image: '/logo.png',
    badge: 'Premium Quality since 2026'
  },
  {
    tag: '⚡ Mega Diwali Sale',
    title: ['Up to 40% OFF', 'on All Crackers'],
    desc: 'Limited period festival offers. Stock up on your favorites and save big this Diwali season!',
    cta: 'View Deals', ctaLink: '/products',
    cta2: 'Combo Packs', cta2Link: '/products?category=Combo%20Packs',
    gradient: 'from-rose-700 via-red-700 to-orange-600',
    glow: 'bg-rose-400/30',
    icon: '💥',
    image: null,
    badge: 'Limited Time Offer'
  },
  {
    tag: '✨ New Arrivals',
    title: ['Discover Our', 'New Collection'],
    desc: 'Brand new sparklers and crackers added. Explore the latest arrivals with exciting new designs!',
    cta: 'Explore', ctaLink: '/products',
    cta2: 'Kids Crackers', cta2Link: '/products?category=Kids%20Crackers',
    gradient: 'from-emerald-700 via-teal-700 to-cyan-600',
    glow: 'bg-emerald-400/30',
    icon: '🎇',
    image: null,
    badge: 'Just Launched'
  }
];

const features = [
  { icon: '🚚', title: 'Free Shipping', desc: `On orders above ₹${FREE_SHIPPING_THRESHOLD}`, color: 'from-sky-400 to-blue-500' },
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
  const distance = 50 + Math.random() * 190;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance - 60;
  const color = crackerColors[index % crackerColors.length];

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color, boxShadow: `0 0 ${4 + Math.random() * 6}px ${color}, 0 0 16px ${color}` }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: [0, x, x * 0.7],
        y: [0, y, y * 0.9 + 10],
        opacity: [0, 1, 0.6, 0],
        scale: [0, 1.8 + Math.random(), 0.2]
      }}
      transition={{
        duration: 1.2 + Math.random() * 0.8,
        repeat: Infinity,
        repeatDelay: 0.4 + Math.random() * 1.6,
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
        const d = 50 + Math.random() * 40;
        const x2 = Math.cos((a * Math.PI) / 180) * d;
        const y2 = Math.sin((a * Math.PI) / 180) * d;
        return (
          <motion.div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}, 0 0 20px ${color}` }}
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

function SkyRocket({ index }) {
  const left = 5 + Math.random() * 90;
  const delay = Math.random() * 7;
  const duration = 2.4 + Math.random() * 1.4;
  const color = crackerColors[index % crackerColors.length];
  const rise = (typeof window !== 'undefined' ? window.innerHeight : 800) * 1.15;
  const drift = (Math.random() - 0.5) * 50;

  return (
    <motion.div
      className="absolute"
      style={{ left: `${left}%`, bottom: '-6%' }}
      animate={{
        y: [0, -rise, -rise],
        x: [0, drift, drift * 1.2],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ duration, repeat: Infinity, delay, ease: 'easeIn' }}
    >
      <div className="relative flex items-end justify-center">
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[3px] h-10 rounded-full"
          style={{ background: `linear-gradient(to top, transparent 0%, ${color} 100%)`, boxShadow: `0 0 10px ${color}` }} />
        <span className="relative w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 14px 4px ${color}` }} />
      </div>
    </motion.div>
  );
}

function GroundFountain({ index }) {
  const left = 8 + Math.random() * 84;
  const delay = Math.random() * 5;
  const color = crackerColors[index % crackerColors.length];

  return (
    <motion.div className="absolute" style={{ left: `${left}%`, bottom: '2%' }}>
      <motion.div
        className="relative mx-auto"
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
        transition={{ duration: 2.5, repeat: Infinity, delay, ease: 'easeInOut' }}
      >
        <span className="block w-2 h-6 rounded-full" style={{ background: color, boxShadow: `0 0 12px 2px ${color}` }} />
        {[...Array(10)].map((_, i) => {
          const spread = (i / 9 - 0.5) * 80;
          const height = 30 + Math.random() * 40;
          return (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ backgroundColor: color, left: '50%', bottom: 22, boxShadow: `0 0 6px ${color}` }}
              animate={{
                x: [0, spread, spread * 1.4],
                y: [0, -height * 0.6, -height],
                opacity: [1, 0.8, 0],
              }}
              transition={{ duration: 1.4 + Math.random() * 0.6, repeat: Infinity, delay: delay + Math.random() * 0.5, ease: 'easeOut' }}
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    productAPI.getAll({ page: 1, limit: 12 }).then(res => {
      setProducts(res.data.products || res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  const bestSellers = products.slice(0, 8);
  const slide = slides[currentSlide];
  const go = (dir) => setCurrentSlide(prev => (prev + dir + slides.length) % slides.length);

  return (
    <div className="overflow-hidden">
      <Seo />
      {/* ──────── HERO SLIDER ──────── */}
      <section
        className={`relative bg-gradient-to-br ${slide.gradient} min-h-[88vh] flex items-center overflow-hidden`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute inset-0 opacity-25">
          <div className={`absolute top-10 left-10 w-80 h-80 ${slide.glow} rounded-full blur-[120px]`} />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300/30 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-white/20 rounded-full blur-[90px]" />
        </div>

        {/* Firework particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(45)].map((_, i) => <FirecrackerBurst key={`burst-${i}`} index={i} />)}
          {[...Array(14)].map((_, i) => <TrailSpark key={`trail-${i}`} index={i} />)}
          {[...Array(35)].map((_, i) => <SparkleParticle key={`sparkle-${i}`} index={i} />)}
          {[...Array(5)].map((_, i) => <BigBloom key={`bloom-${i}`} index={i} />)}
          {[...Array(8)].map((_, i) => <SkyRocket key={`rocket-${i}`} index={i} />)}
          {[...Array(5)].map((_, i) => <GroundFountain key={`fountain-${i}`} index={i} />)}
        </div>

        {/* Slide arrows */}
        <button
          onClick={() => go(-1)}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white transition-all"
        >
          <HiChevronLeft className="text-xl md:text-2xl" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white transition-all"
        >
          <HiChevronRight className="text-xl md:text-2xl" />
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div key={currentSlide} initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}>
              <motion.span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-sm font-semibold mb-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {slide.tag}
              </motion.span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6 drop-shadow-2xl">
                {slide.title[0]}<br />
                <span className="bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">
                  {slide.title[1]}
                </span>
              </h1>
              <p className="text-white/85 text-base md:text-xl mb-8 leading-relaxed max-w-lg">
                {slide.desc}
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link to={slide.ctaLink} className="group inline-flex items-center gap-2 bg-white text-gray-900 px-7 md:px-8 py-3.5 rounded-full font-bold text-base md:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <span>{slide.cta}</span>
                  <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to={slide.cta2Link} className="inline-flex items-center gap-2 border-2 border-white/40 bg-white/10 backdrop-blur-md text-white px-7 md:px-8 py-3.5 rounded-full font-semibold text-base md:text-lg hover:bg-white/20 hover:border-white/60 transition-all duration-300">
                  {slide.cta2}
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
                <div className={`w-80 h-80 lg:w-[28rem] lg:h-[28rem] ${slide.glow} rounded-full blur-[90px] absolute -top-10 -left-10`} />
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-[40px] p-5 md:p-8 border border-white/25 text-center shadow-2xl overflow-hidden">
                  {slide.image ? (
                    <motion.img
                      src={slide.image}
                      alt={slide.badge}
                      className="max-w-full max-h-64 lg:max-h-[22rem] object-contain mx-auto drop-shadow-2xl"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  ) : (
                    <motion.span
                      className="text-8xl md:text-9xl block"
                      animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >{slide.icon}</motion.span>
                  )}
                  <p className="text-white font-bold text-lg md:text-xl mt-6">{slide.badge}</p>
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

      {/* ──────── TICKER ──────── */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-2.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-[fadeSlide_1s_ease] justify-center gap-10 text-white text-sm font-semibold">
          {['🔥 Up to 40% OFF on all crackers', '🚚 Free shipping above ₹500', '🛡️ Certified & 100% safe products', '🎁 Exciting combo packs', '📍 Sivakasi, Tamil Nadu'].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2">{t}</span>
          ))}
        </div>
      </div>

      {/* ──────── CATEGORIES ──────── */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-white to-orange-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="text-center mb-10">
            <span className="section-badge mb-3">Categories</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">
              Shop by <span className="text-gradient">Category</span>
            </h2>
            <p className="text-orange-500 mt-3 text-base md:text-lg">Find the perfect crackers for your celebration</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to={`/products?category=${cat.name}`} className="block group">
                  <motion.div
                    whileHover={{ y: -6, scale: 1.04 }}
                    className={`bg-gradient-to-br ${cat.color} rounded-3xl p-5 text-center shadow-lg ${cat.shadow} hover:shadow-2xl transition-all duration-300`}
                  >
                    <motion.div className="text-4xl mb-2 block" animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}>
                      {cat.emoji}
                    </motion.div>
                    <p className="text-white font-bold text-sm drop-shadow">{cat.name}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── SALE BANNER ──────── */}
      <section className="relative py-14 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-600 to-red-600" />
        <div className="absolute inset-0 opacity-15" style={{ background: 'radial-gradient(circle at 30% 50%, white 0%, transparent 50%), radial-gradient(circle at 70% 50%, white 0%, transparent 50%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <motion.span className="text-6xl block mb-4" animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              ⚡
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">Diwali Mega Sale!</h2>
            <p className="text-pink-100 text-xl md:text-2xl mb-8 font-light">
              Up to <span className="font-black text-yellow-300">40% OFF</span> on all premium crackers. Limited period offer!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/products" className="inline-flex items-center gap-2 bg-yellow-400 text-purple-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 shadow-2xl shadow-yellow-400/40 transition-all duration-300">
                <HiFire className="text-xl" />
                Grab the Deal
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ──────── BEST SELLERS ──────── */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-orange-50/60 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
          >
            <div>
              <span className="section-badge mb-2">Best Sellers</span>
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2">
                Most <span className="text-gradient">Popular</span>
              </h2>
              <p className="text-orange-500 mt-2 text-base md:text-lg">Top-rated crackers this season</p>
            </div>
            <Link to="/products" className="group inline-flex items-center gap-1 text-orange-500 font-bold hover:text-orange-600 transition-colors">
              <span>View All</span>
              <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map(i => <div key={i} className="card h-80 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {bestSellers.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ──────── FEATURES ──────── */}
      <section className="py-14 md:py-16 bg-gradient-to-br from-[#1a0b2e] via-[#2b0a3d] to-[#4a0d2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="chip bg-orange-500/15 text-orange-400 border border-orange-500/20 px-4 py-1.5 mb-3">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2">
              We <span className="text-gradient">Promise</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 text-center border border-white/10 hover:border-orange-500/40 transition-all duration-300"
              >
                <motion.div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl shadow-lg`} animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}>
                  {f.icon}
                </motion.div>
                <h3 className="font-bold text-white text-lg mb-1">{f.title}</h3>
                <p className="text-white/50 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="relative py-14 md:py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 50% 50%, white 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">Ready to Light Up Your Festival?</h2>
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
