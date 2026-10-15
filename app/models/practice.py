from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    exercise_type = Column(String(50), nullable=False)  # "mcq", "listen_select", "speak", "trace", "flashcard"
    skill = Column(String(20), nullable=False, index=True)  # "listening", "speaking", "reading", "writing"
    score = Column(Float, nullable=False)  # 0.0 to 100.0
    is_correct = Column(Boolean, default=False)
    time_spent = Column(Integer, default=0)  # seconds
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="attempts")
    lesson = relationship("Lesson")


class LetterMastery(Base):
    __tablename__ = "letter_mastery"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    letter_id = Column(Integer, ForeignKey("letters.id", ondelete="CASCADE"), nullable=False, index=True)
    mastery = Column(Float, default=0.0)  # 0 to 100
    last_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    next_review = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    repetitions = Column(Integer, default=0)
    interval = Column(Float, default=1.0)  # days
    ease_factor = Column(Float, default=2.5)

    user = relationship("User", back_populates="letter_masteries")
    letter = relationship("Letter")


class WordMastery(Base):
    __tablename__ = "word_mastery"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    word_id = Column(Integer, ForeignKey("words.id", ondelete="CASCADE"), nullable=False, index=True)
    passive_count = Column(Integer, default=0)  # e.g., heard / read
    active_count = Column(Integer, default=0)   # e.g., spoken / written
    mastery = Column(Float, default=0.0)  # 0 to 100
    last_seen = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    next_review = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    repetitions = Column(Integer, default=0)
    interval = Column(Float, default=1.0)  # days
    ease_factor = Column(Float, default=2.5)

    user = relationship("User", back_populates="word_masteries")
    word = relationship("Word")


class StreakLog(Base):
    __tablename__ = "streak_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String(10), nullable=False, index=True)  # YYYY-MM-DD
    xp_earned = Column(Integer, default=0)
    minutes_spent = Column(Float, default=0.0)
    lessons_done = Column(Integer, default=0)

    user = relationship("User", back_populates="streak_logs")
