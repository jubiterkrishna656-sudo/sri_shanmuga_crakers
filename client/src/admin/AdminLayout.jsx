import { useState, useEffect, useRef, useCallback } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiHome, HiCube, HiShoppingBag, HiBell, HiDocumentReport, HiExternalLink, HiClock, HiLogout } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../utils/adminApi';

const sidebarLinks = [
  { to: '/admin', icon: HiHome, label: 'Dashboard' },
  { to: '/admin/products', icon: HiCube, label: 'Products' },
  { to: '/admin/orders', icon: HiShoppingBag, label: 'Orders' },
  { to: '/admin/reports', icon: HiDocumentReport, label: 'Reports' },
];

const particles = [...Array(24)].map((_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 300,
  y: (Math.random() - 0.5) * 300,
  size: 4 + Math.random() * 8,
  color: ['from-amber-400 to-orange-500', 'from-emerald-400 to-teal-500', 'from-violet-400 to-purple-500', 'from-sky-400 to-blue-500', 'from-rose-400 to-pink-500', 'from-yellow-400 to-amber-500'][i % 6],
  delay: Math.random() * 0.5,
}));

function CrackersBurst({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ delay: 0.3 + p.delay, duration: 1.2, ease: 'easeOut' }}
          className={`absolute w-${Math.round(p.size / 4) * 2} h-${Math.round(p.size / 4) * 2} bg-gradient-to-br ${p.color} rounded-full shadow-lg`}
          style={{ width: p.size, height: p.size }}
        />
      ))}

      {/* Firework streaks */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * 360;
        const dist = 120 + Math.random() * 80;
        return (
          <motion.div
            key={`streak-${i}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * dist,
              y: Math.sin((angle * Math.PI) / 180) * dist,
              opacity: 0,
              scale: 0,
            }}
            transition={{ delay: 0.5 + Math.random() * 0.3, duration: 0.8, ease: 'easeOut' }}
            className="absolute w-1.5 h-1.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full"
          />
        );
      })}

      {/* Sparkles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: 360 }}
          transition={{ delay: 0.8 + i * 0.15, duration: 1.2, ease: 'easeOut' }}
          className="absolute text-yellow-400 text-lg"
          style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}
        >
          ✦
        </motion.div>
      ))}

      {/* Main text */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 200 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6"
        >
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-6">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-amber-400/30 via-orange-500/20 to-yellow-400/30 blur-xl animate-pulse" />
            <motion.div
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="relative w-full h-full rounded-[2.5rem] bg-white p-3 shadow-2xl shadow-black/40 ring-4 ring-amber-400/70 overflow-hidden"
            >
              <img src="/logo.png" alt="Sri Shanmuga Grand Crackers" className="w-full h-full object-contain rounded-[1.5rem]" />
            </motion.div>
          </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Sri Shanmuga
        </h1>
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mt-1">
          Grand Crackers
        </h2>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mx-auto mt-5 rounded-full"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="text-slate-500 text-sm mt-4 tracking-widest uppercase"
        >
          Premium Quality Crackers
        </motion.p>

        {/* Burst crackers along bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="flex items-center justify-center gap-4 mt-8"
        >
          {['🧨', '🎆', '🎇', '✨', '🎊'].map((emoji, i) => (
            <motion.span
              key={emoji}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{ delay: 1.8 + i * 0.15, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              className="text-2xl"
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 text-xs text-slate-700 tracking-widest uppercase"
      >
        Loading Dashboard...
      </motion.p>
    </motion.div>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const notifRef = useRef(null);
  const { adminUser, loading, adminLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  useEffect(() => {
    if (!loading && (!adminUser || adminUser.role !== 'admin')) {
      navigate('/admin/login', { replace: true });
    }
  }, [adminUser, loading, navigate]);

  useEffect(() => {
    if (!loading && adminUser?.role === 'admin') {
      const justLoggedIn = sessionStorage.getItem('admin_splash_login') === '1';
      const firstVisit = !sessionStorage.getItem('admin_splash_done');
      if (justLoggedIn || firstVisit) {
        sessionStorage.removeItem('admin_splash_login');
        sessionStorage.setItem('admin_splash_done', '1');
        setShowSplash(true);
      }
    }
  }, [loading, adminUser]);

  useEffect(() => {
    const fetchPending = () => {
      if (document.hidden) return;
      adminApi.getDashboard().then(res => {
        setPendingCount(res.data.pendingOrders || 0);
      }).catch(() => {});
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const pageMap = {
    dashboard: { color: 'from-emerald-400 to-teal-500' },
    products: { color: 'from-sky-400 to-blue-500' },
    orders: { color: 'from-violet-400 to-purple-500' },
    reports: { color: 'from-cyan-400 to-teal-500' },
  };
  const pageKey = Object.keys(pageMap).find(k => k === 'dashboard' ? location.pathname === '/admin' : location.pathname.includes(k)) || 'dashboard';
  const pageColor = pageMap[pageKey].color;
  const pageName = pageKey.charAt(0).toUpperCase() + pageKey.slice(1);

  if (loading) return null;
  if (!adminUser || adminUser.role !== 'admin') return null;

  return (
    <>
      {/* Splash screen */}
      <AnimatePresence>
        {showSplash && <CrackersBurst onDone={handleSplashDone} />}
      </AnimatePresence>

      <div className="min-h-screen bg-slate-900 flex">
        {/* Sidebar */}
        <motion.div
          initial={false}
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto lg:min-h-screen border-r border-slate-800 flex flex-col`}
        >
          <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />
          <div className="px-3 pt-3 pb-2">
            <div className="rounded-2xl p-3 bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center text-lg shadow-md shadow-orange-500/30 shrink-0">
                  🧨
                </div>
                <div className="leading-tight">
                  <p className="font-body text-base font-black text-white drop-shadow">Sri Shanmuga</p>
                  <p className="font-body text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 drop-shadow">Grand Crackers</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-white shrink-0">
                <HiX className="text-xl" />
              </button>
            </div>
          </div>

          <nav className="px-3 space-y-1">
            {sidebarLinks.map(link => {
              const isActive = link.to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <link.icon className="text-lg" />
                  <span className="text-sm font-medium">{link.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                </Link>
              );
            })}
          </nav>
        </motion.div>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-slate-900 border-b border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
                <HiMenu className="text-2xl" />
              </button>
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${pageColor}`} />
                <span className="text-sm font-bold text-white capitalize">{pageName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotif(!showNotif)}
                  className={`relative p-2 rounded-full transition-all ${
                    pendingCount > 0
                      ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 hover:text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30'
                      : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                  }`}
                >
                  <motion.div
                    animate={pendingCount > 0 ? {
                      rotate: [0, -15, 10, -10, 5, 0],
                      scale: [1, 1.15, 1],
                    } : {}}
                    transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <HiBell className="text-xl" />
                  </motion.div>
                  {pendingCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg shadow-amber-500/40"
                    >
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </motion.span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotif && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-sm font-bold text-white">Notifications</p>
                      </div>
                      <div className="p-3">
                        {pendingCount > 0 ? (
                          <div className="space-y-2">
                            <div className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                <HiClock className="text-white text-sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white">{pendingCount} Pending Order{pendingCount > 1 ? 's' : ''}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Orders awaiting processing</p>
                              </div>
                            </div>
                            <button
                              onClick={() => { setShowNotif(false); navigate('/admin/orders'); }}
                              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold py-2.5 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all"
                            >
                              View Orders
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <HiBell className="text-3xl text-slate-700 mx-auto mb-2" />
                            <p className="text-sm text-slate-400">No notifications</p>
                            <p className="text-xs text-slate-600 mt-1">All orders are processed</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <a href="/" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 px-4 py-2 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all border border-purple-400/20">
                <HiExternalLink className="text-sm" />
                <span>View Site</span>
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </a>

              <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-violet-500/30 ring-2 ring-white/20">
                {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>

              <button
                onClick={() => { adminLogout(); navigate('/admin/login'); }}
                title="Logout"
                className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/40 ring-2 ring-red-300/40 hover:brightness-110 hover:scale-110 active:scale-95 transition-all"
              >
                <HiLogout className="text-white text-lg" />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-8 overflow-auto bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}