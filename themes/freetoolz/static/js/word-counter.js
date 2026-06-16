(function () {
  var widgetId = 'tool-widget';
  var widget = document.getElementById(widgetId);
  if (!widget) return;

  widget.innerHTML =
    '<div class="counter-widget">' +
      '<div class="counter-input-section">' +
        '<textarea id="counter-input" placeholder="Type or paste your text here..." rows="10"></textarea>' +
        '<div class="counter-actions">' +
          '<button onclick="clearText()" class="btn-secondary">Clear</button>' +
          '<button onclick="copyText()" class="btn-secondary">Copy</button>' +
        '</div>' +
      '</div>' +
      '<div class="counter-stats">' +
        '<div class="stat-card"><div class="stat-value" id="stat-words">0</div><div class="stat-label">Words</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="stat-chars">0</div><div class="stat-label">Characters</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="stat-chars-no-space">0</div><div class="stat-label">Chars (no space)</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="stat-sentences">0</div><div class="stat-label">Sentences</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="stat-paragraphs">0</div><div class="stat-label">Paragraphs</div></div>' +
        '<div class="stat-card"><div class="stat-value" id="stat-reading-time">0</div><div class="stat-label">Min Read</div></div>' +
      '</div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.counter-widget { display: flex; flex-direction: column; gap: 24px; }' +
    '.counter-input-section { display: flex; flex-direction: column; gap: 12px; }' +
    '#counter-input {' +
      'width: 100%;' +
      'padding: 16px;' +
      'border: 1px solid var(--border);' +
      'border-radius: var(--radius-sm);' +
      'font-size: 1rem;' +
      'font-family: inherit;' +
      'line-height: 1.6;' +
      'resize: vertical;' +
      'background: var(--bg);' +
      'color: var(--text);' +
      'transition: border-color var(--transition), box-shadow var(--transition);' +
      'outline: none;' +
    '}' +
    '#counter-input:focus {' +
      'border-color: var(--primary);' +
      'box-shadow: 0 0 0 3px var(--primary-light);' +
    '}' +
    '#counter-input::placeholder { color: var(--text-secondary); opacity: 0.6; }' +
    '.counter-actions { display: flex; gap: 10px; }' +
    '.btn-secondary {' +
      'padding: 10px 24px;' +
      'background: var(--bg);' +
      'color: var(--text);' +
      'border: 1px solid var(--border);' +
      'border-radius: var(--radius-sm);' +
      'font-size: 0.9rem;' +
      'font-weight: 600;' +
      'cursor: pointer;' +
      'transition: background var(--transition), border-color var(--transition);' +
    '}' +
    '.btn-secondary:hover {' +
      'background: var(--primary);' +
      'color: #fff;' +
      'border-color: var(--primary);' +
    '}' +
    '.counter-stats {' +
      'display: grid;' +
      'grid-template-columns: repeat(3, 1fr);' +
      'gap: 16px;' +
    '}' +
    '.stat-card {' +
      'background: var(--bg-card);' +
      'border: 1px solid var(--border);' +
      'border-radius: var(--radius);' +
      'padding: 20px 16px;' +
      'text-align: center;' +
      'box-shadow: var(--shadow);' +
      'transition: box-shadow var(--transition), transform var(--transition);' +
    '}' +
    '.stat-card:hover {' +
      'box-shadow: var(--shadow-hover);' +
      'transform: translateY(-2px);' +
    '}' +
    '.stat-value {' +
      'font-size: 1.8rem;' +
      'font-weight: 800;' +
      'color: var(--primary);' +
      'line-height: 1.2;' +
    '}' +
    '.stat-label {' +
      'font-size: 0.85rem;' +
      'color: var(--text-secondary);' +
      'margin-top: 4px;' +
      'font-weight: 500;' +
    '}' +
    '@media (max-width: 640px) {' +
      '.counter-stats { grid-template-columns: repeat(2, 1fr); }' +
    '}';
  document.head.appendChild(style);

  var input = document.getElementById('counter-input');

  function count(text) {
    var words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    var chars = text.length;
    var charsNoSpace = text.replace(/\s+/g, '').length;
    var sentences = text.trim() ? text.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; }).length : 0;
    var paragraphs = text.trim() ? text.split(/\n+/).filter(function (p) { return p.trim().length > 0; }).length : 0;
    var readingTime = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;

    document.getElementById('stat-words').textContent = words;
    document.getElementById('stat-chars').textContent = chars;
    document.getElementById('stat-chars-no-space').textContent = charsNoSpace;
    document.getElementById('stat-sentences').textContent = sentences;
    document.getElementById('stat-paragraphs').textContent = paragraphs;
    document.getElementById('stat-reading-time').textContent = readingTime;
  }

  input.addEventListener('input', function () { count(this.value); });

  window.clearText = function () {
    input.value = '';
    count('');
    input.focus();
  };

  window.copyText = function () {
    if (input.value) {
      navigator.clipboard.writeText(input.value).catch(function () {
        input.select();
        document.execCommand('copy');
      });
    }
  };
})();
