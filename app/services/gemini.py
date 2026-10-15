import json
import logging
from typing import Dict, Any, List
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

KILI_SYSTEM_PROMPT = """
You are 'Kili' (கிளி), the cheerful, encouraging parrot buddy who helps diaspora children learn Tamil.
Guidelines:
1. Speak simple, warm, child-friendly Tamil.
2. Provide exact Romanized transliteration and a short English translation.
3. Gently correct any errors with encouragement.
4. Keep replies under 40 words.
5. Provide 2-3 short suggested replies for the child to choose next.
6. Return ONLY valid JSON with keys:
   "reply_tamil": "Tamil text",
   "reply_translit": "English transliteration",
   "reply_english": "English meaning",
   "suggested_replies": ["option 1 (translit)", "option 2 (translit)"]
"""

MOCK_TOPIC_REPLIES = {
    "family": {
        "reply_tamil": "அம்மா, அப்பா மிகவும் பாசமானவர்கள்! உனக்கு வீட்டில் யார் ரொம்ப பிடிக்கும்?",
        "reply_translit": "Amma, Appa migavum paasamaanavargal! Unakku veettil yaar romba pidikkum?",
        "reply_english": "Mom and Dad are so loving! Who do you like most at home?",
        "suggested_replies": [
            "அம்மா பிடிக்கும் (Amma pidikkum)",
            "அப்பா பிடிக்கும் (Appa pidikkum)",
            "தம்பி பிடிக்கும் (Thambi pidikkum)"
        ]
    },
    "food": {
        "reply_tamil": "சூடான தோசையும் பழமும் ரொம்ப ருசி! உனக்கு இன்று என்ன சாப்பிட ஆசை?",
        "reply_translit": "Soodaana dhosaiyum pazhamum romba rusi! Unakku indru enna saappida aasai?",
        "reply_english": "Hot dosa and fruit are delicious! What would you like to eat today?",
        "suggested_replies": [
            "எனக்கு தோசை வேண்டும் (Enakku dhosai vendum)",
            "எனக்கு பால் பிடிக்கும் (Enakku paal pidikkum)",
            "பழம் சாப்பிடலாம் (Pazham saappidalaam)"
        ]
    },
    "animals": {
        "reply_tamil": "பூனை மியாவ் சொல்லும்! கிளி பேசும்! உனக்கு பூனை பிடிக்குமா அல்லது நாயா?",
        "reply_translit": "Poonai meow sollum! Kili pesum! Unakku poonai pidikkumaa alladhu naayaa?",
        "reply_english": "Cat says meow! Parrot talks! Do you like cats or dogs?",
        "suggested_replies": [
            "எனக்கு பூனை பிடிக்கும் (Enakku poonai pidikkum)",
            "எனக்கு நாய் பிடிக்கும் (Enakku naai pidikkum)",
            "கிளி ரொம்ப அழகு (Kili romba azhagu)"
        ]
    },
    "colors": {
        "reply_tamil": "பச்சை கிளி நான்! வானம் நீல நிறம். உனக்கு பிடித்த நிறம் எது?",
        "reply_translit": "Pachai kili naan! Vaanam neela niram. Unakku piditha niram edhu?",
        "reply_english": "I am a green parrot! The sky is blue. What is your favorite color?",
        "suggested_replies": [
            "சிவப்பு பிடிக்கும் (Sivappu pidikkum)",
            "நீலம் பிடிக்கும் (Neelam pidikkum)",
            "பச்சை பிடிக்கும் (Pachai pidikkum)"
        ]
    }
}

DEFAULT_MOCK_REPLY = {
    "reply_tamil": "வணக்கம் குட்டி நண்பா! நீ அழகாக பேசுகிறாய். இன்று நாம் என்ன பேசலாம்?",
    "reply_translit": "Vanakkam kutti nanbaa! Nee azhagaaga pesugiraay. Indru naam enna pesalaam?",
    "reply_english": "Hello little buddy! You speak beautifully. What shall we talk about today?",
    "suggested_replies": [
        "குடும்பம் பற்றி பேசலாம் (Kudumbam patri pesalaam)",
        "விலங்குகள் பிடிக்கும் (Vilangugal pidikkum)",
        "வணக்கம் கிளி! (Vanakkam Kili!)"
    ]
}


def get_mock_kili_reply(child_message: str, topic: str) -> Dict[str, Any]:
    """Generates an intelligent context-aware mock reply as Kili the parrot."""
    lower_msg = child_message.lower()
    lower_topic = (topic or "").lower()

    if "வணக்கம்" in lower_msg or "hello" in lower_msg or "vanakkam" in lower_msg:
        return {
            "reply_tamil": "வணக்கம்! உன்னை பார்த்ததில் எனக்கு மிக்க மகிழ்ச்சி! நலமா?",
            "reply_translit": "Vanakkam! Unnai paarthadhil enakku mikka magizhchi! Nalamaa?",
            "reply_english": "Hello! I am so happy to see you! How are you?",
            "suggested_replies": [
                "நான் நலம், நன்றி (Naan nalam, nandri)",
                "கிளி எப்படி இருக்கிறாய்? (Kili eppadi irukkiraay?)",
                "விளையாடலாமா? (Vilaiyaadalaamaa?)"
            ]
        }

    for key in ["family", "food", "animals", "colors"]:
        if key in lower_topic or key in lower_msg:
            return MOCK_TOPIC_REPLIES[key]

    return DEFAULT_MOCK_REPLY


async def generate_kili_reply(child_message: str, topic: str = "General Conversation") -> Dict[str, Any]:
    """
    Calls Gemini API to get Kili the parrot's response.
    Falls back seamlessly to intelligent mock responses if no key is configured or on failure.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return get_mock_kili_reply(child_message, topic)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent?key={api_key}"
    prompt = f"""
Topic: {topic}
Child said: "{child_message}"

Reply as Kili the parrot following all system rules. Respond ONLY with valid JSON.
"""
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": f"{KILI_SYSTEM_PROMPT}\n\n{prompt}"}]}
        ],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 300,
            "responseMimeType": "application/json"
        }
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_content)
                if all(k in parsed for k in ["reply_tamil", "reply_translit", "reply_english", "suggested_replies"]):
                    return parsed
    except Exception as e:
        logger.warning(f"Gemini API call failed, falling back to mock: {e}")

    return get_mock_kili_reply(child_message, topic)
