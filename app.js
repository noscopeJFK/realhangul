/*
 * Hangul Type — game logic.
 * Modes: Learn (chart), Practice (Jamo typing), Words (word typing).
 */
(function () {
  'use strict';

  // ---- Curated word list (common, pedagogically useful) -------------------
  // Romanization is computed at runtime via romanizeHangul().
  const WORDS = [
    { w: '안녕하세요', m: 'hello' },
    { w: '감사합니다', m: 'thank you' },
    { w: '한국', m: 'Korea' },
    { w: '학교', m: 'school' },
    { w: '사람', m: 'person' },
    { w: '물', m: 'water' },
    { w: '시간', m: 'time' },
    { w: '꽃', m: 'flower' },
    { w: '빵', m: 'bread' },
    { w: '서울', m: 'Seoul' },
    { w: '과일', m: 'fruit' },
    { w: '배우다', m: 'to learn' },
    { w: '우유', m: 'milk' },
    { w: '수박', m: 'watermelon' },
    { w: '축하합니다', m: 'congratulations' },
    { w: '광희문', m: 'Gwanghuimun (gate)' },
    { w: '총', m: 'gun' },
    { w: '통', m: 'barrel' },
    { w: '특', m: 'special' },
    { w: '첫', m: 'first' },
    { w: '주', m: 'week' },
    { w: '추', m: 'cold' },
    { w: '출', m: 'out / depart' },
    { w: '의', m: 'of' },
    { w: '이', m: 'this' },
    { w: '유', m: 'oil' },
    { w: '여', m: 'woman' },
    { w: '어', m: 'parent' },
    { w: '야', m: 'night' },
    { w: '아', m: 'ah' },
    { w: '오', m: 'oh' },
    { w: '우', m: 'rain' },
    { w: '라', m: 'la' },
    { w: '마', m: 'horse' },
    { w: '바', m: 'ba' },
    { w: '사', m: 'four / story' },
    { w: '나', m: 'I' },
    { w: '다', m: 'all' },
    { w: '가', m: 'go' },
    { w: '갑', m: 'cover' },
    { w: '감', m: 'feel' },
    { w: '간', m: 'liver' },
    { w: '김', m: 'name Kim' },
    { w: '한', m: 'one / Korean' },
    { w: '동', m: 'east' },
    { w: '빛', m: 'light' },
    { w: '끝', m: 'end' },
    { w: '할', m: 'will do' },
  ];

  const PRACTICE_LEN = 20; // Jamo per practice session
  const WORDS_LEN = 10;    // words per words session

  // ---- DOM refs -----------------------------------------------------------
  const $ = (id) => document.getElementById(id);
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const views = { learn: $('view-learn'), practice: $('view-practice'), words: $('view-words') };

  // ---- View switching -----------------------------------------------------
  function showView(name) {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.view === name));
    Object.entries(views).forEach(([k, el]) => el.classList.toggle('active', k === name));
    if (name === 'practice') focusInput($('p-input'));
    if (name === 'words') focusInput($('w-input'));
  }
  tabs.forEach((t) => t.addEventListener('click', () => {
    // Opening the Practice tab directly always drills the full Jamo set;
    // a subset is only used when launched from the Learn selection.
    if (t.dataset.view === 'practice') practiceGame.setItems(JAMO);
    showView(t.dataset.view);
  }));

  // ---- Learn chart --------------------------------------------------------
  const selected = new Set(); // chars of selected jamo

  function buildChart() {
    const cons = $('consonant-grid');
    const vows = $('vowel-grid');
    JAMO.forEach((j) => {
      const card = document.createElement('div');
      card.className = 'jamo-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', 'false');
      card.innerHTML =
        '<div class="ch">' + j.char + '</div>' +
        '<div class="rm">' + j.roman + '</div>' +
        '<div class="key">' + KEYS_2SET[j.char] + '</div>' +
        '<div class="ht">' + j.hint + '</div>';
      const toggle = () => {
        const on = selected.has(j.char);
        if (on) selected.delete(j.char); else selected.add(j.char);
        card.classList.toggle('selected', !on);
        card.setAttribute('aria-pressed', String(!on));
        updateSelectBar();
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
      (j.type === 'consonant' ? cons : vows).appendChild(card);
    });
  }

  function updateSelectBar() {
    const n = selected.size;
    $('select-count').textContent = n
      ? n + ' jamo selected'
      : 'Click jamo cards to pick which ones to practice';
    const btn = $('practice-selected');
    btn.disabled = n === 0;
    btn.textContent = n ? 'Practice ' + n + ' selected' : 'Practice selection';
    $('clear-selected').disabled = n === 0;
  }

  // ---- Game engine (shared by practice + words) ---------------------------
  function makeGame(cfg) {
    // cfg: { items, answerOf, displayOf, hintOf, scoreEl, streakEl, progressEl,
    //        inputEl, feedbackEl, stageEl, startBtn, skipBtn, len, onDone }
    const state = {
      items: [],
      idx: 0,
      score: 0,
      streak: 0,
      best: 0,
      correct: 0,
      wrong: 0,
      mistakes: [],
      active: false,
      answered: false,
    };

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    function reset() {
      state.items = shuffle(cfg.items).slice(0, cfg.len);
      state.idx = 0;
      state.score = 0;
      state.streak = 0;
      state.best = 0;
      state.correct = 0;
      state.wrong = 0;
      state.mistakes = [];
      state.active = false;
      state.answered = false;
      updateHud();
      render();
      cfg.startBtn.disabled = false;
      cfg.skipBtn.disabled = true;
      cfg.inputEl.value = '';
      cfg.inputEl.className = 'answer-input';
      cfg.feedbackEl.textContent = '';
      cfg.feedbackEl.className = 'feedback';
    }

    function updateHud() {
      cfg.scoreEl.textContent = state.score;
      cfg.streakEl.textContent = state.streak;
      const pct = state.items.length ? (state.idx / state.items.length) * 100 : 0;
      cfg.progressEl.style.width = pct + '%';
    }

    function render() {
      if (!state.items.length) return;
      const item = state.items[state.idx];
      cfg.displayOf(item);
      if (cfg.hintOf) {
        const hintEl = cfg.stageEl.querySelector('.jamo-hint');
        if (hintEl) hintEl.textContent = cfg.hintOf(item);
      }
      cfg.inputEl.value = '';
      cfg.inputEl.className = 'answer-input';
      cfg.inputEl.disabled = false;
      cfg.feedbackEl.textContent = '';
      cfg.feedbackEl.className = 'feedback';
      state.answered = false;
      focusInput(cfg.inputEl);
    }

    function start() {
      reset();
      state.active = true;
      cfg.startBtn.disabled = true;
      cfg.skipBtn.disabled = false;
      render();
    }

    function check() {
      if (!state.active || state.answered) return;
      const item = state.items[state.idx];
      const expected = cfg.answerOf(item).toLowerCase();
      const typed = cfg.inputEl.value.trim().toLowerCase();
      if (!typed) return;
      state.answered = true;
      const ok = typed === expected;
      if (ok) {
        state.score += 1;
        state.streak += 1;
        state.best = Math.max(state.best, state.streak);
        state.correct += 1;
        cfg.inputEl.className = 'answer-input correct';
        cfg.feedbackEl.textContent = '✓ Correct!';
        cfg.feedbackEl.className = 'feedback good';
      } else {
        state.streak = 0;
        state.wrong += 1;
        state.mistakes.push({ item, expected, typed });
        cfg.inputEl.className = 'answer-input wrong';
        cfg.feedbackEl.textContent = '✗ It’s “' + expected + '”';
        cfg.feedbackEl.className = 'feedback bad';
      }
      updateHud();
      setTimeout(next, ok ? 550 : 1100);
    }

    function next() {
      state.idx += 1;
      if (state.idx >= state.items.length) {
        finish();
      } else {
        updateHud();
        render();
      }
    }

    function skip() {
      if (!state.active || state.answered) return;
      const item = state.items[state.idx];
      const expected = cfg.answerOf(item).toLowerCase();
      state.streak = 0;
      state.wrong += 1;
      state.mistakes.push({ item, expected, typed: '(skipped)' });
      updateHud();
      setTimeout(next, 350);
    }

    function finish() {
      state.active = false;
      cfg.skipBtn.disabled = true;
      cfg.startBtn.disabled = false;
      cfg.inputEl.disabled = true;
      cfg.onDone(state);
    }

    cfg.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); check(); }
    });
    cfg.inputEl.addEventListener('input', () => {
      if (!state.active || state.answered) return;
      const expected = cfg.answerOf(state.items[state.idx]).toLowerCase();
      if (cfg.inputEl.value.trim().toLowerCase() === expected) check();
    });
    cfg.startBtn.addEventListener('click', start);
    cfg.skipBtn.addEventListener('click', skip);

    function setItems(items) {
      cfg.items = items;
      reset();
    }

    reset();
    return { start, reset, setItems };
  }

  function focusInput(el) {
    // Focus without scrolling on mobile.
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }

  // ---- Results overlay ----------------------------------------------------
  const results = $('results');
  function showResults(mode, state) {
    const total = state.correct + state.wrong;
    const acc = total ? Math.round((state.correct / total) * 100) : 0;
    $('r-title').textContent = acc >= 90 ? 'Excellent!' : acc >= 70 ? 'Nice work!' : 'Keep practicing!';
    $('r-sub').textContent = mode + ' session — ' + acc + '% accuracy';
    $('r-correct').textContent = state.correct;
    $('r-wrong').textContent = state.wrong;
    $('r-best').textContent = state.best;

    const mk = $('r-mistakes');
    mk.innerHTML = '';
    if (state.mistakes.length) {
      const title = document.createElement('div');
      title.className = 'm-title';
      title.textContent = 'Review your misses';
      mk.appendChild(title);
      state.mistakes.slice(0, 12).forEach((m) => {
        const row = document.createElement('div');
        row.className = 'm-item';
        const ch = m.item.w || m.item.char;
        const label = m.item.w ? (m.item.w + '  ·  ' + m.item.m) : (m.item.char + '  ·  ' + m.item.type);
        row.innerHTML =
          '<span class="m-ch">' + label + '</span>' +
          '<span><span class="m-ans">' + m.typed + '</span> → <span class="m-correct">' + m.expected + '</span></span>';
        mk.appendChild(row);
      });
    }
    results.classList.remove('hidden');
  }
  $('r-again').addEventListener('click', () => {
    results.classList.add('hidden');
    const active = document.querySelector('.view.active');
    if (active.id === 'view-practice') practiceGame.start();
    else if (active.id === 'view-words') wordsGame.start();
  });
  $('r-learn').addEventListener('click', () => {
    results.classList.add('hidden');
    showView('learn');
  });

  // ---- Practice game (Jamo) ----------------------------------------------
  // Answers are 2-set (두벌식) IME keys — the same keys a standard
  // Microsoft/Google Korean IME expects. Romanization is shown as the sound.
  const practiceGame = makeGame({
    items: JAMO,
    len: PRACTICE_LEN,
    answerOf: (j) => KEYS_2SET[j.char],
    displayOf: (j) => {
      $('p-jamo').textContent = j.char;
      $('p-roman').textContent = j.roman;
    },
    hintOf: (j) => j.type + '  ·  sounds like “' + j.roman + '”',
    scoreEl: $('p-score'),
    streakEl: $('p-streak'),
    progressEl: $('p-progress'),
    inputEl: $('p-input'),
    feedbackEl: $('p-feedback'),
    stageEl: $('p-stage'),
    startBtn: $('p-start'),
    skipBtn: $('p-skip'),
    onDone: (s) => showResults('Practice', s),
  });

  // ---- Words game ---------------------------------------------------------
  // Answers are the 2-set key sequence for the whole word.
  const wordsGame = makeGame({
    items: WORDS,
    len: WORDS_LEN,
    answerOf: (it) => keys2setHangul(it.w),
    displayOf: (it) => { $('w-word').textContent = it.w; },
    hintOf: (it) => 'sounds like “' + romanizeHangul(it.w) + '”',
    scoreEl: $('w-score'),
    streakEl: $('w-streak'),
    progressEl: $('w-progress'),
    inputEl: $('w-input'),
    feedbackEl: $('w-feedback'),
    stageEl: $('w-stage'),
    startBtn: $('w-start'),
    skipBtn: $('w-skip'),
    onDone: (s) => showResults('Words', s),
  });

  // ---- Selection → practice ----------------------------------------------
  $('practice-selected').addEventListener('click', () => {
    if (!selected.size) return;
    const items = JAMO.filter((j) => selected.has(j.char));
    practiceGame.setItems(items);
    showView('practice');
  });
  $('clear-selected').addEventListener('click', () => {
    selected.clear();
    document.querySelectorAll('.jamo-card.selected').forEach((c) => {
      c.classList.remove('selected');
      c.setAttribute('aria-pressed', 'false');
    });
    updateSelectBar();
  });

  // ---- Init ---------------------------------------------------------------
  buildChart();
  updateSelectBar();
  showView('learn');
})();
