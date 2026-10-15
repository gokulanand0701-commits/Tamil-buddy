import { LetterItem } from '../types';

export const MOCK_LETTERS: LetterItem[] = [
  // 12 Uyir Letters
  {
    id: 1,
    tamil_char: 'அ',
    category: 'uyir',
    transliteration: 'a',
    meaning: 'Short vowel "a" as in "America"',
    audio_url: '',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,40 C 55,20 85,25 85,50 C 85,75 50,75 40,60',
        'M 40,60 C 30,45 60,35 70,50 L 120,50',
        'M 120,20 L 120,85'
      ],
      guidePoints: [
        { x: 40, y: 40, label: '1' },
        { x: 85, y: 50, label: '2' },
        { x: 70, y: 50, label: '3' },
        { x: 120, y: 20, label: '4' },
        { x: 120, y: 85, label: '5' }
      ]
    }),
    example_word: {
      tamil: 'அம்மா',
      translit: 'Amma',
      meaning: 'Mother'
    }
  },
  {
    id: 2,
    tamil_char: 'ஆ',
    category: 'uyir',
    transliteration: 'aa',
    meaning: 'Long vowel "aa" as in "Father"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,40 C 55,20 85,25 85,50 C 85,75 50,75 40,60',
        'M 40,60 C 30,45 60,35 70,50 L 120,50',
        'M 120,20 L 120,85',
        'M 120,85 C 135,85 145,70 145,55'
      ],
      guidePoints: [
        { x: 40, y: 40, label: '1' },
        { x: 120, y: 20, label: '2' },
        { x: 145, y: 55, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'ஆடு',
      translit: 'Aadu',
      meaning: 'Goat'
    }
  },
  {
    id: 3,
    tamil_char: 'இ',
    category: 'uyir',
    transliteration: 'i',
    meaning: 'Short vowel "i" as in "bit"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 45,35 C 70,20 95,35 95,60',
        'M 95,60 C 95,85 65,85 55,70',
        'M 55,70 C 45,90 70,100 95,100'
      ],
      guidePoints: [
        { x: 45, y: 35, label: '1' },
        { x: 95, y: 60, label: '2' },
        { x: 95, y: 100, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'இலை',
      translit: 'Ilai',
      meaning: 'Leaf'
    }
  },
  {
    id: 4,
    tamil_char: 'ஈ',
    category: 'uyir',
    transliteration: 'ee',
    meaning: 'Long vowel "ee" as in "seed"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,25 L 40,95',
        'M 40,25 L 90,25',
        'M 90,25 L 90,95',
        'M 60,55 A 4,4 0 1,0 60,56',
        'M 75,55 A 4,4 0 1,0 75,56'
      ],
      guidePoints: [
        { x: 40, y: 25, label: '1' },
        { x: 90, y: 25, label: '2' },
        { x: 60, y: 55, label: '3' },
        { x: 75, y: 55, label: '4' }
      ]
    }),
    example_word: {
      tamil: 'ஈட்டி',
      translit: 'Eetti',
      meaning: 'Spear'
    }
  },
  {
    id: 5,
    tamil_char: 'உ',
    category: 'uyir',
    transliteration: 'u',
    meaning: 'Short vowel "u" as in "put"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,40 C 60,25 85,35 85,55',
        'M 85,55 L 85,90',
        'M 85,90 L 125,90'
      ],
      guidePoints: [
        { x: 40, y: 40, label: '1' },
        { x: 85, y: 55, label: '2' },
        { x: 125, y: 90, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'உரல்',
      translit: 'Ural',
      meaning: 'Mortar'
    }
  },
  {
    id: 6,
    tamil_char: 'ஊ',
    category: 'uyir',
    transliteration: 'oo',
    meaning: 'Long vowel "oo" as in "moon"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,40 C 60,25 85,35 85,55 L 85,90 L 125,90',
        'M 135,45 C 135,30 160,30 160,55 L 160,90'
      ],
      guidePoints: [
        { x: 40, y: 40, label: '1' },
        { x: 125, y: 90, label: '2' },
        { x: 135, y: 45, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'ஊஞ்சல்',
      translit: 'Oonjal',
      meaning: 'Swing'
    }
  },
  {
    id: 7,
    tamil_char: 'எ',
    category: 'uyir',
    transliteration: 'e',
    meaning: 'Short vowel "e" as in "bet"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,60 C 40,35 65,35 75,50',
        'M 75,50 L 75,95',
        'M 75,70 L 115,70'
      ],
      guidePoints: [
        { x: 40, y: 60, label: '1' },
        { x: 75, y: 50, label: '2' },
        { x: 115, y: 70, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'எறும்பு',
      translit: 'Erumbu',
      meaning: 'Ant'
    }
  },
  {
    id: 8,
    tamil_char: 'ஏ',
    category: 'uyir',
    transliteration: 'ae',
    meaning: 'Long vowel "ae" as in "gate"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,60 C 40,35 65,35 75,50 L 75,95',
        'M 75,70 L 115,70',
        'M 75,95 L 50,115'
      ],
      guidePoints: [
        { x: 40, y: 60, label: '1' },
        { x: 115, y: 70, label: '2' },
        { x: 50, y: 115, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'ஏணி',
      translit: 'Aeni',
      meaning: 'Ladder'
    }
  },
  {
    id: 9,
    tamil_char: 'ஐ',
    category: 'uyir',
    transliteration: 'ai',
    meaning: 'Diphthong "ai" as in "eye"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,70 C 35,50 55,45 65,60',
        'M 65,60 C 75,45 95,50 90,70',
        'M 90,70 L 90,95 C 90,110 115,110 115,95'
      ],
      guidePoints: [
        { x: 40, y: 70, label: '1' },
        { x: 65, y: 60, label: '2' },
        { x: 115, y: 95, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'ஐந்து',
      translit: 'Ainthu',
      meaning: 'Five'
    }
  },
  {
    id: 10,
    tamil_char: 'ஒ',
    category: 'uyir',
    transliteration: 'o',
    meaning: 'Short vowel "o" as in "hot"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,60 C 35,45 55,40 65,55',
        'M 65,55 C 75,40 95,45 90,65',
        'M 90,65 C 80,85 60,85 50,95 L 100,95'
      ],
      guidePoints: [
        { x: 40, y: 60, label: '1' },
        { x: 90, y: 65, label: '2' },
        { x: 100, y: 95, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'ஒட்டகம்',
      translit: 'Ottagam',
      meaning: 'Camel'
    }
  },
  {
    id: 11,
    tamil_char: 'ஓ',
    category: 'uyir',
    transliteration: 'oa',
    meaning: 'Long vowel "oa" as in "boat"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,60 C 35,45 55,40 65,55 C 75,40 95,45 90,65 C 80,85 60,85 50,95 L 100,95',
        'M 100,95 C 110,95 115,85 110,75'
      ],
      guidePoints: [
        { x: 40, y: 60, label: '1' },
        { x: 100, y: 95, label: '2' },
        { x: 110, y: 75, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'ஓடம்',
      translit: 'Oadam',
      meaning: 'Boat'
    }
  },
  {
    id: 12,
    tamil_char: 'ஔ',
    category: 'uyir',
    transliteration: 'au',
    meaning: 'Diphthong "au" as in "cow"',
    stroke_data_json: JSON.stringify({
      strokes: [
        'M 40,60 C 35,45 55,40 65,55 C 75,40 95,45 90,65 C 80,85 60,85 50,95 L 100,95',
        'M 125,60 C 125,50 145,50 145,70 L 145,95 L 165,95'
      ],
      guidePoints: [
        { x: 40, y: 60, label: '1' },
        { x: 100, y: 95, label: '2' },
        { x: 125, y: 60, label: '3' }
      ]
    }),
    example_word: {
      tamil: 'ஔவையார்',
      translit: 'Avvaiyar',
      meaning: 'Famous ancient Tamil poetess'
    }
  },

  // Mei Letters (First 6 seeded for exercise matching)
  {
    id: 13,
    tamil_char: 'க்',
    category: 'mei',
    transliteration: 'ik',
    meaning: 'Consonant sound "k" with pulli dot',
    example_word: { tamil: 'கொக்கு', translit: 'Kokku', meaning: 'Crane / Stork' }
  },
  {
    id: 14,
    tamil_char: 'ங்',
    category: 'mei',
    transliteration: 'ing',
    meaning: 'Nasal sound "ng" as in "sing"',
    example_word: { tamil: 'சிங்கம்', translit: 'Singam', meaning: 'Lion' }
  },
  {
    id: 15,
    tamil_char: 'ச்',
    category: 'mei',
    transliteration: 'ich',
    meaning: 'Consonant sound "ch" as in "chair"',
    example_word: { tamil: 'பச்சை', translit: 'Pachai', meaning: 'Green' }
  },
  {
    id: 16,
    tamil_char: 'ஞ்',
    category: 'mei',
    transliteration: 'inj',
    meaning: 'Nasal sound "nj" as in "canyon"',
    example_word: { tamil: 'மஞ்சள்', translit: 'Manjal', meaning: 'Yellow' }
  },
  {
    id: 17,
    tamil_char: 'ட்',
    category: 'mei',
    transliteration: 'it',
    meaning: 'Retroflex consonant sound "T"',
    example_word: { tamil: 'பட்டம்', translit: 'Pattam', meaning: 'Kite' }
  },
  {
    id: 18,
    tamil_char: 'ண்',
    category: 'mei',
    transliteration: 'inn',
    meaning: 'Retroflex nasal sound "N"',
    example_word: { tamil: 'கண்', translit: 'Kann', meaning: 'Eye' }
  }
];
