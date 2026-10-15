import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, Zap, ArrowRight } from 'lucide-react';
import { KiliMascot } from './KiliMascot';
import { Button } from './Button';
import { useProgressStore } from '../../store/useProgressStore';
import { useNavigate } from 'react-router-dom';

export const ConfettiCelebration: React.FC = () => {
  const modal = useProgressStore((state) => state.completedLessonModal);
  const closeCelebrationModal = useProgressStore((state) => state.closeCelebrationModal);
  const navigate = useNavigate();

  useEffect(() => {
    if (modal?.isOpen) {
      // Fire vibrant confetti cannons
      const end = Date.now() + 2 * 1000;
      const colors = ['#f59e0b', '#14b8a6', '#f43f5e', '#22c55e', '#38bdf8'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [modal?.isOpen]);

  if (!modal || !modal.isOpen) return null;

  const { lesson, xpEarned, newBadges, levelUp } = modal;
  const starsCount = lesson?.stars || 3;

  const handleContinue = () => {
    closeCelebrationModal();
    navigate('/learn');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 text-center shadow-2xl border-4 border-purple-300 overflow-hidden"
        >
          {/* Background Rays */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-100/70 rounded-full blur-3xl pointer-events-none" />

          {/* Kili Mascot Celebrating */}
          <div className="relative mb-3 flex justify-center">
            <KiliMascot mood="celebrate" size="lg" />
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            அற்புதம்! Fantastic Job! 🎉
          </h2>
          <p className="text-sm font-bold text-purple-700 mt-1">
            Lesson Completed: {lesson?.title}
          </p>

          {/* Stars Earned */}
          <div className="flex justify-center items-center gap-2 my-5">
            {[1, 2, 3].map((starIndex) => (
              <motion.div
                key={starIndex}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + starIndex * 0.15, type: 'spring' }}
                className={`p-2.5 rounded-2xl ${
                  starIndex <= starsCount ? 'bg-amber-100 text-amber-500 shadow-sm' : 'bg-slate-100 text-slate-300'
                }`}
              >
                <Star size={36} fill={starIndex <= starsCount ? '#f59e0b' : 'none'} strokeWidth={2} />
              </motion.div>
            ))}
          </div>

          {/* Rewards Grid: XP + Coins + Fluency */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <div className="bg-purple-50 border-2 border-purple-200/80 rounded-2xl p-2.5 flex flex-col items-center">
              <span className="text-purple-600 mb-0.5 flex items-center gap-1 font-bold text-[11px] uppercase">
                <Zap size={14} /> XP
              </span>
              <span className="text-lg font-black text-purple-700">+{xpEarned}</span>
            </div>

            <div className="bg-amber-50 border-2 border-amber-200/80 rounded-2xl p-2.5 flex flex-col items-center">
              <span className="text-amber-600 mb-0.5 flex items-center gap-1 font-bold text-[11px] uppercase">
                🪙 Coins
              </span>
              <span className="text-lg font-black text-amber-700">+15</span>
            </div>

            <div className="bg-indigo-50 border-2 border-indigo-200/80 rounded-2xl p-2.5 flex flex-col items-center">
              <span className="text-indigo-600 mb-0.5 flex items-center gap-1 font-bold text-[11px] uppercase">
                <Award size={14} /> Mastery
              </span>
              <span className="text-lg font-black text-indigo-700">Level Up!</span>
            </div>
          </div>

          {/* Level Up Announcement */}
          {levelUp && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-purple-100 border-2 border-purple-300 text-purple-900 rounded-2xl p-3 mb-4 text-xs font-bold"
            >
              🚀 LEVEL UP! You reached a new milestone! Keep rockin' Tamil!
            </motion.div>
          )}

          {/* New Badges */}
          {newBadges && newBadges.length > 0 && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3 mb-4">
              <span className="text-xs font-bold text-purple-600 block mb-1">🏅 NEW BADGE UNLOCKED!</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">{newBadges[0].icon}</span>
                <span className="font-extrabold text-sm text-slate-800">{newBadges[0].title}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md transition-all active:scale-95 text-base"
            >
              <span>Continue Adventure!</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
