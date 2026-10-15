import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Coins, Timer, Sparkles, BookOpen } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { useAuthStore } from '../store/useAuthStore';
import { lessonService } from '../services/lessonService';
import { mistakeService } from '../services/mistakeService';
import { LetterTracing } from '../components/exercises/LetterTracing';
import { ListenAndPick } from '../components/exercises/ListenAndPick';
import { MatchPairs } from '../components/exercises/MatchPairs';
import { SpeakIt } from '../components/exercises/SpeakIt';
import { BuildSentence } from '../components/exercises/BuildSentence';
import { soundService } from '../services/soundService';

export const LessonPlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getLessonById = useProgressStore((state) => state.getLessonById);
  const completeLesson = useProgressStore((state) => state.completeLesson);
  const addCoins = useAuthStore((state) => state.addCoins);

  const lessonId = Number(id) || 1;
  const lesson = getLessonById(lessonId);

  // 5-Min Max Quick Mini-Session (300 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [exerciseScores, setExerciseScores] = useState<number[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Short Lessons: Split content into 8-10 question mini-sessions max
  const activeExercises = useMemo(() => {
    if (!lesson?.exercises) return [];
    return lesson.exercises.slice(0, 10);
  }, [lesson]);

  if (!lesson || !activeExercises || activeExercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white/90 backdrop-blur-md rounded-3xl border-2 border-purple-200">
        <span className="text-4xl mb-3">🦜❓</span>
        <h2 className="text-xl font-bold text-slate-800">Lesson not found</h2>
        <p className="text-xs text-slate-500 mb-4">Let's head back to the learning path!</p>
        <button
          onClick={() => navigate('/learn')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-2xl shadow-md transition-transform active:scale-95"
        >
          Return to Path
        </button>
      </div>
    );
  }

  const currentExercise = activeExercises[currentStepIndex];
  const totalExercises = activeExercises.length;
  const progressPercent = ((currentStepIndex + 1) / totalExercises) * 100;

  const handleExerciseComplete = async (score: number) => {
    const updatedScores = [...exerciseScores, score];
    setExerciseScores(updatedScores);

    // Personalized Review: If wrong or imperfect score, queue mistake into spaced repetition table
    if (score < 80) {
      mistakeService.recordMistake({
        category:
          currentExercise.type === 'letter_trace'
            ? 'letter'
            : currentExercise.type === 'build_sentence'
            ? 'sentence'
            : 'word',
        question_tamil: currentExercise.prompt || currentExercise.target || 'பயிற்சி வினா',
        question_translit: currentExercise.target_translit,
        question_english: currentExercise.target_meaning || currentExercise.prompt,
        target_answer: currentExercise.target || currentExercise.correct_sentence || 'சரியான விடை',
        user_attempt: 'Re-queued for Smart Review',
        options: currentExercise.options?.map((o) => o.tamil),
      });
    }

    // If more exercises exist in this 8-10 question mini-session
    if (currentStepIndex + 1 < totalExercises) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed mini-session!
      const totalScore = updatedScores.reduce((a, b) => a + b, 0);
      const avgScore = Math.round(totalScore / updatedScores.length);
      const timeSpentSecs = Math.round((Date.now() - startTime) / 1000);

      // Award 15 Coins for completing the short lesson
      addCoins(15);

      // Submit attempt to backend / mock
      try {
        await lessonService.submitAttempt({
          lesson_id: lesson.id,
          exercise_type: currentExercise.type,
          skill:
            currentExercise.type === 'speak_it'
              ? 'speaking'
              : currentExercise.type === 'listen_select'
              ? 'listening'
              : currentExercise.type === 'letter_trace'
              ? 'writing'
              : 'reading',
          score: avgScore,
          is_correct: avgScore >= 60,
          time_spent: timeSpentSecs,
        });
      } catch (e) {
        console.warn('Attempt submission logged offline');
      }

      // Trigger store completion and celebration
      completeLesson(lesson.id, avgScore, timeSpentSecs);
    }
  };

  const handleExit = () => {
    soundService.playClick();
    navigate('/learn');
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto w-full min-h-[80vh]">
      {/* Top Navigation & Fast Progress Header with Cozy Purple & White Palette */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-purple-200/90 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="w-10 h-10 rounded-2xl bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-purple-700 transition-colors border border-purple-200"
            title="Exit Session"
          >
            <X size={20} />
          </button>

          {/* 5-Min Low-Friction Session Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-100/80 text-purple-800 border border-purple-200 text-xs font-black shadow-2xs">
            <Timer size={15} className="text-purple-600 animate-pulse" />
            <span>5-Min Goal: {formatTimer(secondsRemaining)}</span>
          </div>

          {/* Coins Bounty Badge */}
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1.5 rounded-2xl text-xs font-black shadow-2xs">
            <Coins size={14} className="text-amber-500 fill-amber-400" />
            <span>+15 🪙</span>
          </div>

          {/* XP Bounty Badge */}
          <div className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1.5 rounded-2xl text-xs font-black shadow-2xs">
            <Zap size={14} className="fill-purple-500 text-purple-500" />
            <span>+{lesson.xp_reward} XP</span>
          </div>
        </div>

        {/* Dynamic Fast-Filling Progress Bar */}
        <div className="flex-1 flex flex-col gap-1 min-w-[140px]">
          <div className="flex justify-between items-center text-[11px] font-extrabold text-purple-900/70 uppercase tracking-wider">
            <span className="truncate max-w-[130px]">{lesson.title}</span>
            <span>
              Q {currentStepIndex + 1} of {totalExercises}
            </span>
          </div>
          <div className="w-full bg-purple-100/60 h-3.5 rounded-full overflow-hidden p-0.5 border border-purple-200">
            <motion.div
              className="bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-500 h-full rounded-full shadow-xs"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Exercise Content with Animated Transition */}
      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExercise.id || currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {/* Render Letter Tracing */}
            {currentExercise.type === 'letter_trace' && (
              <LetterTracing
                targetChar={currentExercise.target || 'அ'}
                transliteration={currentExercise.target_translit}
                meaning={currentExercise.target_meaning}
                strokePath={currentExercise.stroke_path}
                onComplete={handleExerciseComplete}
              />
            )}

            {/* Render Listen and Pick */}
            {currentExercise.type === 'listen_select' && (
              <ListenAndPick
                prompt={currentExercise.prompt}
                targetTamil={currentExercise.target || 'அ'}
                options={
                  currentExercise.options?.map((o) => ({
                    id: o.id,
                    tamil: o.tamil,
                    translit: o.translit,
                    meaning: o.meaning,
                    image_url: o.image_url,
                  })) || []
                }
                onComplete={handleExerciseComplete}
              />
            )}

            {/* Render Match Pairs */}
            {currentExercise.type === 'match_pairs' && (
              <MatchPairs
                prompt={currentExercise.prompt}
                pairs={currentExercise.pairs || []}
                onComplete={handleExerciseComplete}
              />
            )}

            {/* Render Speak It */}
            {currentExercise.type === 'speak_it' && (
              <SpeakIt
                prompt={currentExercise.prompt}
                targetTamil={currentExercise.target || 'அம்மா'}
                targetTranslit={currentExercise.target_translit}
                targetMeaning={currentExercise.target_meaning}
                onComplete={handleExerciseComplete}
              />
            )}

            {/* Render Build Sentence */}
            {currentExercise.type === 'build_sentence' && (
              <BuildSentence
                prompt={currentExercise.prompt}
                correctSentence={currentExercise.correct_sentence || ''}
                sentenceMeaning={currentExercise.sentence_meaning}
                scrambledWords={currentExercise.scrambled_words || []}
                onComplete={handleExerciseComplete}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Gentle Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl border-2 border-purple-200">
            <span className="text-4xl block mb-2">🦜💭</span>
            <h3 className="font-extrabold text-lg text-slate-800">Leave this mini-session?</h3>
            <p className="text-xs text-slate-500 my-2">
              You are doing so well! Your progress in this 5-min session will be paused.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 font-extrabold text-white py-2.5 rounded-2xl shadow-sm text-sm transition-transform active:scale-95"
              >
                Keep Going!
              </button>
              <button
                onClick={handleExit}
                className="flex-1 bg-purple-50 hover:bg-purple-100 font-bold text-purple-700 py-2.5 rounded-2xl text-sm border border-purple-200"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
