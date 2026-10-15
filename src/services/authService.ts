import { apiClient, USE_MOCK } from './api';
import { User } from '../types';

interface StoredUserRecord {
  id: number;
  name: string;
  email: string;
  password: string;
  age?: number;
  role: 'child' | 'parent';
  avatar: string;
  level: number;
  xp: number;
  streak_current: number;
  streak_best: number;
  streak_freezes_left: number;
  learning_level?: string;
  created_at: string;
}

// Helper to get local mock DB of users
function getLocalUsersDB(): StoredUserRecord[] {
  try {
    const raw = localStorage.getItem('tamil_buddy_users_db');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsersDB(users: StoredUserRecord[]) {
  localStorage.setItem('tamil_buddy_users_db', JSON.stringify(users));
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
    age?: number;
    role?: 'child' | 'parent';
    avatar?: string;
    learning_level?: string;
  }): Promise<{ access_token: string; user: User }> {
    const cleanEmail = data.email.trim().toLowerCase();

    // 1. If mock mode is forced
    if (USE_MOCK) {
      const localUsers = getLocalUsersDB();
      const existing = localUsers.find((u) => u.email === cleanEmail);
      if (existing) {
        throw new Error('An account with this email already exists! Please log in.');
      }

      const newUser: StoredUserRecord = {
        id: Date.now(),
        name: data.name.trim(),
        email: cleanEmail,
        password: data.password,
        age: data.age || 8,
        role: data.role || 'child',
        avatar: data.avatar || 'kili',
        level: 1,
        xp: 0,
        streak_current: 1,
        streak_best: 1,
        streak_freezes_left: 1,
        learning_level: data.learning_level || 'beginner',
        created_at: new Date().toISOString(),
      };

      localUsers.push(newUser);
      saveLocalUsersDB(localUsers);

      const token = `local_token_${Date.now()}`;
      localStorage.setItem('tamil_buddy_token', token);
      const { password, ...userWithoutPass } = newUser;
      return { access_token: token, user: userWithoutPass as User };
    }

    // 2. Real Backend API
    try {
      const response = await apiClient.post('/auth/register', {
        name: data.name.trim(),
        email: cleanEmail,
        password: data.password,
        age: data.age || 8,
        role: data.role || 'child',
        avatar: data.avatar || 'kili',
      });

      if (response.data && response.data.access_token) {
        localStorage.setItem('tamil_buddy_token', response.data.access_token);
        // Also mirror into local DB for offline resilience
        const localUsers = getLocalUsersDB().filter((u) => u.email !== cleanEmail);
        localUsers.push({
          id: response.data.user.id,
          name: data.name.trim(),
          email: cleanEmail,
          password: data.password,
          age: data.age || 8,
          role: data.role || 'child',
          avatar: data.avatar || 'kili',
          level: 1,
          xp: 0,
          streak_current: 1,
          streak_best: 1,
          streak_freezes_left: 1,
          learning_level: data.learning_level || 'beginner',
          created_at: new Date().toISOString(),
        });
        saveLocalUsersDB(localUsers);
        return response.data;
      }
      throw new Error('Registration failed. Please try again.');
    } catch (err: any) {
      // If backend returned an error message (e.g. 400 user already exists)
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'Registration failed. Please check your details.';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. If mock mode is forced
    if (USE_MOCK) {
      const localUsers = getLocalUsersDB();
      const userRecord = localUsers.find((u) => u.email === cleanEmail);

      // STRICT CHECK: Unregistered user CANNOT log in!
      if (!userRecord) {
        throw new Error('No account found with this email. You must register first before logging in!');
      }

      if (userRecord.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials and try again.');
      }

      const token = `local_token_${Date.now()}`;
      localStorage.setItem('tamil_buddy_token', token);
      const { password: _, ...userWithoutPass } = userRecord;
      return { access_token: token, user: userWithoutPass as User };
    }

    // 2. Real Backend API
    try {
      const response = await apiClient.post('/auth/login', {
        email: cleanEmail,
        password: password,
      });

      if (response.data && response.data.access_token) {
        localStorage.setItem('tamil_buddy_token', response.data.access_token);
        return response.data;
      }
      throw new Error('Login failed. Please check your credentials.');
    } catch (err: any) {
      // Backend rejected login
      const status = err?.response?.status;
      if (status === 401 || status === 404) {
        throw new Error('Account not found or incorrect password. You must register first before logging in!');
      }
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        'Unable to log in. Please check your email and password.';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
  },

  async updateProfile(updates: { name?: string; age?: number; avatar?: string; learning_level?: string }): Promise<User> {
    const rawUser = localStorage.getItem('tamil_buddy_user');
    let currentUser: User | null = rawUser ? JSON.parse(rawUser) : null;
    const cleanUpdates = { ...updates };

    // Update in local database
    const localUsers = getLocalUsersDB();
    if (currentUser) {
      const idx = localUsers.findIndex((u) => u.email === currentUser?.email);
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], ...cleanUpdates };
        saveLocalUsersDB(localUsers);
      }
    }

    if (USE_MOCK) {
      const updated = { ...(currentUser || {}), ...cleanUpdates } as User;
      return updated;
    }

    try {
      const response = await apiClient.put('/auth/profile', cleanUpdates);
      return response.data;
    } catch {
      // Offline fallback
      return { ...(currentUser || {}), ...cleanUpdates } as User;
    }
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const rawUser = localStorage.getItem('tamil_buddy_user');
    const currentUser: User | null = rawUser ? JSON.parse(rawUser) : null;

    if (!currentUser) throw new Error('No active user logged in.');

    // Local DB check
    const localUsers = getLocalUsersDB();
    const idx = localUsers.findIndex((u) => u.email === currentUser.email);
    if (idx !== -1) {
      if (localUsers[idx].password !== currentPassword) {
        throw new Error('Current password is incorrect.');
      }
      localUsers[idx].password = newPassword;
      saveLocalUsersDB(localUsers);
    }

    if (!USE_MOCK) {
      try {
        await apiClient.post('/auth/change-password', {
          current_password: currentPassword,
          new_password: newPassword,
        });
      } catch (err: any) {
        const message = err?.response?.data?.detail || err?.message || 'Password update failed.';
        throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
      }
    }
  },
};

