import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, Trophy, Snowflake, Lock, CheckCircle2, Star } from 'lucide-react';
import { useProgressStore } from '../store/useProgressStore';
import { useAuthStore } from '../store/useAuthStore';
import { MOCK_STICKERS, MOCK_LEADERBOARD } from '../mocks/mockProgress';
import { soundService } from '../services/soundService';

export const Rewards: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'badges' | 'stickers' | 'leaderboard'>('badges');
  const { badges, stickers } = useProgressStore();
  const { user } = useAuthStore();

  const handleTabChange = (tab: 'badges' | 'stickers' | 'leaderboard') => {
    soundService.playClick();
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-16">
      {/* Page Header with Cozy Purple & White Palette */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-800 rounded-3xl p-6 border-2 border-purple-300/50 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black text-purple-100 mb-2 border border-white/20">
            <Trophy size={14} className="text-amber-300" />
            <span>HALL OF FAME & REWARDS</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Awards & Treasures 🏆
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 font-semibold mt-0.5">
            Collect special badges, stickers, and climb the friendly leaderboard!
          </p>
        </div>

        {/* User Summary Pill */}
        <div className="relative z-10 flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-purple-200 shadow-xs shrink-0 text-slate-800">
          <span className="text-3xl">🦜</span>
          <div>
            <span className="text-xs font-black text-slate-900 block">
              {user?.name || 'Explorer'}
            </span>
            <span className="text-[11px] font-bold text-purple-700">
              Level {user?.level || 3} • {user?.xp || 380} XP
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-center gap-2 bg-purple-100/60 p-1.5 rounded-2xl max-w-md mx-auto w-full border border-purple-200">
        <button
          type="button"
          onClick={() => handleTabChange('badges')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'badges'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-purple-900/70 hover:text-purple-950'
          }`}
        >
          <Award size={16} /> Badges
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('stickers')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'stickers'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-purple-900/70 hover:text-purple-950'
          }`}
        >
          <Sparkles size={16} /> Sticker Book
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('leaderboard')}
          className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'leaderboard'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-purple-900/70 hover:text-purple-950'
          }`}
        >
          <Trophy size={16} /> Friends League
        </button>
      </div>

      {/* TAB 1: Badges */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked = !!badge.unlocked_at;

            return (
              <motion.div
                key={badge.code}
                whileHover={{ y: -3 }}
                className={`p-5 rounded-3xl border-2 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl">{badge.icon}</span>
                    {isUnlocked ? (
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Lock size={12} /> Locked
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-sm text-slate-800">{badge.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{badge.description}</p>
                </div>

                {/* Progress bar for ongoing badge */}
                {!isUnlocked && badge.max_progress && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {badge.progress || 0}/{badge.max_progress}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{
                          width: `${((badge.progress || 0) / badge.max_progress) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Cultural Sticker Book */}
      {activeTab === 'stickers' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
          <div className="mb-4">
            <h3 className="font-extrabold text-lg text-slate-800">
              Tamil Cultural Sticker Album 🪷
            </h3>
            <p className="text-xs text-slate-500">
              Collect all 8 traditional Tamil cultural stamps as you progress!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stickers.map((stk) => {
              return (
                <div
                  key={stk.id}
                  className={`p-4 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${
                    stk.is_unlocked
                      ? 'bg-amber-50/60 border-amber-300 shadow-sm hover:scale-105'
                      : 'bg-slate-50 border-dashed border-slate-300 opacity-50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-inner flex items-center justify-center text-4xl mb-2">
                    {stk.is_unlocked ? stk.emoji : '🔒'}
                  </div>

                  <span className="font-tamil font-bold text-sm text-slate-800">
                    {stk.name_tamil}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{stk.name_english}</span>

                  <span
                    className={`text-[9px] font-black uppercase mt-2 px-2 py-0.5 rounded-full ${
                      stk.rarity === 'legendary'
                        ? 'bg-purple-100 text-purple-700'
                        : stk.rarity === 'rare'
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {stk.rarity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Friendly Wholesome Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">
                Weekly Wholesome League 🌟
              </h3>
              <p className="text-xs text-slate-500">
                Celebrating effort and consistency together with friends!
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Gold Tier
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {MOCK_LEADERBOARD.map((learner) => {
              const isCurrent = learner.is_current_user;

              return (
                <div
                  key={learner.rank}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    isCurrent
                      ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300/60'
                      : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        learner.rank === 1
                          ? 'bg-amber-400 text-slate-900'
                          : learner.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : learner.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {learner.rank}
                    </span>

                    <span className="text-2xl">
                      {learner.avatar === 'kili'
                        ? '🦜'
                        : learner.avatar === 'tiger'
                        ? '🐯'
                        : learner.avatar === 'elephant'
                        ? '🐘'
                        : learner.avatar === 'peacock'
                        ? '🦚'
                        : learner.avatar === 'monkey'
                        ? '🐵'
                        : '🐱'}
                    </span>

                    <div>
                      <span className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                        {learner.name}
                        {isCurrent && (
                          <span className="text-[10px] font-black bg-teal-500 text-white px-1.5 py-0.2 rounded-md">
                            YOU
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        🔥 {learner.streak} Day streak
                      </span>
                    </div>
                  </div>

                  <span className="text-sm font-black text-amber-600">
                    {learner.xp} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
