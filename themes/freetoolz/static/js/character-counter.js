(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="cc2-widget">' +
      '<div class="cc2-input-section">' +
        '<textarea id="cc2-input" placeholder="Type or paste your text here..." rows="10"></textarea>' +
        '<div class="cc2-actions">' +
          '<button onclick="cc2Clear()" class="btn-secondary">Clear</button>' +
          '<button onclick="cc2Copy()" class="btn-secondary">Copy Text</button>' +
        '</div>' +
      '</div>' +
      '<div class="cc2-stats">' +
        '<div class="stat-card"><div class="stat-value" id="cc2-chars">0</div><div class="stat-label">Characters</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="cc2-chars-ns">0</div><div class="stat-label">No Spaces</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="cc2-letters">0</div><div class="stat-label">Letters</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="cc2-words">0</div><div class="stat-label">Words</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="cc2-sentences">0</div><div class="stat-label">Sentences</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="cc2-lines">0</div><div class="stat-label">Lines</div></div>' +
      '</div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.cc2-widget{display:flex;flex-direction:column;gap:24px}' +
    '.cc2-input-section{display:flex;flex-direction:column;gap:12px}' +
    '#cc2-input{width:100%;padding:16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;font-family:inherit;line-height:1.6;resize:vertical;background:var(--bg);color:var(--text);transition:border-color var(--transition),box-shadow var(--transition);outline:none}' +
    '#cc2-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-light)}' +
    '#cc2-input::placeholder{color:var(--text-secondary);opacity:.6}' +
    '.cc2-actions{display:flex;gap:10px}' +
    '.cc2-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}' +
    '@media(max-width:640px){.cc2-stats{grid-template-columns:repeat(2,1fr)}}';
  document.head.appendChild(style);

  var input = document.getElementById('cc2-input');

  function count(text) {
    var chars = text.length;
    var charsNs = text.replace(/\s/g, '').length;
    var letters = text.replace(/[^a-zA-Z]/g, '').length;
    var words = text.trim() ? text.trim().split(/\s+/).length : 0;
    var sentences = text.trim() ? text.split(/[.!?]+/).filter(function(s) { return s.trim().length > 0; }).length : 0;
    var lines = text.trim() ? text.split(/\n/).filter(function(l) { return l.trim().length > 0; }).length : 0;

    document.getElementById('cc2-chars').textContent = chars;
    document.getElementById('cc2-chars-ns').textContent = charsNs;
    document.getElementById('cc2-letters').textContent = letters;
    document.getElementById('cc2-words').textContent = words;
    document.getElementById('cc2-sentences').textContent = sentences;
    document.getElementById('cc2-lines').textContent = lines;
  }

  input.addEventListener('input', function () { count(this.value); });

  window.cc2Clear = function () {
    input.value = '';
    count('');
    input.focus();
  };

  window.cc2Copy = function () {
    if (input.value) {
      navigator.clipboard.writeText(input.value).catch(function () {
        input.select();
        document.execCommand('copy');
      });
    }
  };
})();
