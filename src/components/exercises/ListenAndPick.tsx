import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { soundService } from '../../services/soundService';

interface Option {
  id: string;
  tamil: string;
  translit: string;
  meaning: string;
  image_url?: string;
}

interface ListenAndPickProps {
  prompt: string;
  targetTamil: string;
  options: Option[];
  onComplete: (score: number) => void;
}

export const ListenAndPick: React.FC<ListenAndPickProps> = ({
  prompt,
  targetTamil,
  options,
  onComplete,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  // Play audio when exercise loads
  useEffect(() => {
    const timer = setTimeout(() => {
      soundService.speakTamil(targetTamil);
    }, 400);
    return () => clearTimeout(timer);
  }, [targetTamil]);

  const handlePlayAudio = () => {
    soundService.playClick();
    soundService.speakTamil(targetTamil);
  };

  const handleSelectOption = (option: Option) => {
    if (isAnswered) return;
    setSelectedId(option.id);

    const isCorrect = option.tamil === targetTamil;

    if (isCorrect) {
      setIsAnswered(true);
      setRetryMessage(null);
      soundService.playCorrect();
      setTimeout(() => {
        onComplete(100);
      }, 1200);
    } else {
      soundService.playIncorrect();
      setRetryMessage("That's close! Listen carefully and give it another try! 🦜");
      setTimeout(() => {
        setSelectedId(null);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full">
      {/* Big Audio Play Button Card */}
      <div className="bg-gradient-to-b from-teal-50 to-teal-100/60 border-2 border-teal-200 rounded-3xl p-6 w-full flex flex-col items-center shadow-sm mb-6 text-center">
        <p className="text-sm md:text-base font-bold text-slate-700 mb-3">{prompt}</p>

        <button
          type="button"
          onClick={handlePlayAudio}
          className="w-20 h-20 rounded-full bg-teal-500 hover:bg-teal-400 active:scale-95 text-white flex items-center justify-center shadow-lg border-b-4 border-teal-700 transition-all group"
        >
          <Volume2 size={36} className="group-hover:scale-110 transition-transform" />
        </button>
        <span className="text-xs font-bold text-teal-700 mt-2">Tap to listen again 🔊</span>
      </div>

      {/* Gentle Retry Helper Message */}
      {retryMessage && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-purple-50 border-2 border-purple-300 text-purple-900 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-center"
        >
          {retryMessage}
        </motion.div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
        {options.map((option) => {
          const isCurrentSelected = selectedId === option.id;
          const isCorrect = option.tamil === targetTamil;

          let cardStyle =
            'bg-white border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-slate-800 shadow-sm';
          if (isCurrentSelected && isCorrect) {
            cardStyle = 'bg-emerald-50 border-3 border-emerald-500 text-emerald-900 shadow-md';
          } else if (isCurrentSelected && !isCorrect) {
            cardStyle = 'bg-rose-50 border-3 border-rose-400 text-rose-900 animate-shake';
          }

          return (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectOption(option)}
              className={`p-4 rounded-3xl flex flex-col items-center text-center transition-all cursor-pointer relative overflow-hidden ${cardStyle}`}
            >
              {/* Optional image or emoji */}
              {option.image_url && <span className="text-3xl mb-1">{option.image_url}</span>}

              {/* 3 Layers: Tamil, translit, meaning */}
              <span className="font-tamil text-3xl sm:text-4xl font-extrabold text-slate-800 leading-tight">
                {option.tamil}
              </span>
              <span className="text-xs sm:text-sm font-bold text-teal-600 mt-1">
                {option.translit}
              </span>
              <span className="text-xs text-slate-500 font-medium italic">
                "{option.meaning}"
              </span>

              {/* Status Icons */}
              {isCurrentSelected && isCorrect && (
                <CheckCircle2 className="absolute top-2 right-2 text-emerald-500" size={20} />
              )}
              {isCurrentSelected && !isCorrect && (
                <XCircle className="absolute top-2 right-2 text-rose-500" size={20} />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
