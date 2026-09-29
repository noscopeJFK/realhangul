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
  'ㄽ': 'ls', 'ㄾ': 'lt', 'ㄿ': 'lp', 'ㅁ': 'm', 'ㅂ': 'p', 'ㅄ': 'bs',
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
  { char: 'ㅟ', roman: 'wi',  type: 'vowel', hint: 'as in "wee"' },
  { char: 'ㅠ', roman: 'yu',  type: 'vowel', hint: 'as in "you"' },
  { char: 'ㅡ', roman: 'eu',  type: 'vowel', hint: 'as in "but" (American)' },
  { char: 'ㅢ', roman: 'ui',  type: 'vowel', hint: 'as in "wee" + "i"' },
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
// Note: ㄳ (ks) and ㅄ (bs) exist in the syllable block but not as standalone
// modern Jamo; ㅀ (lh) is NOT a valid syllable-block final.
const FINAL_ORDER = [
  null, 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ',
  'ㄽ', 'ㄾ', 'ㄿ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ',
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

// ---- IME key map (the layout in 1.png) ------------------------------------
// The Dubeolsik-style (두벌식) layout shown in 1.png — machine-readable
// form in table.csv. Each Jamo maps to the exact key sequence a user
// types. Compound vowels are typed as the sequence of their component
// keys (e.g. ㅘ = h + k, ㅢ = m + l); ㅒ and ㅖ also have direct
// Shift+letter keys (Shift+O, Shift+P).
//
// Tense consonants use Shift+letter (ㄲ = Shift+R, ㅃ = Shift+Q, …);
// the doubled base key is accepted as an alias (ㄲ = r + r). The number
// row types plain digits — no Jamo live on it in this layout.
const KEYS_2SET = {
  // Consonants
  'ㄱ': 'r', 'ㄲ': 'R', 'ㄴ': 's', 'ㄷ': 'e', 'ㄸ': 'E', 'ㄹ': 'f',
  'ㅁ': 'a', 'ㅂ': 'q', 'ㅃ': 'Q', 'ㅅ': 't', 'ㅆ': 'T', 'ㅇ': 'd',
  'ㅈ': 'w', 'ㅉ': 'W', 'ㅊ': 'c', 'ㅋ': 'z', 'ㅌ': 'x', 'ㅍ': 'v', 'ㅎ': 'g',
  // Vowels
  'ㅏ': 'k', 'ㅐ': 'o', 'ㅑ': 'i', 'ㅒ': 'O', 'ㅓ': 'j', 'ㅔ': 'p',
  'ㅕ': 'u', 'ㅖ': 'P', 'ㅗ': 'h', 'ㅘ': 'hk', 'ㅙ': 'ho', 'ㅚ': 'hp',
  'ㅛ': 'y', 'ㅜ': 'n', 'ㅝ': 'hj', 'ㅞ': 'no', 'ㅟ': 'nl', 'ㅠ': 'b',
  'ㅡ': 'm', 'ㅢ': 'ml', 'ㅣ': 'l',
  // Double final (batchim) — typed as its two component keys (ㅂ + ㅅ).
  'ㅄ': 'qt',
};

// Alternate key sequences that produce the same Jamo in this layout.
// Two kinds of aliases:
//  - Doubled-key aliases for tense consonants (ㅃ = q + q, …) — a
//    convenience for learners; the canonical form is Shift+letter.
//  - Component-sequence aliases for ㅒ and ㅖ (ㅒ = i + l, ㅖ = p + l);
//    the canonical form is the direct Shift+O / Shift+P key.
// Input checking accepts the canonical key or any alias.
const KEY_ALIASES = {
  'ㅃ': ['qq'], 'ㅉ': ['ww'], 'ㄸ': ['ee'], 'ㄲ': ['rr'], 'ㅆ': ['tt'],
  'ㅒ': ['il'], 'ㅖ': ['pl'],
};

// All valid 2-set key sequences for one syllable (canonical keys plus
// every alias combination).
function keySequencesSyllable(ch) {
  const parts = decomposeSyllable(ch);
  if (!parts) return [ch]; // not a composed syllable
  const jamo = [parts.initial, parts.vowel];
  if (parts.final) jamo.push(parts.final);
  let out = [''];
  for (const j of jamo) {
    const base = KEYS_2SET[j] || '';
    const alts = KEY_ALIASES[j] || [];
    const opts = [base, ...alts];
    out = out.flatMap((p) => opts.map((k) => p + k));
  }
  return out;
}

// True if `typed` is a valid key sequence for the Hangul `text` in this
// layout (accepts every alias combination, e.g. both "RmT" and "rrmT"
// for 끝). Case-sensitive: lowercase = regular key, uppercase =
// Shift+letter (tense consonants / ㅒ / ㅖ).
function matches2set(text, typed) {
  const t = String(typed).trim();
  const seqs = Array.from(String(text), keySequencesSyllable);
  const ok = (i, rest) => {
    if (i === seqs.length) return rest === '';
    return seqs[i].some((s) => rest.startsWith(s) && ok(i + 1, rest.slice(s.length)));
  };
  return ok(0, t);
}

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
    INITIAL_ORDER, VOWEL_ORDER, FINAL_ORDER,
    romanizeHangul, romanizeSyllable, decomposeSyllable,
    keys2setHangul, keys2setSyllable,
    KEY_ALIASES, keySequencesSyllable, matches2set,
  };
}
