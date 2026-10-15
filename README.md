# 🦜 Tamil Buddy - Tamil Language Learning Platform

**Tamil Buddy** is an AI-powered Tamil language learning platform tailored specifically for diaspora children who do not speak Tamil at home. It fosters engagement, retention, and multi-skill progress measurement across **listening, speaking, reading, and writing**.

---

## 🌟 Key Features

1. **Spaced Repetition System (SuperMemo SM-2)**
   - Schedules letters and words review dynamically based on retrieval performance.
   - Computes ease factors, repetitions, intervals, and mastery (0–100%).
   - `GET /review/today` surfaces items due for review.

2. **Adaptive Difficulty Engine**
   - Monitors rolling 5 attempts in each skill.
   - Raises difficulty to challenge exercises if accuracy exceeds **85%**.
   - Lowers difficulty to foundational guided lessons if accuracy falls below **50%**.

3. **Daily Streak & Streak-Freeze System**
   - Rewards daily consistency with streaks.
   - Includes automatic **1 streak freeze per week** to prevent churn when a child misses a single day.
   - Tracks streaks and historical stats in `StreakLog`.

4. **Gamification & Badges**
   - Multi-tier XP engine: base XP + score bonuses + correctness bonuses.
   - Automatic level calculation: $\text{Level} = 1 + \lfloor \text{XP} / 100 \rfloor$.
   - Automatic badge unlocking (e.g., *"First 10 letters"*, *"7-day streak"*, *"Chatterbox: 5 conversations"*, *"Word Explorer"*, *"Perfect Pronunciation"*, *"Super Learner"*).

5. **Multi-Skill Weighted Scoring & Overall Fluency Score**
   - Calculates a weighted rolling average of the last 20 attempts for each skill:
     $$\text{Skill Score} = \frac{\sum_{i=1}^N i \cdot \text{score}_i}{\sum_{i=1}^N i}$$
   - Computes weighted overall fluency score:
     $$\text{Overall Fluency} = 0.3 \times \text{Listening} + 0.3 \times \text{Speaking} + 0.2 \times \text{Reading} + 0.2 \times \text{Writing}$$

6. **Engagement & Retention Analytics**
   - Lesson completion rates, average session time, and 7-day retention flags.
   - Drop-off risk detector (inactivity for 3+ days) that triggers a warm personalized welcome-back message from Kili the parrot.

7. **Tamil Speech-to-Text & Grapheme-Level Evaluation**
   - Configurable STT providers (`google`, `whisper`, or `mock`).
   - True Tamil Unicode grapheme cluster tokenizer (properly combines base consonants with pulli \u0BCD and vowel signs \u0BBE–\u0BCC).
   - Computes grapheme-level Levenshtein similarity and per-word statuses (`correct`, `close`, `missed`) with friendly encouraging feedback.

8. **AI Chatbot: "Kili" the Parrot Mascot**
   - Powered by the Google Gemini API with seamless offline mock fallback.
   - Speaks simple, child-friendly Tamil accompanied by transliteration and English hints.
   - Stays on topic, keeps replies under 40 words, and provides clickable suggested quick-replies.

---

## 🛠 Tech Stack

- **Language:** Python 3.11+
- **Framework:** FastAPI + Uvicorn
- **ORM / Database:** SQLAlchemy with SQLite default (instantly swappable to PostgreSQL via `DATABASE_URL`)
- **Validation & Serialization:** Pydantic v2
- **Authentication:** JWT tokens (`python-jose`) + `bcrypt`
- **Testing:** `pytest`
- **CORS:** Enabled for `http://localhost:5173` (Vite / React frontend)
- **Documentation:** Interactive OpenAPI docs at `/docs` and `/redoc`

---

## ⚡ Build & Start Commands (Production & Cloud Deployment)

For deploying this fullstack project as a **single web service** on **Render, Railway, Heroku, or any cloud host**:

