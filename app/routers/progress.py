from datetime import date, timedelta
from typing import Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.models.practice import LetterMastery, WordMastery, StreakLog
from app.models.content import Letter
from app.schemas.progress import ProgressResponse
from app.services.metrics import (
    calculate_skill_scores,
    calculate_overall_fluency,
    calculate_engagement_metrics
)

router = APIRouter(prefix="/progress", tags=["Progress & Fluency"])


@router.get("/{user_id}", response_model=ProgressResponse)
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # 1. Skill Scores & Overall Fluency
    skill_scores = calculate_skill_scores(db, user.id)
    overall_fluency = calculate_overall_fluency(skill_scores)

    # 2. Weekly XP (past 7 days)
    seven_days_ago = (date.today() - timedelta(days=7)).isoformat()
    weekly_logs = (
        db.query(StreakLog)
        .filter(StreakLog.user_id == user.id, StreakLog.date >= seven_days_ago)
        .all()
    )
    weekly_xp = sum(log.xp_earned for log in weekly_logs)

    # 3. Letters Mastery Map
    letters_map: Dict[str, float] = {}
    mastery_records = (
        db.query(LetterMastery, Letter.tamil_char)
        .join(Letter, LetterMastery.letter_id == Letter.id)
        .filter(LetterMastery.user_id == user.id)
        .all()
    )
    for record, char in mastery_records:
        letters_map[char] = round(record.mastery or 0.0, 1)

    # 4. Words Learned Count (mastery >= 50.0)
    words_learned = (
        db.query(WordMastery)
        .filter(WordMastery.user_id == user.id, WordMastery.mastery >= 50.0)
        .count()
    )

    # 5. Engagement Metrics & Welcome Back Message
    engagement = calculate_engagement_metrics(db, user)

    return ProgressResponse(
        user_id=user.id,
        name=user.name,
        level=user.level,
        total_xp=user.xp,
        weekly_xp=weekly_xp,
        streak_current=user.streak_current,
        streak_best=user.streak_best,
        skill_scores=skill_scores,
        overall_fluency_score=overall_fluency,
        letters_mastery_map=letters_map,
        words_learned_count=words_learned,
        engagement=engagement
    )
