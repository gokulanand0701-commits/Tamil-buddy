from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AttemptCreate(BaseModel):
    lesson_id: Optional[int] = None
    exercise_type: str = Field(..., description="mcq, listen_select, speak, trace, flashcard")
    skill: str = Field(..., pattern="^(listening|speaking|reading|writing)$")
    score: float = Field(..., ge=0.0, le=100.0)
    is_correct: bool = True
    time_spent: int = Field(0, ge=0, description="Time spent in seconds")
    letter_id: Optional[int] = None
    word_id: Optional[int] = None


class BadgeEarned(BaseModel):
    code: str
    title: str
    description: str
    icon: str


class AttemptResponse(BaseModel):
    xp_gained: int
    new_badges: List[BadgeEarned]
    streak: int
    level_up: bool
    current_level: int
    total_xp: int


class PerWordStatus(BaseModel):
    word: str
    status: str  # "correct", "close", "missed"
    similarity: float


class SpeechEvalResponse(BaseModel):
    score: float
    transcript: str
    target_text: str
    per_word: List[PerWordStatus]
    feedback_text: str
