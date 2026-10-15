import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, Lock, KeyRound, Check, LogOut, Flame, Zap, Award, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { useTranslation } from '../../hooks/useTranslation';
import { soundService } from '../../services/soundService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const AVATARS = [
  { id: 'kili', emoji: '🦜', label_en: 'Kili (Parrot)', label_ta: 'கிளி' },
  { id: 'singam', emoji: '🦁', label_en: 'Singam (Lion)', label_ta: 'சிங்கம்' },
  { id: 'yaanai', emoji: '🐘', label_en: 'Yaanai (Elephant)', label_ta: 'யானை' },
  { id: 'mayil', emoji: '🦚', label_en: 'Mayil (Peacock)', label_ta: 'மயில்' },
  { id: 'naai', emoji: '🐕', label_en: 'Naai (Puppy)', label_ta: 'நாய்' },
  { id: 'poonai', emoji: '🐱', label_en: 'Poonai (Cat)', label_ta: 'பூனை' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onLogout }) => {
  const { user, updateProfile, changePassword } = useAuthStore();
  const { addToast } = useToastStore();
  const { t, isTamil } = useTranslation();

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || 8);
  const [avatar, setAvatar] = useState(user?.avatar || 'kili');
  const [learningLevel, setLearningLevel] = useState(user?.learning_level || 'beginner');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSavingProfile(true);
    soundService.playClick();

    try {
      await updateProfile({
        name: name.trim(),
        age,
        avatar,
        learning_level: learningLevel,
      });
      soundService.playCorrect();
      addToast({
        type: 'success',
        title: isTamil ? 'வெற்றி! ✨' : 'Success! ✨',
        message: t('profileSavedToast'),
      });
    } catch (err: any) {
      soundService.playIncorrect();
      addToast({
        type: 'error',
        title: 'Error',
        message: err.message || 'Failed to update profile.',
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    if (newPassword !== confirmPassword) {
      soundService.playIncorrect();
      addToast({
        type: 'error',
        title: isTamil ? 'பிழை' : 'Mismatch',
        message: t('passwordMismatchToast'),
      });
      return;
    }

    if (newPassword.length < 4) {
      soundService.playIncorrect();
      addToast({
        type: 'error',
        title: isTamil ? 'பிழை' : 'Password Error',
        message: isTamil ? 'கடவுச்சொல் குறைந்தது 4 எழுத்துக்கள் இருக்க வேண்டும்' : 'Password must be at least 4 characters',
      });
      return;
    }

    setIsChangingPassword(true);
    soundService.playClick();

    try {
      await changePassword(currentPassword, newPassword);
      soundService.playCorrect();
      addToast({
        type: 'success',
        title: isTamil ? 'வெற்றி! 🔒' : 'Success! 🔒',
        message: t('passwordUpdatedToast'),
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      soundService.playIncorrect();
      addToast({
        type: 'error',
        title: isTamil ? 'பிழை' : 'Password Error',
        message: err.message || 'Failed to change password.',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl border-2 border-amber-300 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-5 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30">
              {AVATARS.find((a) => a.id === avatar)?.emoji || '🦜'}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">{t('profileSettings')}</h2>
              <p className="text-xs text-amber-100 font-semibold">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Level & XP Quick Bar */}
        <div className="bg-amber-50/80 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 shrink-0">
          <div className="flex items-center gap-1.5 text-amber-700">
            <Zap size={15} className="fill-amber-500 text-amber-500" />
            <span>{user?.xp || 0} {t('xpLabel')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-600">
            <Flame size={15} className="fill-orange-500 text-orange-500" />
            <span>{user?.streak_current || 0} {t('streakDays')}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-800 bg-amber-200/70 px-2 py-0.5 rounded-lg">
            <Award size={13} className="text-amber-800" />
            <span>{t('levelLabel')} {user?.level || 1}</span>
          </div>
        </div>

        {/* Tab Switcher: Profile vs Password */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserIcon size={16} />
            <span>{t('childProfile')}</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'password'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock size={16} />
            <span>{t('passwordSettings')}</span>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Mascot Avatar Selection */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  {t('pickAvatar')}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATARS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAvatar(item.id)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                        avatar === item.id
                          ? 'border-amber-500 bg-amber-50 shadow-sm scale-105 ring-2 ring-amber-300'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-3xl mb-0.5">{item.emoji}</span>
                      <span className="text-[10px] font-extrabold text-slate-700 truncate w-full text-center">
                        {isTamil ? item.label_ta : item.id}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  {t('learnerName')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-bold text-slate-800 text-sm"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Age Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    {t('ageLabel')}
                  </label>
                  <span className="text-sm font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
                    {age} yrs
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="14"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Learning Level */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  {t('learningLevelLabel')}
                </label>
                <select
                  value={learningLevel}
                  onChange={(e) => setLearningLevel(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 font-bold text-slate-800 text-sm outline-none bg-white cursor-pointer"
                >
                  <option value="beginner">{t('beginner')}</option>
                  <option value="few_words">{t('knowsWords')}</option>
                  <option value="can_speak">{t('canSpeak')}</option>
                </select>
              </div>

              {/* Save Profile Button */}
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3 rounded-2xl shadow-playful active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check size={18} />
                <span>{isSavingProfile ? 'Saving...' : t('saveChanges')}</span>
              </button>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  {t('currentPassword')}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-bold text-slate-800 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  {t('newPassword')}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-bold text-slate-800 text-sm"
                  placeholder="••••••••"
                  required
                  minLength={4}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  {t('confirmPassword')}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none font-bold text-slate-800 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black py-3 rounded-2xl shadow-playful active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound size={18} />
                <span>{isChangingPassword ? 'Updating...' : t('updatePasswordBtn')}</span>
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="pt-2 border-t border-slate-100">
            {/* Logout Section */}
            {!showLogoutConfirm ? (
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-2.5 px-4 rounded-2xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut size={16} />
                <span>{t('logoutAccount')}</span>
              </button>
            ) : (
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3.5 text-center space-y-2">
                <p className="text-xs font-black text-rose-800">
                  {t('exitDialogMsg')}
                </p>
                <div className="flex items-center gap-2 justify-center">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-black px-4 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {t('exitConfirmBtn')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    className="bg-white border border-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {t('exitCancelBtn')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
