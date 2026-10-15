from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.chat import ChatSession, ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.gemini import generate_kili_reply
from app.services.gamification import check_and_award_badges

router = APIRouter(prefix="/chat", tags=["AI Chat - Kili the Parrot"])


@router.post("", response_model=ChatResponse)
async def chat_with_kili(
    chat_in: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Retrieve or create ChatSession
    session = None
    if chat_in.session_id:
        session = (
            db.query(ChatSession)
            .filter(ChatSession.id == chat_in.session_id, ChatSession.user_id == current_user.id)
            .first()
        )
    
    if not session:
        session = ChatSession(
            user_id=current_user.id,
            topic=chat_in.topic or "General Conversation"
        )
        db.add(session)
        db.flush()

    # 2. Save child's message
    child_msg = ChatMessage(
        session_id=session.id,
        sender="child",
        text_tamil=chat_in.message
    )
    db.add(child_msg)
    db.flush()

    # 3. Generate response from Gemini (with Kili mock fallback)
    kili_data = await generate_kili_reply(chat_in.message, chat_in.topic or session.topic)

    # 4. Save Kili's reply
    kili_msg = ChatMessage(
        session_id=session.id,
        sender="kili",
        text_tamil=kili_data["reply_tamil"],
        transliteration=kili_data["reply_translit"],
        english_translation=kili_data["reply_english"]
    )
    db.add(kili_msg)

    # 5. Check if Chatterbox badge is unlocked
    check_and_award_badges(db, current_user)

    db.commit()
    db.refresh(session)

    return ChatResponse(
        session_id=session.id,
        reply_tamil=kili_data["reply_tamil"],
        reply_translit=kili_data["reply_translit"],
        reply_english=kili_data["reply_english"],
        suggested_replies=kili_data["suggested_replies"]
    )
