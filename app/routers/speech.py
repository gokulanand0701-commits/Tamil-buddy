from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.schemas.practice import SpeechEvalResponse
from app.services.speech import evaluate_tamil_speech

router = APIRouter(prefix="/speech", tags=["Speech Evaluation"])


@router.post("/evaluate", response_model=SpeechEvalResponse)
async def evaluate_speech(
    audio_file: UploadFile = File(..., description="WAV, MP3, or WebM audio file of child's speech"),
    target_text: str = Form(..., description="Target Tamil text child was asked to speak")
):
    if not target_text or not target_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Target text cannot be empty"
        )

    try:
        audio_bytes = await audio_file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read audio file: {str(e)}"
        )

    response = evaluate_tamil_speech(audio_bytes=audio_bytes, target_text=target_text)
    return response
