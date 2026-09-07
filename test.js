/*
 * Regression tests for the romanization engine + Jamo data.
 * Run: node test.js
 *
 * Covers the bug class where a syllable-block ordering table silently
 * disagrees with the Unicode block (e.g. FINAL_ORDER once listed ㅀ (lh)
 * at position 16 instead of ㅁ, which made 감 romanize as "gal" instead
 * of "gam").
 *
 * Test syllables are *built from Jamo* via the verified block layout
 * (see syl()) rather than hand-typed, so the suite never depends on which
 * code point a typed glyph resolves to.
 */
'use strict';
const assert = require('assert');
const d = require('./data.js');

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log('ok ' + passed + ' - ' + name);
}

// Build a composed Hangul syllable from Jamo using the block layout.
// (The ordering tables themselves are independently verified by the
// 11,172 round-trip test below, so this is a sound construction.)
function syl(initial, vowel, final) {
  const ii = d.INITIAL_ORDER.indexOf(initial);
  const vi = d.VOWEL_ORDER.indexOf(vowel);
  const fi = final ? d.FINAL_ORDER.indexOf(final) : 0;
  return String.fromCodePoint(0xac00 + ii * 588 + vi * 28 + fi);
}

const cp = (ch) => 'U+' + ch.codePointAt(0).toString(16).toUpperCase();

test('JAMO: 40 entries (19 consonants + 21 vowels)', () => {
  assert.strictEqual(d.JAMO.length, 40);
  assert.strictEqual(d.JAMO.filter((j) => j.type === 'consonant').length, 19);
  assert.strictEqual(d.JAMO.filter((j) => j.type === 'vowel').length, 21);
});

test('every Jamo has a romanization, a 2-set key, and a hint', () => {
  for (const j of d.JAMO) {
    assert.ok(j.roman, 'missing roman for ' + j.char);
    assert.ok(d.KEYS_2SET[j.char], 'missing 2-set key for ' + j.char);
    assert.ok(j.hint, 'missing hint for ' + j.char);
  }
});

test('JAMO romanizations match the official tables', () => {
  for (const j of d.JAMO) {
    if (j.type === 'consonant') {
      // Consonants are taught with their initial value; ㅇ is taught as "ng".
      assert.strictEqual(j.roman, j.char === 'ㅇ' ? 'ng' : d.INITIAL[j.char], j.char);
    } else {
      assert.strictEqual(j.roman, d.VOWELS[j.char], j.char);
    }
  }
});

test('tables match the official 2000 standard values', () => {
  const INIT = {
    'ㄱ': 'g', 'ㄲ': 'kk', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄸ': 'tt', 'ㄹ': 'r',
    'ㅁ': 'm', 'ㅂ': 'b', 'ㅃ': 'pp', 'ㅅ': 's', 'ㅆ': 'ss', 'ㅇ': '',
    'ㅈ': 'j', 'ㅉ': 'jj', 'ㅊ': 'ch', 'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
  };
  const VOW = {
    'ㅏ': 'a', 'ㅐ': 'ae', 'ㅑ': 'ya', 'ㅒ': 'yae', 'ㅓ': 'eo', 'ㅔ': 'e',
    'ㅕ': 'yeo', 'ㅖ': 'ye', 'ㅗ': 'o', 'ㅘ': 'wa', 'ㅙ': 'wae', 'ㅚ': 'oe',
    'ㅛ': 'yo', 'ㅜ': 'u', 'ㅝ': 'wo', 'ㅞ': 'we', 'ㅟ': 'wi', 'ㅠ': 'yu',
    'ㅡ': 'eu', 'ㅢ': 'ui', 'ㅣ': 'i',
  };
  const FIN = {
    'ㄱ': 'k', 'ㄲ': 'kk', 'ㄳ': 'ks', 'ㄴ': 'n', 'ㄵ': 'nj', 'ㄶ': 'nh',
    'ㄷ': 't', 'ㄸ': 'tt', 'ㄹ': 'l', 'ㄺ': 'lk', 'ㄻ': 'lm', 'ㄼ': 'lb',
    'ㄽ': 'ls', 'ㄾ': 'lt', 'ㄿ': 'lp', 'ㅁ': 'm', 'ㅂ': 'p', 'ㅄ': 'bs',
    'ㅅ': 't', 'ㅆ': 't', 'ㅇ': 'ng', 'ㅈ': 't', 'ㅊ': 't', 'ㅋ': 'k',
    'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 't',
  };
  assert.deepStrictEqual(d.INITIAL, INIT);
  assert.deepStrictEqual(d.VOWELS, VOW);
  assert.deepStrictEqual(d.FINAL, FIN);
});

