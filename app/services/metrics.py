from datetime import date, timedelta
from typing import Dict, Any, Optional
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.practice import Attempt, StreakLog
from app.models.content import Lesson
from app.models.user import User
from app.schemas.progress import SkillScores, EngagementMetrics


def calculate_skill_scores(db: Session, user_id: int) -> SkillScores:
    """
    Skill score = weighted rolling average of last 20 attempts per skill.
    More recent attempts have higher linear weights (1 to N).
    """
    skills = ["listening", "speaking", "reading", "writing"]
    results = {}

    for skill in skills:
        # Fetch up to 20 attempts ordered by created_at DESC
        attempts = (
            db.query(Attempt)
            .filter(Attempt.user_id == user_id, Attempt.skill == skill)
            .order_by(Attempt.created_at.desc())
            .limit(20)
            .all()
        )

        if not attempts:
            results[skill] = 0.0
            continue

        # Reverse so attempts are chronological (1 to N)
        attempts = list(reversed(attempts))
        n = len(attempts)
        weighted_sum = 0.0
        total_weight = 0.0

        for i, att in enumerate(attempts, start=1):
            weight = float(i)
            weighted_sum += weight * float(att.score)
            total_weight += weight

        results[skill] = round(weighted_sum / total_weight, 1) if total_weight > 0 else 0.0

    return SkillScores(**results)


def calculate_overall_fluency(skill_scores: SkillScores) -> float:
    """
    Overall fluency score = 0.3 listening + 0.3 speaking + 0.2 reading + 0.2 writing
    """
    fluency = (
        (0.3 * skill_scores.listening) +
        (0.3 * skill_scores.speaking) +
        (0.2 * skill_scores.reading) +
        (0.2 * skill_scores.writing)
    )
    return round(fluency, 1)


def calculate_engagement_metrics(db: Session, user: User) -> EngagementMetrics:
    """
    Calculates engagement metrics:
    - lesson completion rate
    - avg session time
    - 7-day retention flag
    - drop-off risk (no activity 3+ days)
    - welcome back message if at drop-off risk
    """
    # 1. Lesson completion rate
    total_lessons = db.query(Lesson).count()
    completed_lessons = (
        db.query(Attempt.lesson_id)
        .filter(Attempt.user_id == user.id, Attempt.score >= 60.0, Attempt.lesson_id.isnot(None))
        .distinct()
        .count()
    )
    completion_rate = round((completed_lessons / max(1, total_lessons)) * 100.0, 1)

    # 2. Avg session time & 7-day retention
    today = date.today()
    seven_days_ago = (today - timedelta(days=7)).isoformat()
    
    streak_logs = db.query(StreakLog).filter(StreakLog.user_id == user.id).all()
    total_minutes = sum(log.minutes_spent for log in streak_logs)
    total_active_days = len(streak_logs)
    avg_session_time = round(total_minutes / max(1, total_active_days), 1)

    # Retention: active at least 3 of last 7 days or active in past 7 days and prior
    recent_logs_count = (
        db.query(StreakLog)
        .filter(StreakLog.user_id == user.id, StreakLog.date >= seven_days_ago)
        .count()
    )
    retention_7d = recent_logs_count >= 3 or (recent_logs_count >= 1 and total_active_days >= 3)

    # 3. Drop-off risk: no activity for 3+ days
    drop_off_risk = False
    welcome_message: Optional[str] = None

    if user.last_active_date:
        last_date = date.fromisoformat(user.last_active_date)
        days_inactive = (today - last_date).days
        if days_inactive >= 3:
            drop_off_risk = True
            welcome_message = (
                f"வணக்கம் {user.name}! (Vanakkam {user.name}!) Kili the parrot missed you! "
                "Ready to jump back into your Tamil learning adventure today? ✨"
            )

    return EngagementMetrics(
        lesson_completion_rate=completion_rate,
        avg_session_time_minutes=avg_session_time,
        retention_7d=retention_7d,
        drop_off_risk=drop_off_risk,
        welcome_message=welcome_message
    )
