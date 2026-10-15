export interface MistakeReviewItem {
  id: string;
  category: 'letter' | 'word' | 'sentence' | 'spelling';
  question_tamil: string;
  question_translit: string;
  question_english: string;
  target_answer: string;
  user_attempt: string;
  options: string[];
  hint_tamil: string;
  hint_english: string;
  created_at: string;
  next_review_date: string; // YYYY-MM-DD
  interval_days: number;
  repetitions: number;
  is_mastered: boolean;
}

const STORAGE_KEY = 'tamil_buddy_mistakes_queue';

// Initial starter mistakes so the smart queue is immediately active
const INITIAL_MISTAKES: MistakeReviewItem[] = [
  {
    id: 'mistake_1',
    category: 'letter',
    question_tamil: 'சிறப்பு ழகரம் ஒலிக்கும் சரியான எழுத்தைத் தேர்ந்தெடு:',
    question_translit: 'Sirappu Zha-garam sound letter:',
    question_english: 'Select the unique Tamil retroflex letter "ZHA" (ழ):',
    target_answer: 'ழ',
    user_attempt: 'ள',
    options: ['ழ', 'ள', 'ல', 'ர'],
    hint_tamil: 'தமிழ் என்ற சொல்லில் வரும் சிறப்பு எழுத்து (ழ).',
    hint_english: 'Found in the word "Tamizh" — curl your tongue back without touching the roof!',
    created_at: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    next_review_date: new Date().toISOString().split('T')[0], // Due today!
    interval_days: 1,
    repetitions: 0,
    is_mastered: false,
  },
  {
    id: 'mistake_2',
    category: 'word',
    question_tamil: '"Cat" என்பதற்கான சரியான தமிழ் சொல் எது?',
    question_translit: 'What is the Tamil word for "Cat"?',
    question_english: 'Identify the correct Tamil word for Cat:',
    target_answer: 'பூனை',
    user_attempt: 'நாய்',
    options: ['பூனை', 'நாய்', 'பசு', 'முயல்'],
    hint_tamil: 'பால் குடிக்கும், மியாவ் என்று கத்தும் செல்லப் பிராணி.',
    hint_english: 'Drinks milk and says meow!',
    created_at: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    next_review_date: new Date().toISOString().split('T')[0], // Due today!
    interval_days: 1,
    repetitions: 0,
    is_mastered: false,
  },
  {
    id: 'mistake_3',
    category: 'word',
    question_tamil: 'காட்டின் அரசன் என அழைக்கப்படும் விலங்கு எது?',
    question_translit: 'King of the jungle in Tamil:',
    question_english: 'Identify the Tamil word for Lion (King of Jungle):',
    target_answer: 'சிங்கம்',
    user_attempt: 'புலி',
    options: ['சிங்கம்', 'புலி', 'கரடி', 'யானை'],
    hint_tamil: 'கம்பீரமான பிடரி மயிர் கொண்ட காட்டின் அரசன்.',
    hint_english: 'Has a golden mane and mighty roar!',
    created_at: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    next_review_date: new Date().toISOString().split('T')[0], // Due today!
    interval_days: 1,
    repetitions: 0,
    is_mastered: false,
  },
];

export const mistakeService = {
  getMistakes(): MistakeReviewItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MISTAKES));
      return INITIAL_MISTAKES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_MISTAKES;
    }
  },

  saveMistakes(items: MistakeReviewItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },

  getDueMistakes(): MistakeReviewItem[] {
    const today = new Date().toISOString().split('T')[0];
    const items = this.getMistakes();
    return items.filter((m) => !m.is_mastered && m.next_review_date <= today);
  },

  recordMistake(item: {
    question_tamil: string;
    question_translit?: string;
    question_english?: string;
    target_answer: string;
    user_attempt: string;
    options?: string[];
    hint_tamil?: string;
    hint_english?: string;
    category?: 'letter' | 'word' | 'sentence' | 'spelling';
  }) {
    const items = this.getMistakes();
    const today = new Date().toISOString().split('T')[0];

    // Check if item already exists
    const existingIndex = items.findIndex((m) => m.target_answer === item.target_answer);

    if (existingIndex >= 0) {
      // Reset repetitions and reschedule for today/tomorrow
      items[existingIndex].user_attempt = item.user_attempt;
      items[existingIndex].repetitions = 0;
      items[existingIndex].interval_days = 1;
      items[existingIndex].next_review_date = today;
      items[existingIndex].is_mastered = false;
    } else {
      const newItem: MistakeReviewItem = {
        id: `mistake_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        category: item.category || 'word',
        question_tamil: item.question_tamil,
        question_translit: item.question_translit || '',
        question_english: item.question_english || '',
        target_answer: item.target_answer,
        user_attempt: item.user_attempt,
        options: item.options || [item.target_answer, item.user_attempt],
        hint_tamil: item.hint_tamil || `சரியான விடை: ${item.target_answer}`,
        hint_english: item.hint_english || `Correct: ${item.target_answer}`,
        created_at: today,
        next_review_date: today, // Queued for review
        interval_days: 1,
        repetitions: 0,
        is_mastered: false,
      };
      items.unshift(newItem);
    }

    this.saveMistakes(items);
  },

  resolveMistake(id: string, wasCorrect: boolean): { nextInterval: number; mastered: boolean } {
    const items = this.getMistakes();
    const index = items.findIndex((m) => m.id === id);
    if (index === -1) return { nextInterval: 1, mastered: false };

    const item = items[index];
    const today = new Date();

    if (wasCorrect) {
      item.repetitions += 1;
      // SuperMemo SM-2 interval expansion: 1 day -> 3 days -> 7 days -> Mastered!
      if (item.repetitions === 1) {
        item.interval_days = 1;
      } else if (item.repetitions === 2) {
        item.interval_days = 3;
      } else {
        item.interval_days = Math.min(14, item.interval_days * 2);
      }

      if (item.repetitions >= 3) {
        item.is_mastered = true;
      }

      // Compute next date
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + item.interval_days);
      item.next_review_date = nextDate.toISOString().split('T')[0];
    } else {
      // Reset progress
      item.repetitions = 0;
      item.interval_days = 1;
      item.next_review_date = today.toISOString().split('T')[0];
    }

    items[index] = item;
    this.saveMistakes(items);
    return { nextInterval: item.interval_days, mastered: item.is_mastered };
  },
};
