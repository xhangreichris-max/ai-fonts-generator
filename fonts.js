/**
 * =================================================================
 * FONTIFIER FONTS DATABASE (fonts.js)
 * =================================================================
 * Unicode-safe helpers + style definitions + 40 Remix styles (20 original + 20 fusion)
 * Exposed as: window.applyMap, window.applyCombining, window.styles
 * =================================================================
 */

/* ------------------ Unicode-safe helpers ------------------ */

// Grapheme splitter (emoji-safe). Uses Intl.Segmenter if available.
function toGraphemes(str) {
  if (!str) return [];
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return Array.from(seg.segment(str), s => s.segment);
  }
  // Fallback: Array.from handles code points (better than split(''))
  return Array.from(str);
}

// A–Z / digits? (decorate only these; leave emojis/symbols alone)
function isLetterOrDigit(ch) {
  return /\p{L}|\p{Nd}/u.test(ch);
}

// Map text using a map (don’t break emojis, keep case fallbacks)
function applyMap(text, map) {
  const parts = toGraphemes(text || '');
  let out = '';
  for (const ch of parts) {
    out += map[ch] ??
           (ch && map[ch.toLowerCase?.()]) ??
           (ch && map[ch.toUpperCase?.()]) ??
           ch;
  }
  return out.normalize('NFC');
}

// Apply combining marks **only** on letters/digits; leave emojis intact.
function applyCombining(text, marks, min = 1, max = 2) {
  const parts = toGraphemes(text || '');
  let out = '';
  for (const ch of parts) {
    if (!isLetterOrDigit(ch)) { out += ch; continue; }
    let c = ch;
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    for (let i = 0; i < n; i++) {
      c += marks[Math.floor(Math.random() * marks.length)];
    }
    out += c;
  }
  return out.normalize('NFC');
}

// Small utilities used by Remix styles
function thinSpace(s) { return '\u2009' + s + '\u2009'; }
function sanitizeVisible(s) {
  if (!s) return s;
  // strip controls + zero-width joiners (keep thin space we add)
  s = s.replace(/[\u0000-\u001F\u007F-\u009F\u200B\u200C\u200D]/g, '');
  // clamp absurd combining stacks
  s = s.replace(/([\u0300-\u036F]{3,})/g, m => m.slice(0, 2));
  if (s.length > 256) s = s.slice(0, 256);
  return s.normalize('NFC');
}

/* =========================================================
   Remix Builder: Base Alphabets + Style Composer
   ========================================================= */

// Base Alphabets (A–Z / a–z)
const BASES = {
  SCRIPT: {
    U: {A:'𝓐',B:'𝓑',C:'𝓒',D:'𝓓',E:'𝓔',F:'𝓕',G:'𝓖',H:'𝓗',I:'𝓘',J:'𝓙',K:'𝓚',L:'𝓛',M:'𝓜',N:'𝓝',O:'𝓞',P:'𝓟',Q:'𝓠',R:'𝓡',S:'𝓢',T:'𝓣',U:'𝓤',V:'𝓥',W:'𝓦',X:'𝓧',Y:'𝓨',Z:'𝓩'},
    L: {a:'𝓪',b:'𝓫',c:'𝓬',d:'𝓭',e:'𝓮',f:'𝓯',g:'𝓰',h:'𝓱',i:'𝓲',j:'𝓳',k:'𝓴',l:'𝓵',m:'𝓶',n:'𝓷',o:'𝓸',p:'𝓹',q:'𝓺',r:'𝓻',s:'𝓼',t:'𝓽',u:'𝓾',v:'𝓿',w:'𝔀',x:'𝔁',y:'𝔂',z:'𝔃'}
  },
  FRAKTUR: {
    U: {A:'𝔄',B:'𝔅',C:'ℭ',D:'𝔇',E:'𝔈',F:'𝔉',G:'𝔊',H:'ℌ',I:'ℑ',J:'𝔍',K:'𝔎',L:'𝔏',M:'𝔐',N:'𝔑',O:'𝒪',P:'𝔓',Q:'𝔔',R:'ℜ',S:'𝔖',T:'𝔗',U:'𝔘',V:'𝔙',W:'𝔚',X:'𝔛',Y:'𝔜',Z:'ℨ'},
    L: {a:'𝔞',b:'𝔟',c:'𝔠',d:'𝔡',e:'𝔢',f:'𝔣',g:'𝔤',h:'𝔥',i:'𝔦',j:'𝔧',k:'𝔨',l:'𝔩',m:'𝔪',n:'𝔫',o:'𝔬',p:'𝔭',q:'𝔮',r:'𝔯',s:'𝔰',t:'𝔱',u:'𝔲',v:'𝔳',w:'𝔴',x:'𝔵',y:'𝔶',z:'𝔷'}
  },
  DOUBLE: {
    U: {A:'𝔸',B:'𝔹',C:'ℂ',D:'𝔻',E:'𝔼',F:'𝔽',G:'𝔾',H:'ℍ',I:'𝕀',J:'𝕁',K:'𝕂',L:'𝕃',M:'𝕄',N:'ℕ',O:'𝕆',P:'ℙ',Q:'ℚ',R:'ℝ',S:'𝕊',T:'𝕋',U:'𝕌',V:'𝕍',W:'𝕎',X:'𝕏',Y:'𝕐',Z:'ℤ'},
    L: {a:'𝕒',b:'𝕓',c:'𝕔',d:'𝕕',e:'𝕖',f:'𝕗',g:'𝕘',h:'𝕙',i:'𝕚',j:'𝕛',k:'𝕜',l:'𝕝',m:'𝕞',n:'𝕟',o:'𝕠',p:'𝕡',q:'𝕢',r:'𝕣',s:'𝕤',t:'𝕥',u:'𝕦',v:'𝕧',w:'𝕨',x:'𝕩',y:'𝕪',z:'𝕫'}
  },
  MONO: {
    U: {A:'𝙰',B:'𝙱',C:'𝙲',D:'𝙳',E:'𝙴',F:'𝙵',G:'𝙶',H:'𝙷',I:'𝙸',J:'𝙹',K:'𝙺',L:'𝙻',M:'𝙼',N:'𝙽',O:'𝙾',P:'𝙿',Q:'𝚀',R:'𝚁',S:'𝚂',T:'𝚃',U:'𝚄',V:'𝚅',W:'𝚆',X:'𝚇',Y:'𝚈',Z:'𝚉'},
    L: {a:'𝚊',b:'𝚋',c:'𝚌',d:'𝚍',e:'𝚎',f:'𝚏',g:'𝚐',h:'𝚑',i:'𝚒',j:'𝚓',k:'𝚔',l:'𝚕',m:'𝚖',n:'𝚗',o:'𝚘',p:'𝚙',q:'𝚚',r:'𝚛',s:'𝚜',t:'𝚝',u:'𝚞',v:'𝚟',w:'𝚠',x:'𝚡',y:'𝚢',z:'𝚣'}
  },
  FULL: {
    U: {A:'Ａ',B:'Ｂ',C:'Ｃ',D:'Ｄ',E:'Ｅ',F:'Ｆ',G:'Ｇ',H:'Ｈ',I:'Ｉ',J:'Ｊ',K:'Ｋ',L:'Ｌ',M:'Ｍ',N:'Ｎ',O:'Ｏ',P:'Ｐ',Q:'Ｑ',R:'Ｒ',S:'Ｓ',T:'Ｔ',U:'Ｕ',V:'Ｖ',W:'Ｗ',X:'Ｘ',Y:'Ｙ',Z:'Ｚ'},
    L: {a:'ａ',b:'ｂ',c:'ｃ',d:'ｄ',e:'ｅ',f:'ｆ',g:'ｇ',h:'ｈ',i:'ｉ',j:'ｊ',k:'ｋ',l:'ｌ',m:'ｍ',n:'ｎ',o:'ｏ',p:'ｐ',q:'ｑ',r:'ｒ',s:'ｓ',t:'ｔ',u:'ｕ',v:'ｖ',w:'ｗ',x:'ｘ',y:'ｙ',z:'ｚ'}
  }
};

// Compose a full 52-letter map from chosen bases + overrides
function composeMap({ upperBase = 'SCRIPT', lowerBase = 'SCRIPT', overrides = {} }) {
  const U = {...BASES[upperBase].U};
  const L = {...BASES[lowerBase].L};
  return {...U, ...L, ...overrides};
}

