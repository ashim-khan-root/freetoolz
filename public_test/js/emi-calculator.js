(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="emi-widget">' +
    '<div class="emi-inputs">' +
    '<div class="emi-field"><label>Loan Amount (&#8377;)</label><input type="number" id="emi-principal" value="500000" step="any" min="1"></div>' +
    '<div class="emi-field"><label>Annual Interest Rate (%)</label><input type="number" id="emi-rate" value="8.5" step="any" min="0"></div>' +
    '<div class="emi-field"><label>Tenure (months)</label><input type="number" id="emi-tenure" value="60" step="1" min="1"></div>' +
    '</div>' +
    '<div class="emi-results">' +
    '<div class="emi-result-card"><div class="emi-rl">Monthly EMI</div><div class="emi-rv" id="emi-monthly">&#8377; 10,261</div></div>' +
    '<div class="emi-result-card"><div class="emi-rl">Total Interest</div><div class="emi-rv" id="emi-interest">&#8377; 1,15,648</div></div>' +
    '<div class="emi-result-card"><div class="emi-rl">Total Payment</div><div class="emi-rv" id="emi-total">&#8377; 6,15,648</div></div>' +
    '</div>' +
    '<div class="emi-amortization"><h4>Amortization Schedule</h4><div class="emi-table-wrap"><table id="emi-table"><thead><tr><th>Year</th><th>Principal Paid</th><th>Interest Paid</th><th>Balance</th></tr></thead><tbody id="emi-tbody"></tbody></table></div></div></div>';

  var CSS =
    '.emi-widget{display:flex;flex-direction:column;gap:16px}' +
    '.emi-inputs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.emi-field{display:flex;flex-direction:column;gap:4px}' +
    '.emi-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.emi-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.emi-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.emi-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.emi-result-card{text-align:center;padding:20px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.emi-rl{font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.emi-rv{font-size:1.4rem;font-weight:800;color:var(--primary)}' +
    '.emi-amortization h4{font-size:.95rem;margin-bottom:10px}' +
    '.emi-table-wrap{overflow-x:auto}' +
    '.emi-table-wrap table{width:100%;border-collapse:collapse;font-size:.82rem}' +
    '.emi-table-wrap th{padding:10px 12px;text-align:right;background:var(--bg);border-bottom:2px solid var(--border);color:var(--text-secondary);font-weight:600}' +
    '.emi-table-wrap th:first-child{text-align:left}' +
    '.emi-table-wrap td{padding:8px 12px;text-align:right;border-bottom:1px solid var(--border);color:var(--text)}' +
    '.emi-table-wrap td:first-child{text-align:left}' +
    '.emi-table-wrap tr:hover td{background:var(--bg)}' +
    '@media(max-width:600px){.emi-inputs{grid-template-columns:1fr}.emi-results{grid-template-columns:1fr}}';

  function fmt(n) { return '&#8377; ' + Math.round(n).toLocaleString('en-IN'); }

  function calc() {
    var p = parseFloat(w('emi-principal').value) || 0;
    var r = (parseFloat(w('emi-rate').value) || 0) / 12 / 100;
    var n = parseInt(w('emi-tenure').value) || 1;

    var emi = 0;
    if (r === 0) { emi = p / n; } else { emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1); }

    var total = emi * n;
    var interest = total - p;

    w('emi-monthly').innerHTML = fmt(emi);
    w('emi-interest').innerHTML = fmt(interest);
    w('emi-total').innerHTML = fmt(total);

    // Amortization table
    var tbody = document.getElementById('emi-tbody');
    tbody.innerHTML = '';
    var balance = p;
    var year = 1;
    var monthlyRate = r;

    while (balance > 0 && year <= Math.ceil(n / 12)) {
      var monthsInYear = Math.min(12, n - (year - 1) * 12);
      var yearPrincipal = 0, yearInterest = 0;
      for (var m = 0; m < monthsInYear; m++) {
        if (balance <= 0) break;
        var intPart = balance * monthlyRate;
        var prinPart = emi - intPart;
        if (prinPart > balance) prinPart = balance;
        yearInterest += intPart;
        yearPrincipal += prinPart;
        balance -= prinPart;
      }
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + year + '</td><td>' + fmt(yearPrincipal) + '</td><td>' + fmt(yearInterest) + '</td><td>' + fmt(Math.max(0, balance)) + '</td>';
      tbody.appendChild(tr);
      year++;
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.emi-field input').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
