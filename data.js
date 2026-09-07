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

// ---- 2-set (두벌식) IME key map -------------------------------------------
// The standard 2-set layout used by Microsoft, Google, and most other
// Korean IMEs on QWERTY keyboards. Each Jamo maps to the exact key
// sequence a user types. Compound vowels are typed as the sequence of
// their component keys (e.g. ㅘ = h + k, ㅢ = m + l).
//
// Like a real Korean IME, the number row produces jamo —
// 1=ㅂ 2=ㅈ 3=ㄱ 4=ㄷ 5=ㅅ 6=ㅛ 7=ㅑ 8=ㅐ 9=ㅔ 0=ㅕ — and shift+number
// is what types the actual digit. Tense consonants are typed as their
// base key twice (ㄲ = 3 3, ㅃ = 1 1, …) or with Shift+letter
// (ㄲ = Shift+R, ㅃ = Shift+Q, …) — the same as the MS/Google IMEs.
const KEYS_2SET = {
  // Consonants
  'ㄱ': '3', 'ㄲ': '33', 'ㄴ': 's', 'ㄷ': '4', 'ㄸ': '44', 'ㄹ': 'f',
  'ㅁ': 'a', 'ㅂ': '1', 'ㅃ': '11', 'ㅅ': '5', 'ㅆ': '55', 'ㅇ': 'd',
  'ㅈ': '2', 'ㅉ': '22', 'ㅊ': 'q', 'ㅋ': 'w', 'ㅌ': 'e', 'ㅍ': 'r', 'ㅎ': 't',
  // Vowels
  'ㅏ': 'k', 'ㅐ': 'o', 'ㅑ': 'p', 'ㅒ': 'po', 'ㅓ': 'u', 'ㅔ': 'i',
  'ㅕ': '0', 'ㅖ': '0l', 'ㅗ': 'h', 'ㅘ': 'hk', 'ㅙ': 'ho', 'ㅚ': 'hi',
  'ㅛ': 'y', 'ㅜ': 'n', 'ㅝ': 'nk', 'ㅞ': 'no', 'ㅟ': 'ni', 'ㅠ': 'b',
  'ㅡ': 'm', 'ㅢ': 'ml', 'ㅣ': 'l',
  // Double final (batchim) — typed as its two component keys (ㅂ + ㅅ).
  'ㅄ': '15',
};

// Alternate keys that produce the same Jamo in the standard 2-set layout.
// Two kinds of aliases:
//  - Same-key aliases: ㅎ works on both t and g, ㅛ on both y and 6, etc.
//  - Shift+letter aliases: the MS/Google IMEs let you type tense consonants
//    and two compound vowels with Shift+letter instead of doubled/sequence keys:
//    ㅃ=Shift+Q  ㅉ=Shift+W  ㄸ=Shift+E  ㄲ=Shift+R  ㅆ=Shift+T
//    ㅒ=Shift+O  ㅖ=Shift+P
// Input checking accepts the canonical key or any alias.
const KEY_ALIASES = {
  'ㅊ': ['c'], 'ㅋ': ['z'], 'ㅌ': ['x'], 'ㅍ': ['v'], 'ㅎ': ['g'],
  'ㅛ': ['6'], 'ㅐ': ['8'], 'ㅑ': ['7'], 'ㅔ': ['9'],
  'ㅃ': ['Q'], 'ㅉ': ['W'], 'ㄸ': ['E'], 'ㄲ': ['R'], 'ㅆ': ['T'],
  'ㅒ': ['O'], 'ㅖ': ['P'],
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

// True if `typed` is a valid 2-set key sequence for the Hangul `text`
// (accepts every alias combination, e.g. both "tks" and "gks" for 한,
// both "33" and "R" for ㄲ). Case-sensitive: lowercase = regular key,
// uppercase = Shift+letter (tense consonants / compound vowels).
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
