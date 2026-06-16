(function () {
  function e(id) { return document.getElementById(id); }
  var HTML =
    '<div class="cm-widget"><div class="cm-tabs"><button class="cm-tab cm-active" id="cm-tab-minify" onclick="cmMode(\'minify\')">Minify</button>' +
    '<button class="cm-tab" id="cm-tab-beautify" onclick="cmMode(\'beautify\')">Beautify</button></div>' +
    '<div class="cm-field"><label>Input CSS</label><textarea id="cm-input" rows="8" placeholder="Paste your CSS here...">/* Header styles */\n.header {\n  background: #fff;\n  color:   #333;\n  padding: 20px;\n}</textarea></div>' +
    '<button class="cm-btn" onclick="cmRun()">Minify CSS</button>' +
    '<div class="cm-field"><label>Output</label><textarea id="cm-output" rows="8" readonly placeholder="Result will appear here..."></textarea></div>' +
    '<div class="cm-stats"><div class="cm-stat"><span class="cm-stat-label">Before</span><span class="cm-stat-val" id="cm-before">0 B</span></div>' +
    '<div class="cm-stat"><span class="cm-stat-label">After</span><span class="cm-stat-val" id="cm-after">0 B</span></div>' +
    '<div class="cm-stat"><span class="cm-stat-label">Saved</span><span class="cm-stat-val" id="cm-saved">0 B</span></div>' +
    '<div class="cm-stat cm-stat-green"><span class="cm-stat-label">Reduction</span><span class="cm-stat-val" id="cm-pct">0%</span></div></div>' +
    '<p class="cm-note">* CSS comments and unnecessary whitespace are removed. Selector and property values are preserved. All processing is client-side.</p></div>';
  var CSS =
    '.cm-widget{display:flex;flex-direction:column;gap:16px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.cm-tabs{display:flex;gap:4px;background:var(--bg);border-radius:var(--radius-sm);padding:4px}' +
    '.cm-tab{flex:1;padding:10px;border:none;border-radius:6px;background:transparent;color:var(--text-secondary);font-weight:600;font-size:.9rem;cursor:pointer}' +
    '.cm-tab.cm-active{background:var(--primary);color:#fff}' +
    '.cm-field{display:flex;flex-direction:column;gap:4px}' +
    '.cm-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.cm-field textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;font-family:ui-monospace,SFMono-Regular,monospace;background:var(--bg);color:var(--text);outline:none;resize:vertical;min-height:120px}' +
    '.cm-field textarea:focus{border-color:var(--primary)}' +
    '.cm-btn{padding:12px;border:none;border-radius:var(--radius-sm);font-size:1rem;font-weight:700;background:var(--primary);color:#fff;cursor:pointer}' +
    '.cm-btn:hover{background:var(--primary-dark);transform:translateY(-1px)}' +
    '.cm-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.cm-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;text-align:center}' +
    '.cm-stat-green{background:#14532d;border-color:#22c55e}' +
    '.cm-stat-green .cm-stat-label{color:#86efac}.cm-stat-green .cm-stat-val{color:#22c55e}' +
    '.cm-stat-label{display:block;font-size:.75rem;color:var(--text-secondary);margin-bottom:2px}' +
    '.cm-stat-val{display:block;font-size:1.1rem;font-weight:700;color:var(--primary)}' +
    '.cm-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.cm-stats{grid-template-columns:1fr 1fr}}';
  function fmt(n) { if (n < 1024) return n + ' B'; return (n/1024).toFixed(1) + ' KB'; }
  window.cmMode = function(m) { e('cm-tab-minify').className = 'cm-tab' + (m==='minify'?' cm-active':''); e('cm-tab-beautify').className = 'cm-tab' + (m!=='minify'?' cm-active':''); e('cm-btn').textContent = m==='minify'?'Minify CSS':'Beautify CSS'; window._cmMode = m; cmRun(); };
  window.cmRun = function() {
    var inp = e('cm-input').value; var before = inp.length; var out = inp;
    if (window._cmMode !== 'beautify') {
      out = out.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*:\s*/g, ':').replace(/\s*\{\s*/g, '{').replace(/\s*\}\s*/g, '}').replace(/\s*;\s*/g, ';').replace(/\s*,\s*/g, ',').replace(/\s*>\s*/g, '>').replace(/\s*\+\s*/g, '+').replace(/\s*~\s*/g, '~').replace(/\s+/g, ' ').replace(/\s*;\}/g, '}').trim();
    } else {
      out = out.replace(/[\s\n\r]+/g, ' ').replace(/\{/g, ' {\n  ').replace(/;/g, ';\n  ').replace(/\}/g, '\n}\n\n').replace(/:\s+/g, ': ');
    }
    e('cm-output').value = out; var after = out.length; var saved = before - after;
    e('cm-before').textContent = fmt(before); e('cm-after').textContent = fmt(after); e('cm-saved').textContent = fmt(Math.max(0,saved)); e('cm-pct').textContent = (before>0?Math.max(0,saved/before*100):0).toFixed(1) + '%';
  };
  function init() { window._cmMode = 'minify'; var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); var c = document.getElementById('tool-widget'); if(!c)return; c.innerHTML = HTML; e('cm-input').addEventListener('input', cmRun); cmRun(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
