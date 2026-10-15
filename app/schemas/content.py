from typing import Optional, Any
from pydantic import BaseModel, ConfigDict


class LessonOut(BaseModel):
    id: int
    unit: int
    title: str
    order: int
    type: str
    content_json: str

    model_config = ConfigDict(from_attributes=True)


class LetterOut(BaseModel):
    id: int
    tamil_char: str
    category: str
    transliteration: str
    audio_url: Optional[str] = None
    stroke_data_json: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class WordOut(BaseModel):
    id: int
    tamil: str
    transliteration: str
    meaning: str
    category: str
    audio_url: Optional[str] = None
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
