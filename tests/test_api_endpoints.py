import io
from fastapi.testclient import TestClient


def test_auth_workflow(client: TestClient):
    # 1. Register child user
    reg_payload = {
        "name": "Nila",
        "email": "nila@example.com",
        "password": "strongpassword123",
        "role": "child",
        "age": 7
    }
    res = client.post("/auth/register", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["name"] == "Nila"
    token = data["access_token"]

    # 2. Login
    login_res = client.post("/auth/login", json={
        "email": "nila@example.com",
        "password": "strongpassword123"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # 3. Get /auth/me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "nila@example.com"


def test_content_endpoints(client: TestClient):
    # Lessons
    res = client.get("/lessons")
    assert res.status_code == 200
    lessons = res.json()
    assert len(lessons) == 15

    # Filter lessons by unit
    unit1_res = client.get("/lessons?unit=1")
    assert unit1_res.status_code == 200
    assert len(unit1_res.json()) == 5

    # Specific lesson
    lesson1_res = client.get(f"/lessons/{lessons[0]['id']}")
    assert lesson1_res.status_code == 200
    assert lesson1_res.json()["title"] == lessons[0]["title"]

    # Letters
    letters_res = client.get("/letters")
    assert letters_res.status_code == 200
    letters = letters_res.json()
    assert len(letters) == 30

    uyir_res = client.get("/letters?category=uyir")
    assert uyir_res.status_code == 200
    assert len(uyir_res.json()) == 12

    # Words
    words_res = client.get("/words")
    assert words_res.status_code == 200
    assert len(words_res.json()) == 20


def test_attempts_and_gamification(client: TestClient, test_child_token: str, test_child_user):
    headers = {"Authorization": f"Bearer {test_child_token}"}
    attempt_payload = {
        "lesson_id": 1,
        "exercise_type": "speak",
        "skill": "speaking",
        "score": 100.0,
        "is_correct": True,
        "time_spent": 45,
        "letter_id": 1
    }
    res = client.post("/attempts", json=attempt_payload, headers=headers)
    assert res.status_code == 201
    data = res.json()
    assert data["xp_gained"] > 0
    assert data["streak"] >= 1
    assert data["total_xp"] > 0
    # Perfect pronunciation badge should be awarded
    badge_codes = [b["code"] for b in data["new_badges"]]
    assert "perfect_pronunciation" in badge_codes


def test_speech_evaluate_endpoint(client: TestClient):
    fake_audio = io.BytesIO(b"fake wav bytes content")
    files = {"audio_file": ("test.wav", fake_audio, "audio/wav")}
    data = {"target_text": "வணக்கம்"}

    res = client.post("/speech/evaluate", files=files, data=data)
    assert res.status_code == 200
    body = res.json()
    assert body["score"] >= 80.0
    assert body["target_text"] == "வணக்கம்"
    assert len(body["per_word"]) == 1
    assert "feedback_text" in body


def test_chat_with_kili_endpoint(client: TestClient, test_child_token: str):
    headers = {"Authorization": f"Bearer {test_child_token}"}
    chat_payload = {
        "message": "வணக்கம் கிளி!",
        "topic": "General Conversation"
    }
    res = client.post("/chat", json=chat_payload, headers=headers)
    assert res.status_code == 200
    body = res.json()
    assert "reply_tamil" in body
    assert "reply_translit" in body
    assert "reply_english" in body
    assert len(body["suggested_replies"]) >= 2


def test_progress_endpoint(client: TestClient, test_child_user, test_child_token):
    # Submit an attempt first
    headers = {"Authorization": f"Bearer {test_child_token}"}
    client.post("/attempts", json={
        "lesson_id": 1,
        "exercise_type": "listen",
        "skill": "listening",
        "score": 90.0,
        "is_correct": True,
        "time_spent": 30,
        "letter_id": 1
    }, headers=headers)

    res = client.get(f"/progress/{test_child_user.id}")
    assert res.status_code == 200
    data = res.json()
    assert data["user_id"] == test_child_user.id
    assert "skill_scores" in data
    assert data["skill_scores"]["listening"] == 90.0
    assert data["overall_fluency_score"] > 0.0
    assert "letters_mastery_map" in data
    assert "engagement" in data


def test_parent_report_and_goal(client: TestClient, test_child_user, test_parent_user, test_parent_token):
    # Parent report
    res = client.get(f"/parent/report/{test_child_user.id}")
    assert res.status_code == 200
    data = res.json()
    assert data["child_name"] == test_child_user.name
    assert "weekly_summary" in data
    assert "weak_areas" in data
    assert "recommended_next_lessons" in data

    # Set parent goal
    headers = {"Authorization": f"Bearer {test_parent_token}"}
    goal_res = client.post("/parent/goal", json={
        "child_id": test_child_user.id,
        "daily_minutes_goal": 25
    }, headers=headers)
    assert goal_res.status_code == 200
    assert goal_res.json()["daily_minutes_goal"] == 25


def test_review_today_endpoint(client: TestClient, test_child_token: str):
    headers = {"Authorization": f"Bearer {test_child_token}"}
    # Submit an attempt for letter 1
    client.post("/attempts", json={
        "lesson_id": 1,
        "exercise_type": "trace",
        "skill": "writing",
        "score": 95.0,
        "is_correct": True,
        "time_spent": 40,
        "letter_id": 1
    }, headers=headers)

    res = client.get("/review/today", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "total_due" in data
    assert "letters" in data
    assert "words" in data
