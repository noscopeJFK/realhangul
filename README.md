# realhangul

Hangul training, similar to [realkana](https://github.com/takahirox/realkana).
Open `index.html` in a browser.

## What it teaches

The app focuses on the **jamo** — the 19 consonants and 21 vowels that make up
every Hangul syllable — before moving on to whole words.

- **Learn** — a chart of all 40 jamo. Each card shows the letter, its official
  romanization, its keyboard key in the layout below, and a phonetic hint
  (e.g. `ㅏ → a · key k · as in "father"`). Click cards to select a subset,
  then practice just those.
- **Practice** — drills the jamo in two answer modes:
  - **Type the keys** — see the letter and its sound, type the key(s) for
    the layout in `1.png` (e.g. ㅂ = `q`, ㅏ = `k`). Tense consonants use
    **Shift+letter** (ㅃ = `Shift+Q`, ㅉ = `Shift+W`, ㄸ = `Shift+E`,
    ㄲ = `Shift+R`, ㅆ = `Shift+T`) — the doubled base key is also accepted
    (ㅃ = `q q`). Compound vowels are typed as their component keys
    (ㅘ = `h k`, ㅢ = `m l`); ㅒ and ㅖ also accept `Shift+O` / `Shift+P`.
  - **Type the romanization** — see the letter and its key, type the official
    romanization.
- **Words** — type the key sequence for common words.

## Data

Romanization follows the **official 2000 standard**
([한국어 로마자 표기법](https://www.mec.go.kr/eng/board/romanization.jsp)).
Keyboard keys follow the Dubeolsik-style (두벌식) layout shown in `1.png`
(machine-readable form in `table.csv`). The full mapping lives in `data.js`.

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
