/* =========================================================
   כוכב הכינויים — English pronoun arcade
   Frontend only. Progress lives in localStorage.
   ========================================================= */

(() => {
  "use strict";

  /* -------------------------------------------------------
     Data
     ------------------------------------------------------- */

  const PRONOUNS = [
    { en: "I", he: "אני", quizHe: "אני", note: "תמיד עם am — I am ten." },
    { en: "You", he: "אתה / את / אתם / אתן", quizHe: "אתה / את / אתם / אתן", note: "למי שפונים אליו — יחיד או רבים." },
    { en: "He", he: "הוא", quizHe: "הוא", note: "זכר יחיד — ילד, איש, אח." },
    { en: "She", he: "היא", quizHe: "היא", note: "נקבה יחידה — ילדה, אישה, אחות." },
    { en: "It", he: "זה", quizHe: "זה (חפץ / חיה)", note: "לחפץ, חיה או דבר — לא לאדם." },
    { en: "We", he: "אנחנו", quizHe: "אנחנו", note: "אני ועוד מישהו — ביחד." },
    { en: "They", he: "הם / הן", quizHe: "הם / הן", note: "שניים או יותר — אנשים, דברים או חיות." },
  ];

  const FILL = [
    { id: "f1", en: "Maria is a good student. ___ reads many books.", he: "מריה היא תלמידה טובה. היא קוראת הרבה ספרים.", answer: "She", why: "מריה היא ילדה אחת — גוף שלישי נקבה, לכן She." },
    { id: "f2", en: "Tom and I play football every day. ___ love sports.", he: "טום ואני משחקים כדורגל כל יום. אנחנו אוהבים ספורט.", answer: "We", why: "טום ואני = אני ועוד מישהו, לכן We (אנחנו)." },
    { id: "f3", en: "Look at the cat! ___ is sleeping on the chair.", he: "תסתכלו על החתול! הוא ישן על הכיסא.", answer: "It", why: "חתול הוא חיה. באנגלית משתמשים ב-It לחפץ, חיה או דבר." },
    { id: "f4", en: "David is ten years old. ___ has a red bicycle.", he: "דיוויד בן עשר. יש לו אופניים אדומות.", answer: "He", why: "דיוויד הוא בן — גוף שלישי זכר, לכן He." },
    { id: "f5", en: "My friends are from London. ___ speak English.", he: "החברים שלי מלונדון. הם מדברים אנגלית.", answer: "They", why: "כמה חברים = רבים, לכן They (הם)." },
    { id: "f6", en: "Mom and Dad are in the kitchen. ___ are making dinner.", he: "אמא ואבא במטבח. הם מכינים ארוחת ערב.", answer: "They", why: "אמא ואבא = שני אנשים, לכן They (הם)." },
    { id: "f7", en: "The sun is hot today. ___ is very bright.", he: "השמש חמה היום. היא מאוד בהירה.", answer: "It", why: "השמש היא דבר, לכן It (זה)." },
    { id: "f8", en: "You and your sister like to dance. ___ dance every day.", he: "אתה ואחותך אוהבים לרקוד. אתם רוקדים כל יום.", answer: "You", why: "פונים אליך ואל אחותך, לכן You (אתה / אתם)." },
  ];

  const REPLACE = [
    { id: "r1", en: "___ is a smart girl.", hint: "Sarah", he: "שרה היא ילדה חכמה.", answer: "She", why: "שרה היא ילדה — נקבה יחידה, לכן She." },
    { id: "r2", en: "___ are playing football in the park.", hint: "Tom and Dan", he: "טום ודן משחקים כדורגל בפארק.", answer: "They", why: "טום ודן = שני בנים, לכן They (הם)." },
    { id: "r3", en: "___ has a big white dog.", hint: "My brother", he: "לאח שלי יש כלב לבן גדול.", answer: "He", why: "האח שלי הוא בן — זכר יחיד, לכן He." },
    { id: "r4", en: "___ am ten years old.", hint: "I", he: "אני בן/בת עשר.", answer: "I", why: "המילה \"אני\" במשפט באנגלית היא I, ותמיד באה עם am." },
    { id: "r5", en: "___ is a new book.", hint: "The notebook", he: "המחברת היא ספר חדש.", answer: "It", why: "המחברת היא דבר, לכן It (זה)." },
    { id: "r6", en: "___ live in Israel.", hint: "My family and I", he: "המשפחה שלי ואני גרים בישראל.", answer: "We", why: "המשפחה שלי ואני = אנחנו, לכן We." },
    { id: "r7", en: "___ are good friends.", hint: "You and Dan", he: "אתה ודן חברים טובים.", answer: "You", why: "פונים אליך ואל דן, לכן You (אתה / אתם)." },
  ];

  const GAMES = {
    "en-he": { title: "מה זה אומר?", sub: "מאנגלית לעברית", icon: "🔤", accent: "mint", desc: "רואים מילה באנגלית ובוחרים את הפירוש בעברית." },
    "he-en": { title: "איך אומרים?", sub: "מעברית לאנגלית", icon: "🗣️", accent: "sky", desc: "רואים מילה בעברית ובוחרים איך אומרים אותה באנגלית." },
    fill: { title: "הכינוי החסר", sub: "בחירת כינוי במשפט", icon: "🧩", accent: "violet", desc: "קוראים משפט באנגלית ובוחרים את הכינוי שמתאים." },
    replace: { title: "מחליפים שם בכינוי", sub: "שם → כינוי", icon: "🔄", accent: "coral", desc: "מחליפים שם או תיאור בכינוי הגוף הנכון." },
    mixed: { title: "סיבוב אלופים", sub: "הכל ביחד", icon: "🏆", accent: "amber", desc: "כל סוגי השאלות בסיבוב אחד — 10 שאלות." },
  };

  const DISTRACTORS = {
    I: ["He", "She", "We"],
    You: ["We", "They", "I"],
    He: ["She", "It", "They"],
    She: ["He", "It", "They"],
    It: ["He", "She", "They"],
    We: ["They", "You", "I"],
    They: ["We", "You", "He"],
  };

  const LEVELS = [
    { at: 0, name: "טירון", icon: "🌱" },
    { at: 120, name: "חוקר", icon: "🔎" },
    { at: 300, name: "אלוף", icon: "🏅" },
    { at: 550, name: "אגדה", icon: "🌟" },
    { at: 850, name: "כוכב-על", icon: "🚀" },
  ];

  const CARD_ACCENTS = ["mint", "sky", "violet", "coral", "amber", "lime", "pink"];
  const PRAISE = ["מעולה!", "נכון מאוד!", "אלופים!", "בדיוק!", "כל הכבוד!"];

  const STAR_SVG = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.4l2.9 6.1 6.7.8-5 4.6 1.4 6.6-6-3.5-6 3.5 1.4-6.6-5-4.6 6.7-.8L12 2.4z"/></svg>`;

  /* -------------------------------------------------------
     Small helpers
     ------------------------------------------------------- */

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function starsFor(accuracy) {
    if (accuracy >= 0.85) return 3;
    if (accuracy >= 0.65) return 2;
    if (accuracy >= 0.4) return 1;
    return 0;
  }

  function starHTML(n) {
    return [0, 1, 2].map((i) => `<span class="star ${i < n ? "on" : ""}" aria-hidden="true">★</span>`).join("");
  }

  function highlight(text, word) {
    const safe = String(word).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = String(text).match(new RegExp(`\\b${safe}\\b`, "i"));
    if (!match) return esc(text);
    const start = match.index;
    const end = start + match[0].length;
    return esc(text.slice(0, start)) + "<mark>" + esc(match[0]) + "</mark>" + esc(text.slice(end));
  }

  const dateFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "short" });

  function formatDate(ts) {
    try { return dateFmt.format(new Date(ts)); } catch (e) { return ""; }
  }

  function levelInfo(xp) {
    let i = 0;
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1].at) i++;
    const cur = LEVELS[i];
    const next = LEVELS[i + 1] || null;
    const progress = next ? Math.min(1, (xp - cur.at) / (next.at - cur.at)) : 1;
    return { ...cur, index: i, next, progress, toNext: next ? Math.max(0, next.at - xp) : 0 };
  }

  function getOverall() {
    let correct = 0;
    let total = 0;
    let plays = 0;
    Object.values(state.games).forEach((g) => {
      correct += Number(g.correct) || 0;
      total += Number(g.total) || 0;
      plays += Number(g.plays) || 0;
    });
    return { correct, total, plays, accuracy: total ? Math.round((correct / total) * 100) : 0 };
  }

  /* -------------------------------------------------------
     Saved state
     ------------------------------------------------------- */

  const STORAGE_KEY = "kokhav-hakinuyim-v1";

  function defaultState() {
    return { xp: 0, sound: true, games: {}, history: [] };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const games = {};
      if (parsed && parsed.games && typeof parsed.games === "object") {
        Object.entries(parsed.games).forEach(([id, g]) => {
          if (GAMES[id] && g && typeof g === "object") games[id] = g;
        });
      }
      const history = Array.isArray(parsed && parsed.history)
        ? parsed.history.filter((r) => r && GAMES[r.game] && Number(r.total) > 0)
        : [];
      return {
        xp: Math.max(0, Number(parsed && parsed.xp) || 0),
        sound: !(parsed && parsed.sound === false),
        games,
        history,
      };
    } catch (e) {
      return defaultState();
    }
  }

  let state = loadState();
  let view = { name: "home" };
  let session = null;
  let storageWarned = false;
  let toastTimer = null;

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      if (!storageWarned) {
        storageWarned = true;
        toast("ההתקדמות לא נשמרת בדפדפן הזה");
      }
    }
  }

  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  /* -------------------------------------------------------
     Speech (Web Speech API)
     ------------------------------------------------------- */

  const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
  const speechSupported = !!synth && "SpeechSynthesisUtterance" in window;
  let enVoice = null;
  let heVoice = null;
  let activeSpeakBtn = null;
  let speakToken = 0;

  function pickVoice(lang) {
    if (!synth) return null;
    const voices = synth.getVoices() || [];
    const wanted = lang.toLowerCase();
    const exact = voices.filter((v) => (v.lang || "").toLowerCase().replace("_", "-") === wanted);
    const local = exact.filter((v) => v.localService);
    const pool = local.length ? local : exact;
    const preferred = pool.find((v) => /samantha|google|microsoft|karen|daniel|zira|david/i.test(v.name || ""));
    if (preferred) return preferred;
    if (pool.length) return pool[0];
    const base = wanted.split("-")[0];
    return voices.find((v) => (v.lang || "").toLowerCase().startsWith(base)) || null;
  }

  function refreshVoices() {
    if (!synth) return;
    enVoice = pickVoice("en-US") || pickVoice("en-GB");
    heVoice = pickVoice("he-IL") || pickVoice("he");
  }

  function speaker(text, lang = "en-US", label = "הקראה") {
    if (!speechSupported) return "";
    if (lang.toLowerCase().startsWith("he") && !heVoice) return "";
    return `<button type="button" class="speak-btn" data-speak="${esc(text)}" data-lang="${esc(lang)}" aria-label="${esc(label)}" title="${esc(label)}">🔊</button>`;
  }

  function heSpeaker(text, label = "הקראת המילה בעברית") {
    return speaker(text, "he-IL", label);
  }

  function stopSpeech() {
    speakToken++;
    if (synth) {
      try { synth.cancel(); } catch (e) { /* ignore */ }
    }
    if (activeSpeakBtn) {
      activeSpeakBtn.classList.remove("speaking");
      activeSpeakBtn = null;
    }
  }

  function speak(text, lang = "en-US", btn = null) {
    if (!speechSupported || !text) {
      if (!speechSupported) toast("הדפדפן הזה לא תומך בהקראה");
      return;
    }
    const token = ++speakToken;
    if (activeSpeakBtn && activeSpeakBtn !== btn) activeSpeakBtn.classList.remove("speaking");
    try { synth.cancel(); } catch (e) { /* ignore */ }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = lang.toLowerCase().startsWith("he") ? 0.92 : 0.88;
    utterance.pitch = 1.03;
    const voice = lang.toLowerCase().startsWith("he") ? heVoice : enVoice;
    if (voice) utterance.voice = voice;
    if (btn) {
      btn.classList.add("speaking");
      activeSpeakBtn = btn;
    }
    const done = () => {
      if (token !== speakToken) return;
      if (btn) btn.classList.remove("speaking");
      if (activeSpeakBtn === btn) activeSpeakBtn = null;
    };
    utterance.onend = done;
    utterance.onerror = done;
    try { synth.speak(utterance); } catch (e) { done(); }
  }

  /* -------------------------------------------------------
     Sound effects (Web Audio, no files)
     ------------------------------------------------------- */

  let audioCtx = null;

  function ensureAudio() {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    if (!audioCtx) audioCtx = new Ctor();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function tone(freq, delay, duration, type = "triangle", volume = 0.05) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.04);
  }

  function sfx(kind) {
    if (!state.sound) return;
    if (kind === "click") { tone(760, 0, 0.06, "sine", 0.018); return; }
    if (kind === "correct") {
      tone(523.25, 0, 0.12, "triangle", 0.055);
      tone(659.25, 0.07, 0.12, "triangle", 0.05);
      tone(783.99, 0.14, 0.2, "triangle", 0.05);
      return;
    }
    if (kind === "wrong") {
      tone(220, 0, 0.15, "sawtooth", 0.028);
      tone(164.81, 0.11, 0.24, "sawtooth", 0.024);
      return;
    }
    if (kind === "win") {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.3, "triangle", 0.045));
      return;
    }
    if (kind === "star") { tone(1318.5, 0, 0.16, "sine", 0.035); }
  }

  /* -------------------------------------------------------
     Confetti
     ------------------------------------------------------- */

  const confettiCanvas = document.getElementById("confetti");
  const confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
  const reducedMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  let confettiParticles = [];
  let confettiRaf = 0;

  function sizeCanvas() {
    if (!confettiCanvas || !confettiCtx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    confettiCanvas.width = Math.floor(window.innerWidth * dpr);
    confettiCanvas.height = Math.floor(window.innerHeight * dpr);
    confettiCanvas.style.width = window.innerWidth + "px";
    confettiCanvas.style.height = window.innerHeight + "px";
    confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  function burst(x, y, count = 42) {
    if (!confettiCtx || reducedMotion) return;
    const colors = ["#6ff2c0", "#74c8ff", "#b49bff", "#ffd166", "#ff8b8b", "#ff9edb"];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      confettiParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        w: 5 + Math.random() * 6,
        h: 3 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.008 + Math.random() * 0.008,
      });
    }
    if (!confettiRaf) confettiRaf = requestAnimationFrame(drawConfetti);
  }

  function drawConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    confettiParticles = confettiParticles.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
    confettiParticles.forEach((p) => {
      p.vy += 0.16;
      p.vx *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= p.decay;
      confettiCtx.save();
      confettiCtx.globalAlpha = Math.max(0, p.life);
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();
    });
    if (confettiParticles.length) {
      confettiRaf = requestAnimationFrame(drawConfetti);
    } else {
      confettiRaf = 0;
      confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  }

  /* -------------------------------------------------------
     Question builders
     ------------------------------------------------------- */

  function heOptions(correct) {
    const pool = PRONOUNS.map((p) => p.quizHe).filter((v) => v !== correct);
    return shuffle([correct, ...shuffle(pool).slice(0, 3)]);
  }

  function enOptions(correct) {
    const distractors = DISTRACTORS[correct] || PRONOUNS.map((p) => p.en).filter((v) => v !== correct).slice(0, 3);
    return shuffle([correct, ...distractors.slice(0, 3)]);
  }

  function makeEnHe() {
    return PRONOUNS.map((p) => ({
      kind: "enhe",
      key: "enhe:" + p.en,
      prompt: "מה הפירוש בעברית?",
      word: p.en,
      answer: p.quizHe,
      options: heOptions(p.quizHe),
      why: `${p.en} = ${p.quizHe}. ${p.note}`,
    }));
  }

  function makeHeEn() {
    return PRONOUNS.map((p) => ({
      kind: "heen",
      key: "heen:" + p.en,
      prompt: "איך אומרים את זה באנגלית?",
      wordHe: p.quizHe,
      answer: p.en,
      options: enOptions(p.en),
      why: `${p.quizHe} = ${p.en}. ${p.note}`,
    }));
  }

  function makeFill() {
    return FILL.map((s) => ({
      kind: "fill",
      key: "fill:" + s.id,
      prompt: "בחרו את הכינוי שמתאים למשפט",
      sentence: s.en,
      he: s.he,
      answer: s.answer,
      options: enOptions(s.answer),
      why: s.why,
      completed: s.en.replace("___", s.answer),
      speakPrompt: s.en.replace("___", "…"),
    }));
  }

  function makeReplace() {
    return REPLACE.map((s) => ({
      kind: "replace",
      key: "replace:" + s.id,
      prompt: "בחרו את הכינוי שמחליף את המילה",
      sentence: s.en,
      hint: s.hint,
      he: s.he,
      answer: s.answer,
      options: enOptions(s.answer),
      why: s.why,
      completed: s.en.replace("___", s.answer),
      speakPrompt: s.en.replace("___", "…"),
    }));
  }

  function buildQuestions(gameId) {
    if (gameId === "en-he") return shuffle(makeEnHe());
    if (gameId === "he-en") return shuffle(makeHeEn());
    if (gameId === "fill") return shuffle(makeFill());
    if (gameId === "replace") return shuffle(makeReplace());
    if (gameId === "mixed") {
      const mixed = [
        ...shuffle(makeEnHe()).slice(0, 2),
        ...shuffle(makeHeEn()).slice(0, 2),
        ...shuffle([...makeFill(), ...makeReplace()]).slice(0, 6),
      ];
      return shuffle(mixed);
    }
    return [];
  }

  /* -------------------------------------------------------
     Rendering — shared shell
     ------------------------------------------------------- */

  function renderTopbar() {
    const soundIcon = state.sound ? "🎵" : "🔇";
    const soundLabel = state.sound ? "השתקת צלילי המשחק" : "הפעלת צלילי המשחק";
    const soundBtn = `<button type="button" class="icon-btn sound-toggle" data-action="sound" aria-label="${soundLabel}" title="${soundLabel}">${soundIcon}</button>`;
    let inner;

    if (view.name === "home") {
      inner = `<button type="button" class="brand" data-nav="home" aria-label="כוכב הכינויים — לדף הבית">
        <span class="brand-mark">${STAR_SVG}</span>
        <span class="brand-text"><strong>כוכב הכינויים</strong><span>אלופים באנגלית</span></span>
      </button>
      <nav class="top-nav" aria-label="ניווט ראשי">
        <button type="button" class="nav-btn" data-nav="learn">לומדים</button>
        <button type="button" class="nav-btn" data-nav="progress">התקדמות</button>
        ${soundBtn}
      </nav>`;
    } else {
      let title = "כוכב הכינויים";
      if (view.name === "learn") title = "📚 לומדים קודם";
      else if (view.name === "progress") title = "📈 ההתקדמות שלי";
      else if (view.name === "results") title = "🎉 סיימתם סיבוב!";
      else if (view.name === "game" && session) title = `${GAMES[session.gameId].icon} ${GAMES[session.gameId].title}`;

      inner = `<div class="game-topbar">
        <button type="button" class="icon-btn back-btn" data-action="back" aria-label="חזרה">→</button>
        <div class="top-title"><strong>${title}</strong></div>
        ${soundBtn}
      </div>`;
    }

    const topbar = document.getElementById("topbar");
    if (topbar) topbar.innerHTML = `<div class="topbar-inner">${inner}</div>`;
  }

  function render() {
    renderTopbar();
    const viewEl = document.getElementById("view");
    if (!viewEl) return;
    let html = "";
    switch (view.name) {
      case "learn": html = learnHTML(); break;
      case "progress": html = progressHTML(); break;
      case "game": html = session ? gameHTML() : homeHTML(); break;
      case "results": html = session && session.result ? resultsHTML() : homeHTML(); break;
      default: html = homeHTML();
    }
    viewEl.innerHTML = html;
    viewEl.classList.remove("view-enter");
    void viewEl.offsetWidth;
    viewEl.classList.add("view-enter");
    window.scrollTo({ top: 0, behavior: "auto" });
    if (view.name === "results") afterResults();
  }

  /* -------------------------------------------------------
     Home
     ------------------------------------------------------- */

  function gameCardHTML(id) {
    const g = GAMES[id];
    const s = state.games[id] || {};
    const plays = Number(s.plays) || 0;
    const bestAccuracy = Number(s.bestAccuracy) || 0;
    const best = bestAccuracy ? Math.round(bestAccuracy * 100) + "%" : "—";
    const stars = starsFor(bestAccuracy);
    const playsLabel = plays ? (plays === 1 ? "סיבוב אחד" : `${plays} סיבובים`) : "טרם שוחק";

    return `<button type="button" class="game-card" data-game="${id}" style="--accent: var(--${g.accent})">
      <span class="game-icon" aria-hidden="true">${g.icon}</span>
      <span class="game-copy">
        <span class="game-sub">${esc(g.sub)}</span>
        <span class="game-title">${esc(g.title)}</span>
        <span class="game-desc">${esc(g.desc)}</span>
      </span>
      <span class="game-foot">
        <span class="stars" aria-label="${stars} מתוך 3 כוכבים">${starHTML(stars)}</span>
        <span class="sep" aria-hidden="true"></span>
        <span class="best">שיא ${best}</span>
        <span class="sep" aria-hidden="true"></span>
        <span>${playsLabel}</span>
      </span>
      <span class="game-cta">שחקו ←</span>
    </button>`;
  }

  function studyCardHTML() {
    return `<button type="button" class="game-card study-card" data-nav="learn" style="--accent: var(--sky)">
      <span class="game-icon" aria-hidden="true">📚</span>
      <span class="game-copy">
        <span class="game-sub">לימוד מהיר</span>
        <span class="game-title">כל הכינויים והמשפטים</span>
        <span class="game-desc">טבלת כינויים, תרגום לכל משפט והקראה — לפני שמשחקים.</span>
      </span>
      <span class="game-foot">
        <span>7 כינויים</span><span class="sep" aria-hidden="true"></span>
        <span>15 משפטים</span><span class="sep" aria-hidden="true"></span>
        <span>🔊 הקראה</span>
      </span>
      <span class="game-cta">לומדים ←</span>
    </button>`;
  }

  function homeHTML() {
    const overall = getOverall();
    const lvl = levelInfo(state.xp);
    const accuracy = overall.total ? overall.accuracy + "%" : "—";
    const xpLine = lvl.next ? `עוד ${lvl.toNext} XP לרמה הבאה` : "רמה מקסימלית";
    const speechFooter = speechSupported
      ? "🔊 ליד מילים ומשפטים באנגלית אפשר ללחוץ ולהקשיב."
      : "🔇 הדפדפן הזה לא תומך בהקראה — אפשר לשחק גם בלי קול.";

    return `<section class="home">
      <div class="hero">
        <div class="hero-copy">
          <span class="eyebrow">🎯 אימון לקראת המבחן</span>
          <h1>מוכנים לכבוש<br><span class="grad">את מבחן הכינויים?</span></h1>
          <p>שבעה כינויים, חמישה משחקים וסיבובים קצרים של עד 10 שאלות. מקשיבים להגייה, בוחרים תשובה, צוברים כוכבים — ורואים איך כל סיבוב הופך אתכם לאלופים.</p>
          <div class="hero-actions">
            <button type="button" class="btn primary" data-action="random">🎲 סיבוב אקראי</button>
            <button type="button" class="btn ghost" data-nav="learn">📚 לומדים קודם</button>
          </div>
          <div class="level-card">
            <div class="level-head">
              <span class="level-name">${lvl.icon} רמה ${lvl.index + 1} · ${esc(lvl.name)}</span>
              <span class="level-xp">${state.xp} XP · ${xpLine}</span>
            </div>
            <div class="level-track"><div class="level-fill" style="--p:${Math.round(lvl.progress * 100)}%"></div></div>
            <div class="hero-stats">
              <span>🎯 דיוק כללי <strong>${accuracy}</strong></span>
              <span>✅ תשובות נכונות <strong>${overall.correct}</strong></span>
              <span>🎮 סיבובים <strong>${overall.plays}</strong></span>
            </div>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="orbit">
            <span class="orbit-ring"></span>
            <span class="orbit-ring"></span>
            <span class="orbit-core">Aa</span>
            <span class="orbit-chip c1">I</span>
            <span class="orbit-chip c2">She</span>
            <span class="orbit-chip c3">They</span>
            <span class="orbit-chip c4">It</span>
          </div>
        </div>
      </div>

      <div class="section-head">
        <div>
          <h2>בחרו את המשחק שלכם</h2>
          <p>כל סיבוב קצר, אקראי ומתאים לזמן שיש לכם.</p>
        </div>
        <span class="section-note">5 משחקים · עד 10 שאלות</span>
      </div>
      <div class="games-grid">
        ${Object.keys(GAMES).map(gameCardHTML).join("")}
        ${studyCardHTML()}
      </div>

      <div class="steps">
        <div class="step">
          <span class="step-icon" aria-hidden="true">🎮</span>
          <strong>בוחרים משחק</strong>
          <p>מתחילים מהפירושים, מהמשפטים או מסיבוב אלופים שמערבב הכל.</p>
        </div>
        <div class="step">
          <span class="step-icon" aria-hidden="true">🎧</span>
          <strong>מקשיבים ועונים</strong>
          <p>לוחצים על 🔊 ליד מילה או משפט, שומעים את ההגייה ובוחרים מתוך 4 אפשרויות.</p>
        </div>
        <div class="step">
          <span class="step-icon" aria-hidden="true">📈</span>
          <strong>רואים שיפור</strong>
          <p>כוכבים, XP והיסטוריית סיבובים נשמרים במחשב — חוזרים ורואים איך מתקדמים.</p>
        </div>
      </div>

      <footer class="home-foot">${speechFooter}<br>🔒 ההתקדמות נשמרת אוטומטית במחשב הזה. אין צורך בחשבון.</footer>
    </section>`;
  }

  /* -------------------------------------------------------
     Learn
     ------------------------------------------------------- */

  function studyItem(item, kind) {
    const completed = item.en.replace("___", item.answer);
    const noun = kind === "replace"
      ? `<span class="study-noun" dir="ltr">${esc(item.hint)}</span><span class="study-arrow" aria-hidden="true">→</span>`
      : "";
    return `<div class="study-item">
      <div class="study-main">
        <div class="study-en" dir="ltr">${noun}${highlight(completed, item.answer)}</div>
        <div class="study-he">${esc(item.he)}</div>
      </div>
      ${speaker(completed, "en-US", "הקראת המשפט")}
    </div>`;
  }

  function learnHTML() {
    const pronounCards = PRONOUNS.map((p, i) => `<div class="pronoun-card" style="--accent: var(--${CARD_ACCENTS[i]})">
      <div class="pc-top">
        <span class="pc-en" dir="ltr">${esc(p.en)}</span>
        ${speaker(p.en, "en-US", "הקראת " + p.en)}
      </div>
      <div class="pc-he">${esc(p.he)}</div>
      <p class="pc-note">${esc(p.note)}</p>
    </div>`).join("");

    const speechNote = speechSupported
      ? `<div class="learn-note">🔊 ליד כל מילה או משפט באנגלית יש כפתור הקראה. לוחצים ושומעים.</div>`
      : `<div class="learn-note">🔇 הדפדפן הזה לא תומך בהקראה. אפשר ללמוד ולשחק גם בלי קול.</div>`;

    return `<section class="learn">
      <div class="page-head">
        <span class="eyebrow">📚 לימוד מהיר</span>
        <h1>כל הכינויים במקום אחד</h1>
        <p>קודם מבינים, אחר כך משחקים. הנה שבעת כינויי הגוף, הטיפים החשובים וכל המשפטים מהתרגיל — עם תרגום ועם הקראה.</p>
        ${speechNote}
      </div>

      <div class="pronoun-grid">${pronounCards}</div>

      <div class="tips">
        <div class="tip"><strong>I תמיד עם am</strong>I am ten. · I am happy.</div>
        <div class="tip"><strong>He / She / It עם is</strong>He is here. · She is smart. · It is hot.</div>
        <div class="tip"><strong>We / You / They עם are</strong>We are ready. · You are kind. · They are friends.</div>
      </div>

      <section class="study-section">
        <div class="section-head">
          <div><h2>השלמת המשפט</h2><p>הכינוי שנבחר מודגש. אפשר להקשיב לכל משפט.</p></div>
          <span class="section-note">8 משפטים</span>
        </div>
        <div class="study-list">${FILL.map((s) => studyItem(s, "fill")).join("")}</div>
      </section>

      <section class="study-section">
        <div class="section-head">
          <div><h2>מחליפים שם בכינוי</h2><p>השם או התיאור מופיע לפני החץ, והכינוי המחליף אותו מודגש.</p></div>
          <span class="section-note">7 משפטים</span>
        </div>
        <div class="study-list">${REPLACE.map((s) => studyItem(s, "replace")).join("")}</div>
      </section>

      <div class="learn-cta">
        <div>
          <strong>מוכנים לתרגל?</strong>
          <p>עברו למשחק — כל סיבוב יראה לכם בדיוק מה כבר יודעים ומה עוד כדאי לחזק.</p>
        </div>
        <button type="button" class="btn primary" data-action="random">🎲 סיבוב אקראי</button>
      </div>
    </section>`;
  }

  /* -------------------------------------------------------
     Progress
     ------------------------------------------------------- */

  function progressHTML() {
    const overall = getOverall();
    const lvl = levelInfo(state.xp);
    const history = state.history.slice(-12);
    const avg = history.length
      ? Math.round((history.reduce((sum, r) => sum + (r.correct / r.total), 0) / history.length) * 100)
      : 0;

    const chart = history.length
      ? `<div class="chart">${history.map((r) => {
          const g = GAMES[r.game] || { icon: "🎮", accent: "mint", title: "" };
          const acc = Math.round((r.correct / r.total) * 100);
          return `<div class="chart-col" title="${esc(g.title)} · ${acc}% · ${formatDate(r.date)}">
            <div class="chart-bar" style="height:${Math.max(6, Math.round(acc * 1.5))}px; --c: var(--${g.accent || "mint"})"></div>
            <span class="chart-label" aria-hidden="true">${g.icon}</span>
          </div>`;
        }).join("")}</div>`
      : `<div class="chart-empty">עוד אין סיבובים. שחקו סיבוב אחד ותראו כאן את ההתקדמות.</div>`;

    const rows = Object.keys(GAMES).map((id) => {
      const g = GAMES[id];
      const s = state.games[id] || {};
      const plays = Number(s.plays) || 0;
      const acc = s.bestAccuracy ? Math.round(Number(s.bestAccuracy) * 100) : 0;
      const stars = starsFor(Number(s.bestAccuracy) || 0);
      const playsLabel = plays ? (plays === 1 ? "סיבוב אחד" : `${plays} סיבובים`) : "טרם שוחק";
      return `<div class="progress-row" style="--accent: var(--${g.accent})">
        <span class="pr-icon" aria-hidden="true">${g.icon}</span>
        <div class="pr-main">
          <div class="pr-top">
            <span class="pr-title">${esc(g.title)}</span>
            <span class="pr-meta">${playsLabel}${plays ? ` · שיא ${acc}%` : ""}</span>
          </div>
          <div class="pr-track"><div class="pr-fill" style="--p:${acc}%"></div></div>
        </div>
        <span class="stars" aria-label="${stars} מתוך 3 כוכבים">${starHTML(stars)}</span>
      </div>`;
    }).join("");

    return `<section class="progress">
      <div class="progress-head">
        <div>
          <span class="eyebrow">📈 מעקב אישי</span>
          <h1>ההתקדמות שלי</h1>
          <p>כל סיבוב נשמר במחשב. אפשר לחזור, לראות שיפור ולשבור שיאים.</p>
        </div>
        <div class="level-pill">
          <span class="lp-icon" aria-hidden="true">${lvl.icon}</span>
          <div>
            <strong>רמה ${lvl.index + 1} · ${esc(lvl.name)}</strong>
            <span>${state.xp} XP${lvl.next ? ` · עוד ${lvl.toNext} לרמה הבאה` : ""}</span>
          </div>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-card"><strong>${state.xp}</strong><span>XP</span></div>
        <div class="stat-card"><strong>${overall.total ? overall.accuracy + "%" : "—"}</strong><span>דיוק כללי</span></div>
        <div class="stat-card"><strong>${overall.correct}</strong><span>תשובות נכונות</span></div>
        <div class="stat-card"><strong>${overall.plays}</strong><span>סיבובים שהושלמו</span></div>
      </div>

      <div class="chart-card">
        <div class="chart-head">
          <strong>${history.length ? "הסיבובים האחרונים" : "היסטוריית סיבובים"}</strong>
          <span>${history.length ? (history.length === 1 ? `ממוצע ${avg}% בסיבוב אחד` : `ממוצע ${avg}% ב-${history.length} סיבובים`) : "כאן יופיעו הציונים"}</span>
        </div>
        ${chart}
      </div>

      <div class="progress-list">${rows}</div>

      <div class="danger-zone">
        <button type="button" class="btn danger" data-action="reset">🗑️ איפוס כל ההתקדמות</button>
        <p>האיפוס מוחק XP, כוכבים והיסטוריה מהמחשב הזה בלבד.</p>
      </div>
    </section>`;
  }

  /* -------------------------------------------------------
     Game rendering
     ------------------------------------------------------- */

  function currentQ() {
    return session && session.questions[session.index] ? session.questions[session.index] : null;
  }

  function sentenceBlockHTML(q) {
    const parts = q.sentence.split("___");
    const before = parts[0] || "";
    const after = parts[1] || "";
    const noun = q.kind === "replace"
      ? `<div class="noun-chip-row"><span>החליפו את</span><span class="noun-chip" dir="ltr">${esc(q.hint)}</span><span>בכינוי מתאים</span></div>`
      : "";
    return `<div class="sentence-wrap">
      <div class="sentence-line">
        <span class="sentence" dir="ltr">${esc(before)}<span class="blank" aria-label="מקום ריק"></span>${esc(after)}</span>
        ${speaker(q.speakPrompt, "en-US", "הקראת המשפט עם מקום ריק")}
      </div>
      ${noun}
    </div>`;
  }

  function optionHTML(opt, i, isEnglish) {
    const letter = ["א", "ב", "ג", "ד"][i] || "";
    return `<div class="option" role="button" tabindex="0" data-opt="${i}" aria-label="תשובה ${letter}: ${esc(opt)}">
      <span class="opt-letter" aria-hidden="true">${letter}</span>
      <span class="opt-text ${isEnglish ? "en" : ""}" ${isEnglish ? 'dir="ltr"' : ""}>${esc(opt)}</span>
      ${isEnglish ? speaker(opt, "en-US", "הקראת התשובה") : ""}
    </div>`;
  }

  function gameHTML() {
    const q = currentQ();
    if (!q) return "";
    const g = GAMES[session.gameId];
    const total = session.questions.length;
    const pct = Math.round(((session.index + 1) / total) * 100);
    const isSentence = q.kind === "fill" || q.kind === "replace";
    const englishOptions = q.kind !== "enhe";

    let content = "";
    if (q.kind === "enhe") {
      content = `<div class="big-word-row"><span class="big-word" dir="ltr">${esc(q.word)}</span>${speaker(q.word, "en-US", "הקראת המילה")}</div>`;
    } else if (q.kind === "heen") {
      content = `<div class="big-word-row"><span class="big-word he ${q.wordHe.length > 10 ? "long" : ""}">${esc(q.wordHe)}</span>${heSpeaker(q.wordHe)}</div>`;
    } else {
      content = sentenceBlockHTML(q);
    }

    const hint = isSentence
      ? `<div class="hint-row">
          <button type="button" class="hint-btn" data-action="hint" aria-expanded="false">💡 רמז בעברית</button>
          <div class="hint-panel" id="hint-panel" hidden><span>${esc(q.he)}</span>${heSpeaker(q.he, "הקראת הרמז")}</div>
        </div>`
      : "";

    const options = q.options.map((opt, i) => optionHTML(opt, i, englishOptions)).join("");

    return `<section class="game-view" style="--accent: var(--${g.accent})">
      <div class="game-progress">
        <div class="progress-track"><div class="progress-fill" style="--p:${pct}%"></div></div>
        <span class="progress-label">${pct}%</span>
      </div>
      <div class="question-card">
        <div class="q-meta">
          <span class="q-index">שאלה ${session.index + 1} מתוך ${total}</span>
          <div class="q-stats">
            <span class="chip streak" id="streak-chip">🔥 ${session.streak}</span>
            <span class="chip score" id="score-chip">⭐ ${session.correct * 10}</span>
          </div>
        </div>
        <p class="q-prompt">${esc(q.prompt)}</p>
        <div class="q-content">${content}</div>
        ${hint}
        <div class="options" id="options">${options}</div>
        <div class="feedback" id="feedback" hidden aria-live="polite"></div>
      </div>
    </section>`;
  }

  /* -------------------------------------------------------
     Answering
     ------------------------------------------------------- */

  function answer(index, el) {
    if (!session || session.answered) return;
    const q = currentQ();
    if (!q) return;
    const choice = q.options[index];
    if (typeof choice === "undefined") return;

    stopSpeech();
    const isCorrect = choice === q.answer;
    session.answered = true;
    session.selected = index;

    if (isCorrect) {
      session.correct++;
      session.streak++;
      session.bestStreak = Math.max(session.bestStreak || 0, session.streak);
      sfx("correct");
      if (el) {
        const rect = el.getBoundingClientRect();
        burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 38);
      }
    } else {
      session.streak = 0;
      session.wrong.push({ q, choice });
      sfx("wrong");
    }

    const optionEls = Array.from(document.querySelectorAll("#options .option"));
    optionEls.forEach((opt, i) => {
      opt.classList.add("locked");
      opt.setAttribute("aria-disabled", "true");
      if (q.options[i] === q.answer) opt.classList.add("correct");
      else if (i === index) opt.classList.add("wrong");
      else opt.classList.add("dim");
    });

    const scoreChip = document.getElementById("score-chip");
    if (scoreChip) {
      scoreChip.textContent = `⭐ ${session.correct * 10}`;
      scoreChip.classList.remove("bump");
      void scoreChip.offsetWidth;
      scoreChip.classList.add("bump");
    }

    const streakChip = document.getElementById("streak-chip");
    if (streakChip) {
      streakChip.textContent = `🔥 ${session.streak}`;
      streakChip.classList.toggle("hot", session.streak >= 3);
      if (isCorrect) {
        streakChip.classList.remove("bump");
        void streakChip.offsetWidth;
        streakChip.classList.add("bump");
      }
    }

    const hintBtn = document.querySelector(".hint-btn");
    const hintPanel = document.getElementById("hint-panel");
    if (hintBtn) hintBtn.hidden = true;
    if (hintPanel) hintPanel.hidden = true;

    const feedback = document.getElementById("feedback");
    if (feedback) {
      feedback.innerHTML = feedbackHTML(q, isCorrect, choice);
      feedback.hidden = false;
      if (window.innerWidth < 760) {
        setTimeout(() => feedback.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
      }
    }
  }

  function feedbackHTML(q, isCorrect, choice) {
    const praise = PRAISE[Math.floor(Math.random() * PRAISE.length)];
    let answerLine = "";

    if (q.kind === "enhe") {
      answerLine = `<div class="fb-answer">
        <span class="en" dir="ltr">${esc(q.word)}</span>
        <span class="eq">=</span>
        <span>${esc(q.answer)}</span>
        ${speaker(q.word, "en-US", "הקראת המילה")}
      </div>`;
    } else if (q.kind === "heen") {
      answerLine = `<div class="fb-answer">
        <span>${esc(q.wordHe)}</span>
        <span class="eq">=</span>
        <span class="en" dir="ltr">${esc(q.answer)}</span>
        ${speaker(q.answer, "en-US", "הקראת התשובה")}
      </div>`;
    } else {
      answerLine = `<div class="fb-sentence">
        <span>${highlight(q.completed, q.answer)}</span>
        ${speaker(q.completed, "en-US", "הקראת המשפט")}
      </div>
      <div class="fb-he">${esc(q.he)}</div>`;
    }

    const nextLabel = session.index + 1 >= session.questions.length ? "לתוצאות" : "המשך";
    return `<div class="feedback-inner ${isCorrect ? "is-correct" : "is-wrong"}">
      <div class="fb-icon" aria-hidden="true">${isCorrect ? "✓" : "!"}</div>
      <div class="fb-copy">
        <div class="fb-head">
          <strong>${isCorrect ? praise : "כמעט!"}</strong>
          ${!isCorrect ? `<span class="fb-correct">התשובה הנכונה: <b><bdi>${esc(q.answer)}</bdi></b></span><span class="fb-picked">בחרתם: <bdi>${esc(choice)}</bdi></span>` : ""}
        </div>
        ${answerLine}
        <p class="fb-why">${esc(q.why)}</p>
        <button type="button" class="btn primary fb-next" data-action="next">${nextLabel} ←</button>
      </div>
    </div>`;
  }

  /* -------------------------------------------------------
     Finishing a game
     ------------------------------------------------------- */

  function nextQuestion() {
    if (!session) return;
    stopSpeech();
    sfx("click");
    if (session.index + 1 >= session.questions.length) {
      finishGame();
      return;
    }
    session.index++;
    session.answered = false;
    session.selected = null;
    session.hintOpen = false;
    render();
  }

  function finishGame() {
    if (!session) return;
    const id = session.gameId;
    const total = session.questions.length;
    const correct = session.correct;
    const accuracy = total ? correct / total : 0;
    const stars = starsFor(accuracy);
    const score = correct * 10;
    const xp = score + 10 + (correct === total ? 20 : 0);
    const hadPlayed = !!state.games[id];
    const prevBest = Number(state.games[id] && state.games[id].bestAccuracy) || 0;
    const beforeLevel = levelInfo(state.xp);

    state.xp += xp;
    const afterLevel = levelInfo(state.xp);

    const g = state.games[id] || {
      plays: 0,
      bestAccuracy: 0,
      bestScore: 0,
      lastAccuracy: 0,
      lastScore: 0,
      stars: 0,
      correct: 0,
      total: 0,
    };
    g.plays = (Number(g.plays) || 0) + 1;
    g.correct = (Number(g.correct) || 0) + correct;
    g.total = (Number(g.total) || 0) + total;
    g.lastAccuracy = accuracy;
    g.lastScore = score;
    if (accuracy > prevBest) {
      g.bestAccuracy = accuracy;
      g.bestScore = score;
    }
    g.stars = Math.max(Number(g.stars) || 0, stars);
    state.games[id] = g;

    state.history.push({ game: id, correct, total, score, accuracy, date: Date.now() });
    if (state.history.length > 80) state.history = state.history.slice(-80);
    save();

    session.result = {
      total,
      correct,
      accuracy,
      stars,
      score,
      xp,
      hadPlayed,
      isNewBest: accuracy > prevBest,
      leveledUp: afterLevel.index > beforeLevel.index,
      levelName: afterLevel.name,
      wrong: session.wrong,
    };
    view = { name: "results" };
    render();
  }

  /* -------------------------------------------------------
     Results
     ------------------------------------------------------- */

  function reviewItemHTML(w) {
    const q = w.q;
    if (q.kind === "enhe") {
      return `<div class="review-item">
        <div class="review-q"><span class="en" dir="ltr">${esc(q.word)}</span> = ${esc(q.answer)}</div>
        <div class="review-a">בחרתם: <bdi>${esc(w.choice)}</bdi> ${speaker(q.word, "en-US", "הקראת המילה")}</div>
        <p class="review-why">${esc(q.why)}</p>
      </div>`;
    }
    if (q.kind === "heen") {
      return `<div class="review-item">
        <div class="review-q">${esc(q.wordHe)} = <span class="en" dir="ltr">${esc(q.answer)}</span></div>
        <div class="review-a">בחרתם: <bdi>${esc(w.choice)}</bdi> ${speaker(q.answer, "en-US", "הקראת התשובה")}</div>
        <p class="review-why">${esc(q.why)}</p>
      </div>`;
    }
    return `<div class="review-item">
      <div class="review-q en">${highlight(q.completed, q.answer)} ${speaker(q.completed, "en-US", "הקראת המשפט")}</div>
      <div class="review-a">בחרתם: <bdi>${esc(w.choice)}</bdi> · ${esc(q.he)}</div>
      <p class="review-why">${esc(q.why)}</p>
    </div>`;
  }

  function resultsHTML() {
    const r = session.result;
    const g = GAMES[session.gameId];
    const pct = Math.round(r.accuracy * 100);
    const target = (326.73 * (1 - r.accuracy)).toFixed(1);
    const badge = r.stars === 3 ? "🏆" : r.stars === 2 ? "🌟" : r.stars === 1 ? "💪" : "🌱";
    const heading = r.stars === 3 ? "אלופים!" : r.stars === 2 ? "כל הכבוד!" : r.stars === 1 ? "התחלה טובה!" : "ממשיכים!";
    const message = r.stars === 3
      ? "מדהים! אתם מוכנים למבחן."
      : r.stars === 2
        ? "יפה מאוד! עוד סיבוב קטן ואתם שם."
        : r.stars === 1
          ? "התחלה טובה — כל סיבוב משפר."
          : "לא נורא! קודם לומדים, ואז מנסים שוב.";
    const badges = [
      r.isNewBest ? `<span class="result-badge-pill">${r.hadPlayed ? "🏅 שיא חדש!" : "🏅 שיא ראשון!"}</span>` : "",
      r.leveledUp ? `<span class="result-badge-pill level">⬆️ עליתם לרמה ${esc(r.levelName)}</span>` : "",
      r.correct === r.total ? `<span class="result-badge-pill">✨ מושלם</span>` : "",
    ].join("");
    const review = r.wrong.length
      ? `<details class="review" open>
          <summary><span>🔁 מה כדאי לחזור עליו</span><span class="review-count">${r.wrong.length}</span></summary>
          <div class="review-body">${r.wrong.map(reviewItemHTML).join("")}</div>
        </details>`
      : `<div class="review-empty">🎉 אין טעויות בסיבוב הזה. מושלם!</div>`;

    return `<section class="results">
      <div class="result-hero">
        <div class="result-badge" aria-hidden="true">${badge}</div>
        <h1>${heading}</h1>
        <p>${message}${g ? ` המשחק: ${esc(g.title)}.` : ""}</p>
        <div class="result-stars" aria-label="${r.stars} מתוך 3 כוכבים">${starHTML(r.stars)}</div>
        <div class="score-ring-wrap">
          <svg class="score-ring" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop stop-color="#6ff2c0"/>
                <stop offset="1" stop-color="#74c8ff"/>
              </linearGradient>
            </defs>
            <circle class="ring-bg" cx="60" cy="60" r="52"></circle>
            <circle class="ring-fill" cx="60" cy="60" r="52" style="--target:${target}"></circle>
          </svg>
          <div class="score-ring-inner"><strong>${pct}%</strong><span>דיוק</span></div>
        </div>
        <div class="result-badges">${badges}</div>
        <div class="result-stats">
          <div class="result-stat"><strong>${r.correct}/${r.total}</strong><span>תשובות נכונות</span></div>
          <div class="result-stat"><strong>${r.score}</strong><span>ניקוד</span></div>
          <div class="result-stat"><strong dir="ltr">+${r.xp}</strong><span>XP</span></div>
        </div>
      </div>
      ${review}
      <div class="result-actions">
        <button type="button" class="btn primary" data-action="replay">🔁 עוד סיבוב</button>
        <button type="button" class="btn ghost" data-nav="home">🏠 לכל המשחקים</button>
        <button type="button" class="btn ghost" data-nav="learn">📚 לומדים</button>
      </div>
    </section>`;
  }

  function afterResults() {
    const run = session;
    if (!run || !run.result) return;
    const r = run.result;
    if (r.stars >= 2) {
      setTimeout(() => {
        if (view.name !== "results" || session !== run) return;
        sfx("win");
        burst(window.innerWidth / 2, window.innerHeight * 0.32, 70);
      }, 260);
      setTimeout(() => {
        if (view.name !== "results" || session !== run) return;
        burst(window.innerWidth * 0.25, window.innerHeight * 0.4, 38);
      }, 640);
      setTimeout(() => {
        if (view.name !== "results" || session !== run) return;
        burst(window.innerWidth * 0.75, window.innerHeight * 0.4, 38);
      }, 900);
    } else if (r.correct > 0) {
      setTimeout(() => {
        if (view.name !== "results" || session !== run) return;
        sfx("star");
      }, 300);
    }
  }

  /* -------------------------------------------------------
     Navigation and actions
     ------------------------------------------------------- */

  function startGame(id) {
    if (!GAMES[id]) return;
    stopSpeech();
    const questions = buildQuestions(id);
    if (!questions.length) {
      toast("לא נמצאו שאלות למשחק הזה");
      return;
    }
    sfx("click");
    session = {
      gameId: id,
      questions,
      index: 0,
      correct: 0,
      wrong: [],
      answered: false,
      selected: null,
      streak: 0,
      bestStreak: 0,
      result: null,
    };
    view = { name: "game" };
    render();
  }

  function go(name) {
    if (name === "game") return;
    stopSpeech();
    session = null;
    view = { name };
    render();
  }

  function goBack() {
    if (view.name === "game" && session && (session.answered || session.correct > 0)) {
      if (!window.confirm("לצאת מהסיבוב? ההתקדמות בסיבוב הזה לא תישמר.")) return;
    }
    stopSpeech();
    session = null;
    view = { name: "home" };
    render();
  }

  function resetProgress() {
    if (!window.confirm("לאפס את כל ההתקדמות? אי אפשר לבטל את זה.")) return;
    const sound = state.sound;
    stopSpeech();
    state = defaultState();
    state.sound = sound;
    save();
    toast("ההתקדמות אופסה");
    session = null;
    view = { name: "home" };
    render();
  }

  function toggleSound() {
    state.sound = !state.sound;
    save();
    if (state.sound) sfx("click");
    renderTopbar();
    toast(state.sound ? "צלילי המשחק הופעלו" : "צלילי המשחק הושתקו");
  }

  function handleAction(action, el) {
    switch (action) {
      case "sound":
        toggleSound();
        break;
      case "back":
        goBack();
        break;
      case "random": {
        const ids = Object.keys(GAMES);
        startGame(ids[Math.floor(Math.random() * ids.length)]);
        break;
      }
      case "next":
        nextQuestion();
        break;
      case "hint": {
        const panel = document.getElementById("hint-panel");
        if (!panel) break;
        const willOpen = panel.hidden;
        panel.hidden = !willOpen;
        if (el) el.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) sfx("click");
        break;
      }
      case "replay":
        if (session) startGame(session.gameId);
        break;
      case "reset":
        resetProgress();
        break;
      default:
        break;
    }
  }

  /* -------------------------------------------------------
     Events
     ------------------------------------------------------- */

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const speakBtn = target.closest("[data-speak]");
    if (speakBtn) {
      event.preventDefault();
      event.stopPropagation();
      speak(speakBtn.dataset.speak || "", speakBtn.dataset.lang || "en-US", speakBtn);
      return;
    }

    const navBtn = target.closest("[data-nav]");
    if (navBtn) {
      go(navBtn.dataset.nav);
      return;
    }

    const gameBtn = target.closest("[data-game]");
    if (gameBtn) {
      startGame(gameBtn.dataset.game);
      return;
    }

    const actionBtn = target.closest("[data-action]");
    if (actionBtn) {
      handleAction(actionBtn.dataset.action, actionBtn);
      return;
    }

    const option = target.closest(".option");
    if (option && view.name === "game" && session && !session.answered) {
      answer(Number(option.dataset.opt), option);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (view.name !== "game" || !session) return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target && event.target.closest && event.target.closest(".speak-btn")) return;
    if (session.answered) return;

    if (/^[1-4]$/.test(event.key)) {
      const index = Number(event.key) - 1;
      const option = document.querySelector(`#options .option[data-opt="${index}"]`);
      if (option) {
        event.preventDefault();
        answer(index, option);
      }
      return;
    }

    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target &&
      event.target.classList &&
      event.target.classList.contains("option")
    ) {
      event.preventDefault();
      answer(Number(event.target.dataset.opt), event.target);
    }
  });

  function onVoicesChanged() {
    refreshVoices();
    if (view.name === "learn") render();
  }

  /* -------------------------------------------------------
     Init
     ------------------------------------------------------- */

  if (synth) {
    refreshVoices();
    if (typeof synth.addEventListener === "function") {
      synth.addEventListener("voiceschanged", onVoicesChanged);
    } else {
      synth.onvoiceschanged = onVoicesChanged;
    }
  }

  render();
})();
