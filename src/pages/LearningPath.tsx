import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Star,
  Check,
  MapPin,
  Youtube,
  MessageSquareText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Compass,
  ArrowRight,
  MoveHorizontal
} from 'lucide-react';
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
    color: 'from-indigo-600 via-purple-600 to-violet-600',
    badge_en: '18 Letters',
    badge_ta: '18 எழுத்துக்கள்',
  },
  {
    unitNumber: 3,
    title: 'Uyirmei Ezhuthukkal (Blend)',
    titleTamil: 'உயிர்மெய் எழுத்துக்கள்',
    color: 'from-violet-600 via-fuchsia-600 to-purple-600',
    badge_en: '216 Letters',
    badge_ta: '216 எழுத்துக்கள்',
  },
  {
    unitNumber: 4,
    title: 'First Words (Family & Food)',
    titleTamil: 'முதல் சொற்கள் (குடும்பம் & உணவு)',
    color: 'from-purple-700 via-indigo-600 to-purple-800',
    badge_en: 'Vocabulary',
    badge_ta: 'சொற்களஞ்சியம்',
  },
  {
    unitNumber: 5,
    title: 'Build the Sentence',
    titleTamil: 'வாக்கியம் அமைப்போம்',
    color: 'from-purple-600 via-purple-700 to-indigo-900',
    badge_en: 'Sentences',
    badge_ta: 'வாக்கியங்கள்',
  },
  {
    unitNumber: 6,
    title: 'Tamil Storyland',
    titleTamil: 'கதைக் களம்',
    color: 'from-indigo-700 via-purple-700 to-purple-900',
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const scrollHorizontally = (offset: number) => {
    soundService.playClick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const jumpToUnit = (unitNum: number) => {
    soundService.playClick();
    const el = document.getElementById(`unit-island-${unitNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  // Group lessons by unit
  const lessonsByUnit = UNIT_GROUPS.map((u) => ({
    ...u,
    lessons: lessons.filter((l) => l.unit === u.unitNumber),
  }));

  const completedCount = lessons.filter((l) => l.is_completed).length;

  return (
    <div className="flex flex-col items-center max-w-7xl mx-auto pb-16 w-full px-2 sm:px-4">
      {/* Page Header with Signature Purple & White Theme Box */}
      <div className="w-full bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-purple-400/40 relative overflow-hidden mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Decorative blur elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-purple-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black tracking-wide text-purple-100 mb-2 border border-white/20">
            <Sparkles size={14} className="text-amber-300 animate-spin" />
            <span>{t('exploreBanner')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            {t('learningPathTitle')} 🗺️
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 font-medium mt-1 max-w-xl">
            {t('learningPathSubtitle')}
          </p>
        </div>

        {/* Progress Pill */}
        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15 shrink-0 text-white">
          <span className="text-3xl animate-bounce">🧭</span>
          <div>
            <div className="text-xs font-black uppercase text-purple-200">
              {isTamil ? 'முன்னேற்றம்' : 'Adventure Progress'}
            </div>
            <div className="text-lg font-black text-white">
              {completedCount} / {lessons.length} {isTamil ? 'பாடங்கள்' : 'Units Cleared'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Tabs */}
      <div className="w-full max-w-3xl bg-purple-100/60 backdrop-blur-sm p-1.5 rounded-2xl flex items-center justify-between gap-1 mb-6 shadow-inner border border-purple-200 overflow-x-auto">
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
              ? 'bg-purple-600 text-white shadow-sm scale-100'
              : 'text-purple-900/70 hover:text-purple-950 hover:bg-white/50'
          }`}
        >
          <MessageSquareText size={16} className={activeTab === 'sentences' ? 'text-white' : 'text-purple-500'} />
          <span>{t('tabSentences')} ✍️</span>
        </button>

        <button
          onClick={() => handleTabChange('videos')}
          className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'videos'
              ? 'bg-purple-600 text-white shadow-sm scale-100'
              : 'text-purple-900/70 hover:text-purple-950 hover:bg-white/50'
          }`}
        >
          <Youtube size={16} className={activeTab === 'videos' ? 'text-white' : 'text-purple-500'} />
          <span>{t('tabVideos')} 📺</span>
        </button>

        <button
          onClick={() => handleTabChange('soundboard')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'soundboard'
              ? 'bg-purple-600 text-white shadow-sm scale-100'
              : 'text-purple-900/70 hover:text-purple-950 hover:bg-white/50'
          }`}
        >
          <Sparkles size={16} className={activeTab === 'soundboard' ? 'text-white' : 'text-purple-500'} />
          <span>{t('tabSoundboard')} 🪘</span>
        </button>
      </div>

      {/* Tab 1: Horizontal Adventure Path Map */}
      {activeTab === 'path' && (
        <div className="w-full flex flex-col gap-4">
          {/* Horizontal Navigation & Quick Jump Bar */}
          <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-3 border-2 border-purple-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Swipe instruction */}
            <div className="flex items-center gap-2 text-xs font-black text-purple-900">
              <MoveHorizontal size={18} className="text-purple-600 animate-pulse" />
              <span>{isTamil ? 'கிடைமட்டமாக உருட்டவும் / நகர்த்தவும் (Swipe Horizontal)' : 'Swipe or scroll left-to-right to explore units!'}</span>
            </div>

            {/* Quick Unit Jump Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
              {UNIT_GROUPS.map((u) => (
                <button
                  key={u.unitNumber}
                  type="button"
                  onClick={() => jumpToUnit(u.unitNumber)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-black bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                >
                  U{u.unitNumber}: {isTamil ? u.titleTamil.split(' ')[0] : u.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Left / Right Quick Scroll Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => scrollHorizontally(-400)}
                className="w-8 h-8 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 flex items-center justify-center font-bold transition-all active:scale-95 cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollHorizontally(400)}
                className="w-8 h-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Adventure Path Track */}
          <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto pb-8 pt-3 scroll-smooth scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100 rounded-3xl"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div className="flex items-center gap-10 sm:gap-14 min-w-max px-3 py-6">
              {lessonsByUnit.map((unit, unitIdx) => {
                return (
                  <div
                    key={unit.unitNumber}
                    id={`unit-island-${unit.unitNumber}`}
                    className="flex items-center gap-10 sm:gap-14 shrink-0"
                  >
                    {/* Unit Adventure Island Container */}
                    <div className="w-[440px] sm:w-[500px] md:w-[530px] rounded-4xl bg-white border-2 border-purple-200/90 shadow-xl overflow-hidden shrink-0 flex flex-col transition-all hover:shadow-2xl">
                      {/* Unit Header Top Card with Generous Breathing Room */}
                      <div className={`p-6 sm:p-7 bg-gradient-to-r ${unit.color} text-white flex items-center justify-between gap-4 relative overflow-hidden`}>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />

                        <div className="relative z-10 flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-[11px] font-black uppercase tracking-wider bg-white/25 backdrop-blur-xs px-3 py-0.5 rounded-full shadow-2xs">
                              {t('unit')} {unit.unitNumber}
                            </span>
                            <span className="text-[11px] font-bold text-white/95 bg-white/15 px-2.5 py-0.5 rounded-full">
                              {isTamil ? unit.badge_ta : unit.badge_en}
                            </span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black leading-snug tracking-tight text-white drop-shadow-xs">
                            {isTamil ? unit.titleTamil : unit.title}
                          </h2>
                          <p className="font-tamil text-xs sm:text-sm font-semibold text-purple-100/90 mt-1 leading-normal">
                            {isTamil ? unit.title : unit.titleTamil}
                          </p>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0 relative z-10 border border-white/25">
                          {unit.unitNumber === 1 && '🌟'}
                          {unit.unitNumber === 2 && '✍️'}
                          {unit.unitNumber === 3 && '🧩'}
                          {unit.unitNumber === 4 && '🍎'}
                          {unit.unitNumber === 5 && '🗣️'}
                          {unit.unitNumber === 6 && '📚'}
                        </div>
                      </div>

                      {/* Horizontal Winding Stepping Trail inside Unit Island */}
                      <div className="p-6 sm:p-8 bg-gradient-to-b from-purple-50/40 via-white to-purple-50/30 flex items-center justify-center min-h-[260px]">
                        {unit.lessons.length === 0 ? (
                          <div className="bg-white/80 border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center text-xs font-bold text-purple-400 max-w-[280px]">
                            {t('nextLessonsSoon')}
                          </div>
                        ) : (
                          <div className="flex items-center gap-7 sm:gap-9 relative">
                            {unit.lessons.map((lesson, idx) => {
                              const isCompleted = lesson.is_completed;
                              const isLocked = lesson.is_locked ?? false;
                              const isCurrent = !isCompleted && !isLocked;

                              // Alternating vertical undulation for that adventure winding path feel!
                              const verticalOffsets = [
                                'translate-y-0',
                                'translate-y-5',
                                '-translate-y-5',
                                'translate-y-0',
                              ];
                              const offsetClass = verticalOffsets[idx % verticalOffsets.length];

                              return (
                                <div
                                  key={lesson.id}
                                  className={`flex flex-col items-center ${offsetClass} transition-all relative shrink-0`}
                                >
                                  {/* Dotted path connector to next node */}
                                  {idx < unit.lessons.length - 1 && (
                                    <div className="absolute top-10 left-full w-7 sm:w-9 border-t-4 border-dashed border-purple-300 pointer-events-none -z-0" />
                                  )}

                                  {/* Stepping Node Button */}
                                  <div className="relative">
                                    {/* Active Mascot Pointer */}
                                    {isCurrent && (
                                      <motion.div
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute -top-11 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-none"
                                      >
                                        <span className="text-2xl">🦜</span>
                                        <span className="text-[9px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-md shadow-xs whitespace-nowrap">
                                          {t('startHere')}
                                        </span>
                                      </motion.div>
                                    )}

                                    <motion.button
                                      whileHover={{ scale: isLocked ? 1 : 1.1 }}
                                      whileTap={{ scale: isLocked ? 1 : 0.95 }}
                                      onClick={() => handleNodeClick(lesson.id, isLocked)}
                                      className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center font-black transition-all cursor-pointer relative shadow-lg ${
                                        isCompleted
                                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-b-6 border-purple-800 hover:from-purple-400 hover:to-indigo-500'
                                          : isCurrent
                                          ? 'bg-purple-600 text-white border-b-6 border-purple-900 hover:bg-purple-500 ring-4 ring-purple-300 ring-offset-2 animate-bounce'
                                          : 'bg-slate-200 text-slate-400 border-b-6 border-slate-300 cursor-not-allowed opacity-80'
                                      }`}
                                    >
                                      {isCompleted ? (
                                        <Check size={30} strokeWidth={3} />
                                      ) : isLocked ? (
                                        <Lock size={26} />
                                      ) : (
                                        <Star size={30} className="fill-white" />
                                      )}
                                    </motion.button>
                                  </div>

                                  {/* Title & Stars Label below node (Readable with ample width) */}
                                  <div className="text-center mt-3 w-[125px] sm:w-[135px]">
                                    <span className="font-black text-xs sm:text-[13px] text-slate-800 block leading-snug line-clamp-2">
                                      {isTamil && lesson.title_tamil ? lesson.title_tamil : lesson.title}
                                    </span>

                                    {/* 3 Stars indicator if completed */}
                                    {isCompleted && (
                                      <div className="flex justify-center items-center gap-0.5 mt-1.5">
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
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Connecting Bridge to Next Unit with Open Spacing */}
                    {unitIdx < lessonsByUnit.length - 1 && (
                      <div className="flex flex-col items-center justify-center gap-2 shrink-0 px-2">
                        <div className="w-14 sm:w-16 border-t-4 border-dashed border-purple-400/80" />
                        <div className="w-9 h-9 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center shadow-xs">
                          <span className="text-lg text-purple-700 animate-pulse font-bold">➔</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 whitespace-nowrap shadow-2xs">
                          {isTamil ? 'அடுத்த பகுதி' : `Unit ${unit.unitNumber + 1}`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
