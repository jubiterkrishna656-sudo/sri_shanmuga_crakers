import { HiMail, HiPhone, HiLocationMarker, HiFire } from 'react-icons/hi';
import { SHOP_CONTACT } from '../utils/constants';

export default function Footer() {

  return (
    <footer className="relative bg-gradient-to-br from-[#1a0b2e] via-[#2b0a3d] to-[#4a0d2e] text-white overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-pink-500" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      <HiFire className="absolute top-8 right-10 text-orange-500/10 text-8xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="font-body mb-4 leading-tight">
              <p className="text-xl font-extrabold text-white tracking-tight drop-shadow-lg">Sri Shanmuga</p>
              <p className="text-sm font-extrabold tracking-[0.2em] uppercase text-yellow-400">Grand Crackers</p>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Your trusted destination for premium quality crackers. Celebrate every festival with safety and joy.
            </p>
            <div className="mt-5 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-1">Safety Tips</p>
              <p className="text-white/60 text-xs leading-relaxed">Always keep water nearby while bursting crackers. Maintain safe distance and never hold lit fireworks in hand.</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-sm uppercase tracking-widest text-orange-400 mb-4">Our Location</h3>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <iframe
                src="https://maps.google.com/maps?q=9.352222,77.776139&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Store Location"
              />
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 relative flex flex-col items-center justify-center min-h-[220px]">
            <div className="relative w-full h-44 overflow-hidden">
              {/* Rockets shooting up */}
              <div className="absolute bottom-0 left-[20%] w-[3px] h-0 bg-gradient-to-t from-transparent to-yellow-400 shadow-[0_0_8px_#facc15] animate-[rocketUp_2s_ease-out_infinite]" />
              <div className="absolute bottom-0 left-[50%] w-[3px] h-0 bg-gradient-to-t from-transparent to-orange-400 shadow-[0_0_8px_#fb923c] animate-[rocketUp_2.4s_ease-out_infinite_0.5s]" />
              <div className="absolute bottom-0 left-[80%] w-[3px] h-0 bg-gradient-to-t from-transparent to-pink-400 shadow-[0_0_8px_#f472b6] animate-[rocketUp_1.8s_ease-out_infinite_1s]" />

              {/* Burst particles */}
              {[...Array(6)].map((_, i) => {
                const colors = ['#facc15', '#fb923c', '#f472b6', '#a78bfa', '#34d399', '#f87171'];
                const angle = (i / 6) * 360;
                const x = Math.cos((angle * Math.PI) / 180) * 40;
                const y = Math.sin((angle * Math.PI) / 180) * 40;
                return (
                  <div key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: colors[i],
                      boxShadow: `0 0 6px ${colors[i]}, 0 0 12px ${colors[i]}`,
                      left: 'calc(20% + 1px)', top: '15%',
                      animation: `burstParticle 2s ease-out infinite ${i * 0.15}s`,
                      '--bx': `${x}px`, '--by': `${y}px`
                    }}
                  />
                );
              })}
              {[...Array(6)].map((_, i) => {
                const colors = ['#fb923c', '#facc15', '#a78bfa', '#f472b6', '#34d399', '#f87171'];
                const angle = (i / 6) * 360;
                const x = Math.cos((angle * Math.PI) / 180) * 35;
                const y = Math.sin((angle * Math.PI) / 180) * 35;
                return (
                  <div key={`b2-${i}`}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: colors[i],
                      boxShadow: `0 0 6px ${colors[i]}, 0 0 12px ${colors[i]}`,
                      left: 'calc(50% + 1px)', top: '10%',
                      animation: `burstParticle 2.4s ease-out infinite ${0.5 + i * 0.12}s`,
                      '--bx': `${x}px`, '--by': `${y}px`
                    }}
                  />
                );
              })}
              {[...Array(6)].map((_, i) => {
                const colors = ['#f472b6', '#facc15', '#fb923c', '#a78bfa', '#f87171', '#34d399'];
                const angle = (i / 6) * 360;
                const x = Math.cos((angle * Math.PI) / 180) * 30;
                const y = Math.sin((angle * Math.PI) / 180) * 30;
                return (
                  <div key={`b3-${i}`}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: colors[i],
                      boxShadow: `0 0 6px ${colors[i]}, 0 0 12px ${colors[i]}`,
                      left: 'calc(80% + 1px)', top: '20%',
                      animation: `burstParticle 1.8s ease-out infinite ${1 + i * 0.1}s`,
                      '--bx': `${x}px`, '--by': `${y}px`
                    }}
                  />
                );
              })}

              {/* Ground sparkles */}
              {[...Array(10)].map((_, i) => (
                <div key={`sp-${i}`}
                  className="absolute bottom-1 w-1 h-1 rounded-full bg-yellow-300"
                  style={{
                    left: `${8 + i * 9}%`,
                    boxShadow: '0 0 4px #fde047',
                    animation: `sparkle ${1.5 + (i % 3) * 0.5}s ease-in-out infinite ${i * 0.2}s`
                  }}
                />
              ))}

              {/* Glow base */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-orange-500/20 rounded-full blur-xl" />
            </div>

            <p className="text-sm md:text-base font-black italic mt-2 animate-glow-text" style={{
              background: 'linear-gradient(90deg, #facc15, #fb923c, #f472b6, #a78bfa, #34d399, #facc15)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 3s ease-in-out infinite, glowBlink 2s ease-in-out infinite',
              textShadow: '0 0 20px rgba(251,146,60,0.5)',
              filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.4))'
            }}>{'\u201CShanmuga Crackers - Igniting Joy, One Burst at a Time.\u201D'}</p>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-sm uppercase tracking-widest text-orange-400 mb-4">Contact</h3>
            <div className="space-y-3 text-sm text-white/50">
              <p className="flex items-center gap-2"><HiLocationMarker className="text-orange-400" /> 2/223 Vembakottai, near Vembakottai EB Office, Sivakasi</p>
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
