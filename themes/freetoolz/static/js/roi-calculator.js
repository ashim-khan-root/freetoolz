(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="roi-widget">' +
    '<div class="roi-inputs">' +
    '<div class="roi-field"><label>Initial Investment (&#8377;)</label><input type="number" id="roi-invested" value="100000" step="any" min="1"></div>' +
    '<div class="roi-field"><label>Final Value (&#8377;)</label><input type="number" id="roi-final" value="150000" step="any" min="1"></div>' +
    '<div class="roi-field"><label>Time Period (years)</label><input type="number" id="roi-years" value="3" step="any" min="0.1"></div>' +
    '</div>' +
    '<div class="roi-results">' +
    '<div class="roi-rc"><div class="roi-rl">Total Profit</div><div class="roi-rv" id="roi-profit">&#8377; 50,000</div></div>' +
    '<div class="roi-rc"><div class="roi-rl">ROI</div><div class="roi-rv roi-percent" id="roi-percent">50%</div></div>' +
    '<div class="roi-rc"><div class="roi-rl">Annualized ROI</div><div class="roi-rv" id="roi-annual">14.47%</div></div>' +
    '</div>' +
    '<div class="roi-note">ROI measures the gain or loss generated relative to the amount invested. Annualized ROI accounts for the investment period, making it comparable across different timeframes.</div></div>';

  var CSS =
    '.roi-widget{display:flex;flex-direction:column;gap:16px}' +
    '.roi-inputs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.roi-field{display:flex;flex-direction:column;gap:4px}' +
    '.roi-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.roi-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.roi-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.roi-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.roi-rc{text-align:center;padding:22px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.roi-rl{font-size:.75rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.roi-rv{font-size:1.3rem;font-weight:800;color:var(--primary)}' +
    '.roi-percent{font-size:1.8rem}' +
    '.roi-note{padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;color:var(--text-secondary);line-height:1.6}' +
    '@media(max-width:500px){.roi-inputs{grid-template-columns:1fr}.roi-results{grid-template-columns:1fr}}';

  function fmt(n) { return '&#8377; ' + Math.round(n).toLocaleString('en-IN'); }

  function calc() {
    var invested = parseFloat(w('roi-invested').value) || 0;
    var finalVal = parseFloat(w('roi-final').value) || 0;
    var years = parseFloat(w('roi-years').value) || 1;

    var profit = finalVal - invested;
    var roi = invested > 0 ? (profit / invested) * 100 : 0;
    var annualRoi = (Math.pow(finalVal / invested, 1 / years) - 1) * 100;

    w('roi-profit').innerHTML = fmt(profit);
    w('roi-percent').textContent = roi.toFixed(2) + '%';
    w('roi-annual').textContent = annualRoi.toFixed(2) + '%';
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.roi-field input').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
