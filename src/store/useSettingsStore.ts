import { create } from 'zustand';
import { soundService } from '../services/soundService';

interface SettingsState {
  language: 'en' | 'ta';
  isMuted: boolean;
  setLanguage: (lang: 'en' | 'ta') => void;
  toggleLanguage: () => void;
  setMuted: (muted: boolean) => void;
  toggleMuted: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => {
  const savedMuted = localStorage.getItem('tamil_buddy_muted') === 'true';
  const savedLang = (localStorage.getItem('tamil_buddy_lang') as 'en' | 'ta') || 'en';

  soundService.setMuted(savedMuted);

  return {
    language: savedLang,
    isMuted: savedMuted,
    setLanguage: (lang) => {
      localStorage.setItem('tamil_buddy_lang', lang);
      set({ language: lang });
    },
    toggleLanguage: () => {
      set((state) => {
        const next = state.language === 'en' ? 'ta' : 'en';
        localStorage.setItem('tamil_buddy_lang', next);
        return { language: next };
      });
    },
    setMuted: (muted) => {
      localStorage.setItem('tamil_buddy_muted', String(muted));
      soundService.setMuted(muted);
      set({ isMuted: muted });
    },
    toggleMuted: () => {
      set((state) => {
        const next = !state.isMuted;
        localStorage.setItem('tamil_buddy_muted', String(next));
        soundService.setMuted(next);
        return { isMuted: next };
      });
    },
  };
});
