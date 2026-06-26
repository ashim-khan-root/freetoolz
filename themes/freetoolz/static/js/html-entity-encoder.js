(function () {
  var w = document.getElementById.bind(document);

  var ENTITY_MAP = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    '©': '&copy;', '®': '&reg;', '™': '&trade;', '€': '&euro;', '£': '&pound;',
    '¥': '&yen;', '¢': '&cent;', '§': '&sect;', '•': '&bull;', '→': '&rarr;',
    '←': '&larr;', '↑': '&uarr;', '↓': '&darr;', '–': '&ndash;', '—': '&mdash;',
    '‘': '&lsquo;', '’': '&rsquo;', '“': '&ldquo;', '”': '&rdquo;',
    '×': '&times;', '÷': '&divide;', '±': '&plusmn;', '°': '&deg;',
    'µ': '&micro;', '¶': '&para;', '¿': '&iquest;', '¡': '&iexcl;'
  };

  var REV_MAP = {};
  for (var k in ENTITY_MAP) {
    if (ENTITY_MAP.hasOwnProperty(k)) REV_MAP[ENTITY_MAP[k]] = k;
  }

  var HTML =
    '<div class="he-widget">' +
    '<div class="he-tabs">' +
    '<button class="he-tab he-tab-active" id="he-tab-encode">Encode</button>' +
    '<button class="he-tab" id="he-tab-decode">Decode</button>' +
    '</div>' +
    '<div class="he-field"><label>Input</label><textarea id="he-input" rows="6" placeholder="Enter text to encode..."><div class="example">Hello & welcome to FreeToolz!</div></textarea></div>' +
    '<div class="he-field"><label>Output</label><textarea id="he-output" rows="6" readonly placeholder="Output will appear here..."></textarea></div>' +
    '<div class="he-actions">' +
    '<button class="he-btn" id="he-copy-btn">Copy Output</button>' +
    '<button class="he-btn he-btn-sec" id="he-swap-btn">Swap Input & Output</button>' +
    '<button class="he-btn he-btn-sec" id="he-clear-btn">Clear</button>' +
    '</div>' +
    '<div class="he-stats"><span class="he-stat" id="he-stat-input">0 chars</span> &#8594; <span class="he-stat" id="he-stat-output">0 chars</span></div>' +
    '<div class="he-note">Encode text to HTML entities or decode entities back to readable text. Useful for escaping HTML in code snippets and blog posts.</div></div>';

  var CSS =
    '.he-widget{display:flex;flex-direction:column;gap:14px}' +
    '.he-tabs{display:flex;gap:0;border-radius:var(--radius-sm);overflow:hidden;border:1px solid var(--border);width:fit-content}' +
    '.he-tab{padding:10px 24px;border:none;font-size:.88rem;font-weight:600;cursor:pointer;background:var(--bg);color:var(--text-secondary);transition:var(--transition)}' +
    '.he-tab-active{background:var(--primary);color:#fff}' +
    '.he-field{display:flex;flex-direction:column;gap:4px}' +
    '.he-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.he-field textarea{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;font-family:monospace;background:var(--bg);color:var(--text);outline:none;resize:vertical;min-height:80px}' +
    '.he-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.he-actions{display:flex;gap:10px}' +
    '.he-btn{padding:9px 20px;border:none;border-radius:var(--radius-sm);font-size:.85rem;font-weight:600;cursor:pointer;background:var(--primary);color:#fff;transition:var(--transition)}' +
    '.he-btn:hover{background:var(--primary-dark)}' +
    '.he-btn-sec{background:var(--bg);color:var(--text);border:1px solid var(--border)}' +
    '.he-btn-sec:hover{background:var(--border)}' +
    '.he-stats{font-size:.82rem;color:var(--text-tertiary);text-align:center}' +
    '.he-stat{font-weight:700;color:var(--text-secondary)}' +
    '.he-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:500px){.he-tabs{width:100%}.he-tab{flex:1}}';

  function encodeEntities(str) {
    return str.replace(/[&<>"'©®™€£¥¢§•→←↑↓–—‘’“”×÷±°µ¶¿¡]/g, function (ch) {
      return ENTITY_MAP[ch] || '&#' + ch.charCodeAt(0) + ';';
    });
  }

  function decodeEntities(str) {
    return str.replace(/&[#a-zA-Z0-9]+;/g, function (entity) {
      if (REV_MAP[entity]) return REV_MAP[entity];
      if (entity.charAt(1) === '#') {
        var num = entity.charAt(2) === 'x' || entity.charAt(2) === 'X'
          ? parseInt(entity.substring(3), 16)
          : parseInt(entity.substring(2));
        if (!isNaN(num)) return String.fromCharCode(num);
      }
      return entity;
    });
  }

  var mode = 'encode';

  function calc() {
    var input = w('he-input').value;
    var output = mode === 'encode' ? encodeEntities(input) : decodeEntities(input);
    w('he-output').value = output;
    w('he-stat-input').textContent = input.length + ' chars';
    w('he-stat-output').textContent = output.length + ' chars';
  }

  function setMode(m) {
    mode = m;
    document.getElementById('he-tab-encode').className = 'he-tab' + (m === 'encode' ? ' he-tab-active' : '');
    document.getElementById('he-tab-decode').className = 'he-tab' + (m === 'decode' ? ' he-tab-active' : '');
    calc();
  }

  function copyOutput() {
    var out = w('he-output');
    out.select();
    navigator.clipboard.writeText(out.value).then(function () {
      var btn = document.getElementById('he-copy-btn');
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = 'Copy Output'; }, 2000);
    });
  }

  function swap() {
    var temp = w('he-input').value;
    w('he-input').value = w('he-output').value;
    w('he-output').value = temp;
    calc();
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.getElementById('he-tab-encode').addEventListener('click', function () { setMode('encode'); });
    document.getElementById('he-tab-decode').addEventListener('click', function () { setMode('decode'); });
    document.getElementById('he-copy-btn').addEventListener('click', copyOutput);
    document.getElementById('he-swap-btn').addEventListener('click', swap);
    document.getElementById('he-clear-btn').addEventListener('click', function () { w('he-input').value = ''; calc(); });
    w('he-input').addEventListener('input', calc);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
