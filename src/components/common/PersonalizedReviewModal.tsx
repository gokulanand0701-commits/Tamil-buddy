import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Volume2,
  HelpCircle,
  Trophy,
  ArrowRight,
  Target
} from 'lucide-react';
import { mistakeService, MistakeReviewItem } from '../../services/mistakeService';
import { soundService } from '../../services/soundService';
import { useAuthStore } from '../../store/useAuthStore';
import { useTranslation } from '../../hooks/useTranslation';

interface PersonalizedReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PersonalizedReviewModal: React.FC<PersonalizedReviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCoins, updateUser, user } = useAuthStore();
  const { isTamil } = useTranslation();

  const [allMistakes, setAllMistakes] = useState<MistakeReviewItem[]>([]);
  const [dueMistakes, setDueMistakes] = useState<MistakeReviewItem[]>([]);
  const [activeTab, setActiveTab] = useState<'practice' | 'table'>('practice');

  // Interactive Quiz mode state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [coinsWon, setCoinsWon] = useState(0);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    const all = mistakeService.getMistakes();
    const due = mistakeService.getDueMistakes();
    setAllMistakes(all);
    setDueMistakes(due);
    setCurrentIndex(0);
    setSelectedOption(null);
    setFeedback(null);
    setShowHint(false);
    setSessionCompleted(false);
    setCoinsWon(0);
  };

  if (!isOpen) return null;

  const currentItem = dueMistakes[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (feedback !== null || !currentItem) return;
    soundService.playClick();
    setSelectedOption(opt);

    const isCorrect = opt === currentItem.target_answer;

    if (isCorrect) {
      soundService.playCorrect();
      setFeedback('correct');
      mistakeService.resolveMistake(currentItem.id, true);

      // Award bonus XP & Coins
      addCoins(2);
      if (user) {
        updateUser({ xp: user.xp + 5 });
      }
      setCoinsWon((prev) => prev + 2);
    } else {
      soundService.playIncorrect();
      setFeedback('wrong');
      mistakeService.resolveMistake(currentItem.id, false);
    }
  };

  const handleNext = () => {
    soundService.playClick();
    setSelectedOption(null);
    setFeedback(null);
    setShowHint(false);

    if (currentIndex + 1 < dueMistakes.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      soundService.playVictory();
      setAllMistakes(mistakeService.getMistakes());
      setDueMistakes(mistakeService.getDueMistakes());
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
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-md">
              <Target size={24} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-purple-950 tracking-tight flex items-center gap-2">
                <span>{isTamil ? 'தனிப்பயனாக்கிய மறுபயிற்சி' : 'Personalized Smart Review'}</span>
                <span className="text-xs bg-purple-100 text-purple-900 border border-purple-300 font-extrabold px-2.5 py-0.5 rounded-full">
                  🧠 {isTamil ? 'நினைவூட்டல்' : 'SM-2 Repetition'}
                </span>
              </h2>
              <p className="text-xs text-purple-700 font-semibold">
                {isTamil
                  ? 'நீங்கள் செய்த தவறுகள் சேமிக்கப்பட்டு, அடுத்த மறுபயிற்சி தேதியுடன் வரிசைப்படுத்தப்பட்டுள்ளது!'
                  : 'Past mistakes are queued automatically and shown again at optimal review intervals!'}
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

        {/* Tab switch: Practice Session vs Mistakes Table */}
        <div className="flex items-center bg-purple-50 p-1.5 rounded-2xl border border-purple-200">
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              setActiveTab('practice');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'practice'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-purple-800 hover:text-purple-950'
            }`}
          >
            <RotateCcw size={15} />
            <span>
              {isTamil ? 'இன்றைய மறுபயிற்சி' : 'Practice Due Mistakes'} ({dueMistakes.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              setActiveTab('table');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'table'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-purple-800 hover:text-purple-950'
            }`}
          >
            <Calendar size={15} />
            <span>
              {isTamil ? 'தவறுகள் அட்டவணை' : 'Mistakes Review Table'} ({allMistakes.length})
            </span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE PRACTICE SESSION */}
        {activeTab === 'practice' && (
          <div className="flex flex-col gap-4">
            {dueMistakes.length === 0 || sessionCompleted ? (
              <div className="p-8 text-center flex flex-col items-center gap-3 bg-gradient-to-br from-purple-50 to-emerald-50 rounded-3xl border-2 border-emerald-300">
                <span className="text-5xl animate-bounce">🎉</span>
                <h3 className="text-xl font-black text-purple-950">
                  {isTamil ? 'அனைத்து தவறுகளும் சரிசெய்யப்பட்டன!' : 'All Caught Up! No Mistakes Due!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-md">
                  {isTamil
                    ? `அற்புதம்! நீங்கள் சிறந்த முன்னேற்றம் அடைந்துள்ளீர்கள். வென்ற நாணயங்கள்: +${coinsWon} 🪙`
                    : `Great job mastering your tricky words! Your next review interval has been scheduled. Won +${coinsWon} free coins! 🪙`}
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {isTamil ? 'பயிற்சிக்குத் திரும்பு' : 'Back to Lessons'}
                </button>
              </div>
            ) : currentItem ? (
              <div className="flex flex-col gap-4 bg-purple-50/50 p-5 rounded-3xl border-2 border-purple-200">
                
                {/* Progress in session */}
                <div className="flex items-center justify-between text-xs font-black text-purple-900">
                  <span>
                    {isTamil ? 'கேள்வி' : 'Review Card'} {currentIndex + 1} / {dueMistakes.length}
                  </span>
                  <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                    🪙 +2 {isTamil ? 'நாணயங்கள்' : 'Coins on Correct'}
                  </span>
                </div>

                {/* Question Prompt */}
                <div className="bg-white p-5 rounded-2xl border-2 border-purple-200 shadow-sm text-center">
                  <div className="text-xs font-extrabold text-purple-700 uppercase tracking-wider mb-1">
                    {currentItem.category.toUpperCase()} PRACTICE
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-purple-950 mb-1">
                    {currentItem.question_tamil}
                  </h4>
                  <p className="text-xs font-semibold text-slate-600">
                    {currentItem.question_english}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-2 bg-rose-50 text-rose-800 px-3 py-1 rounded-xl text-xs font-bold border border-rose-200">
                    <span>❌ {isTamil ? 'உங்கள் முந்தைய தவறு:' : 'Your previous answer:'}</span>
                    <span className="font-tamil font-black text-sm">{currentItem.user_attempt}</span>
                  </div>
                </div>

                {/* Multiple Choice Options */}
                <div className="grid grid-cols-2 gap-3">
                  {currentItem.options.map((opt) => {
                    const isSelected = selectedOption === opt;
                    const isTarget = opt === currentItem.target_answer;

                    let btnStyle = 'bg-white hover:bg-purple-100/70 border-2 border-purple-200 text-purple-950';

                    if (feedback !== null) {
                      if (isTarget) {
                        btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md scale-102';
                      } else if (isSelected && !isTarget) {
                        btnStyle = 'bg-rose-500 text-white border-2 border-rose-600';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        disabled={feedback !== null}
                        className={`p-4 rounded-2xl font-tamil text-2xl sm:text-3xl font-black shadow-xs transition-all cursor-pointer flex items-center justify-center ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Hint Button */}
                {!showHint && feedback === null && (
                  <button
                    type="button"
                    onClick={() => {
                      soundService.playClick();
                      setShowHint(true);
                    }}
                    className="flex items-center justify-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-bold self-center cursor-pointer"
                  >
                    <HelpCircle size={14} />
                    <span>{isTamil ? 'குறிப்பு வேண்டுமா?' : 'Need a hint?'}</span>
                  </button>
                )}

                {/* Hint Box */}
                {showHint && feedback === null && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-center"
                  >
                    <p className="text-xs font-bold text-amber-900">{currentItem.hint_tamil}</p>
                    <p className="text-[11px] font-medium text-slate-600">{currentItem.hint_english}</p>
                  </motion.div>
                )}

                {/* Feedback & Next Button */}
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                      feedback === 'correct'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                        : 'bg-rose-50 border-rose-400 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {feedback === 'correct' ? (
                        <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle size={22} className="text-rose-600 shrink-0" />
                      )}
                      <div>
                        <div className="text-xs sm:text-sm font-black">
                          {feedback === 'correct'
                            ? isTamil ? 'அற்புதம்! சரியாக திருத்திவிட்டீர்கள்! (+2 🪙)' : 'Correct! Mistake Mastered! (+2 🪙)'
                            : isTamil ? 'மீண்டும் தவறாகிவிட்டது, தொடர்ந்து கற்போம்!' : 'Not quite yet! Kept in today\'s queue.'}
                        </div>
                        <div className="text-[11px] font-semibold opacity-80">
                          {isTamil ? 'சரியான விடை:' : 'Correct answer:'} {currentItem.target_answer}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>{isTamil ? 'அடுத்தது' : 'Next'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </motion.div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 2: MISTAKES QUEUE & REVIEW SCHEDULE TABLE */}
        {activeTab === 'table' && (
          <div className="flex flex-col gap-3">
            <div className="overflow-x-auto rounded-2xl border-2 border-purple-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-purple-100 text-purple-950 font-black uppercase tracking-wider text-[11px]">
                    <th className="p-3">Item / Target</th>
                    <th className="p-3">Previous Error</th>
                    <th className="p-3">Next Review Date</th>
                    <th className="p-3">Interval (SM-2)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 bg-white font-medium text-slate-800">
                  {allMistakes.map((m) => (
                    <tr key={m.id} className="hover:bg-purple-50/50 transition-colors">
                      <td className="p-3">
                        <span className="font-tamil font-black text-base text-purple-950 block">
                          {m.target_answer}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {m.question_english.substring(0, 30)}...
                        </span>
                      </td>
                      <td className="p-3 text-rose-600 font-bold font-tamil text-sm">
                        {m.user_attempt}
                      </td>
                      <td className="p-3">
                        <span className="bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-lg font-bold text-[11px]">
                          {m.next_review_date}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-600">
                        {m.interval_days} day(s)
                      </td>
                      <td className="p-3">
                        {m.is_mastered ? (
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-black">
                            ⭐ Mastered
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[10px] font-black">
                            🎯 Due {m.repetitions}/3
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
