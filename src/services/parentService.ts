import { apiClient, USE_MOCK } from './api';
import { ParentReport } from '../types';
import { useAuthStore } from '../store/useAuthStore';

export const parentService = {
  async getParentReport(userId: number = 1): Promise<ParentReport> {
    const authUser = useAuthStore.getState().user;

    const mockReport: ParentReport = {
      user_id: userId,
      child_name: authUser?.name || 'Ananya',
      weekly_summary: {
        total_minutes: 84.5,
        lessons_completed: 6,
        total_xp: authUser?.xp || 380,
        streak: authUser?.streak_current || 5,
      },
      weak_areas: [
        'Speaking: ழ் sound distinction (e.g. பழம்)',
        'Writing: ஐ & ஔ complex stroke loops',
        'Consonants: ற் vs ர் pronunciation',
      ],
      time_spent: 84.5,
      recommended_next_lessons: [
        {
          id: 2,
          unit: 1,
          title: 'Breezy Vowels: இ & ஈ',
          type: 'letter_intro',
          reason: 'Reinforce short vs long vowel duration',
        },
        {
          id: 4,
          unit: 2,
          title: 'Dotted Friends: க், ங், ச்',
          type: 'consonant_intro',
          reason: 'Expand vocabulary with first dotted consonants',
        },
      ],
      engagement_metrics: {
        accuracy_rate: 86.4,
        preferred_time_of_day: '5:30 PM (Evening)',
        completion_consistency: 'Very High',
        speech_attempts_count: 28,
      },
      daily_minutes_goal: authUser?.daily_goal_minutes || 15,
    };

    if (USE_MOCK) {
      return mockReport;
    }

    try {
      const response = await apiClient.get(`/parent/report/${userId}`);
      return response.data;
    } catch (err) {
      console.warn('Backend parent report failed, falling back to mock report');
      return mockReport;
    }
  },

  async updateDailyGoal(childId: number, dailyMinutesGoal: number) {
    useAuthStore.getState().updateUser({ daily_goal_minutes: dailyMinutesGoal });

    if (USE_MOCK) {
      return { success: true, daily_minutes_goal: dailyMinutesGoal };
    }

    try {
      const response = await apiClient.post('/parent/goal', {
        child_id: childId,
        daily_minutes_goal: dailyMinutesGoal,
      });
      return response.data;
    } catch (err) {
      return { success: true, daily_minutes_goal: dailyMinutesGoal };
    }
  },
};
