from app.services.speech import (
    tokenize_tamil_graphemes,
    grapheme_levenshtein_distance,
    calculate_grapheme_similarity,
    evaluate_tamil_speech
)


def test_tokenize_tamil_graphemes():
    # Pure uyir vowels
    uyir_tokens = tokenize_tamil_graphemes("அஆஇ")
    assert uyir_tokens == ["அ", "ஆ", "இ"]

    # Mei letters with virama (pulli)
    mei_tokens = tokenize_tamil_graphemes("க்ங்")
    assert mei_tokens == ["க்", "ங்"]

    # Uyirmei letters
    uyirmei_tokens = tokenize_tamil_graphemes("கிளி")
    assert uyirmei_tokens == ["கி", "ளி"]

    # Compound word
    compound_tokens = tokenize_tamil_graphemes("அம்மா")
    assert compound_tokens == ["அ", "ம்", "மா"]


def test_grapheme_levenshtein():
    s1 = tokenize_tamil_graphemes("வணக்கம்")
    s2 = tokenize_tamil_graphemes("வணக்கம்")
    assert grapheme_levenshtein_distance(s1, s2) == 0

    s3 = tokenize_tamil_graphemes("வணகம்")  # missing க்
    assert grapheme_levenshtein_distance(s1, s3) == 1


def test_calculate_grapheme_similarity():
    # Identical
    sim_exact = calculate_grapheme_similarity("வணக்கம்", "வணக்கம்")
    assert sim_exact == 1.0

    # Single character difference in 4-grapheme word (வணக்கம் has 4 graphemes: வ, ண, க், க, ம் -> 5 graphemes)
    sim_close = calculate_grapheme_similarity("வணக்கம்", "வணகம்")
    assert sim_close >= 0.75

    # Completely different
    sim_diff = calculate_grapheme_similarity("பூனை", "யானை")
    assert sim_diff < 0.6


def test_evaluate_tamil_speech_mock():
    audio_dummy = b"RIFF....WAVEfmt...."
    res = evaluate_tamil_speech(audio_dummy, target_text="அம்மா")
    
    assert res.score >= 90.0
    assert res.transcript == "அம்மா"
    assert len(res.per_word) == 1
    assert res.per_word[0].word == "அம்மா"
    assert res.per_word[0].status == "correct"
    assert "அருமை" in res.feedback_text