// Build a Remix style object
function makeRemixStyle({
  name, category = 'Creative & Mixed Styles',
  frame = { pre:'', post:'' },
  bases = { upper:'SCRIPT', lower:'SCRIPT' },
  overrides = {},
  palette = [],
  micro = {}
}) {
  const map = composeMap({ upperBase: bases.upper, lowerBase: bases.lower, overrides });
  return {
    name, category, map,
    transform(text) {
      if (!text) return text;

      // 1) Base mapping
      let core = applyMap(text, map);

      // 2) Micro tweaks only on letters/digits
      const grams = toGraphemes(core).map(ch => {
        let t = ch;
        if (isLetterOrDigit(ch)) {
          if (micro.dotVowels && /[AEIOUaeiou𝓪𝓮𝓲𝓸𝓾]/u.test(ch) && Math.random() < 0.12) t += '\u0307'; // dot above
          if (micro.underline && Math.random() < 0.08) t += '\u0332'; // underline
          if (micro.altI && /[iI𝓲]/u.test(ch) && Math.random() < 0.30) t = 'ı'; // dotless i
          if (micro.tilde && Math.random() < 0.08) t += '\u0303';
          if (micro.slash && Math.random() < 0.06) t += '\u0335';
        }
        return t;
      });

      core = grams.join('');
      core = sanitizeVisible(core);

      // 3) Tasteful symbol insertion
      if (micro.allowSymbol !== false && (micro.symbolChance ?? 0.6) > Math.random() && Array.isArray(palette) && palette.length) {
        const sym = palette[Math.floor(Math.random() * palette.length)];
        const byWord = core.split(/\b/);
        if (byWord.length > 2) {
          byWord.splice(Math.floor(byWord.length / 2), 0, thinSpace(sym));
          core = byWord.join('');
        } else {
          core = sym + thinSpace(core) + sym;
        }
      }

      core = core.normalize('NFC');
      return (frame.pre || '') + thinSpace(core) + (frame.post || '');
    },
    tags: ['unique','remix','readable']
  };
}

/* =========================================================
   Your custom maps (from your previous file)
   ========================================================= */

const glitchHopMap = {
  'A': 'A', 'B': '🅑', 'C': 'C', 'D': 'Ꮄ', 'E': '𝙀', 'F': 'F', 'G': '𝓖', 'H': 'H\u0336',
  'I': '🇮', 'J': 'ʝ', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': '𝙾', 'P': 'ｱ',
  'Q': 'Q', 'R': 'Ɽ', 'S': '丂', 'T': '𝒯', 'U': 'U', 'V': 'ᐯ', 'W': '🇼', 'X': 'א',
  'Y': '░Y░', 'Z': '𝚉'
};

const bracketMixMap = {
  'A': '𝘼', 'B': '⦑B⦒', 'C': 'C', 'D': '𝘿', 'E': '𝘌', 'F': '𝙵', 'G': 'ᧁ', 'H': '🅷',
  'I': 'ⓘ', 'J': '🄹', 'K': '𝔎', 'L': 'ㄥ', 'M': 'M', 'N': 'ℕ', 'O': 'օ', 'P': 'P⃝',
  'Q': 'ᑫ', 'R': '𝑅', 'S': '𝕊', 'T': 'T', 'U': '𝐔', 'V': 'V\u0336', 'W': 'ฬ', 'X': '⦑X⦒',
  'Y': 'Y', 'Z': '⦑Z⦒'
};

const cursedScriptMap = {
  'A': 'A\u0337', 'B': 'B⃝', 'C': 'ƈ', 'D': 'ɖ', 'E': '𝐄', 'F': 'F\u0336', 'G': 'G', 'H': '𝘏',
  'I': 'i', 'J': 'J', 'K': '𝒦', 'L': 'ⓛ', 'M': 'Ｍ', 'N': 'N', 'O': 'ₒ', 'P': '🄿',
  'Q': 'ᕴ', 'R': 'R\u0337', 'S': '⦑S⦒', 'T': 'T\u0337', 'U': '🆄', 'V': 'V', 'W': 'ω',
  'X': 'x', 'Y': '¥', 'Z': 'Z'
};

const digitalDecayMap = {
  'A': 'A\u0336', 'B': 'ᗷ', 'C': 'ᄃ', 'D': '░D░', 'E': '乇', 'F': 'ᠻ', 'G': '🇬', 'H': 'H',
  'I': '𝐼', 'J': 'ʝ', 'K': 'K⃝', 'L': 'ℓ', 'M': 'M', 'N': 'ℕ', 'O': 'ට', 'P': '⦏P̂⦎',
  'Q': 'Q\u0336', 'R': '⦑R⦒', 'S': '🅂', 'T': 'Ꮦ', 'U': '𝘜', 'V': '۷', 'W': '᭙',
  'X': '𝓧', 'Y': 'Ꭹ', 'Z': 'Z\u0334'
};

const royalMixMap = {
  'A': 'ค', 'B': 'ᴮ', 'C': '匚', 'D': 'D⃝', 'E': '𝙴', 'F': '£', 'G': 'Ⓖ', 'H': 'Ή',
  'I': 'ℑ', 'J': 'ᒚ', 'K': '𝙺', 'L': '𝙻', 'M': '🄼', 'N': '𝔑', 'O': 'O', 'P': 'Ꭾ',
  'Q': 'Q\u0337', 'R': 'r', 'S': '░S░', 'T': '𝕋', 'U': '⦑U⦒', 'V': 'V\u0334', 'W': 'W\u0336',
  'X': '⫸⫷', 'Y': 'у', 'Z': '𝒵'
};

const elegantGlitchMap = {
  'A': 'ǟ', 'B': 'B', 'C': '𝙲', 'D': 'D', 'E': '𝘌', 'F': '⦑F⦒', 'G': 'G\u0334', 'H': '░H░',
  'I': '𝕀', 'J': '🇯', 'K': '𝐊', 'L': 'ⓛ', 'M': '𝕄', 'N': 'ᘉ', 'O': '𝓞', 'P': 'ᑭ',
  'Q': '𝐐', 'R': '᥅', 'S': 'Ｓ', 'T': 'T', 'U': 'ᵁ', 'V': '⦏V̂⦎', 'W': '𝓦',
  'X': '᙭', 'Y': 'Y', 'Z': 'չ'
};

const wierdMap = {
  'A': '𒀀', 'B': '𒁀', 'C': 'ℭ', 'D': '𒁓', 'E': '𝔈', 'F': '𐎣',
  'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𒁇',
  'M': '𐎠', 'N': '㞓', 'O': '𝔒', 'P': '𝔓', 'Q': '𒌒', 'R': 'Я',
  'S': '𒂍', 'T': '𒈦', 'U': '𝔘', 'V': '𐎏', 'W': '𝔚', 'X': '𒉽',
  'Y': '𒌨', 'Z': '𒑣'
};

const decorMap = {
  'A': '₳', 'B': '฿', 'C': '₵', 'D': 'Đ', 'E': 'Ɇ', 'F': '₣',
  'G': '₲', 'H': 'Ⱨ', 'I': 'Ł', 'J': 'J', 'K': '₭', 'L': 'Ⱡ',
  'M': '₥', 'N': '₦', 'O': 'Ø', 'P': '₱', 'Q': 'Q', 'R': 'Ɽ',
  'S': '₴', 'T': '₮', 'U': 'Ʉ', 'V': 'V', 'W': '₩', 'X': 'Ӿ',
  'Y': 'Ɏ', 'Z': 'Ⱬ'
};

const alienMap = {
  'A': 'ꁲ', 'B': 'ꋰ', 'C': 'ꀯ', 'D': 'ꂠ', 'E': 'ꈼ', 'F': 'ꄞ',
  'G': 'ꁅ', 'H': 'ꍩ', 'I': 'ꂑ', 'J': '꒻', 'K': 'ꀗ', 'L': '꒒',
  'M': 'ꂵ', 'N': 'ꋊ', 'O': 'ꂦ', 'P': 'ꉣ', 'Q': 'ꁷ', 'R': 'ꌅ',
  'S': 'ꌚ', 'T': 'ꋖ', 'U': 'ꐇ', 'V': 'ꀰ', 'W': 'ꅏ', 'X': 'ꇒ',
  'Y': 'ꐞ', 'Z': 'ꁴ'
};

const neonMap = {
  'A': 'ᾰ', 'B': '♭', 'C': 'ḉ', 'D': 'ᖱ', 'E': 'ḙ', 'F': 'ḟ',
  'G': '❡', 'H': 'ℏ', 'I': '!', 'J': '♩', 'K': 'к', 'L': 'ℓ',
  'M': 'Պ', 'N': 'ℵ', 'O': '✺', 'P': '℘', 'Q': 'ǭ', 'R': 'Ի',
  'S': 'ṧ', 'T': 'т', 'U': 'ṳ', 'V': 'ṽ', 'W': 'ω', 'X': '✘',
  'Y': '⑂', 'Z': 'ℨ'
};

const coolMap = {
  'A': 'A̷̺͋', 'B': 'Ḃ̵̹', 'C': 'C̶͔͆', 'D': 'D̷͍̊', 'E': 'E̵͎̕', 'F': 'F̸̢͐',
  'G': 'G̸̗̓', 'H': 'Ḩ̵̂', 'I': 'I̴̯̋', 'J': 'J̴̳̅', 'K': 'Ǩ̸͔', 'L': 'L̴̮̿',
  'M': 'M̴̼͐', 'N': 'N̷̺̏', 'O': 'Ó̸̜', 'P': 'P̸̦̈́', 'Q': 'Q̶̬͛', 'R': 'R̴͎͝',
  'S': 'S̷͚̆', 'T': 'Ť̶̳', 'U': 'U̸͉͛', 'V': 'V̴̦͌', 'W': 'W̸̲͠', 'X': 'X̵̼̍',
  'Y': 'Y̶͖̅', 'Z': 'Z̶̥̑'
};

