import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';
import { soundService } from '../../services/soundService';

interface WordTile {
  id: string;
  tamil: string;
  translit: string;
}

interface BuildSentenceProps {
  prompt: string;
  correctSentence: string;
  sentenceMeaning?: string;
  scrambledWords: WordTile[];
  onComplete: (score: number) => void;
}

export const BuildSentence: React.FC<BuildSentenceProps> = ({
  prompt,
  correctSentence,
  sentenceMeaning = '',
  scrambledWords,
  onComplete,
}) => {
  const [selectedTiles, setSelectedTiles] = useState<WordTile[]>([]);
  const [availableTiles, setAvailableTiles] = useState<WordTile[]>(scrambledWords);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddTile = (tile: WordTile) => {
    soundService.playClick();
    soundService.speakTamil(tile.tamil);
    setSelectedTiles((prev) => [...prev, tile]);
    setAvailableTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setFeedback(null);
  };

  const handleRemoveTile = (tile: WordTile) => {
    soundService.playClick();
    setSelectedTiles((prev) => prev.filter((t) => t.id !== tile.id));
    setAvailableTiles((prev) => [...prev, tile]);
    setFeedback(null);
  };

  const handleReset = () => {
    soundService.playClick();
    setSelectedTiles([]);
    setAvailableTiles(scrambledWords);
    setFeedback(null);
  };

  const handleCheck = () => {
    const constructed = selectedTiles.map((t) => t.tamil).join(' ').trim();
    const target = correctSentence.trim();

    if (constructed === target) {
      soundService.playCorrect();
      setFeedback('Super! You arranged the sentence perfectly! 🎉');
      setTimeout(() => {
        onComplete(100);
      }, 1200);
    } else {
      soundService.playIncorrect();
      setFeedback('Almost there! Look at the word order and try moving tiles around. 🦜');
    }
  };

  return (
    <div className="flex flex-col items-center max-w-lg mx-auto w-full">
      {/* Exercise Goal */}
      <div className="bg-purple-100/70 border-2 border-purple-300 rounded-3xl p-4 w-full mb-5 text-center">
        <h3 className="font-extrabold text-base md:text-lg text-purple-950">{prompt}</h3>
        {sentenceMeaning && (
          <p className="text-xs font-bold text-purple-800 mt-1 italic">"{sentenceMeaning}"</p>
        )}
      </div>

      {/* Target Sentence Area */}
      <div className="w-full min-h-[100px] bg-white border-3 border-dashed border-purple-300 rounded-3xl p-4 mb-6 flex flex-wrap items-center justify-center gap-2.5 shadow-inner">
        {selectedTiles.length === 0 ? (
          <span className="text-sm font-semibold text-slate-400 select-none">
            Tap the word tiles below to place them here 👆
          </span>
        ) : (
          selectedTiles.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRemoveTile(tile)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold px-4 py-2.5 rounded-2xl shadow-md border-b-3 border-purple-800 flex flex-col items-center cursor-pointer"
            >
              <span className="font-tamil text-xl leading-tight">{tile.tamil}</span>
              <span className="text-[10px] text-purple-100 font-semibold">{tile.translit}</span>
            </motion.button>
          ))
        )}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold text-center border-2 ${
            feedback.includes('Super')
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-purple-50 border-purple-300 text-purple-900'
          }`}
        >
          {feedback}
        </motion.div>
      )}

      {/* Scrambled Word Pool */}
      <div className="w-full bg-purple-50/50 border-2 border-purple-200 rounded-3xl p-4 mb-6 flex flex-wrap items-center justify-center gap-3">
        {availableTiles.length === 0 ? (
          <span className="text-xs font-bold text-slate-400 py-2">
            All tiles placed! Ready to check?
          </span>
        ) : (
          availableTiles.map((tile) => (
            <motion.button
              key={tile.id}
              layout
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddTile(tile)}
              className="bg-white hover:bg-purple-50 text-slate-800 border-2 border-slate-300 hover:border-purple-400 font-extrabold px-4 py-2.5 rounded-2xl shadow-sm border-b-4 border-b-slate-400 flex flex-col items-center cursor-pointer transition-colors"
            >
              <span className="font-tamil text-xl leading-tight">{tile.tamil}</span>
              <span className="text-[10px] text-slate-500 font-semibold">{tile.translit}</span>
            </motion.button>
          ))
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between w-full gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={handleReset}
          disabled={selectedTiles.length === 0}
          icon={<RotateCcw size={16} />}
        >
          Reset Tiles
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleCheck}
          disabled={selectedTiles.length === 0}
          icon={<CheckCircle2 size={18} />}
        >
          Check Sentence
        </Button>
      </div>
    </div>
  );
};
