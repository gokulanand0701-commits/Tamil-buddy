import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Sparkles, CheckCircle2, RotateCcw, Shuffle, Award, ChevronRight, Lock, Check, HelpCircle } from 'lucide-react';
import { MOCK_SENTENCES, SentenceItem } from '../../mocks/mockSentences';
import { soundService } from '../../services/soundService';
import { useTranslation } from '../../hooks/useTranslation';
import confetti from 'canvas-confetti';

export const SentenceLab: React.FC = () => {
  const { t, isTamil } = useTranslation();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [unlockedLevels, setUnlockedLevels] = useState<{ easy: boolean; medium: boolean; hard: boolean }>({
    easy: true,
    medium: false,
    hard: false,
  });

  const [questionIndex, setQuestionIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState<'unscramble' | 'tricky_quiz'>('unscramble');

  // Filter sentences by chosen difficulty (10 sentences each)
  const currentLevelSentences = MOCK_SENTENCES.filter((s) => s.difficulty === selectedDifficulty);
  const activeSentence = currentLevelSentences[questionIndex] || currentLevelSentences[0];

  const [placedWords, setPlacedWords] = useState<Array<{ id: string; tamil: string; translit: string }>>([]);
  const [availableWords, setAvailableWords] = useState<Array<{ id: string; tamil: string; translit: string }>>(() => {
    return [...activeSentence.words].sort(() => Math.random() - 0.5);
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);

  // Level Up Dialog
  const [showLevelUpDialog, setShowLevelUpDialog] = useState<{ isOpen: boolean; nextLevel: 'medium' | 'hard' | 'master' }>({
    isOpen: false,
    nextLevel: 'medium',
  });

  const loadSentence = (idx: number) => {
    soundService.playClick();
    setQuestionIndex(idx);
    const sentence = currentLevelSentences[idx] || currentLevelSentences[0];
    setPlacedWords([]);
    setAvailableWords([...sentence.words].sort(() => Math.random() - 0.5));
    setIsSuccess(false);
    setFeedback(null);
    setSelectedQuizOption(null);
    setIsQuizCorrect(null);
  };

  const handleDifficultyChange = (diff: 'easy' | 'medium' | 'hard') => {
    if (!unlockedLevels[diff]) {
      soundService.playIncorrect();
      return;
    }
    soundService.playClick();
    setSelectedDifficulty(diff);
    setQuestionIndex(0);
    const newSentences = MOCK_SENTENCES.filter((s) => s.difficulty === diff);
    if (newSentences.length > 0) {
      setPlacedWords([]);
      setAvailableWords([...newSentences[0].words].sort(() => Math.random() - 0.5));
      setIsSuccess(false);
      setFeedback(null);
      setSelectedQuizOption(null);
      setIsQuizCorrect(null);
    }
  };

  const handleSpeakSentence = (text: string) => {
    soundService.playClick();
    soundService.speakTamil(text);
  };

  const handleSelectWord = (word: { id: string; tamil: string; translit: string }) => {
    soundService.playClick();
    soundService.speakTamil(word.tamil);
    const newPlaced = [...placedWords, word];
    setPlacedWords(newPlaced);
    setAvailableWords((prev) => prev.filter((w) => w.id !== word.id));

    // If all placed, auto-check
    if (newPlaced.length === activeSentence.words.length) {
      const constructed = newPlaced.map((w) => w.tamil).join(' ').trim();
      if (constructed === activeSentence.tamil.trim()) {
        soundService.playCorrect();
        setIsSuccess(true);
        setFeedback(isTamil ? 'அற்புதம்! மிகச் சரியான வாக்கியம்! 🎉' : 'Brilliant! Perfect sentence matched! 🎉');

        // Check if 10th question finished
        checkProgressionOnSuccess();
      } else {
        soundService.playIncorrect();
        setFeedback(isTamil ? 'கிட்டத்தட்ட சரிதான்! சொற்களை மாற்றி அமைத்துப் பாருங்கள். 🦜' : 'Almost there! Try rearranging the tiles. 🦜');
      }
    }
  };

  const handleRemoveWord = (word: { id: string; tamil: string; translit: string }) => {
    soundService.playClick();
    setPlacedWords((prev) => prev.filter((w) => w.id !== word.id));
    setAvailableWords((prev) => [...prev, word]);
    setIsSuccess(false);
    setFeedback(null);
  };

  const handleQuizAnswer = (option: string) => {
    if (!activeSentence.tricky_quiz) return;
    soundService.playClick();
    soundService.speakTamil(option);
    setSelectedQuizOption(option);

    if (option === activeSentence.tricky_quiz.correct_answer) {
      soundService.playCorrect();
      setIsQuizCorrect(true);
      setFeedback(isTamil ? 'சரியான விடை! மிக நன்று! 🌟' : 'Correct answer! Super job! 🌟');
      checkProgressionOnSuccess();
    } else {
      soundService.playIncorrect();
      setIsQuizCorrect(false);
      setFeedback(isTamil ? 'தவறான விடை, மீண்டும் முயற்சி செய்யுங்கள்! 🦜' : 'Incorrect, try again! 🦜');
    }
  };

  const checkProgressionOnSuccess = () => {
    // If completing the 10th question of Easy
    if (selectedDifficulty === 'easy' && questionIndex === currentLevelSentences.length - 1) {
      setUnlockedLevels((prev) => ({ ...prev, medium: true }));
      setShowLevelUpDialog({ isOpen: true, nextLevel: 'medium' });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else if (selectedDifficulty === 'medium' && questionIndex === currentLevelSentences.length - 1) {
      setUnlockedLevels((prev) => ({ ...prev, hard: true }));
      setShowLevelUpDialog({ isOpen: true, nextLevel: 'hard' });
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleProceedToNextLevel = (next: 'medium' | 'hard' | 'master') => {
    setShowLevelUpDialog({ isOpen: false, nextLevel: 'medium' });
    if (next === 'medium') {
      handleDifficultyChange('medium');
    } else if (next === 'hard') {
      handleDifficultyChange('hard');
    }
  };

  const handleNextQuestion = () => {
    if (questionIndex + 1 < currentLevelSentences.length) {
      loadSentence(questionIndex + 1);
    }
  };

  const handleReset = () => {
    soundService.playClick();
    setPlacedWords([]);
    setAvailableWords([...activeSentence.words].sort(() => Math.random() - 0.5));
    setIsSuccess(false);
    setFeedback(null);
    setSelectedQuizOption(null);
    setIsQuizCorrect(null);
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-8 border-3 border-purple-200 shadow-card w-full my-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 border border-purple-200 px-3.5 py-1 rounded-full text-xs font-black mb-1.5 shadow-xs">
            <Sparkles size={14} className="text-purple-600" />
            <span>{isTamil ? '10 கேள்விகள் கொண்ட படிநிலைப் பயிற்சி' : 'LEVEL-BY-LEVEL 10-QUESTION LAB'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {t('sentenceLabTitle')} 🧩
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {isTamil
              ? 'எளிய 10 கேள்விகளை முடித்து நடுத்தர நிலையைத் திறக்கவும்!'
              : 'Complete 10 questions in Easy to unlock 10 Medium questions, and then Hard!'}
          </p>
        </div>

        {/* Level Progression Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl shrink-0 border border-slate-200">
          {/* Easy */}
          <button
            type="button"
            onClick={() => handleDifficultyChange('easy')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              selectedDifficulty === 'easy'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🌱</span>
            <span>Easy (10 Qs)</span>
          </button>

          {/* Medium */}
          <button
            type="button"
            onClick={() => handleDifficultyChange('medium')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              selectedDifficulty === 'medium'
                ? 'bg-amber-400 text-slate-900 shadow-sm cursor-pointer'
                : unlockedLevels.medium
                ? 'text-slate-600 hover:text-slate-900 cursor-pointer'
                : 'text-slate-400 opacity-60 cursor-not-allowed'
            }`}
          >
            {unlockedLevels.medium ? <span>🌿</span> : <Lock size={12} />}
            <span>Medium (10 Qs)</span>
          </button>

          {/* Hard */}
          <button
            type="button"
            onClick={() => handleDifficultyChange('hard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
              selectedDifficulty === 'hard'
                ? 'bg-purple-600 text-white shadow-sm cursor-pointer'
                : unlockedLevels.hard
                ? 'text-slate-600 hover:text-slate-900 cursor-pointer'
                : 'text-slate-400 opacity-60 cursor-not-allowed'
            }`}
          >
            {unlockedLevels.hard ? <span>🏔️</span> : <Lock size={12} />}
            <span>Hard (10 Qs)</span>
          </button>
        </div>
      </div>

      {/* Progress & Stepper Bar */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 bg-white border border-slate-300 px-3 py-1 rounded-xl shadow-xs">
            {isTamil ? `கேள்வி ${questionIndex + 1} / 10` : `Question ${questionIndex + 1} of 10`}
          </span>
          <span className="text-xs font-bold text-teal-700">
            {Math.round(((questionIndex + 1) / 10) * 100)}% {isTamil ? 'நிறைவு' : 'Completed'}
          </span>
        </div>

        {/* Question Selector Numbers (1 to 10) */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {currentLevelSentences.map((_, idx) => (
            <button
              key={idx}
              onClick={() => loadSentence(idx)}
              className={`w-7 h-7 rounded-xl font-black text-xs transition-all cursor-pointer ${
                idx === questionIndex
                  ? 'bg-amber-400 text-slate-900 shadow-sm scale-110 ring-2 ring-amber-300'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Interactive Mode Toggle: Unscramble vs Tricky Fill-in */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 text-xs font-extrabold">
          <button
            onClick={() => setPracticeMode('unscramble')}
            className={`px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
              practiceMode === 'unscramble' ? 'bg-teal-500 text-white' : 'text-slate-600'
            }`}
          >
            🧩 Unscramble
          </button>
          <button
            onClick={() => setPracticeMode('tricky_quiz')}
            className={`px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
              practiceMode === 'tricky_quiz' ? 'bg-purple-600 text-white' : 'text-slate-600'
            }`}
          >
            🎯 Tricky Quiz
          </button>
        </div>
      </div>

      {/* Target Sentence 3-Layer Showcase Card */}
      <div className="bg-gradient-to-br from-amber-50 via-teal-50 to-sky-50 rounded-3xl p-6 border-2 border-slate-200 mb-6 shadow-inner relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            {/* Layer 1: Tamil Script */}
            <div className="flex items-center gap-3">
              <span className="font-tamil font-black text-2xl sm:text-3xl text-slate-900">
                {activeSentence.tamil}
              </span>
              <button
                type="button"
                onClick={() => handleSpeakSentence(activeSentence.tamil)}
                className="w-10 h-10 rounded-2xl bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                title={t('listenSentence')}
              >
                <Volume2 size={20} />
              </button>
            </div>

            {/* Layer 2: Transliteration */}
            <div className="text-sm font-bold text-teal-800">
              <span className="opacity-70">Phonetics: </span>
              {activeSentence.transliteration}
            </div>

            {/* Layer 3: English Meaning */}
            <div className="text-sm font-semibold text-slate-700 bg-white/80 px-3 py-1.5 rounded-xl border border-white/60 inline-block shadow-xs">
              💡 {activeSentence.meaning}
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shrink-0 ${
              activeSentence.difficulty === 'easy'
                ? 'bg-emerald-100 text-emerald-800'
                : activeSentence.difficulty === 'medium'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            {activeSentence.difficulty}
          </span>
        </div>
      </div>

      {/* MODE 1: Unscramble Puzzle */}
      {practiceMode === 'unscramble' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              {t('unscramblePrompt')}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-extrabold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>{t('resetOrder')}</span>
            </button>
          </div>

          {/* Answer Placement Box */}
          <div className="min-h-[70px] bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-3 flex flex-wrap items-center gap-2.5 transition-all">
            {placedWords.length === 0 ? (
              <span className="text-xs font-bold text-slate-400 italic px-2">
                {t('tapToSpeak')}
              </span>
            ) : (
              placedWords.map((word) => (
                <motion.button
                  key={word.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={() => handleRemoveWord(word)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 border-b-4 border-amber-600 px-4 py-2 rounded-2xl font-black text-sm shadow-sm cursor-pointer flex flex-col items-center"
                >
                  <span className="font-tamil">{word.tamil}</span>
                  <span className="text-[10px] font-semibold opacity-75">{word.translit}</span>
                </motion.button>
              ))
            )}
          </div>

          {/* Feedback message */}
          {feedback && (
            <div
              className={`p-3 rounded-2xl text-xs font-black text-center ${
                isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {feedback}
            </div>
          )}

          {/* Available Words Shelf */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {availableWords.map((word) => (
              <motion.button
                key={word.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectWord(word)}
                className="bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-400 text-slate-800 px-4 py-2.5 rounded-2xl font-black text-sm shadow-sm cursor-pointer flex flex-col items-center transition-all"
              >
                <span className="font-tamil">{word.tamil}</span>
                <span className="text-[10px] font-semibold text-slate-400">{word.translit}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: Tricky Fill-in-the-Blank Challenge */}
      {practiceMode === 'tricky_quiz' && activeSentence.tricky_quiz && (
        <div className="space-y-4 bg-purple-50/50 border-2 border-purple-200 rounded-3xl p-5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-100 text-purple-700 text-lg">🎯</span>
            <span className="text-xs font-black uppercase text-purple-900 tracking-wider">
              {isTamil ? 'சரியான விடையைத் தேர்ந்தெடுக்கவும்' : 'Tricky Challenge: Pick the missing word'}
            </span>
          </div>

          {/* Sentence with blank */}
          <div className="bg-white p-4 rounded-2xl border border-purple-200 text-center font-tamil font-black text-2xl text-purple-950">
            {activeSentence.tricky_quiz.sentence_blank}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeSentence.tricky_quiz.options.map((opt, idx) => {
              const isSelected = selectedQuizOption === opt;
              const isRight = opt === activeSentence.tricky_quiz?.correct_answer;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuizAnswer(opt)}
                  className={`p-3.5 rounded-2xl font-tamil font-black text-lg sm:text-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? isRight
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300'
                        : 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                      : 'bg-white hover:bg-purple-100 border-purple-200 text-slate-800 hover:border-purple-400'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-2xl text-xs font-black text-center ${
                isQuizCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {feedback}
            </div>
          )}
        </div>
      )}

      {/* Next Question Navigation */}
      <div className="flex justify-end pt-4">
        {questionIndex + 1 < currentLevelSentences.length && (
          <button
            type="button"
            onClick={handleNextQuestion}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-900 font-black px-5 py-2.5 rounded-2xl text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>{isTamil ? 'அடுத்த கேள்வி ➔' : 'Next Question ➔'}</span>
          </button>
        )}
      </div>

      {/* Level Up Celebration Dialog */}
      <AnimatePresence>
        {showLevelUpDialog.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-4xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-300 text-center space-y-4"
            >
              <div className="text-6xl animate-bounce">
                🎉🏅✨
              </div>

              <h3 className="text-2xl font-black text-slate-800">
                {isTamil ? 'நிலை நிறைவு பெற்றது!' : 'Level Completed! 10/10'}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {showLevelUpDialog.nextLevel === 'medium'
                  ? (isTamil
                      ? 'அற்புதம்! நீங்கள் 10 எளிய வாக்கியங்களை வெற்றிகரமாக முடித்துள்ளீர்கள். இப்போது நடுத்தர நிலை திறக்கப்பட்டுள்ளது!'
                      : 'Brilliant! You mastered all 10 Easy questions. Level 2 (Medium 10 Sentences) is now unlocked!')
                  : (isTamil
                      ? 'சூப்பர்! நீங்கள் 10 நடுத்தர வாக்கியங்களை முடித்துவிட்டீர்கள். கடின நிலை திறக்கப்பட்டுள்ளது!'
                      : 'Amazing! You finished all 10 Medium questions. Level 3 (Hard Literature Sentences) is now unlocked!')}
              </p>

              <button
                type="button"
                onClick={() => handleProceedToNextLevel(showLevelUpDialog.nextLevel)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-white font-black py-3 rounded-2xl shadow-playful active:scale-95 transition-all cursor-pointer text-sm"
              >
                {showLevelUpDialog.nextLevel === 'medium'
                  ? 'Start 10 Medium Questions ➔'
                  : 'Start 10 Hard Questions ➔'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
