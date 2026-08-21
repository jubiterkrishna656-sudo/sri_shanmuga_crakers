import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { SHOP_CONTACT } from '../utils/constants';

const WHATSAPP_NUMBER = '917904968103';
const WHATSAPP_MSG = encodeURIComponent('Hi Sri Shanmuga Grand Crackers! I need assistance.');
const PHONE_NUMBER = `+91${SHOP_CONTACT.phoneRaw}`;

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function handleCall(e) {
  if (!isMobile()) {
    e.preventDefault();
    navigator.clipboard.writeText(PHONE_NUMBER).then(() => {
      toast.success('Phone number copied! Paste it in your dialer.', { icon: '📞' });
    }).catch(() => {
      toast(`Call us: ${SHOP_CONTACT.phone}`, { icon: '📞', duration: 6000 });
    });
  }
}

export default function FloatingCallButton() {
  return (
    <div className="fixed bottom-5 right-4 md:bottom-7 md:right-7 z-50 flex flex-col items-end gap-2.5">
      {/* WhatsApp */}
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
        className="group relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] shadow-[0_3px_15px_rgba(37,211,102,0.45)] hover:shadow-[0_4px_22px_rgba(37,211,102,0.7)] hover:scale-110 transition-all duration-300"
      >
        <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-[0.15]" />
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-[22px] md:h-[22px] fill-white relative z-10 drop-shadow-sm">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>

      {/* Phone */}
      <motion.a
        href={`tel:${PHONE_NUMBER}`}
        onClick={handleCall}
        title={`Call ${SHOP_CONTACT.phone}`}
        aria-label={`Call ${SHOP_CONTACT.phone}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
        className="group relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F7931E] shadow-[0_3px_15px_rgba(255,107,53,0.45)] hover:shadow-[0_4px_22px_rgba(255,107,53,0.7)] hover:scale-110 transition-all duration-300"
      >
        <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-[0.15]" />
        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 fill-white relative z-10" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
        </svg>
      </motion.a>
    </div>
  );
}