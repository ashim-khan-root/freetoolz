(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="ci-widget">' +
    '<div class="ci-type"><label><input type="radio" name="ci-type" value="compound" checked> Compound</label><label><input type="radio" name="ci-type" value="simple"> Simple</label></div>' +
    '<div class="ci-inputs">' +
    '<div class="ci-field"><label>Principal (&#8377;)</label><input type="number" id="ci-principal" value="100000" step="any" min="0"></div>' +
    '<div class="ci-field"><label>Annual Rate (%)</label><input type="number" id="ci-rate" value="10" step="any" min="0"></div>' +
    '<div class="ci-field"><label>Time (years)</label><input type="number" id="ci-years" value="5" step="any" min="1"></div>' +
    '<div class="ci-field"><label>Monthly Addition</label><input type="number" id="ci-monthly" value="0" step="any" min="0"></div>' +
    '</div>' +
    '<div class="ci-results">' +
    '<div class="ci-rc"><div class="ci-rl">Final Balance</div><div class="ci-rv ci-balance" id="ci-balance">&#8377; 1,64,531</div></div>' +
    '<div class="ci-rc"><div class="ci-rl">Total Interest</div><div class="ci-rv" id="ci-interest">&#8377; 64,531</div></div>' +
    '<div class="ci-rc"><div class="ci-rl">Total Contributions</div><div class="ci-rv" id="ci-contrib">&#8377; 1,00,000</div></div>' +
    '</div>' +
    '<div class="ci-breakdown"><h4>Yearly Breakdown</h4><div class="ci-table-wrap"><table><thead><tr><th>Year</th><th>Balance</th><th>Interest Gained</th><th>Total Interest</th></tr></thead><tbody id="ci-tbody"></tbody></table></div></div></div>';

  var CSS =
    '.ci-widget{display:flex;flex-direction:column;gap:16px}' +
    '.ci-type{display:flex;gap:20px;padding:12px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.ci-type label{display:flex;align-items:center;gap:6px;font-size:.9rem;font-weight:600;cursor:pointer}' +
    '.ci-inputs{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.ci-field{display:flex;flex-direction:column;gap:4px}' +
    '.ci-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.ci-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.ci-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.ci-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.ci-rc{text-align:center;padding:20px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.ci-rl{font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.ci-rv{font-size:1.3rem;font-weight:800;color:var(--primary)}' +
    '.ci-balance{font-size:1.6rem}' +
    '.ci-breakdown h4{font-size:.95rem;margin-bottom:10px}' +
    '.ci-table-wrap{overflow-x:auto}' +
    '.ci-table-wrap table{width:100%;border-collapse:collapse;font-size:.82rem}' +
    '.ci-table-wrap th{padding:10px 12px;text-align:right;background:var(--bg);border-bottom:2px solid var(--border);color:var(--text-secondary)}' +
    '.ci-table-wrap th:first-child{text-align:left}' +
    '.ci-table-wrap td{padding:8px 12px;text-align:right;border-bottom:1px solid var(--border)}' +
    '.ci-table-wrap td:first-child{text-align:left}' +
    '.ci-table-wrap tr:hover td{background:var(--bg)}' +
    '@media(max-width:600px){.ci-inputs{grid-template-columns:1fr 1fr}.ci-results{grid-template-columns:1fr}}';

  function fmt(n) { return '&#8377; ' + Math.round(n).toLocaleString('en-IN'); }

  function calc() {
    var p = parseFloat(w('ci-principal').value) || 0;
    var annualRate = (parseFloat(w('ci-rate').value) || 0) / 100;
    var monthlyRate = annualRate / 12;
    var t = parseFloat(w('ci-years').value) || 1;
    var m = parseFloat(w('ci-monthly').value) || 0;
    var isCompound = document.querySelector('input[name="ci-type"]:checked').value === 'compound';

    var totalMonths = Math.round(t * 12);
    var totalContrib = p + m * totalMonths;

    // Calculate final balance using monthly compounding
    var balance = p;
    if (isCompound) {
      if (annualRate === 0) {
        balance = p + m * totalMonths;
      } else {
        balance = p * Math.pow(1 + monthlyRate, totalMonths);
        if (m > 0) {
          balance += m * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
        }
      }
    } else {
      balance = p + p * annualRate * t;
      if (m > 0) balance += m * totalMonths;
    }

    var totalInterest = balance - p - m * totalMonths;
    if (totalInterest < 0) totalInterest = 0;

    w('ci-balance').innerHTML = fmt(balance);
    w('ci-interest').innerHTML = fmt(totalInterest);
    w('ci-contrib').innerHTML = fmt(totalContrib);

    // Yearly breakdown — track balance incrementally
    var tbody = document.getElementById('ci-tbody');
    tbody.innerHTML = '';
    var curBalance = p;
    var cumInterest = 0;

    for (var y = 1; y <= Math.ceil(t); y++) {
      var monthsInYear = Math.min(12, totalMonths - (y - 1) * 12);
      var startBalance = curBalance;
      var yearInterest = 0;

      for (var mo = 0; mo < monthsInYear; mo++) {
        if (isCompound) {
          var intEarned = curBalance * monthlyRate;
          yearInterest += intEarned;
          curBalance = curBalance + intEarned + m;
        } else {
          var simpleInt = p * annualRate / 12;
          yearInterest += simpleInt;
          curBalance = curBalance + simpleInt + m;
        }
      }

      cumInterest += yearInterest;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + y + '</td><td>' + fmt(curBalance) + '</td><td>' + fmt(yearInterest) + '</td><td>' + fmt(cumInterest) + '</td>';
      tbody.appendChild(tr);
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.ci-field input, input[name="ci-type"]').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
