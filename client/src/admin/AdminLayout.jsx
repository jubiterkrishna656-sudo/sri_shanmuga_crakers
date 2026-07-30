import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiHome, HiCube, HiShoppingBag, HiUsers, HiLogout, HiSparkles } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  { to: '/admin', icon: HiHome, label: 'Dashboard' },
  { to: '/admin/products', icon: HiCube, label: 'Products' },
  { to: '/admin/orders', icon: HiShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: HiUsers, label: 'Users' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => {
    authLogout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-green-100 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-green-900 text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-2">
              <HiSparkles className="text-orange-400 text-2xl" />
              <span className="font-bold text-lg">Admin Panel</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-green-400 hover:text-white"><HiX className="text-2xl" /></button>
          </div>
          <p className="text-xs text-green-500 mt-1">Shanmuga Crackers</p>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setSidebarOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${location.pathname === link.to ? 'bg-orange-500 text-white' : 'text-green-300 hover:bg-green-800'}`}>
              <link.icon className="text-xl" />
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-green-300 hover:bg-red-600/20 hover:text-red-400 transition w-full">
            <HiLogout className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between lg:justify-end">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-green-600 hover:text-green-900">
            <HiMenu className="text-2xl" />
          </button>
          <div className="flex items-center space-x-4">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-green-500 hover:text-orange-500">View Site</a>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
