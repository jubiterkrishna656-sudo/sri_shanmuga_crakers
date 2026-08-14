import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiShoppingCart, HiHome, HiClipboardList, HiSearch, HiSparkles, HiTruck, HiFire } from 'react-icons/hi';
import { useCart } from '../context/CartContext';

const messages = [
  { icon: HiSparkles, text: 'Deepavali Special: Flat 20% OFF on all Gift Boxes' },
  { icon: HiTruck, text: 'Free Delivery Across Tamil Nadu on orders above Rs.2500' },
  { icon: HiFire, text: 'Premium Quality & Safety Certified Crackers' },
];

const linkBase = 'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300';
const linkActive = 'text-amber-300 bg-white/10';
const linkIdle = 'text-slate-300 hover:text-white hover:bg-white/5';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);


  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setSearch('');
  }, [location.pathname, location.search]);

  const isActive = (path) => location.pathname === path;

  const submitSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
    setSearch('');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement ticker */}
      <div className="relative h-9 md:h-10 overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 flex items-center">
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ x: { duration: 25, ease: 'linear', repeat: Infinity } }}
        >
          {[...messages, ...messages].map((m, i) => {
            const M = m.icon;
            return (
              <span key={i} className="flex items-center gap-2 px-6 md:px-8 text-[11px] md:text-xs font-bold uppercase tracking-wider text-amber-950">
                <M className="text-sm text-amber-950 shrink-0" />
                {m.text}
              </span>
            );
          })}
        </motion.div>
      </div>

      {/* Main nav */}
      <nav className={`relative bg-slate-950/95 backdrop-blur-xl transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-black/40 border-b border-white/10' : 'border-b border-white/5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                className="h-14 md:h-16 overflow-hidden rounded-xl ring-1 ring-white/10 shadow-lg shadow-black/20 group-hover:shadow-amber-500/20 transition-all duration-300"
              >
                <motion.img
                  src="/logo.png"
                  alt="Sri Shanmuga Grand Crackers"
                  className="h-full w-auto object-contain"
                  animate={{ rotate: [0, -4, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg md:text-xl font-black tracking-tight text-white">
                  Sri Shanmuga
                </span>
                <span className="text-[11px] md:text-xs font-black tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">
                  Grand Crackers
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              <Link to="/" className={`${linkBase} ${isActive('/') ? linkActive : linkIdle}`}>
                <HiHome className="text-base text-amber-400" />
                Home
              </Link>

              <Link to="/products" className={`${linkBase} ${location.pathname.startsWith('/products') ? linkActive : linkIdle}`}>
                <HiFire className="text-base text-amber-400" />
                Products
              </Link>

              <Link to="/orders" className={`${linkBase} ${isActive('/orders') ? linkActive : linkIdle}`}>
                <HiClipboardList className="text-base text-amber-400" />
                Orders
              </Link>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-1.5">
              <motion.div
                animate={{ width: searchOpen ? 220 : 0, opacity: searchOpen ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <form onSubmit={submitSearch} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 focus-within:border-amber-400/60 transition-colors">
                  <HiSearch className="text-amber-400 shrink-0" />
                  <input
                    autoFocus={searchOpen}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search crackers..."
                    className="bg-transparent w-full py-2 text-sm text-white placeholder-slate-500 outline-none"
                  />
                  {search && (
                    <button type="button" onClick={() => setSearch('')} className="text-slate-500 hover:text-white">
                      <HiX className="text-sm" />
                    </button>
                  )}
                </form>
              </motion.div>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2.5 rounded-full transition-all ${searchOpen ? 'text-amber-300 bg-white/10' : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'}`}
                title="Search"
              >
                <HiSearch className="text-xl" />
              </button>

              <Link to="/cart" className="relative p-2.5 rounded-full text-slate-300 hover:text-amber-300 hover:bg-white/5 transition-all" title="Cart">
                <HiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md shadow-amber-500/40">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-1">
              <Link to="/cart" className="relative p-2 text-slate-300">
                <HiShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setOpen(!open)}
                className={`p-2 rounded-2xl transition-all ${open ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30' : 'text-slate-300 hover:bg-white/5'}`}
              >
                {open ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-slate-950/98 backdrop-blur-xl border-t border-white/10 shadow-2xl"
          >
            <div className="px-4 py-5 space-y-2">
              <form onSubmit={submitSearch} className="flex items-center gap-2 bg-white rounded-2xl px-3 mb-2 border-2 border-transparent focus-within:border-amber-400 shadow-lg shadow-amber-500/10 transition-colors">
                <HiSearch className="text-amber-600 text-lg shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search crackers..."
                  className="bg-transparent w-full py-3 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none"
                />
              </form>

              <Link
                to="/"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-black tracking-wide transition-all ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 ring-2 ring-white/70 shadow-lg shadow-amber-500/40'
                    : 'bg-gradient-to-r from-amber-400/90 to-orange-500/90 text-white ring-1 ring-amber-300/50 shadow-md shadow-amber-500/25'
                }`}
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive('/') ? 'bg-slate-950/10 text-slate-950' : 'bg-white/25 text-white'}`}>
                  <HiHome className="text-xl" />
                </span>
                Home
              </Link>

              <Link
                to="/products"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-black tracking-wide transition-all ${
                  location.pathname.startsWith('/products')
                    ? 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 text-white ring-2 ring-white/70 shadow-lg shadow-orange-500/40'
                    : 'bg-gradient-to-r from-orange-400/90 to-red-500/90 text-white ring-1 ring-orange-300/50 shadow-md shadow-orange-500/25'
                }`}
              >
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/25 text-white">
                  <HiFire className="text-xl" />
                </span>
                Products
              </Link>

              <Link
                to="/orders"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-black tracking-wide transition-all ${
                  isActive('/orders')
                    ? 'bg-gradient-to-r from-violet-400 to-indigo-500 text-white ring-2 ring-white/70 shadow-lg shadow-violet-500/40'
                    : 'bg-gradient-to-r from-violet-400/90 to-indigo-500/90 text-white ring-1 ring-violet-300/50 shadow-md shadow-violet-500/25'
                }`}
              >
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/25 text-white">
                  <HiClipboardList className="text-xl" />
                </span>
                Track Order
              </Link>

              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-black tracking-wide transition-all ${
                  isActive('/cart')
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 ring-2 ring-white/70 shadow-lg shadow-amber-500/40'
                    : 'bg-gradient-to-r from-yellow-400/90 to-amber-500/90 text-white ring-1 ring-amber-300/50 shadow-md shadow-amber-500/25'
                }`}
              >
                <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/25 text-white">
                  <HiShoppingCart className="text-xl" />
                </span>
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto text-xs font-bold bg-white/25 px-2 py-0.5 rounded-full">{cartCount}</span>
                )}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
