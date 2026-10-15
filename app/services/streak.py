from datetime import date, datetime, timedelta
from typing import Tuple, Optional
from app.models.user import User


def get_current_iso_week(target_date: Optional[date] = None) -> str:
    d = target_date or date.today()
    iso = d.isocalendar()
    return f"{iso.year}-W{iso.week:02d}"


def process_user_streak(user: User, activity_date: Optional[date] = None) -> Tuple[int, bool, bool]:
    """
    Updates the user's streak based on activity date.
    Supports 1 streak-freeze per week which resets weekly.
    
    Returns:
        (streak_current, used_freeze, streak_incremented)
    """
    today = activity_date or date.today()
    today_str = today.isoformat()
    current_week = get_current_iso_week(today)

    # Check and perform weekly reset of streak freeze
    if user.last_freeze_week != current_week:
        user.streak_freezes_left = 1
        user.last_freeze_week = current_week

    # First activity ever
    if not user.last_active_date:
        user.streak_current = 1
        user.streak_best = max(user.streak_best or 0, 1)
        user.last_active_date = today_str
        return user.streak_current, False, True

    last_active = date.fromisoformat(user.last_active_date)
    delta_days = (today - last_active).days

    if delta_days <= 0:
        # Already active today or earlier in the same day
        return user.streak_current, False, False

    elif delta_days == 1:
        # Consecutive day: increment streak
        user.streak_current = (user.streak_current or 0) + 1
        user.streak_best = max(user.streak_best or 0, user.streak_current)
        user.last_active_date = today_str
        return user.streak_current, False, True

    elif delta_days == 2:
        # Missed 1 day: check if streak freeze can be used
        if user.streak_freezes_left > 0:
            user.streak_freezes_left -= 1
            user.streak_current = (user.streak_current or 0) + 1
            user.streak_best = max(user.streak_best or 0, user.streak_current)
            user.last_active_date = today_str
            return user.streak_current, True, True
        else:
            # No freeze left: reset streak to 1
            user.streak_current = 1
            user.last_active_date = today_str
            return user.streak_current, False, True

    else:
        # Missed more than 1 day: reset streak to 1
        user.streak_current = 1
        user.last_active_date = today_str
        return user.streak_current, False, True
