from typing import Dict, List, Optional, Any
from pydantic import BaseModel


class SkillScores(BaseModel):
    listening: float
    speaking: float
    reading: float
    writing: float


class EngagementMetrics(BaseModel):
    lesson_completion_rate: float
    avg_session_time_minutes: float
    retention_7d: bool
    drop_off_risk: bool
    welcome_message: Optional[str] = None


class ProgressResponse(BaseModel):
    user_id: int
    name: str
    level: int
    total_xp: int
    weekly_xp: int
    streak_current: int
    streak_best: int
    skill_scores: SkillScores
    overall_fluency_score: float
    letters_mastery_map: Dict[str, float]
    words_learned_count: int
    engagement: EngagementMetrics
