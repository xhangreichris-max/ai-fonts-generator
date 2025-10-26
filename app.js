
const DOM = {
  desktopInput: document.getElementById("input-text-desktop"),
  mobileInput: document.getElementById("input-text-mobile"),
  cardsRoot: document.getElementById("all-font-cards"),
  remixAllBtn: document.getElementById("btnRemixAll"),
  clearBtn: document.getElementById("btnClear"),
  remixAllBtnMobile: document.getElementById("btnRemixAllMobile"),
  clearBtnMobile: document.getElementById("btnClearMobile"),
  scrollTopBtn: document.getElementById("scrollTopBtn"),
};

/* ======= DEFENSIVE INPUT ATTRIBUTES + SPACE CAPTURE ======= */
(function setupInputDefenses() {
  const ta = DOM.desktopInput;
  const taMobile = DOM.mobileInput || null;

  [ta, taMobile].forEach(t => {
    if (!t) return;
    try {
      t.setAttribute('wrap', 'soft');
      t.setAttribute('autocomplete', 'off');
      t.setAttribute('autocorrect', 'off');
      t.setAttribute('autocapitalize', 'off');
      t.setAttribute('spellcheck', 'false');
      t.setAttribute('inputmode', 'text');
      t.style.whiteSpace = 'pre-wrap';
    } catch (e) {}
  });

  function captureSpaceWhenFocused(e) {
    if (e.type !== 'keydown') return;
    const isSpace = e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';
    if (!isSpace) return;
    const active = document.activeElement;
    const isEditing = (active === ta) || (taMobile && active === taMobile);
    if (isEditing) {
      e.stopImmediatePropagation?.();
      e.stopPropagation();
      return;
    }
  }
  document.addEventListener('keydown', captureSpaceWhenFocused, true);

  let composing = false;
  function onCompositionStart() { composing = true; }
  function onCompositionEnd() { composing = false; }
  if (ta) { ta.addEventListener('compositionstart', onCompositionStart); ta.addEventListener('compositionend', onCompositionEnd); }
  if (taMobile) { taMobile.addEventListener('compositionstart', onCompositionStart); taMobile.addEventListener('compositionend', onCompositionEnd); }
})();

