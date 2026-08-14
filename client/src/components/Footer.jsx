import { Link } from 'react-router-dom';
import { HiMail, HiPhone, HiLocationMarker, HiFire } from 'react-icons/hi';
import { categories } from '../utils/categories';
import { SHOP_CONTACT } from '../utils/constants';

export default function Footer() {

  return (
    <footer className="relative bg-gradient-to-br from-[#1a0b2e] via-[#2b0a3d] to-[#4a0d2e] text-white overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-pink-500" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      <HiFire className="absolute top-8 right-10 text-orange-500/10 text-8xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-body mb-4 leading-tight">
              <p className="text-xl font-extrabold text-white tracking-tight drop-shadow-lg">Sri Shanmuga</p>
              <p className="text-sm font-extrabold tracking-[0.2em] uppercase text-yellow-400">Grand Crackers</p>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Your trusted destination for premium quality crackers. Celebrate every festival with safety and joy.
            </p>
            <div className="flex gap-2 mt-5">
              {['📷', '📘', '💬', '▶️'].map((s, i) => (
                <button key={i} className="w-9 h-9 rounded-full bg-white/5 hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-500 border border-white/10 flex items-center justify-center text-sm transition-all duration-300">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-orange-400 mb-4">Quick Links</h3>
            <div className="space-y-2.5">
              <Link to="/" className="block text-white/50 hover:text-orange-400 text-sm transition-colors">Home</Link>
              <Link to="/products" className="block text-white/50 hover:text-orange-400 text-sm transition-colors">Products</Link>
              <Link to="/cart" className="block text-white/50 hover:text-orange-400 text-sm transition-colors">Cart</Link>
              <Link to="/orders" className="block text-white/50 hover:text-orange-400 text-sm transition-colors">My Orders</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-orange-400 mb-4">Categories</h3>
            <div className="space-y-2.5">
              {categories.map(c => (
                <Link key={c.name} to={`/products?category=${encodeURIComponent(c.name)}`} className="block text-white/50 hover:text-orange-400 text-sm transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-sm uppercase tracking-widest text-orange-400 mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-white/50">
              <p className="flex items-center gap-2"><HiLocationMarker className="text-orange-400" /> Sivakasi, Tamil Nadu</p>
              <p className="flex items-center gap-2"><HiPhone className="text-orange-400" /> {SHOP_CONTACT.phone}</p>
              <p className="flex items-center gap-2"><HiMail className="text-orange-400" /> {SHOP_CONTACT.email}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center">
          <p className="text-white/40 text-sm">© {new Date().getFullYear()} Sri Shanmuga Grand Crackers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
