from datetime import date, timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.practice import StreakLog, LetterMastery, WordMastery
from app.models.content import Lesson
from app.models.gamification import ParentGoal
from app.schemas.parent import (
    ParentReportResponse,
    ParentGoalCreate,
    ParentGoalResponse,
    WeeklySummary,
    RecommendedLesson
)
from app.services.metrics import calculate_skill_scores, calculate_engagement_metrics

router = APIRouter(prefix="/parent", tags=["Parent Dashboard & Reports"])


@router.get("/report/{user_id}", response_model=ParentReportResponse)
def get_parent_report(
    user_id: int,
    db: Session = Depends(get_db)
):
    child = db.query(User).filter(User.id == user_id).first()
    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Child user not found"
        )

    # 1. Weekly summary (past 7 days)
    seven_days_ago = (date.today() - timedelta(days=7)).isoformat()
    weekly_logs = (
        db.query(StreakLog)
        .filter(StreakLog.user_id == child.id, StreakLog.date >= seven_days_ago)
        .all()
    )
    total_minutes = round(sum(log.minutes_spent for log in weekly_logs), 1)
    lessons_completed = sum(log.lessons_done for log in weekly_logs)
    total_xp = sum(log.xp_earned for log in weekly_logs)

    weekly_summary = WeeklySummary(
        total_minutes=total_minutes,
        lessons_completed=lessons_completed,
        total_xp=total_xp,
        streak=child.streak_current or 0
    )

    # 2. Identify weak areas
    skill_scores = calculate_skill_scores(db, child.id)
    weak_areas: List[str] = []
    
    if skill_scores.speaking < 60.0:
        weak_areas.append("Speaking (Pronunciation & Accent)")
    if skill_scores.listening < 60.0:
        weak_areas.append("Listening Comprehension")
    if skill_scores.reading < 60.0:
        weak_areas.append("Letter Recognition & Reading")
    if skill_scores.writing < 60.0:
        weak_areas.append("Letter Tracing & Writing")

    low_letters = (
        db.query(LetterMastery)
        .filter(LetterMastery.user_id == child.id, LetterMastery.mastery < 50.0)
        .count()
    )
    if low_letters > 0:
        weak_areas.append(f"{low_letters} letters need review")

    if not weak_areas:
        weak_areas.append("No major weak areas! Great balanced progress.")

    # 3. Recommended next lessons
    # Recommend lessons matching weak skills or next sequential lessons
    candidate_lessons = db.query(Lesson).order_by(Lesson.unit, Lesson.order).limit(3).all()
    recommended_lessons: List[RecommendedLesson] = []
    for l in candidate_lessons:
        reason = "Strengthens foundation in vowel pronunciation and tracing."
        if l.type == "speaking":
            reason = "Boosts conversational confidence and Tamil phonics."
        elif l.type == "quiz":
            reason = "Tests mastery of current unit letters and words."
        recommended_lessons.append(
            RecommendedLesson(
                id=l.id,
                unit=l.unit,
                title=l.title,
                type=l.type,
                reason=reason
            )
        )

    # 4. Engagement metrics
    engagement = calculate_engagement_metrics(db, child)
    engagement_dict = {
        "lesson_completion_rate": engagement.lesson_completion_rate,
        "avg_session_time_minutes": engagement.avg_session_time_minutes,
        "retention_7d": engagement.retention_7d,
        "drop_off_risk": engagement.drop_off_risk,
        "welcome_message": engagement.welcome_message
    }

    # 5. Daily minutes goal
    goal_record = db.query(ParentGoal).filter(ParentGoal.child_id == child.id).first()
    daily_goal = goal_record.daily_minutes_goal if goal_record else 15

    return ParentReportResponse(
        user_id=child.id,
        child_name=child.name,
        weekly_summary=weekly_summary,
        weak_areas=weak_areas,
        time_spent=total_minutes,
        recommended_next_lessons=recommended_lessons,
        engagement_metrics=engagement_dict,
        daily_minutes_goal=daily_goal
    )


@router.post("/goal", response_model=ParentGoalResponse)
def set_parent_goal(
    goal_in: ParentGoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify child exists
    child = db.query(User).filter(User.id == goal_in.child_id).first()
    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Child user not found"
        )

    goal = db.query(ParentGoal).filter(ParentGoal.child_id == goal_in.child_id).first()
    if not goal:
        goal = ParentGoal(
            parent_id=current_user.id,
            child_id=goal_in.child_id,
            daily_minutes_goal=goal_in.daily_minutes_goal
        )
        db.add(goal)
    else:
        goal.parent_id = current_user.id
        goal.daily_minutes_goal = goal_in.daily_minutes_goal

    db.commit()
    db.refresh(goal)
    return goal
