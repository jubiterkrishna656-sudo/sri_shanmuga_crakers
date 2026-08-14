import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiFire } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="relative max-w-7xl mx-auto px-4 py-24 text-center overflow-hidden">
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-orange-200/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-pink-200/40 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10">
        <motion.div
          className="w-28 h-28 mx-auto mb-6 rounded-[2rem] bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center text-5xl shadow-2xl shadow-orange-500/30"
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎇
        </motion.div>
        <h1 className="text-8xl font-black text-gradient leading-none">404</h1>
        <h2 className="text-3xl font-black text-gray-900 mt-4 mb-2">Oops! Page went up in smoke</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/" className="btn-primary px-8 py-3.5">
          <HiArrowLeft /> Go Home
        </Link>
        <div className="mt-6 text-xs text-gray-400 font-semibold flex items-center justify-center gap-1.5">
          <HiFire className="text-orange-400" /> Stay safe, celebrate responsibly
        </div>
      </motion.div>
    </div>
  );
}
