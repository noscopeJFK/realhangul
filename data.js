/*
 * Hangul romanization data + engine.
 *
 * Romanization follows the official "Romanization of Korean" standard
 * (Korean Language Act, 2000, enforced 2001) — the same system used on
 * street signs, passports, and maps. Tables verified against
 * korean.go.kr (Ministry of Culture, Sports and Tourism).
 *
 * The core study set is the 40 Jamo (19 consonants + 21 vowels), the
 * building blocks of Hangul — the direct analogue of RealKana's kana.
 */

// ---- Official 2000 tables -------------------------------------------------

// Initial consonants (sound at the start of a syllable).
const INITIAL = {
  'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt', 'ㄹ': 'r',
  'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's', 'ㅆ': 'ss', 'ㅇ': '',
  'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch', 'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
};

// Vowels.
const VOWELS = {
  'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo', 'ㅔ': 'e',
  'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa', 'ㅙ': 'wae', 'ㅚ': 'oe',
  'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo', 'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu',
  'ㅡ': 'eu', 'ㅢ': 'ui', 'ㅣ': 'i',
};

// Final consonants (sound at the end of a syllable).
const FINAL = {
  'ㄱ': 'k', 'ㄲ': 'kk', 'ㄳ': 'ks', 'ㄴ': 'n', 'ㄵ': 'nj', 'ㄶ': 'nh',
  'ㄷ': 't', 'ㄸ': 'tt', 'ㄹ': 'l', 'ㄺ': 'lk', 'ㄻ': 'lm', 'ㄼ': 'lb',
  'ㄽ': 'ls', 'ㄾ': 'lt', 'ㄿ': 'lp', 'ㅀ': 'lh', 'ㅁ': 'm', 'ㅂ': 'p',
  'ㅅ': 't', 'ㅆ': 't', 'ㅇ': 'ng', 'ㅈ': 't', 'ㅊ': 't', 'ㅋ': 'k',
  'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 't',
};

// ---- Study set: the 40 Jamo ----------------------------------------------
// Each entry: { char, roman, type, hint }
// Consonants use their initial (start-of-syllable) value; ㅇ is taught as
// "ng" (its recognizable value, e.g. 강 gang, 동 dong).

const JAMO = [
  // Consonants
  { char: 'ㄱ', roman: 'g',  type: 'consonant', hint: 'as in "go"' },
  { char: 'ㄲ', roman: 'kk', type: 'consonant', hint: 'tense g, as in "kko"' },
  { char: 'ㄴ', roman: 'n',  type: 'consonant', hint: 'as in "no"' },
  { char: 'ㄷ', roman: 'd',  type: 'consonant', hint: 'as in "do"' },
  { char: 'ㄸ', roman: 'tt', type: 'consonant', hint: 'tense d, as in "tto"' },
  { char: 'ㄹ', roman: 'r',  type: 'consonant', hint: 'as in "ro"' },
  { char: 'ㅁ', roman: 'm',  type: 'consonant', hint: 'as in "mo"' },
  { char: 'ㅂ', roman: 'b',  type: 'consonant', hint: 'as in "bo"' },
  { char: 'ㅃ', roman: 'pp', type: 'consonant', hint: 'tense b, as in "ppo"' },
  { char: 'ㅅ', roman: 's',  type: 'consonant', hint: 'as in "so"' },
  { char: 'ㅆ', roman: 'ss', type: 'consonant', hint: 'tense s, as in "sso"' },
  { char: 'ㅇ', roman: 'ng', type: 'consonant', hint: 'silent at start; "ng" as in "gang"' },
  { char: 'ㅈ', roman: 'j',  type: 'consonant', hint: 'as in "jo"' },
  { char: 'ㅉ', roman: 'jj', type: 'consonant', hint: 'tense j, as in "jjo"' },
  { char: 'ㅊ', roman: 'ch', type: 'consonant', hint: 'as in "cho"' },
  { char: 'ㅋ', roman: 'k',  type: 'consonant', hint: 'as in "ko"' },
  { char: 'ㅌ', roman: 't',  type: 'consonant', hint: 'as in "to"' },
  { char: 'ㅍ', roman: 'p',  type: 'consonant', hint: 'as in "po"' },
  { char: 'ㅎ', roman: 'h',  type: 'consonant', hint: 'as in "ho"' },
  // Vowels
  { char: 'ㅏ', roman: 'a',   type: 'vowel', hint: 'as in "father"' },
  { char: 'ㅐ', roman: 'ae',  type: 'vowel', hint: 'as in "air"' },
  { char: 'ㅑ', roman: 'ya',  type: 'vowel', hint: 'as in "yard"' },
  { char: 'ㅒ', roman: 'yae', type: 'vowel', hint: 'as in "yair"' },
  { char: 'ㅓ', roman: 'eo',  type: 'vowel', hint: 'as in "her" (British)' },
  { char: 'ㅔ', roman: 'e',   type: 'vowel', hint: 'as in "they"' },
  { char: 'ㅕ', roman: 'yeo', type: 'vowel', hint: 'as in "yeh"' },
  { char: 'ㅖ', roman: 'ye',  type: 'vowel', hint: 'as in "yeah"' },
  { char: 'ㅗ', roman: 'o',   type: 'vowel', hint: 'as in "go"' },
  { char: 'ㅘ', roman: 'wa',  type: 'vowel', hint: 'as in "wahr"' },
  { char: 'ㅙ', roman: 'wae', type: 'vowel', hint: 'as in "wair"' },
  { char: 'ㅚ', roman: 'oe',  type: 'vowel', hint: 'as in "toe"' },
  { char: 'ㅛ', roman: 'yo',  type: 'vowel', hint: 'as in "yore"' },
  { char: 'ㅜ', roman: 'u',   type: 'vowel', hint: 'as in "rule"' },
  { char: 'ㅝ', roman: 'wo',  type: 'vowel', hint: 'as in "wore"' },
  { char: 'ㅞ', roman: 'we',  type: 'vowel', hint: 'as in "we"' },
  { char: 'ㅟ', roman: 'wi',  type: 'vowel', hint: 'as in "we" (short)' },
  { char: 'ㅠ', roman: 'yu',  type: 'vowel', hint: 'as in "you"' },
  { char: 'ㅡ', roman: 'eu',  type: 'vowel', hint: 'as in "ur" (German)' },
  { char: 'ㅢ', roman: 'ui',  type: 'vowel', hint: 'as in "we" + "i"' },
  { char: 'ㅣ', roman: 'i',   type: 'vowel', hint: 'as in "machine"' },
];

