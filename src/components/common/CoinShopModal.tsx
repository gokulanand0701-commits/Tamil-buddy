import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Snowflake,
  Flame,
  Zap,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Crown,
  HeartHandshake
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { soundService } from '../../services/soundService';
import { useTranslation } from '../../hooks/useTranslation';

interface CoinShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoinShopModal: React.FC<CoinShopModalProps> = ({ isOpen, onClose }) => {
  const { user, buyStreakFreeze, repairAndResumeStreak, spendCoins } = useAuthStore();
  const { isTamil } = useTranslation();

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const userCoins = user?.coins ?? 50;
  const userFreezes = user?.streak_freezes_left ?? 1;
  const userStreak = user?.streak_current ?? 1;

  const handleBuyFreeze = () => {
    soundService.playClick();
    const result = buyStreakFreeze(50);
    if (result.success) {
      soundService.playCorrect();
      setNotification({ type: 'success', message: result.message });
    } else {
      soundService.playIncorrect();
      setNotification({ type: 'error', message: result.message });
    }
  };

  const handleResumeStreak = () => {
    soundService.playClick();
    const result = repairAndResumeStreak(80);
    if (result.success) {
      soundService.playCorrect();
      setNotification({ type: 'success', message: result.message });
    } else {
      soundService.playIncorrect();
      setNotification({ type: 'error', message: result.message });
    }
  };

