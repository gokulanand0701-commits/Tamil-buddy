import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, Check, MapPin, Youtube, MessageSquareText, Sparkles } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { useToastStore } from '../store/useToastStore';
import { soundService } from '../services/soundService';
import { useTranslation } from '../hooks/useTranslation';
import { YouTubeClassroom } from '../components/common/YouTubeClassroom';
import { SentenceLab } from '../components/common/SentenceLab';
import { TamilSoundboard } from '../components/common/TamilSoundboard';

type TabMode = 'path' | 'sentences' | 'videos' | 'soundboard';

interface UnitGroup {
  unitNumber: number;
  title: string;
  titleTamil: string;
  color: string;
  badge_en: string;
  badge_ta: string;
}

const UNIT_GROUPS: UnitGroup[] = [
  {
    unitNumber: 1,
    title: 'Uyir Ezhuthukkal (Vowels)',
    titleTamil: 'உயிர் எழுத்துக்கள்',
    color: 'from-purple-600 via-purple-500 to-indigo-600',
    badge_en: '12 Letters',
    badge_ta: '12 எழுத்துக்கள்',
  },
  {
    unitNumber: 2,
    title: 'Mei Ezhuthukkal (Consonants)',
    titleTamil: 'மெய் எழுத்துக்கள்',
    color: 'from-teal-400 to-teal-500',
    badge_en: '18 Letters',
    badge_ta: '18 எழுத்துக்கள்',
  },
  {
    unitNumber: 3,
    title: 'Uyirmei Ezhuthukkal (Blend)',
    titleTamil: 'உயிர்மெய் எழுத்துக்கள்',
    color: 'from-sky-400 to-blue-500',
    badge_en: '216 Letters',
    badge_ta: '216 எழுத்துக்கள்',
  },
  {
    unitNumber: 4,
    title: 'First Words (Family & Food)',
    titleTamil: 'முதல் சொற்கள் (குடும்பம் & உணவு)',
    color: 'from-coral-400 to-rose-500',
    badge_en: 'Vocabulary',
    badge_ta: 'சொற்களஞ்சியம்',
  },
  {
    unitNumber: 5,
    title: 'Build the Sentence',
    titleTamil: 'வாக்கியம் அமைப்போம்',
    color: 'from-purple-400 to-purple-600',
    badge_en: 'Sentences',
    badge_ta: 'வாக்கியங்கள்',
  },
  {
    unitNumber: 6,
    title: 'Tamil Storyland',
    titleTamil: 'கதைக் களம்',
    color: 'from-emerald-400 to-emerald-600',
    badge_en: 'Folklore & Moral',
    badge_ta: 'நீதிக் கதைகள்',
  },
];

