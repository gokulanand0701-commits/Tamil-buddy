@echo off
title Tamil Buddy Backend Server
echo ====================================================
echo Starting Tamil Buddy Backend Server on http://localhost:8000
echo Swagger Docs available at http://localhost:8000/docs
echo ====================================================
cd /d "%~dp0"
call .\venv\Scripts\activate
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
