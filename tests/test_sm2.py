from datetime import datetime, timezone
from app.services.sm2 import calculate_sm2


def test_sm2_first_successful_attempt():
    score = 95.0
    reps, interval, ef, mastery, next_rev = calculate_sm2(
        score=score,
        current_repetitions=0,
        current_interval=1.0,
        current_ease_factor=2.5,
        current_mastery=0.0
    )
    assert reps == 1
    assert interval == 1.0
    assert ef >= 2.5
    assert mastery > 0.0
    assert next_rev > datetime.now(timezone.utc)


def test_sm2_subsequent_attempts_growth():
    # Repetition 1 -> 2
    reps, interval, ef, mastery, next_rev = calculate_sm2(
        score=90.0,
        current_repetitions=1,
        current_interval=1.0,
        current_ease_factor=2.6,
        current_mastery=50.0
    )
    assert reps == 2
    assert interval == 6.0
    assert mastery > 50.0

    # Repetition 2 -> 3
    reps3, interval3, ef3, mastery3, next_rev3 = calculate_sm2(
        score=90.0,
        current_repetitions=2,
        current_interval=6.0,
        current_ease_factor=ef,
        current_mastery=mastery
    )
    assert reps3 == 3
    assert interval3 > 6.0
    assert interval3 == round(6.0 * ef3, 1)


def test_sm2_failed_attempt_resets():
    reps, interval, ef, mastery, next_rev = calculate_sm2(
        score=30.0,
        current_repetitions=3,
        current_interval=15.0,
        current_ease_factor=2.5,
        current_mastery=80.0
    )
    # Fail resets repetitions to 0 and interval to 1.0 day
    assert reps == 0
    assert interval == 1.0
    assert ef < 2.5
    assert mastery < 80.0


def test_sm2_ease_factor_minimum_bound():
    reps, interval, ef, mastery, next_rev = calculate_sm2(
        score=0.0,
        current_repetitions=0,
        current_interval=1.0,
        current_ease_factor=1.3,
        current_mastery=10.0
    )
    assert ef >= 1.3
