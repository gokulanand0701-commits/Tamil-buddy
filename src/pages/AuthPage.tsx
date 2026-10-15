import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Coins,
  Snowflake,
  Clock,
  BookOpen,
  Target
} from 'lucide-react';
import { KiliMascot } from '../components/common/KiliMascot';
import { useAuthStore } from '../store/useAuthStore';
import { soundService } from '../services/soundService';

const AVATARS = [
  { id: 'kili', emoji: '🦜', label: 'கிளி (Kili)' },
  { id: 'yaanai', emoji: '🐘', label: 'யானை (Elephant)' },
  { id: 'singam', emoji: '🦁', label: 'சிங்கம் (Lion)' },
  { id: 'mayil', emoji: '🦚', label: 'மயில் (Peacock)' },
  { id: 'poonai', emoji: '🐱', label: 'பூனை (Kitten)' },
  { id: 'kurangu', emoji: '🐵', label: 'குரங்கு (Monkey)' },
];

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(8);
  const [avatar, setAvatar] = useState('kili');
  const [learningLevel, setLearningLevel] = useState<'beginner' | 'few_words' | 'can_speak'>('beginner');

  // Status feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabSwitch = (newMode: 'login' | 'register') => {
    soundService.playClick();
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      soundService.playIncorrect();
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      soundService.playCorrect();
      setSuccessMessage('Welcome back! Loading your cozy Tamil adventure...');
      setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (err: any) {
      soundService.playIncorrect();
      const message =
        err?.message ||
        'Account not found. Please register first before logging in!';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      soundService.playIncorrect();
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!email.trim()) {
      soundService.playIncorrect();
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 4) {
      soundService.playIncorrect();
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        age,
        avatar,
        learning_level: learningLevel,
      });

      soundService.playCorrect();
      setSuccessMessage('Account created successfully! Welcome to Tamil Buddy!');
      setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (err: any) {
      soundService.playIncorrect();
      const message = err?.message || 'Registration failed. Please check your details.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-x-hidden selection:bg-purple-300 selection:text-purple-950">
      
      {/* Soft Ambient Cozy Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Main Full-Screen Responsive Card (Widescreen 2-Column on Desktop) */}
      <div className="w-full max-w-6xl bg-white rounded-3xl sm:rounded-4xl shadow-2xl border-4 border-purple-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 my-4">
        
        {/* LEFT COLUMN: BRAND HERO & FEATURES SHOWCASE */}
        <div className="lg:col-span-5 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-purple-100 border border-white/20 mb-4">
              <Sparkles size={14} className="text-amber-300 animate-spin" />
              <span>இனிய தமிழ் கற்றல் தளம்</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-lg shrink-0">
                🦜
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-1.5">
                  Tamil Buddy
                </h1>
                <span className="font-tamil text-base font-bold text-purple-200">
                  தமிழ் தோழன்
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-purple-100 font-medium mt-3 leading-relaxed">
              The cozy, joyful gamified Tamil platform designed specifically for diaspora children to read, speak, and write sweet Tamil with ease!
            </p>
          </div>

          {/* Center Mascot & Interactive Features Highlights */}
          <div className="my-8 relative z-10 flex flex-col gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center text-xl shrink-0 shadow-sm">
                🪙
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  Free Coins & Treasury Shop
                </div>
                <div className="text-[11px] text-purple-200 font-medium">
                  Reassemble misplaced words to earn coins and buy streak freezes!
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-400 text-purple-950 flex items-center justify-center text-xl shrink-0 shadow-sm">
                🎯
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  Personalized Smart Review
                </div>
                <div className="text-[11px] text-purple-200 font-medium">
                  Past mistakes are queued with SM-2 spaced repetition dates.
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-emerald-950 flex items-center justify-center text-xl shrink-0 shadow-sm">
                ⏱️
              </div>
              <div>
                <div className="text-xs font-black text-white">
                  Bite-Sized 5-Min Lessons
                </div>
                <div className="text-[11px] text-purple-200 font-medium">
                  Low friction 8–10 question mini-sessions that fill fast!
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 pt-4 border-t border-purple-500/30 flex items-center gap-2 text-xs font-semibold text-purple-200">
            <span>✨</span>
            <span>Join thousands of little explorers learning Tamil today!</span>
          </div>
        </div>

        {/* RIGHT COLUMN: EXPANSIVE AUTH FORM */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          
          {/* Header Title */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-purple-950 tracking-tight">
              {mode === 'login' ? 'Welcome Back! 👋' : 'Create Your Account 🌟'}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              {mode === 'login'
                ? 'Sign in to resume your consistency streak and continue learning!'
                : 'Register your profile to unlock free lessons, games, and coin rewards!'}
            </p>
          </div>

          {/* Mode Selector Tabs (Log In vs Register) */}
          <div className="flex items-center bg-purple-50 p-1.5 rounded-2xl mb-6 border border-purple-200">
            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'text-purple-800 hover:text-purple-950'
              }`}
            >
              <span>உள்நுழை (Log In)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`flex-1 py-3 rounded-xl font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-purple-700 text-white shadow-md'
                  : 'text-purple-800 hover:text-purple-950'
              }`}
            >
              <span>புதிய பதிவு (Register New)</span>
            </button>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs sm:text-sm font-bold flex items-center gap-3"
              >
                <AlertCircle size={20} className="text-rose-600 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3"
              >
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <span className="flex-1">{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-purple-900 tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="child@tamilbuddy.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-purple-50/50 border-2 border-purple-200 focus:border-purple-600 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-purple-900 tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-purple-50/50 border-2 border-purple-200 focus:border-purple-600 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-3 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Log In to Tamil Buddy</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center mt-2">
                <span className="text-xs text-slate-500 font-semibold">
                  New to Tamil Buddy?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('register')}
                    className="text-purple-700 font-extrabold hover:underline cursor-pointer"
                  >
                    Register free here!
                  </button>
                </span>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-purple-900 tracking-wider mb-1.5">
                    Child's Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Kavin"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border-2 border-purple-200 focus:border-purple-600 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-purple-900 tracking-wider mb-1.5">
                    Age: <span className="text-purple-700 font-extrabold">{age} Years</span>
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={14}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full accent-purple-700 cursor-pointer h-2 bg-purple-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1">
                    <span>4 yrs</span>
                    <span>8 yrs (Typical)</span>
                    <span>14 yrs</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-purple-900 tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="child@tamilbuddy.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border-2 border-purple-200 focus:border-purple-600 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-purple-900 tracking-wider mb-1.5">
                  Create Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 4 characters"
                    required
                    className="w-full pl-10 pr-12 py-2.5 bg-purple-50/50 border-2 border-purple-200 focus:border-purple-600 rounded-2xl text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-black uppercase text-purple-900 tracking-wider mb-1.5">
                  Choose Favorite Avatar Companion
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setAvatar(av.id);
                      }}
                      className={`p-2 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        avatar === av.id
                          ? 'bg-purple-100 border-purple-600 shadow-md scale-105'
                          : 'bg-white border-purple-200 hover:border-purple-400'
                      }`}
                    >
                      <span className="text-2xl">{av.emoji}</span>
                      <span className="text-[10px] font-bold text-purple-950 truncate max-w-full">
                        {av.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Level Selector */}
              <div>
                <label className="block text-xs font-black uppercase text-purple-900 tracking-wider mb-1.5">
                  Current Tamil Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'beginner', title: 'Absolute Beginner', desc: 'No Tamil at home' },
                    { id: 'few_words', title: 'Knows Few Words', desc: 'Understands basics' },
                    { id: 'can_speak', title: 'Conversational', desc: 'Wants to read & write' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        soundService.playClick();
                        setLearningLevel(lvl.id as any);
                      }}
                      className={`p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        learningLevel === lvl.id
                          ? 'bg-purple-100 border-purple-600 shadow-sm'
                          : 'bg-white border-purple-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="text-xs font-black text-purple-950 leading-tight">
                        {lvl.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        {lvl.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Create Account & Start Learning</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-xs text-slate-500 font-semibold">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('login')}
                    className="text-purple-700 font-extrabold hover:underline cursor-pointer"
                  >
                    Log in here!
                  </button>
                </span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
