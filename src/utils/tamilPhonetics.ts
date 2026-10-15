// Tamil Phonetics & 247 Letters Generator

export const UYIR_LETTERS = [
  { char: 'அ', translit: 'a', name: 'Agara Uyir', example: 'அம்மா (Amma - Mother)' },
  { char: 'ஆ', translit: 'aa', name: 'Aagara Uyir', example: 'ஆடு (Aadu - Goat)' },
  { char: 'இ', translit: 'i', name: 'Igara Uyir', example: 'இலை (Ilai - Leaf)' },
  { char: 'ஈ', translit: 'ee', name: 'Eegara Uyir', example: 'ஈட்டி (Eetti - Spear)' },
  { char: 'உ', translit: 'u', name: 'Ugara Uyir', example: 'உரல் (Ural - Mortar)' },
  { char: 'ஊ', translit: 'oo', name: 'Oogara Uyir', example: 'ஊஞ்சல் (Oonjal - Swing)' },
  { char: 'எ', translit: 'e', name: 'Egara Uyir', example: 'எறும்பு (Erumbu - Ant)' },
  { char: 'ஏ', translit: 'ae', name: 'Aegara Uyir', example: 'ஏணி (Aeni - Ladder)' },
  { char: 'ஐ', translit: 'ai', name: 'Aigara Uyir', example: 'ஐந்து (Ainthu - Five)' },
  { char: 'ஒ', translit: 'o', name: 'Ogara Uyir', example: 'ஒட்டகம் (Ottagam - Camel)' },
  { char: 'ஓ', translit: 'oa', name: 'Oagara Uyir', example: 'ஓடம் (Oadam - Boat)' },
  { char: 'ஔ', translit: 'au', name: 'Augara Uyir', example: 'ஔவையார் (Avvaiyar - Poetess)' },
];

export const AYUTHAM = { char: 'ஃ', translit: 'ak', name: 'Ayutha Ezhuthu', example: 'எஃகு (Ehgu - Steel)' };

export const MEI_LETTERS = [
  { char: 'க்', translit: 'ik', base: 'க', translitBase: 'k' },
  { char: 'ங்', translit: 'ing', base: 'ங', translitBase: 'ng' },
  { char: 'ச்', translit: 'ich', base: 'ச', translitBase: 'ch' },
  { char: 'ஞ்', translit: 'inj', base: 'ஞ', translitBase: 'nj' },
  { char: 'ட்', translit: 'it', base: 'ட', translitBase: 't' },
  { char: 'ண்', translit: 'inn', base: 'ண', translitBase: 'N' },
  { char: 'த்', translit: 'ith', base: 'த', translitBase: 'th' },
  { char: 'ந்', translit: 'inth', base: 'ந', translitBase: 'n' },
  { char: 'ப்', translit: 'ip', base: 'ப', translitBase: 'p' },
  { char: 'ம்', translit: 'im', base: 'ம', translitBase: 'm' },
  { char: 'ய்', translit: 'iy', base: 'ய', translitBase: 'y' },
  { char: 'ர்', translit: 'ir', base: 'ர', translitBase: 'r' },
  { char: 'ல்', translit: 'il', base: 'ல', translitBase: 'l' },
  { char: 'வ்', translit: 'iv', base: 'வ', translitBase: 'v' },
  { char: 'ழ்', translit: 'izh', base: 'ழ', translitBase: 'zh' },
  { char: 'ள்', translit: 'ill', base: 'ள', translitBase: 'L' },
  { char: 'ற்', translit: 'itr', base: 'ற', translitBase: 'R' },
  { char: 'ன்', translit: 'in', base: 'ன', translitBase: 'n2' },
];

// Vowel signs mapping to combine with base consonants
// அ='', ஆ='ா', இ='ி', ஈ='ீ', உ='ு', ஊ='ூ', எ='ெ', ஏ='ே', ஐ='ை', ஒ='ொ', ஓ='ோ', ஔ='ௌ'
const VOWEL_SIGNS = [
  { sign: '', translit: 'a' },
  { sign: 'ா', translit: 'aa' },
  { sign: 'ி', translit: 'i' },
  { sign: 'ீ', translit: 'ee' },
  { sign: 'ு', translit: 'u' },
  { sign: 'ூ', translit: 'oo' },
  { sign: 'ெ', translit: 'e' },
  { sign: 'ே', translit: 'ae' },
  { sign: 'ை', translit: 'ai' },
  { sign: 'ொ', translit: 'o' },
  { sign: 'ோ', translit: 'oa' },
  { sign: 'ௌ', translit: 'au' },
];

export interface FullTamilLetter {
  char: string;
  category: 'uyir' | 'mei' | 'uyirmei' | 'ayutham';
  translit: string;
  meiBase?: string;
  uyirVowel?: string;
}

// Generate the complete set of 247 letters
export function generate247Letters(): FullTamilLetter[] {
  const letters: FullTamilLetter[] = [];

  // 12 Uyir
  for (const u of UYIR_LETTERS) {
    letters.push({
      char: u.char,
      category: 'uyir',
      translit: u.translit,
    });
  }

  // 1 Ayutham
  letters.push({
    char: AYUTHAM.char,
    category: 'ayutham',
    translit: AYUTHAM.translit,
  });

  // 18 Mei
  for (const m of MEI_LETTERS) {
    letters.push({
      char: m.char,
      category: 'mei',
      translit: m.translit,
    });
  }

  // 216 Uyirmei (18 Mei x 12 Vowels)
  for (const m of MEI_LETTERS) {
    for (let i = 0; i < VOWEL_SIGNS.length; i++) {
      const v = VOWEL_SIGNS[i];
      const uyir = UYIR_LETTERS[i];
      let combinedChar = '';

      // Special rendering rules in Tamil Unicode:
      // Combining base consonant with vowel sign
      // (JavaScript string concatenation of base + sign works perfectly in modern UTF-8)
      if (i === 0) {
        combinedChar = m.base;
      } else {
        combinedChar = m.base + v.sign;
      }

      letters.push({
        char: combinedChar,
        category: 'uyirmei',
        translit: `${m.translitBase}${v.translit}`,
        meiBase: m.char,
        uyirVowel: uyir.char,
      });
    }
  }

  return letters;
}

// Simple Levenshtein distance for speech evaluation
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.trim().toLowerCase();
  const s2 = str2.trim().toLowerCase();
  if (s1 === s2) return 1.0;
  if (!s1.length) return 0.0;
  if (!s2.length) return 0.0;

  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, 1 - distance / maxLen);
}
