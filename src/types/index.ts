export type SkillType = 'listening' | 'speaking' | 'reading' | 'writing';

export type ExerciseType =
  | 'letter_trace'
  | 'listen_select'
  | 'match_pairs'
  | 'speak_it'
  | 'build_sentence'
  | 'mcq';

export interface User {
  id: number;
  name: string;
  age?: number;
  role: 'child' | 'parent';
  email: string;
  parent_pin?: string;
  level: number;
  xp: number;
  coins?: number;
  avatar: string;
  streak_current: number;
  streak_best: number;
  streak_freezes_left?: number;
  last_active_date?: string;
  daily_goal_minutes?: number;
  learning_level?: 'beginner' | 'few_words' | 'can_speak';
  created_at?: string;
}

export interface TamilLayerText {
  tamil: string;
  transliteration: string;
  meaning: string;
  audio_url?: string;
}

export interface LetterItem {
  id: number;
  tamil_char: string;
  category: 'uyir' | 'mei' | 'uyirmei' | 'ayutham';
  transliteration: string;
  meaning?: string;
  audio_url?: string;
  stroke_data_json?: string; // SVG path or stroke points
  example_word?: {
    tamil: string;
    translit: string;
    meaning: string;
  };
}

export interface WordItem {
  id: number;
  tamil: string;
  transliteration: string;
  meaning: string;
  category: 'family' | 'food' | 'animals' | 'colors' | 'school' | 'nature';
  audio_url?: string;
  image_url?: string;
  mastery_percentage?: number;
}

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  prompt: string;
  prompt_tamil?: string;
  target?: string;
  target_translit?: string;
  target_meaning?: string;
  audio_url?: string;
  image_url?: string;
  // Tracing
  stroke_path?: string;
  // Listen & Pick / MCQ
  options?: Array<{
    id: string;
    tamil: string;
    translit: string;
    meaning: string;
    image_url?: string;
    is_correct?: boolean;
  }>;
  // Match Pairs
  pairs?: Array<{
    tamil: string;
    english: string;
    translit?: string;
    image_url?: string;
  }>;
  // Build sentence
  scrambled_words?: Array<{
    id: string;
    tamil: string;
    translit: string;
  }>;
  correct_sentence?: string;
  sentence_meaning?: string;
}

export interface Lesson {
  id: number;
  unit: number;
  unit_title: string;
  title: string;
  title_tamil?: string;
  order: number;
  type: string;
  description: string;
  content_json: string;
  exercises: ExerciseItem[];
  xp_reward: number;
  is_locked?: boolean;
  is_completed?: boolean;
  stars?: number; // 0-3
}

export interface AttemptRequest {
  lesson_id?: number;
  exercise_type: string;
  skill: SkillType;
  score: number;
  is_correct: boolean;
  time_spent: number;
  letter_id?: number;
  word_id?: number;
}

export interface BadgeItem {
  code: string;
  title: string;
  description: string;
  icon: string;
  category?: 'streak' | 'letters' | 'words' | 'chat' | 'speech' | 'mastery';
  unlocked_at?: string;
  progress?: number;
  max_progress?: number;
}

export interface AttemptResponse {
  xp_gained: number;
  new_badges: BadgeItem[];
  streak: number;
  level_up: boolean;
  current_level: number;
  total_xp: number;
}

export interface PerWordSpeechStatus {
  word: string;
  status: 'correct' | 'close' | 'missed';
  similarity: number;
  feedback?: string;
}

export interface SpeechEvalResponse {
  score: number;
  transcript: string;
  target_text: string;
  per_word: PerWordSpeechStatus[];
  feedback_text: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'kili';
  text_tamil?: string;
  text_translit?: string;
  text_english: string;
  audio_url?: string;
  timestamp: string;
  suggested_replies?: string[];
}

export interface StorySentence {
  sentence_tamil: string;
  sentence_translit: string;
  sentence_english: string;
  scene_illustration?: string;
  words: Array<{
    tamil: string;
    translit: string;
    meaning: string;
  }>;
}

export interface Story {
  id: string;
  title_tamil: string;
  title_translit: string;
  title_english: string;
  level: string;
  cover_image: string;
  moral: string;
  genre?: 'motivational' | 'funny' | 'sarcastic' | 'compassion' | 'patience' | 'friendship';
  genre_label?: string;
  genre_emoji?: string;
  sentences: StorySentence[];
}

export interface SkillScores {
  listening: number;
  speaking: number;
  reading: number;
  writing: number;
}

export interface ProgressReport {
  user_id: number;
  name: string;
  level: number;
  total_xp: number;
  weekly_xp: number;
  streak_current: number;
  streak_best: number;
  skill_scores: SkillScores;
  overall_fluency_score: number;
  letters_mastery_map: Record<string, number>;
  words_learned_count: number;
  engagement: {
    lesson_completion_rate: number;
    avg_session_time_minutes: number;
    retention_7d: boolean;
    drop_off_risk: boolean;
    welcome_message?: string;
  };
}

export interface ParentReport {
  user_id: number;
  child_name: string;
  weekly_summary: {
    total_minutes: number;
    lessons_completed: number;
    total_xp: number;
    streak: number;
  };
  weak_areas: string[];
  time_spent: number;
  recommended_next_lessons: Array<{
    id: number;
    unit: number;
    title: string;
    type: string;
    reason: string;
  }>;
  engagement_metrics: Record<string, any>;
  daily_minutes_goal: number;
}
