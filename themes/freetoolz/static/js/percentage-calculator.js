(function () {
  var WIDGET_HTML =
    '<div class="pc-widget">' +
    '  <div class="pc-mode-select">' +
    '    <button onclick="pcSetMode(\'of\')" class="pc-mode-btn pc-active" data-mode="of">What is X% of Y?</button>' +
    '    <button onclick="pcSetMode(\'what\')" class="pc-mode-btn" data-mode="what">X is what % of Y?</button>' +
    '    <button onclick="pcSetMode(\'change\')" class="pc-mode-btn" data-mode="change">% Change</button>' +
    '  </div>' +
    '  <div id="pc-of" class="pc-calc">' +
    '    <div class="pc-fields">' +
    '      <label>X% <input type="number" id="pc-of-x" value="20" class="pc-input"></label>' +
    '      <label>of Y <input type="number" id="pc-of-y" value="200" class="pc-input"></label>' +
    '    </div>' +
    '    <div class="pc-result"><span id="pc-of-result">40</span></div>' +
    '    <div class="pc-formula" id="pc-of-formula">20 \u00f7 100 \u00d7 200 = 40</div>' +
    '  </div>' +
    '  <div id="pc-what" class="pc-calc" style="display:none;">' +
    '    <div class="pc-fields">' +
    '      <label>X <input type="number" id="pc-what-x" value="50" class="pc-input"></label>' +
    '      <label>is what % of Y <input type="number" id="pc-what-y" value="200" class="pc-input"></label>' +
    '    </div>' +
    '    <div class="pc-result"><span id="pc-what-result">25%</span></div>' +
    '    <div class="pc-formula" id="pc-what-formula">50 \u00f7 200 \u00d7 100 = 25%</div>' +
    '  </div>' +
    '  <div id="pc-change" class="pc-calc" style="display:none;">' +
    '    <div class="pc-fields">' +
    '      <label>From <input type="number" id="pc-change-from" value="100" class="pc-input"></label>' +
    '      <label>To <input type="number" id="pc-change-to" value="150" class="pc-input"></label>' +
    '    </div>' +
    '    <div class="pc-result"><span id="pc-change-result">50%</span> <span class="pc-change-dir" id="pc-change-dir" style="color:#22c55e;">Increase</span></div>' +
    '    <div class="pc-formula" id="pc-change-formula">(150 - 100) \u00f7 100 \u00d7 100 = 50%</div>' +
    '  </div>' +
    '  <button onclick="pcCopyResult()" class="btn-secondary">Copy Result</button>' +
    '</div>';

  var CSS =
    '.pc-widget{display:flex;flex-direction:column;gap:20px}' +
    '.pc-mode-select{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:4px}' +
    '.pc-mode-btn{padding:10px 18px;background:var(--bg);color:var(--text);border:2px solid var(--border);border-radius:var(--radius-sm);font-weight:600;font-size:0.88rem;cursor:pointer;transition:var(--transition)}' +
    '.pc-mode-btn:hover{border-color:var(--primary-light)}' +
    '.pc-mode-btn.pc-active{background:var(--primary);color:#fff;border-color:var(--primary)}' +
    '.pc-calc{display:flex;flex-direction:column;gap:16px}' +
    '.pc-fields{display:flex;gap:16px;flex-wrap:wrap}' +
    '.pc-fields label{font-weight:600;font-size:0.9rem;color:var(--text);display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
    '.pc-input{width:120px;padding:10px 14px;border:2px solid var(--border);border-radius:var(--radius-sm);background:var(--bg);color:var(--text);font-size:1.05rem;font-weight:600;outline:none;transition:border-color var(--transition);font-family:inherit}' +
    '.pc-input:focus{border-color:var(--primary)}' +
    '.pc-result{font-size:2rem;font-weight:800;color:var(--primary);line-height:1.2;display:flex;align-items:center;gap:10px}' +
    '.pc-change-dir{font-size:0.85rem;font-weight:600;padding:2px 10px;border-radius:999px;background:rgba(34,197,94,0.1)}' +
    '.pc-formula{font-size:0.85rem;color:var(--text-secondary);font-family:\'SF Mono\',\'Fira Code\',\'Consolas\',monospace;padding:10px 14px;background:var(--bg-card);border-radius:var(--radius-sm);border:1px solid var(--border)}' +
    '@media(max-width:480px){.pc-fields{flex-direction:column;gap:10px}.pc-input{width:100%;box-sizing:border-box}}';

  function fmt(v) {
    if (!isFinite(v) || isNaN(v)) return 'N/A';
    var s = parseFloat(v.toFixed(4)).toString();
    return s;
  }

  function updateOf() {
    var x = parseFloat(document.getElementById('pc-of-x').value);
    var y = parseFloat(document.getElementById('pc-of-y').value);
    var resultEl = document.getElementById('pc-of-result');
    var formulaEl = document.getElementById('pc-of-formula');
    if (isNaN(x) || isNaN(y)) {
      resultEl.textContent = 'N/A';
      formulaEl.textContent = 'Enter valid numbers';
      return;
    }
    var r = (x / 100) * y;
    resultEl.textContent = fmt(r);
    formulaEl.textContent = fmt(x) + ' \u00f7 100 \u00d7 ' + fmt(y) + ' = ' + fmt(r);
  }

  function updateWhat() {
    var x = parseFloat(document.getElementById('pc-what-x').value);
    var y = parseFloat(document.getElementById('pc-what-y').value);
    var resultEl = document.getElementById('pc-what-result');
    var formulaEl = document.getElementById('pc-what-formula');
    if (isNaN(x) || isNaN(y)) {
      resultEl.textContent = 'N/A';
      formulaEl.textContent = 'Enter valid numbers';
      return;
    }
    if (y === 0) {
      resultEl.textContent = 'N/A';
      formulaEl.textContent = 'Cannot divide by zero';
      return;
    }
    var r = (x / y) * 100;
    resultEl.textContent = fmt(r) + '%';
    formulaEl.textContent = fmt(x) + ' \u00f7 ' + fmt(y) + ' \u00d7 100 = ' + fmt(r) + '%';
  }

  function updateChange() {
    var from = parseFloat(document.getElementById('pc-change-from').value);
    var to = parseFloat(document.getElementById('pc-change-to').value);
    var resultEl = document.getElementById('pc-change-result');
    var formulaEl = document.getElementById('pc-change-formula');
    var dirEl = document.getElementById('pc-change-dir');
    if (isNaN(from) || isNaN(to)) {
      resultEl.textContent = 'N/A';
      formulaEl.textContent = 'Enter valid numbers';
      dirEl.textContent = '';
      return;
    }
    if (from === 0) {
      resultEl.textContent = 'N/A';
      formulaEl.textContent = 'Cannot divide by zero';
      dirEl.textContent = '';
      return;
    }
    var r = ((to - from) / from) * 100;
    resultEl.textContent = fmt(r) + '%';
    formulaEl.textContent = '(' + fmt(to) + ' - ' + fmt(from) + ') \u00f7 ' + fmt(from) + ' \u00d7 100 = ' + fmt(r) + '%';
    if (r > 0) {
      dirEl.textContent = 'Increase';
      dirEl.style.color = '#22c55e';
    } else if (r < 0) {
      dirEl.textContent = 'Decrease';
      dirEl.style.color = '#ef4444';
    } else {
      dirEl.textContent = 'No change';
      dirEl.style.color = 'var(--text-secondary)';
    }
  }

  function pcSetMode(mode) {
    var btns = document.querySelectorAll('.pc-mode-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove('pc-active');
    }
    var activeBtn = document.querySelector('.pc-mode-btn[data-mode="' + mode + '"]');
    if (activeBtn) activeBtn.classList.add('pc-active');
    var calcIds = ['pc-of', 'pc-what', 'pc-change'];
    for (var i = 0; i < calcIds.length; i++) {
      document.getElementById(calcIds[i]).style.display = calcIds[i] === 'pc-' + mode ? 'flex' : 'none';
    }
  }

  function pcCopyResult() {
    var activeModeBtn = document.querySelector('.pc-mode-btn.pc-active');
    if (!activeModeBtn) return;
    var mode = activeModeBtn.getAttribute('data-mode');
    var resultId = 'pc-' + mode + '-result';
    var resultEl = document.getElementById(resultId);
    if (!resultEl) return;
    var text = resultEl.textContent.trim();
    if (!text || text === 'N/A') return;
    navigator.clipboard.writeText(text).then(function () {
      var btn = document.querySelector('.pc-widget .btn-secondary');
      if (!btn) return;
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = orig; }, 1500);
    });
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = WIDGET_HTML;

    document.getElementById('pc-of-x').addEventListener('input', updateOf);
    document.getElementById('pc-of-y').addEventListener('input', updateOf);
    document.getElementById('pc-what-x').addEventListener('input', updateWhat);
    document.getElementById('pc-what-y').addEventListener('input', updateWhat);
    document.getElementById('pc-change-from').addEventListener('input', updateChange);
    document.getElementById('pc-change-to').addEventListener('input', updateChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