| Step | Exact Command |
|---|---|
| **Build Command** | `npm install && npm run build && pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

> **How it runs as a unified single service:**
> 1. The **Build Command** installs all Node packages, compiles the React/TypeScript frontend into `dist/`, and installs all Python dependencies from `requirements.txt`.
> 2. The **Start Command** launches Uvicorn binding to `0.0.0.0` on the platform's dynamically assigned `$PORT`.
> 3. FastAPI automatically mounts and serves both the backend API endpoints (`/api/*`, `/auth/*`, `/lessons/*`, etc.) and the compiled React SPA from `dist/` on the same domain and port!

### 💻 Local Development Commands

| Task | Command |
|---|---|
| **Unified Local Server (Port 8000)** | `npm run build` then `uvicorn app.main:app --port 8000` |
| **Frontend Dev Server (Port 5173)** | `npm run dev` |
| **Backend Dev Server (Port 8000)** | `uvicorn app.main:app --reload --port 8000` |
| **Run Backend Tests** | `pytest` |

---

## 📁 Project Structure

```
Tamil Buddy/
├── app/
│   ├── main.py                  # FastAPI initialization, CORS, lifespan & router registration
│   ├── seed.py                  # Database seeder (letters, words, lessons, badges)
│   ├── core/
│   │   ├── config.py            # Environment configurations (Pydantic Settings)
│   │   ├── database.py          # SQLAlchemy engine, session maker, get_db
│   │   └── security.py          # Password hashing, JWT auth, and role dependencies
│   ├── models/
│   │   ├── user.py              # User model (child, parent, level, streak, PIN)
│   │   ├── content.py           # Lesson, Letter, Word models
│   │   ├── practice.py          # Attempt, LetterMastery, WordMastery, StreakLog
│   │   ├── gamification.py      # Badge, UserBadge, ParentGoal
│   │   └── chat.py              # ChatSession, ChatMessage
│   ├── schemas/
│   │   ├── auth.py              # Auth register, login, token schemas
│   │   ├── content.py           # Content response schemas
│   │   ├── practice.py          # Attempts, speech evaluation schemas
│   │   ├── chat.py              # Kili AI chat request/response schemas
│   │   ├── progress.py          # Progress, skill scores & engagement schemas
│   │   ├── parent.py            # Parent report & goal schemas
│   │   └── review.py            # Spaced repetition review schemas
│   ├── routers/
│   │   ├── auth.py              # /auth/register, /auth/login, /auth/me
│   │   ├── content.py           # /lessons, /letters, /words
│   │   ├── practice.py          # /attempts
│   │   ├── speech.py            # /speech/evaluate
│   │   ├── chat.py              # /chat
│   │   ├── progress.py          # /progress/{user_id}
│   │   ├── parent.py            # /parent/report/{user_id}, /parent/goal
│   │   └── review.py            # /review/today
│   └── services/
│       ├── sm2.py               # SuperMemo SM-2 algorithm implementation
│       ├── streak.py            # Daily streak & weekly freeze manager
│       ├── difficulty.py        # Adaptive difficulty evaluator
│       ├── gamification.py      # XP, leveling & badge unlocking logic
│       ├── metrics.py           # Rolling skill scores & fluency formulas
│       ├── speech.py            # Tamil grapheme tokenizer & speech evaluator
│       └── gemini.py            # Gemini client & Kili conversational fallback
├── tests/
│   ├── conftest.py              # Test database and client fixtures
│   ├── test_sm2.py              # SM-2 unit tests
│   ├── test_streak.py           # Streak & freeze unit tests
│   ├── test_speech_eval.py      # Tamil tokenizer & Levenshtein scoring tests
│   └── test_api_endpoints.py    # End-to-end API integration tests
├── .env.example
├── pytest.ini
├── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.11 or newer
- Virtual environment tool (`venv`)

### 2. Setup Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate on Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Activate on macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
Copy `.env.example` to `.env`:
```bash
copy .env.example .env   # Windows
# or: cp .env.example .env (Linux/macOS)
```
*(Optionally add your `GEMINI_API_KEY`. If left empty, all endpoints function with the built-in Kili AI mock).*

### 5. Seed the Database
Populate letters (12 Uyir + 18 Mei), 20 vocabulary words, 15 lessons across 3 units, and 6 badges:
```bash
python -m app.seed
```
*(The server also checks and auto-seeds on first launch if the database is empty).*

### 6. Run the Application
```bash
uvicorn app.main:app --reload
```
The API will be live at:
- **Root:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Running Pytest Tests

Run the complete test suite:
```bash
pytest -v
```
All 22 unit and integration tests will execute, validating:
- **SM-2 Algorithm:** interval scaling, ease factor bounding, error penalization
- **Daily Streaks & Freezes:** consecutive daily progression, 1 weekly freeze preservation, and multi-day reset
- **Tamil Unicode Grapheme Tokenizer & Speech Evaluation:** correct handling of pulli (\u0BCD) and vowel signs (\u0BBE–\u0BCC), Levenshtein distances
- **API Endpoints:** Authentication, Content, Practice Attempts, Speech Evaluation, Kili AI Chat, Progress & Fluency, Parent Reports, Goals, and Spaced Repetition Review

---

## 📡 API Endpoint Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/auth/register` | Register new child or parent account | No |
| `POST` | `/auth/login` | Login and receive JWT access token | No |
| `GET` | `/auth/me` | Retrieve profile of authenticated user | Yes |
| `GET` | `/lessons` | List lessons (filter by `?unit=1`) | No |
| `GET` | `/lessons/{id}` | Get specific lesson with exercise content | No |
| `GET` | `/letters` | List letters (filter by `?category=uyir/mei`) | No |
| `GET` | `/words` | List vocabulary words (filter by category) | No |
| `POST` | `/attempts` | Save exercise result, update XP, streak, SM-2 mastery | Yes |
| `POST` | `/speech/evaluate` | Evaluates audio speech against target Tamil text | No |
| `POST` | `/chat` | Conversational interaction with Kili the parrot | Yes |
| `GET` | `/progress/{user_id}` | 4 skill scores, fluency, mastery map, retention | No |
| `GET` | `/parent/report/{user_id}`| Weekly report, weak areas, recommended lessons | No |
| `POST` | `/parent/goal` | Set daily practice minutes target | Yes |
| `GET` | `/review/today` | Spaced repetition items due today | Yes |

---

# 🎨 Tamil Buddy - Frontend Web App

A gamified, kid-friendly React + Vite + TypeScript web application built specifically for diaspora children (age 6–12) who do NOT speak Tamil at home.

---

## 🚀 Frontend Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
The app works **100% offline out-of-the-box** using the built-in mock API layer:
```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=true
```
- Set `VITE_USE_MOCK=true` to run completely offline without needing the Python backend.
- Set `VITE_USE_MOCK=false` to connect directly to the FastAPI server running on port 8000.

### 3. Start Frontend Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

### 4. Build for Production
```bash
npm run build
```
Creates a blazing fast, optimized static bundle in `/dist`.

---

## 🌈 Design & Experience Philosophy

- **Kid-Friendly Aesthetics:** Rounded 3XL/4XL cards, tactile 3D bouncing buttons, cheerful color palette (turmeric yellow `#f59e0b`, teal `#14b8a6`, coral `#f43f5e`, parrot green `#22c55e`), and playful typography (`Baloo 2` + `Noto Sans Tamil`).
- **Mascot Companion — "Kili" the Parrot:** An expressive animated mascot with SVG reactions (celebrating with party hat, happy wing flaps, gentle encouraging look on mistakes, and real-time talking beak movement).
- **Mandatory 3-Layer Tamil Presentation:** Every piece of Tamil text presents 3 layers to make learning accessible for non-speakers:
  1. **Tamil Script:** e.g., அம்மா
  2. **English Transliteration:** e.g., Amma
  3. **English Meaning:** e.g., "Mother"
- **Stress-Free Gamification (No Punitive Lives/Hearts):** Diaspora kids need encouragement, not stress! Wrong answers receive a gentle wooden boing sound effect and encouraging hint ("Let's try again! 🦜"), allowing infinite gentle retries.
- **Self-Contained Web Audio & Speech:** Real-time Web Audio API sound synthesizers (correct chimes, gentle boing, victory fanfare) and Web Speech API Text-to-Speech (TTS) ensure audio works in any browser without 404 network errors or missing assets.

---

## 📱 Complete 9-Screen Feature Matrix

| # | Screen | Description & Key Features |
|---|---|---|
| 1 | **Onboarding** (`/onboarding`) | Avatar picker (Kili, Tiger, Elephant, Peacock, Monkey, Cat), child's name + age slider (4–15), initial experience level (*Beginner*, *Knows few words*, *Can speak a bit*). |
| 2 | **Home Dashboard** (`/`) | Daily streak flame with streak-freeze counter, Level progress & XP bar, animated circular today's goal ring (e.g. 8/15 mins), prominent "Continue Learning" CTA, daily quests list, spaced repetition review alert, and a warm "Welcome Back" modal after missed days. |
| 3 | **Learning Path** (`/learn`) | Duolingo-style winding map with 6 comprehensive units (Uyir -> Mei -> Uyirmei -> Words -> Sentences -> Stories), star indicators (1-3 stars), glowing current node with Kili pointer, and locked padlock states. |
| 4 | **Lesson Player** (`/lesson/:id`) | Focused full-screen lesson runner with progress bar, XP bounty, gentle exit confirmation, and all 5 exercise types: <br/>• **Letter Tracing:** HTML5 canvas with faded guide, stroke-order demo animation, audio sound, and clear/check controls.<br/>• **Listen & Pick:** Automatic audio replay, 3-4 cards with 3 layers and emojis.<br/>• **Match Pairs:** Interactive touch/click connecting Tamil words to English meanings/images with sound feedback.<br/>• **Speak It:** Real MediaRecorder voice recording, live audio waveform visualizer, 0–100 pronunciation score with per-word color feedback (Green/Yellow/Red).<br/>• **Build the Sentence:** Drag & tap word tiles into correct grammatical order. |
| 5 | **AI Conversation Buddy** (`/chat`) | Interactive chat with Kili the parrot. Child taps mic to talk in Tamil/Tanglish or types in chat box. Kili replies with text (3 layers) + text-to-speech audio. Includes 5 topic cards: *Family, Food, Festivals, School, Animals* + suggested quick reply chips. |
| 6 | **Story Time** (`/stories`) | Illustrated short stories (*The Thirsty Crow, The Clever Rabbit, Pongal Harvest Festival*). Features **tap-a-word-to-hear** with audio pronunciation, **tap-to-translate** modal showing 3 layers, and a hands-free **Read-Along** sentence highlighter! |
| 7 | **Progress Report** (`/progress`) | Recharts 4-skill balance radar (Listening, Speaking, Reading, Writing), weekly XP momentum bar chart, daily streak heatmap, categorized words learned list, and a full **247 Tamil Letters Mastered Grid** (12 Uyir, 18 Mei, 1 Ayutham, 216 Uyirmei) colored by mastery! |
| 8 | **Parent Dashboard** (`/parent`) | **4-Digit PIN Protected** (keypad entry modal, default `1234`). Displays total weekly minutes, lessons completed, AI-detected weak areas (e.g. *ழ் sound*, *ஐ loop*), customizable daily minutes goal selector, and JSON/printable report exporter. |
| 9 | **Rewards & Hall of Fame** (`/rewards`) | Badges & trophies showcase (*First Stroke, Vowel Explorer, 5-Day Flame, Crisp Tongue, Word Collector*), collectible Tamil cultural sticker album (*Pongal Pot, Peacock, Jallikattu Bull, Sweet Mango*), wholesome friends leaderboard, and streak-freeze manager. |

---

## 🗂 Frontend Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── TamilWord.tsx            # 3-layer text (Tamil, translit, meaning) + audio button
│   │   ├── KiliMascot.tsx           # SVG animated parrot mascot (happy, sad, celebrate, talking)
│   │   ├── SpeechWaveform.tsx       # Live audio recording visualizer
│   │   ├── Button.tsx               # Bouncy 3D kid-friendly tactile button
│   │   ├── ConfettiCelebration.tsx  # Confetti cannon + Kili celebration on finish
│   │   ├── Toast.tsx                # Non-intrusive feedback toast notifications
│   │   └── Skeleton.tsx             # Shimmering loading placeholder
│   ├── layout/
│   │   ├── Navbar.tsx               # Header with flame, XP, language toggle, audio mute & parent lock
│   │   ├── BottomNav.tsx            # Mobile-first bottom navigation tabs
│   │   └── Layout.tsx               # Main page layout container
│   └── exercises/
│       ├── LetterTracing.tsx        # Canvas drawing with guide & demo animation
│       ├── ListenAndPick.tsx        # Audio-first multiple choice cards
│       ├── MatchPairs.tsx           # Touch matching tiles with visual links
│       ├── SpeakIt.tsx              # MediaRecorder voice recorder + word color scoring
│       └── BuildSentence.tsx        # Scrambled word tiles sentence assembler
├── pages/
│   ├── Onboarding.tsx               # Pick avatar, enter name/age, choose level
│   ├── HomeDashboard.tsx            # Streak, XP, today's goal ring, daily quests, review
│   ├── LearningPath.tsx             # Duolingo-style 6-unit winding path
│   ├── LessonPlayer.tsx             # Full-screen lesson runner with step progression
│   ├── AIConversation.tsx           # Chat with Kili, speech mic, audio TTS, topic cards
│   ├── StoryTime.tsx                # Illustrated stories, tap-a-word-to-hear & translate
│   ├── ProgressReport.tsx           # Skill radar, weekly XP, heatmap, 247 letters grid
│   ├── ParentDashboard.tsx          # PIN lock, weekly metrics, weak areas, daily goal
│   └── Rewards.tsx                  # Badges, sticker book, wholesome leaderboard
├── services/
│   ├── api.ts                       # Axios client with interceptors & mock toggle
│   ├── authService.ts               # Register & login
│   ├── lessonService.ts             # Lessons & practice attempt submissions
│   ├── speechService.ts             # Speech evaluation & grapheme similarity
│   ├── chatService.ts               # Kili AI conversational buddy
│   ├── progressService.ts           # 4-skill stats, letters mastery & XP
│   ├── parentService.ts             # Weekly parent analytics & goal setting
│   └── soundService.ts              # Web Audio API sound effects synth & Web Speech TTS
├── store/
│   ├── useAuthStore.ts              # User profile, PIN lock, streak freeze & recovery
│   ├── useProgressStore.ts          # Lessons unlock status, XP, badges & celebration modal
│   ├── useSettingsStore.ts          # Language ('en' | 'ta') & sound mute toggles
│   └── useToastStore.ts             # Toast notification queue
├── mocks/
│   ├── mockLetters.ts               # 12 Uyir + 18 Mei letters with stroke paths
│   ├── mockWords.ts                 # 24 vocabulary words across 6 categories
│   ├── mockLessons.ts               # 9 complete lessons across 6 units
│   ├── mockStories.ts               # 3 illustrated stories with word-level phonetic maps
│   ├── mockProgress.ts              # Badges, stickers, leaderboard & stats
│   └── mockChat.ts                  # Kili conversational topics & suggested replies
├── types/
│   └── index.ts                     # TypeScript schemas matching backend & UI models
├── utils/
│   └── tamilPhonetics.ts            # 247 Tamil alphabet generator & Levenshtein similarity
├── App.tsx                          # React Router routes & providers
├── main.tsx                         # Entry point
└── index.css                        # Tailwind directives, fonts, and animation keyframes
```

---

## 🧪 Testing Fullstack Together

To run both backend and frontend simultaneously:

**Terminal 1 (Backend API):**
```bash
# In project root
uvicorn app.main:app --reload
```

**Terminal 2 (Frontend App):**
```bash
# In project root
npm run dev
```

Visit [http://localhost:8000](http://localhost:8000) to play with the full live stack!
