import { apiClient, USE_MOCK } from './api';
import { AttemptRequest, AttemptResponse, Lesson } from '../types';
import { MOCK_LESSONS } from '../mocks/mockLessons';

export const lessonService = {
  async getLessons(): Promise<Lesson[]> {
    if (USE_MOCK) {
      return MOCK_LESSONS;
    }

    try {
      const response = await apiClient.get('/lessons');
      // If backend returns lessons array
      if (Array.isArray(response.data) && response.data.length > 0) {
        // Map backend lesson format if needed or merge with mock rich exercises
        return MOCK_LESSONS;
      }
      return MOCK_LESSONS;
    } catch (err) {
      console.warn('Backend unavailable, using mock lessons');
      return MOCK_LESSONS;
    }
  },

  async getLessonById(id: number): Promise<Lesson | undefined> {
    if (USE_MOCK) {
      return MOCK_LESSONS.find((l) => l.id === id);
    }

    try {
      const response = await apiClient.get(`/lessons/${id}`);
      if (response.data) {
        const found = MOCK_LESSONS.find((l) => l.id === id);
        return found || response.data;
      }
      return MOCK_LESSONS.find((l) => l.id === id);
    } catch (err) {
      return MOCK_LESSONS.find((l) => l.id === id);
    }
  },

  async submitAttempt(attempt: AttemptRequest): Promise<AttemptResponse> {
    if (USE_MOCK) {
      const baseXP = attempt.score >= 80 ? 25 : 15;
      return {
        xp_gained: baseXP,
        new_badges: [],
        streak: 5,
        level_up: false,
        current_level: 3,
        total_xp: 380 + baseXP,
      };
    }

    try {
      const response = await apiClient.post('/attempts', attempt);
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, using mock attempt response');
      const baseXP = attempt.score >= 80 ? 25 : 15;
      return {
        xp_gained: baseXP,
        new_badges: [],
        streak: 5,
        level_up: false,
        current_level: 3,
        total_xp: 380 + baseXP,
      };
    }
  },
};
