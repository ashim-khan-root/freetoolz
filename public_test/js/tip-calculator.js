(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="tip-widget">' +
    '<div class="tip-inputs">' +
    '<div class="tip-field"><label>Bill Amount (&#8377;)</label><input type="number" id="tip-bill" value="2500" step="any" min="0"></div>' +
    '<div class="tip-field"><label>Tip (%)</label><div class="tip-presets" id="tip-presets"><button data-pct="10">10%</button><button data-pct="15">15%</button><button data-pct="18" class="active">18%</button><button data-pct="20">20%</button><button data-pct="25">25%</button></div><input type="number" id="tip-pct" value="18" step="any" min="0"></div>' +
    '<div class="tip-field"><label>Number of People</label><input type="number" id="tip-people" value="1" step="1" min="1"></div>' +
    '</div>' +
    '<div class="tip-results">' +
    '<div class="tip-rc"><div class="tip-rl">Tip Per Person</div><div class="tip-rv" id="tip-per-person">&#8377; 450</div></div>' +
    '<div class="tip-rc"><div class="tip-rl">Total Per Person</div><div class="tip-rv tip-total" id="tip-total">&#8377; 2,950</div></div>' +
    '<div class="tip-rc"><div class="tip-rl">Grand Total</div><div class="tip-rv" id="tip-grand">&#8377; 2,950</div></div>' +
    '</div>' +
    '<div class="tip-summary" id="tip-summary"></div></div>';

  var CSS =
    '.tip-widget{display:flex;flex-direction:column;gap:16px}' +
    '.tip-inputs{display:grid;grid-template-columns:1fr;gap:12px}' +
    '.tip-field{display:flex;flex-direction:column;gap:4px}' +
    '.tip-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.tip-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.tip-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.tip-presets{display:flex;gap:6px;margin-bottom:6px}' +
    '.tip-presets button{padding:8px 16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.82rem;font-weight:500;cursor:pointer;background:var(--bg);color:var(--text-secondary);transition:var(--transition)}' +
    '.tip-presets button.active{background:var(--primary);color:#fff;border-color:var(--primary)}' +
    '.tip-presets button:hover:not(.active){border-color:var(--primary-light)}' +
    '.tip-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.tip-rc{text-align:center;padding:20px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.tip-rl{font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.tip-rv{font-size:1.3rem;font-weight:800;color:var(--primary)}' +
    '.tip-total{color:#22c55e}' +
    '.tip-summary{padding:12px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;color:var(--text-secondary);text-align:center}' +
    '@media(max-width:480px){.tip-results{grid-template-columns:1fr}}';

  function fmt(n) { return '&#8377; ' + Math.round(n).toLocaleString('en-IN'); }

  function calc() {
    var bill = parseFloat(w('tip-bill').value) || 0;
    var pct = parseFloat(w('tip-pct').value) || 0;
    var people = parseInt(w('tip-people').value) || 1;

    var tipTotal = bill * (pct / 100);
    var grandTotal = bill + tipTotal;
    var tipPerPerson = tipTotal / people;
    var totalPerPerson = grandTotal / people;

    w('tip-per-person').innerHTML = fmt(tipPerPerson);
    w('tip-total').innerHTML = fmt(totalPerPerson);
    w('tip-grand').innerHTML = fmt(grandTotal);

    var note = 'A ' + pct + '% tip on &#8377;' + bill.toLocaleString('en-IN') + ' split between ' + people + ' ' + (people === 1 ? 'person' : 'people') + '.';
    document.getElementById('tip-summary').innerHTML = note;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    // Preset buttons
    document.querySelectorAll('.tip-presets button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.tip-presets button').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var pct = parseInt(this.getAttribute('data-pct'));
        w('tip-pct').value = pct;
        calc();
      });
    });

    w('tip-bill').addEventListener('input', calc);
    w('tip-pct').addEventListener('input', function () {
      document.querySelectorAll('.tip-presets button').forEach(function (b) { b.classList.remove('active'); });
      calc();
    });
    w('tip-people').addEventListener('input', calc);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
