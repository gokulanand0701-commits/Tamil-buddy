from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.content import Lesson, Letter, Word
from app.schemas.content import LessonOut, LetterOut, WordOut

router = APIRouter(tags=["Content"])


@router.get("/lessons", response_model=List[LessonOut])
def get_lessons(
    unit: Optional[int] = Query(None, description="Filter by unit number"),
    db: Session = Depends(get_db)
):
    query = db.query(Lesson)
    if unit is not None:
        query = query.filter(Lesson.unit == unit)
    return query.order_by(Lesson.unit, Lesson.order).all()


@router.get("/lessons/{id}", response_model=LessonOut)
def get_lesson(id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == id).first()
    if not lesson:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")
    return lesson


@router.get("/letters", response_model=List[LetterOut])
def get_letters(
    category: Optional[str] = Query(None, description="Filter by category (uyir, mei, uyirmei)"),
    db: Session = Depends(get_db)
):
    query = db.query(Letter)
    if category:
        query = query.filter(Letter.category == category)
    return query.order_by(Letter.id).all()


@router.get("/words", response_model=List[WordOut])
def get_words(
    category: Optional[str] = Query(None, description="Filter by category (family, food, animals, colors)"),
    db: Session = Depends(get_db)
):
    query = db.query(Word)
    if category:
        query = query.filter(Word.category == category)
    return query.order_by(Word.id).all()