export const LearningPath: React.FC = () => {
  const navigate = useNavigate();
  const { lessons } = useProgressStore();
  const { addToast } = useToastStore();
  const { t, isTamil } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabMode>('path');

  const handleNodeClick = (lessonId: number, isLocked: boolean) => {
    if (isLocked) {
      soundService.playIncorrect();
      addToast({
        type: 'info',
        title: t('lessonLockedTitle'),
        message: t('lessonLockedMsg'),
      });
      return;
    }
    soundService.playClick();
    navigate(`/lesson/${lessonId}`);
  };

  const handleTabChange = (tab: TabMode) => {
    soundService.playClick();
    setActiveTab(tab);
  };

  // Group lessons by unit
  const lessonsByUnit = UNIT_GROUPS.map((u) => ({
    ...u,
    lessons: lessons.filter((l) => l.unit === u.unitNumber),
  }));

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto pb-16 w-full px-2 sm:px-4">
      {/* Page Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-black mb-2 shadow-xs">
          <span>✨</span>
          <span>{t('exploreBanner')}</span>
          <span>✨</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
          {t('learningPathTitle')} 🗺️
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1 max-w-xl mx-auto">
          {t('learningPathSubtitle')}
        </p>
      </div>

      {/* Interactive Feature Tabs */}
      <div className="w-full max-w-3xl bg-purple-100/60 backdrop-blur-sm p-1.5 rounded-2xl flex items-center justify-between gap-1 mb-8 shadow-inner border border-purple-200 overflow-x-auto">
        <button
          onClick={() => handleTabChange('path')}
          className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'path'
              ? 'bg-purple-600 text-white shadow-sm scale-100'
              : 'text-purple-900/70 hover:text-purple-950 hover:bg-white/50'
          }`}
        >
          <MapPin size={16} className={activeTab === 'path' ? 'text-white' : 'text-purple-500'} />
          <span>{t('tabPath')} 🗺️</span>
        </button>

        <button
          onClick={() => handleTabChange('sentences')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sentences'
              ? 'bg-white text-purple-700 shadow-sm border border-slate-200 scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <MessageSquareText size={16} className={activeTab === 'sentences' ? 'text-purple-600' : 'text-slate-400'} />
          <span>{t('tabSentences')} ✍️</span>
        </button>

        <button
          onClick={() => handleTabChange('videos')}
          className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-white text-rose-600 shadow-sm border border-slate-200 scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Youtube size={16} className={activeTab === 'videos' ? 'text-rose-600' : 'text-slate-400'} />
          <span>{t('tabVideos')} 📺</span>
        </button>

        <button
          onClick={() => handleTabChange('soundboard')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'soundboard'
              ? 'bg-white text-amber-600 shadow-sm border border-slate-200 scale-100'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Sparkles size={16} className={activeTab === 'soundboard' ? 'text-amber-500' : 'text-slate-400'} />
          <span>{t('tabSoundboard')} 🪘</span>
        </button>
      </div>

      {/* Tab 1: Duolingo Path Map */}
      {activeTab === 'path' && (
        <motion.div
          key="path"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-10 w-full max-w-2xl items-center"
        >
          {lessonsByUnit.map((unit) => {
            return (
              <div key={unit.unitNumber} className="w-full flex flex-col items-center">
                {/* Unit Header Banner */}
                <div
                  className={`w-full bg-gradient-to-r ${unit.color} text-white rounded-3xl p-5 sm:p-6 shadow-playful mb-8 flex items-center justify-between border-2 border-white/40`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full">
                        {t('unit')} {unit.unitNumber}
                      </span>
                      <span className="text-xs font-bold text-white/90">
                        {isTamil ? unit.badge_ta : unit.badge_en}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold">
                      {isTamil ? unit.titleTamil : unit.title}
                    </h2>
                    <p className="font-tamil text-sm font-semibold opacity-95">
                      {isTamil ? unit.title : unit.titleTamil}
                    </p>
                  </div>

                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl sm:text-3xl shadow-inner">
                    {unit.unitNumber === 1 && '🌟'}
                    {unit.unitNumber === 2 && '✍️'}
                    {unit.unitNumber === 3 && '🧩'}
                    {unit.unitNumber === 4 && '🍎'}
                    {unit.unitNumber === 5 && '🗣️'}
                    {unit.unitNumber === 6 && '📚'}
                  </div>
                </div>

                {/* Duolingo-style Winding Stepping Nodes */}
                <div className="flex flex-col items-center gap-6 w-full max-w-xs relative">
                  {unit.lessons.length === 0 ? (
                    <div className="bg-white/80 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center text-xs font-bold text-slate-400">
                      {t('nextLessonsSoon')}
                    </div>
                  ) : (
                    unit.lessons.map((lesson, idx) => {
                      const isCompleted = lesson.is_completed;
                      const isLocked = lesson.is_locked ?? false;
                      const isCurrent = !isCompleted && !isLocked;

                      // Alternating horizontal shift: 0 -> center, 1 -> right, 2 -> left, 3 -> center
                      const offsets = ['translate-x-0', 'translate-x-12', '-translate-x-12', 'translate-x-0'];
                      const offsetClass = offsets[idx % offsets.length];

                      return (
                        <div
                          key={lesson.id}
                          className={`flex flex-col items-center ${offsetClass} transition-all`}
                        >
                          {/* Stepping Node Button */}
                          <div className="relative">
                            {/* Active Mascot Indicator Pointer */}
                            {isCurrent && (
                              <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute -top-10 -right-8 z-10 flex flex-col items-center"
                              >
                                <span className="text-2xl">🦜</span>
                                <span className="text-[9px] font-black bg-purple-600 text-white px-1.5 py-0.2 rounded-md shadow-xs whitespace-nowrap">
                                  {t('startHere')}
                                </span>
                              </motion.div>
                            )}

                            <motion.button
                              whileHover={{ scale: isLocked ? 1 : 1.08 }}
                              whileTap={{ scale: isLocked ? 1 : 0.95 }}
                              onClick={() => handleNodeClick(lesson.id, isLocked)}
                              className={`w-20 h-20 rounded-full flex flex-col items-center justify-center font-black transition-all cursor-pointer relative shadow-lg ${
                                isCompleted
                                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-b-6 border-purple-800 hover:from-purple-400 hover:to-indigo-500'
                                  : isCurrent
                                  ? 'bg-purple-600 text-white border-b-6 border-purple-900 hover:bg-purple-500 ring-4 ring-purple-300 ring-offset-2 animate-bounce'
                                  : 'bg-slate-200 text-slate-400 border-b-6 border-slate-300 cursor-not-allowed opacity-80'
                              }`}
                            >
                              {isCompleted ? (
                                <Check size={32} strokeWidth={3} />
                              ) : isLocked ? (
                                <Lock size={28} />
                              ) : (
                                <Star size={32} className="fill-white" />
                              )}
                            </motion.button>
                          </div>

                          {/* Title & Stars Label below node */}
                          <div className="text-center mt-2 max-w-[140px]">
                            <span className="font-extrabold text-xs text-slate-800 block leading-tight">
                              {isTamil && lesson.title_tamil ? lesson.title_tamil : lesson.title}
                            </span>

                            {/* 3 Stars indicator if completed */}
                            {isCompleted && (
                              <div className="flex justify-center items-center gap-0.5 mt-1">
                                {[1, 2, 3].map((starIdx) => (
                                  <Star
                                    key={starIdx}
                                    size={12}
                                    className={
                                      starIdx <= (lesson.stars || 3)
                                        ? 'text-amber-500 fill-amber-400'
                                        : 'text-slate-300'
                                    }
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Tab 2: Easy, Medium, Hard Tamil Sentences Lab */}
      {activeTab === 'sentences' && (
        <motion.div
          key="sentences"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-4xl"
        >
          <SentenceLab />
        </motion.div>
      )}

      {/* Tab 3: YouTube Reference Video Lessons & API Key */}
      {activeTab === 'videos' && (
        <motion.div
          key="videos"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-5xl"
        >
          <YouTubeClassroom />
        </motion.div>
      )}

      {/* Tab 4: Tamil Soundboard & Thirukkural Sparkle */}
      {activeTab === 'soundboard' && (
        <motion.div
          key="soundboard"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-4xl"
        >
          <TamilSoundboard />
        </motion.div>
      )}
    </div>
  );
};
