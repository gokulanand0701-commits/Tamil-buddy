import React from 'react';

export const CozyKidsBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Soft Ambient Pastel Glows in Cozy Purple & Violet */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-200/35 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-fuchsia-200/25 rounded-full blur-3xl" />
      <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />

      {/* 2. Cozy Kid-Friendly Doodle Elements with very soft opacity (5-7%) */}
      <div className="absolute inset-0 opacity-[0.06] flex flex-col justify-between p-6 sm:p-12 text-slate-800">
        {/* Row 1 */}
        <div className="flex justify-around items-center text-3xl sm:text-4xl">
          <span>🧸</span>
          <span className="font-tamil font-black text-2xl">அ</span>
          <span>🚂</span>
          <span>🎨</span>
          <span>🦜</span>
          <span className="font-tamil font-black text-2xl">ஆ</span>
          <span>🪁</span>
        </div>

        {/* Row 2 */}
        <div className="flex justify-around items-center text-3xl sm:text-4xl">
          <span>🦁</span>
          <span>🎲</span>
          <span className="font-tamil font-black text-2xl">இ</span>
          <span>🎈</span>
          <span>🐘</span>
          <span>🌟</span>
          <span>🎮</span>
        </div>

        {/* Row 3 */}
        <div className="flex justify-around items-center text-3xl sm:text-4xl">
          <span>🦚</span>
          <span className="font-tamil font-black text-2xl">ஈ</span>
          <span>📚</span>
          <span>🪘</span>
          <span className="font-tamil font-black text-2xl">உ</span>
          <span>🐱</span>
          <span>🍭</span>
        </div>

        {/* Row 4 */}
        <div className="flex justify-around items-center text-3xl sm:text-4xl">
          <span>🚀</span>
          <span>🚲</span>
          <span className="font-tamil font-black text-2xl">ஊ</span>
          <span>🐕</span>
          <span>✨</span>
          <span>🧩</span>
          <span>🌻</span>
        </div>

        {/* Row 5 */}
        <div className="flex justify-around items-center text-3xl sm:text-4xl">
          <span>🥁</span>
          <span className="font-tamil font-black text-2xl">எ</span>
          <span>🎠</span>
          <span>🧸</span>
          <span className="font-tamil font-black text-2xl">ஏ</span>
          <span>🎪</span>
          <span>🌈</span>
        </div>
      </div>
    </div>
  );
};