/* ------------------ Utilities ------------------ */
const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
function debounce(fn, ms = 160) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
function toast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText =
      "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);padding:8px 12px;border-radius:10px;background:#10151b;color:#eef3f7;font:13px/1.2 system-ui,sans-serif;border:1px solid #1e2731;z-index:9999;opacity:0;transition:opacity .18s ease";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(() => (t.style.opacity = "0"), 950);
}
function escapeHTML(s = "") {
  return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

/* ------------------ RNG / Hash ------------------ */
const mulberry32 = (a) => () => {
  let t = (a += 0x6D2B79F5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
function hashStr(s = "") {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
let GLOBAL_SEED = (Math.random() * 0xFFFFFFFF) >>> 0;

/* ------------------ Grapheme & Char Guards ------------------ */
const SEG = (typeof Intl !== "undefined" && Intl.Segmenter)
  ? new Intl.Segmenter("en", { granularity: "grapheme" })
  : null;
const GRAPHEMES = s => SEG ? Array.from(SEG.segment(s || ""), x => x.segment) : Array.from(s || "");
const reAlphaNum = /\p{L}|\p{N}/u;
const hasEmoji = ch => /\p{Extended_Pictographic}/u.test(ch);

/* ------------------ Palettes / Frames / Marks ------------------ */
const PALETTES = {
  cuneiform: ["𒀭","𒀹","𒅗","𒄿","𒌋","𒊭","𒉿","𒁹"],
  linearB:   ["𐂀","𐂁","𐂂","𐂃","𐂄","𐂅"],
  zodiac:    ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"],
  alchemy:   ["🜁","🜂","🜃","🜄","🜍","🜏","🝙"],
  geom:      ["◇","◆","◈","⌬","◬","◩","◪","⟡"],
  stars:     ["✦","✶","✷","✺","✧","❖","⋆","✹","✸"],
  hearts:    ["♥","❥","♡","❤","💖","💗"],
  runes:     ["ᚨ","ᚢ","ᚱ","ᚲ","ᚷ","ᚺ","ᛟ","ᛏ","ᛉ","ᛞ"],
  flora:     ["❀","❁","✿","✾","❋","⚘","🌸"],
  tech:      ["▣","◧","◨","⟊","⌗","⟴","⟰"],
  occult:    ["✠","☥","☩","⛧","†","✟"],
};
const FRAMES = {
  ancient: [["𒀭","𒀭"],["𒀹","𒀹"],["❖","❖"]],
  mystic:  [["✧","✧"],["⋆","⋆"],["☾","☽"]],
  dark:    [["✠","✠"],["†","†"],["⛧","⛧"]],
  ocean:   [["༄","༄"],["🌊","🌊"],["☽","☾"]],
  frost:   [["❄︎","❄︎"],["☾","☾"]],
  fire:    [["🔥","🔥"],["✦","✦"]],
  tech:    [["◈","◈"],["▣","▣"]],
  soft:    [["❀","❀"],["♥","♥"],["✿","✿"]],
  none:    [],
};
const DIACRITICS = ["\u0307","\u0323","\u0331","\u0304","\u0335","\u0346","\u0357","\u0332","\u035B"];
const THINSP = ["\u2006","\u2007","\u2009","\u200A","\u202F"];

/* ------------------ Rules (per-category + name spices) ------------------ */
const BASE_RULES = {
  "Featured Styles":                 { di:0.22, sp:0.14, ls:0.12, mid:0.45, frame:0.45, pal:["cuneiform","geom"], fr:"ancient" },
  "Exotic & International":          { di:0.14, sp:0.12, ls:0.10, mid:0.30, frame:0.25, pal:["runes","zodiac","geom"], fr:"mystic" },
  "Algorithmic & Combining Marks":   { di:0.40, sp:0.18, ls:0.08, mid:0.15, frame:0.15, pal:["stars"], fr:"none" },
  "Flourish Decorated":              { di:0.10, sp:0.16, ls:0.06, mid:0.25, frame:0.20, pal:["hearts","flora","stars"], fr:"soft" },
  "Classic Styles":                  { di:0.06, sp:0.10, ls:0.02, mid:0.05, frame:0.05, pal:["stars"], fr:"none" },
  "Complex / Glitched":              { di:0.24, sp:0.14, ls:0.14, mid:0.30, frame:0.30, pal:["alchemy","geom","tech"], fr:"tech" },
  Misc:                              { di:0.10, sp:0.10, ls:0.06, mid:0.20, frame:0.15, pal:["stars"], fr:"none" },
};
function applyNameSpice(rules, name="") {
  name = (name||"").toLowerCase();
  const r = { ...rules };
  const bump = (k,v)=> r[k]=(r[k]??0)+v;
  if (/\b(ancient|hieroglyph|glyph)\b/.test(name)) { r.pal=["cuneiform","linearB","geom"]; r.fr="ancient"; bump("di",0.04); bump("mid",0.10); r.frame=Math.max(r.frame,0.55); }
  if (/\b(runic|rune)\b/.test(name))               { r.pal=["runes","zodiac"]; r.fr="mystic"; r.mid = Math.max(r.mid,0.35); }
  if (/\b(vaporwave|full\s?width)\b/.test(name))   { r.pal=["stars","geom"]; r.fr="soft"; r.sp = Math.max(r.sp,0.22); }
  if (/\b(fraktur|medieval|demon)\b/.test(name))   { r.pal=["occult","alchemy"]; r.fr="dark"; bump("di",0.08); r.frame=Math.max(r.frame,0.35); }
  if (/\b(alien|ufo|xeno)\b/.test(name))           { r.pal=["tech","geom","zodiac"]; r.fr="tech"; bump("ls",0.06); }
  return r;
}
function getRulesForStyle(style) {
  const cat = style.category || style.pack || "Misc";
  const base = BASE_RULES[cat] || BASE_RULES.Misc;
  return applyNameSpice(base, style.name || "");
}

/* ------------------ Base render (map/transform) ------------------ */
function applyMapFallback(text, map) {
  return text
    .split("")
    .map((ch) => map?.[ch] ?? map?.[ch.toLowerCase()] ?? map?.[ch.toUpperCase()] ?? ch)
    .join("");
}
const APPLY_MAP = typeof window.applyMap === "function" ? window.applyMap : applyMapFallback;

function styleBase(style, text) {
  if (typeof style.transform === "function") return style.transform(text);
  if (style.map) return APPLY_MAP(text, style.map);
  return text;
}

/* ------------------ Decoration engine ------------------ */
function decorateWithRules(baseText, rng, rules) {
  const gs = GRAPHEMES(baseText);
  const len = gs.length || 1;

  const scale = len < 6 ? (0.5 + len / 12) : 1;

  const diRate  = (rules.di   || 0) * scale;
  const spRate  = (rules.sp   || 0) * scale;
  const lsRate  = (rules.ls   || 0) * scale;
  const midRate = (rules.mid  || 0) * scale;
  const frameP  = (rules.frame|| 0);

  const palName = (rules.pal && rules.pal[(rng()*rules.pal.length)|0]) || "stars";
  const palette = PALETTES[palName] || PALETTES.stars;

  let out = "";
  for (const g of gs) {
    out += g;
    if (!reAlphaNum.test(g) || hasEmoji(g)) continue;

    if (rng() < diRate) {
      out += DIACRITICS[(rng()*DIACRITICS.length)|0];
    }
    if (rng() < spRate) {
      out += THINSP[(rng()*THINSP.length)|0];
    }
    if (rng() < lsRate) {
      const sym = palette[(rng()*palette.length)|0];
      const ts  = THINSP[(rng()*THINSP.length)|0];
      out += ts + sym + ts;
    }
  }

  if (len > 3 && rng() < midRate) {
    const bead = palette[(rng()*palette.length)|0];
    const i = (len/2)|0;
    out = gs.slice(0,i).join("") + THINSP[0] + bead + THINSP[0] + gs.slice(i).join("");
  }

  const frameSet = FRAMES[rules.fr] || [];
  if (len >= 4 && frameSet.length && rng() < frameP) {
    const [L,R] = frameSet[(rng()*frameSet.length)|0];
    out = L + THINSP[0] + out + THINSP[0] + R;
  }

  return out.normalize ? out.normalize("NFC") : out;
}

/* ------------------ Deterministic composer ------------------ */
function styleKey(style, globalOrdinal) {
  const k = `${(style.category||style.pack||"")}|${style.name || ""}|${globalOrdinal}`;
  return String(hashStr(k));
}
function styleOutput(style, text, seedBump, globalOrdinal) {
  const base = styleBase(style, text);
  if (style.pure) return base;

  const keySeed = hashStr((style.category || style.pack || "") + "|" + (style.name || ""));
  const seed = (GLOBAL_SEED + keySeed + (seedBump|0) + (globalOrdinal|0)) >>> 0;
  const rng  = mulberry32(seed);
  const rules = getRulesForStyle(style);
  return decorateWithRules(base, rng, rules);
}

/* ------------------ Load & Normalize Styles ------------------ */
function normalizeStyle(s) {
  return {
    ...s,
    category: s.category || s.pack || "Misc",
    name: s.name || s.title || "Untitled",
  };
}
function dedupeByNameAndCat(list){
  const seen = new Set();
  const out = [];
  list.forEach(s => {
    const key = (s.name + "@" + (s.category||s.pack||"Misc")).toLowerCase();
    if (seen.has(key)) return;
    seen.add(key); out.push(s);
  });
  return out;
}

// UNION: window.styles + window.FONT_STYLES
const RAW_A = Array.isArray(window.styles) ? window.styles : [];
const RAW_B = Array.isArray(window.FONT_STYLES) ? window.FONT_STYLES : [];
let ALL_STYLES = dedupeByNameAndCat([...RAW_A, ...RAW_B].map(normalizeStyle));

if (!ALL_STYLES.length) {
  console.warn('[AI Fonts] No styles found. Check that fonts.js loads before app.js and exports window.styles or window.FONT_STYLES.');
}

/* ------------------ Data & State ------------------ */
const PAGE_SIZE = 24;
function groupByCategory(list) {
  const buckets = {};
  list.forEach((s) => {
    const cat = s.category || s.pack || "Misc";
    (buckets[cat] ||= []).push(s);
  });
  return Object.entries(buckets)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([cat, arr]) => [cat, arr.sort((x, y) => (x.name || "").localeCompare(y.name || ""))]);
}

const state = {
  text: (DOM.desktopInput?.value ?? DOM.mobileInput?.value ?? "Aifontsgenerator"),
  categories: groupByCategory(ALL_STYLES),
  pageIndex: 0,
  bumps: new Map(),
};

/* ------------------ Helpers for render order ------------------ */
function buildFlatOrder() {
  const flat = [];
  state.categories.forEach(([_, arr]) => flat.push(...arr));
  return flat;
}

/* ------------------ Rendering ------------------ */
function cardHTML(style, ord, showNew = false) {
  const key = styleKey(style, ord);
  const bump = state.bumps.get(key) || 0;
  const preview = styleOutput(style, state.text, bump, ord);

  return `
    <article class="glass-card group cursor-pointer"
             data-ord="${ord}" data-key="${key}">
      ${showNew ? `<div class="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full" style="background:#e60606;color:#fff">NEW</div>` : ""}
      <div class="font-sample">${escapeHTML(preview)}</div>

      <div class="card-bar">
        <div class="text-[11px] uppercase tracking-wide">${escapeHTML(style.category || style.pack || "Misc")}</div>
        <div class="flex items-center gap-2">
          <button class="mini primary copy-btn" title="Copy">Share&nbsp;It</button>
          <button class="mini remix-btn" title="Remix this">Remix&nbsp;🎲</button>
        </div>
      </div>
    </article>
  `;
}

function sectionHTML(category, innerCards) {
  return `
    <section>
      <h2 class="nf-cat font-semibold text-gray-2 00/90 mb-2">${escapeHTML(category)}</h2>
      <div class="grid-wrap">
        ${innerCards}
      </div>
    </section>
  `;
}

function renderAll() {
  if (!DOM.cardsRoot) return;

  const maybeA = Array.isArray(window.styles) ? window.styles : [];
  const maybeB = Array.isArray(window.FONT_STYLES) ? window.FONT_STYLES : [];
  const merged = dedupeByNameAndCat([...maybeA, ...maybeB].map(normalizeStyle));
  if (merged.length !== ALL_STYLES.length) {
    ALL_STYLES = merged;
    state.categories = groupByCategory(ALL_STYLES);
    const maxPage = Math.max(0, Math.ceil(ALL_STYLES.length / PAGE_SIZE) - 1);
    state.pageIndex = Math.min(state.pageIndex, maxPage);
  }

  const flat = buildFlatOrder();
  const start = state.pageIndex * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, flat.length);
  const visible = flat.slice(start, end);

  const catMap = new Map();
  visible.forEach((s) => {
    const c = s.category || s.pack || "Misc";
    (catMap.get(c) || catMap.set(c, []).get(c)).push(s);
  });

  let newLeft = 0;
  const htmlParts = [];

  state.categories.forEach(([cat]) => {
    const arr = catMap.get(cat);
    if (!arr || !arr.length) return;

    const cards = arr.map((style) => {
      const ord = start + visible.indexOf(style);
      const showNew = (newLeft-- > 0);
      return cardHTML(style, ord, showNew);
    }).join("");

    htmlParts.push(sectionHTML(cat, cards));
  });

  DOM.cardsRoot.innerHTML = htmlParts.join("");
}

/* ------------------ Paging + Smooth Scroll ------------------ */
function goToNextPageAndScroll() {
  const flat = buildFlatOrder();
  const total = flat.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  state.pageIndex = (state.pageIndex + 1) % pages; // wrap to first after last
  renderAll();

  const header = document.querySelector('header.site-header');
  const headerH = header ? header.getBoundingClientRect().height : 0;
  const gridTop = (DOM.cardsRoot?.getBoundingClientRect().top || 0) + window.pageYOffset;
  window.scrollTo({ top: Math.max(0, gridTop - headerH - 10), behavior: 'smooth' });

  toast('Showing next batch');
}

/* ------------------ Desktop "Next ⟳" Button ------------------ */
function ensureDesktopNextButton() {
  const bar = document.querySelector('.top-input-inner');
  if (!bar || document.getElementById('btnNextDesktop')) return;

  const btn = document.createElement('button');
  btn.id = 'btnNextDesktop';
  btn.type = 'button';
  btn.className = 'btn';
  btn.textContent = 'Next ⟳';
  btn.style.fontWeight = '700';

  // Only show on desktop
  const mq = window.matchMedia('(min-width: 1024px)');
  const apply = () => { btn.style.display = mq.matches ? 'inline-flex' : 'none'; };
  mq.addEventListener?.('change', apply); apply();

  btn.addEventListener('click', goToNextPageAndScroll);

  const remix = DOM.remixAllBtn;
  if (remix && remix.parentNode === bar) {
    remix.insertAdjacentElement('afterend', btn);
  } else {
    bar.appendChild(btn);
  }
}

/* ------------------ Mobile FAB (one floating button) ------------------ */
function createMobileRegenerateFab() {
  if (document.getElementById('fabNextBatch')) return;

  const btn = document.createElement('button');
  btn.id = 'fabNextBatch';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Regenerate (next batch)');
  btn.textContent = '⟳';

  btn.style.cssText = `
    position: fixed;
    right: 16px;
    bottom: 88px;
    z-index: 1002;
    width: 56px; height: 56px;
    border-radius: 50%;
    border: none;
    font: 800 20px/1 Inter, system-ui, sans-serif;
    color: #fff;
    background: linear-gradient(135deg, #7c3aed, #06b6d4);
    box-shadow: 0 10px 26px rgba(0,0,0,.35);
    cursor: pointer;
    transition: transform .18s ease, box-shadow .18s ease, opacity .18s ease;
    display: none;
    align-items: center;
    justify-content: center;
  `;

  const mq = window.matchMedia('(max-width: 1023.98px)');
  const applyVisibility = () => { btn.style.display = mq.matches ? 'flex' : 'none'; };
  mq.addEventListener?.('change', applyVisibility);
  applyVisibility();

  btn.addEventListener('click', goToNextPageAndScroll);
  document.body.appendChild(btn);
}

/* ------------------ Interactions ------------------ */
function syncInputs(v) {
  if (DOM.desktopInput && DOM.desktopInput.value !== v) DOM.desktopInput.value = v;
  if (DOM.mobileInput && DOM.mobileInput.value !== v) DOM.mobileInput.value = v;
}

const handleInput = debounce((src) => {
  state.text = (src.value ?? "");
  syncInputs(state.text);

  const flat = buildFlatOrder();
  $all("#all-font-cards .glass-card").forEach((card) => {
    const ord = Number(card.dataset.ord);
    if (!Number.isFinite(ord)) return;
    const key = card.dataset.key;
    const style = flat[ord];
    const bump = state.bumps.get(key) || 0;
    const out = styleOutput(style, state.text, bump, ord);
    const sample = card.querySelector(".font-sample");
    if (sample) sample.textContent = out;
  });
}, 140);

DOM.desktopInput?.addEventListener("input", () => handleInput(DOM.desktopInput));
DOM.mobileInput ?.addEventListener("input", () => handleInput(DOM.mobileInput));

DOM.cardsRoot?.addEventListener("click", (e) => {
  const card = e.target.closest(".glass-card");
  if (!card) return;

  const ord = Number(card.dataset.ord);
  const key = card.dataset.key;
  const flat = buildFlatOrder();
  const style = flat[ord];
  if (!style) return;

  if (e.target.closest(".remix-btn")) {
    state.bumps.set(key, (state.bumps.get(key) || 0) + 1);
    const bump = state.bumps.get(key) || 0;
    const out = styleOutput(style, state.text, bump, ord);
    const sample = card.querySelector(".font-sample");
    if (sample) sample.textContent = out;
    return;
  }

  if (e.target.closest(".copy-btn") || !e.target.closest(".remix-btn")) {
    const bump = state.bumps.get(key) || 0;
    const out = styleOutput(style, state.text, bump, ord);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(out).then(() => toast("Copied!")).catch(() => fallbackCopy(out));
    } else {
      fallbackCopy(out);
    }
  }
});

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:absolute;left:-9999px;top:-9999px";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); toast("Copied!"); } catch {}
  document.body.removeChild(ta);
}

