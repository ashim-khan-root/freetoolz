(function () {
  var WIDGET_HTML =
    '<div class="pw-widget">' +
    '<div class="pw-output-section">' +
    '<div class="pw-display">' +
    '<input type="text" id="pw-output" readonly value="">' +
    '<button onclick="copyPassword()" class="pw-btn-icon" title="Copy to clipboard">' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>' +
    '</button>' +
    '<button onclick="regenerate()" class="pw-btn-icon" title="Generate new password">' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>' +
    '</button>' +
    '</div>' +
    '<div class="pw-strength">' +
    '<div class="pw-strength-bar" id="strength-bar">' +
    '<div class="pw-strength-fill" id="strength-fill" style="width: 0%"></div>' +
    '</div>' +
    '<span class="pw-strength-label" id="strength-label">Strong</span>' +
    '</div>' +
    '<div class="pw-copy-toast" id="pw-copy-toast">Copied!</div>' +
    '</div>' +
    '<div class="pw-options">' +
    '<div class="pw-option">' +
    '<label class="pw-length-label">Length: <span id="length-value">16</span></label>' +
    '<input type="range" id="pw-length" min="4" max="128" value="16" class="pw-slider">' +
    '</div>' +
    '<div class="pw-checkboxes">' +
    '<label class="pw-checkbox-label"><input type="checkbox" id="pw-uppercase" checked> <span>A-Z</span></label>' +
    '<label class="pw-checkbox-label"><input type="checkbox" id="pw-lowercase" checked> <span>a-z</span></label>' +
    '<label class="pw-checkbox-label"><input type="checkbox" id="pw-numbers" checked> <span>0-9</span></label>' +
    '<label class="pw-checkbox-label"><input type="checkbox" id="pw-symbols" checked> <span>!@#$%^&*</span></label>' +
    '</div>' +
    '<button onclick="regenerate()" class="pw-generate-btn" id="pw-generate-btn">Generate Password</button>' +
    '</div>' +
    '</div>';

  var CSS =
    '.pw-widget{display:flex;flex-direction:column;gap:24px}' +
    '.pw-output-section{position:relative}' +
    '.pw-display{display:flex;align-items:center;gap:8px;background:var(--bg);border:2px solid var(--border);border-radius:var(--radius);padding:4px;transition:border-color var(--transition)}' +
    '.pw-display:focus-within{border-color:var(--primary)}' +
    '.pw-display input{flex:1;border:none;background:transparent;padding:12px 16px;font-family:"SF Mono","Fira Code","Consolas",monospace;font-size:1.15rem;color:var(--text);outline:none;letter-spacing:1px}' +
    '.pw-btn-icon{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border:none;background:var(--bg-card);color:var(--text-secondary);border-radius:var(--radius-sm);cursor:pointer;transition:all var(--transition)}' +
    '.pw-btn-icon:hover{background:var(--primary);color:#fff}' +
    '.pw-btn-icon:active{transform:scale(0.92)}' +
    '.pw-strength{display:flex;align-items:center;gap:12px;margin-top:4px}' +
    '.pw-strength-bar{flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden}' +
    '.pw-strength-fill{height:100%;border-radius:3px;transition:width 0.3s ease,background 0.3s ease}' +
    '.pw-strength-label{font-size:0.8rem;font-weight:600;min-width:72px;text-align:right;color:var(--text-secondary)}' +
    '.pw-copy-toast{position:absolute;top:-8px;right:60px;background:#059669;color:#fff;padding:4px 12px;border-radius:6px;font-size:0.78rem;font-weight:600;opacity:0;transform:translateY(4px);transition:all 0.25s ease;pointer-events:none}' +
    '.pw-copy-toast.show{opacity:1;transform:translateY(0)}' +
    '.pw-options{display:flex;flex-direction:column;gap:20px}' +
    '.pw-option{display:flex;flex-direction:column;gap:8px}' +
    '.pw-length-label{font-size:0.9rem;font-weight:600;color:var(--text)}' +
    '.pw-slider{-webkit-appearance:none;appearance:none;width:100%;height:6px;background:var(--border);border-radius:3px;outline:none;cursor:pointer}' +
    '.pw-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;background:var(--primary);border-radius:50%;cursor:pointer;box-shadow:0 2px 6px rgba(99,102,241,0.4);transition:transform var(--transition)}' +
    '.pw-slider::-webkit-slider-thumb:hover{transform:scale(1.15)}' +
    '.pw-slider::-moz-range-thumb{width:20px;height:20px;background:var(--primary);border:none;border-radius:50%;cursor:pointer;box-shadow:0 2px 6px rgba(99,102,241,0.4)}' +
    '.pw-checkboxes{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.pw-checkbox-label{display:flex;align-items:center;gap:8px;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;transition:all var(--transition);font-size:0.88rem;color:var(--text);user-select:none}' +
    '.pw-checkbox-label:hover{border-color:var(--primary-light)}' +
    '.pw-checkbox-label:has(input:checked){border-color:var(--primary);background:rgba(99,102,241,0.06)}' +
    '.pw-checkbox-label input[type=checkbox]{accent-color:var(--primary);width:16px;height:16px}' +
    '.pw-generate-btn{width:100%;padding:14px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);font-size:1rem;font-weight:600;cursor:pointer;transition:all var(--transition)}' +
    '.pw-generate-btn:hover{background:var(--primary-dark);transform:translateY(-1px);box-shadow:0 4px 14px rgba(99,102,241,0.35)}' +
    '.pw-generate-btn:active{transform:translateY(0)}' +
    '@media(max-width:480px){.pw-checkboxes{grid-template-columns:1fr}.pw-display input{font-size:0.95rem;padding:10px 12px}}';

  var CHARS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  var STRENGTH = {
    levels: [
      { label: 'Very Weak', min: 0, color: '#ef4444' },
      { label: 'Weak', min: 20, color: '#f97316' },
      { label: 'Fair', min: 40, color: '#eab308' },
      { label: 'Strong', min: 60, color: '#22c55e' },
      { label: 'Very Strong', min: 80, color: '#16a34a' }
    ]
  };

  function randomBytes(n) {
    var arr = new Uint32Array(n);
    crypto.getRandomValues(arr);
    return arr;
  }

  function generatePassword() {
    var length = parseInt(document.getElementById('pw-length').value, 10);
    var useUpper = document.getElementById('pw-uppercase').checked;
    var useLower = document.getElementById('pw-lowercase').checked;
    var useNumbers = document.getElementById('pw-numbers').checked;
    var useSymbols = document.getElementById('pw-symbols').checked;

    var pool = '';
    var forced = [];

    if (useUpper) { pool += CHARS.uppercase; forced.push(CHARS.uppercase[randomBytes(1)[0] % CHARS.uppercase.length]); }
    if (useLower) { pool += CHARS.lowercase; forced.push(CHARS.lowercase[randomBytes(1)[0] % CHARS.lowercase.length]); }
    if (useNumbers) { pool += CHARS.numbers; forced.push(CHARS.numbers[randomBytes(1)[0] % CHARS.numbers.length]); }
    if (useSymbols) { pool += CHARS.symbols; forced.push(CHARS.symbols[randomBytes(1)[0] % CHARS.symbols.length]); }

    if (!pool) {
      document.getElementById('pw-output').value = 'Select at least one type';
      updateStrength('');
      return;
    }

    var actualLength = Math.max(length, forced.length);
    var bytes = randomBytes(actualLength);
    var result = [];

    for (var i = 0; i < actualLength; i++) {
      result.push(pool[bytes[i] % pool.length]);
    }

    for (var j = 0; j < forced.length; j++) {
      var pos = bytes[actualLength + j] % actualLength;
      result[pos] = forced[j];
    }

    var password = result.join('');
    document.getElementById('pw-output').value = password;
    updateStrength(password);
  }

  function updateStrength(password) {
    var fill = document.getElementById('strength-fill');
    var label = document.getElementById('strength-label');

    if (!password) {
      fill.style.width = '0%';
      fill.style.background = 'var(--border)';
      label.textContent = '—';
      return;
    }

    var score = 0;
    var hasUpper = /[A-Z]/.test(password);
    var hasLower = /[a-z]/.test(password);
    var hasNumber = /[0-9]/.test(password);
    var hasSymbol = /[^a-zA-Z0-9]/.test(password);

    var variety = (hasUpper ? 1 : 0) + (hasLower ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSymbol ? 1 : 0);
    score = Math.min(100, Math.round((password.length * 1.5) + (variety * 8) - 10));

    if (variety <= 1) score = Math.min(score, 30);
    if (password.length < 8) score = Math.min(score, 40);

    var level = STRENGTH.levels[0];
    for (var i = STRENGTH.levels.length - 1; i >= 0; i--) {
      if (score >= STRENGTH.levels[i].min) { level = STRENGTH.levels[i]; break; }
    }

    fill.style.width = score + '%';
    fill.style.background = level.color;
    label.textContent = level.label;
    label.style.color = level.color;
  }

  window.copyPassword = function () {
    var input = document.getElementById('pw-output');
    var toast = document.getElementById('pw-copy-toast');
    if (!input.value || input.value === 'Select at least one type') return;

    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value).then(function () {
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 1800);
    }).catch(function () {
      document.execCommand('copy');
      toast.classList.add('show');
      setTimeout(function () { toast.classList.remove('show'); }, 1800);
    });
  };

  window.regenerate = function () {
    generatePassword();
  };

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = WIDGET_HTML;

    var slider = document.getElementById('pw-length');
    var lengthVal = document.getElementById('length-value');

    slider.addEventListener('input', function () {
      lengthVal.textContent = slider.value;
    });

    slider.addEventListener('change', function () {
      lengthVal.textContent = slider.value;
      generatePassword();
    });

    var checkboxes = document.querySelectorAll('.pw-checkboxes input[type=checkbox]');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].addEventListener('change', generatePassword);
    }

    generatePassword();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
