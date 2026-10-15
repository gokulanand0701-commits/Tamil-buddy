import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Snowflake, Award, Sparkles, X, CheckCircle2, ShieldCheck, Gift, Star } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTranslation } from '../../hooks/useTranslation';
import { soundService } from '../../services/soundService';
import { useToastStore } from '../../store/useToastStore';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose }) => {
  const { user, useStreakFreeze } = useAuthStore();
  const { t, isTamil } = useTranslation();
  const { addToast } = useToastStore();
  const [isFrozenToday, setIsFrozenToday] = useState(false);

  if (!isOpen) return null;

  const streak = user?.streak_current || 1;
  const freezesLeft = user?.streak_freezes_left ?? 1;

  // Next 10-day milestone calculation
  const nextMilestone = Math.ceil((streak + 0.1) / 10) * 10;
  const daysUntilMilestone = Math.max(0, nextMilestone - streak);
  const milestoneProgress = Math.min(100, Math.round(((streak % 10) / 10) * 100));

  const handleActivateFreeze = () => {
    if (freezesLeft <= 0) {
      soundService.playIncorrect();
      addToast({
        type: 'info',
        title: isTamil ? 'பாதுகாப்பு இல்லை' : 'No Freezes Left',
        message: isTamil ? 'புதிய தொடர் பாதுகாப்பு அடுத்த வாரம் புதுப்பிக்கப்படும்!' : 'Streak freezes refresh weekly!',
      });
      return;
    }

    soundService.playCorrect();
    const success = useStreakFreeze();
    if (success) {
      setIsFrozenToday(true);
      addToast({
        type: 'success',
        title: isTamil ? 'தொடர் உறைந்தது! ❄️' : 'Streak Frozen! ❄️',
        message: isTamil
          ? `உங்கள் ${streak} நாள் தொடர் சாதனை பாதுகாக்கப்பட்டுள்ளது!`
          : `Your ${streak}-day streak is now safely frozen for today!`,
      });
    }
  };

  const DAYS_OF_WEEK = [
    { label_en: 'M', label_ta: 'தி', full_en: 'Mon', full_ta: 'திங்கள்' },
    { label_en: 'T', label_ta: 'செ', full_en: 'Tue', full_ta: 'செவ்வாய்' },
    { label_en: 'W', label_ta: 'பு', full_en: 'Wed', full_ta: 'புதன்' },
    { label_en: 'T', label_ta: 'வி', full_en: 'Thu', full_ta: 'வியாழன்' },
    { label_en: 'F', label_ta: 'வெ', full_en: 'Fri', full_ta: 'வெள்ளி' },
    { label_en: 'S', label_ta: 'ச', full_en: 'Sat', full_ta: 'சனி' },
    { label_en: 'S', label_ta: 'ஞா', full_en: 'Sun', full_ta: 'ஞாயிறு' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="bg-white rounded-4xl shadow-2xl border-4 border-purple-300 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-800 p-6 text-white text-center relative overflow-hidden shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          {/* Big Animated Flame */}
          <div className="relative inline-block my-2">
            <motion.div
              animate={{ scale: [1, 1.12, 1], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner mx-auto text-5xl"
            >
              🔥
            </motion.div>
            <span className="absolute -bottom-2 -right-2 bg-purple-200 text-purple-950 font-black text-xs px-2 py-0.5 rounded-full shadow-sm">
              +{streak}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {streak} {isTamil ? 'நாள் தொடர் சாதனை!' : 'Day Consistency Streak!'}
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 font-semibold mt-1">
            {isTamil
              ? 'தினமும் தொடர்ந்து தமிழ் கற்று சாதனை படைக்கிறீர்கள்!'
              : 'You are mastering Tamil by learning every single day!'}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* 7-Day Consistency Week Heatmap */}
          <div className="bg-purple-50/70 border-2 border-purple-200/80 rounded-3xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase text-purple-900 tracking-wider">
                {isTamil ? 'இந்த வார முன்னேற்றம்' : 'This Week Progress'}
              </span>
              <span className="text-xs font-bold text-purple-700">
                {streak >= 7 ? '7/7 Days Complete! 🌟' : `${streak} Days Active`}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day, idx) => {
                const isDayDone = idx < (streak % 7 || 7);
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-extrabold text-slate-500">
                      {isTamil ? day.label_ta : day.label_en}
                    </span>
                    <div
                      className={`w-9 h-11 rounded-2xl flex items-center justify-center font-black text-xs transition-all shadow-xs ${
                        isDayDone
                          ? 'bg-gradient-to-t from-purple-600 to-indigo-500 text-white shadow-sm ring-2 ring-purple-200'
                          : 'bg-white border-2 border-purple-100 text-slate-400'
                      }`}
                    >
                      {isDayDone ? '🔥' : '•'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 10-Day Milestone Reward Roadmap */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-amber-100 text-amber-800 text-lg">
                  🎁
                </span>
                <div>
                  <h3 className="text-sm font-black text-slate-800">
                    {isTamil ? '10-நாள் மைல்கல் பரிசுகள்' : '10-Day Milestone Rewards'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    {daysUntilMilestone === 0
                      ? (isTamil ? 'மைல்கல் நிறைவடைந்தது! 🎉' : 'Milestone achieved! 🎉')
                      : (isTamil
                          ? `இன்னும் ${daysUntilMilestone} நாட்கள் கற்றால் பரிசு திறக்கும்!`
                          : `${daysUntilMilestone} more days to unlock next milestone!`)}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                {nextMilestone} {isTamil ? 'நாட்கள்' : 'Days'}
              </span>
            </div>

            {/* Progress bar to next 10-day milestone */}
            <div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${milestoneProgress || 10}%` }}
                  className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>

            {/* 3 Milestone Tier Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Day 10 */}
              <div
                className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-between transition-all ${
                  streak >= 10
                    ? 'border-amber-400 bg-amber-50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 opacity-80'
                }`}
              >
                <span className="text-2xl mb-1">🏅</span>
                <span className="text-xs font-black text-slate-800">
                  {isTamil ? '10 நாள் தீப்பொறி' : '10-Day Flame Master'}
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full mt-1">
                  {streak >= 10 ? (isTamil ? 'திறக்கப்பட்டது! ✨' : 'Unlocked! ✨') : '5 Animal Stickers 🎨'}
                </span>
              </div>

              {/* Day 20 */}
              <div
                className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-between transition-all ${
                  streak >= 20
                    ? 'border-teal-400 bg-teal-50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 opacity-80'
                }`}
              >
                <span className="text-2xl mb-1">🦚</span>
                <span className="text-xs font-black text-slate-800">
                  {isTamil ? '20 நாள் ஞானி' : '20-Day Sage'}
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full mt-1">
                  {streak >= 20 ? (isTamil ? 'திறக்கப்பட்டது! ✨' : 'Unlocked! ✨') : 'Rare Words Pack 📜'}
                </span>
              </div>

              {/* Day 30 */}
              <div
                className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-between transition-all ${
                  streak >= 30
                    ? 'border-purple-400 bg-purple-50 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 opacity-80'
                }`}
              >
                <span className="text-2xl mb-1">🏆</span>
                <span className="text-xs font-black text-slate-800">
                  {isTamil ? '30 நாள் சாம்பியன்' : '30-Day Legend'}
                </span>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full mt-1">
                  {streak >= 30 ? (isTamil ? 'திறக்கப்பட்டது! ✨' : 'Unlocked! ✨') : 'Golden Kili Theme 👑'}
                </span>
              </div>
            </div>
          </div>

          {/* Streak Freeze Section */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl shadow-inner shrink-0">
                ❄️
              </div>
              <div>
                <h4 className="font-black text-sm text-sky-900">
                  {isTamil ? 'தொடர் உறைவு (Streak Freeze)' : 'Streak Freeze Protection'}
                </h4>
                <p className="text-xs text-sky-700 font-medium">
                  {isFrozenToday
                    ? (isTamil
                        ? `🛡️ உங்கள் ${streak} நாள் தொடர் சாதனை பாதுகாக்கப்பட்டுள்ளது!`
                        : `🛡️ Your ${streak}-day streak is actively frozen & protected for today!`)
                    : (isTamil
                        ? `நீங்கள் ஒரு நாள் தவறிவிட்டாலும் உங்கள் ${streak} நாள் தொடர் அழியாமல் காக்கும்!`
                        : `Protects your ${streak}-day streak from resetting if you miss a day!`)}
                </p>
                <span className="inline-block text-[11px] font-bold text-sky-800 mt-1">
                  {freezesLeft} {isTamil ? 'பாதுகாப்பு மீதம் உள்ளது' : 'Freeze remaining'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleActivateFreeze}
              disabled={isFrozenToday || freezesLeft <= 0}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isFrozenToday
                  ? 'bg-emerald-500 text-white cursor-default'
                  : freezesLeft > 0
                  ? 'bg-sky-500 hover:bg-sky-600 text-white active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Snowflake size={15} />
              <span>
                {isFrozenToday
                  ? (isTamil ? 'உறைந்தது 🛡️' : 'Frozen Today 🛡️')
                  : (isTamil ? 'இன்றைய தொடரை உறையவை ❄️' : 'Freeze Streak ❄️')}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