// Remix All (desktop + mobile)
function remixAll() {
  $all("#all-font-cards .glass-card").forEach((card) => {
    const key = card.dataset.key;
    state.bumps.set(key, (state.bumps.get(key) || 0) + 1);
  });
  renderAll();
  toast("Regenerated");
}
DOM.remixAllBtn?.addEventListener("click", remixAll);
DOM.remixAllBtnMobile?.addEventListener("click", goToNextPageAndScroll); // mobile button = next batch

// Clear (desktop + mobile)
function clearAll() {
  state.text = "";
  syncInputs("");
  renderAll();
}
DOM.clearBtn?.addEventListener("click", clearAll);
DOM.clearBtnMobile?.addEventListener("click", clearAll);

// Scroll-to-top reveal (if you later wire a #scrollTopBtn)
function onScroll() {
  const y = window.scrollY || document.documentElement.scrollTop;
  if (!DOM.scrollTopBtn) return;
  DOM.scrollTopBtn.classList.toggle("hidden", y < 600);
}
window.addEventListener("scroll", onScroll);

/* ------------------ Boot ------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const initial = (DOM.desktopInput?.value ?? DOM.mobileInput?.value ?? state.text);
  state.text = initial;
  syncInputs(initial);
  renderAll();

  // New: add desktop "Next ⟳" and mobile floating FAB
  ensureDesktopNextButton();
  createMobileRegenerateFab();

  // re-render on breakpoint (if line-length affects layout)
  window.matchMedia("(min-width: 1024px)").addEventListener("change", renderAll);
});