const koolMap = {
  'A': 'Ⱥ', 'B': 'β', 'C': '↻', 'D': 'Ꭰ', 'E': 'Ɛ', 'F': 'Ƒ',
  'G': 'Ɠ', 'H': 'Ƕ', 'I': 'į', 'J': 'ل', 'K': 'Ҡ', 'L': 'Ꝉ',
  'M': 'Ɱ', 'N': 'ហ', 'O': 'ට', 'P': 'φ', 'Q': 'Ҩ', 'R': 'འ',
  'S': 'Ϛ', 'T': 'Ͳ', 'U': 'Ա', 'V': 'Ỽ', 'W': 'చ', 'X': 'ჯ',
  'Y': 'Ӌ', 'Z': 'ɀ'
};

/* =========================================================
   Base styles (your original styles)
   ========================================================= */

const BASE_STYLES = [
  // --- Featured Styles ---
  {
    name: 'Ancient Glyphs',
    category: 'Featured Styles',
    map: { 'A': '𖤬', 'B': 'ꔪ', 'C': 'ꛕ', 'D': '𖤀', 'E': '𖤟', 'F': 'ꘘ', 'G': 'ꚽ', 'H': 'ꛅ', 'I': 'ꛈ', 'J': 'ꚠ', 'K': '𖤰', 'L': 'ꚳ', 'M': '𖢑', 'N': 'ꛘ', 'O': '𖣠', 'P': 'ㄗ', 'Q': 'ꚩ', 'R': '𖦪', 'S': 'ꕷ', 'T': '𖢧', 'U': 'ꚶ', 'V': 'ꚴ', 'W': 'ꛃ', 'X': '𖤗', 'Y': 'ꚲ', 'Z': 'ꛉ' },
    tags: ['exotic', 'gamer', 'safe']
  },
  {
    name: 'Hieroglyphic Mix',
    category: 'Featured Styles',
    map: { 'A': 'ᗋ', 'B': 'ᗾ', 'C': 'ᕩ', 'D': 'ᗥ', 'E': 'ᗴ', 'F': 'Ϝ', 'G': 'G', 'H': 'ꃙ', 'I': 'ꉁ', 'J': 'ꂖ', 'K': 'Ƙ', 'L': 'ᒫ', 'M': 'ꉙ', 'N': 'ꉌ', 'O': 'ꇩ', 'P': 'ᕾ', 'Q': 'ᕴ', 'R': 'ꔶ', 'S': 'ꍛ', 'T': '𐏕', 'U': 'ᕰ', 'V': 'ᘙ', 'W': 'ᘺ', 'X': 'ꇨ', 'Y': 'ꖃ', 'Z': '𑢪' },
    tags: ['exotic', 'gamer', 'safe']
  },
  {
    name:'CJK Radicals',
    category: 'Featured Styles',
    map: { 'A': '鿕', 'a': '𐐨', 'B': '⻖', 'C': 'で', 'D': 'ぬ', 'E': '乲', 'F': '乎', 'G': '⻢', 'H': 'ぜ', 'I': '⻈', 'J': 'ブ', 'K': '⽔', 'L': '乳', 'M': '丛', 'N': '乗', 'O': 'ロ', 'P': '⺺', 'Q': 'ꀹ', 'R': '⺠', 'S': 'ぶ', 'T': '⻱', 'U': 'ひ', 'V': 'ㇾ', 'W': '丗', 'X': '⼢', 'Y': 'ㆩ', 'Z': 'ゑ' },
    tags: ['exotic', 'safe']
  },

  // --- Creative & Mixed Styles ---
  {
    name: 'Cyborg Construct',
    category: 'Creative & Mixed Styles',
    transform: text => {
      const vowels = 'AEIOUaeiou';
      const runicMap = {'A':'ᚨ','B':'ᛒ','C':'ᚲ','D':'ᛞ','E':'ᛖ','F':'ᚠ','G':'ᚷ','H':'ᚺ','I':'ᛁ','J':'ᛃ','K':'ᚲ','L':'ᛚ','M':'ᛗ','N':'ᚾ','O':'ᛟ','P':'ᛈ','Q':'ᛩ','R':'ᚱ','S':'ᛊ','T':'ᛏ','U':'ᚢ','V':'ᚡ','W':'ᚹ','X':'ᛪ','Y':'ᛦ','Z':'ᛉ'};
      const mono = {'a':'𝚊','b':'𝚋','c':'𝚌','d':'𝚍','e':'𝚎','f':'𝚏','g':'𝚐','h':'𝚑','i':'𝚒','j':'𝚓','k':'𝚔','l':'𝚕','m':'𝚖','n':'𝚗','o':'𝚘','p':'𝚙','q':'𝚚','r':'𝚛','s':'𝚜','t':'𝚝','u':'𝚞','v':'𝚟','w':'𝚠','x':'𝚡','y':'𝚢','z':'𝚣','A':'𝙰','B':'𝙱','C':'𝙲','D':'𝙳','E':'𝙴','F':'𝙵','G':'𝙶','H':'𝙷','I':'𝙸','J':'𝙹','K':'𝙺','L':'𝙻','M':'𝙼','N':'𝙽','O':'𝙾','P':'𝙿','Q':'𝚀','R':'𝚁','S':'𝚂','T':'𝚃','U':'𝚄','V':'𝚅','W':'𝚆','X':'𝚇','Y':'𝚈','Z':'𝚉'};
      let res = '';
      for (const ch of toGraphemes(text || '')) res += vowels.includes(ch) ? (runicMap[ch.toUpperCase()] || ch) : (mono[ch] || ch);
      return res.normalize('NFC');
    },
    tags: ['cyber', 'gamer', 'readable', 'safe']
  },
  {
    name: 'Demonic Script',
    category: 'Creative & Mixed Styles',
    transform: text => {
      const marks = ['\u031b', '\u0317', '\u0338', '\u0321', '\u0322'];
      const frak = { 'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱', 'G': '𝕲', 'H': '𝕳', 'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹', 'O': '𝕺', 'P': '𝕻', 'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁', 'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅', 'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍', 'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕', 'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝', 'y': '𝖞', 'z': '𝖟' };
      let base = applyMap(text, frak), out = '';
      for (const ch of toGraphemes(base)) {
        let t = ch;
        if (ch.trim() !== '' && Math.random() < 0.4 && isLetterOrDigit(ch)) t += marks[Math.floor(Math.random()*marks.length)];
        out += t;
      }
      return out.normalize('NFC');
    },
    tags: ['glitch', 'gamer', 'unreadable']
  },
  {
    name: 'Bubble Pop',
    category: 'Creative & Mixed Styles',
    transform: text => {
      const circ = {'a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'𝓏','A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ'};
      let res = '', i = 0;
      for (const ch of toGraphemes(text || '')) {
        if (ch.trim() === '') { res += ch; continue; }
        res += (i % 2 === 0) ? (circ[ch] || ch) : ch; i++;
      }
      return res.normalize('NFC');
    },
    tags: ['cute', 'aesthetic', 'readable', 'safe']
  },
  {
    name: 'Super/Subscript Mix',
    category: 'Creative & Mixed Styles',
    transform: text => toGraphemes(text || '').map(ch => {
      const r = Math.random();
      if (r < 0.33) return ({'a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','q':'۹','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ'})[ch.toLowerCase?.()] || ch;
      if (r < 0.66) return ({'a':'ₐ','b':'♭','c':'꜀','d':'Ꮷ','e':'ₑ','f':'բ','g':'₉','h':'ₕ','i':'ᵢ','j':'ⱼ','k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','q':'૧','r':'ᵣ','s':'ₛ','t':'ₜ','u':'ᵤ','v':'ᵥ','w':'w','x':'ₓ','y':'ᵧ','z':'₂'})[ch.toLowerCase?.()] || ch;
      return ch;
    }).join('').normalize('NFC'),
    tags: ['cute', 'small', 'readable']
  },
  {
    name: 'Vaporwave',
    category: 'Creative & Mixed Styles',
    transform: text => applyMap(text, {'a':'ａ','b':'ｂ','c':'ｃ','d':'ｄ','e':'ｅ','f':'ｆ','g':'ｇ','h':'ｈ','i':'ｉ','j':'ｊ','k':'ｋ','l':'ｌ','m':'ｍ','n':'ｎ','o':'ｏ','p':'ｐ','q':'ｑ','r':'ｒ','s':'ｓ','t':'ｔ','u':'ｕ','v':'ｖ','w':'ｗ','x':'ｘ','y':'ｙ','z':'ｚ','A':'Ａ','B':'Ｂ','C':'Ｃ','D':'Ｄ','E':'Ｅ','F':'Ｆ','G':'Ｇ','H':'Ｈ','I':'Ｉ','J':'Ｊ','K':'Ｋ','L':'Ｌ','M':'Ｍ','N':'Ｎ','O':'Ｏ','P':'Ｐ','Q':'Ｑ','R':'Ｒ','S':'Ｓ','T':'Ｔ','U':'Ｕ','V':'Ｖ','W':'Ｗ','X':'Ｘ','Y':'Ｙ','Z':'Ｚ'}).split('').join(' '),
    tags: ['aesthetic', 'wide', 'readable', 'safe']
  },

  // --- Algorithmic & Combining Marks ---
  {
    name: 'Corrupted Glitch',
    category: 'Algorithmic & Combining Marks',
    transform: text => applyCombining(text, [
      '\u030d','\u030e','\u0304','\u0305','\u033f','\u0311','\u0306','\u0310',
      '\u0352','\u0357','\u0358','\u0325','\u0324','\u0323','\u0326','\u032e',
      '\u0330','\u0331','\u0332','\u0333','\u0334','\u0335','\u0336','\u034f',
      '\u035c','\u035d','\u035e','\u035f','\u0360','\u0361','\u0362'
    ], 3, 8),
    tags: ['glitch', 'gamer', 'unreadable']
  },
  {
    name: 'Encased',
    category: 'Algorithmic & Combining Marks',
    transform: text => toGraphemes(text || '').map(ch => (ch.trim() === '' ? ch : (isLetterOrDigit(ch) ? ch + '\u0305\u0332' : ch))).join('').normalize('NFC'),
    tags: ['clean', 'readable']
  },
  {
    name: 'Ethereal Sparkles',
    category: 'Algorithmic & Combining Marks',
    transform: text => {
      const spark = ['\u030a', '\u0359', '\u0307', '\u0323', '\u0358', '\u02da', '\u02d9'];
      let out = '';
      for (const ch of toGraphemes(text || '')) {
        if (ch.trim() === '' || !isLetterOrDigit(ch)) { out += ch; continue; }
        let t = ch;
        if (Math.random() < 0.6) {
          const n = Math.floor(Math.random()*2)+1;
          for (let i=0;i<n;i++) t += spark[Math.floor(Math.random()*spark.length)];
        }
        out += t;
      }
      return out.normalize('NFC');
    },
    tags: ['cute', 'aesthetic']
  },

  // --- Exotic & International Styles ---
  { name:'Tribal', category: 'Exotic & International Styles', map: {'A':'ᗩ','B':'ᗷ','C':'ᑕ','D':'ᗪ','E':'ᕮ','F':'ᖴ','G':'Ꮆ','H':'ᕼ','I':'Ꭵ','J':'ᒎ','K':'Ꮶ','L':'ᒪ','M':'ᗰ','N':'ᑎ','O':'ᗝ','P':'ᑭ','Q':'Ϭ','R':'Ꭱ','S':'ᔕ','T':'丅','U':'ᑌ','V':'ᐯ','W':'ᗯ','X':'乂','Y':'Ꭹ','Z':'乙'}, tags: ['gamer', 'exotic', 'readable', 'safe'] },
  { name:'Runic', category: 'Exotic & International Styles', map: {'A':'ᚨ','B':'ᛒ','C':'ᚲ','D':'ᛞ','E':'ᛖ','F':'ᚠ','G':'ᚷ','H':'ᚺ','I':'ᛁ','J':'ᛃ','K':'ᚲ','L':'ᛚ','M':'ᛗ','N':'ᚾ','O':'ᛟ','P':'ᛈ','Q':'ᛩ','R':'ᚱ','S':'ᛊ','T':'ᛏ','U':'ᚢ','V':'ᚡ','W':'ᚹ','X':'ᛪ','Y':'ᛦ','Z':'ᛉ'}, tags: ['gamer', 'exotic', 'readable', 'safe'] },
  { name:'Inverted', category: 'Exotic & International Styles', map: {'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ','h':'ɥ','i':'ı','j':'ɾ','k':'ʞ','l':'l','m':'ɯ','n':'u','o':'o','p':'d','q':'b','r':'ɹ','s':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z','A':'∀','B':'𐐒','C':'Ɔ','D':'ᗡ','E':'Ǝ','F':'Ⅎ','G':'פ','H':'H','I':'I','J':'ſ','K':'ʞ','L':'˥','M':'W','N':'N','O':'O','P':'Ԁ','Q':'Q','R':'ᴚ','S':'S','T':'┴','U':'∩','V':'Λ','W':'M','X':'X','Y':'⅄','Z':'Z'}, tags: ['fun', 'readable', 'safe'] },
  { name: 'Tifinagh', category: 'Exotic & International Styles', map: { 'A': 'ⴰ', 'B': 'ⴱ', 'C': 'ⵎ', 'D': 'ⴷ', 'E': 'ⴻ', 'F': 'ⴼ', 'G': 'ⴳ', 'H': 'ⵀ', 'I': 'ⵉ', 'J': 'ⵊ', 'K': 'ⴽ', 'L': 'ⵍ', 'M': 'ⵎ', 'N': 'ⵏ', 'O': 'ⵓ', 'P': 'ⵃ', 'Q': 'ⵇ', 'R': 'ⵔ', 'S': 'ⵙ', 'T': 'ⵜ', 'U': 'ⵓ', 'V': 'ⵖ', 'W': 'ⵡ', 'X': '╳', 'Y': 'ⵢ', 'Z': 'ⵣ' }, tags: ['exotic', 'clean', 'readable', 'safe'] },
  { name: 'Ol Chiki', category: 'Exotic & International Styles', map: { 'A': 'ᱚ', 'B': 'ᱵ', 'C': 'ᱪ', 'D': 'ᱫ', 'E': 'ᱮ', 'F': 'ᱯ', 'G': 'ᱜ', 'H': 'ᱦ', 'I': 'ᱤ', 'J': 'ᱡ', 'K': 'ᱠ', 'L': 'ᱞ', 'M': 'ᱢ', 'N': 'ᱱ', 'O': 'ᱳ', 'P': 'ᱯ', 'Q': 'ዒ', 'R': 'ᱨ', 'S': 'ᱥ', 'T': 'ᱛ', 'U': 'ᱩ', 'V': 'ᱣ', 'W': 'ᱣ', 'X': 'ᱬ', 'Y': 'ᱭ', 'Z': 'ᱡ' }, tags: ['exotic', 'bubbly', 'readable', 'safe'] },
  { name: 'Bamum', category: 'Exotic & International Styles', map: { 'A': '𖠊', 'B': '𖠋', 'C': '𖠌', 'D': '𖠍', 'E': '𖠎', 'F': '𖠏', 'G': '𖠐', 'H': '𖠑', 'I': '𖠒', 'J': '𖠓', 'K': '𖠔', 'L': '𖠕', 'M': '𖠖', 'N': '𖠗', 'O': '𖠘', 'P': '𖠙', 'Q': '𖠚', 'R': '𖠛', 'S': '𖠜', 'T': '𖠝', 'U': '𖠞', 'V': '𖠟', 'W': '𖠠', 'X': '𖠡', 'Y': '𖠢', 'Z': '𖠣' }, tags: ['exotic', 'gamer', 'unreadable'] },

  // --- Flourish Decorated ---
  { name: 'Skull & Stars', category: 'Flourish Decorated', transform: text => `꧁༒☠💥✨${applyMap(text, {'a':'𝘢','b':'𝘣','c':'𝘤','d':'𝘥','e':'𝘦','f':'𝘧','g':'𝘨','h':'𝘩','i':'𝘪','j':'𝘫','k':'𝘬','l':'𝘭','m':'𝘮','n':'𝘯','o':'𝘰','p':'𝘱','q':'𝘲','r':'𝘳','s':'𝘴','t':'𝘵','u':'𝘶','v':'𝘷','w':'𝘸','x':'𝘹','y':'𝘺','z':'𝘻','A':'𝘈','B':'𝘉','C':'𝘊','D':'𝘋','E':'𝘌','F':'𝘍','G':'𝘎','H':'𝘏','I':'𝘐','J':'𝘑','K':'𝘒','L':'𝘓','M':'𝘔','N':'𝘕','O':'𝘖','P':'𝘗','Q':'𝘘','R':'𝘙','S':'𝘚','T':'𝘛','U':'𝘜','V':'𝘝','W':'𝘞','X':'𝘟','Y':'𝘠','Z':'𝘡'})}✨💥☠༒꧂`, tags: ['gamer', 'emoji'] },
  { name: 'Heart Wings', category: 'Flourish Decorated', transform: text => `෴❤️෴ ${applyMap(text, {'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓃','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏','A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵'})} ෴❤️෴`, tags: ['cute', 'aesthetic', 'emoji'] },
  { name: 'Fire Brackets', category: 'Flourish Decorated', transform: text => `🔥(✖ ${applyMap(text, {'a':'ค','A':'ค','b':'๒','B':'๒','c':'ς','C':'ς','d':'๔','D':'๔','e':'є','E':'є','f':'Ŧ','F':'Ŧ','g':'ﻮ','G':'ﻮ','h':'ђ','H':'ђ','i':'เ','I':'เ','j':'ן','J':'ן','k':'к','K':'к','l':'ɭ','L':'ɭ','m':'๓','M':'๓','n':'ภ','N':'ภ','o':'๏','O':'๏','p':'ק','P':'ק','q':'ợ','Q':'ợ','r':'г','R':'г','s':'ร','S':'ร','t':'Շ','T':'Շ','u':'ย','U':'ย','v':'ש','V':'ש','w':'ฬ','W':'ฬ','x':'א','X':'א','y':'ץ','Y':'ץ','z':'չ','Z':'չ'})} ✖)🔥`, tags: ['gamer', 'emoji'] },
  { name: 'Pastel Hearts', category: 'Flourish Decorated', transform: text => `(◍•ᴗ•◍) ミ💖 ${applyMap(text, {'A':'🄰','B':'🄱','C':'🄲','D':'𝟄','E':'🄴','F':'𝟄','G':'𝖄','H':'🄷','I':'🄸','J':'🄹','K':'🄺','L':'🄻','M':'𝄼','N':'𝟄','O':'𝄾','P':'🄿','Q':'🅀','R':'🅁','S':'🅂','T':'🅃','U':'🅄','V':'🅅','W':'🆆','X':'🅇','Y':'🅈','Z':'🅉'})} 💖彡`, tags: ['cute', 'aesthetic', 'emoji'] },
  { name: 'Heavy Frame', category: 'Flourish Decorated', transform: text => `╔═${'═'.repeat((text||'').length)}═╗\n║  ${text}  ║\n╚═${'═'.repeat((text||'').length)}═╝`, tags: ['clean'] },
  { name: 'Sparkle Throw', category: 'Flourish Decorated', transform: text => `(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ${text} ✧ﾟ･:*ヽ(◕ヮ◕ヽ)`, tags: ['cute', 'aesthetic', 'emoji'] },
  {
    name: 'Symbolic Hearts',
    category: 'Flourish Decorated',
    transform: text => {
      const map = { 'a': 'α', 'b': 'в', 'c': '¢', 'd': '∂', 'e': 'є', 'f': 'ƒ', 'g': 'g', 'h': 'н', 'i': 'ι', 'j': 'נ', 'k': 'к', 'l': 'ℓ', 'm': 'м', 'n': 'η', 'o': 'σ', 'p': 'ρ', 'q': 'q', 'r': 'я', 's': 'ѕ', 't': 'т', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ', 'y': 'у', 'z': 'z' };
      const prefix = '♥ﮩ٨ـﮩﮩ٨ـﮩﮩ ';
      const suffix = ' ﮩﮩـ٨ﮩﮩـ٨ﮩ♥';
      return prefix + applyMap(text, map) + suffix;
    },
    tags: ['aesthetic', 'emoji']
  },
  {
    name: 'Eclectic Mix',
    category: 'Flourish Decorated',
    transform: text => {
      const map = { 'A': 'α', 'B': 'ᵇ', 'C': 'ⓒ', 'D': 'Ｄ', 'E': 'Ⓔ', 'F': 'ℱ', 'G': 'Ꮆ', 'H': '卄', 'I': '𝐈', 'J': '𝓳', 'K': '𝕜', 'L': 'Ĺ', 'M': 'Ｍ', 'N': '𝐧', 'O': 'Ỗ', 'P': 'Ƥ', 'Q': 'q', 'R': '𝐫', 'S': '𝓼', 'T': '𝐓', 'U': 'ย', 'V': 'ⓥ', 'W': 'ｗ', 'X': '𝔁', 'Y': '𝐲', 'Z': 'ｚ' };
      const prefix = '`•.,¸¸,.•´¯ ';
      const suffix = ' ¯`•.,¸¸,.•´';
      return prefix + applyMap(text, map) + suffix;
    },
    tags: ['aesthetic']
  },
  {
    name: 'Ornate Emblem',
    category: 'Flourish Decorated',
    transform: text => {
      const map = { 'A': 'ⓐ', 'B': 'в', 'C': '匚', 'D': '∂', 'E': 'ᵉ', 'F': 'Ŧ', 'G': '𝐆', 'H': '𝐡', 'I': 'ι', 'J': '𝐉', 'K': 'Ҝ', 'L': 'ｌ', 'M': 'м', 'N': 'Ⓝ', 'O': 'ㄖ', 'P': 'ρ', 'Q': '𝓺', 'R': '尺', 'S': '𝓼', 'T': 'Ｔ', 'U': 'Ⓤ', 'V': 'ש', 'W': 'ω', 'X': '𝔵', 'Y': 'ｙ', 'Z': 'ž' };
      const prefix = '-·=»‡«=·- ';
      const suffix = ' -·=»‡«=·-';
      return prefix + applyMap(text, map) + suffix;
    },
    tags: ['gamer', 'aesthetic']
  },

  // --- Classic Styles ---
  { name:'Bold', category: 'Classic Styles', map: {'a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝗦','t':'𝗧','u':'𝗨','v':'𝗩','w':'𝗪','x':'𝗫','y':'𝗬','z':'𝗭','A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭'}, tags: ['bold', 'readable', 'safe'] },
  { name:'Italic', category: 'Classic Styles', map: {'a':'𝘢','b':'𝘣','c':'𝘤','d':'𝘥','e':'𝘦','f':'𝘧','g':'𝘨','h':'𝘩','i':'𝘪','j':'𝘫','k':'𝘬','l':'𝘭','m':'𝘮','n':'𝘯','o':'𝘰','p':'𝘱','q':'𝘲','r':'𝘳','s':'𝘴','t':'𝘵','u':'𝘶','v':'𝘷','w':'𝘸','x':'𝘹','y':'𝘺','z':'𝘻','A':'𝘈','B':'𝘉','C':'𝘊','D':'𝘋','E':'𝘌','F':'𝘍','G':'𝘎','H':'𝘏','I':'𝘐','J':'𝘑','K':'𝘒','L':'𝘓','M':'𝘔','N':'𝘕','O':'𝘖','P':'𝘗','Q':'𝘘','R':'𝘙','S':'𝘚','T':'𝘛','U':'𝘜','V':'𝘝','W':'𝘞','X':'𝘟','Y':'𝘠','Z':'𝘡'}, tags: ['italic', 'readable', 'safe'] },
  { name:'Cursive', category: 'Classic Styles', map: {'a':'𝒶','b':'𝒷','c':'𝒸','d':'𝒹','e':'ℯ','f':'𝒻','g':'ℊ','h':'𝒽','i':'𝒾','j':'𝒿','k':'𝓀','l':'𝓁','m':'𝓂','n':'𝓃','o':'ℴ','p':'𝓅','q':'𝓆','r':'𝓇','s':'𝓈','t':'𝓉','u':'𝓊','v':'𝓋','w':'𝓌','x':'𝓍','y':'𝓎','z':'𝓏','A':'𝒜','B':'ℬ','C':'𝒞','D':'𝒟','E':'ℰ','F':'ℱ','G':'𝒢','H':'ℋ','I':'ℐ','J':'𝒥','K':'𝒦','L':'ℒ','M':'ℳ','N':'𝒩','O':'𝒪','P':'𝒫','Q':'𝒬','R':'ℛ','S':'𝒮','T':'𝒯','U':'𝒰','V':'𝒱','W':'𝒲','X':'𝒳','Y':'𝒴','Z':'𝒵'}, tags: ['cursive', 'aesthetic', 'readable', 'safe'] },
  { name:'Double Struck', category: 'Classic Styles', map: {'a':'𝕒','b':'𝕓','c':'𝕔','d':'𝕕','e':'𝕖','f':'𝕗','g':'𝕘','h':'𝕙','i':'𝕚','j':'𝕛','k':'𝕜','l':'𝕝','m':'𝕞','n':'𝕟','o':'𝕠','p':'𝕡','q':'𝑞','r':'𝕣','s':'𝕤','t':'𝕥','u':'𝕦','v':'𝕧','w':'𝕨','x':'𝕩','y':'𝕪','z':'𝕫','A':'𝔸','B':'𝔹','C':'ℂ','D':'𝔻','E':'𝔼','F':'𝔽','G':'𝔾','H':'ℍ','I':'𝕀','J':'𝕁','K':'𝕂','L':'𝕃','M':'𝕄','N':'ℕ','O':'𝕆','P':'ℙ','Q':'ℚ','R':'ℝ','S':'𝕊','T':'𝕋','U':'𝕌','V':'𝕍','W':'𝕎','X':'𝕏','Y':'𝕐','Z':'ℤ'}, tags: ['bold', 'clean', 'readable', 'safe'] },
  { name:'Fraktur', category: 'Classic Styles', map: {'a':'𝔞','b':'𝔟','c':'𝔠','d':'𝔡','e':'𝔢','f':'𝔣','g':'𝔤','h':'𝔥','i':'𝔦','j':'𝔧','k':'𝔨','l':'𝔩','m':'𝔪','n':'𝔫','o':'𝔬','p':'𝔭','q':'𝔮','r':'𝔯','s':'𝔰','t':'𝔱','u':'𝔲','v':'𝔳','w':'𝔴','x':'𝔵','y':'𝔶','z':'𝔷','A':'𝔄','B':'𝔅','C':'ℭ','D':'𝔇','E':'𝔈','F':'𝔉','G':'𝔊','H':'ℌ','I':'ℑ','J':'𝔍','K':'𝔎','L':'𝔏','M':'𝔐','N':'𝔑','O':'𝒪','P':'𝔓','Q':'𝔔','R':'ℜ','S':'𝔖','T':'𝔗','U':'𝔘','V':'𝔙','W':'𝔚','X':'𝔛','Y':'𝔜','Z':'ℨ'}, tags: ['gamer', 'readable'] },
  { name:'Medieval', category: 'Classic Styles', map: {'a':'𝖆','b':'𝖇','c':'𝖈','d':'𝖉','e':'𝖊','f':'𝖋','g':'𝖌','h':'𝖍','i':'𝖎','j':'𝖏','k':'𝖐','l':'𝖑','m':'𝖒','n':'𝖓','o':'𝖔','p':'𝖕','q':'𝖖','r':'𝖗','s':'𝖘','t':'𝖙','u':'𝖚','v':'𝖛','w':'𝖜','x':'𝖝','y':'𝖞','z':'𝖟','A':'𝕬','B':'𝕭','C':'𝕮','D':'𝕯','E':'𝕰','F':'𝕱','G':'𝕲','H':'𝕳','I':'𝕴','J':'𝕵','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅'}, tags: ['bold', 'gamer', 'readable'] },
  { name:'Monospace', category: 'Classic Styles', map: {'a':'𝚊','b':'𝚋','c':'𝚌','d':'𝚍','e':'𝚎','f':'𝚏','g':'𝚐','h':'𝚑','i':'𝚒','j':'𝚓','k':'𝚔','l':'𝚕','m':'𝚖','n':'𝚗','o':'𝚘','p':'𝚙','q':'𝚚','r':'𝚛','s':'𝚜','t':'𝚝','u':'𝚞','v':'𝚟','w':'𝚠','x':'𝚡','y':'𝚢','z':'𝚣','A':'𝙰','B':'𝙱','C':'𝙲','D':'𝙳','E':'𝙴','F':'𝙵','G':'𝙶','H':'𝙷','I':'𝙸','J':'𝙹','K':'𝙺','L':'𝙻','M':'𝙼','N':'𝙽','O':'𝙾','P':'𝙿','Q':'𝚀','R':'𝚁','S':'𝚂','T':'𝚃','U':'𝚄','V':'𝚅','W':'𝚆','X':'𝚇','Y':'𝚈','Z':'𝚉'}, tags: ['clean', 'readable', 'safe'] },
  { name:'Circled', category: 'Classic Styles', map: {'a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'ⓩ','A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ'}, tags: ['bubbly', 'cute', 'readable', 'safe'] },
  { name:'Full Width', category: 'Classic Styles', map: {'a':'ａ','b':'ｂ','c':'ｃ','d':'ｄ','e':'ｅ','f':'ｆ','g':'ｇ','h':'ｈ','i':'ｉ','j':'ｊ','k':'ｋ','l':'ｌ','m':'ｍ','n':'ｎ','o':'ｏ','p':'ｐ','q':'ｑ','r':'ｒ','s':'ｓ','t':'ｔ','u':'ｕ','v':'ｖ','w':'ｗ','x':'ｘ','y':'ｙ','z':'ｚ','A':'Ａ','B':'Ｂ','C':'Ｃ','D':'Ｄ','E':'Ｅ','F':'Ｆ','G':'Ｇ','H':'Ｈ','I':'Ｉ','J':'Ｊ','K':'Ｋ','L':'Ｌ','M':'Ｍ','N':'Ｎ','O':'Ｏ','P':'Ｐ','Q':'Ｑ','R':'Ｒ','S':'Ｓ','T':'Ｔ','U':'Ｕ','V':'Ｖ','W':'Ｗ','X':'Ｘ','Y':'Ｙ','Z':'Ｚ'}, tags: ['wide', 'aesthetic', 'readable', 'safe'] },

  // --- Complex & Symbolic ---
  { name: 'Glitch Hop', category: 'Complex / Glitched', map: glitchHopMap, tags: ['glitch', 'gamer', 'unreadable'] },
  { name: 'Bracket Mix', category: 'Complex / Glitched', map: bracketMixMap, tags: ['cyber', 'gamer', 'readable'] },
  { name: 'Cursed Script', category: 'Complex / Glitched', map: cursedScriptMap, tags: ['glitch', 'unreadable'] },
  { name: 'Digital Decay', category: 'Complex / Glitched', map: digitalDecayMap, tags: ['glitch', 'cyber', 'unreadable'] },
  { name: 'Royal Mix', category: 'Complex / Glitched', map: royalMixMap, tags: ['aesthetic', 'cute'] },
  { name: 'Elegant Glitch', category: 'Complex / Glitched', map: elegantGlitchMap, tags: ['glitch', 'aesthetic', 'readable'] },
  { name: 'Wierd', category: 'Complex / Glitched', map: wierdMap, tags: ['exotic', 'unreadable'] },
  { name: 'Decor', category: 'Complex / Glitched', map: decorMap, tags: ['clean', 'readable', 'safe'] },
  { name: 'Alien', category: 'Complex / Glitched', map: alienMap, tags: ['gamer', 'cyber', 'exotic', 'readable', 'safe'] },
  { name: 'Neon', category: 'Complex / Glitched', map: neonMap, tags: ['aesthetic', 'unreadable'] },
  { name: 'Cool', category: 'Complex / Glitched', map: coolMap, tags: ['glitch', 'gamer', 'unreadable'] },
  { name: 'Kool', category: 'Complex / Glitched', map: koolMap, tags: ['exotic', 'readable'] },
];

/* =========================================================
   20 Ultra-Unique Remix Styles (original)
   ========================================================= */

const REMIX_STYLES = [
  makeRemixStyle({ name: 'Quantum Spell', frame:{pre:'⟁',post:'⟁'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{ W:'𝔚', w:'𝔀', X:'𝔛', x:'𝔁', Y:'𝔜', y:'𝔂', Z:'ℨ', z:'𝔃', O:'𝓞', o:'𝓸' }, palette:['⌬','◬','⟡'], micro:{ dotVowels:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Starlit Ice', frame:{pre:'❄︎',post:'❄︎'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{ A:'Ａ',E:'Ｅ',I:'Ｉ',O:'Ｏ',U:'Ｕ',a:'ａ',e:'ｅ',i:'ｉ',o:'ｏ',u:'ｕ' }, palette:['☾','✦','❆'], micro:{ dotVowels:true, symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Blood Rune', frame:{pre:'𖤐',post:'𖤐'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{ O:'𝒪', o:'𝔬' }, palette:['☨','✠','†'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Ember Strike', frame:{pre:'🔥',post:'🔥'}, bases:{upper:'DOUBLE',lower:'SCRIPT'}, overrides:{ X:'𝔛', x:'𝔁', V:'𝓥' }, palette:['✦','⚑','⚡'], micro:{ dotVowels:true, symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Toxic Pulse', frame:{pre:'☣︎',post:'☣︎'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{ O:'Ø', o:'ø', E:'Ξ', e:'ξ', A:'Δ', a:'Δ', Y:'¥', y:'ყ' }, palette:['⌁','⌬','⎔'], micro:{ underline:true, symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Cosmic Bloom', frame:{pre:'✧',post:'✧'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['✺','✸','✶'], micro:{ dotVowels:true, symbolChance:0.6 } }),
  makeRemixStyle({ name: 'Shadow Circuit', frame:{pre:'⚫',post:'⚫'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{ O:'𝙾', o:'ø', A:'𝙰', E:'𝙴', X:'𝚇', x:'𝚡' }, palette:['▣','◧','◨'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Solar Sigil', frame:{pre:'☀︎',post:'☀︎'}, bases:{upper:'DOUBLE',lower:'SCRIPT'}, overrides:{ T:'𝕋', R:'ℝ' }, palette:['☩','☼','✷'], micro:{ dotVowels:true, symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Necro Warden', frame:{pre:'☠︎',post:'☠︎'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{}, palette:['☥','⚰︎','✟'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Lunar Bloom', frame:{pre:'☽',post:'☾'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['✧','☄︎','✦'], micro:{ dotVowels:true, symbolChance:0.55 } }),
  makeRemixStyle({ name: 'Frost Bite', frame:{pre:'❄︎',post:'❄︎'}, bases:{upper:'MONO',lower:'FRAKTUR'}, overrides:{ O:'Ｏ', o:'ｏ' }, palette:['☾','✶','❆'], micro:{ dotVowels:true, symbolChance:0.45 } }),
  makeRemixStyle({ name: 'Arcane Tide', frame:{pre:'𓆉',post:'𓆉'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['☸︎','༄','⋆'], micro:{ dotVowels:true, symbolChance:0.6 } }),
  makeRemixStyle({ name: 'Iron Howl', frame:{pre:'⛓',post:'⛓'}, bases:{upper:'MONO',lower:'MONO'}, overrides:{ V:'𝚅', W:'𝚆', X:'𝚇', Y:'𝚈' }, palette:['⟟','⛓','⛨'], micro:{ underline:true, symbolChance:0.35 } }),
  makeRemixStyle({ name: 'Burning Sigil', frame:{pre:'✠',post:'✠'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{ A:'𝔸', a:'𝕒', E:'𝔼', e:'𝕖' }, palette:['†','☉','☍'], micro:{ dotVowels:true, symbolChance:0.45 } }),
  makeRemixStyle({ name: 'Abyss Crown', frame:{pre:'🌊',post:'🌊'}, bases:{upper:'FULL',lower:'SCRIPT'}, overrides:{ O:'Ｏ', o:'ｏ', N:'Ｎ', n:'ｎ' }, palette:['❪','❫','⟢'], micro:{ dotVowels:true, symbolChance:0.55 } }),
  makeRemixStyle({ name: 'Ghost Pulse', frame:{pre:'👁',post:'👁'}, bases:{upper:'MONO',lower:'SCRIPT'}, overrides:{ O:'Ø', o:'ø' }, palette:['▫','▪','◦'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Thunder Crest', frame:{pre:'⚡',post:'⚡'}, bases:{upper:'DOUBLE',lower:'DOUBLE'}, overrides:{ O:'𝕆', o:'𝕠', S:'𝕊', s:'𝕤' }, palette:['✦','⯈','➤'], micro:{ symbolChance:0.5 } }),
  makeRemixStyle({ name: 'Dream Weaver', frame:{pre:'✿',post:'✿'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{}, palette:['🫧','⋆','❀'], micro:{ dotVowels:true, symbolChance:0.6 } }),
  makeRemixStyle({ name: 'Obsidian Flame', frame:{pre:'⛧',post:'⛧'}, bases:{upper:'FRAKTUR',lower:'FRAKTUR'}, overrides:{ O:'𝒪', o:'𝔬' }, palette:['✟','❖','☗'], micro:{ underline:true, symbolChance:0.4 } }),
  makeRemixStyle({ name: 'Soul Key', frame:{pre:'☽',post:'☽'}, bases:{upper:'SCRIPT',lower:'SCRIPT'}, overrides:{ G:'𝓖', g:'𝓰', K:'𝓚', k:'𝓴' }, palette:['⚷','⌘','✧'], micro:{ dotVowels:true, symbolChance:0.55 } }),
];

/* =========================================================
   +20 Symbol–Alphabet Fusion Remix Styles (NEW)
   ========================================================= */

const FUSION_STYLES = [
  // 51
  makeRemixStyle({
    name: 'Astral Rune — Zodiac Seal',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '♐', post: '♌' },
    bases: { upper:'DOUBLE', lower:'SCRIPT' },
    overrides: { O:'⊙', o:'⊙', S:'Ϟ', s:'ϟ' },
    palette: ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'],
    micro: { dotVowels:true, underline:true, symbolChance:0.45 }
  }),
  // 52
  makeRemixStyle({
    name: 'Obscura Flame — Tifinagh Ember',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: 'ⴰ', post: '🔥' },
    bases: { upper:'FRAKTUR', lower:'SCRIPT' },
    overrides: { A:'ⴰ', B:'ⴱ', E:'ⴻ', H:'ⵀ', I:'ⵉ', K:'ⴽ', L:'ⵍ', O:'ⵓ', U:'ⵓ', V:'ⵖ', W:'ⵡ', Y:'ⵢ', Z:'ⵣ' },
    palette: ['ⵣ','ⵔ','ⵇ','ⴷ','ⴳ'],
    micro: { symbolChance:0.5, slash:true }
  }),
  // 53
  makeRemixStyle({
    name: 'Venin Crown — Alchemical Sigil',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🜂', post: '🜁' },
    bases: { upper:'MONO', lower:'MONO' },
    overrides: { O:'🜔', o:'🜔', A:'🜃', a:'🜃', E:'🜁', e:'🜁' },
    palette: ['🜍','🜏','🜔','🜚','🜃','🜄'],
    micro: { underline:true, symbolChance:0.55 }
  }),
  // 54
  makeRemixStyle({
    name: 'Royal Gambit — Chess Fang',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '♔', post: '♕' },
    bases: { upper:'DOUBLE', lower:'SCRIPT' },
    overrides: { K:'♚', Q:'♛', B:'♝', N:'♞', R:'♜', P:'♟' },
    palette: ['♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟'],
    micro: { symbolChance:0.5, dotVowels:true }
  }),
  // 55
  makeRemixStyle({
    name: 'Jade Lotus — Mahjong Bloom',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🀄', post: '🀚' },
    bases: { upper:'SCRIPT', lower:'SCRIPT' },
    overrides: {},
    palette: ['🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏','🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘','🀙'],
    micro: { symbolChance:0.6, dotVowels:true }
  }),
  // 56
  makeRemixStyle({
    name: 'Ancient Oracle — Phoenician Sigil',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '𐤀', post: '𐤅' },
    bases: { upper:'FRAKTUR', lower:'FRAKTUR' },
    overrides: { A:'𐤀', B:'𐤁', G:'𐤂', D:'𐤃', H:'𐤄', W:'𐤅', Z:'𐤆', Ḥ:'𐤇', Ṭ:'𐤈', Y:'𐤉', K:'𐤊', L:'𐤋', M:'𐤌', N:'𐤍', S:'𐤎', ʿ:'𐤏', P:'𐤐', Ṣ:'𐤑', Q:'𐤒', R:'𐤓', Š:'𐤔', T:'𐤕' },
    palette: ['𐤀','𐤁','𐤂','𐤃','𐤄','𐤅','𐤆','𐤇','𐤈','𐤉','𐤊','𐤋','𐤌','𐤍','𐤎','𐤏','𐤐','𐤑','𐤒','𐤓','𐤔','𐤕'],
    micro: { symbolChance:0.35, underline:true }
  }),
  // 57
  makeRemixStyle({
    name: 'Twilight Mirror — Gothic Veil',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '⛧', post: '⛧' },
    bases: { upper:'FRAKTUR', lower:'SCRIPT' },
    overrides: {},
    palette: ['✟','☩','✠','✞'],
    micro: { symbolChance:0.45, slash:true }
  }),
  // 58
  makeRemixStyle({
    name: 'Solar Relic — Old Italic Flame',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '𐌀', post: '🔥' },
    bases: { upper:'DOUBLE', lower:'DOUBLE' },
    overrides: { A:'𐌀', B:'𐌁', C:'𐌂', D:'𐌃', E:'𐌄', F:'𐌅', G:'𐌆', H:'𐌇', I:'𐌈', K:'𐌊', L:'𐌋', M:'𐌌', N:'𐌍', O:'𐌏', P:'𐌐', Q:'𐌒', R:'𐌓', S:'𐌔', T:'𐌕', U:'𐌖', V:'𐌖', X:'𐌗', Z:'𐌙' },
    palette: ['𐌀','𐌁','𐌂','𐌃','𐌄','𐌅','𐌆','𐌇','𐌈','𐌊','𐌋','𐌌','𐌍','𐌏','𐌐','𐌒','𐌓','𐌔','𐌕','𐌖','𐌗','𐌙'],
    micro: { symbolChance:0.4, dotVowels:true }
  }),
  // 59
  makeRemixStyle({
    name: 'Frozen Zodiac — Ice Rune',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '❄︎', post: '❄︎' },
    bases: { upper:'MONO', lower:'MONO' },
    overrides: { O:'♒', o:'♒', A:'♑', a:'♑' },
    palette: ['♑','♒','♓','❆','❄︎'],
    micro: { symbolChance:0.5 }
  }),
  // 60
  makeRemixStyle({
    name: 'Sacred Bloom — Lotus Mark',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '☸', post: '☸' },
    bases: { upper:'SCRIPT', lower:'SCRIPT' },
    overrides: {},
    palette: ['☸','✿','❀','🪷'],
    micro: { symbolChance:0.55, dotVowels:true }
  }),
  // 61
  makeRemixStyle({
    name: 'Infernal Sigil — Hell Rune',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🜏', post: '🜍' },
    bases: { upper:'FRAKTUR', lower:'FRAKTUR' },
    overrides: {},
    palette: ['🜏','🜍','🝫','🝟'],
    micro: { symbolChance:0.5, underline:true }
  }),
  // 62
  makeRemixStyle({
    name: 'Crown of Ages — Time Relic',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '⌛', post: '⌛' },
    bases: { upper:'DOUBLE', lower:'SCRIPT' },
    overrides: { O:'◌̄', o:'◌̄' },
    palette: ['⌛','⏳','⧗','🕰'],
    micro: { symbolChance:0.45, tilde:true }
  }),
  // 63
  makeRemixStyle({
    name: 'Starveil Echo — Cosmic Song',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '✧', post: '✧' },
    bases: { upper:'SCRIPT', lower:'SCRIPT' },
    overrides: {},
    palette: ['✧','✦','⋆','✶','✷'],
    micro: { symbolChance:0.6, dotVowels:true }
  }),
  // 64
  makeRemixStyle({
    name: 'Venom Halo — Toxic Glyph',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '☣︎', post: '☣︎' },
    bases: { upper:'MONO', lower:'MONO' },
    overrides: { O:'⍥', o:'⍥' },
    palette: ['☣︎','⎔','⌬','⌁'],
    micro: { symbolChance:0.55, slash:true }
  }),
  // 65
  makeRemixStyle({
    name: 'Mystic Crown — Celestial Fang',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '☾', post: '☾' },
    bases: { upper:'DOUBLE', lower:'SCRIPT' },
    overrides: {},
    palette: ['☾','☽','✺','⋆'],
    micro: { symbolChance:0.5, dotVowels:true }
  }),
  // 66
  makeRemixStyle({
    name: 'Dragon Rune — Ember Fang',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🐉', post: '🐉' },
    bases: { upper:'FRAKTUR', lower:'SCRIPT' },
    overrides: {},
    palette: ['🐉','🔥','🜂','✠'],
    micro: { symbolChance:0.5, underline:true }
  }),
  // 67
  makeRemixStyle({
    name: 'Void Relic — Black Star',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '✦', post: '✦' },
    bases: { upper:'MONO', lower:'DOUBLE' },
    overrides: { O:'●', o:'●' },
    palette: ['✦','●','◈','◇'],
    micro: { symbolChance:0.5 }
  }),
  // 68
  makeRemixStyle({
    name: 'Phantom Lotus — Spirit Petal',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '👁', post: '👁' },
    bases: { upper:'SCRIPT', lower:'SCRIPT' },
    overrides: {},
    palette: ['👁','🪷','✧','◦'],
    micro: { symbolChance:0.55, dotVowels:true }
  }),
  // 69
  makeRemixStyle({
    name: 'Arcane Spiral — Chaos Sigil',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '⟲', post: '⟲' },
    bases: { upper:'DOUBLE', lower:'DOUBLE' },
    overrides: {},
    palette: ['⟲','⟳','↻','↺','⤿','⤾'],
    micro: { symbolChance:0.45, tilde:true }
  }),
  // 70
  makeRemixStyle({
    name: 'Throne of Ash — Ember Crown',
    category: 'Symbol–Alphabet Fusion',
    frame: { pre: '🔥', post: '🔥' },
    bases: { upper:'FULL', lower:'SCRIPT' },
    overrides: { O:'⦿', o:'⦿' },
    palette: ['🔥','✠','⛧','⛓'],
    micro: { symbolChance:0.55, underline:true }
  }),
];

/* =========================================================
   Final export: combine base + remix (+ fusion)
   ========================================================= */

const styles = [...BASE_STYLES, ...REMIX_STYLES, ...FUSION_STYLES];

/* ------------------ Expose to app.js ------------------ */
window.applyMap = applyMap;
window.applyCombining = applyCombining;
window.styles = styles;


/* =========================
   NEW, UNIQUE FONT PACKS
   ========================= */

(function(){
  // --- helpers ---
  const mapString = (txt, map) =>
    txt.split('').map(ch => map[ch] ?? ch).join('');

  // Diacritic engines (novel looks; keep base letters = good cross-app support)
  const weave = (txt, seq) => {
    let i = 0;
    return txt.split('').map(ch=>{
      if (!/\S/.test(ch)) return ch;
      const deco = seq[i++ % seq.length];
      return ch + deco;
    }).join('');
  };

  // THIN, HAIR, NNBSP for airy spacing where wanted
  const spacer = (txt, s = '\u200A') => txt.split('').join(s);

  // Base ASCII sets for maps
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const az = 'abcdefghijklmnopqrstuvwxyz';
  const d10 = '0123456789';

  // 1) MICROCAPS HYBRID (rare small-cap letters + IPA forms)
  const MICROCAPS_UP = [...'ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᵠᴿˢᵀᵁⱽᵂˣʎᶻ'];
  // fallback patches where small-caps don’t exist (Q→ᵠ, Y→ʎ etc.)

  const microcapsMap = {};
  for (let i=0;i<26;i++) microcapsMap[AZ[i]] = MICROCAPS_UP[i] || AZ[i];
  // make lowercase look like true small caps too
  const MICROCAPS_LOW = {
    a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ꜰ', g:'ɢ', h:'ʜ', i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ',
    m:'ᴍ', n:'ɴ', o:'ᴏ', p:'ᴘ', q:'ǫ', r:'ʀ', s:'s', t:'ᴛ', u:'ᴜ', v:'ᴠ', w:'ᴡ', x:'x', y:'ʏ', z:'ᴢ'
  };
  Object.assign(microcapsMap, MICROCAPS_LOW);
  // digits: keep as is (readability)
  d10.split('').forEach(d=>microcapsMap[d]=d);

  // 2) SQUARED ENCLOSURE (🄰 🄱 …) with fallback to Ⓐ/fullwidth
  // Note: 🄰.. block coverage is decent on modern OS; fallback provided.
  const squared = '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉';
  const circled = 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ';
  const fullUp = [...'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ'];
  const fullLo = [...'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'];

  const squaredMap = {};
  for (let i=0;i<26;i++){
    squaredMap[AZ[i]] = (squared[i] ?? circled[i]) || fullUp[i];
    squaredMap[az[i]] = (circled[i] ?? fullLo[i]) || fullLo[i];
  }
  // digits → enclosed ⓪①… fallback fullwidth
  const circDigits = '⓪①②③④⑤⑥⑦⑧⑨';
  d10.split('').forEach((d,i)=> squaredMap[d] = circDigits[i] || '０１２３４５６７８９'[i]);

  // 3) WIREFRAME DOUBLE (Mathematical double-struck, but FULL set)
  const dblUp = [...'𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ'];
  const dblLo = [...'𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫'];
  const dblDigits = [...'𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'];
  const doubleMap = {};
  for (let i=0;i<26;i++){ doubleMap[AZ[i]]=dblUp[i]; doubleMap[az[i]]=dblLo[i]; }
  d10.split('').forEach((d,i)=> doubleMap[d]=dblDigits[i]);

  // 4) BOX-MONO TIGHT (Mathematical monospace, consistent & clean)
  const monoUp = [...'𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉'];
  const monoLo = [...'𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣'];
  const monoDigits = [...'𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'];
  const monoMap = {};
  for (let i=0;i<26;i++){ monoMap[AZ[i]]=monoUp[i]; monoMap[az[i]]=monoLo[i]; }
  d10.split('').forEach((d,i)=> monoMap[d]=monoDigits[i]);

  // 5) AURA HALO (novel: alternating dot-above ◌̇ and ring-above ◌̊)
  const AURA_SEQ = ['\u0307', '\u030A']; // ̇, ̊
  const auraHalo = txt => weave(txt, AURA_SEQ);

  // 6) SHADOW UNDERLINE (novel: combining double macron below ◌̿ blends nicely)
  const SHADOW_SEQ = ['\u0333', '\u0331']; // ◌̳, ◌̱
  const shadowUnderline = txt => weave(txt, SHADOW_SEQ);

  // 7) STITCHED (thin spacing + low tilde below for a stitched vibe)
  const STITCH_SEQ = ['\u0330', '\u0324']; // ◌̰ , ◌̤
  const stitched = txt => spacer(weave(txt, STITCH_SEQ), '\u2009'); // thin space

  // 8) EDGE-GLINT (rare: caron + dot below alternating → crisp, “edgy” look)
  const GLINT_SEQ = ['\u030C', '\u0323']; // ̌ , ̣
  const glint = txt => weave(txt, GLINT_SEQ);


  // === PACK REGISTRATIONS ===
  const NEW_STYLES = [
    {
      name: "Microcaps Hybrid",
      pack: "microcaps-hybrid",
      note: "True small-cap feel using rare IPA forms; great for compact bios.",
      transform: txt => mapString(txt, microcapsMap)
    },
    {
      name: "Squared Enclosure",
      pack: "squared-enclose",
      note: "🄰-style boxed caps with graceful fallbacks to Ⓐ / fullwidth.",
      transform: txt => mapString(txt, squaredMap)
    },
    {
      name: "Wireframe Double",
      pack: "wire-doublestruck",
      note: "Full A-Z/a-z/0-9 double-struck—clean, hollow vibe.",
      transform: txt => mapString(txt, doubleMap)
    },
    {
      name: "Box-Mono Tight",
      pack: "boxy-mono-tight",
      note: "Monospaced math alphabet—industrial labels, gamer tags.",
      transform: txt => mapString(txt, monoMap)
    },
    {
      name: "Aura Halo",
      pack: "aura-halo",
      note: "Alternating dot & ring above for a soft halo aesthetic.",
      transform: auraHalo
    },
    {
      name: "Shadow Underline",
      pack: "shadow-underline",
      note: "Alternating heavy/soft baselines for a sunk-ink effect.",
      transform: shadowUnderline
    },
    {
      name: "Stitched Thin",
      pack: "stitched-thin",
      note: "Thin spacing + low tildes/dots under—textile stitch feel.",
      transform: stitched
    },
    {
      name: "Edge Glint",
      pack: "edge-glint",
      note: "Caron + dot-below pattern adds a metallic, edgy sparkle.",
      transform: glint
    },
  ];

  // expose
  window.FONT_STYLES = (window.FONT_STYLES || []).concat(NEW_STYLES);
})();
