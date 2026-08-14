import { motion } from 'framer-motion';
import { HiPhone } from 'react-icons/hi';
import { SHOP_CONTACT } from '../utils/constants';

export default function FloatingCallButton() {
  return (
    <motion.a
      href={`tel:+91${SHOP_CONTACT.phoneRaw}`}
      title={`Call ${SHOP_CONTACT.phone}`}
      aria-label={`Call ${SHOP_CONTACT.phone}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.5 }}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 group"
    >
      <motion.div
        animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        className="relative flex items-center justify-center"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-slate-900/20"
          animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
        <HiPhone className="relative text-3xl md:text-4xl text-slate-800 drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)] group-hover:text-slate-950 transition-colors" />
      </motion.div>
    </motion.a>
  );
}
