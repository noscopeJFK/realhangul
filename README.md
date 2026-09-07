# realhangul

Hangul training, similar to [realkana](https://github.com/takahirox/realkana).
Open `index.html` in a browser.

## What it teaches

The app focuses on the **jamo** — the 19 consonants and 21 vowels that make up
every Hangul syllable — before moving on to whole words.

- **Learn** — a chart of all 40 jamo. Each card shows the letter, its official
  romanization, its 2-set (두벌식) keyboard key, and a phonetic hint
  (e.g. `ㅏ → a · key k · as in "father"`). Click cards to select a subset,
  then practice just those.
- **Practice** — drills the jamo in two answer modes:
  - **Type the keys** — see the letter and its sound, type the 2-set key(s)
    (the same keys a standard Microsoft/Google Korean IME expects).
  - **Type the romanization** — see the letter and its key, type the official
    romanization.
- **Words** — type the 2-set key sequence for common words.

## Data

Romanization follows the **official 2000 standard**
([한국어 로마자 표기법](https://www.mec.go.kr/eng/board/romanization.jsp)).
Keyboard keys follow the **2-set (두벌식)** layout. The full mapping lives in
`data.js`.

## Files

| File         | Purpose                                             |
| ------------ | --------------------------------------------------- |
| `index.html` | Page structure (Learn / Practice / Words views)     |
| `data.js`    | Jamo tables, romanization + 2-set key mappings      |
| `app.js`     | Game logic (shared engine for Practice and Words)   |
| `style.css`  | Styling                                             |
| `test.js`    | Regression tests for the romanization engine        |

## Tests

```sh
node test.js
```

The suite verifies the jamo tables against the official standard and round-trips
all 11,172 composed syllables of the Hangul Unicode block to catch any
ordering-table mismatch.
