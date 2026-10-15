import React from 'react';
import { motion } from 'framer-motion';

interface StorySceneProps {
  sceneKey?: string;
  storyId?: string;
}

export const StorySceneIllustration: React.FC<StorySceneProps> = ({ sceneKey, storyId }) => {
  // 1. Thirsty Crow Scenes
  if (sceneKey === 'crow_thirsty') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-amber-200 via-orange-100 to-amber-300 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-amber-300">
        <div className="absolute top-4 right-6 text-5xl animate-spin text-amber-500">☀️</div>
        <div className="absolute bottom-2 inset-x-0 h-10 bg-amber-600/30 rounded-t-full" />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-7xl sm:text-8xl filter drop-shadow-md z-10"
        >
          🐦‍⬛
        </motion.div>
        <span className="z-10 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-amber-900 mt-2 shadow-xs">
          🥵 தாகம்! (Very Thirsty!)
        </span>
      </div>
    );
  }

  if (sceneKey === 'crow_flying') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-sky-200 via-blue-100 to-sky-300 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-sky-300">
        <div className="absolute top-3 left-6 text-4xl opacity-80">☁️</div>
        <div className="absolute top-8 right-12 text-3xl opacity-80">☁️</div>
        <motion.div
          animate={{ x: [-30, 30, -30], y: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-7xl sm:text-8xl filter drop-shadow-md z-10"
        >
          🦅
        </motion.div>
        <span className="z-10 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-blue-900 mt-2 shadow-xs">
          வானில் பறக்கிறது... (Flying in the Sky)
        </span>
      </div>
    );
  }

  if (sceneKey === 'crow_spots_pot') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-200 rounded-3xl overflow-hidden flex items-center justify-around p-4 border-2 border-emerald-300">
        <div className="flex flex-col items-center">
          <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl sm:text-7xl">
            🐦‍⬛
          </motion.div>
          <span className="text-xs font-bold text-slate-700 mt-1">காகம் (Crow)</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-6xl sm:text-7xl filter drop-shadow-md animate-pulse">
            🏺
          </div>
          <span className="text-xs font-bold text-slate-700 mt-1">மண்பானை (Clay Pot)</span>
        </div>
      </div>
    );
  }

  if (sceneKey === 'crow_cant_reach') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-amber-300">
        <div className="flex items-center gap-4 z-10">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-6xl sm:text-7xl">
            🐦‍⬛
          </motion.div>
          <div className="relative text-6xl sm:text-7xl">
            🏺
            <span className="absolute bottom-2 inset-x-0 text-center text-xl">💧</span>
          </div>
        </div>
        <span className="bg-rose-100 text-rose-800 border border-rose-300 text-xs font-extrabold px-3 py-1 rounded-full mt-3 shadow-xs">
          தண்ணீர் மிக ஆழத்தில் உள்ளது! (Water is deep!)
        </span>
      </div>
    );
  }

  if (sceneKey === 'crow_dropping_pebbles') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-teal-100 via-sky-50 to-teal-200 rounded-3xl overflow-hidden flex items-center justify-center gap-6 p-4 border-2 border-teal-300">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-6xl sm:text-7xl z-10"
        >
          🐦‍⬛
        </motion.div>
        <motion.div
          animate={{ y: [-20, 10, -20], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-3xl z-10"
        >
          🪨
        </motion.div>
        <div className="text-6xl sm:text-7xl z-10">
          🏺
        </div>
      </div>
    );
  }

  if (sceneKey === 'crow_drinks_happy') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-yellow-200 via-amber-100 to-emerald-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-amber-400">
        <div className="absolute top-2 inset-x-0 flex justify-around text-2xl animate-bounce">
          ✨ 🌈 ✨ 💧 ✨
        </div>
        <div className="flex items-center gap-4 z-10">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-7xl sm:text-8xl">
            🐦‍⬛
          </motion.div>
          <div className="text-6xl sm:text-7xl">
            🏺💧
          </div>
        </div>
        <span className="bg-emerald-500 text-white font-black text-xs px-4 py-1.5 rounded-full mt-3 shadow-md">
          தாகம் தீர்ந்தது! வெற்றி! (Thirst quenched! Success!)
        </span>
      </div>
    );
  }

  // 2. Capseller & Monkeys Scenes
  if (sceneKey === 'capseller_sleeping') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-emerald-100 to-amber-100 rounded-3xl overflow-hidden flex items-center justify-around p-4 border-2 border-emerald-300">
        <div className="text-7xl">🌳</div>
        <div className="flex flex-col items-center">
          <div className="text-6xl">👨‍🌾💤</div>
          <span className="text-3xl mt-1">🧺🧢</span>
        </div>
      </div>
    );
  }

  if (sceneKey === 'monkeys_wear_caps') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-amber-100 to-sky-100 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-amber-300">
        <div className="flex gap-4 sm:gap-8 text-5xl sm:text-6xl animate-bounce">
          <div>🐒🧢</div>
          <div>🐒👒</div>
          <div>🐒🧢</div>
        </div>
        <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full mt-4">
          குரங்குகள் தொப்பி அணிந்தன! (Monkeys wearing caps!)
        </span>
      </div>
    );
  }

  if (sceneKey === 'capseller_throws_cap') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-orange-100 to-rose-100 rounded-3xl overflow-hidden flex items-center justify-around p-4 border-2 border-orange-300">
        <div className="flex flex-col items-center">
          <div className="text-6xl sm:text-7xl">👨‍🌾</div>
          <motion.div animate={{ y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-4xl">
            🧢
          </motion.div>
        </div>
        <div className="text-5xl">➡️</div>
        <div className="text-6xl">🌳🐒</div>
      </div>
    );
  }

  if (sceneKey === 'capseller_wins') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-emerald-100 to-teal-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-emerald-400">
        <div className="text-7xl animate-bounce">
          🥳 🧺🧢🏃‍♂️
        </div>
        <span className="bg-emerald-600 text-white font-black text-xs px-4 py-1.5 rounded-full mt-3 shadow-md">
          சமயோசித புத்தி வெற்றி பெற்றது! (Clever trick worked!)
        </span>
      </div>
    );
  }

  // 3. Fox & Sour Grapes Scenes
  if (sceneKey === 'fox_enters_vineyard' || sceneKey === 'fox_looks_at_grapes') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-purple-100 to-emerald-100 rounded-3xl overflow-hidden flex items-center justify-around p-4 border-2 border-purple-300">
        <div className="text-6xl sm:text-7xl">🦊</div>
        <div className="flex flex-col items-center">
          <div className="text-6xl sm:text-7xl animate-pulse">🍇🍇</div>
          <span className="text-xs font-black text-purple-800 mt-1">இனிப்பான திராட்சை (Grapes)</span>
        </div>
      </div>
    );
  }

  if (sceneKey === 'fox_jumping_high' || sceneKey === 'fox_misses_grapes') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-sky-100 to-purple-100 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-sky-300">
        <div className="text-5xl mb-4">🍇🍇</div>
        <motion.div
          animate={{ y: [15, -25, 15] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-6xl sm:text-7xl"
        >
          🦊
        </motion.div>
        <span className="text-xs font-bold text-slate-600 mt-2">எட்டவில்லை! (Cannot reach!)</span>
      </div>
    );
  }

  if (sceneKey === 'fox_sarcastic_walk' || sceneKey === 'fox_exhausted') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-rose-100 to-amber-100 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-rose-300">
        <div className="text-7xl sm:text-8xl">🦊🙄</div>
        <span className="bg-rose-500 text-white font-black text-xs px-4 py-1.5 rounded-full mt-3 shadow-md">
          "சீச்சீ! இந்தப் பழம் புளிக்கும்!" (Sour Grapes!)
        </span>
      </div>
    );
  }

  // 4. Lion & Mouse Scenes
  if (sceneKey === 'lion_sleeping' || sceneKey === 'mouse_playing_on_lion') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-amber-100 to-teal-100 rounded-3xl overflow-hidden flex items-center justify-center gap-4 p-4 border-2 border-amber-300">
        <div className="text-7xl sm:text-8xl">🦁</div>
        <motion.div animate={{ x: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-4xl">
          🐭🐾
        </motion.div>
      </div>
    );
  }

  if (sceneKey === 'lion_trapped_net' || sceneKey === 'mouse_saves_lion') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-slate-100 to-amber-100 rounded-3xl overflow-hidden flex items-center justify-around p-4 border-2 border-slate-300">
        <div className="text-6xl sm:text-7xl">🦁🕸️</div>
        <div className="text-3xl">➡️</div>
        <div className="text-5xl sm:text-6xl animate-bounce">🐭🦷💖</div>
      </div>
    );
  }

  // 5. Tortoise & Hare Scenes
  if (sceneKey === 'rabbit_teasing_tortoise' || sceneKey === 'tortoise_challenges_race') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-emerald-100 to-sky-100 rounded-3xl overflow-hidden flex items-center justify-around p-4 border-2 border-emerald-300">
        <div className="flex flex-col items-center">
          <div className="text-6xl sm:text-7xl">🐇</div>
          <span className="text-xs font-bold text-slate-600">வேக முயல்</span>
        </div>
        <div className="text-4xl">VS</div>
        <div className="flex flex-col items-center">
          <div className="text-6xl sm:text-7xl">🐢</div>
          <span className="text-xs font-bold text-slate-600">பொறுமை ஆமை</span>
        </div>
      </div>
    );
  }

  if (sceneKey === 'hare_sleeping_tree' || sceneKey === 'tortoise_passing_hare') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-amber-100 to-emerald-100 rounded-3xl overflow-hidden flex items-center justify-around p-4 border-2 border-amber-300">
        <div className="flex flex-col items-center">
          <div className="text-5xl">🌳🐇💤</div>
          <span className="text-xs text-slate-500">முயல் தூங்குகிறது</span>
        </div>
        <motion.div animate={{ x: [-20, 20, -20] }} transition={{ repeat: Infinity, duration: 4 }} className="text-6xl">
          🐢🐾
        </motion.div>
      </div>
    );
  }

  if (sceneKey === 'tortoise_wins_trophy') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-yellow-200 to-emerald-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-yellow-400">
        <div className="text-7xl sm:text-8xl animate-bounce">
          🐢🏆🏁
        </div>
        <span className="bg-emerald-600 text-white font-black text-xs px-4 py-1.5 rounded-full mt-3 shadow-md">
          ஆமை வென்றது! விடாமுயற்சி! (Tortoise Wins!)
        </span>
      </div>
    );
  }

  // 6. Elephant & Tailor Scenes
  if (sceneKey === 'tailor_gives_banana' || sceneKey === 'elephant_walking_village') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-amber-100 to-teal-100 rounded-3xl overflow-hidden flex items-center justify-around p-4 border-2 border-teal-300">
        <div className="text-6xl sm:text-7xl">🐘</div>
        <div className="text-4xl">🍌</div>
        <div className="text-6xl sm:text-7xl">👨‍💼✂️</div>
      </div>
    );
  }

  if (sceneKey === 'elephant_splashes_tailor' || sceneKey === 'elephant_muddy_water') {
    return (
      <div className="relative w-full h-48 sm:h-64 bg-gradient-to-b from-sky-100 to-blue-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-sky-400">
        <div className="text-6xl sm:text-7xl animate-pulse">
          🐘💦👕👨‍💼
        </div>
        <span className="bg-sky-600 text-white font-black text-xs px-4 py-1.5 rounded-full mt-3 shadow-md">
          நட்பும் மன்னிப்பும்! (Friendship restored!)
        </span>
      </div>
    );
  }

  // Default Fallback
  return (
    <div className="w-full h-48 sm:h-64 bg-gradient-to-b from-amber-100 via-teal-50 to-amber-200 rounded-3xl flex items-center justify-center text-6xl shadow-inner border-2 border-amber-200">
      📖✨
    </div>
  );
};
