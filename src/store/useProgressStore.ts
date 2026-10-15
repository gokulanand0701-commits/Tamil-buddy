import { create } from 'zustand';
import { BadgeItem, Lesson } from '../types';
import { MOCK_LESSONS } from '../mocks/mockLessons';
import { MOCK_BADGES, MOCK_DAILY_QUESTS, MOCK_STICKERS, StickerItem } from '../mocks/mockProgress';
import { useAuthStore } from './useAuthStore';
import { soundService } from '../services/soundService';

interface ProgressState {
  lessons: Lesson[];
  badges: BadgeItem[];
  stickers: StickerItem[];
  dailyQuests: typeof MOCK_DAILY_QUESTS;
  todayMinutesSpent: number;
  completedLessonModal: {
    isOpen: boolean;
    lesson: Lesson | null;
    xpEarned: number;
    newBadges: BadgeItem[];
    levelUp: boolean;
  } | null;

  setLessons: (lessons: Lesson[]) => void;
  getLessonById: (id: number) => Lesson | undefined;
  completeLesson: (lessonId: number, score: number, timeSpent: number) => void;
  closeCelebrationModal: () => void;
  unlockSticker: (stickerId: string) => void;
  addTimeSpent: (minutes: number) => void;
  completeQuest: (questId: string) => void;
}

export const useProgressStore = create<ProgressState>((set, get) => {
  // Load saved lessons from localStorage if available, merging with MOCK_LESSONS
  const savedLessonsStr = localStorage.getItem('tamil_buddy_lessons');
  let lessons = MOCK_LESSONS;
  if (savedLessonsStr) {
    try {
      const parsed = JSON.parse(savedLessonsStr);
      if (Array.isArray(parsed)) {
        lessons = MOCK_LESSONS.map((ml) => {
          const existing = parsed.find((p: Lesson) => p.id === ml.id);
          return existing
            ? { ...ml, is_completed: existing.is_completed, stars: existing.stars, is_locked: existing.is_locked ?? ml.is_locked }
            : ml;
        });
      }
    } catch (e) {
      lessons = MOCK_LESSONS;
    }
  }

  return {
    lessons,
    badges: MOCK_BADGES,
    stickers: MOCK_STICKERS,
    dailyQuests: MOCK_DAILY_QUESTS,
    todayMinutesSpent: 8,
    completedLessonModal: null,

    setLessons: (newLessons) => {
      localStorage.setItem('tamil_buddy_lessons', JSON.stringify(newLessons));
      set({ lessons: newLessons });
    },

    getLessonById: (id) => {
      return get().lessons.find((l) => l.id === id);
    },

    completeLesson: (lessonId, score, timeSpent) => {
      const currentLessons = [...get().lessons];
      const lessonIndex = currentLessons.findIndex((l) => l.id === lessonId);
      if (lessonIndex === -1) return;

      const currentLesson = currentLessons[lessonIndex];
      const stars = score >= 90 ? 3 : score >= 70 ? 2 : 1;
      const xpEarned = currentLesson.xp_reward + (score >= 90 ? 15 : score >= 70 ? 10 : 5);

      // Mark current completed
      currentLessons[lessonIndex] = {
        ...currentLesson,
        is_completed: true,
        stars: Math.max(currentLesson.stars || 0, stars),
      };

      // Unlock next lesson in order
      if (lessonIndex + 1 < currentLessons.length) {
        currentLessons[lessonIndex + 1] = {
          ...currentLessons[lessonIndex + 1],
          is_locked: false,
        };
      }

      localStorage.setItem('tamil_buddy_lessons', JSON.stringify(currentLessons));

      // Update Auth User XP and Level
      const authUser = useAuthStore.getState().user;
      let levelUp = false;
      const newBadges: BadgeItem[] = [];

      if (authUser) {
        const oldLevel = authUser.level;
        const newXp = authUser.xp + xpEarned;
        const newLevel = 1 + Math.floor(newXp / 100);
        levelUp = newLevel > oldLevel;

        useAuthStore.getState().updateUser({
          xp: newXp,
          level: newLevel,
          streak_current: authUser.streak_current,
        });

        // Check if any badge should be unlocked
        if (newXp >= 400) {
          const badge = get().badges.find((b) => b.code === 'word_collector');
          if (badge && !badge.unlocked_at) {
            badge.unlocked_at = new Date().toISOString().split('T')[0];
            newBadges.push(badge);
          }
        }
      }

      // Add time spent
      const minutes = Math.max(1, Math.round(timeSpent / 60));
      set((state) => ({
        lessons: currentLessons,
        todayMinutesSpent: state.todayMinutesSpent + minutes,
        completedLessonModal: {
          isOpen: true,
          lesson: currentLesson,
          xpEarned,
          newBadges,
          levelUp,
        },
      }));

      soundService.playVictory();
    },

    closeCelebrationModal: () => {
      set({ completedLessonModal: null });
    },

    unlockSticker: (stickerId) => {
      set((state) => ({
        stickers: state.stickers.map((s) =>
          s.id === stickerId ? { ...s, is_unlocked: true, unlocked_at: new Date().toISOString() } : s
        ),
      }));
    },

    addTimeSpent: (minutes) => {
      set((state) => ({ todayMinutesSpent: state.todayMinutesSpent + minutes }));
    },

    completeQuest: (questId) => {
      set((state) => ({
        dailyQuests: state.dailyQuests.map((q) =>
          q.id === questId ? { ...q, current: q.target, is_completed: true } : q
        ),
      }));
    },
  };
});
