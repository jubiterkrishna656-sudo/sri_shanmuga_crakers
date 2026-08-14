import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiShieldCheck, HiEye, HiEyeOff, HiArrowLeft, HiExclamationCircle, HiMail, HiLockClosed, HiSun, HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ocean = ['#22d3ee', '#2dd4bf', '#34d399', '#fbbf24', '#fb923c', '#22d3ee'];

const bubbles = [...Array(16)].map(() => ({
  left: Math.random() * 100,
  size: 12 + Math.random() * 42,
  delay: Math.random() * 6,
  duration: 7 + Math.random() * 8,
  drift: (Math.random() - 0.5) * 120,
  opacity: 0.3 + Math.random() * 0.5,
}));

const sunbeams = [
  { top: '-15%', right: '-10%', size: '26rem', color: 'bg-amber-300/30' },
  { top: '30%', left: '-12%', size: '24rem', color: 'bg-cyan-300/30' },
  { bottom: '-20%', right: '20%', size: '28rem', color: 'bg-emerald-300/30' },
  { bottom: '10%', left: '25%', size: '20rem', color: 'bg-sky-300/25' },
];

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Enter email and password'); return; }
    setLoading(true);
    try {
      await adminLogin({ email, password });
      toast.success('Welcome Admin!');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-400">
      {/* Sunny glow orb */}
      <motion.div
        className="absolute rounded-full bg-amber-300/40 blur-[90px]"
        style={{ top: '-10%', right: '-8%', width: '26rem', height: '26rem' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Soft ocean glow orbs */}
      {sunbeams.map((o, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${o.color} blur-[100px]`}
          style={{ top: o.top, left: o.left, right: o.right, bottom: o.bottom, width: o.size, height: o.size }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Rising bubbles */}
      {bubbles.map((b, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-white/50 bg-white/20"
          style={{ left: `${b.left}%`, bottom: '-60px', width: b.size, height: b.size, boxShadow: 'inset 2px 2px 6px rgba(255,255,255,0.6)' }}
          animate={{ y: [0, -900], x: [0, b.drift], opacity: [0, b.opacity, 0] }}
          transition={{ delay: b.delay, duration: b.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative w-full max-w-md">
        {/* Fresh gradient border */}
        <motion.div
          initial={{ opacity: 0, y: 26, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative p-[2px] rounded-[2rem] overflow-hidden shadow-2xl shadow-teal-900/30"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 6 }}
            className="absolute -inset-[200%]"
            style={{ background: `conic-gradient(from 0deg, ${ocean.join(', ')})` }}
          />

          <div className="relative rounded-[calc(2rem-2px)] p-7 sm:p-9 bg-white/25 backdrop-blur-2xl border border-white/40">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative mx-auto mb-5 w-20 h-20">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 opacity-70 blur-lg animate-pulse" />
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-400 to-sky-500 flex items-center justify-center shadow-xl shadow-teal-500/40 ring-4 ring-white/50"
                >
                  <HiShieldCheck className="text-4xl text-white drop-shadow" />
                </motion.div>
                <motion.span
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-400/40"
                >
                  <HiSun className="text-white text-sm" />
                </motion.span>
              </div>

              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-orange-400/40 mb-4"
              >
                <HiSparkles className="text-sm" /> Admin
              </motion.span>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-3 rounded-2xl bg-rose-500/25 border-2 border-white/50 px-4 py-3 mb-5 backdrop-blur-sm"
                >
                  <HiExclamationCircle className="text-white text-xl shrink-0 mt-0.5" />
                  <p className="text-white text-sm font-bold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              <div className="group">
                <label className="block text-sm font-black text-teal-900 mb-1.5">Email</label>
                <div className="relative">
                  <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-teal-800/70 group-focus-within:text-orange-500 transition" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="admin@example.com"
                    autoFocus
                    autoComplete="off"
                    className="w-full bg-white/50 border-2 border-white/70 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-teal-900 placeholder-teal-700/50 focus:outline-none focus:ring-4 focus:ring-amber-300/60 focus:border-white focus:bg-white/70 transition shadow-inner"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-black text-teal-900 mb-1.5">Password</label>
                <div className="relative">
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-teal-800/70 group-focus-within:text-orange-500 transition" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    className="w-full bg-white/50 border-2 border-white/70 rounded-2xl py-3.5 pl-11 pr-12 text-sm text-teal-900 placeholder-teal-700/50 focus:outline-none focus:ring-4 focus:ring-amber-300/60 focus:border-white focus:bg-white/70 transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-800/70 hover:text-orange-500 transition"
                  >
                    {showPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative overflow-hidden w-full group rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white font-black py-3.5 text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-2xl hover:shadow-orange-400/50 hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-white/40 skew-x-12" />
                {loading ? (
                  <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Verifying...</>
                ) : (
                  <>Sign In <HiArrowLeft className="rotate-180 text-lg" /></>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
