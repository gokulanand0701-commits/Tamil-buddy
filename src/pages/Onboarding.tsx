import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { KiliMascot } from '../components/common/KiliMascot';
import { useAuthStore } from '../store/useAuthStore';
import { soundService } from '../services/soundService';

const AVATARS = [
  { id: 'kili', emoji: '🦜', label: 'Kili (Parrot)' },
  { id: 'tiger', emoji: '🐯', label: 'Veeran (Tiger)' },
  { id: 'elephant', emoji: '🐘', label: 'Chinnu (Elephant)' },
  { id: 'peacock', emoji: '🦚', label: 'Mayil (Peacock)' },
  { id: 'monkey', emoji: '🐵', label: 'Vanthu (Monkey)' },
  { id: 'cat', emoji: '🐱', label: 'Meenu (Cat)' },
];

const LEVELS = [
  {
    id: 'beginner',
    title: 'Beginner',
    title_tamil: 'புதிதாக கற்கிறேன்',
    desc: 'I am completely new to Tamil letters and sounds!',
    badge: '🌱 Fresh Start',
  },
  {
    id: 'few_words',
    title: 'Knows few words',
    title_tamil: 'சில சொற்கள் தெரியும்',
    desc: 'I know words like Amma, Appa and some basic foods.',
    badge: '🌿 Growing Learner',
  },
  {
    id: 'can_speak',
    title: 'Can speak a bit',
    title_tamil: 'கொஞ்சம் பேசுவேன்',
    desc: 'I understand Tamil when parents speak and want to read & write.',
    badge: '🌳 Chatty Buddy',
  },
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAvatar, setSelectedAvatar] = useState('kili');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(8);
  const [learningLevel, setLearningLevel] = useState<'beginner' | 'few_words' | 'can_speak'>('beginner');

  const handleNextFromStep1 = () => {
    soundService.playClick();
    setStep(2);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    soundService.playClick();
    setStep(3);
  };

  const handleFinishOnboarding = async () => {
    soundService.playVictory();
    const cleanName = name.trim() || 'Tamil Learner';
    await register({
      name: cleanName,
      email: `${cleanName.toLowerCase().replace(/\s+/g, '')}@tamilbuddy.app`,
      password: 'password123',
      age,
      avatar: selectedAvatar,
      learning_level: learningLevel,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100/70 via-amber-50 to-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border-4 border-amber-200 relative overflow-hidden">
        {/* Progress Bar Indicator */}
        <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* STEP 1: Pick Avatar */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center text-center"
          >
            <KiliMascot mood="happy" size="md" className="mb-2" />
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              வணக்கம்! Welcome to Tamil Buddy! 🦜
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-6 font-medium">
              Pick your playful buddy avatar to start learning:
            </p>

            <div className="grid grid-cols-3 gap-3 w-full mb-6">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setSelectedAvatar(av.id);
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 scale-105 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-4xl mb-1">{av.emoji}</span>
                    <span className="text-[11px] font-bold text-slate-700">{av.label}</span>
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleNextFromStep1}
              icon={<ArrowRight size={18} />}
            >
              Next: What's your name?
            </Button>
          </motion.div>
        )}

        {/* STEP 2: Name & Age */}
        {step === 2 && (
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleNextFromStep2}
            className="flex flex-col items-center text-center"
          >
            <div className="text-5xl mb-2">
              {AVATARS.find((a) => a.id === selectedAvatar)?.emoji || '🦜'}
            </div>
            <h2 className="text-2xl font-black text-slate-800">Tell us about yourself!</h2>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Kili will cheer you on with your name!
            </p>

            <div className="w-full text-left mb-4">
              <label className="text-xs font-extrabold uppercase text-slate-500 block mb-1.5">
                Your First Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ananya, Kavin, Liam"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-amber-400 focus:outline-none font-bold text-slate-800 text-base shadow-sm"
              />
            </div>

            <div className="w-full text-left mb-6">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-extrabold uppercase text-slate-500">
                  How old are you?
                </label>
                <span className="text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
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
              <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-1">
                <span>4 yrs</span>
                <span>8 yrs</span>
                <span>12+ yrs</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!name.trim()}
              icon={<ArrowRight size={18} />}
            >
              Next: Choose Starting Level
            </Button>
          </motion.form>
        )}

        {/* STEP 3: Choose Level */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="text-2xl font-black text-slate-800">Where shall we begin?</h2>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              Pick the stage that describes your Tamil right now:
            </p>

            <div className="flex flex-col gap-3 w-full mb-6">
              {LEVELS.map((lvl) => {
                const isSelected = learningLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setLearningLevel(lvl.id as any);
                    }}
                    className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/80 shadow-md ring-2 ring-amber-300'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-extrabold text-sm text-slate-800">{lvl.title}</span>
                      <span className="text-[10px] font-bold bg-white text-teal-700 px-2 py-0.5 rounded-full border border-teal-200">
                        {lvl.badge}
                      </span>
                    </div>
                    <span className="font-tamil text-xs text-teal-700 font-semibold mb-1">
                      {lvl.title_tamil}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{lvl.desc}</span>
                  </button>
                );
              })}
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleFinishOnboarding}
              icon={<Sparkles size={18} />}
            >
              Start Learning with Kili!
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
