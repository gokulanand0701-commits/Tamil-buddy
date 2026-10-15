import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface PairItem {
  tamil: string;
  english: string;
  translit?: string;
  image_url?: string;
}

interface MatchPairsProps {
  prompt: string;
  pairs: PairItem[];
  onComplete: (score: number) => void;
}

export const MatchPairs: React.FC<MatchPairsProps> = ({
  prompt,
  pairs,
  onComplete,
}) => {
  const [selectedTamil, setSelectedTamil] = useState<string | null>(null);
  const [selectedEnglish, setSelectedEnglish] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<{ tamil: string; english: string } | null>(null);

  // Shuffle english sides
  const [shuffledEnglish] = useState(() => {
    return [...pairs].sort(() => Math.random() - 0.5);
  });

  const checkMatch = (tamil: string, english: string) => {
    const matched = pairs.some((p) => p.tamil === tamil && p.english === english);

    if (matched) {
      soundService.playCorrect();
      const newMatched = [...matchedPairs, tamil];
      setMatchedPairs(newMatched);
      setSelectedTamil(null);
      setSelectedEnglish(null);

      // Check if all matched
      if (newMatched.length === pairs.length) {
        setTimeout(() => {
          onComplete(100);
        }, 1000);
      }
    } else {
      soundService.playIncorrect();
      setWrongPair({ tamil, english });
      setTimeout(() => {
        setSelectedTamil(null);
        setSelectedEnglish(null);
        setWrongPair(null);
      }, 800);
    }
  };

  const handleSelectTamil = (tamil: string) => {
    if (matchedPairs.includes(tamil)) return;
    soundService.playClick();
    soundService.speakTamil(tamil);
    setSelectedTamil(tamil);

    if (selectedEnglish) {
      checkMatch(tamil, selectedEnglish);
    }
  };

  const handleSelectEnglish = (english: string) => {
    const pair = pairs.find((p) => p.english === english);
    if (pair && matchedPairs.includes(pair.tamil)) return;
    soundService.playClick();
    setSelectedEnglish(english);

    if (selectedTamil) {
      checkMatch(selectedTamil, english);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full">
      <div className="bg-amber-100/60 border-2 border-amber-300 rounded-3xl p-4 w-full mb-6 text-center">
        <h3 className="font-extrabold text-base md:text-lg text-slate-800">{prompt}</h3>
        <p className="text-xs font-semibold text-amber-800 mt-0.5">
          Tap a Tamil word, then tap its match! ({matchedPairs.length}/{pairs.length} paired)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Left Column: Tamil Words */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider text-center">
            Tamil Words
          </span>
          {pairs.map((p) => {
            const isMatched = matchedPairs.includes(p.tamil);
            const isSelected = selectedTamil === p.tamil;
            const isWrong = wrongPair?.tamil === p.tamil;

            let style =
              'bg-white border-2 border-slate-200 hover:border-teal-400 text-slate-800 shadow-sm';
            if (isMatched) {
              style = 'bg-emerald-100/80 border-2 border-emerald-500 text-emerald-800 opacity-80';
            } else if (isSelected) {
              style = 'bg-teal-50 border-3 border-teal-500 text-teal-900 shadow-md scale-102';
            } else if (isWrong) {
              style = 'bg-rose-50 border-3 border-rose-400 text-rose-900 animate-shake';
            }

            return (
              <motion.button
                key={p.tamil}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectTamil(p.tamil)}
                disabled={isMatched}
                className={`p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${style}`}
              >
                <span className="font-tamil text-2xl font-black text-slate-800">
                  {p.tamil}
                </span>
                {p.translit && (
                  <span className="text-xs font-semibold text-teal-600 mt-0.5">
                    ({p.translit})
                  </span>
                )}
                {isMatched && (
                  <span className="absolute top-2 right-2 text-emerald-600">
                    <Check size={16} strokeWidth={3} />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column: English Meanings / Images */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider text-center">
            Meaning & Picture
          </span>
          {shuffledEnglish.map((p) => {
            const isMatched = matchedPairs.includes(p.tamil);
            const isSelected = selectedEnglish === p.english;
            const isWrong = wrongPair?.english === p.english;

            let style =
              'bg-white border-2 border-slate-200 hover:border-amber-400 text-slate-800 shadow-sm';
            if (isMatched) {
              style = 'bg-emerald-100/80 border-2 border-emerald-500 text-emerald-800 opacity-80';
            } else if (isSelected) {
              style = 'bg-amber-50 border-3 border-amber-500 text-amber-900 shadow-md scale-102';
            } else if (isWrong) {
              style = 'bg-rose-50 border-3 border-rose-400 text-rose-900';
            }

            return (
              <motion.button
                key={p.english}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectEnglish(p.english)}
                disabled={isMatched}
                className={`p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative ${style}`}
              >
                {p.image_url && <span className="text-2xl mb-0.5">{p.image_url}</span>}
                <span className="font-bold text-sm text-slate-800">{p.english}</span>
                {isMatched && (
                  <span className="absolute top-2 right-2 text-emerald-600">
                    <Check size={16} strokeWidth={3} />
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