  const handleBuyBooster = (name: string, cost: number) => {
    soundService.playClick();
    const success = spendCoins(cost);
    if (success) {
      soundService.playCorrect();
      setNotification({
        type: 'success',
        message: isTamil
          ? `${name} வெற்றிகரமாக வாங்கப்பட்டது! உங்கள் அடுத்த பாடத்திற்கு தயார்!`
          : `Awesome! You purchased ${name}! Activated for your next lesson!`,
      });
    } else {
      soundService.playIncorrect();
      setNotification({
        type: 'error',
        message: isTamil
          ? `போதுமான நாணயங்கள் இல்லை! உங்களுக்கு ${cost} நாணயங்கள் தேவை.`
          : `Not enough coins! You need ${cost} coins. Win more in the animal word game! 🪙`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-purple-950/60 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl sm:rounded-4xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border-4 border-purple-200 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-md">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight flex items-center gap-2">
                <span>{isTamil ? 'தமிழ் தோழன் கடை' : 'Coin Shop & Treasury'}</span>
                <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2.5 py-0.5 rounded-full">
                  🏪 {isTamil ? 'பயனுள்ள பொருட்கள்' : 'Power-Ups'}
                </span>
              </h2>
              <p className="text-xs text-purple-700 font-semibold">
                {isTamil
                  ? 'இலவச நாணயங்களைப் பயன்படுத்தி தொடர் நாட்களை பாதுகாக்கவும்!'
                  : 'Spend your earned coins to protect and resume your learning streak!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Coins Balance Pill */}
        <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 rounded-2xl p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🪙</span>
            <div>
              <span className="text-[11px] font-black uppercase text-purple-200 tracking-wider block">
                {isTamil ? 'உங்கள் நாணய இருப்பு' : 'Available Balance'}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300">
                {userCoins} {isTamil ? 'நாணயங்கள்' : 'Coins'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-purple-200 font-bold block">
              {isTamil ? 'பாதுகாப்புகள் மீதம்:' : 'Freezes in bag:'}
            </span>
            <span className="text-base font-black text-white">
              ❄️ {userFreezes} {isTamil ? 'உறைவு' : 'freeze(s)'}
            </span>
          </div>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border-2 ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-rose-50 text-rose-900 border-rose-300'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-rose-600 shrink-0" />
              )}
              <span className="flex-1">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Item 1: Streak Freeze */}
          <div className="bg-purple-50/70 hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-400 p-4 rounded-3xl flex flex-col justify-between transition-all shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl">❄️</span>
                <span className="text-xs font-black bg-purple-200/80 text-purple-900 px-2.5 py-1 rounded-xl">
                  {userFreezes} {isTamil ? 'உங்களிடம் உள்ளது' : 'Owned'}
                </span>
              </div>
              <h3 className="text-base font-black text-purple-950">
                {isTamil ? 'தொடர் உறைவு (Streak Freeze)' : 'Streak Freeze ❄️'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                {isTamil
                  ? 'ஒரு நாள் பயிற்சி செய்ய தவறினாலும் உங்கள் தொடர் நாட்கள் உடையாமல் பாதுகாக்கும்!'
                  : 'Missed a day of Tamil lessons? Streak Freeze keeps your streak safe and intact!'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleBuyFreeze}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>🪙 50 {isTamil ? 'நாணயங்கள்' : 'Coins'}</span>
              <span>•</span>
              <span>{isTamil ? 'வாங்க' : 'Buy Freeze'}</span>
            </button>
          </div>

          {/* Item 2: Streak Repair & Resume */}
          <div className="bg-amber-50/70 hover:bg-amber-50 border-2 border-amber-300 p-4 rounded-3xl flex flex-col justify-between transition-all shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl animate-pulse">🔥</span>
                <span className="text-xs font-black bg-amber-200 text-amber-900 px-2.5 py-1 rounded-xl">
                  {isTamil ? 'மீட்பு' : 'Instant Repair'}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900">
                {isTamil ? 'தொடர் மீட்பு (Resume Streak)' : 'Resume Streak ⚡'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                {isTamil
                  ? 'முறிந்த தொடர் நாட்களை உடனே மீண்டும் தொடங்குங்கள்! இழந்த நாட்களை மீட்டுத்தரும்!'
                  : 'Lost your streak? Repair and resume your days immediately without starting back at 0!'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleResumeStreak}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>🪙 80 {isTamil ? 'நாணயங்கள்' : 'Coins'}</span>
              <span>•</span>
              <span>{isTamil ? 'தொடரை மீட்டெடு' : 'Resume Streak'}</span>
            </button>
          </div>

          {/* Item 3: 2X XP Booster */}
          <div className="bg-indigo-50/70 hover:bg-indigo-50 border-2 border-indigo-200 p-4 rounded-3xl flex flex-col justify-between transition-all shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl">🚀</span>
                <span className="text-xs font-black bg-indigo-200 text-indigo-900 px-2.5 py-1 rounded-xl">
                  {isTamil ? '2 மடங்கு புள்ளி' : '2x Multiplier'}
                </span>
              </div>
              <h3 className="text-base font-black text-indigo-950">
                {isTamil ? '2X புள்ளி ஊக்கி (Double XP)' : 'Double XP Potion 🚀'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                {isTamil
                  ? 'உங்கள் அடுத்த பாடத்தில் இரட்டிப்பு XP புள்ளிகளைப் பெற்று விரைவாக நிலை உயர்த்துங்கள்!'
                  : 'Double all XP rewards earned from your next 3 Tamil lessons for rapid level ups!'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleBuyBooster('Double XP Potion', 40)}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>🪙 40 {isTamil ? 'நாணயங்கள்' : 'Coins'}</span>
              <span>•</span>
              <span>{isTamil ? 'வாங்க' : 'Buy Booster'}</span>
            </button>
          </div>

          {/* Item 4: Royal Crown Avatar */}
          <div className="bg-rose-50/70 hover:bg-rose-50 border-2 border-rose-200 p-4 rounded-3xl flex flex-col justify-between transition-all shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-4xl">👑</span>
                <span className="text-xs font-black bg-rose-200 text-rose-900 px-2.5 py-1 rounded-xl">
                  {isTamil ? 'மகுடம்' : 'Exclusive'}
                </span>
              </div>
              <h3 className="text-base font-black text-rose-950">
                {isTamil ? 'அரச மகுடம் (Royal Badge)' : 'Royal Crown Avatar 👑'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                {isTamil
                  ? 'உங்கள் சுயவிவரத்திற்கும் கிளி தோழனுக்கும் தங்க மகுட அலங்காரத்தை அணையுங்கள்!'
                  : 'Show off your royal Tamil knowledge with an exclusive shiny golden crown avatar!'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleBuyBooster('Royal Crown Avatar', 35)}
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>🪙 35 {isTamil ? 'நாணயங்கள்' : 'Coins'}</span>
              <span>•</span>
              <span>{isTamil ? 'அலங்காரம்' : 'Unlock Badge'}</span>
            </button>
          </div>

        </div>

        {/* Footer tip */}
        <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-center">
          <p className="text-xs text-purple-900 font-bold">
            💡 {isTamil
              ? 'மேலும் நாணயங்கள் வேண்டுமா? சொல் விளையாட்டில் (Play & Win 🪙) சொற்களை இணைத்து வெல்லுங்கள்!'
              : 'Need more coins? Play the Animal Word Game in "Play & Win 🪙" to earn endless free coins!'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
