import json
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.models.content import Lesson, Letter, Word
from app.models.gamification import Badge


def seed_database(db: Session):
    # 1. Seed Letters: 12 Uyir + 18 Mei
    uyir_letters = [
        {"tamil_char": "அ", "category": "uyir", "transliteration": "a", "audio_url": "/audio/letters/a.mp3", "stroke_data_json": json.dumps({"strokes": ["M20,50 C30,20 60,20 60,50", "M60,50 C60,80 20,80 20,50", "M40,50 L80,50", "M80,20 L80,80"]})},
        {"tamil_char": "ஆ", "category": "uyir", "transliteration": "aa", "audio_url": "/audio/letters/aa.mp3", "stroke_data_json": json.dumps({"strokes": ["M20,50 C30,20 60,20 60,50", "M60,50 C60,80 20,80 20,50", "M40,50 L80,50", "M80,20 L80,80", "M80,80 C90,80 100,70 100,60"]})},
        {"tamil_char": "இ", "category": "uyir", "transliteration": "i", "audio_url": "/audio/letters/i.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,30 C50,20 70,30 70,50", "M70,50 C70,70 50,70 40,60", "M40,60 C30,75 50,85 70,85"]})},
        {"tamil_char": "ஈ", "category": "uyir", "transliteration": "ee", "audio_url": "/audio/letters/ee.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,20 L30,80", "M30,20 L70,20", "M70,20 L70,80", "M45,50 A2,2 0 1,0 45,51", "M55,50 A2,2 0 1,0 55,51"]})},
        {"tamil_char": "உ", "category": "uyir", "transliteration": "u", "audio_url": "/audio/letters/u.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,30 C50,20 70,30 70,50", "M70,50 L70,80", "M70,80 L100,80"]})},
        {"tamil_char": "ஊ", "category": "uyir", "transliteration": "oo", "audio_url": "/audio/letters/oo.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,30 C50,20 70,30 70,50", "M70,50 L70,80 L100,80", "M110,40 C110,30 130,30 130,50 L130,80"]})},
        {"tamil_char": "எ", "category": "uyir", "transliteration": "e", "audio_url": "/audio/letters/e.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,50 C30,30 50,30 60,40", "M60,40 L60,80", "M60,60 L90,60"]})},
        {"tamil_char": "ஏ", "category": "uyir", "transliteration": "ae", "audio_url": "/audio/letters/ae.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,50 C30,30 50,30 60,40", "M60,40 L60,80", "M60,60 L90,60", "M60,80 L40,95"]})},
        {"tamil_char": "ஐ", "category": "uyir", "transliteration": "ai", "audio_url": "/audio/letters/ai.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,60 C25,40 45,35 55,50", "M55,50 C65,35 85,40 80,60", "M80,60 L80,80 C80,95 100,95 100,80"]})},
        {"tamil_char": "ஒ", "category": "uyir", "transliteration": "o", "audio_url": "/audio/letters/o.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,50 C25,35 45,30 55,45", "M55,45 C65,30 85,35 80,55", "M80,55 C70,75 50,75 40,85 L85,85"]})},
        {"tamil_char": "ஓ", "category": "uyir", "transliteration": "oa", "audio_url": "/audio/letters/oa.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,50 C25,35 45,30 55,45", "M55,45 C65,30 85,35 80,55", "M80,55 C70,75 50,75 40,85 L85,85", "M85,85 C95,85 100,75 95,65"]})},
        {"tamil_char": "ஔ", "category": "uyir", "transliteration": "au", "audio_url": "/audio/letters/au.mp3", "stroke_data_json": json.dumps({"strokes": ["M30,50 C25,35 45,30 55,45", "M55,45 C65,30 85,35 80,55", "M80,55 C70,75 50,75 40,85 L85,85", "M110,50 C110,40 130,40 130,60 L130,85 L150,85"]})},
    ]

    mei_letters = [
        {"tamil_char": "க்", "category": "mei", "transliteration": "ik", "audio_url": "/audio/letters/ik.mp3", "stroke_data_json": json.dumps({"char": "க்", "dot": [50, 15]})},
        {"tamil_char": "ங்", "category": "mei", "transliteration": "ing", "audio_url": "/audio/letters/ing.mp3", "stroke_data_json": json.dumps({"char": "ங்", "dot": [50, 15]})},
        {"tamil_char": "ச்", "category": "mei", "transliteration": "ich", "audio_url": "/audio/letters/ich.mp3", "stroke_data_json": json.dumps({"char": "ச்", "dot": [50, 15]})},
        {"tamil_char": "ஞ்", "category": "mei", "transliteration": "inj", "audio_url": "/audio/letters/inj.mp3", "stroke_data_json": json.dumps({"char": "ஞ்", "dot": [50, 15]})},
        {"tamil_char": "ட்", "category": "mei", "transliteration": "it", "audio_url": "/audio/letters/it.mp3", "stroke_data_json": json.dumps({"char": "ட்", "dot": [50, 15]})},
        {"tamil_char": "ண்", "category": "mei", "transliteration": "inn", "audio_url": "/audio/letters/inn.mp3", "stroke_data_json": json.dumps({"char": "ண்", "dot": [50, 15]})},
        {"tamil_char": "த்", "category": "mei", "transliteration": "ith", "audio_url": "/audio/letters/ith.mp3", "stroke_data_json": json.dumps({"char": "த்", "dot": [50, 15]})},
        {"tamil_char": "ந்", "category": "mei", "transliteration": "inth", "audio_url": "/audio/letters/inth.mp3", "stroke_data_json": json.dumps({"char": "ந்", "dot": [50, 15]})},
        {"tamil_char": "ப்", "category": "mei", "transliteration": "ip", "audio_url": "/audio/letters/ip.mp3", "stroke_data_json": json.dumps({"char": "ப்", "dot": [50, 15]})},
        {"tamil_char": "ம்", "category": "mei", "transliteration": "im", "audio_url": "/audio/letters/im.mp3", "stroke_data_json": json.dumps({"char": "ம்", "dot": [50, 15]})},
        {"tamil_char": "ய்", "category": "mei", "transliteration": "iy", "audio_url": "/audio/letters/iy.mp3", "stroke_data_json": json.dumps({"char": "ய்", "dot": [50, 15]})},
        {"tamil_char": "ர்", "category": "mei", "transliteration": "ir", "audio_url": "/audio/letters/ir.mp3", "stroke_data_json": json.dumps({"char": "ர்", "dot": [50, 15]})},
        {"tamil_char": "ல்", "category": "mei", "transliteration": "il", "audio_url": "/audio/letters/il.mp3", "stroke_data_json": json.dumps({"char": "ல்", "dot": [50, 15]})},
        {"tamil_char": "வ்", "category": "mei", "transliteration": "iv", "audio_url": "/audio/letters/iv.mp3", "stroke_data_json": json.dumps({"char": "வ்", "dot": [50, 15]})},
        {"tamil_char": "ழ்", "category": "mei", "transliteration": "izh", "audio_url": "/audio/letters/izh.mp3", "stroke_data_json": json.dumps({"char": "ழ்", "dot": [50, 15]})},
        {"tamil_char": "ள்", "category": "mei", "transliteration": "ill", "audio_url": "/audio/letters/ill.mp3", "stroke_data_json": json.dumps({"char": "ள்", "dot": [50, 15]})},
        {"tamil_char": "ற்", "category": "mei", "transliteration": "itr", "audio_url": "/audio/letters/itr.mp3", "stroke_data_json": json.dumps({"char": "ற்", "dot": [50, 15]})},
        {"tamil_char": "ன்", "category": "mei", "transliteration": "in", "audio_url": "/audio/letters/in.mp3", "stroke_data_json": json.dumps({"char": "ன்", "dot": [50, 15]})},
    ]

    for item in uyir_letters + mei_letters:
        existing = db.query(Letter).filter(Letter.tamil_char == item["tamil_char"]).first()
        if not existing:
            db.add(Letter(**item))

    # 2. Seed Words: 20 basic words across 4 categories
    words_data = [
        # Family (5)
        {"tamil": "அம்மா", "transliteration": "Amma", "meaning": "Mother", "category": "family", "audio_url": "/audio/words/amma.mp3", "image_url": "/images/words/mother.png"},
        {"tamil": "அப்பா", "transliteration": "Appa", "meaning": "Father", "category": "family", "audio_url": "/audio/words/appa.mp3", "image_url": "/images/words/father.png"},
        {"tamil": "அண்ணன்", "transliteration": "Annan", "meaning": "Elder Brother", "category": "family", "audio_url": "/audio/words/annan.mp3", "image_url": "/images/words/brother.png"},
        {"tamil": "அக்கா", "transliteration": "Akka", "meaning": "Elder Sister", "category": "family", "audio_url": "/audio/words/akka.mp3", "image_url": "/images/words/sister.png"},
        {"tamil": "தம்பி", "transliteration": "Thambi", "meaning": "Younger Brother", "category": "family", "audio_url": "/audio/words/thambi.mp3", "image_url": "/images/words/younger_brother.png"},

        # Food (5)
        {"tamil": "சோறு", "transliteration": "Soru", "meaning": "Rice", "category": "food", "audio_url": "/audio/words/soru.mp3", "image_url": "/images/words/rice.png"},
        {"tamil": "பால்", "transliteration": "Paal", "meaning": "Milk", "category": "food", "audio_url": "/audio/words/paal.mp3", "image_url": "/images/words/milk.png"},
        {"tamil": "பழம்", "transliteration": "Pazham", "meaning": "Fruit", "category": "food", "audio_url": "/audio/words/pazham.mp3", "image_url": "/images/words/fruit.png"},
        {"tamil": "தண்ணீர்", "transliteration": "Thanneer", "meaning": "Water", "category": "food", "audio_url": "/audio/words/thanneer.mp3", "image_url": "/images/words/water.png"},
        {"tamil": "தோசை", "transliteration": "Dhosai", "meaning": "Dosa", "category": "food", "audio_url": "/audio/words/dhosai.mp3", "image_url": "/images/words/dosa.png"},

        # Animals (5)
        {"tamil": "பூனை", "transliteration": "Poonai", "meaning": "Cat", "category": "animals", "audio_url": "/audio/words/poonai.mp3", "image_url": "/images/words/cat.png"},
        {"tamil": "நாய்", "transliteration": "Naai", "meaning": "Dog", "category": "animals", "audio_url": "/audio/words/naai.mp3", "image_url": "/images/words/dog.png"},
        {"tamil": "யானை", "transliteration": "Yaanai", "meaning": "Elephant", "category": "animals", "audio_url": "/audio/words/yaanai.mp3", "image_url": "/images/words/elephant.png"},
        {"tamil": "கிளி", "transliteration": "Kili", "meaning": "Parrot", "category": "animals", "audio_url": "/audio/words/kili.mp3", "image_url": "/images/words/parrot.png"},
        {"tamil": "மீன்", "transliteration": "Meen", "meaning": "Fish", "category": "animals", "audio_url": "/audio/words/meen.mp3", "image_url": "/images/words/fish.png"},

        # Colors (5)
        {"tamil": "சிவப்பு", "transliteration": "Sivappu", "meaning": "Red", "category": "colors", "audio_url": "/audio/words/sivappu.mp3", "image_url": "/images/words/red.png"},
        {"tamil": "நீலம்", "transliteration": "Neelam", "meaning": "Blue", "category": "colors", "audio_url": "/audio/words/neelam.mp3", "image_url": "/images/words/blue.png"},
        {"tamil": "பச்சை", "transliteration": "Pachai", "meaning": "Green", "category": "colors", "audio_url": "/audio/words/pachai.mp3", "image_url": "/images/words/green.png"},
        {"tamil": "மஞ்சள்", "transliteration": "Manjal", "meaning": "Yellow", "category": "colors", "audio_url": "/audio/words/manjal.mp3", "image_url": "/images/words/yellow.png"},
        {"tamil": "வெள்ளை", "transliteration": "Vellai", "meaning": "White", "category": "colors", "audio_url": "/audio/words/vellai.mp3", "image_url": "/images/words/white.png"},
    ]

    for item in words_data:
        existing = db.query(Word).filter(Word.tamil == item["tamil"]).first()
        if not existing:
            db.add(Word(**item))

    # 3. Seed Lessons: 3 Units, 5 lessons each = 15 lessons
    lessons_data = [
        # Unit 1: First Sounds (Uyir Letters)
        {
            "unit": 1, "order": 1, "title": "The Magic Sounds: அ & ஆ", "type": "letter_intro",
            "content_json": json.dumps({
                "intro": "Welcome to Tamil! Let's discover the first two sweet vowel sounds: short 'a' and long 'aa'.",
                "letters": ["அ", "ஆ"],
                "exercises": [
                    {"type": "listen_select", "prompt": "Listen and find the letter: 'a'", "target": "அ", "options": ["அ", "ஆ", "இ"]},
                    {"type": "trace", "prompt": "Trace the letter 'அ'", "target": "அ"},
                    {"type": "speak", "prompt": "Say 'ஆ' (aa) into the mic!", "target": "ஆ"}
                ]
            })
        },
        {
            "unit": 1, "order": 2, "title": "Breezy Vowels: இ & ஈ", "type": "letter_intro",
            "content_json": json.dumps({
                "intro": "Make a gentle smile and say 'i' and 'ee'. Meet இ and ஈ!",
                "letters": ["இ", "ஈ"],
                "exercises": [
                    {"type": "listen_select", "prompt": "Find 'ee' (ஈ)", "target": "ஈ", "options": ["இ", "ஈ", "உ"]},
                    {"type": "speak", "prompt": "Say 'இ' clearly!", "target": "இ"}
                ]
            })
        },
        {
            "unit": 1, "order": 3, "title": "Round Your Lips: உ & ஊ", "type": "letter_intro",
            "content_json": json.dumps({
                "intro": "Round your lips like whistling: 'u' and 'oo'.",
                "letters": ["உ", "ஊ"],
                "exercises": [
                    {"type": "trace", "prompt": "Trace 'உ'", "target": "உ"},
                    {"type": "speak", "prompt": "Say 'ஊ'", "target": "ஊ"}
                ]
            })
        },
        {
            "unit": 1, "order": 4, "title": "Sing-Along Notes: எ, ஏ, ஐ", "type": "letter_intro",
            "content_json": json.dumps({
                "intro": "Three melodic letters: 'e', 'ae', and 'ai'.",
                "letters": ["எ", "ஏ", "ஐ"],
                "exercises": [
                    {"type": "mcq", "prompt": "Which letter sounds like 'eye'?", "options": ["எ", "ஏ", "ஐ"], "answer": "ஐ"}
                ]
            })
        },
        {
            "unit": 1, "order": 5, "title": "Unit 1 Grand Finale: Uyir Master Quiz", "type": "quiz",
            "content_json": json.dumps({
                "intro": "Show off your vowel power! Test all 12 Uyir letters.",
                "exercises": [
                    {"type": "listen_select", "prompt": "Pick 'ஔ' (au)", "target": "ஔ", "options": ["ஒ", "ஓ", "ஔ"]},
                    {"type": "speak", "prompt": "Pronounce 'அம்மா' starting with 'அ'!", "target": "அம்மா"}
                ]
            })
        },

        # Unit 2: Family & Everyday Words
        {
            "unit": 2, "order": 1, "title": "Our Loving Home: அம்மா & அப்பா", "type": "word_intro",
            "content_json": json.dumps({
                "intro": "Learn the most special words: Mother (Amma) and Father (Appa).",
                "words": ["அம்மா", "அப்பா"],
                "exercises": [
                    {"type": "listen_select", "prompt": "Select 'அம்மா' (Mother)", "target": "அம்மா", "options": ["அம்மா", "அப்பா", "அக்கா"]},
                    {"type": "speak", "prompt": "Say 'அப்பா' with pride!", "target": "அப்பா"}
                ]
            })
        },
        {
            "unit": 2, "order": 2, "title": "Fun with Siblings: அண்ணன், அக்கா, தம்பி", "type": "word_matching",
            "content_json": json.dumps({
                "intro": "Meet brother and sister in Tamil!",
                "words": ["அண்ணன்", "அக்கா", "தம்பி"],
                "exercises": [
                    {"type": "match", "pairs": [["Elder Sister", "அக்கா"], ["Elder Brother", "அண்ணன்"], ["Younger Brother", "தம்பி"]]}
                ]
            })
        },
        {
            "unit": 2, "order": 3, "title": "Delicious Meals: சோறு, பால், தோசை", "type": "speaking",
            "content_json": json.dumps({
                "intro": "What's cooking in the kitchen? Rice, milk, and crispy dosa!",
                "words": ["சோறு", "பால்", "தோசை"],
                "exercises": [
                    {"type": "speak", "prompt": "Order your breakfast: Say 'தோசை'!", "target": "தோசை"},
                    {"type": "listen_select", "prompt": "Which one is 'பால்' (Milk)?", "target": "பால்", "options": ["சோறு", "பால்", "தண்ணீர்"]}
                ]
            })
        },
        {
            "unit": 2, "order": 4, "title": "Refresh & Recharge: பழம் & தண்ணீர்", "type": "listen_select",
            "content_json": json.dumps({
                "intro": "Sweet fruits and cool water keep us strong!",
                "words": ["பழம்", "தண்ணீர்"],
                "exercises": [
                    {"type": "speak", "prompt": "Say 'தண்ணீர்' (Water)", "target": "தண்ணீர்"}
                ]
            })
        },
        {
            "unit": 2, "order": 5, "title": "Unit 2 Dinner Table Quest", "type": "quiz",
            "content_json": json.dumps({
                "intro": "Set the dining table with Tamil words!",
                "exercises": [
                    {"type": "mcq", "prompt": "What does 'சோறு' mean?", "options": ["Milk", "Rice", "Fruit"], "answer": "Rice"}
                ]
            })
        },

        # Unit 3: Animals & Nature
        {
            "unit": 3, "order": 1, "title": "Playful Pets: பூனை & நாய்", "type": "word_intro",
            "content_json": json.dumps({
                "intro": "Meow and Woof! Learn cat and dog in Tamil.",
                "words": ["பூனை", "நாய்"],
                "exercises": [
                    {"type": "speak", "prompt": "Say 'பூனை' (Cat)!", "target": "பூனை"},
                    {"type": "listen_select", "prompt": "Who barks? Select 'நாய்'", "target": "நாய்", "options": ["பூனை", "நாய்", "யானை"]}
                ]
            })
        },
        {
            "unit": 3, "order": 2, "title": "Gentle Giants & Green Friends: யானை & கிளி", "type": "speaking",
            "content_json": json.dumps({
                "intro": "A majestic elephant and your chatty buddy Kili the parrot!",
                "words": ["யானை", "கிளி"],
                "exercises": [
                    {"type": "speak", "prompt": "Greet your mascot: say 'கிளி'!", "target": "கிளி"},
                    {"type": "listen_select", "prompt": "Pick the elephant: 'யானை'", "target": "யானை", "options": ["கிளி", "யானை", "மீன்"]}
                ]
            })
        },
        {
            "unit": 3, "order": 3, "title": "Splash in the Pond: மீன்", "type": "listen_select",
            "content_json": json.dumps({
                "intro": "Watch the fish swim! Learn 'மீன்'.",
                "words": ["மீன்"],
                "exercises": [
                    {"type": "speak", "prompt": "Say 'மீன்' (Fish)", "target": "மீன்"}
                ]
            })
        },
        {
            "unit": 3, "order": 4, "title": "Rainbow Splashes: Colors in Tamil", "type": "flashcard",
            "content_json": json.dumps({
                "intro": "Red, Blue, Green, Yellow and White!",
                "words": ["சிவப்பு", "நீலம்", "பச்சை", "மஞ்சள்", "வெள்ளை"],
                "exercises": [
                    {"type": "mcq", "prompt": "What color is 'பச்சை'?", "options": ["Red", "Green", "Blue"], "answer": "Green"}
                ]
            })
        },
        {
            "unit": 3, "order": 5, "title": "Unit 3 Jungle Safari Quiz", "type": "quiz",
            "content_json": json.dumps({
                "intro": "Spot all animals and colors on safari!",
                "exercises": [
                    {"type": "speak", "prompt": "Say 'பச்சை கிளி' (Green parrot)!", "target": "பச்சை கிளி"}
                ]
            })
        }
    ]

    for item in lessons_data:
        existing = db.query(Lesson).filter(Lesson.unit == item["unit"], Lesson.order == item["order"]).first()
        if not existing:
            db.add(Lesson(**item))

    # 4. Seed Badges: 6 Badges
    badges_data = [
        {
            "code": "first_10_letters",
            "title": "First 10 Letters",
            "description": "Mastered your first 10 Tamil letters!",
            "icon": "letters_10.png",
            "criteria_json": json.dumps({"type": "letters_mastered", "count": 10})
        },
        {
            "code": "streak_7_days",
            "title": "7-Day Streak",
            "description": "Practiced Tamil 7 days in a row!",
            "icon": "fire_streak.png",
            "criteria_json": json.dumps({"type": "streak", "days": 7})
        },
        {
            "code": "chatterbox_5",
            "title": "Chatterbox: 5 conversations",
            "description": "Had 5 fun conversations with Kili the parrot!",
            "icon": "parrot_chat.png",
            "criteria_json": json.dumps({"type": "chat_count", "count": 5})
        },
        {
            "code": "word_explorer",
            "title": "Word Explorer",
            "description": "Learned 10 Tamil words across family and nature!",
            "icon": "explorer_map.png",
            "criteria_json": json.dumps({"type": "words_mastered", "count": 10})
        },
        {
            "code": "perfect_pronunciation",
            "title": "Perfect Pronunciation",
            "description": "Scored 100% on a Tamil speaking exercise!",
            "icon": "golden_mic.png",
            "criteria_json": json.dumps({"type": "perfect_speaking", "score": 100.0})
        },
        {
            "code": "super_learner",
            "title": "Super Learner",
            "description": "Earned 500 XP on your Tamil journey!",
            "icon": "super_star.png",
            "criteria_json": json.dumps({"type": "xp", "amount": 500})
        }
    ]

    for item in badges_data:
        existing = db.query(Badge).filter(Badge.code == item["code"]).first()
        if not existing:
            db.add(Badge(**item))

    db.commit()
    print("Database seeding completed successfully!")


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()


if __name__ == "__main__":
    main()
