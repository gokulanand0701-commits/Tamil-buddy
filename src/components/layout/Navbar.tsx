import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Volume2, VolumeX, Shield, Zap, Sparkles, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useTranslation } from '../../hooks/useTranslation';
import { ProfileModal } from '../common/ProfileModal';
import { StreakModal } from '../common/StreakModal';
import { CoinShopModal } from '../common/CoinShopModal';
import { PersonalizedReviewModal } from '../common/PersonalizedReviewModal';
import { soundService } from '../../services/soundService';

const AVATAR_EMOJIS: Record<string, string> = {
  kili: '🦜',
  singam: '🦁',
  yaanai: '🐘',
  mayil: '🦚',
  naai: '🐕',
  poonai: '🐱',
};

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { isMuted, toggleMuted } = useSettingsStore();
  const { t, language, toggleLanguage, isTamil } = useTranslation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const streak = user?.streak_current || 1;
  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const freezes = user?.streak_freezes_left ?? 1;
  const avatarKey = user?.avatar || 'kili';
  const avatarEmoji = AVATAR_EMOJIS[avatarKey] || '🦜';

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-200/60 shadow-sm transition-all w-full">
        {/* Full-width responsive container for desktop and tablets */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Top Left Logo: NAME 'Tamil Buddy' REMAINS AS REQUESTED */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-2xl">🦜</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-800 leading-tight flex items-center gap-1">
                Tamil Buddy
                <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-md font-bold">
                  {t('kidBadge')}
                </span>
              </span>
              <span className="text-xs font-tamil text-teal-600 font-semibold leading-none">
                தமிழ் தோழன்
              </span>
            </div>
          </Link>

          {/* Center & Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Daily Streak Flame (Clickable to open Streak & 10-Day Milestones modal) */}
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setIsStreakOpen(true);
              }}
              title={`${t('streakLabel')}: ${streak} ${t('streakDays')} (${freezes} ${t('streakFreezes')}) - Click for Milestones & Freeze!`}
              className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-300 text-orange-600 px-2.5 py-1 rounded-2xl text-xs sm:text-sm font-extrabold shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <Flame size={18} className="fill-orange-500 animate-pulse text-orange-500" />
              <span>{streak}</span>
              {freezes > 0 && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-1 rounded-full font-bold ml-0.5">
                  ❄️{freezes}
                </span>
              )}
            </button>

            {/* XP & Level Badge */}
            <Link
              to="/progress"
              className="hidden sm:flex items-center gap-1.5 bg-amber-50 border-2 border-amber-200 text-amber-700 px-3 py-1 rounded-2xl text-xs sm:text-sm font-extrabold shadow-sm hover:bg-amber-100 transition-colors"
            >
              <Zap size={16} className="fill-amber-500 text-amber-500" />
              <span>{xp} {t('xpLabel')}</span>
              <span className="bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded-lg text-[10px] font-black">
                {t('levelLabel')} {level}
              </span>
            </Link>

            {/* Coins & Shop Button */}
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setIsShopOpen(true);
              }}
              title="Tamil Buddy Treasury & Shop (Use coins to buy streak freezes & resume streaks!)"
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-amber-50 hover:from-purple-100 hover:to-amber-100 border-2 border-purple-300 text-purple-950 px-2.5 sm:px-3 py-1 rounded-2xl text-xs sm:text-sm font-black shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span className="text-base">🪙</span>
              <span>{user?.coins ?? 50}</span>
              <span className="hidden sm:inline text-[10px] bg-purple-700 text-white px-1.5 py-0.5 rounded-md font-bold">
                {isTamil ? 'கடை 🏪' : 'Shop 🏪'}
              </span>
            </button>

            {/* Smart Mistake Review Button */}
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setIsReviewOpen(true);
              }}
              title="Personalized Smart Review (SM-2 Queued Mistakes)"
              className="flex items-center gap-1 bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 text-purple-900 px-2.5 py-1 rounded-2xl text-xs sm:text-sm font-black shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span>🎯</span>
              <span className="hidden lg:inline">{isTamil ? 'மறுபயிற்சி' : 'Review'}</span>
            </button>

            {/* Language Toggle (English <-> Tamil) */}
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                toggleLanguage();
              }}
              title={t('toggleLang')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-amber-900 px-3 py-1.5 rounded-2xl text-xs font-black transition-all border border-amber-300 shadow-xs cursor-pointer active:scale-95"
            >
              <span className="text-sm">🌐</span>
              <span className="uppercase font-extrabold">{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                toggleMuted();
              }}
              title={isMuted ? t('audioMuted') : t('audioUnmuted')}
              className={`p-2 rounded-2xl transition-all border cursor-pointer ${
                isMuted
                  ? 'bg-rose-50 text-rose-500 border-rose-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* Parent Zone Button */}
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                navigate('/parent');
              }}
              title={t('parentsZone')}
              className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-2.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <Shield size={16} className="text-purple-600" />
              <span className="hidden md:inline">{t('parentsZone')}</span>
            </button>

            {/* Profile Avatar & Settings Button (Replaced Exit from top) */}
            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setIsProfileOpen(true);
              }}
              title={t('profileSettings')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-2xl text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer border border-teal-400"
            >
              <span className="text-base">{avatarEmoji}</span>
              <span className="max-w-[70px] sm:max-w-[90px] truncate hidden xs:inline">
                {user?.name || t('profile')}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
      />

      {/* Streak Consistency & 10-Day Milestones Modal */}
      <StreakModal
        isOpen={isStreakOpen}
        onClose={() => setIsStreakOpen(false)}
      />

      {/* Coins & Power-Ups Shop Modal */}
      <CoinShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
      />

      {/* Personalized Smart Review Modal (SM-2 Queued Mistakes) */}
      <PersonalizedReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </>
  );
};
