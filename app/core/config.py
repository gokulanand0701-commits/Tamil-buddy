import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Tamil Buddy Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = ""
    
    # Database: Use /tmp on Vercel serverless, local file in dev
    DATABASE_URL: str = "sqlite:////tmp/tamil_buddy.db" if os.environ.get("VERCEL") else "sqlite:///./tamil_buddy.db"
    
    # JWT Auth
    SECRET_KEY: str = "tamilbuddy-secret-key-change-in-production-123456789"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # AI & Speech Providers
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    STT_PROVIDER: str = "mock"  # "mock", "google", "whisper"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "*",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
