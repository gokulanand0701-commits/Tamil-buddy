from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.practice import LetterMastery, WordMastery
from app.models.content import Letter, Word
from app.schemas.review import ReviewTodayResponse, ReviewItem

router = APIRouter(prefix="/review", tags=["Spaced Repetition Review"])


@router.get("/today", response_model=ReviewTodayResponse)
def get_reviews_due_today(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)

    # 1. Letters due for review
    due_letters = (
        db.query(LetterMastery, Letter)
        .join(Letter, LetterMastery.letter_id == Letter.id)
        .filter(LetterMastery.user_id == current_user.id, LetterMastery.next_review <= now)
        .order_by(LetterMastery.next_review)
        .all()
    )

    letter_items: List[ReviewItem] = [
        ReviewItem(
            item_type="letter",
            item_id=mast.id,
            tamil=let.tamil_char,
            transliteration=let.transliteration,
            category=let.category,
            mastery=round(mast.mastery or 0.0, 1),
            repetitions=mast.repetitions or 0,
            next_review=mast.next_review,
            audio_url=let.audio_url
        )
        for mast, let in due_letters
    ]

    # 2. Words due for review
    due_words = (
        db.query(WordMastery, Word)
        .join(Word, WordMastery.word_id == Word.id)
        .filter(WordMastery.user_id == current_user.id, WordMastery.next_review <= now)
        .order_by(WordMastery.next_review)
        .all()
    )

    word_items: List[ReviewItem] = [
        ReviewItem(
            item_type="word",
            item_id=mast.id,
            tamil=w.tamil,
            transliteration=w.transliteration,
            meaning=w.meaning,
            category=w.category,
            mastery=round(mast.mastery or 0.0, 1),
            repetitions=mast.repetitions or 0,
            next_review=mast.next_review,
            audio_url=w.audio_url
        )
        for mast, w in due_words
    ]

    return ReviewTodayResponse(
        total_due=len(letter_items) + len(word_items),
        letters=letter_items,
        words=word_items
    )
