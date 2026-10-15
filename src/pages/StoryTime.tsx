import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Volume2, Play, Pause, ChevronLeft, ChevronRight, X, Sparkles, Award, RotateCcw, Heart } from 'lucide-react';
import { MOCK_STORIES } from '../mocks/mockStories';
import { Story, StorySentence } from '../types';
import { soundService } from '../services/soundService';
import { useTranslation } from '../hooks/useTranslation';
import { StorySceneIllustration } from '../components/common/StorySceneIllustration';
import confetti from 'canvas-confetti';

export const StoryTime: React.FC = () => {
  const { t, isTamil } = useTranslation();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeGenreFilter, setActiveGenreFilter] = useState<string>('all');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{ tamil: string; translit: string; meaning: string } | null>(null);
  const [isStoryFinished, setIsStoryFinished] = useState(false);

  const filteredStories = activeGenreFilter === 'all'
    ? MOCK_STORIES
    : MOCK_STORIES.filter((s) => s.genre === activeGenreFilter);

  const handleOpenStory = (story: Story) => {
    soundService.playClick();
    setSelectedStory(story);
    setActiveSlideIndex(0);
    setIsStoryFinished(false);
    setSelectedWord(null);
    setIsAutoPlaying(false);
  };

  const handleCloseStory = () => {
    soundService.playClick();
    setSelectedStory(null);
    setIsAutoPlaying(false);
    setIsStoryFinished(false);
  };

  const handleNextSlide = () => {
    if (!selectedStory) return;
    soundService.playClick();
    if (activeSlideIndex + 1 < selectedStory.sentences.length) {
      setActiveSlideIndex((prev) => prev + 1);
      setSelectedWord(null);
    } else {
      // Completed story!
      setIsStoryFinished(true);
      soundService.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handlePrevSlide = () => {
    if (activeSlideIndex > 0) {
      soundService.playClick();
      setActiveSlideIndex((prev) => prev - 1);
      setSelectedWord(null);
    }
  };

  const handleSpeakCurrentSentence = () => {
    if (!selectedStory) return;
    soundService.playClick();
    const currSentence = selectedStory.sentences[activeSlideIndex];
    soundService.speakTamil(currSentence.sentence_tamil);
  };

  const handleWordTap = (word: { tamil: string; translit: string; meaning: string }) => {
    soundService.playClick();
    soundService.speakTamil(word.tamil);
    setSelectedWord(word);
  };

  const GENRES = [
    { id: 'all', label_en: 'All Stories', label_ta: 'அனைத்து கதைகள்', emoji: '📚' },
    { id: 'motivational', label_en: 'Motivational', label_ta: 'விடாமுயற்சி', emoji: '🦅' },
    { id: 'funny', label_en: 'Funny', label_ta: 'நகைச்சுவை', emoji: '😄' },
    { id: 'sarcastic', label_en: 'Witty / Sarcastic', label_ta: 'கிண்டல் & அறிவு', emoji: '🦊' },
    { id: 'compassion', label_en: 'Compassion', label_ta: 'கருணை', emoji: '🦁' },
    { id: 'patience', label_en: 'Patience', label_ta: 'பொறுமை', emoji: '🐢' },
    { id: 'friendship', label_en: 'Friendship', label_ta: 'நட்பு', emoji: '🐘' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-16 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-black mb-2 shadow-xs">
          <span>📖</span>
          <span>{isTamil ? 'படங்களுடன் கூடிய தமிழ் கதைக் களம்' : 'Slide-by-Slide Illustrated Stories'}</span>
          <span>✨</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
          {isTamil ? 'தமிழ்ச் சிறுகதைகள் (Tamil Stories)' : 'Tamil Storyland (கதைக் களம்)'} 📚
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1 max-w-xl mx-auto">
          {isTamil
            ? 'ஒவ்வொரு வாக்கியத்திற்கும் பொருத்தமான படங்களுடன் கதைகளைக் கண்டு கேட்டு மகிழுங்கள்!'
            : 'Explore funny, witty, motivational and kind stories with sentence-matched animated illustrations!'}
        </p>
      </div>

      {/* Genre Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => {
              soundService.playClick();
              setActiveGenreFilter(genre.id);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
              activeGenreFilter === genre.id
                ? 'bg-purple-600 border-purple-700 text-white shadow-sm scale-102'
                : 'bg-white border-purple-200 text-purple-900/80 hover:bg-purple-50'
            }`}
          >
            <span>{genre.emoji}</span>
            <span>{isTamil ? genre.label_ta : genre.label_en}</span>
          </button>
        ))}
      </div>

      {/* Stories Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white rounded-4xl border-2 border-purple-200 hover:border-purple-400 overflow-hidden shadow-card flex flex-col justify-between transition-all group"
          >
            {/* Story Card Top Header */}
            <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100/60 flex items-center justify-between border-b border-purple-100">
              <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                {story.genre_emoji || '📖'}
              </span>
              <span className="text-xs font-black bg-white/90 px-3 py-1 rounded-full text-purple-900 shadow-xs border border-purple-200">
                {story.sentences.length} {isTamil ? 'படக் காட்சிகள்' : 'Slides'} 🖼️
              </span>
            </div>

            {/* Story Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full inline-block mb-2 border border-purple-200">
                  {story.genre_label || story.level}
                </span>

                <h3 className="font-tamil font-black text-xl text-slate-800 leading-snug">
                  {story.title_tamil}
                </h3>
                <h4 className="font-extrabold text-sm text-slate-600 mt-0.5">
                  {story.title_english}
                </h4>

                <p className="text-xs text-slate-500 italic mt-3 line-clamp-2">
                  💡 {story.moral}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenStory(story)}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-3 rounded-2xl shadow-playful transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <BookOpen size={18} />
                <span>{isTamil ? 'கதை படிக்கத் தொடங்கு' : 'Read Illustrated Story 📖'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Slide-by-Slide Storybook Modal Player */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-4xl shadow-2xl border-4 border-purple-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[94vh]"
            >
              {/* Modal Top Bar */}
              <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-800 p-4 text-white flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedStory.genre_emoji || '📖'}</span>
                  <div>
                    <h2 className="font-black text-base sm:text-lg leading-tight">
                      {isTamil ? selectedStory.title_tamil : selectedStory.title_english}
                    </h2>
                    <span className="text-xs text-purple-200 font-semibold font-tamil">
                      {selectedStory.title_tamil}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Slide Counter */}
                  <span className="bg-black/20 backdrop-blur-sm text-xs font-black px-3 py-1 rounded-full">
                    {activeSlideIndex + 1} / {selectedStory.sentences.length}
                  </span>
                  <button
                    onClick={handleCloseStory}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-between gap-4">
                {!isStoryFinished ? (
                  <>
                    {/* 1. Explicit Sentence-Matched Illustration */}
                    <div className="w-full">
                      <StorySceneIllustration
                        sceneKey={selectedStory.sentences[activeSlideIndex]?.scene_illustration}
                        storyId={selectedStory.id}
                      />
                    </div>

                    {/* 2. 3-Layer Sentence Display Card with Cozy Purple Theme */}
                    <div className="bg-purple-50/70 border-2 border-purple-200 rounded-3xl p-4 sm:p-5 text-center space-y-3 relative">
                      {/* Audio listen button */}
                      <button
                        onClick={handleSpeakCurrentSentence}
                        className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
                        title="Hear Sentence in Tamil"
                      >
                        <Volume2 size={20} />
                      </button>

                      {/* Layer 1: Tamil Words (Clickable) */}
                      <div>
                        <div className="flex flex-wrap justify-center items-center gap-2 px-6">
                          {selectedStory.sentences[activeSlideIndex]?.words.map((w, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleWordTap(w)}
                              className="font-tamil font-black text-xl sm:text-2xl text-slate-900 hover:text-purple-700 bg-white hover:bg-purple-50 px-3 py-1.5 rounded-2xl shadow-xs border border-purple-200 transition-all cursor-pointer"
                            >
                              {w.tamil}
                            </button>
                          ))}
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 mt-1">
                          {isTamil ? 'சொல்லின் உச்சரிப்பைக் கேட்க தட்டவும்' : 'Tap any word to hear & translate'}
                        </p>
                      </div>

                      {/* Word Popup Meaning */}
                      {selectedWord && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-teal-500 text-white text-xs font-bold py-1.5 px-4 rounded-xl inline-flex items-center gap-2 shadow-sm"
                        >
                          <span className="font-tamil text-sm font-black">{selectedWord.tamil}</span>
                          <span>•</span>
                          <span className="italic">{selectedWord.translit}</span>
                          <span>=</span>
                          <span className="font-black text-yellow-200">"{selectedWord.meaning}"</span>
                        </motion.div>
                      )}

                      {/* Layer 2: Transliteration */}
                      <div className="text-xs sm:text-sm font-bold text-amber-800 italic">
                        {selectedStory.sentences[activeSlideIndex]?.sentence_translit}
                      </div>

                      {/* Layer 3: English Translation */}
                      <div className="text-xs sm:text-sm font-semibold text-slate-700 bg-white p-3 rounded-2xl border border-slate-200 inline-block">
                        💡 {selectedStory.sentences[activeSlideIndex]?.sentence_english}
                      </div>
                    </div>

                    {/* 3. Slide Progression Controls */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        onClick={handlePrevSlide}
                        disabled={activeSlideIndex === 0}
                        className={`flex items-center gap-1 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                          activeSlideIndex === 0
                            ? 'opacity-40 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <ChevronLeft size={16} />
                        <span>{isTamil ? 'முந்தைய காட்சி' : 'Previous'}</span>
                      </button>

                      {/* Dots Indicator */}
                      <div className="flex items-center gap-1.5">
                        {selectedStory.sentences.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={() => {
                              soundService.playClick();
                              setActiveSlideIndex(dotIdx);
                              setSelectedWord(null);
                            }}
                            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                              dotIdx === activeSlideIndex
                                ? 'w-6 bg-purple-600 shadow-xs'
                                : 'bg-slate-200 hover:bg-slate-300'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={handleNextSlide}
                        className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        <span>
                          {activeSlideIndex + 1 === selectedStory.sentences.length
                            ? (isTamil ? 'கதை நிறைவு 🎉' : 'Finish Story 🎉')
                            : (isTamil ? 'அடுத்த காட்சி ➔' : 'Next ➔')}
                        </span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  /* Story Completion / Moral Celebration View */
                  <div className="flex flex-col items-center justify-center text-center p-6 space-y-5">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [-4, 4, -4] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-7xl"
                    >
                      🏆🎉✨
                    </motion.div>

                    <div>
                      <span className="text-xs font-black uppercase text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                        {isTamil ? 'கதை நிறைவடைந்தது!' : 'Story Completed!'}
                      </span>
                      <h3 className="text-2xl font-black text-slate-800 mt-2">
                        {isTamil ? selectedStory.title_tamil : selectedStory.title_english}
                      </h3>
                    </div>

                    {/* Moral Card */}
                    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-white border-2 border-purple-200 rounded-3xl p-6 max-w-md w-full shadow-sm text-center">
                      <span className="text-xs font-black text-purple-800 uppercase tracking-wider block mb-1">
                        🌟 {isTamil ? 'கதையின் நீதி (Moral of the Story)' : 'Moral of the Story'}
                      </span>
                      <p className="font-tamil font-extrabold text-lg text-slate-900 leading-relaxed">
                        {selectedStory.moral}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm pt-2">
                      <button
                        onClick={() => {
                          soundService.playClick();
                          setActiveSlideIndex(0);
                          setIsStoryFinished(false);
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform active:scale-95"
                      >
                        <RotateCcw size={16} />
                        <span>{isTamil ? 'மீண்டும் படிக்க' : 'Read Again 🔄'}</span>
                      </button>

                      <button
                        onClick={handleCloseStory}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-3 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{isTamil ? 'பிற கதைகள்' : 'Other Stories 📚'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
