(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="pct-widget">' +
    '<div class="pct-tabs">' +
    '<button class="pct-tab active" data-mode="of">What is X% of Y?</button>' +
    '<button class="pct-tab" data-mode="percent">X is what % of Y?</button>' +
    '<button class="pct-tab" data-mode="change">% Change (increase/decrease)</button>' +
    '</div>' +
    '<div class="pct-body" id="pct-body">' +
    '<div class="pct-fields">' +
    '<div class="pct-field"><label id="pct-label1">X (%)</label><input type="number" id="pct-a" value="20" step="any"></div>' +
    '<div class="pct-field"><label id="pct-label2">Y</label><input type="number" id="pct-b" value="200" step="any"></div>' +
    '</div>' +
    '<div class="pct-result-box">' +
    '<div class="pct-result" id="pct-result">40</div>' +
    '<div class="pct-formula" id="pct-formula">20% of 200 = 40</div>' +
    '</div>' +
    '</div></div>';

  var CSS =
    '.pct-widget{display:flex;flex-direction:column;gap:16px}' +
    '.pct-tabs{display:flex;gap:6px;flex-wrap:wrap}' +
    '.pct-tab{padding:10px 18px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;font-weight:500;cursor:pointer;background:var(--bg);color:var(--text-secondary);transition:var(--transition)}' +
    '.pct-tab.active{background:var(--primary);color:#fff;border-color:var(--primary)}' +
    '.pct-tab:hover:not(.active){border-color:var(--primary-light)}' +
    '.pct-fields{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px}' +
    '.pct-field{display:flex;flex-direction:column;gap:4px}' +
    '.pct-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.pct-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1.1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.pct-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.pct-result-box{text-align:center;padding:24px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}' +
    '.pct-result{font-size:2.5rem;font-weight:800;color:var(--primary)}' +
    '.pct-formula{font-size:.9rem;color:var(--text-secondary);margin-top:6px}' +
    '@media(max-width:480px){.pct-tabs{flex-direction:column}.pct-tab{text-align:center}}';

  function calc() {
    var a = parseFloat(w('pct-a').value) || 0;
    var b = parseFloat(w('pct-b').value) || 0;
    var active = document.querySelector('.pct-tab.active');
    var mode = active ? active.getAttribute('data-mode') : 'of';
    var result = 0, formula = '';

    switch (mode) {
      case 'of':
        result = (a / 100) * b;
        formula = a + '% of ' + b + ' = ' + result.toFixed(2);
        break;
      case 'percent':
        result = b !== 0 ? (a / b) * 100 : 0;
        formula = a + ' is ' + result.toFixed(2) + '% of ' + b;
        break;
      case 'change':
        if (b !== 0) {
          result = ((a - b) / b) * 100;
          var dir = result >= 0 ? 'increase' : 'decrease';
          formula = 'From ' + b + ' to ' + a + ' = ' + Math.abs(result).toFixed(2) + '% ' + dir;
        } else {
          formula = 'Original value (Y) cannot be 0';
        }
        break;
    }

    w('pct-result').textContent = mode === 'of' ? result.toFixed(2) : result.toFixed(2) + '%';
    w('pct-formula').textContent = formula;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    document.querySelectorAll('.pct-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.pct-tab').forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        var mode = this.getAttribute('data-mode');
        var l1 = document.getElementById('pct-label1');
        var l2 = document.getElementById('pct-label2');
        if (mode === 'of') { l1.textContent = 'X (%)'; l2.textContent = 'Y'; }
        else if (mode === 'percent') { l1.textContent = 'X'; l2.textContent = 'Y'; }
        else { l1.textContent = 'New Value'; l2.textContent = 'Original Value'; }
        calc();
      });
    });

    w('pct-a').addEventListener('input', calc);
    w('pct-b').addEventListener('input', calc);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
