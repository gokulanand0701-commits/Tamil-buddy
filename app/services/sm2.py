from datetime import datetime, timedelta, timezone
from typing import Tuple


def calculate_sm2(
    score: float,
    current_repetitions: int,
    current_interval: float,
    current_ease_factor: float,
    current_mastery: float
) -> Tuple[int, float, float, float, datetime]:
    """
    Calculate next SM-2 spaced repetition parameters.
    
    Returns:
        (new_repetitions, new_interval_days, new_ease_factor, new_mastery, next_review_datetime)
    """
    # Map score (0-100) to SM-2 quality grade q (0-5)
    # 90-100 -> 5
    # 80-89  -> 4
    # 60-79  -> 3
    # 40-59  -> 2
    # 20-39  -> 1
    # 0-19   -> 0
    if score >= 90:
        q = 5
    elif score >= 80:
        q = 4
    elif score >= 60:
        q = 3
    elif score >= 40:
        q = 2
    elif score >= 20:
        q = 1
    else:
        q = 0

    # Calculate new ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    new_ef = current_ease_factor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    if new_ef < 1.3:
        new_ef = 1.3
    new_ef = round(new_ef, 2)

    # Determine repetitions and interval
    if q >= 3:
        if current_repetitions == 0:
            new_interval = 1.0
        elif current_repetitions == 1:
            new_interval = 6.0
        else:
            new_interval = round(current_interval * new_ef, 1)
        new_repetitions = current_repetitions + 1
    else:
        new_repetitions = 0
        new_interval = 1.0

    # Calculate mastery score (0 to 100)
    if q >= 3:
        # Increase mastery smoothly towards 100
        gain = (score * 0.4) + min(new_repetitions * 6.0, 30.0)
        new_mastery = min(100.0, (current_mastery * 0.4) + gain)
    else:
        # Penalize mastery but keep constructive
        new_mastery = max(0.0, (current_mastery * 0.5) + (score * 0.2))
    
    new_mastery = round(new_mastery, 1)
    
    # Next review timestamp
    next_review = datetime.now(timezone.utc) + timedelta(days=new_interval)
    
    return new_repetitions, new_interval, new_ef, new_mastery, next_review
