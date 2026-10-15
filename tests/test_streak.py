from datetime import date, timedelta
from app.models.user import User
from app.services.streak import process_user_streak, get_current_iso_week


def test_first_activity_streak():
    user = User(
        name="Test",
        email="test1@example.com",
        password_hash="hash",
        streak_current=0,
        streak_best=0,
        last_active_date=None,
        streak_freezes_left=1
    )
    today = date(2026, 10, 1)
    streak, used_freeze, incremented = process_user_streak(user, activity_date=today)
    
    assert streak == 1
    assert user.streak_current == 1
    assert user.streak_best == 1
    assert used_freeze is False
    assert incremented is True
    assert user.last_active_date == today.isoformat()


def test_same_day_activity_maintains_streak():
    today = date(2026, 10, 1)
    user = User(
        name="Test",
        email="test2@example.com",
        password_hash="hash",
        streak_current=3,
        streak_best=5,
        last_active_date=today.isoformat(),
        streak_freezes_left=1
    )
    streak, used_freeze, incremented = process_user_streak(user, activity_date=today)
    assert streak == 3
    assert used_freeze is False
    assert incremented is False


def test_consecutive_day_increments_streak():
    day1 = date(2026, 10, 1)
    day2 = date(2026, 10, 2)
    user = User(
        name="Test",
        email="test3@example.com",
        password_hash="hash",
        streak_current=4,
        streak_best=4,
        last_active_date=day1.isoformat(),
        streak_freezes_left=1
    )
    streak, used_freeze, incremented = process_user_streak(user, activity_date=day2)
    assert streak == 5
    assert user.streak_current == 5
    assert user.streak_best == 5
    assert used_freeze is False
    assert incremented is True


def test_streak_freeze_applied_on_one_day_gap():
    day1 = date(2026, 10, 1)
    day3 = date(2026, 10, 3)  # Missed October 2nd (2-day delta)
    week_str = get_current_iso_week(day3)

    user = User(
        name="Test",
        email="test4@example.com",
        password_hash="hash",
        streak_current=5,
        streak_best=5,
        last_active_date=day1.isoformat(),
        streak_freezes_left=1,
        last_freeze_week=week_str
    )
    streak, used_freeze, incremented = process_user_streak(user, activity_date=day3)
    # Freeze protects streak and increments
    assert streak == 6
    assert used_freeze is True
    assert user.streak_freezes_left == 0
    assert user.last_active_date == day3.isoformat()


def test_streak_resets_when_no_freeze_available():
    day1 = date(2026, 10, 1)
    day3 = date(2026, 10, 3)
    week_str = get_current_iso_week(day3)

    user = User(
        name="Test",
        email="test5@example.com",
        password_hash="hash",
        streak_current=10,
        streak_best=10,
        last_active_date=day1.isoformat(),
        streak_freezes_left=0,
        last_freeze_week=week_str
    )
    streak, used_freeze, incremented = process_user_streak(user, activity_date=day3)
    assert streak == 1
    assert user.streak_current == 1
    assert used_freeze is False


def test_streak_resets_on_large_gap():
    day1 = date(2026, 10, 1)
    day10 = date(2026, 10, 10)  # Gap of 9 days

    user = User(
        name="Test",
        email="test6@example.com",
        password_hash="hash",
        streak_current=15,
        streak_best=15,
        last_active_date=day1.isoformat(),
        streak_freezes_left=1
    )
    streak, used_freeze, incremented = process_user_streak(user, activity_date=day10)
    assert streak == 1
    assert user.streak_current == 1
    assert used_freeze is False
