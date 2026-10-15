from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.models.content import Lesson
from app.routers import (
    auth,
    content,
    practice,
    speech,
    chat,
    progress,
    parent,
    review
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed if tables are empty
    db = SessionLocal()
    try:
        lesson_count = db.query(Lesson).count()
        if lesson_count == 0:
            seed_database(db)
    finally:
        db.close()
        
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Tamil Buddy - AI-powered Tamil language learning for diaspora children.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware for http://localhost:5173
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(content.router)
app.include_router(practice.router)
app.include_router(speech.router)
app.include_router(chat.router)
app.include_router(progress.router)
app.include_router(parent.router)
app.include_router(review.router)


# Health Check
@app.get("/api/health", tags=["Health Check"])
def health_check():
    return {
        "status": "online",
        "service": "Tamil Buddy Fullstack",
        "version": settings.VERSION,
        "docs": "/docs"
    }


# Mount frontend static build if dist directory exists
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))

if os.path.exists(dist_dir):
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/kili-icon.svg", include_in_schema=False)
    def kili_icon():
        return FileResponse(os.path.join(dist_dir, "kili-icon.svg"))

    @app.get("/manifest.webmanifest", include_in_schema=False)
    def webmanifest():
        return FileResponse(os.path.join(dist_dir, "manifest.webmanifest"))

    @app.get("/", include_in_schema=False)
    def serve_frontend_root():
        return FileResponse(os.path.join(dist_dir, "index.html"))

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_frontend_spa(full_path: str):
        # Do not catch API or docs routes
        api_prefixes = (
            "docs", "redoc", "openapi.json", "auth", "lessons", "letters",
            "words", "attempts", "speech", "chat", "progress", "parent", "review", "api"
        )
        if any(full_path == prefix or full_path.startswith(prefix + "/") for prefix in api_prefixes):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})

        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))
else:
    @app.get("/", tags=["Health Check"])
    def root():
        return {
            "status": "online",
            "service": "Tamil Buddy API",
            "version": settings.VERSION,
            "docs": "/docs"
        }
