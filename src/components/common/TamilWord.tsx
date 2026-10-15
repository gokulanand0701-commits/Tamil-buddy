import React from 'react';
import { Volume2 } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface TamilWordProps {
  tamil: string;
  transliteration: string;
  meaning: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showAudio?: boolean;
  className?: string;
  vertical?: boolean;
  highlightTamil?: boolean;
}

export const TamilWord: React.FC<TamilWordProps> = ({
  tamil,
  transliteration,
  meaning,
  size = 'md',
  showAudio = true,
  className = '',
  vertical = true,
  highlightTamil = false,
}) => {
  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundService.playClick();
    soundService.speakTamil(tamil);
  };

  const sizeClasses = {
    sm: {
      tamil: 'text-xl font-bold',
      translit: 'text-xs font-semibold',
      meaning: 'text-xs',
      icon: 14,
      padding: 'p-1.5',
    },
    md: {
      tamil: 'text-3xl font-extrabold',
      translit: 'text-sm font-semibold',
      meaning: 'text-xs font-medium',
      icon: 18,
      padding: 'p-3',
    },
    lg: {
      tamil: 'text-4xl md:text-5xl font-black',
      translit: 'text-base font-bold',
      meaning: 'text-sm font-semibold',
      icon: 22,
      padding: 'p-4',
    },
    hero: {
      tamil: 'text-6xl md:text-7xl font-black tracking-tight',
      translit: 'text-xl font-extrabold',
      meaning: 'text-base font-semibold',
      icon: 26,
      padding: 'p-5',
    },
  }[size];

  return (
    <div
      className={`inline-flex ${
        vertical ? 'flex-col items-center text-center' : 'flex-row items-center gap-3'
      } rounded-2xl transition-all duration-150 ${sizeClasses.padding} ${className}`}
    >
      {/* 3-layer Tamil presentation */}
      <div className="flex items-center gap-2">
        <span
          className={`font-tamil leading-tight text-slate-800 ${sizeClasses.tamil} ${
            highlightTamil ? 'text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-xl' : ''
          }`}
        >
          {tamil}
        </span>

        {showAudio && (
          <button
            type="button"
            onClick={handlePlayAudio}
            aria-label={`Listen to ${tamil}`}
            className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-100/80 active:scale-95 bg-teal-50 rounded-full transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <Volume2 size={sizeClasses.icon} />
          </button>
        )}
      </div>

      {/* Layer 2: English transliteration */}
      <span className={`text-teal-600/90 font-medium tracking-wide ${sizeClasses.translit}`}>
        {transliteration}
      </span>

      {/* Layer 3: English meaning */}
      <span className={`text-slate-500 italic ${sizeClasses.meaning}`}>
        "{meaning}"
      </span>
    </div>
  );
};
