from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.practice import Attempt
from app.models.content import Lesson


def evaluate_adaptive_difficulty(db: Session, user_id: int, skill: str) -> Dict[str, Any]:
    """
    Evaluates adaptive difficulty:
    - If last 5 attempts in a skill > 85%: raise difficulty
    - If last 5 attempts in a skill < 50%: lower difficulty and recommend easier lessons
    - Otherwise maintain standard difficulty
    """
    last_5 = (
        db.query(Attempt)
        .filter(Attempt.user_id == user_id, Attempt.skill == skill)
        .order_by(Attempt.created_at.desc())
        .limit(5)
        .all()
    )

    if len(last_5) < 5:
        return {
            "skill": skill,
            "difficulty": "medium",
            "status": "normal",
            "attempts_count": len(last_5),
            "average_score": round(sum(a.score for a in last_5) / len(last_5), 1) if last_5 else 0.0,
            "recommendation": "Keep practicing to establish an adaptive baseline.",
            "recommended_lessons": []
        }

    avg_score = sum(a.score for a in last_5) / 5.0

    if avg_score > 85.0:
        difficulty = "hard"
        status = "raised"
        recommendation = "Super star! Difficulty raised with advanced speech & vocabulary challenges."
        # Recommend next unit or harder lessons
        recommended = db.query(Lesson).filter(Lesson.type.in_(["quiz", "speaking"])).limit(2).all()
    elif avg_score < 50.0:
        difficulty = "easy"
        status = "lowered"
        recommendation = "Let's reinforce the basics with gentle step-by-step guided lessons."
        # Recommend foundational unit 1 lessons
        recommended = db.query(Lesson).filter(Lesson.unit == 1, Lesson.order <= 3).limit(2).all()
    else:
        difficulty = "medium"
        status = "normal"
        recommendation = "Doing great! Maintain steady progress on current unit exercises."
        recommended = db.query(Lesson).limit(2).all()

    return {
        "skill": skill,
        "difficulty": difficulty,
        "status": status,
        "attempts_count": 5,
        "average_score": round(avg_score, 1),
        "recommendation": recommendation,
        "recommended_lessons": [
            {"id": l.id, "unit": l.unit, "title": l.title, "type": l.type}
            for l in recommended
        ]
    }
