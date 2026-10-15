from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=True)
    role = Column(String(20), default="child")  # "child" or "parent"
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    parent_pin = Column(String(10), nullable=True)  # 4-digit PIN for parent gate
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    avatar = Column(String(255), default="kili_parrot.png")
    
    # Streak & Retention tracking
    streak_current = Column(Integer, default=0)
    streak_best = Column(Integer, default=0)
    last_active_date = Column(String(10), nullable=True)  # YYYY-MM-DD
    streak_freezes_left = Column(Integer, default=1)
    last_freeze_week = Column(String(10), nullable=True)  # YYYY-WW tracking weekly reset
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")
    letter_masteries = relationship("LetterMastery", back_populates="user", cascade="all, delete-orphan")
    word_masteries = relationship("WordMastery", back_populates="user", cascade="all, delete-orphan")
    streak_logs = relationship("StreakLog", back_populates="user", cascade="all, delete-orphan")
    user_badges = relationship("UserBadge", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
