import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Sparkles, RefreshCw, Star, Heart, Music } from 'lucide-react';
import { soundService } from '../../services/soundService';
import { useTranslation } from '../../hooks/useTranslation';

interface SoundItem {
  id: string;
  emoji: string;
  tamil: string;
  transliteration: string;
  english: string;
  soundCue: string;
  bg: string;
  border: string;
}

const SOUND_ITEMS: SoundItem[] = [
  {
    id: 'kili',
    emoji: '🦜',
    tamil: 'கிளி',
    transliteration: 'Kiḷi',
    english: 'Parrot',
    soundCue: 'கிளி கொஞ்சும்!',
    bg: 'from-emerald-400 to-teal-500',
    border: 'border-emerald-600',
  },
  {
    id: 'singam',
    emoji: '🦁',
    tamil: 'சிங்கம்',
    transliteration: 'Singam',
    english: 'Lion',
    soundCue: 'சிங்கம் கர்ஜிக்கும்!',
    bg: 'from-amber-400 to-orange-500',
    border: 'border-amber-600',
  },
  {
    id: 'yaanai',
    emoji: '🐘',
    tamil: 'யானை',
    transliteration: 'Yāṉai',
    english: 'Elephant',
    soundCue: 'யானை பிளிறும்!',
    bg: 'from-sky-400 to-indigo-500',
    border: 'border-sky-600',
  },
  {
    id: 'mayil',
    emoji: '🦚',
    tamil: 'மயில்',
    transliteration: 'Mayil',
    english: 'Peacock',
    soundCue: 'மயில் ஆடும்!',
    bg: 'from-purple-400 to-pink-500',
    border: 'border-purple-600',
  },
  {
    id: 'naai',
    emoji: '🐕',
    tamil: 'நாய்',
    transliteration: 'Nāi',
    english: 'Dog',
    soundCue: 'நாய் குரைக்கும்!',
    bg: 'from-rose-400 to-red-500',
    border: 'border-rose-600',
  },
  {
    id: 'poonai',
    emoji: '🐱',
    tamil: 'பூனை',
    transliteration: 'Pūṉai',
    english: 'Cat',
    soundCue: 'பூனை மியாவ்!',
    bg: 'from-yellow-400 to-amber-500',
    border: 'border-yellow-600',
  },
  {
    id: 'vandi',
    emoji: '🚂',
    tamil: 'தொடர்வண்டி',
    transliteration: 'Thoṭarvaṇḍi',
    english: 'Train',
    soundCue: 'கூ கூ தொடர்வண்டி!',
    bg: 'from-cyan-400 to-blue-500',
    border: 'border-cyan-600',
  },
  {
    id: 'mazhai',
    emoji: '🌧️',
    tamil: 'மழை',
    transliteration: 'Mazhai',
    english: 'Rain',
    soundCue: 'சொட்டு சொட்டு மழை!',
    bg: 'from-teal-400 to-emerald-600',
    border: 'border-teal-700',
  },
];

interface ThirukkuralSparkle {
  id: number;
  kuralLine1: string;
  kuralLine2: string;
  transliteration: string;
  meaning_en: string;
  meaning_ta: string;
  tag_en: string;
  tag_ta: string;
}

const KURALS: ThirukkuralSparkle[] = [
  {
    id: 1,
    kuralLine1: 'அகர முதல எழுத்தெல்லாம் ஆதி',
    kuralLine2: 'பகவன் முதற்றே உலகு.',
    transliteration: 'Agara mudhala ezhuththellam aadhi bagavan mudhatre ulagu.',
    meaning_en: 'As the letter "A" is the first of all letters, so the Eternal Divine is first in the world.',
    meaning_ta: 'எழுத்துக்களுக்கெல்லாம் "அ" முதலாக இருப்பது போல, உலகிற்கு முதன்மையானவன் இறைவன்.',
    tag_en: 'Beginning & Wisdom 🌟',
    tag_ta: 'ஆரம்பமும் ஞானமும் 🌟',
  },
  {
    id: 391,
    kuralLine1: 'கற்க கசடறக் கற்பவை கற்றபின்',
    kuralLine2: 'நிற்க அதற்குத் தக.',
    transliteration: 'Karka kasadarak karpavai katrapin nirka adharkuth thaga.',
    meaning_en: 'Learn thoroughly what should be learned, and afterwards walk strictly according to that learning.',
    meaning_ta: 'கற்க வேண்டிய நல்லவற்றை குற்றமில்லாமல் கற்க வேண்டும்; கற்றபடி நல்வழியில் வாழ வேண்டும்.',
    tag_en: 'Learning & Practice 📚',
    tag_ta: 'கல்வியும் ஒழுக்கமும் 📚',
  },
  {
    id: 396,
    kuralLine1: 'தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக்',
    kuralLine2: 'கற்றனைத் தூறும் அறிவு.',
    transliteration: 'Thottanaith thoorum manarkeani maantharkkuk katranaith thoorum arivu.',
    meaning_en: 'The deeper you dig a sandy spring, the more water flows; the more you study, the deeper your wisdom grows.',
    meaning_ta: 'மணற்கேணியைத் தோண்டத் தோண்ட நீர் ஊறும்; அதுபோல தொடர்ந்து படிக்கப் படிக்க அறிவு வளரும்.',
    tag_en: 'Continuous Growth 🌱',
    tag_ta: 'தொடர் அறிவு வளர்ச்சி 🌱',
  },
  {
    id: 97,
    kuralLine1: 'பணிவுடையன் இன்சொலன் ஆதல் ஒருவற்கு',
    kuralLine2: 'அணியல்ல மற்றுப் பிற.',
    transliteration: 'Panivudaiyan insolan aathal oruvarku aniyalla matrup pira.',
    meaning_en: 'Humility and sweet words are the true ornaments for a person, nothing else.',
    meaning_ta: 'பணிவான நடத்தையும் இனிய சொற்களுமே ஒருவருக்கு உண்மையான அணிகலன்கள்.',
    tag_en: 'Kindness & Speech 💖',
    tag_ta: 'இனிய சொல்லும் அன்பும் 💖',
  },
];

