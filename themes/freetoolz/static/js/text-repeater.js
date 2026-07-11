(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="tr-widget">' +
      '<div class="tr-field"><label for="tr-text">Text to repeat</label><input type="text" id="tr-text" placeholder="Enter text to repeat..."></div>' +
      '<div class="tr-bar">' +
        '<div class="tr-field"><label for="tr-count">Repeat count</label><input type="number" id="tr-count" value="5" min="1" max="10000"></div>' +
        '<div class="tr-field"><label for="tr-sep">Separator</label><select id="tr-sep"><option value="space">Space</option><option value="comma">Comma</option><option value="newline">New line</option><option value="custom">Custom...</option></select></div>' +
        '<div class="tr-field tr-field-custom" id="tr-custom-field" style="display:none"><label for="tr-custom-sep">Custom separator</label><input type="text" id="tr-custom-sep" placeholder="e.g. ---"></div>' +
        '<div class="tr-field tr-field-cb"><label>&nbsp;</label><label class="tr-cb"><input type="checkbox" id="tr-prefix"> Add count prefix (1. 2. 3. ...)</label></div>' +
      '</div>' +
      '<button id="tr-gen-btn" class="tr-btn">Generate</button>' +
      '<div class="tr-info" id="tr-info"></div>' +
      '<div class="tr-field"><label for="tr-output">Output</label><textarea id="tr-output" rows="8" readonly></textarea></div>' +
      '<button id="tr-copy-btn" class="tr-btn tr-btn-secondary">Copy to Clipboard</button>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.tr-widget{display:flex;flex-direction:column;gap:14px}' +
    '.tr-field{display:flex;flex-direction:column;gap:4px}' +
    '.tr-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.tr-field input[type="text"],.tr-field input[type="number"]{padding:10px 12px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none;transition:border-color var(--transition)}' +
    '.tr-field input:focus{border-color:var(--primary)}' +
    '.tr-field select{padding:10px 12px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none;cursor:pointer}' +
    '.tr-field select:focus{border-color:var(--primary)}' +
    '.tr-bar{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end}' +
    '.tr-field-custom{grid-column:span 3}' +
    '.tr-cb{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:.9rem;color:var(--text);white-space:nowrap}' +
    '.tr-cb input[type="checkbox"]{width:16px;height:16px;accent-color:var(--primary);cursor:pointer}' +
    '.tr-btn{padding:12px 28px;border:none;border-radius:var(--radius-sm);font-size:.95rem;font-weight:700;cursor:pointer;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;transition:var(--transition);align-self:flex-start}' +
    '.tr-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,.3)}' +
    '.tr-btn-secondary{background:var(--bg);border:1px solid var(--border);color:var(--text)}' +
    '.tr-btn-secondary:hover{background:var(--primary);color:#fff;border-color:var(--primary)}' +
    '.tr-field textarea{width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;font-family:inherit;background:var(--bg);color:var(--text);resize:vertical;outline:none;transition:border-color var(--transition)}' +
    '.tr-field textarea:focus{border-color:var(--primary)}' +
    '.tr-info{font-size:.85rem;color:var(--text-secondary)}' +
    '@media(max-width:640px){.tr-bar{grid-template-columns:1fr 1fr}}';
  document.head.appendChild(style);

  var textInp = document.getElementById('tr-text');
  var countInp = document.getElementById('tr-count');
  var sepSelect = document.getElementById('tr-sep');
  var customField = document.getElementById('tr-custom-field');
  var customSep = document.getElementById('tr-custom-sep');
  var prefixChk = document.getElementById('tr-prefix');
  var output = document.getElementById('tr-output');
  var info = document.getElementById('tr-info');

  sepSelect.addEventListener('change', function () {
    customField.style.display = this.value === 'custom' ? 'block' : 'none';
  });

  function getSeparator() {
    switch (sepSelect.value) {
      case 'space': return ' ';
      case 'comma': return ', ';
      case 'newline': return '\n';
      case 'custom': return customSep.value || ' ';
      default: return ' ';
    }
  }

  function generate() {
    var text = textInp.value;
    var count = parseInt(countInp.value) || 1;
    if (count < 1) count = 1;
    if (count > 10000) count = 10000;
    if (!text) { output.value = ''; info.textContent = 'Enter some text first'; return; }

    var sep = getSeparator();
    var usePrefix = prefixChk.checked;

    var parts = [];
    for (var i = 0; i < count; i++) {
      parts.push((usePrefix ? (i + 1) + '. ' : '') + text);
    }
    var result = parts.join(sep);
    output.value = result;
    info.textContent = count + ' repetitions, ' + result.length + ' characters';
  }

  document.getElementById('tr-gen-btn').addEventListener('click', generate);
  document.getElementById('tr-copy-btn').addEventListener('click', function () {
    if (output.value) {
      navigator.clipboard.writeText(output.value).catch(function () { output.select(); document.execCommand('copy'); });
    }
  });
})();
