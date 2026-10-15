import json
from typing import List, Tuple
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.practice import Attempt, LetterMastery, WordMastery
from app.models.gamification import Badge, UserBadge
from app.models.chat import ChatMessage
from app.schemas.practice import BadgeEarned


def calculate_attempt_xp(score: float, is_correct: bool) -> int:
    """Calculates XP earned from an exercise attempt."""
    base_xp = 10
    score_bonus = int(score * 0.1)
    correct_bonus = 5 if is_correct else 0
    return base_xp + score_bonus + correct_bonus


def check_and_award_badges(db: Session, user: User, latest_attempt: Attempt = None) -> List[BadgeEarned]:
    """
    Checks all badge criteria and awards new badges to user if eligible.
    Returns list of newly awarded badges.
    """
    existing_badge_ids = set(
        b.badge_id for b in db.query(UserBadge).filter(UserBadge.user_id == user.id).all()
    )
    all_badges = db.query(Badge).all()
    newly_awarded: List[BadgeEarned] = []

    for badge in all_badges:
        if badge.id in existing_badge_ids:
            continue

        eligible = False
        code = badge.code

        if code == "first_10_letters":
            count = (
                db.query(LetterMastery)
                .filter(LetterMastery.user_id == user.id, LetterMastery.mastery >= 60.0)
                .count()
            )
            if count >= 10:
                eligible = True

        elif code == "streak_7_days":
            if (user.streak_current or 0) >= 7:
                eligible = True

        elif code == "chatterbox_5":
            chat_count = (
                db.query(ChatMessage)
                .join(ChatMessage.session)
                .filter(ChatMessage.session.has(user_id=user.id), ChatMessage.sender == "child")
                .count()
            )
            if chat_count >= 5:
                eligible = True

        elif code == "word_explorer":
            word_count = (
                db.query(WordMastery)
                .filter(WordMastery.user_id == user.id, WordMastery.mastery >= 60.0)
                .count()
            )
            if word_count >= 10:
                eligible = True

        elif code == "perfect_pronunciation":
            if latest_attempt and latest_attempt.skill == "speaking" and latest_attempt.score >= 100.0:
                eligible = True

        elif code == "super_learner":
            if (user.xp or 0) >= 500:
                eligible = True

        if eligible:
            user_badge = UserBadge(user_id=user.id, badge_id=badge.id)
            db.add(user_badge)
            newly_awarded.append(
                BadgeEarned(
                    code=badge.code,
                    title=badge.title,
                    description=badge.description,
                    icon=badge.icon,
                )
            )

    return newly_awarded


def process_gamification(
    db: Session,
    user: User,
    score: float,
    is_correct: bool,
    latest_attempt: Attempt
) -> Tuple[int, bool, List[BadgeEarned]]:
    """
    Processes XP gain, calculates level changes, and checks badge awards.
    Returns: (xp_gained, level_up, new_badges)
    """
    xp_gained = calculate_attempt_xp(score, is_correct)
    old_level = user.level or 1
    
    user.xp = (user.xp or 0) + xp_gained
    new_level = 1 + int(user.xp // 100)
    
    level_up = new_level > old_level
    user.level = new_level

    new_badges = check_and_award_badges(db, user, latest_attempt)
    return xp_gained, level_up, new_badges