export const TamilSoundboard: React.FC = () => {
  const { t, isTamil } = useTranslation();
  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);
  const [currentKuralIdx, setCurrentKuralIdx] = useState(0);
  const [sparkleCount, setSparkleCount] = useState(0);

  const kural = KURALS[currentKuralIdx];

  const handlePlaySound = (item: SoundItem) => {
    setActiveSoundId(item.id);
    soundService.playClick();
    soundService.speakTamil(`${item.tamil}. ${item.soundCue}`);
    setTimeout(() => {
      setActiveSoundId(null);
    }, 1600);
  };

  const handleNextKural = () => {
    soundService.playClick();
    setCurrentKuralIdx((prev) => (prev + 1) % KURALS.length);
    setSparkleCount((c) => c + 1);
  };

  const handleSpeakKural = () => {
    soundService.playCorrect();
    soundService.speakTamil(`${kural.kuralLine1} ${kural.kuralLine2}`);
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Thirukkural Sparkle of the Day Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 p-6 text-white shadow-playful border-4 border-amber-200/60"
      >
        {/* Decorative Floating Sparkles */}
        <div className="absolute top-2 right-3 opacity-30 text-6xl select-none pointer-events-none">
          ✨
        </div>
        <div className="absolute -bottom-4 -left-4 opacity-20 text-7xl select-none pointer-events-none">
          🦚
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner text-xl">
                📜
              </span>
              <div>
                <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  {t('kuralSparkleTitle')}
                  <Sparkles size={16} className="text-yellow-200 animate-spin" />
                </h3>
                <span className="text-[11px] font-bold bg-white/25 px-2 py-0.5 rounded-full text-white inline-block">
                  {isTamil ? kural.tag_ta : kural.tag_en}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakKural}
                className="flex items-center gap-1.5 bg-white text-orange-600 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md hover:bg-orange-50 active:scale-95 transition-all cursor-pointer"
                title={t('hearKural')}
              >
                <Volume2 size={16} />
                <span>{t('hearKural')}</span>
              </button>
              <button
                onClick={handleNextKural}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold text-xs px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer"
                title={t('nextSparkle')}
              >
                <RefreshCw size={14} className={sparkleCount > 0 ? 'rotate-180 transition-transform' : ''} />
                <span>{t('nextSparkle')}</span>
              </button>
            </div>
          </div>

          {/* Kural 3-Layers */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-2 mt-2">
            {/* Layer 1: Tamil Script */}
            <div className="font-tamil font-black text-lg sm:text-xl text-yellow-50 leading-relaxed text-center sm:text-left drop-shadow-sm">
              <p>{kural.kuralLine1}</p>
              <p>{kural.kuralLine2}</p>
            </div>

            {/* Layer 2: Transliteration */}
            <div className="text-xs text-amber-100 italic font-semibold">
              <span className="opacity-80">Phonetics: </span>
              {kural.transliteration}
            </div>

            {/* Layer 3: English / Tamil Meaning */}
            <div className="text-xs sm:text-sm text-white font-bold bg-black/15 p-2.5 rounded-xl border border-white/10">
              💡 {isTamil ? kural.meaning_ta : kural.meaning_en}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Interactive Tamil Soundboard */}
      <div className="bg-white rounded-3xl p-6 shadow-card border-2 border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-teal-100 text-teal-700 text-xl">
              🪘
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                {t('soundboardTitle')}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">
                {t('soundboardSubtitle')}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
            <Music size={13} /> {t('funSoundsBadge')}
          </span>
        </div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {SOUND_ITEMS.map((item) => {
            const isActive = activeSoundId === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePlaySound(item)}
                className={`relative flex flex-col items-center justify-between p-3.5 rounded-2xl border-b-4 transition-all text-center cursor-pointer overflow-hidden ${item.border} ${
                  isActive
                    ? 'bg-gradient-to-b from-yellow-300 to-amber-400 text-slate-900 shadow-md ring-4 ring-amber-300'
                    : `bg-gradient-to-b ${item.bg} text-white shadow-sm hover:shadow-md`
                }`}
              >
                {/* Visual pulse bubble on tap */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-white rounded-full pointer-events-none"
                  />
                )}

                {/* Big Emoji */}
                <span className="text-3xl sm:text-4xl filter drop-shadow-sm mb-1">
                  {item.emoji}
                </span>

                {/* Layer 1: Tamil Script */}
                <span className="font-tamil font-black text-base sm:text-lg leading-tight">
                  {item.tamil}
                </span>

                {/* Layer 2: Transliteration */}
                <span className="text-[11px] font-bold opacity-90 leading-tight">
                  {item.transliteration}
                </span>

                {/* Layer 3: English */}
                <span className="text-[10px] font-extrabold uppercase tracking-wide bg-black/20 px-2 py-0.5 rounded-full mt-1.5">
                  {item.english}
                </span>

                {/* Sound Cue on active */}
                {isActive && (
                  <span className="absolute -top-1 bg-white text-slate-900 font-tamil font-black text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                    🔊 {item.soundCue}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
