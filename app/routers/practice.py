from datetime import date, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.practice import Attempt, LetterMastery, WordMastery, StreakLog
from app.schemas.practice import AttemptCreate, AttemptResponse
from app.services.sm2 import calculate_sm2
from app.services.streak import process_user_streak
from app.services.gamification import process_gamification

router = APIRouter(tags=["Practice"])


@router.post("/attempts", response_model=AttemptResponse, status_code=status.HTTP_201_CREATED)
def submit_attempt(
    attempt_in: AttemptCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Record Attempt
    attempt = Attempt(
        user_id=current_user.id,
        lesson_id=attempt_in.lesson_id,
        exercise_type=attempt_in.exercise_type,
        skill=attempt_in.skill,
        score=attempt_in.score,
        is_correct=attempt_in.is_correct,
        time_spent=attempt_in.time_spent,
    )
    db.add(attempt)
    db.flush()

    # 2. Update SM-2 mastery for Letter if applicable
    if attempt_in.letter_id:
        mastery_record = (
            db.query(LetterMastery)
            .filter(LetterMastery.user_id == current_user.id, LetterMastery.letter_id == attempt_in.letter_id)
            .first()
        )
        if not mastery_record:
            mastery_record = LetterMastery(
                user_id=current_user.id,
                letter_id=attempt_in.letter_id,
                mastery=0.0,
                repetitions=0,
                interval=1.0,
                ease_factor=2.5
            )
            db.add(mastery_record)
            db.flush()

        reps, interval, ef, new_mastery, next_rev = calculate_sm2(
            score=attempt_in.score,
            current_repetitions=mastery_record.repetitions or 0,
            current_interval=mastery_record.interval or 1.0,
            current_ease_factor=mastery_record.ease_factor or 2.5,
            current_mastery=mastery_record.mastery or 0.0
        )
        mastery_record.repetitions = reps
        mastery_record.interval = interval
        mastery_record.ease_factor = ef
        mastery_record.mastery = new_mastery
        mastery_record.last_seen = datetime.now(timezone.utc)
        mastery_record.next_review = next_rev

    # 3. Update SM-2 mastery for Word if applicable
    if attempt_in.word_id:
        word_mastery = (
            db.query(WordMastery)
            .filter(WordMastery.user_id == current_user.id, WordMastery.word_id == attempt_in.word_id)
            .first()
        )
        if not word_mastery:
            word_mastery = WordMastery(
                user_id=current_user.id,
                word_id=attempt_in.word_id,
                passive_count=0,
                active_count=0,
                mastery=0.0,
                repetitions=0,
                interval=1.0,
                ease_factor=2.5
            )
            db.add(word_mastery)
            db.flush()

        if attempt_in.skill in ["speaking", "writing"]:
            word_mastery.active_count = (word_mastery.active_count or 0) + 1
        else:
            word_mastery.passive_count = (word_mastery.passive_count or 0) + 1

        reps, interval, ef, new_mastery, next_rev = calculate_sm2(
            score=attempt_in.score,
            current_repetitions=word_mastery.repetitions or 0,
            current_interval=word_mastery.interval or 1.0,
            current_ease_factor=word_mastery.ease_factor or 2.5,
            current_mastery=word_mastery.mastery or 0.0
        )
        word_mastery.repetitions = reps
        word_mastery.interval = interval
        word_mastery.ease_factor = ef
        word_mastery.mastery = new_mastery
        word_mastery.last_seen = datetime.now(timezone.utc)
        word_mastery.next_review = next_rev

    # 4. Update Daily Streak
    streak_val, used_freeze, incremented = process_user_streak(current_user)

    # 5. Process Gamification (XP, level up, badge awards)
    xp_gained, level_up, new_badges = process_gamification(
        db=db,
        user=current_user,
        score=attempt_in.score,
        is_correct=attempt_in.is_correct,
        latest_attempt=attempt
    )

    # 6. Update StreakLog for today
    today_str = date.today().isoformat()
    streak_log = (
        db.query(StreakLog)
        .filter(StreakLog.user_id == current_user.id, StreakLog.date == today_str)
        .first()
    )
    if not streak_log:
        streak_log = StreakLog(
            user_id=current_user.id,
            date=today_str,
            xp_earned=0,
            minutes_spent=0.0,
            lessons_done=0
        )
        db.add(streak_log)

    streak_log.xp_earned = (streak_log.xp_earned or 0) + xp_gained
    streak_log.minutes_spent = (streak_log.minutes_spent or 0.0) + (attempt_in.time_spent / 60.0)
    if attempt_in.lesson_id:
        streak_log.lessons_done = (streak_log.lessons_done or 0) + 1

    db.commit()
    db.refresh(current_user)

    return AttemptResponse(
        xp_gained=xp_gained,
        new_badges=new_badges,
        streak=current_user.streak_current,
        level_up=level_up,
        current_level=current_user.level,
        total_xp=current_user.xp
    )
