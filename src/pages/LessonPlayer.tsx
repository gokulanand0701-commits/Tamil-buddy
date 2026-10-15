import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ChevronLeft, HelpCircle } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { lessonService } from '../services/lessonService';
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

  const lessonId = Number(id) || 1;
  const lesson = getLessonById(lessonId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [exerciseScores, setExerciseScores] = useState<number[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <span className="text-4xl mb-3">🦜❓</span>
        <h2 className="text-xl font-bold text-slate-800">Lesson not found</h2>
        <p className="text-xs text-slate-500 mb-4">Let's head back to the learning path!</p>
        <button
          onClick={() => navigate('/learn')}
          className="bg-amber-400 font-bold px-4 py-2 rounded-2xl"
        >
          Return to Path
        </button>
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentStepIndex];
  const totalExercises = lesson.exercises.length;
  const progressPercent = ((currentStepIndex + 1) / totalExercises) * 100;

  const handleExerciseComplete = async (score: number) => {
    const updatedScores = [...exerciseScores, score];
    setExerciseScores(updatedScores);

    // If more exercises exist in this lesson
    if (currentStepIndex + 1 < totalExercises) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Completed all exercises!
      const totalScore = updatedScores.reduce((a, b) => a + b, 0);
      const avgScore = Math.round(totalScore / updatedScores.length);
      const timeSpentSecs = Math.round((Date.now() - startTime) / 1000);

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
      {/* Top Navigation & Progress Header */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-white/80 backdrop-blur-md p-3.5 rounded-3xl border-2 border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Dynamic Progress Bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
            <span>{lesson.title}</span>
            <span>
              Step {currentStepIndex + 1} of {totalExercises}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <motion.div
              className="bg-gradient-to-r from-amber-400 via-teal-400 to-kili-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* XP Bounty */}
        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1.5 rounded-2xl text-xs font-black shrink-0">
          <Zap size={14} className="fill-amber-500 text-amber-500" />
          <span>+{lesson.xp_reward} XP</span>
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
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-xl border-2 border-slate-200">
            <span className="text-4xl block mb-2">🦜💭</span>
            <h3 className="font-extrabold text-lg text-slate-800">Leave this lesson?</h3>
            <p className="text-xs text-slate-500 my-2">
              You are doing so well! Your progress in this session will be paused.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 bg-amber-400 hover:bg-amber-300 font-extrabold text-slate-900 py-2.5 rounded-2xl shadow-sm text-sm"
              >
                Keep Going!
              </button>
              <button
                onClick={handleExit}
                className="flex-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-600 py-2.5 rounded-2xl text-sm"
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
