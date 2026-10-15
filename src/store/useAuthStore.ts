import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isParentUnlocked: boolean;
  missedDaysDetected: boolean;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  updateProfile: (updates: { name?: string; age?: number; avatar?: string; learning_level?: string }) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  setOnboarded: (status: boolean) => void;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    age: number;
    avatar: string;
    learning_level?: string;
  }) => Promise<User>;
  logout: () => void;
  unlockParent: (pin: string) => boolean;
  lockParent: () => void;
  setParentPin: (pin: string) => void;
  dismissWelcomeBack: () => void;
  useStreakFreeze: () => boolean;
  addCoins: (amount: number) => number;
  spendCoins: (amount: number) => boolean;
  buyStreakFreeze: (cost?: number) => { success: boolean; message: string };
  repairAndResumeStreak: (cost?: number) => { success: boolean; message: string };
}

export const useAuthStore = create<AuthState>((set, get) => {
  // When opening the website fresh, display the Login/Register page first.
  // We check for an active session flag in sessionStorage.
  const isSessionActive = sessionStorage.getItem('tamil_buddy_session_active') === 'true';
  const savedUserStr = localStorage.getItem('tamil_buddy_user');
  let initialUser: User | null = null;
  let isAuthenticated = false;

  if (isSessionActive && savedUserStr) {
    try {
      initialUser = JSON.parse(savedUserStr);
      isAuthenticated = !!initialUser && !!initialUser.email;
    } catch {
      initialUser = null;
      isAuthenticated = false;
    }
  }

  // Check missed days if user is authenticated
  const todayStr = new Date().toISOString().split('T')[0];
  let missed = false;
  if (initialUser && initialUser.last_active_date) {
    const lastDate = new Date(initialUser.last_active_date);
    const today = new Date(todayStr);
    const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays > 1) {
      missed = true;
    }
  }

  return {
    user: initialUser,
    isAuthenticated: isAuthenticated,
    isOnboarded: isAuthenticated,
    isParentUnlocked: false,
    missedDaysDetected: missed,

    setUser: (user) => {
      if (user) {
        localStorage.setItem('tamil_buddy_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('tamil_buddy_user');
        localStorage.removeItem('tamil_buddy_token');
      }
      set({ user, isAuthenticated: !!user, isOnboarded: !!user });
    },

    updateUser: (updates) => {
      const current = get().user;
      if (!current) return;
      const updated = { ...current, ...updates };
      localStorage.setItem('tamil_buddy_user', JSON.stringify(updated));
      set({ user: updated });
    },

    updateProfile: async (updates) => {
      const updatedUser = await authService.updateProfile(updates);
      localStorage.setItem('tamil_buddy_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return updatedUser;
    },

    changePassword: async (currentPassword, newPassword) => {
      await authService.changePassword(currentPassword, newPassword);
    },

    setOnboarded: (status) => {
      set({ isOnboarded: status });
    },

    login: async (email, password) => {
      // Authenticate via database service
      const res = await authService.login(email, password);
      sessionStorage.setItem('tamil_buddy_session_active', 'true');
      localStorage.setItem('tamil_buddy_user', JSON.stringify(res.user));
      set({
        user: res.user,
        isAuthenticated: true,
        isOnboarded: true,
      });
      return res.user;
    },

    register: async (data) => {
      // Register new user record in database
      const res = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        age: data.age,
        avatar: data.avatar,
        role: 'child',
        learning_level: data.learning_level,
      });

      sessionStorage.setItem('tamil_buddy_session_active', 'true');
      localStorage.setItem('tamil_buddy_user', JSON.stringify(res.user));
      set({
        user: res.user,
        isAuthenticated: true,
        isOnboarded: true,
        missedDaysDetected: false,
      });
      return res.user;
    },

    logout: () => {
      sessionStorage.removeItem('tamil_buddy_session_active');
      localStorage.removeItem('tamil_buddy_user');
      localStorage.removeItem('tamil_buddy_token');
      set({
        user: null,
        isAuthenticated: false,
        isOnboarded: false,
        isParentUnlocked: false,
      });
    },

    unlockParent: (pin: string) => {
      const storedCustomPin = localStorage.getItem('tamil_buddy_parent_pin');
      const userPin = get().user?.parent_pin;
      const effectivePin = storedCustomPin || userPin || '1234';

      // Strict verification: only the current effective PIN works!
      if (pin === effectivePin) {
        set({ isParentUnlocked: true });
        return true;
      }
      return false;
    },

    lockParent: () => {
      set({ isParentUnlocked: false });
    },

    setParentPin: (pin: string) => {
      localStorage.setItem('tamil_buddy_parent_pin', pin);
      get().updateUser({ parent_pin: pin });
    },

    dismissWelcomeBack: () => {
      set({ missedDaysDetected: false });
      get().updateUser({ last_active_date: todayStr });
    },

    useStreakFreeze: () => {
      const user = get().user;
      if (!user || !user.streak_freezes_left || user.streak_freezes_left <= 0) return false;
      const updated = {
        ...user,
        streak_freezes_left: user.streak_freezes_left - 1,
        last_active_date: todayStr,
      };
      get().setUser(updated);
      set({ missedDaysDetected: false });
      return true;
    },

    addCoins: (amount: number) => {
      const user = get().user;
      const currentCoins = user?.coins ?? 50;
      const newCoins = Math.max(0, currentCoins + amount);
      if (user) {
        const updated = { ...user, coins: newCoins };
        get().setUser(updated);
      }
      return newCoins;
    },

    spendCoins: (amount: number) => {
      const user = get().user;
      const currentCoins = user?.coins ?? 50;
      if (currentCoins < amount) return false;
      const newCoins = currentCoins - amount;
      if (user) {
        const updated = { ...user, coins: newCoins };
        get().setUser(updated);
      }
      return true;
    },

    buyStreakFreeze: (cost = 50) => {
      const user = get().user;
      const currentCoins = user?.coins ?? 50;
      if (currentCoins < cost) {
        return {
          success: false,
          message: `Not enough coins! You need ${cost} coins, but you have ${currentCoins}. Play word games to win more! 🪙`,
        };
      }
      const newFreezes = (user?.streak_freezes_left ?? 0) + 1;
      const newCoins = currentCoins - cost;
      if (user) {
        const updated = {
          ...user,
          coins: newCoins,
          streak_freezes_left: newFreezes,
        };
        get().setUser(updated);
      }
      return {
        success: true,
        message: `Hooray! Streak Freeze purchased! You now have ${newFreezes} freeze(s) ❄️ protecting your streak!`,
      };
    },

    repairAndResumeStreak: (cost = 80) => {
      const user = get().user;
      const currentCoins = user?.coins ?? 50;
      if (currentCoins < cost) {
        return {
          success: false,
          message: `Not enough coins! You need ${cost} coins to resume your streak. Earn coins in the word puzzle! 🪙`,
        };
      }
      const newCoins = currentCoins - cost;
      const restoredStreak = Math.max(user?.streak_current || 1, user?.streak_best || 3, 2);
      if (user) {
        const updated = {
          ...user,
          coins: newCoins,
          streak_current: restoredStreak,
          last_active_date: todayStr,
        };
        get().setUser(updated);
      }
      set({ missedDaysDetected: false });
      return {
        success: true,
        message: `Streak Restored! 🔥 Your ${restoredStreak}-day streak is actively resumed without losing your progress!`,
      };
    },
  };
});