test('ordering tables match the Unicode syllable block (11,172 round-trips)', () => {
  for (let i = 0; i < 11172; i++) {
    const ch = String.fromCodePoint(0xac00 + i);
    const p = d.decomposeSyllable(ch);
    const ii = d.INITIAL_ORDER.indexOf(p.initial);
    const vi = d.VOWEL_ORDER.indexOf(p.vowel);
    const fi = p.final ? d.FINAL_ORDER.indexOf(p.final) : 0;
    assert.ok(ii >= 0 && vi >= 0 && fi >= 0, 'unknown jamo in ' + ch);
    assert.strictEqual(
      ii * 588 + vi * 28 + fi, i,
      'index mismatch at U+' + (0xac00 + i).toString(16).toUpperCase()
    );
  }
});

test('known syllables decompose to the expected Jamo', () => {
  const cases = [
    [syl('ㄱ', 'ㅏ', 'ㅁ'), 'ㄱ', 'ㅏ', 'ㅁ'],  // 감
    [syl('ㅎ', 'ㅏ', 'ㄴ'), 'ㅎ', 'ㅏ', 'ㄴ'],  // 한
    [syl('ㄷ', 'ㅗ', 'ㅇ'), 'ㄷ', 'ㅗ', 'ㅇ'],  // 동
    [syl('ㅅ', 'ㅜ'), 'ㅅ', 'ㅜ', null],        // 수
    [syl('ㅇ', 'ㅢ'), 'ㅇ', 'ㅢ', null],        // 의
  ];
  for (const [ch, init, vow, fin] of cases) {
    assert.deepStrictEqual(
      d.decomposeSyllable(ch),
      { initial: init, vowel: vow, final: fin },
      cp(ch)
    );
  }
});

test('romanization of known syllables (official 2000 standard)', () => {
  const cases = [
    [syl('ㅎ', 'ㅏ', 'ㄴ'), 'han'],      // 한
    [syl('ㄷ', 'ㅗ', 'ㅇ'), 'dong'],     // 동
    [syl('ㅂ', 'ㅣ', 'ㅆ'), 'bit'],       // 빛
    [syl('ㄲ', 'ㅡ', 'ㅆ'), 'kkeut'],     // 끝
    [syl('ㄲ', 'ㅗ', 'ㅆ'), 'kkot'],      // 꽃
    [syl('ㅃ', 'ㅏ', 'ㅇ'), 'ppang'],     // 빵
    [syl('ㅇ', 'ㅢ'), 'ui'],             // 의
    [syl('ㄱ', 'ㅏ', 'ㅁ'), 'gam'],      // 감
    [syl('ㄱ', 'ㅏ', 'ㅄ'), 'gabs'],     // 값
  ];
  for (const [w, exp] of cases) {
    assert.strictEqual(d.romanizeHangul(w), exp, cp(w));
  }
});

test('2-set keys for known syllables', () => {
  const cases = [
    [syl('ㅎ', 'ㅏ', 'ㄴ'), 'tks'],   // 한: ㅎ=t ㅏ=k ㄴ=s
    [syl('ㄲ', 'ㅡ', 'ㅆ'), '33m55'], // 끝: ㄲ=33 ㅡ=m ㅆ=55
    [syl('ㅅ', 'ㅜ'), '5n'],          // 수: ㅅ=5 ㅜ=n
    [syl('ㄱ', 'ㅏ', 'ㅁ'), '3ka'],   // 감: ㄱ=3 ㅏ=k ㅁ=a
  ];
  for (const [w, exp] of cases) {
    assert.strictEqual(d.keys2setHangul(w), exp, cp(w));
  }
});

test('2-set number row produces ㅂ ㅈ ㄱ ㄷ ㅅ; tense jamo are doubled keys', () => {
  // In a real Korean IME the number row types jamo; shift+number types digits.
  const numRow = { '1': 'ㅂ', '2': 'ㅈ', '3': 'ㄱ', '4': 'ㄷ', '5': 'ㅅ' };
  for (const [key, jamo] of Object.entries(numRow)) {
    assert.strictEqual(d.KEYS_2SET[jamo], key, jamo);
  }
  assert.strictEqual(d.KEYS_2SET['ㄲ'], '33');
  assert.strictEqual(d.KEYS_2SET['ㄸ'], '44');
  assert.strictEqual(d.KEYS_2SET['ㅃ'], '11');
  assert.strictEqual(d.KEYS_2SET['ㅆ'], '55');
  assert.strictEqual(d.KEYS_2SET['ㅉ'], '22');
  // Vowels shared with the number row keep their letter key as canonical.
  assert.strictEqual(d.KEYS_2SET['ㅛ'], 'y');
  assert.deepStrictEqual(d.KEY_ALIASES['ㅛ'], ['6']);
  assert.strictEqual(d.KEYS_2SET['ㅕ'], '0'); // ㅕ lives only on the 0 key
});

