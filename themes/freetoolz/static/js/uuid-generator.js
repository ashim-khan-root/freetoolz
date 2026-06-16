(function () {
  var w = document.getElementById.bind(document);

  function uuidV4() {
    var s = '';
    var hex = '0123456789abcdef';
    for (var i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) { s += '-'; }
      else if (i === 14) { s += '4'; }
      else if (i === 19) { s += hex[(Math.random() * 4 | 0) + 8]; }
      else { s += hex[Math.random() * 16 | 0]; }
    }
    return s;
  }

  function uuidV7() {
    var now = Date.now();
    var hex = '0123456789abcdef';
    var s = '';
    for (var i = 0; i < 36; i++) {
      if (i === 8 || i === 13 || i === 18 || i === 23) { s += '-'; }
      else if (i < 8) { s += hex[(now >> (28 - i * 4)) & 0xf]; }
      else if (i === 14) { s += '7'; }
      else if (i === 19) { s += hex[(Math.random() * 4 | 0) + 8]; }
      else { s += hex[Math.random() * 16 | 0]; }
    }
    return s;
  }

  var HTML =
    '<div class="uuid-widget">' +
    '<div class="uuid-bar">' +
    '<div class="uuid-field"><label>Version</label><select id="uuid-ver"><option value="v4">UUID v4 (Random)</option><option value="v7">UUID v7 (Time-ordered)</option></select></div>' +
    '<div class="uuid-field"><label>Quantity</label><input type="number" id="uuid-qty" value="5" min="1" max="100"></div>' +
    '<div class="uuid-field"><label>Case</label><select id="uuid-case"><option value="lower">Lowercase</option><option value="upper">Uppercase</option></select></div>' +
    '<div class="uuid-field uuid-field-btn"><label>&nbsp;</label><button id="uuid-gen-btn" class="uuid-btn">Generate</button></div>' +
    '</div>' +
    '<div class="uuid-actions"><button id="uuid-copy-all" class="uuid-btn-sm">Copy All</button></div>' +
    '<div class="uuid-list" id="uuid-list"></div></div>';

  var CSS =
    '.uuid-widget{display:flex;flex-direction:column;gap:14px}' +
    '.uuid-bar{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end}' +
    '.uuid-field{display:flex;flex-direction:column;gap:4px}' +
    '.uuid-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.uuid-field select,.uuid-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none}' +
    '.uuid-field input:focus,.uuid-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.uuid-btn{padding:10px 24px;border:none;border-radius:var(--radius-sm);font-size:.9rem;font-weight:600;cursor:pointer;background:var(--primary);color:#fff;transition:var(--transition)}' +
    '.uuid-btn:hover{background:var(--primary-dark)}' +
    '.uuid-btn-sm{padding:7px 18px;border:1px solid var(--primary);border-radius:var(--radius-sm);font-size:.8rem;font-weight:600;cursor:pointer;background:transparent;color:var(--primary);transition:var(--transition)}' +
    '.uuid-btn-sm:hover{background:var(--primary);color:#fff}' +
    '.uuid-actions{display:flex;gap:8px}' +
    '.uuid-list{display:flex;flex-direction:column;gap:6px}' +
    '.uuid-item{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-family:monospace;font-size:.85rem}' +
    '.uuid-item .uuid-copy{padding:4px 12px;border:1px solid var(--primary);border-radius:var(--radius-sm);font-size:.75rem;cursor:pointer;background:transparent;color:var(--primary);transition:var(--transition)}' +
    '.uuid-item .uuid-copy:hover{background:var(--primary);color:#fff}' +
    '@media(max-width:550px){.uuid-bar{grid-template-columns:1fr 1fr}}';

  function generate() {
    var ver = w('uuid-ver').value;
    var qty = parseInt(w('uuid-qty').value) || 1;
    var useUpper = w('uuid-case').value === 'upper';
    var list = document.getElementById('uuid-list');

    var html = '';
    for (var i = 0; i < qty; i++) {
      var uuid = ver === 'v7' ? uuidV7() : uuidV4();
      if (useUpper) uuid = uuid.toUpperCase();
      html += '<div class="uuid-item"><span>' + uuid + '</span><button class="uuid-copy" data-uuid="' + uuid + '" onclick="navigator.clipboard.writeText(\'' + uuid + '\');this.textContent=\'Copied\';var t=this;setTimeout(function(){t.textContent=\'Copy\'},1500)">Copy</button></div>';
    }
    list.innerHTML = html;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('uuid-gen-btn').addEventListener('click', generate);
    w('uuid-copy-all').addEventListener('click', function () {
      var items = document.querySelectorAll('.uuid-item span');
      var text = Array.from(items).map(function (s) { return s.textContent; }).join('\n');
      navigator.clipboard.writeText(text);
      this.textContent = 'Copied!';
      var t = this; setTimeout(function () { t.textContent = 'Copy All'; }, 1500);
    });
    generate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
