from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict


class WeeklySummary(BaseModel):
    total_minutes: float
    lessons_completed: int
    total_xp: int
    streak: int


class RecommendedLesson(BaseModel):
    id: int
    unit: int
    title: str
    type: str
    reason: str


class ParentReportResponse(BaseModel):
    user_id: int
    child_name: str
    weekly_summary: WeeklySummary
    weak_areas: List[str]
    time_spent: float
    recommended_next_lessons: List[RecommendedLesson]
    engagement_metrics: Dict[str, Any]
    daily_minutes_goal: int


class ParentGoalCreate(BaseModel):
    child_id: int
    daily_minutes_goal: int = Field(..., ge=1, le=180)


class ParentGoalResponse(BaseModel):
    id: int
    parent_id: int
    child_id: int
    daily_minutes_goal: int
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
