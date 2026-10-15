import React from 'react';
import { motion } from 'framer-motion';

export type KiliMood = 'idle' | 'happy' | 'sad' | 'celebrate' | 'talking';

interface KiliMascotProps {
  mood?: KiliMood;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  speechBubble?: string;
}

export const KiliMascot: React.FC<KiliMascotProps> = ({
  mood = 'idle',
  size = 'md',
  className = '',
  speechBubble,
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    hero: 'w-52 h-52 md:w-64 md:h-64',
  };

  const getAnimationVariants = () => {
    switch (mood) {
      case 'happy':
        return {
          animate: {
            y: [0, -10, 0, -8, 0],
            rotate: [0, -3, 3, -2, 0],
            transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' },
          },
        };
      case 'celebrate':
        return {
          animate: {
            y: [0, -18, 0, -12, 0],
            rotate: [0, -8, 8, -5, 0],
            scale: [1, 1.08, 1, 1.05, 1],
            transition: { repeat: Infinity, duration: 1.2, ease: 'easeOut' },
          },
        };
      case 'sad':
        return {
          animate: {
            y: [0, 4, 0],
            rotate: [0, -4, 0],
            transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
          },
        };
      case 'talking':
        return {
          animate: {
            rotate: [0, 2, -2, 1, 0],
            transition: { repeat: Infinity, duration: 0.8 },
          },
        };
      default: // idle
        return {
          animate: {
            y: [0, -4, 0],
            transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
          },
        };
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      {/* Optional Speech Bubble above Kili */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 max-w-xs bg-white text-slate-800 text-xs sm:text-sm font-semibold px-3 py-2 rounded-2xl shadow-playful border-2 border-turmeric-200 text-center relative z-10"
        >
          {speechBubble}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white" />
        </motion.div>
      )}

      {/* Animated SVG Mascot */}
      <motion.div className={`${sizeMap[size]}`} {...getAnimationVariants()}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md select-none overflow-visible">
          <defs>
            <linearGradient id="kiliBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#4ade80" />
              <stop offset="100%" stop-color="#16a34a" />
            </linearGradient>
            <linearGradient id="kiliBellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="100%" stop-color="#facc15" />
            </linearGradient>
            <linearGradient id="kiliBeakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fb7185" />
              <stop offset="100%" stop-color="#e11d48" />
            </linearGradient>
          </defs>

          {/* Party Hat when celebrating */}
          {mood === 'celebrate' && (
            <g transform="translate(42, 6) rotate(8)">
              <polygon points="12,0 0,30 24,30" fill="#f43f5e" />
              <polygon points="12,0 6,30 18,30" fill="#fbbf24" opacity="0.6" />
              <circle cx="12" cy="0" r="4" fill="#38bdf8" />
            </g>
          )}

          {/* Tail Feathers */}
          <path d="M 28,75 Q 8,98 5,108 Q 20,96 36,82 Z" fill="#0d9488" />
          <path d="M 25,72 Q 15,92 18,106 Q 26,92 38,78 Z" fill="#06b6d4" />

          {/* Main Body */}
          <circle cx="58" cy="60" r="40" fill="url(#kiliBodyGrad)" />

          {/* Bright Yellow Belly */}
          <circle cx="66" cy="68" r="26" fill="url(#kiliBellyGrad)" />

          {/* Left Wing */}
          <motion.path
            d="M 38,55 C 32,78 50,90 60,80 C 50,72 42,62 48,46 Z"
            fill="#15803d"
            animate={
              mood === 'celebrate'
                ? { rotate: [-10, 20, -10], originX: 0.3, originY: 0.5 }
                : mood === 'talking'
                ? { rotate: [-2, 6, -2] }
                : {}
            }
            transition={{ repeat: Infinity, duration: 0.6 }}
          />

          {/* Feather Crest */}
          <path d="M 52,22 C 52,6 68,6 62,22 Z" fill="#fbbf24" />
          <path d="M 46,24 C 40,12 56,10 54,24 Z" fill="#f43f5e" />

          {/* Eye White */}
          <circle cx="76" cy="48" r="13" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />

          {/* Eye Pupil / Emotion */}
          {mood === 'sad' ? (
            // Sad droopy eyes
            <g>
              <ellipse cx="76" cy="52" rx="7" ry="5" fill="#1e293b" />
              <path d="M 64,43 Q 76,48 88,43" stroke="#475569" strokeWidth="2.5" fill="none" />
              {/* Little gentle tear */}
              <circle cx="84" cy="62" r="2" fill="#38bdf8" />
            </g>
          ) : mood === 'celebrate' || mood === 'happy' ? (
            // Happy cheerful curved eyes ^_^
            <g>
              <path d="M 68,52 Q 77,40 85,52" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <circle cx="82" cy="45" r="2" fill="#ffffff" />
            </g>
          ) : (
            // Normal bright attentive eye
            <g>
              <circle cx="78" cy="48" r="7" fill="#1e293b" />
              <circle cx="81" cy="45" r="3" fill="#ffffff" />
              <circle cx="76" cy="51" r="1" fill="#ffffff" />
            </g>
          )}

          {/* Rosy Cheeks */}
          <ellipse cx="68" cy="64" rx="7" ry="4.5" fill="#fb7185" opacity="0.65" />

          {/* Beak with motion for talking */}
          {mood === 'talking' ? (
            <motion.path
              d="M 85,50 Q 112,56 100,69 Q 86,64 85,50 Z"
              fill="url(#kiliBeakGrad)"
              animate={{ d: ['M 85,50 Q 112,56 100,69 Q 86,64 85,50 Z', 'M 85,46 Q 115,54 100,74 Q 86,66 85,46 Z', 'M 85,50 Q 112,56 100,69 Q 86,64 85,50 Z'] }}
              transition={{ repeat: Infinity, duration: 0.35 }}
            />
          ) : (
            <path d="M 85,50 Q 112,56 100,69 Q 86,64 85,50 Z" fill="url(#kiliBeakGrad)" />
          )}

          {/* Cute Little Feet */}
          <path d="M 52,98 L 48,108 M 52,98 L 52,108 M 52,98 L 56,108" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M 68,98 L 64,108 M 68,98 L 68,108 M 68,98 L 72,108" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
};
