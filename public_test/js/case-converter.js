(function () {
  var widgetId = 'tool-widget';
  var widget = document.getElementById(widgetId);
  if (!widget) return;

  widget.innerHTML =
    '<div class="cc-widget">' +
      '<div class="cc-row">' +
        '<textarea id="cc-input" rows="6" placeholder="Type or paste text here..."></textarea>' +
      '</div>' +
      '<div class="cc-buttons">' +
        '<button onclick="convertCase(\'upper\')" class="cc-btn">UPPERCASE</button>' +
        '<button onclick="convertCase(\'lower\')" class="cc-btn">lowercase</button>' +
        '<button onclick="convertCase(\'title\')" class="cc-btn">Title Case</button>' +
        '<button onclick="convertCase(\'sentence\')" class="cc-btn">Sentence case</button>' +
        '<button onclick="convertCase(\'toggle\')" class="cc-btn">tOGGLE cASE</button>' +
        '<button onclick="ccClear()" class="cc-btn cc-btn-secondary">Clear</button>' +
      '</div>' +
      '<div class="cc-row">' +
        '<textarea id="cc-output" rows="6" readonly placeholder="Result will appear here..."></textarea>' +
      '</div>' +
      '<button onclick="ccCopy()" class="btn">Copy Result</button>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.cc-widget { display: flex; flex-direction: column; gap: 20px; }' +
    '.cc-row { display: flex; flex-direction: column; }' +
    '.cc-row textarea {' +
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
    '.cc-row textarea:focus {' +
      'border-color: var(--primary);' +
      'box-shadow: 0 0 0 3px var(--primary-light);' +
    '}' +
    '.cc-row textarea::placeholder { color: var(--text-secondary); opacity: 0.6; }' +
    '#cc-output {' +
      'background: var(--bg-card);' +
    '}' +
    '.cc-buttons {' +
      'display: flex;' +
      'flex-wrap: wrap;' +
      'gap: 10px;' +
    '}' +
    '.cc-btn {' +
      'padding: 10px 18px;' +
      'background: var(--primary);' +
      'color: #fff;' +
      'border: none;' +
      'border-radius: var(--radius-sm);' +
      'font-size: 0.85rem;' +
      'font-weight: 600;' +
      'cursor: pointer;' +
      'transition: background var(--transition), transform var(--transition);' +
      'white-space: nowrap;' +
    '}' +
    '.cc-btn:hover {' +
      'background: var(--primary-dark);' +
      'transform: translateY(-1px);' +
    '}' +
    '.cc-btn-secondary {' +
      'background: var(--bg);' +
      'color: var(--text);' +
      'border: 1px solid var(--border);' +
    '}' +
    '.cc-btn-secondary:hover {' +
      'background: var(--border);' +
      'color: var(--text);' +
      'border-color: var(--text-secondary);' +
    '}' +
    '.cc-widget .btn {' +
      'align-self: flex-start;' +
    '}' +
    '@media (max-width: 640px) {' +
      '.cc-buttons { flex-direction: column; }' +
      '.cc-btn { text-align: center; }' +
    '}';
  document.head.appendChild(style);

  var input = document.getElementById('cc-input');
  var output = document.getElementById('cc-output');

  function toSentenceCase(text) {
    return text.replace(/(^|\.\s*|!\s*|\?\s*)([a-z])/g, function (m, sep, chr) {
      return sep + chr.toUpperCase();
    });
  }

  function toTitleCase(text) {
    return text.replace(/\w\S*/g, function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  }

  function toToggleCase(text) {
    var result = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ch === ch.toUpperCase()) {
        result += ch.toLowerCase();
      } else {
        result += ch.toUpperCase();
      }
    }
    return result;
  }

  window.convertCase = function (mode) {
    var text = input.value;
    if (!text) return;

    var result;
    switch (mode) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': result = toTitleCase(text); break;
      case 'sentence': result = toSentenceCase(text); break;
      case 'toggle': result = toToggleCase(text); break;
      default: result = text;
    }

    output.value = result;
  };

  window.ccClear = function () {
    input.value = '';
    output.value = '';
    input.focus();
  };

  window.ccCopy = function () {
    if (output.value) {
      navigator.clipboard.writeText(output.value).catch(function () {
        output.select();
        document.execCommand('copy');
      });
    }
  };
})();
