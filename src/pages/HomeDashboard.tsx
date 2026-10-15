import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Zap, Play, CheckCircle2, Sparkles, BookOpen, MessageSquare, Snowflake, RefreshCw, Trophy } from 'lucide-react';
import { Button } from '../components/common/Button';
import { KiliMascot } from '../components/common/KiliMascot';
import { useAuthStore } from '../store/useAuthStore';
import { useProgressStore } from '../store/useProgressStore';
import { useTranslation } from '../hooks/useTranslation';
import { soundService } from '../services/soundService';

export const HomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, missedDaysDetected, dismissWelcomeBack, useStreakFreeze } = useAuthStore();
  const { lessons, dailyQuests, todayMinutesSpent } = useProgressStore();
  const { t, isTamil } = useTranslation();

  const childName = user?.name || (isTamil ? 'தோழர்' : 'Explorer');
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const streak = user?.streak_current || 1;
  const freezesLeft = user?.streak_freezes_left ?? 1;
  const dailyGoalMins = user?.daily_goal_minutes || 15;

  // Find next uncompleted lesson
  const currentLesson = lessons.find((l) => !l.is_completed) || lessons[0];

  // XP progress to next level
  const currentLevelFloorXp = (level - 1) * 100;
  const nextLevelXp = level * 100;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelFloorXp);
  const xpPercent = Math.min(100, Math.round((xpInCurrentLevel / 100) * 100));

  // Goal ring percentage
  const goalPercent = Math.min(100, Math.round((todayMinutesSpent / dailyGoalMins) * 100));
  const strokeDashoffset = 283 - (283 * goalPercent) / 100;

  const handleStartLearning = () => {
    soundService.playClick();
    navigate(`/lesson/${currentLesson.id}`);
  };

  const handleApplyFreeze = () => {
    soundService.playCorrect();
    useStreakFreeze();
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-7xl mx-auto">
      {/* Welcome Back After Missed Day Alert Modal */}
      {missedDaysDetected && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-5 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-teal-400"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">🦜💙</span>
            <div>
              <h3 className="font-extrabold text-lg">வணக்கம் {childName}! We missed you!</h3>
              <p className="text-xs text-teal-100">
                {freezesLeft > 0 ? 'You have a streak freeze ready to save your flame!' : 'Ready to start a brand new streak?'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {freezesLeft > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyFreeze}
                icon={<Snowflake size={16} />}
              >
                Use Streak Freeze ❄️
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={dismissWelcomeBack}
              className="bg-white/20 border-white text-white hover:bg-white/30"
            >
              Let's Learn!
            </Button>
          </div>
        </motion.div>
      )}

      {/* Top Banner Card: Greeting + Kili + Continue CTA with Cozy Purple & White Palette */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-800 rounded-4xl p-6 sm:p-8 lg:p-10 shadow-playful relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-purple-400/50 text-white">
        {/* Subtle decorative purple blurs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-purple-100 mb-2 shadow-xs border border-white/20">
            <Sparkles size={14} className="text-amber-300 animate-spin" />
            <span>{t('dailyAdventure')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {t('greeting')}, {childName}! 👋
          </h1>
          <p className="text-purple-100 text-sm sm:text-base font-semibold mt-2 mb-6 max-w-xl">
            {t('welcomeSub')}
          </p>

          <Button
            variant="kili"
            size="xl"
            onClick={handleStartLearning}
            icon={<Play size={22} className="fill-white" />}
            className="bg-white text-purple-900 hover:bg-purple-50 font-black shadow-lg border-2 border-white/80"
          >
            {t('continueLearning')} ({t('unit')} {currentLesson.unit})
          </Button>
        </div>

        {/* Mascot Illustration */}
        <div className="relative shrink-0 flex items-center justify-center">
          <KiliMascot
            mood="happy"
            size="lg"
            speechBubble={isTamil ? 'வாங்க படிக்கலாம்! 🦜' : "Let's practice! வாங்க படிக்கலாம்!"}
          />
        </div>
      </div>

      {/* Stats & Today's Goal Row (3 responsive cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Today's Goal Ring */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border-2 border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              {t('todaysGoal')}
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
              {todayMinutesSpent} / {dailyGoalMins} {t('mins')}
            </span>
            <span className="text-xs font-semibold text-teal-600 mt-1">
              {todayMinutesSpent >= dailyGoalMins ? t('goalAchieved') : `${dailyGoalMins - todayMinutesSpent} ${t('minsRemaining')}`}
            </span>
          </div>

          {/* Circular SVG Ring */}
          <div className="relative w-20 h-20 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="text-teal-500 transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <span className="absolute text-sm font-black text-slate-800">
              {goalPercent}%
            </span>
          </div>
        </div>

        {/* Card 2: Streak Flame & Freezes */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border-2 border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              {t('consistencyStreak')}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Flame size={32} className="text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-3xl font-black text-slate-800">{streak} {t('streakDays')}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-xl w-fit">
              <Snowflake size={14} className="text-sky-500" />
              <span>{freezesLeft} {t('streakFreezeReady')}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Level & XP Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-card border-2 border-purple-100 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
              {t('levelProgress')}
            </span>
            <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-purple-200">
              <Zap size={13} className="fill-purple-600 text-purple-600" /> {xp} {t('xpLabel')}
            </span>
          </div>

          <div className="my-2 sm:my-3">
            <div className="w-full bg-purple-50 h-3.5 rounded-full overflow-hidden p-0.5 border border-purple-200">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {100 - xpInCurrentLevel} {t('xpToNext')} {level + 1}!
          </span>
        </div>
      </div>

      {/* Main Content Grid: Daily Quests & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Quests Card (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-card border-2 border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <h2 className="font-extrabold text-lg text-slate-800">{t('todaysQuests')}</h2>
            </div>
            <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
              {t('resetMidnight')}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {dailyQuests.map((quest) => (
              <div
                key={quest.id}
                className="p-3.5 rounded-2xl border-2 border-purple-100 hover:border-purple-200 bg-purple-50/30 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      quest.is_completed ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {quest.is_completed ? <CheckCircle2 size={20} /> : <Zap size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">
                      {isTamil ? quest.title_tamil : quest.title}
                    </h4>
                    <p className="font-tamil text-xs text-slate-500">{quest.title_tamil}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-xs font-black text-amber-600">+{quest.xp} {t('xpLabel')}</span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {quest.current}/{quest.target}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Review / Spaced Repetition Card */}
        <div className="flex flex-col gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-5 border-2 border-purple-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm mb-1">
                <RefreshCw size={18} className="text-purple-600" />
                <span>{isTamil ? 'விரைவு நினைவூட்டல்' : 'Spaced Repetition Review'}</span>
              </div>
              <p className="text-xs text-purple-950 font-medium">
                {isTamil ? '3 எழுத்துக்களை விரைவாக நினைவுகூறத் தயார்!' : 'SuperMemo SM-2 says: 3 letters are ready for quick memory refresh!'}
              </p>

              <div className="flex gap-2 my-4">
                {['அ', 'ஆ', 'இ'].map((char) => (
                  <span
                    key={char}
                    className="w-10 h-10 rounded-xl bg-white border border-purple-200 shadow-xs flex items-center justify-center font-tamil text-xl font-black text-purple-800"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/learn')}
              icon={<Play size={14} />}
              className="bg-purple-600 text-white hover:bg-purple-700 border-none"
            >
              {isTamil ? '2 நிமிடப் பயிற்சி தொடங்கு' : 'Start 2-Min Review'}
            </Button>
          </div>

          {/* Quick AI Chat prompt */}
          <Link
            to="/chat"
            className="group bg-purple-50 hover:bg-purple-100/70 border-2 border-purple-200 rounded-3xl p-4 flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                🦜
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-purple-900">{t('navChat')}</h4>
                <p className="text-xs text-purple-600 font-medium">{t('aiBuddyDesc')}</p>
              </div>
            </div>
            <MessageSquare size={18} className="text-purple-600" />
          </Link>
        </div>
      </div>
    </div>
  );
};
