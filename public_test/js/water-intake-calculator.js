(function () {
  var w = document.getElementById.bind(document);
  var HTML =
    '<div class="wi-widget"><div class="wi-form">' +
    '<div class="wi-field"><label>Units</label><select id="wi-units"><option value="imperial">Pounds (oz/cups)</option><option value="metric">Kilograms (liters)</option></select></div>' +
    '<div class="wi-field"><label>Your Weight</label><input type="number" id="wi-weight" value="170" min="0" step="any"><span class="wi-unit-label" id="wi-wt-unit">lbs</span></div>' +
    '<div class="wi-field"><label>Daily Exercise</label><select id="wi-exercise">' +
    '<option value="0">None / Sedentary</option><option value="12" selected>30-60 min</option><option value="24">60-90 min</option><option value="36">90+ min</option></select></div>' +
    '<div class="wi-field"><label>Climate</label><select id="wi-climate">' +
    '<option value="0" selected>Mild / Air conditioned</option><option value="16">Hot / Humid</option><option value="24">Very hot / Outdoor work</option></select></div></div>' +
    '<div class="wi-results">' +
    '<div class="wi-stat wi-primary"><span class="wi-stat-label">Daily Water Target</span><span class="wi-stat-val" id="wi-total">0</span></div>' +
    '<div class="wi-stat"><span class="wi-stat-label">Per Glass (8 oz)</span><span class="wi-stat-val" id="wi-glasses">0 glasses</span></div>' +
    '<div class="wi-stat"><span class="wi-stat-label">Per Hour (awake)</span><span class="wi-stat-val" id="wi-hourly">0 oz</span></div></div>' +
    '<p class="wi-note">* General guideline: half your body weight (lbs) in ounces, plus adjustments for activity and climate. Individual needs vary.</p></div>';
  var CSS =
    '.wi-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.wi-form{display:flex;flex-direction:column;gap:14px}' +
    '.wi-field{display:flex;flex-direction:column;gap:4px}' +
    '.wi-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.wi-field input,.wi-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.wi-field select{cursor:pointer}.wi-field input:focus,.wi-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,.1)}' +
    '.wi-unit-label{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.wi-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.wi-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center}' +
    '.wi-primary{background:var(--primary);border-color:var(--primary)}' +
    '.wi-primary .wi-stat-label{color:#fff;opacity:.85}.wi-primary .wi-stat-val{color:#fff}' +
    '.wi-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:4px}' +
    '.wi-stat-val{display:block;font-size:1.3rem;font-weight:700;color:var(--primary)}' +
    '.wi-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:480px){.wi-results{grid-template-columns:1fr}}';
  function calc() {
    var met = w('wi-units').value === 'metric';
    var wt = parseFloat(w('wi-weight').value) || 0;
    var ex = parseInt(w('wi-exercise').value) || 0;
    var cl = parseInt(w('wi-climate').value) || 0;
    if (met) wt = wt * 2.20462;
    var total = wt * 0.5 + ex + cl;
    var unit = met ? ' L' : ' oz';
    if (met) total = total * 0.0296;
    w('wi-total').textContent = total.toFixed(1) + unit;
    if (met) w('wi-glasses').textContent = Math.round(total / 0.236) + ' glasses';
    else w('wi-glasses').textContent = Math.round(total / 8) + ' glasses';
    var perHr = met ? total / 16 : total / 16;
    w('wi-hourly').textContent = perHr.toFixed(1) + (met ? ' L' : ' oz');
  }
  function toggleUnits() {
    var m = w('wi-units').value === 'metric';
    w('wi-wt-unit').textContent = m ? 'kg' : 'lbs';
    calc();
  }
  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('wi-units').addEventListener('change', toggleUnits);
    document.querySelectorAll('.wi-field input, .wi-field select').forEach(function (e) { e.addEventListener('input', calc); e.addEventListener('change', calc); });
    calc();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
