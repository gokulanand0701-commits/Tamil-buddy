from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class ReviewItem(BaseModel):
    item_type: str  # "letter" or "word"
    item_id: int
    tamil: str
    transliteration: str
    meaning: Optional[str] = None
    category: str
    mastery: float
    repetitions: int
    next_review: datetime
    audio_url: Optional[str] = None


class ReviewTodayResponse(BaseModel):
    total_due: int
    letters: List[ReviewItem]
    words: List[ReviewItem]
