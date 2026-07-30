import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiShoppingCart, HiLogout } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); toast.success('Logged out successfully'); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-xl shadow-lg shadow-black/20'
          : 'bg-black/60 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group relative">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300 group-hover:scale-105">
              <span className="text-white text-lg md:text-xl font-black">S</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm md:text-base font-black tracking-tight text-white drop-shadow-lg font-family-heading">
                Sri Shanmuga
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-orange-300">
                Crackers
              </span>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center rounded-full p-1 bg-white/10 backdrop-blur-md border border-white/20">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive(link.to)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'text-green-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/orders"
                  className={`px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                    isActive('/orders')
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'text-green-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Orders
                </Link>
              )}
            </div>

            {user && (
              <div className="flex items-center ml-4 rounded-full p-1 bg-white/10 backdrop-blur-md border border-white/20">
                <Link to="/cart" className="relative p-2.5 text-green-200 hover:text-white transition-colors">
                  <HiShoppingCart className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg bg-orange-500 text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-white/10">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500">
                    <span className="text-xs font-bold text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-green-100 hidden lg:block">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={handleLogout} className="p-2.5 transition-colors ml-1 text-green-500 hover:text-red-400" title="Logout">
                  <HiLogout className="text-lg" />
                </button>
              </div>
            )}

            {!user && (
              <div className="flex items-center space-x-2.5 ml-5">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 text-green-200 border border-white/30 hover:bg-white/10 hover:border-white/60"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <Link to="/cart" className="relative p-2 text-green-200">
                <HiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold bg-orange-500 text-white">{cartCount}</span>
                )}
              </Link>
            )}
            <button onClick={() => setOpen(!open)} className="p-2 text-green-200 hover:text-white transition-colors">
              {open ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t overflow-hidden bg-black/90 backdrop-blur-2xl border-white/10"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.to)
                      ? 'bg-white/20 text-white border-l-2 border-white'
                      : 'text-green-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/orders" onClick={() => setOpen(false)} className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive('/orders')
                      ? 'bg-white/20 text-white border-l-2 border-white'
                      : 'text-green-400 hover:text-white hover:bg-white/10'
                  }`}>Orders</Link>
                  <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-green-400 hover:text-white hover:bg-white/10">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500">
                      <span className="text-sm font-bold text-white">{user?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    {user?.name}
                  </Link>
                  <button onClick={() => { handleLogout(); setOpen(false); }} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all text-green-600 hover:text-red-400 hover:bg-white/10">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold transition-all text-green-400 hover:text-white hover:bg-white/10">Login</Link>
                  <div className="px-4 pt-2">
                    <Link to="/register" onClick={() => setOpen(false)} className="block w-full py-3 rounded-xl text-sm font-bold text-center shadow-lg bg-gradient-to-r from-orange-500 to-red-500 text-white">Register ✦</Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}