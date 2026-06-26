(function () {
  function e(id) { return document.getElementById(id); }
  var HTML =
    '<div class="jm-widget"><div class="jm-tabs"><button class="jm-tab jm-active" id="jm-tab-minify" onclick="jmMode(\'minify\')">Minify</button>' +
    '<button class="jm-tab" id="jm-tab-beautify" onclick="jmMode(\'beautify\')">Beautify</button></div>' +
    '<div class="jm-field"><label>Input JavaScript</label><textarea id="jm-input" rows="8" placeholder="Paste your JavaScript here...">// Sum function\nfunction add(a, b) {\n  return a + b;\n}</textarea></div>' +
    '<button class="jm-btn" onclick="jmRun()">Minify JS</button>' +
    '<div class="jm-field"><label>Output</label><textarea id="jm-output" rows="8" readonly placeholder="Result will appear here..."></textarea></div>' +
    '<div class="jm-stats"><div class="jm-stat"><span class="jm-stat-label">Before</span><span class="jm-stat-val" id="jm-before">0 B</span></div>' +
    '<div class="jm-stat"><span class="jm-stat-label">After</span><span class="jm-stat-val" id="jm-after">0 B</span></div>' +
    '<div class="jm-stat"><span class="jm-stat-label">Saved</span><span class="jm-stat-val" id="jm-saved">0 B</span></div>' +
    '<div class="jm-stat jm-stat-green"><span class="jm-stat-label">Reduction</span><span class="jm-stat-val" id="jm-pct">0%</span></div></div>' +
    '<p class="jm-note">* JS comments and whitespace are removed. String contents are preserved. All processing is client-side.</p></div>';
  var CSS =
    '.jm-widget{display:flex;flex-direction:column;gap:16px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.jm-tabs{display:flex;gap:4px;background:var(--bg);border-radius:var(--radius-sm);padding:4px}' +
    '.jm-tab{flex:1;padding:10px;border:none;border-radius:6px;background:transparent;color:var(--text-secondary);font-weight:600;font-size:.9rem;cursor:pointer}' +
    '.jm-tab.jm-active{background:var(--primary);color:#fff}' +
    '.jm-field{display:flex;flex-direction:column;gap:4px}' +
    '.jm-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.jm-field textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;font-family:ui-monospace,SFMono-Regular,monospace;background:var(--bg);color:var(--text);outline:none;resize:vertical;min-height:120px}' +
    '.jm-field textarea:focus{border-color:var(--primary)}' +
    '.jm-btn{padding:12px;border:none;border-radius:var(--radius-sm);font-size:1rem;font-weight:700;background:var(--primary);color:#fff;cursor:pointer}' +
    '.jm-btn:hover{background:var(--primary-dark);transform:translateY(-1px)}' +
    '.jm-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.jm-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;text-align:center}' +
    '.jm-stat-green{background:#14532d;border-color:#22c55e}' +
    '.jm-stat-green .jm-stat-label{color:#86efac}.jm-stat-green .jm-stat-val{color:#22c55e}' +
    '.jm-stat-label{display:block;font-size:.75rem;color:var(--text-secondary);margin-bottom:2px}' +
    '.jm-stat-val{display:block;font-size:1.1rem;font-weight:700;color:var(--primary)}' +
    '.jm-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.jm-stats{grid-template-columns:1fr 1fr}}';
  function fmt(n) { if(n<1024)return n+' B';return(n/1024).toFixed(1)+' KB'; }
  window.jmMode = function(m) { e('jm-tab-minify').className='jm-tab'+(m==='minify'?' jm-active':''); e('jm-tab-beautify').className='jm-tab'+(m!=='minify'?' jm-active':''); e('jm-btn').textContent=m==='minify'?'Minify JS':'Beautify JS'; window._jmMode=m; jmRun(); };
  window.jmRun = function() {
    var inp = e('jm-input').value; var before = inp.length; var out = inp;
    if (window._jmMode !== 'beautify') {
      out = out.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*[\r\n]/gm, '').replace(/\s+/g, ' ').replace(/\s*([{}();,=+\-*/%!<>|&?:])\s*/g, '$1').replace(/\s*\]\s*/g, ']').replace(/\s*\[\s*/g, '[');
    } else {
      var indent = 0; out = out.replace(/\s+/g, ' ').replace(/[{;}]/g, '$&\n').split('\n').map(function(l) { var t=l.trim(); if(!t)return ''; if(t.match(/^}/)) indent=Math.max(0,indent-1); var r='  '.repeat(indent)+t; if(t.match(/{$/)) indent++; return r; }).filter(Boolean).join('\n');
    }
    e('jm-output').value = out; var after = out.length; var saved = before - after;
    e('jm-before').textContent = fmt(before); e('jm-after').textContent = fmt(after); e('jm-saved').textContent = fmt(Math.max(0,saved)); e('jm-pct').textContent = (before>0?Math.max(0,saved/before*100):0).toFixed(1)+'%';
  };
  function init() { window._jmMode = 'minify'; var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s); var c = document.getElementById('tool-widget'); if(!c)return; c.innerHTML = HTML; e('jm-input').addEventListener('input', jmRun); jmRun(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
