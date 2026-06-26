(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="bmp-widget">' +
    '<div class="bmp-form-grid">' +
    '<div class="bmp-field"><label>Weight (kg)</label><input type="number" id="bmp-weight" value="75" min="10" max="500" step="0.5"></div>' +
    '<div class="bmp-field"><label>Height (cm)</label><input type="number" id="bmp-height" value="175" min="50" max="300"></div>' +
    '<div class="bmp-field"><label>Gender</label><select id="bmp-gender"><option value="male">Male</option><option value="female">Female</option></select></div>' +
    '</div>' +
    '<div class="bmp-results-grid">' +
    '<div class="bmp-rc" style="background:var(--primary);color:#fff"><span class="bmp-rl" style="color:rgba(255,255,255,.7)">BMI</span><span class="bmp-rv" id="bmp-bmi" style="color:#fff">0</span></div>' +
    '<div class="bmp-rc"><span class="bmp-rl">BMI Prime</span><span class="bmp-rv" id="bmp-prime">0</span></div>' +
    '<div class="bmp-rc"><span class="bmp-rl">Category</span><span class="bmp-rv" id="bmp-category">—</span></div>' +
    '<div class="bmp-rc"><span class="bmp-rl">Healthy Weight Range</span><span class="bmp-rv" id="bmp-range" style="font-size:.9rem">—</span></div>' +
    '</div>' +
    '<div class="bmp-meter-wrapper">' +
    '<div class="bmp-meter-bar" id="bmp-meter-bar">' +
    '<div class="bmp-meter-fill" id="bmp-meter-fill" style="width:0%"></div>' +
    '</div>' +
    '<div class="bmp-meter-labels"><span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span></div>' +
    '</div>' +
    '<div class="bmp-detail" id="bmp-detail"></div>' +
    '<div class="bmp-note" id="bmp-note">BMI Prime is the ratio of your BMI to the upper limit of the normal range (25). A BMI Prime of 1.0 or less means you are in the normal range. BMI is a screening tool, not a diagnostic.</div></div>';

  var CSS =
    '.bmp-widget{display:flex;flex-direction:column;gap:16px}' +
    '.bmp-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.bmp-field{display:flex;flex-direction:column;gap:4px}' +
    '.bmp-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.bmp-field input,.bmp-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.bmp-field input:focus,.bmp-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.bmp-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.bmp-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.bmp-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.bmp-rv{font-size:1.15rem;font-weight:800;color:var(--primary);display:block}' +
    '.bmp-meter-wrapper{padding:16px 0}' +
    '.bmp-meter-bar{height:12px;background:#e5e7eb;border-radius:6px;position:relative;overflow:hidden}' +
    '.bmp-meter-fill{height:100%;border-radius:6px;transition:width .3s ease}' +
    '.bmp-meter-labels{display:flex;justify-content:space-between;font-size:.7rem;color:var(--text-tertiary);margin-top:4px}' +
    '.bmp-detail{padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;line-height:1.7}' +
    '.bmp-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:600px){.bmp-form-grid{grid-template-columns:1fr}.bmp-results-grid{grid-template-columns:1fr 1fr}}';

  function calc() {
    var weight = parseFloat(w('bmp-weight').value) || 0;
    var height = parseFloat(w('bmp-height').value) || 0;
    var gender = w('bmp-gender').value;

    var bmi = height > 0 ? weight / Math.pow(height / 100, 2) : 0;
    var prime = bmi / 25;

    var category = '';
    var color = '';
    if (bmi < 18.5) { category = 'Underweight'; color = '#eab308'; }
    else if (bmi < 25) { category = 'Normal'; color = '#22c55e'; }
    else if (bmi < 30) { category = 'Overweight'; color = '#eab308'; }
    else { category = 'Obese'; color = '#ef4444'; }

    var minHealthy = 18.5 * Math.pow(height / 100, 2);
    var maxHealthy = 24.9 * Math.pow(height / 100, 2);

    w('bmp-bmi').textContent = bmi.toFixed(1);
    w('bmp-prime').textContent = prime.toFixed(2);
    w('bmp-category').textContent = category;
    w('bmp-category').style.color = color;
    w('bmp-range').textContent = minHealthy.toFixed(1) + ' - ' + maxHealthy.toFixed(1) + ' kg';

    var meterFill = document.getElementById('bmp-meter-fill');
    var pct = Math.min(100, (bmi / 40) * 100);
    meterFill.style.width = pct + '%';
    meterFill.style.background = color;

    var detail = document.getElementById('bmp-detail');
    if (bmi > 0) {
      detail.innerHTML = '<strong>BMI: ' + bmi.toFixed(1) + '</strong> — ' + category + '. ' +
        'Your BMI is ' + (prime * 100).toFixed(0) + '% of the normal upper limit. ' +
        'Healthy weight range for your height: <strong>' + minHealthy.toFixed(1) + ' - ' + maxHealthy.toFixed(1) + ' kg</strong>.';
    } else {
      detail.innerHTML = 'Enter your weight and height to calculate BMI.';
    }

    var note = document.getElementById('bmp-note');
    if (bmi > 0) {
      note.innerHTML = 'BMI: <strong>' + bmi.toFixed(1) + '</strong> | BMI Prime: <strong>' + prime.toFixed(2) + '</strong> | Category: <strong>' + category + '</strong>. ' +
        'BMI Prime > 1.0 means you are above the normal range.';
      note.style.borderLeftColor = color;
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.bmp-field input, .bmp-field select').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
