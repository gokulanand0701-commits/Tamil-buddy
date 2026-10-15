from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    unit = Column(Integer, nullable=False, index=True)
    title = Column(String(200), nullable=False)
    order = Column(Integer, nullable=False, default=1)
    type = Column(String(50), default="interactive")  # e.g., "letter_intro", "word_matching", "speaking", "quiz"
    content_json = Column(Text, nullable=False)  # JSON string containing exercises, prompts, assets


class Letter(Base):
    __tablename__ = "letters"

    id = Column(Integer, primary_key=True, index=True)
    tamil_char = Column(String(10), nullable=False, unique=True, index=True)
    category = Column(String(20), nullable=False, index=True)  # "uyir", "mei", "uyirmei"
    transliteration = Column(String(50), nullable=False)
    audio_url = Column(String(255), nullable=True)
    stroke_data_json = Column(Text, nullable=True)  # SVG path coordinates for stroke animation / tracing


class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    tamil = Column(String(100), nullable=False, unique=True, index=True)
    transliteration = Column(String(100), nullable=False)
    meaning = Column(String(200), nullable=False)
    category = Column(String(50), nullable=False, index=True)  # "family", "food", "animals", "colors"
    audio_url = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
