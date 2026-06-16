(function () {
  function e(id) { return document.getElementById(id); }

  var HTML =
    '<div class="hm-widget"><div class="hm-tabs"><button class="hm-tab hm-active" id="hm-tab-minify" onclick="hmMode(\'minify\')">Minify</button>' +
    '<button class="hm-tab" id="hm-tab-beautify" onclick="hmMode(\'beautify\')">Beautify</button></div>' +
    '<div class="hm-field"><label>Input HTML</label><textarea id="hm-input" rows="8" placeholder="Paste your HTML here...">&lt;!-- comment --&gt;\n&lt;html&gt;\n&lt;head&gt;\n&lt;title&gt;  Test  &lt;/title&gt;\n&lt;/head&gt;\n&lt;/html&gt;</textarea></div>' +
    '<button class="hm-btn" onclick="hmRun()">Minify HTML</button>' +
    '<div class="hm-field"><label>Output</label><textarea id="hm-output" rows="8" readonly placeholder="Result will appear here..."></textarea></div>' +
    '<div class="hm-stats"><div class="hm-stat"><span class="hm-stat-label">Before</span><span class="hm-stat-val" id="hm-before">0 B</span></div>' +
    '<div class="hm-stat"><span class="hm-stat-label">After</span><span class="hm-stat-val" id="hm-after">0 B</span></div>' +
    '<div class="hm-stat"><span class="hm-stat-label">Saved</span><span class="hm-stat-val" id="hm-saved">0 B</span></div>' +
    '<div class="hm-stat hm-stat-green"><span class="hm-stat-label">Reduction</span><span class="hm-stat-val" id="hm-pct">0%</span></div></div>' +
    '<p class="hm-note">* HTML comments and unnecessary whitespace are removed. Script and style content is preserved. All processing is done client-side.</p></div>';

  var CSS =
    '.hm-widget{display:flex;flex-direction:column;gap:16px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.hm-tabs{display:flex;gap:4px;background:var(--bg);border-radius:var(--radius-sm);padding:4px}' +
    '.hm-tab{flex:1;padding:10px;border:none;border-radius:6px;background:transparent;color:var(--text-secondary);font-weight:600;font-size:.9rem;cursor:pointer;transition:var(--transition)}' +
    '.hm-tab.hm-active{background:var(--primary);color:#fff}' +
    '.hm-field{display:flex;flex-direction:column;gap:4px}' +
    '.hm-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.hm-field textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;font-family:ui-monospace,SFMono-Regular,monospace;background:var(--bg);color:var(--text);outline:none;resize:vertical;min-height:120px}' +
    '.hm-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,.1)}' +
    '.hm-btn{padding:12px;border:none;border-radius:var(--radius-sm);font-size:1rem;font-weight:700;background:var(--primary);color:#fff;cursor:pointer;transition:var(--transition)}' +
    '.hm-btn:hover{background:var(--primary-dark);transform:translateY(-1px)}' +
    '.hm-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.hm-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;text-align:center}' +
    '.hm-stat-green{background:#14532d;border-color:#22c55e}' +
    '.hm-stat-green .hm-stat-label{color:#86efac}.hm-stat-green .hm-stat-val{color:#22c55e}' +
    '.hm-stat-label{display:block;font-size:.75rem;color:var(--text-secondary);margin-bottom:2px}' +
    '.hm-stat-val{display:block;font-size:1.1rem;font-weight:700;color:var(--primary)}' +
    '.hm-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.hm-stats{grid-template-columns:1fr 1fr}}';

  function fmtSize(n) {
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  }

  window.hmMode = function(mode) {
    var isMin = mode === 'minify';
    e('hm-tab-minify').className = 'hm-tab' + (isMin ? ' hm-active' : '');
    e('hm-tab-beautify').className = 'hm-tab' + (!isMin ? ' hm-active' : '');
    e('hm-btn').textContent = isMin ? 'Minify HTML' : 'Beautify HTML';
    window._hmMode = mode;
    hmRun();
  };

  window.hmRun = function() {
    var input = e('hm-input').value;
    var before = input.length;
    var output = input;

    if (window._hmMode !== 'beautify') {
      output = output.replace(/<!--[\s\S]*?-->/g, '');
      output = output.replace(/>\s+</g, '><');
      output = output.replace(/\s{2,}/g, ' ');
      output = output.replace(/\n\s*/g, '');
      output = output.replace(/>\s+([^\s<])/g, '>$1');
      output = output.replace(/([^\s>])\s+</g, '$1<');
    } else {
      var indent = 0;
      output = output.replace(/>\s*</g, '>\n<');
      output = output.replace(/<!--[\s\S]*?-->/g, function(m) { return m.replace(/\n/g, '\n  '); });
      output = output.split('\n').map(function(line) {
        var trim = line.trim();
        if (!trim) return '';
        if (trim.match(/^<\/[^>]+>$/)) indent = Math.max(0, indent - 1);
        var result = '  '.repeat(indent) + trim;
        if (trim.match(/^<[^/!?][^>]*[^/]?>$/) && !trim.match(/^<input|^<br|^<hr|^<img|^<link|^<meta|^<!DOCTYPE/i)) indent++;
        return result;
      }).filter(Boolean).join('\n');
    }

    e('hm-output').value = output;
    var after = output.length;
    var saved = before - after;
    var pct = before > 0 ? (saved / before * 100) : 0;

    e('hm-before').textContent = fmtSize(before);
    e('hm-after').textContent = fmtSize(after);
    e('hm-saved').textContent = fmtSize(Math.max(0, saved));
    e('hm-pct').textContent = Math.max(0, pct).toFixed(1) + '%';
  };

  function init() {
    window._hmMode = 'minify';
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    e('hm-input').addEventListener('input', hmRun);
    hmRun();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
