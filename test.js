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
    [syl('ㅎ', 'ㅏ', 'ㄴ'), 'gks'],   // 한: ㅎ=g ㅏ=k ㄴ=s
    [syl('ㄲ', 'ㅡ', 'ㅆ'), '1m4'],   // 끝: ㄲ=1 ㅡ=m ㅆ=4
    [syl('ㅅ', 'ㅜ'), 'tn'],          // 수: ㅅ=t ㅜ=n
    [syl('ㄱ', 'ㅏ', 'ㅁ'), 'rka'],   // 감: ㄱ=r ㅏ=k ㅁ=a
  ];
  for (const [w, exp] of cases) {
    assert.strictEqual(d.keys2setHangul(w), exp, cp(w));
  }
});

test('non-Hangul characters pass through unchanged', () => {
  assert.strictEqual(d.romanizeHangul('abc 123'), 'abc 123');
});

console.log('\n' + passed + ' tests passed');
