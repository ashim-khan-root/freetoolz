(function () {
  var w = document.getElementById.bind(document);

  var COMMON_PASSWORDS = ['password', '123456', '12345678', 'qwerty', 'abc123', 'monkey', '123456789', 'letmein', 'password1', '1234', 'admin', 'welcome', 'passw0rd', 'football', 'baseball', 'dragon', 'master', 'sunshine', 'princess', '123123', 'iloveyou', 'trustno1', '111111', '000000', 'login', 'qwerty123', 'passwd', 'p@ssw0rd', 'P@ssw0rd', 'changeme', 'secret'];

  var HTML =
    '<div class="ps-widget">' +
    '<div class="ps-input-wrap">' +
    '<input type="password" id="ps-input" class="ps-input" placeholder="Type a password..." autocomplete="off">' +
    '<button id="ps-toggle" class="ps-toggle">&#x1F441;</button>' +
    '</div>' +
    '<div class="ps-meter"><div class="ps-meter-fill" id="ps-meter" style="width:0%"></div></div>' +
    '<div class="ps-label" id="ps-label">Type a password to check its strength.</div>' +
    '<div class="ps-grid">' +
    '<div class="ps-item"><span class="ps-il">Length</span><span class="ps-iv" id="ps-length">0</span></div>' +
    '<div class="ps-item"><span class="ps-il">Entropy</span><span class="ps-iv" id="ps-entropy">0 bits</span></div>' +
    '<div class="ps-item"><span class="ps-il">Uppercase</span><span class="ps-iv" id="ps-upper">0</span></div>' +
    '<div class="ps-item"><span class="ps-il">Lowercase</span><span class="ps-iv" id="ps-lower">0</span></div>' +
    '<div class="ps-item"><span class="ps-il">Digits</span><span class="ps-iv" id="ps-digits">0</span></div>' +
    '<div class="ps-item"><span class="ps-il">Symbols</span><span class="ps-iv" id="ps-symbols">0</span></div>' +
    '</div>' +
    '<div class="ps-feedback" id="ps-feedback"></div></div>';

  var CSS =
    '.ps-widget{display:flex;flex-direction:column;gap:14px}' +
    '.ps-input-wrap{position:relative}' +
    '.ps-input{width:100%;padding:16px 50px 16px 18px;border:2px solid var(--border);border-radius:var(--radius);font-size:1.1rem;background:var(--bg);color:var(--text);outline:none;font-family:monospace;transition:var(--transition);transition-property:border-color,box-shadow}' +
    '.ps-input:focus{border-color:var(--primary);box-shadow:0 0 0 4px var(--primary-glow)}' +
    '.ps-toggle{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;font-size:1.2rem;cursor:pointer;padding:4px;opacity:.5;transition:opacity .2s}' +
    '.ps-toggle:hover{opacity:1}' +
    '.ps-meter{height:10px;background:var(--border);border-radius:5px;overflow:hidden}' +
    '.ps-meter-fill{height:100%;border-radius:5px;transition:width .3s ease,background .3s ease}' +
    '.ps-label{font-size:1rem;font-weight:700;text-align:center;transition:color .3s ease}' +
    '.ps-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}' +
    '.ps-item{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px}' +
    '.ps-il{display:block;font-size:.68rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.ps-iv{font-size:1rem;font-weight:700;color:var(--text)}' +
    '.ps-feedback{font-size:.85rem;color:var(--text-secondary);line-height:1.6;min-height:40px}' +
    '.ps-fb-item{padding:4px 0}' +
    '.ps-fb-bad{color:#ef4444}.ps-fb-good{color:#22c55e}' +
    '@media(max-width:500px){.ps-grid{grid-template-columns:1fr 1fr}}';

  var STRENGTH_COLORS = ['#ef4444', '#ef4444', '#eab308', '#22c55e', '#22c55e'];
  var STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  function calc() {
    var pw = w('ps-input').value;
    var len = pw.length;

    var hasUpper = /[A-Z]/.test(pw);
    var hasLower = /[a-z]/.test(pw);
    var hasDigit = /\d/.test(pw);
    var hasSymbol = /[^A-Za-z0-9]/.test(pw);
    var upperCount = (pw.match(/[A-Z]/g) || []).length;
    var lowerCount = (pw.match(/[a-z]/g) || []).length;
    var digitCount = (pw.match(/\d/g) || []).length;
    var symbolCount = (pw.match(/[^A-Za-z0-9]/g) || []).length;

    // Entropy estimation
    var charset = 0;
    if (hasLower) charset += 26;
    if (hasUpper) charset += 26;
    if (hasDigit) charset += 10;
    if (hasSymbol) charset += 33;
    var entropy = len > 0 && charset > 0 ? len * Math.log2(charset) : 0;

    // Score 0-4
    var score = 0;
    if (len >= 8) score++;
    if (len >= 12) score++;
    if (hasUpper && hasLower) score++;
    if (hasDigit) score++;
    if (hasSymbol) score++;
    if (len >= 16) score = Math.min(4, score + 1);

    // Check common passwords
    var isCommon = COMMON_PASSWORDS.indexOf(pw.toLowerCase()) >= 0;
    if (isCommon) score = 0;

    // Check sequential/repeated
    var hasSequential = false;
    for (var i = 2; i < pw.length; i++) {
      if (pw.charCodeAt(i) - pw.charCodeAt(i - 1) === 1 && pw.charCodeAt(i - 1) - pw.charCodeAt(i - 2) === 1) { hasSequential = true; break; }
    }
    var hasRepeated = /(.)\1{2,}/.test(pw);
    if (hasSequential || hasRepeated) score = Math.max(0, score - 1);

    var pct = score / 4 * 100;
    w('ps-meter').style.width = pct + '%';
    w('ps-meter').style.background = STRENGTH_COLORS[score] || '#ef4444';
    w('ps-label').textContent = len === 0 ? 'Enter a password to check.' : STRENGTH_LABELS[score] || 'Very Weak';
    w('ps-label').style.color = len === 0 ? 'var(--text-secondary)' : STRENGTH_COLORS[score] || '#ef4444';
    w('ps-length').textContent = len;
    w('ps-entropy').textContent = entropy.toFixed(1) + ' bits';
    w('ps-upper').textContent = upperCount;
    w('ps-lower').textContent = lowerCount;
    w('ps-digits').textContent = digitCount;
    w('ps-symbols').textContent = symbolCount;

    var fb = document.getElementById('ps-feedback');
    var items = [];
    if (len < 8) items.push({ text: 'Use at least 8 characters (12+ recommended)', cls: 'ps-fb-bad' });
    else if (len < 12) items.push({ text: 'Good length. For stronger security, use 12+ characters', cls: 'ps-fb-good' });
    else items.push({ text: 'Length is good', cls: 'ps-fb-good' });

    if (!hasLower) items.push({ text: 'Add lowercase letters', cls: 'ps-fb-bad' });
    if (!hasUpper) items.push({ text: 'Add uppercase letters', cls: 'ps-fb-bad' });
    if (!hasDigit) items.push({ text: 'Add digits', cls: 'ps-fb-bad' });
    if (!hasSymbol) items.push({ text: 'Add symbols (!@#$%^&*)', cls: 'ps-fb-bad' });
    if (isCommon) items.push({ text: 'This password is commonly used and easily guessed', cls: 'ps-fb-bad' });
    if (hasSequential) items.push({ text: 'Avoid sequential characters (abc, 123)', cls: 'ps-fb-bad' });
    if (hasRepeated) items.push({ text: 'Avoid repeated characters (aaa, 111)', cls: 'ps-fb-bad' });

    if (items.length === 0) items.push({ text: 'Password looks strong!', cls: 'ps-fb-good' });

    fb.innerHTML = items.map(function (item) {
      return '<div class="ps-fb-item ' + item.cls + '">' + (item.cls === 'ps-fb-good' ? '&#x2713; ' : '&#x2716; ') + item.text + '</div>';
    }).join('');
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('ps-input').addEventListener('input', calc);
    w('ps-toggle').addEventListener('click', function () {
      var input = w('ps-input');
      input.type = input.type === 'password' ? 'text' : 'password';
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
