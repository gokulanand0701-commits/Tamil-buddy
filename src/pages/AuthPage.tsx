import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User, Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { KiliMascot } from '../components/common/KiliMascot';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../store/useAuthStore';
import { soundService } from '../services/soundService';

const AVATARS = [
  { id: 'kili', emoji: '🦜', label: 'Kili' },
  { id: 'tiger', emoji: '🐯', label: 'Tiger' },
  { id: 'elephant', emoji: '🐘', label: 'Elephant' },
  { id: 'peacock', emoji: '🦚', label: 'Peacock' },
  { id: 'monkey', emoji: '🐵', label: 'Monkey' },
  { id: 'cat', emoji: '🐱', label: 'Cat' },
];

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      soundService.playVictory();
      setSuccessMessage('Welcome back! Loading your Tamil adventure...');
      setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (err: any) {
      soundService.playIncorrect();
      const message =
        err?.message ||
        'Account not found. You must register first before you can log in!';
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

      soundService.playVictory();
      setSuccessMessage('Account created successfully! Loading your dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err: any) {
      soundService.playIncorrect();
      const message = err?.message || 'Registration failed. Please check your details.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100/60 via-amber-50 to-white flex flex-col justify-center items-center p-4 py-8">
      {/* Background Decorative Rings */}
      <div className="fixed -top-32 -left-32 w-80 h-80 bg-turmeric-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 w-80 h-80 bg-teal-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border-4 border-amber-200 relative overflow-hidden">
        {/* Mascot Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <KiliMascot
            mood={errorMessage ? 'sad' : successMessage ? 'celebrate' : 'happy'}
            size="md"
            className="mb-1"
          />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-1.5 justify-center">
            Tamil Buddy
            <span className="font-tamil text-xl text-teal-600">தமிழ் தோழன்</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
            {mode === 'login'
              ? 'Log in to continue your Tamil learning journey!'
              : 'Create your account and start speaking Tamil with Kili!'}
          </p>
        </div>

        {/* Mode Selector Tabs (Log In vs Register) */}
        <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-amber-400 text-slate-900 shadow-md scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`flex-1 py-2.5 rounded-xl font-extrabold text-sm transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-amber-400 text-slate-900 shadow-md scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register (New)
          </button>
        </div>

        {/* Error Alert Banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 bg-rose-50 border-2 border-rose-300 text-rose-800 p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-start gap-2.5"
            >
              <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {mode === 'login' && errorMessage.toLowerCase().includes('register first') && (
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('register')}
                    className="block mt-1 text-xs font-black text-rose-900 underline hover:text-rose-950"
                  >
                    Click here to Register now 👉
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5"
            >
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM: LOGIN */}
        {mode === 'login' && (
          <motion.form
            key="login-form"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleLoginSubmit}
            className="flex flex-col gap-4"
          >
            {/* Email Field */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ananya@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              icon={<ArrowRight size={18} />}
              className="mt-2"
            >
              Log In & Learn! 🚀
            </Button>

            <div className="text-center mt-2">
              <span className="text-xs text-slate-500 font-semibold">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className="text-teal-700 font-bold hover:underline"
                >
                  Register here
                </button>
              </span>
            </div>
          </motion.form>
        )}

        {/* FORM: REGISTER */}
        {mode === 'register' && (
          <motion.form
            key="register-form"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleRegisterSubmit}
            className="flex flex-col gap-3.5"
          >
            {/* Child Name */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-1">
                Your Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ananya, Kavin"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-sm transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. child@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-1">
                Create Password (min 4 characters)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a password"
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Age Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black uppercase text-slate-500">
                  Child's Age:
                </label>
                <span className="text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  {age} years old
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={15}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
            </div>

            {/* Pick Avatar */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                Pick Your Mascot:
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setAvatar(av.id);
                    }}
                    className={`p-1.5 rounded-xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                      avatar === av.id
                        ? 'border-amber-400 bg-amber-50 scale-105 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl">{av.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Starting Level */}
            <div>
              <label className="text-xs font-black uppercase text-slate-500 block mb-1">
                Tamil Level:
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {[
                  { id: 'beginner', label: 'Beginner' },
                  { id: 'few_words', label: 'Few Words' },
                  { id: 'can_speak', label: 'Can Speak' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setLearningLevel(lvl.id as any);
                    }}
                    className={`py-1.5 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      learningLevel === lvl.id
                        ? 'bg-teal-500 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              icon={<Sparkles size={18} />}
              className="mt-2"
            >
              Register & Start Learning! 🎉
            </Button>

            <div className="text-center mt-1">
              <span className="text-xs text-slate-500 font-semibold">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="text-teal-700 font-bold hover:underline"
                >
                  Log in here
                </button>
              </span>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};
