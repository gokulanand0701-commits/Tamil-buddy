import { BadgeItem, ProgressReport, User } from '../types';

export const INITIAL_MOCK_USER: User = {
  id: 1,
  name: 'Ananya',
  age: 8,
  role: 'child',
  email: 'ananya@tamilbuddy.app',
  parent_pin: '1234',
  level: 3,
  xp: 380,
  avatar: 'kili',
  streak_current: 5,
  streak_best: 12,
  streak_freezes_left: 1,
  last_active_date: new Date().toISOString().split('T')[0],
  daily_goal_minutes: 15,
  learning_level: 'few_words',
};

export const MOCK_BADGES: BadgeItem[] = [
  {
    code: 'first_letter',
    title: 'First Stroke (முதல் எழுத்து)',
    description: 'Traced your very first Tamil letter with perfection!',
    icon: '✍️',
    category: 'letters',
    unlocked_at: '2026-10-10',
    progress: 1,
    max_progress: 1
  },
  {
    code: 'vowel_master',
    title: 'Vowel Explorer (உயிர் வீரன்)',
    description: 'Mastered all 12 Uyir Ezhuthukkal sounds!',
    icon: '🌟',
    category: 'letters',
    unlocked_at: '2026-10-12',
    progress: 12,
    max_progress: 12
  },
  {
    code: 'streak_5',
    title: '5-Day Flame (தொடர் சாதனை)',
    description: 'Practiced 5 days in a row without breaking the streak!',
    icon: '🔥',
    category: 'streak',
    unlocked_at: '2026-10-14',
    progress: 5,
    max_progress: 5
  },
  {
    code: 'kili_chatter',
    title: 'Chatterbox with Kili (கிளித் தோழன்)',
    description: 'Spoke with Kili the parrot in 5 conversations!',
    icon: '🦜',
    category: 'chat',
    progress: 3,
    max_progress: 5
  },
  {
    code: 'perfect_speech',
    title: 'Crisp Tongue (தெளிவான உச்சரிப்பு)',
    description: 'Scored 90%+ in 3 Tamil voice pronunciation challenges!',
    icon: '🎙️',
    category: 'speech',
    unlocked_at: '2026-10-13',
    progress: 3,
    max_progress: 3
  },
  {
    code: 'word_collector',
    title: 'Word Collector (சொல் செல்வர்)',
    description: 'Learned 25 basic everyday Tamil words!',
    icon: '📚',
    category: 'words',
    progress: 18,
    max_progress: 25
  }
];

export interface StickerItem {
  id: string;
  name_tamil: string;
  name_english: string;
  emoji: string;
  is_unlocked: boolean;
  unlocked_at?: string;
  rarity: 'common' | 'rare' | 'legendary';
}

export const MOCK_STICKERS: StickerItem[] = [
  { id: 'stk_1', name_tamil: 'கிளி தோழன்', name_english: 'Kili the Mascot', emoji: '🦜', is_unlocked: true, rarity: 'common' },
  { id: 'stk_2', name_tamil: 'பொங்கல் பானை', name_english: 'Pongal Clay Pot', emoji: '🏺', is_unlocked: true, rarity: 'rare' },
  { id: 'stk_3', name_tamil: 'மயில் தோகை', name_english: 'Peacock Feather', emoji: '🦚', is_unlocked: true, rarity: 'rare' },
  { id: 'stk_4', name_tamil: 'செம்பருத்தி', name_english: 'Hibiscus Flower', emoji: '🌺', is_unlocked: true, rarity: 'common' },
  { id: 'stk_5', name_tamil: 'மாம்பழம்', name_english: 'Sweet Mango', emoji: '🥭', is_unlocked: true, rarity: 'common' },
  { id: 'stk_6', name_tamil: 'வீரத் தம்பி', name_english: 'Jallikattu Bull', emoji: '🐂', is_unlocked: false, rarity: 'legendary' },
  { id: 'stk_7', name_tamil: 'தாமரை மலர்', name_english: 'Lotus Flower', emoji: '🪷', is_unlocked: false, rarity: 'rare' },
  { id: 'stk_8', name_tamil: 'திருக்குறள் ஏடு', name_english: 'Palm Leaf Scroll', emoji: '📜', is_unlocked: false, rarity: 'legendary' },
];

export const MOCK_WEEKLY_XP = [
  { day: 'Mon', xp: 45, date: '10-09' },
  { day: 'Tue', xp: 60, date: '10-10' },
  { day: 'Wed', xp: 50, date: '10-11' },
  { day: 'Thu', xp: 85, date: '10-12' },
  { day: 'Fri', xp: 40, date: '10-13' },
  { day: 'Sat', xp: 70, date: '10-14' },
  { day: 'Sun', xp: 30, date: '10-15' },
];

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  is_current_user?: boolean;
}

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'Kavin', avatar: 'tiger', xp: 520, streak: 14 },
  { rank: 2, name: 'Siddharth', avatar: 'elephant', xp: 480, streak: 9 },
  { rank: 3, name: 'Ananya (You)', avatar: 'kili', xp: 380, streak: 5, is_current_user: true },
  { rank: 4, name: 'Meera', avatar: 'peacock', xp: 340, streak: 6 },
  { rank: 5, name: 'Aarav', avatar: 'monkey', xp: 290, streak: 4 },
  { rank: 6, name: 'Diya', avatar: 'cat', xp: 220, streak: 3 },
];

export const MOCK_DAILY_QUESTS = [
  { id: 'q1', title: 'Trace 2 Vowels', title_tamil: '2 உயிர் எழுத்துக்களை வரைக', xp: 15, current: 2, target: 2, is_completed: true },
  { id: 'q2', title: 'Say 3 Words into the Mic', title_tamil: '3 சொற்களை மைக்கில் பேசு', xp: 20, current: 2, target: 3, is_completed: false },
  { id: 'q3', title: 'Chat with Kili about Food', title_tamil: 'கிளியுடன் உணவு பற்றி பேசு', xp: 25, current: 0, target: 1, is_completed: false },
];

export function getMockLettersMasteryMap(): Record<string, number> {
  const map: Record<string, number> = {};
  const uyir = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'];
  uyir.forEach((u, i) => {
    map[u] = i < 6 ? 100 : 75;
  });

  const mei = ['க்', 'ங்', 'ச்', 'ஞ்', 'ட்', 'ண்', 'த்', 'ந்', 'ப்', 'ம்', 'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்'];
  mei.forEach((m, i) => {
    map[m] = i < 4 ? 80 : i < 10 ? 40 : 10;
  });

  map['ஃ'] = 50;

  // Uyirmei sample mastery
  const sampleKa = ['க', 'கா', 'கி', 'கீ', 'கு', 'கூ'];
  sampleKa.forEach((c) => {
    map[c] = 70;
  });

  return map;
}

export const MOCK_PROGRESS_REPORT: ProgressReport = {
  user_id: 1,
  name: 'Ananya',
  level: 3,
  total_xp: 380,
  weekly_xp: 380,
  streak_current: 5,
  streak_best: 12,
  skill_scores: {
    listening: 85,
    speaking: 78,
    reading: 88,
    writing: 68,
  },
  overall_fluency_score: 80.5,
  letters_mastery_map: getMockLettersMasteryMap(),
  words_learned_count: 24,
  engagement: {
    lesson_completion_rate: 88.0,
    avg_session_time_minutes: 14.5,
    retention_7d: true,
    drop_off_risk: false,
    welcome_message: "Vanakkam Ananya! You're on a 5-day streak! Ready to learn more today?"
  }
};
