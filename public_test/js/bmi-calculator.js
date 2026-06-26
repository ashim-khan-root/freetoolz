(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="bmi-widget">' +
    '<div class="bmi-form">' +
    '<div class="bmi-field">' +
    '<label>Units</label>' +
    '<select id="bmi-units">' +
    '<option value="imperial">Pounds & Feet/Inches</option>' +
    '<option value="metric">Kilograms & Centimeters</option>' +
    '</select></div>' +
    '<div class="bmi-field">' +
    '<label>Weight</label>' +
    '<input type="number" id="bmi-weight" value="170" min="0" step="any">' +
    '<span class="bmi-unit-label" id="bmi-wt-unit">lbs</span></div>' +
    '<div class="bmi-field">' +
    '<label>Height</label>' +
    '<div class="bmi-height-row">' +
    '<input type="number" id="bmi-ft" value="5" min="0" step="any" placeholder="ft">' +
    '<span class="bmi-unit-label">ft</span>' +
    '<input type="number" id="bmi-in" value="10" min="0" step="any" placeholder="in">' +
    '<span class="bmi-unit-label">in</span></div></div>' +
    '<div class="bmi-field" id="bmi-cm-field" style="display:none">' +
    '<label>Height</label>' +
    '<input type="number" id="bmi-cm" value="178" min="0" step="any">' +
    '<span class="bmi-unit-label">cm</span></div>' +
    '</div>' +
    '<div class="bmi-result-box">' +
    '<div class="bmi-score-wrap"><span class="bmi-score-label">Your BMI</span><span class="bmi-score" id="bmi-score">0.0</span></div>' +
    '<div class="bmi-gauge"><div class="bmi-gauge-fill" id="bmi-gauge" style="width:0%"></div></div>' +
    '<div class="bmi-category" id="bmi-category">Enter your details</div>' +
    '<div class="bmi-range" id="bmi-range">Healthy weight range: —</div></div>' +
    '<div class="bmi-bands">' +
    '<div class="bmi-band" style="background:#3b82f6">< underweight<br><strong>&lt;18.5</strong></div>' +
    '<div class="bmi-band" style="background:#22c55e">normal<br><strong>18.5–24.9</strong></div>' +
    '<div class="bmi-band" style="background:#eab308">overweight<br><strong>25–29.9</strong></div>' +
    '<div class="bmi-band" style="background:#ef4444">obese<br><strong>30+</strong></div></div>' +
    '<p class="bmi-note">BMI is a screening measure, not a diagnostic tool. Consult a healthcare professional for medical advice.</p></div>';

  var CSS =
    '.bmi-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.bmi-form{display:flex;flex-direction:column;gap:14px}' +
    '.bmi-field{display:flex;flex-direction:column;gap:4px}' +
    '.bmi-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.bmi-field input,.bmi-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.bmi-field input:focus,.bmi-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,.1)}' +
    '.bmi-unit-label{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.bmi-height-row{display:flex;gap:8px;align-items:center}' +
    '.bmi-height-row input{width:100px}' +
    '.bmi-height-row .bmi-unit-label{margin-top:0}' +
    '.bmi-result-box{background:var(--bg);border:2px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center}' +
    '.bmi-score-wrap{display:flex;align-items:baseline;justify-content:center;gap:12px}' +
    '.bmi-score-label{font-size:1rem;color:var(--text-secondary)}' +
    '.bmi-score{font-size:3rem;font-weight:800;color:var(--primary)}' +
    '.bmi-gauge{height:12px;background:var(--border);border-radius:6px;margin:12px 0;overflow:hidden}' +
    '.bmi-gauge-fill{height:100%;border-radius:6px;background:var(--primary);transition:width .4s ease,background .4s ease}' +
    '.bmi-category{font-size:1.1rem;font-weight:700;margin-bottom:4px}' +
    '.bmi-range{font-size:.85rem;color:var(--text-secondary)}' +
    '.bmi-bands{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px}' +
    '.bmi-band{padding:10px 6px;border-radius:var(--radius-sm);color:#fff;text-align:center;font-size:.75rem;line-height:1.3}' +
    '.bmi-band strong{display:block;font-size:.9rem;margin-top:2px}' +
    '.bmi-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0;text-align:center}' +
    '@media(max-width:480px){.bmi-bands{grid-template-columns:1fr 1fr}.bmi-score{font-size:2.2rem}}';

  function calc() {
    var metric = w('bmi-units').value === 'metric';
    var weight = parseFloat(w('bmi-weight').value) || 0;
    var heightIn = 0;
    if (metric) { heightIn = (parseFloat(w('bmi-cm').value) || 0) / 2.54; }
    else { var ft = parseFloat(w('bmi-ft').value) || 0; var inc = parseFloat(w('bmi-in').value) || 0; heightIn = ft * 12 + inc; }
    if (metric) weight = weight * 2.20462;
    var bmi = weight / (heightIn * heightIn) * 703;
    var pct = Math.min(100, Math.max(0, bmi / 40 * 100));
    var cat, col;
    if (bmi < 18.5) { cat = 'Underweight'; col = '#3b82f6'; }
    else if (bmi < 25) { cat = 'Normal'; col = '#22c55e'; }
    else if (bmi < 30) { cat = 'Overweight'; col = '#eab308'; }
    else { cat = 'Obese'; col = '#ef4444'; }
    w('bmi-score').textContent = bmi > 0 ? bmi.toFixed(1) : '0.0';
    w('bmi-score').style.color = bmi > 0 ? col : 'var(--primary)';
    w('bmi-gauge').style.width = pct + '%';
    w('bmi-gauge').style.background = bmi > 0 ? col : 'var(--primary)';
    w('bmi-category').textContent = bmi > 0 ? cat : 'Enter your details';
    w('bmi-category').style.color = col;
    var hMin = heightIn * 18.5 / 703 * heightIn; var hMax = heightIn * 24.9 / 703 * heightIn;
    var u = metric ? ' kg' : ' lbs';
    if (!metric) w('bmi-range').textContent = 'Healthy weight range: ' + hMin.toFixed(1) + u + ' – ' + hMax.toFixed(1) + u;
    else w('bmi-range').textContent = 'Healthy weight range: ' + (hMin / 2.20462).toFixed(1) + u + ' – ' + (hMax / 2.20462).toFixed(1) + u;
  }

  function toggleUnits() {
    var m = w('bmi-units').value === 'metric';
    w('bmi-ft').parentElement.style.display = m ? 'none' : '';
    w('bmi-cm-field').style.display = m ? '' : 'none';
    w('bmi-wt-unit').textContent = m ? 'kg' : 'lbs';
    calc();
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('bmi-units').addEventListener('change', toggleUnits);
    document.querySelectorAll('.bmi-field input, .bmi-field select').forEach(function (e) { e.addEventListener('input', calc); e.addEventListener('change', calc); });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
