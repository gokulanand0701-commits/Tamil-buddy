from typing import List, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Child's message (text or speech transcript)")
    topic: Optional[str] = Field("General Conversation", description="Chat topic or scenario")
    session_id: Optional[int] = Field(None, description="Existing session id or omit for new session")


class ChatResponse(BaseModel):
    session_id: int
    reply_tamil: str
    reply_translit: str
    reply_english: str
    suggested_replies: List[str]
