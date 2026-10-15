import { apiClient, USE_MOCK } from './api';
import { ProgressReport } from '../types';
import { MOCK_PROGRESS_REPORT } from '../mocks/mockProgress';
import { useAuthStore } from '../store/useAuthStore';

export const progressService = {
  async getProgress(userId: number = 1): Promise<ProgressReport> {
    const authUser = useAuthStore.getState().user;

    if (USE_MOCK) {
      return {
        ...MOCK_PROGRESS_REPORT,
        user_id: userId,
        name: authUser?.name || MOCK_PROGRESS_REPORT.name,
        level: authUser?.level || MOCK_PROGRESS_REPORT.level,
        total_xp: authUser?.xp || MOCK_PROGRESS_REPORT.total_xp,
        streak_current: authUser?.streak_current || MOCK_PROGRESS_REPORT.streak_current,
      };
    }

    try {
      const response = await apiClient.get(`/progress/${userId}`);
      return response.data;
    } catch (err) {
      console.warn('Backend progress failed, falling back to mock report');
      return {
        ...MOCK_PROGRESS_REPORT,
        user_id: userId,
        name: authUser?.name || MOCK_PROGRESS_REPORT.name,
        level: authUser?.level || MOCK_PROGRESS_REPORT.level,
        total_xp: authUser?.xp || MOCK_PROGRESS_REPORT.total_xp,
        streak_current: authUser?.streak_current || MOCK_PROGRESS_REPORT.streak_current,
      };
    }
  },
};