// ---- Romanization engine --------------------------------------------------

// The 19 initial consonants, in syllable-block order.
const INITIAL_ORDER = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
  'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

// The 21 vowels, in syllable-block order.
const VOWEL_ORDER = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ',
  'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ',
];

// Final-consonant order in the syllable block (index 0 = no final).
// Note: ㄳ (ks) exists in the syllable block but not as a standalone modern Jamo.
const FINAL_ORDER = [
  null, 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ',
  'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ',
  'ㅍ', 'ㅎ',
];

// Decompose a single Hangul syllable (U+AC00..U+D7A3) into modern Jamo.
// Returns { initial, vowel, final } where final is null if absent.
function decomposeSyllable(ch) {
  const code = ch.codePointAt(0);
  if (code < 0xac00 || code > 0xd7a3) return null;
  const index = code - 0xac00;
  const initial = Math.floor(index / 588);
  const vowel = Math.floor((index % 588) / 28);
  const final = index % 28; // 0 means no final
  return {
    initial: INITIAL_ORDER[initial],
    vowel: VOWEL_ORDER[vowel],
    final: FINAL_ORDER[final],
  };
}

// Romanize a single Hangul syllable using the official 2000 tables.
function romanizeSyllable(ch) {
  const parts = decomposeSyllable(ch);
  if (!parts) return ch; // not a composed syllable
  return (
    (INITIAL[parts.initial] || '') +
    (VOWELS[parts.vowel] || '') +
    (parts.final ? (FINAL[parts.final] || '') : '')
  );
}

// Romanize an arbitrary Hangul string (word or sentence).
// Non-Hangul characters pass through unchanged.
function romanizeHangul(text) {
  let out = '';
  for (const ch of String(text)) {
    out += romanizeSyllable(ch);
  }
  return out;
}

// ---- 2-set (두벌식) IME key map -------------------------------------------
// The standard 2-set layout used by Microsoft, Google, and most other
// Korean IMEs on QWERTY keyboards. Each Jamo maps to the exact key
// sequence a user types. Compound vowels are typed as the sequence of
// their component keys (e.g. ㅘ = h + k, ㅢ = m + l).
const KEYS_2SET = {
  // Consonants
  'ㄱ': 'r', 'ㄲ': '1', 'ㄴ': 's', 'ㄷ': 'e', 'ㄸ': '2', 'ㄹ': 'f',
  'ㅁ': 'a', 'ㅂ': 'q', 'ㅃ': '3', 'ㅅ': 't', 'ㅆ': '4', 'ㅇ': 'd',
  'ㅈ': 'w', 'ㅉ': '5', 'ㅊ': 'c', 'ㅋ': 'z', 'ㅌ': 'x', 'ㅍ': 'v', 'ㅎ': 'g',
  // Vowels
  'ㅏ': 'k', 'ㅐ': 'o', 'ㅑ': 'i', 'ㅒ': 'io', 'ㅓ': 'j', 'ㅔ': 'p',
  'ㅕ': 'u', 'ㅖ': 'jp', 'ㅗ': 'h', 'ㅘ': 'hk', 'ㅙ': 'ho', 'ㅚ': 'hi',
  'ㅛ': 'y', 'ㅜ': 'n', 'ㅝ': 'nk', 'ㅞ': 'no', 'ㅟ': 'ni', 'ㅠ': 'b',
  'ㅡ': 'm', 'ㅢ': 'ml', 'ㅣ': 'l',
};

// 2-set key sequence for a single Hangul syllable (initial + vowel + final).
function keys2setSyllable(ch) {
  const parts = decomposeSyllable(ch);
  if (!parts) return ch; // not a composed syllable
  let keys = (KEYS_2SET[parts.initial] || '') + (KEYS_2SET[parts.vowel] || '');
  if (parts.final) keys += KEYS_2SET[parts.final] || '';
  return keys;
}

// 2-set key sequence for an arbitrary Hangul string.
function keys2setHangul(text) {
  let out = '';
  for (const ch of String(text)) {
    out += keys2setSyllable(ch);
  }
  return out;
}

// Expose for browser + Node.
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    JAMO, INITIAL, VOWELS, FINAL, KEYS_2SET,
    romanizeHangul, romanizeSyllable, decomposeSyllable,
    keys2setHangul, keys2setSyllable,
  };
}
