import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Volume2,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Coins,
  PartyPopper,
  HelpCircle,
  Shuffle
} from 'lucide-react';
import {
  ANIMAL_COMPANIONS,
  WORD_PUZZLES,
  AnimalCompanion,
  WordPuzzle
} from '../mocks/mockWordGame';
import { useAuthStore } from '../store/useAuthStore';
import { soundService } from '../services/soundService';
import { useTranslation } from '../hooks/useTranslation';

export const AnimalWordGame: React.FC = () => {
  const { user, addCoins } = useAuthStore();
  const { t, isTamil } = useTranslation();

  // Selected companion
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalCompanion>(ANIMAL_COMPANIONS[0]);
  
  // Level filter: 'all' | 'easy' | 'medium' | 'hard'
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Filtered puzzle list
  const filteredPuzzles = React.useMemo(() => {
    if (selectedLevel === 'all') return WORD_PUZZLES;
    return WORD_PUZZLES.filter((p) => p.level === selectedLevel);
  }, [selectedLevel]);

  // Current puzzle index
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPuzzle: WordPuzzle = filteredPuzzles[currentIndex] || WORD_PUZZLES[0];

  // Game state
  const [availableTiles, setAvailableTiles] = useState<{ id: string; char: string }[]>([]);
  const [placedTiles, setPlacedTiles] = useState<{ id: string; char: string }[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [coinsWonThisSession, setCoinsWonThisSession] = useState(0);
  const [animatingCoin, setAnimatingCoin] = useState(false);

  // Setup puzzle whenever currentPuzzle changes
  useEffect(() => {
    // Scramble tiles with unique IDs so duplicates can be tracked properly
    const scrambled = [...currentPuzzle.scrambledTiles]
      .sort(() => Math.random() - 0.5)
      .map((char, index) => ({
        id: `${char}_${index}_${Math.random()}`,
        char,
      }));

    setAvailableTiles(scrambled);
    setPlacedTiles([]);
    setIsSolved(false);
    setIsError(false);
    setShowHint(false);

    // Speak animal greeting and clue
    soundService.speakTamil(currentPuzzle.targetWord);
  }, [currentPuzzle]);

  // Handle tile placement
  const handleSelectTile = (tile: { id: string; char: string }) => {
    if (isSolved) return;
    soundService.playClick();

    setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));
    const nextPlaced = [...placedTiles, tile];
    setPlacedTiles(nextPlaced);
    setIsError(false);

    // Check if word is complete
    if (nextPlaced.length === currentPuzzle.scrambledTiles.length) {
      const constructedWord = nextPlaced.map((t) => t.char).join('');
      if (constructedWord === currentPuzzle.targetWord) {
        // SOLVED!
        handleSuccess();
      } else {
        // Mistake
        setIsError(true);
        soundService.playIncorrect();
      }
    }
  };

  // Remove tile from answer rack
  const handleRemoveTile = (tile: { id: string; char: string }) => {
    if (isSolved) return;
    soundService.playClick();

    setPlacedTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setAvailableTiles((prev) => [...prev, tile]);
    setIsError(false);
  };

  // Reset current attempt
  const handleResetTiles = () => {
    soundService.playClick();
    const all = [...placedTiles, ...availableTiles].sort(() => Math.random() - 0.5);
    setAvailableTiles(all);
    setPlacedTiles([]);
    setIsError(false);
  };

  // Success celebration and coin reward
  const handleSuccess = () => {
    setIsSolved(true);
    soundService.playCorrect();

    // Reward coins!
    const reward = currentPuzzle.coinReward;
    addCoins(reward);
    setCoinsWonThisSession((prev) => prev + reward);
    setAnimatingCoin(true);

    setTimeout(() => {
      setAnimatingCoin(false);
    }, 1800);

    // Speak celebration
    setTimeout(() => {
      soundService.speakTamil(
        `${currentPuzzle.targetWord}! ${selectedAnimal.celebrateTamil}`
      );
    }, 400);
  };

  // Move to next word
  const handleNextWord = () => {
    soundService.playClick();
    setCurrentIndex((prev) => (prev + 1) % filteredPuzzles.length);
  };

  // Speak word
  const handlePronounce = () => {
    soundService.speakTamil(currentPuzzle.targetWord);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-20">
      {/* Top Banner: Cozy Purple & White Header */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 rounded-3xl p-6 text-white shadow-xl border-2 border-purple-400/40 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-purple-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black tracking-wide text-purple-100 mb-2 border border-white/20">
              <Sparkles size={14} className="text-amber-300 animate-spin" />
              <span>{isTamil ? 'சொல் புதிர் கூடம்' : 'ANIMAL WORD REASSEMBLY'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-sm">
              {isTamil ? 'கலைந்த சொற்களை இணைப்போம்! 🪙' : 'Play & Reassemble Words! 🪙'}
            </h1>
            <p className="text-xs sm:text-sm text-purple-100 font-medium mt-1 max-w-xl">
              {isTamil
                ? 'உங்கள் செல்ல விலங்குடன் விளையாடி, தமிழ் எழுத்துக்களை வரிசைப்படுத்தி இலவச நாணயங்களை அள்ளுங்கள்!'
                : 'Help your cute animal buddy reassemble scrambled Tamil words and win FREE COINS!'}
            </p>
          </div>

          {/* User Live Coins Bank */}
          <div className="flex items-center gap-3 bg-white text-purple-950 px-5 py-3 rounded-2xl shadow-lg border-2 border-amber-300 shrink-0">
            <div className="relative">
              <span className="text-3xl animate-bounce">🪙</span>
              {animatingCoin && (
                <motion.div
                  initial={{ y: 0, opacity: 1, scale: 1 }}
                  animate={{ y: -35, opacity: 0, scale: 1.6 }}
                  transition={{ duration: 1.2 }}
                  className="absolute -top-2 left-2 text-amber-500 font-black text-sm"
                >
                  +{currentPuzzle.coinReward}
                </motion.div>
              )}
            </div>
            <div>
              <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                {isTamil ? 'இலவச நாணயங்கள்' : 'My Coins Bank'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-600 flex items-center gap-1">
                <span>{user?.coins ?? 50}</span>
                <span className="text-xs text-purple-800 font-extrabold">🪙</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animal Companion Selector */}
        <div className="mt-5 pt-4 border-t border-purple-500/40 flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="text-xs font-black text-purple-200 uppercase tracking-wider mr-2">
            {isTamil ? 'உங்கள் விலங்கு தோழன்:' : 'Choose Buddy:'}
          </span>
          {ANIMAL_COMPANIONS.map((animal) => (
            <button
              key={animal.id}
              onClick={() => {
                soundService.playClick();
                setSelectedAnimal(animal);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedAnimal.id === animal.id
                  ? 'bg-white text-purple-900 shadow-md scale-105 border-2 border-amber-400'
                  : 'bg-purple-900/60 hover:bg-purple-900/90 text-purple-100 border border-purple-400/30'
              }`}
            >
              <span className="text-base">{animal.avatar}</span>
              <span>{isTamil ? animal.tamilName : animal.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Level Filter & Progress Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-50 p-3 rounded-2xl border border-purple-200">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-purple-900 uppercase ml-1">
            {isTamil ? 'நிலை:' : 'Difficulty:'}
          </span>
          {(['all', 'easy', 'medium', 'hard'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                soundService.playClick();
                setSelectedLevel(lvl);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              {lvl === 'all'
                ? isTamil ? 'அனைத்தும்' : 'All'
                : lvl === 'easy'
                ? isTamil ? '🌟 எளியது' : '🌟 Easy'
                : lvl === 'medium'
                ? isTamil ? '⭐⭐ நடுத்தரம்' : '⭐⭐ Medium'
                : isTamil ? '⭐⭐⭐ கடினம்' : '⭐⭐⭐ Hard'}
            </button>
          ))}
        </div>

        {/* Puzzle counter indicator */}
        <div className="text-xs font-bold text-purple-800 bg-white px-3 py-1 rounded-xl border border-purple-200">
          {isTamil ? 'புதிர்' : 'Puzzle'} {currentIndex + 1} / {filteredPuzzles.length}
        </div>
      </div>

      {/* Main Interactive Playground Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-purple-200 flex flex-col gap-6 relative">
        
        {/* Animal Buddy Talk Bubble Area */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-gradient-to-br from-purple-50 to-indigo-50/60 p-4 sm:p-5 rounded-2xl border-2 border-purple-200">
          <motion.div
            animate={{ y: isSolved ? [-10, 0, -10] : [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: isSolved ? 0.6 : 2.5 }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-md border-2 border-purple-300 flex items-center justify-center text-5xl sm:text-6xl shrink-0"
          >
            {isSolved ? '🎉' : selectedAnimal.avatar}
          </motion.div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-sm font-black text-purple-900">
                {isTamil ? selectedAnimal.tamilName : selectedAnimal.name}
              </span>
              <button
                type="button"
                onClick={handlePronounce}
                title="Pronounce Word"
                className="p-1 rounded-full bg-purple-200/80 hover:bg-purple-300 text-purple-900 transition-colors"
              >
                <Volume2 size={16} />
              </button>
              <span className="text-xs bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full border border-amber-300 ml-auto">
                🪙 +{currentPuzzle.coinReward} Coins
              </span>
            </div>

            {/* Speech Dialogue */}
            <div className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
              {isSolved ? (
                <span className="text-emerald-700">
                  {isTamil ? selectedAnimal.celebrateTamil : selectedAnimal.celebrateEnglish}
                </span>
              ) : (
                <span>
                  {isTamil ? selectedAnimal.greetingTamil : selectedAnimal.greetingEnglish}
                </span>
              )}
            </div>

            {/* Clue Box */}
            <div className="mt-2.5 bg-white p-3 rounded-xl border border-purple-200 flex items-start gap-2 text-left">
              <HelpCircle size={18} className="text-purple-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs sm:text-sm font-bold text-purple-950">
                  {currentPuzzle.clueTamil}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {currentPuzzle.clueEnglish}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Rack (Where placed tiles appear) */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-xs font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
            <span>{isTamil ? 'உங்கள் விடை பலகை (இங்கு தட்டவும்)' : 'Your Answer Rack (Tap letter to remove)'}</span>
          </div>

          <div
            className={`min-h-[80px] sm:min-h-[96px] w-full max-w-lg p-3 rounded-2xl border-3 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 transition-all ${
              isSolved
                ? 'bg-emerald-50 border-emerald-400 shadow-md'
                : isError
                ? 'bg-rose-50 border-rose-400 shake'
                : 'bg-purple-50/70 border-dashed border-purple-300'
            }`}
          >
            {placedTiles.length === 0 ? (
              <span className="text-xs sm:text-sm font-bold text-purple-400 italic">
                {isTamil
                  ? 'கீழே உள்ள எழுத்துக்களை வரிசையாக தட்டுங்கள்!'
                  : 'Tap the scrambled tiles below in the correct order!'}
              </span>
            ) : (
              placedTiles.map((tile) => (
                <motion.button
                  key={tile.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRemoveTile(tile)}
                  disabled={isSolved}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black shadow-md border-2 cursor-pointer transition-all ${
                    isSolved
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-white text-purple-950 border-purple-300 hover:border-purple-500'
                  }`}
                >
                  {tile.char}
                </motion.button>
              ))
            )}
          </div>

          {/* Feedback messages */}
          {isError && (
            <div className="text-xs sm:text-sm font-extrabold text-rose-600 flex items-center gap-1 animate-pulse">
              <span>❌ {isTamil ? 'வரிசை தவறாக உள்ளது, மீண்டும் முயற்சி செய்!' : 'Not quite right yet! Tap tiles to adjust.'}</span>
            </div>
          )}
        </div>

        {/* Scrambled Available Tiles Rack */}
        {!isSolved && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-black text-purple-800 uppercase tracking-wider">
              {isTamil ? 'கலைந்த எழுத்துக்கள் (தட்டி தேர்ந்தெடுக்கவும்):' : 'Scrambled Letter Blocks (Tap to place):'}
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 p-3 bg-purple-50/50 rounded-2xl border border-purple-200 w-full max-w-lg">
              <AnimatePresence>
                {availableTiles.map((tile) => (
                  <motion.button
                    key={tile.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectTile(tile)}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-white to-purple-50 text-purple-950 border-2 border-purple-400 hover:border-purple-600 shadow-md flex items-center justify-center text-2xl sm:text-3xl font-black cursor-pointer transition-all"
                  >
                    {tile.char}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Action Controls: Reset & Hint */}
        {!isSolved && (
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetTiles}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold border border-slate-300 transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
              <span>{isTamil ? 'மாற்றி அமை' : 'Reset Rack'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                setShowHint(!showHint);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs sm:text-sm font-extrabold border border-amber-300 transition-all cursor-pointer"
            >
              <Lightbulb size={16} className="text-amber-500" />
              <span>{isTamil ? 'குறிப்பு' : 'Hint'}</span>
            </button>
          </div>
        )}

        {/* Hint Box */}
        {showHint && !isSolved && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-amber-50/90 rounded-2xl border-2 border-amber-300 text-center max-w-md mx-auto"
          >
            <div className="text-xs font-bold text-amber-900">
              💡 {isTamil ? 'முதல் எழுத்து:' : 'First syllable starts with:'}{' '}
              <span className="text-base font-black text-purple-900">
                {currentPuzzle.targetWord.substring(0, 1)}...
              </span>
            </div>
            <div className="text-[11px] font-semibold text-slate-700 mt-0.5">
              Meaning: {currentPuzzle.englishMeaning}
            </div>
          </motion.div>
        )}

        {/* Success Card (Revealed when solved) */}
        {isSolved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-emerald-50 via-teal-50 to-purple-50 p-6 rounded-3xl border-2 border-emerald-300 shadow-md flex flex-col items-center gap-4 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-lg animate-bounce">
              🪙
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-800">
                {isTamil ? 'அற்புதம்! புதிய சொல் வென்றீர்கள்!' : 'VICTORY! WORD MASTERED!'}
              </div>
              <div className="text-3xl sm:text-4xl font-black text-purple-950 mt-1 flex items-center justify-center gap-2">
                <span>{currentPuzzle.targetWord}</span>
                <button
                  type="button"
                  onClick={handlePronounce}
                  className="p-2 rounded-full bg-white shadow-sm border border-purple-200 text-purple-700 hover:text-purple-900"
                >
                  <Volume2 size={20} />
                </button>
              </div>
              <div className="text-sm font-bold text-teal-800 mt-0.5">
                {currentPuzzle.transliteration} • {currentPuzzle.englishMeaning}
              </div>
            </div>

            {/* Example sentence */}
            <div className="bg-white/90 p-4 rounded-2xl border border-purple-200 max-w-md text-left w-full">
              <div className="text-xs font-bold text-purple-950">
                {currentPuzzle.exampleSentence.tamil}
              </div>
              <div className="text-[11px] font-semibold text-teal-700">
                {currentPuzzle.exampleSentence.translit}
              </div>
              <div className="text-[11px] text-slate-600">
                {currentPuzzle.exampleSentence.english}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleNextWord}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black px-6 py-3 rounded-2xl shadow-lg transition-all cursor-pointer text-sm sm:text-base active:scale-95"
              >
                <span>{isTamil ? 'அடுத்த சொல்' : 'Next Word'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Educational Words Mastery Summary Bar */}
      <div className="bg-white p-5 rounded-3xl border border-purple-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-sm font-black text-purple-950">
            {isTamil ? 'தமிழ் சொல் வங்கி & நாணயங்கள் 🪙' : 'Tamil Vocabulary & Rewards 🪙'}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            {isTamil
              ? `இந்த சுற்றில் நீங்கள் பெற்ற இலவச நாணயங்கள்: +${coinsWonThisSession} 🪙`
              : `Free coins collected during this play session: +${coinsWonThisSession} 🪙`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            handleNextWord();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-extrabold transition-colors cursor-pointer"
        >
          <Shuffle size={14} />
          <span>{isTamil ? 'வேறு சொல் மாற்று' : 'Shuffle Word'}</span>
        </button>
      </div>
    </div>
  );
};

export default AnimalWordGame;
