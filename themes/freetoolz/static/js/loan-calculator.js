(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="loan-widget">' +
    '<div class="loan-form-grid">' +
    '<div class="loan-field"><label>Loan Amount (&#8377;)</label><input type="number" id="loan-amount" value="5000000" min="1" max="100000000" step="100000"></div>' +
    '<div class="loan-field"><label>Annual Interest Rate (%)</label><input type="number" id="loan-rate" value="8.5" min="0.1" max="36" step="0.1"></div>' +
    '<div class="loan-field"><label>Loan Term (Years)</label><input type="number" id="loan-years" value="20" min="1" max="40"></div>' +
    '<div class="loan-field"><label>Loan Type</label><select id="loan-type"><option value="standard">Standard</option><option value="interest-only">Interest Only</option></select></div>' +
    '</div>' +
    '<div class="loan-results-grid">' +
    '<div class="loan-rc" style="background:var(--primary);color:#fff"><span class="loan-rl" style="color:rgba(255,255,255,.7)">Monthly EMI</span><span class="loan-rv" id="loan-emi" style="color:#fff">&#8377; 0</span></div>' +
    '<div class="loan-rc"><span class="loan-rl">Total Interest</span><span class="loan-rv" id="loan-interest">&#8377; 0</span></div>' +
    '<div class="loan-rc"><span class="loan-rl">Total Payment</span><span class="loan-rv" id="loan-total">&#8377; 0</span></div>' +
    '<div class="loan-rc"><span class="loan-rl">Interest % of Total</span><span class="loan-rv" id="loan-interest-pct">0%</span></div>' +
    '</div>' +
    '<div class="loan-amort-wrapper"><div class="loan-amort-title">Amortization Schedule (First 12 Months)</div><div class="loan-table-wrap"><table class="loan-table"><thead><tr><th>#</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody id="loan-amort"></tbody></table></div></div>' +
    '<div class="loan-note" id="loan-note">EMI is calculated using the standard reducing-balance formula. Actual amounts may vary slightly based on lender policies and fees.</div></div>';

  var CSS =
    '.loan-widget{display:flex;flex-direction:column;gap:16px}' +
    '.loan-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.loan-field{display:flex;flex-direction:column;gap:4px}' +
    '.loan-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.loan-field input,.loan-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.loan-field input:focus,.loan-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.loan-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.loan-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.loan-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.loan-rv{font-size:1.15rem;font-weight:800;color:var(--primary);display:block}' +
    '.loan-amort-wrapper{padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.loan-amort-title{font-size:.78rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.03em;margin-bottom:10px}' +
    '.loan-table-wrap{overflow-x:auto}' +
    '.loan-table{width:100%;border-collapse:collapse;font-size:.82rem}' +
    '.loan-table th{background:var(--bg);color:var(--text-secondary);font-weight:600;padding:8px 12px;text-align:right;border-bottom:2px solid var(--border)}' +
    '.loan-table th:first-child{text-align:center}' +
    '.loan-table td{padding:8px 12px;text-align:right;border-bottom:1px solid var(--border);font-family:monospace}' +
    '.loan-table td:first-child{text-align:center}' +
    '.loan-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:768px){.loan-form-grid{grid-template-columns:1fr 1fr}.loan-results-grid{grid-template-columns:1fr 1fr}}';

  function fmtINR(n) {
    return '&#8377; ' + Math.round(n).toLocaleString('en-IN');
  }

  function calc() {
    var amount = parseFloat(w('loan-amount').value) || 0;
    var rate = parseFloat(w('loan-rate').value) || 0;
    var years = parseFloat(w('loan-years').value) || 1;
    var type = w('loan-type').value;

    var months = years * 12;
    var monthlyRate = rate / 100 / 12;

    var emi, totalPayment, totalInterest;

    if (type === 'interest-only') {
      emi = amount * monthlyRate;
      totalPayment = emi * months + amount;
      totalInterest = emi * months;
    } else {
      if (monthlyRate > 0) {
        var factor = Math.pow(1 + monthlyRate, months);
        emi = amount * monthlyRate * factor / (factor - 1);
      } else {
        emi = amount / months;
      }
      totalPayment = emi * months;
      totalInterest = totalPayment - amount;
    }

    w('loan-emi').innerHTML = fmtINR(emi);
    w('loan-interest').innerHTML = fmtINR(totalInterest);
    w('loan-total').innerHTML = fmtINR(totalPayment);
    w('loan-interest-pct').textContent = totalPayment > 0 ? (totalInterest / totalPayment * 100).toFixed(1) + '%' : '0%';

    var tbody = document.getElementById('loan-amort');
    var html = '';
    var balance = amount;
    var shown = Math.min(12, months);

    for (var i = 1; i <= shown; i++) {
      var interestPmt = balance * monthlyRate;
      var principalPmt = emi - interestPmt;
      balance -= principalPmt;
      html += '<tr>' +
        '<td>' + i + '</td>' +
        '<td>' + fmtINR(emi) + '</td>' +
        '<td>' + fmtINR(principalPmt) + '</td>' +
        '<td>' + fmtINR(interestPmt) + '</td>' +
        '<td>' + fmtINR(Math.max(0, balance)) + '</td>' +
        '</tr>';
    }
    tbody.innerHTML = html;

    var note = document.getElementById('loan-note');
    note.innerHTML = 'Monthly EMI: <strong>' + fmtINR(emi) + '</strong> for ' + years + ' year' + (years > 1 ? 's' : '') + ' at ' + rate + '% p.a. ' +
      (type === 'interest-only' ? 'Interest-only period — principal not reduced.' : 'Standard reducing balance amortization.');
    note.style.borderLeftColor = '#22c55e';
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.loan-field input, .loan-field select').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
