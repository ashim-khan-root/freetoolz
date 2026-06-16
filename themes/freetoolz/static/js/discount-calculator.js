(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="disc-widget">' +
    '<div class="disc-tabs">' +
    '<button class="disc-tab active" data-mode="calc">Calculate Discount</button>' +
    '<button class="disc-tab" data-mode="reverse">Find Discount %</button>' +
    '</div>' +
    '<div class="disc-body" id="disc-body">' +
    '<div class="disc-inputs">' +
    '<div class="disc-field"><label id="disc-l1">Original Price (&#8377;)</label><input type="number" id="disc-a" value="2000" step="any" min="0"></div>' +
    '<div class="disc-field"><label id="disc-l2">Discount (%)</label><input type="number" id="disc-b" value="25" step="any" min="0"></div>' +
    '</div>' +
    '<div class="disc-results">' +
    '<div class="disc-rc"><div class="disc-rl">Sale Price</div><div class="disc-rv disc-sale" id="disc-sale">&#8377; 1,500</div></div>' +
    '<div class="disc-rc"><div class="disc-rl">You Save</div><div class="disc-rv disc-save" id="disc-save">&#8377; 500</div></div>' +
    '<div class="disc-rc"><div class="disc-rl">Discount %</div><div class="disc-rv" id="disc-pct">25%</div></div>' +
    '</div>' +
    '</div></div>';

  var CSS =
    '.disc-widget{display:flex;flex-direction:column;gap:16px}' +
    '.disc-tabs{display:flex;gap:6px}' +
    '.disc-tab{padding:10px 20px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;font-weight:500;cursor:pointer;background:var(--bg);color:var(--text-secondary);transition:var(--transition)}' +
    '.disc-tab.active{background:var(--primary);color:#fff;border-color:var(--primary)}' +
    '.disc-tab:hover:not(.active){border-color:var(--primary-light)}' +
    '.disc-inputs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}' +
    '.disc-field{display:flex;flex-direction:column;gap:4px}' +
    '.disc-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.disc-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1.1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.disc-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.disc-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.disc-rc{text-align:center;padding:22px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.disc-rl{font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.disc-rv{font-size:1.3rem;font-weight:800;color:var(--primary)}' +
    '.disc-sale{color:#22c55e}' +
    '.disc-save{color:#ef4444}' +
    '@media(max-width:480px){.disc-tabs{flex-direction:column}.disc-inputs{grid-template-columns:1fr}.disc-results{grid-template-columns:1fr}}';

  function fmt(n) { return '&#8377; ' + Math.round(n).toLocaleString('en-IN'); }

  function calc() {
    var active = document.querySelector('.disc-tab.active');
    var mode = active ? active.getAttribute('data-mode') : 'calc';
    var a = parseFloat(w('disc-a').value) || 0;
    var b = parseFloat(w('disc-b').value) || 0;

    var l1 = document.getElementById('disc-l1');
    var l2 = document.getElementById('disc-l2');

    if (mode === 'calc') {
      l1.textContent = 'Original Price (&#8377;)';
      l2.textContent = 'Discount (%)';
      var save = a * (b / 100);
      var sale = a - save;
      w('disc-sale').innerHTML = fmt(sale);
      w('disc-save').innerHTML = fmt(save);
      w('disc-pct').textContent = b + '%';
    } else {
      l1.innerHTML = 'Original Price (&#8377;)';
      l2.innerHTML = 'Sale Price (&#8377;)';
      var discountPct = a > 0 ? ((a - b) / a) * 100 : 0;
      var saveAmt = a - b;
      w('disc-sale').innerHTML = fmt(b);
      w('disc-save').innerHTML = fmt(Math.max(0, saveAmt));
      w('disc-pct').textContent = Math.max(0, discountPct).toFixed(2) + '%';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    document.querySelectorAll('.disc-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.disc-tab').forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        calc();
      });
    });

    w('disc-a').addEventListener('input', calc);
    w('disc-b').addEventListener('input', calc);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