test('matches2set accepts canonical and alias key sequences', () => {
  const han = syl('ㅎ', 'ㅏ', 'ㄴ');     // 한: t/g + k + s
  assert.ok(d.matches2set(han, 'tks'));
  assert.ok(d.matches2set(han, 'gks'));
  assert.ok(!d.matches2set(han, 'gkk'));
  assert.ok(!d.matches2set(han, 'tksa')); // trailing junk
  const kkeut = syl('ㄲ', 'ㅡ', 'ㅆ');   // 끝: 33 + m + 55
  assert.ok(d.matches2set(kkeut, '33m55'));
  assert.ok(!d.matches2set(kkeut, '3m55')); // ㄲ must be doubled
  const yeo = syl('ㅇ', 'ㅕ');           // 여: d + 0
  assert.ok(d.matches2set(yeo, 'd0'));
  assert.ok(!d.matches2set(yeo, 'du'));
  const ye = syl('ㅇ', 'ㅖ');            // 여 (ye): d + 0l (ㅖ = ㅕ+ㅣ = 0+l)
  assert.ok(d.matches2set(ye, 'd0l'));
  const gwa = syl('ㅇ', 'ㅘ');           // 과: d + h + k (ㅏ=k, no alias)
  assert.ok(d.matches2set(gwa, 'dhk'));
  assert.ok(!d.matches2set(gwa, 'dh6'));
});

test('matches2set accepts Shift+letter aliases for tense consonants', () => {
  // Tense consonants: doubled number key OR Shift+letter (MS/Google IME style)
  const ppang = syl('ㅃ', 'ㅏ', 'ㅇ');   // 빵: ㅃ + ㅏ + ㅇ
  assert.ok(d.matches2set(ppang, '11kd')); // ㅃ=11 (doubled)
  assert.ok(d.matches2set(ppang, 'Qkd'));  // ㅃ=Q (Shift+Q)
  assert.ok(!d.matches2set(ppang, 'qkd')); // lowercase q = ㅊ, not ㅃ

  const kkeut = syl('ㄲ', 'ㅡ', 'ㅆ');   // 끝: ㄲ + ㅡ + ㅆ
  assert.ok(d.matches2set(kkeut, '33m55')); // ㄲ=33, ㅆ=55 (doubled)
  assert.ok(d.matches2set(kkeut, 'RmT'));   // ㄲ=R, ㅆ=T (Shift+R, Shift+T)
  assert.ok(d.matches2set(kkeut, '33mT'));  // mixed: ㄲ=33, ㅆ=T
  assert.ok(!d.matches2set(kkeut, 'rmT'));  // lowercase r = ㅍ, not ㄲ

  const ttok = syl('ㄸ', 'ㅗ', 'ㄱ');     // 특: ㄸ + ㅗ + ㄱ
  assert.ok(d.matches2set(ttok, '44h3'));  // ㄸ=44 (doubled)
  assert.ok(d.matches2set(ttok, 'Eh3'));   // ㄸ=E (Shift+E)

  const jjak = syl('ㅉ', 'ㅏ', 'ㄱ');     // 적: ㅉ + ㅏ + ㄱ
  assert.ok(d.matches2set(jjak, '22k3'));  // ㅉ=22 (doubled)
  assert.ok(d.matches2set(jjak, 'Wk3'));   // ㅉ=W (Shift+W)
});

test('matches2set accepts Shift+letter aliases for compound vowels', () => {
  // ㅒ (yae): canonical po, alias O (Shift+O)
  const yae = syl('ㅇ', 'ㅒ');
  assert.ok(d.matches2set(yae, 'dpo'));
  assert.ok(d.matches2set(yae, 'dO'));
  assert.ok(!d.matches2set(yae, 'do')); // lowercase o = ㅐ, not ㅒ

  // ㅖ (ye): canonical 0l, alias P (Shift+P)
  const ye = syl('ㅇ', 'ㅖ');
  assert.ok(d.matches2set(ye, 'd0l'));
  assert.ok(d.matches2set(ye, 'dP'));
  assert.ok(!d.matches2set(ye, 'dp')); // lowercase p = ㅑ, not ㅖ
});

test('matches2set is case-sensitive for regular keys', () => {
  // Lowercase is required for canonical letter keys;
  // uppercase (Shift+letter) is only valid for tense/compound aliases.
  const han = syl('ㅎ', 'ㅏ', 'ㄴ'); // 한: t + k + s
  assert.ok(d.matches2set(han, 'tks'));
  assert.ok(!d.matches2set(han, 'Tks')); // T = ㅆ, not ㅎ
  assert.ok(!d.matches2set(han, 'tKs')); // K = ㅋ, not ㅏ
  assert.ok(!d.matches2set(han, 'tksS')); // S is not a valid key
});

test('non-Hangul characters pass through unchanged', () => {
  assert.strictEqual(d.romanizeHangul('abc 123'), 'abc 123');
});

console.log('\n' + passed + ' tests passed');
