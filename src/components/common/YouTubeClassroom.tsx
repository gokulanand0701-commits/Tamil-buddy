import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Key, X, Video, Sparkles, ExternalLink, Film, Check } from 'lucide-react';
import { youtubeService, YouTubeVideoItem, CURATED_TAMIL_VIDEOS } from '../../services/youtubeService';
import { soundService } from '../../services/soundService';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from './Button';

export const YouTubeClassroom: React.FC = () => {
  const { t, isTamil } = useTranslation();
  const [videos, setVideos] = useState<YouTubeVideoItem[]>(CURATED_TAMIL_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideoItem | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [currentKey, setCurrentKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const key = youtubeService.getApiKey();
    setCurrentKey(key);
    setApiKeyInput(key);
    youtubeService.searchTamilVideos().then(setVideos);
  }, []);

  const handleOpenVideo = (video: YouTubeVideoItem) => {
    soundService.playClick();
    setSelectedVideo(video);
  };

  const handleSaveKey = () => {
    soundService.playCorrect();
    youtubeService.setApiKey(apiKeyInput);
    setCurrentKey(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsKeyModalOpen(false);
    }, 1200);

    // Refresh videos with new API key
    youtubeService.searchTamilVideos().then(setVideos);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/40 border-3 border-purple-200/80 rounded-4xl p-6 sm:p-8 shadow-card w-full my-6 relative overflow-hidden">
      {/* Decorative film reel accents */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-purple-100/50 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black mb-1.5 shadow-xs">
            <Film size={14} className="text-red-600" />
            <span>{isTamil ? 'காணொளிப் பாடங்கள்' : 'REFERENCE VIDEO LESSONS'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            {t('videoClassroomTitle')} 🎬
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {t('videoClassroomSubtitle')}
          </p>
        </div>

        {/* YouTube API Key Button */}
        <button
          type="button"
          onClick={() => {
            soundService.playClick();
            setIsKeyModalOpen(true);
          }}
          className="flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-red-300 px-3.5 py-2 rounded-2xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Key size={14} className="text-amber-500" />
          <span>{currentKey ? (isTamil ? 'சாவி இயக்கத்தில் உள்ளது 🔑' : 'API Key Active 🔑') : t('apiKeyBtn')}</span>
        </button>
      </div>

      {/* Video Cards Grid - Responsive 3-columns on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-white rounded-3xl border-2 border-slate-200 hover:border-red-400 overflow-hidden shadow-sm hover:shadow-md flex flex-col justify-between transition-all group"
          >
            {/* Thumbnail with overlay play button */}
            <div
              className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden"
              onClick={() => handleOpenVideo(video)}
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play size={20} className="fill-white translate-x-0.5" />
                </div>
              </div>
              {video.duration && (
                <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">
                  {video.duration}
                </span>
              )}
            </div>

            {/* Video Meta Info */}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <span className="font-tamil text-xs font-extrabold text-red-600 block line-clamp-1 mb-0.5">
                  {video.title_tamil}
                </span>
                <h3 className="font-extrabold text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
                  {isTamil && video.title_tamil ? video.title_tamil : video.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleOpenVideo(video)}
                className="mt-3 text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
              >
                <Play size={12} className="fill-current" /> {t('watchNow')}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl border-2 border-red-300"
            >
              {/* Modal Top Bar */}
              <div className="bg-red-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🦜</span>
                  <div>
                    <h3 className="font-black text-sm sm:text-base leading-tight">
                      {isTamil && selectedVideo.title_tamil ? selectedVideo.title_tamil : selectedVideo.title}
                    </h3>
                    <p className="font-tamil text-xs text-red-100">{selectedVideo.title_tamil}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedVideo(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* YouTube 16:9 Iframe Embed */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Modal Footer Description */}
              <div className="p-4 bg-slate-50 flex items-center justify-between">
                <p className="text-xs text-slate-600 font-medium">
                  {selectedVideo.description}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 shrink-0 ml-4"
                >
                  <span>Open in YouTube</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* API Key Configuration Modal */}
      <AnimatePresence>
        {isKeyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-2 border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl">
                    🔑
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-base">
                      {isTamil ? 'YouTube API சாவி அமைப்புகள்' : 'YouTube API Key Settings'}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {isTamil ? 'உங்கள் Google Cloud சாவியை இணைக்கவும்' : 'Connect your own Google Cloud key'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-xs font-medium text-slate-600">
                <p>
                  {isTamil
                    ? 'YouTube Data API v3 சாவியை கீழே உள்ளிடவும். சாவி இல்லாதபோதும், மாணவர்களுக்கான தேர்ந்தெடுத்த பாடங்கள் தொடர்ந்து இயங்கும்!'
                    : 'Enter your YouTube Data API v3 key below. Even without an API key, Tamil Buddy plays built-in curated lessons seamlessly!'}
                </p>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-600 mb-1">
                    API Key (AIzaSy...)
                  </label>
                  <input
                    type="text"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSyBxxxxxxxxx..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-red-400 outline-none font-mono text-xs bg-slate-50"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveKey}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-2.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {savedSuccess ? (
                      <>
                        <Check size={16} />
                        <span>{isTamil ? 'சேமிக்கப்பட்டது!' : 'Saved!'}</span>
                      </>
                    ) : (
                      <span>{isTamil ? 'சாவியை சேமிக்க' : 'Save Key'}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      youtubeService.setApiKey('');
                      setCurrentKey('');
                      setApiKeyInput('');
                      setIsKeyModalOpen(false);
                    }}
                    className="px-3 py-2.5 text-slate-500 hover:text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    {isTamil ? 'அகற்று' : 'Clear'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
