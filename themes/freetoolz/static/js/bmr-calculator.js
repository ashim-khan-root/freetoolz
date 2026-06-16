(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="br-widget">' +
    '<div class="br-form">' +
    '<div class="br-field"><label>Units</label><select id="br-units"><option value="imperial">Pounds & Inches</option><option value="metric">Kilograms & Centimeters</option></select></div>' +
    '<div class="br-row-2"><div class="br-field"><label>Weight</label><input type="number" id="br-weight" value="170" min="0" step="any"><span class="br-unit" id="br-wt-unit">lbs</span></div>' +
    '<div class="br-field"><label>Height</label><input type="number" id="br-height" value="70" min="0" step="any"><span class="br-unit" id="br-ht-unit">in</span></div></div>' +
    '<div class="br-row-2"><div class="br-field"><label>Age</label><input type="number" id="br-age" value="30" min="10" max="120" step="1"></div>' +
    '<div class="br-field"><label>Gender</label><select id="br-gender"><option value="male">Male</option><option value="female">Female</option></select></div></div>' +
    '<div class="br-field"><label>Activity Level</label><select id="br-activity">' +
    '<option value="1.2">Sedentary (little or no exercise)</option>' +
    '<option value="1.375">Lightly active (1-3 days/week)</option>' +
    '<option value="1.55" selected>Moderately active (3-5 days/week)</option>' +
    '<option value="1.725">Very active (6-7 days/week)</option>' +
    '<option value="1.9">Extremely active (twice/day)</option></select></div>' +
    '</div>' +
    '<div class="br-results">' +
    '<div class="br-stat br-stat-primary"><span class="br-stat-label">BMR</span><span class="br-stat-val" id="br-bmr">0</span><span class="br-stat-sub">calories/day</span></div>' +
    '<div class="br-stat"><span class="br-stat-label">Maintenance</span><span class="br-stat-val" id="br-maintain">0</span><span class="br-stat-sub">calories/day</span></div>' +
    '<div class="br-stat"><span class="br-stat-label">Mild Weight Loss</span><span class="br-stat-val" id="br-cut">0</span><span class="br-stat-sub">-500 cal/day</span></div>' +
    '<div class="br-stat"><span class="br-stat-label">Mild Weight Gain</span><span class="br-stat-val" id="br-bulk">0</span><span class="br-stat-sub">+300 cal/day</span></div>' +
    '</div>' +
    '<p class="br-note">* Based on Mifflin-St Jeor equation. Individual needs vary. Consult a professional for medical advice.</p></div>';

  var CSS =
    '.br-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.br-form{display:flex;flex-direction:column;gap:14px}' +
    '.br-field{display:flex;flex-direction:column;gap:4px}' +
    '.br-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.br-field input,.br-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.br-field select{cursor:pointer}.br-field input:focus,.br-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,.1)}' +
    '.br-unit{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.br-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.br-results{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.br-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center}' +
    '.br-stat-primary{background:var(--primary);border-color:var(--primary)}' +
    '.br-stat-primary .br-stat-label,.br-stat-primary .br-stat-sub{color:#fff;opacity:.85}' +
    '.br-stat-primary .br-stat-val{color:#fff}' +
    '.br-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:2px}' +
    '.br-stat-val{display:block;font-size:1.6rem;font-weight:800;color:var(--primary)}' +
    '.br-stat-sub{display:block;font-size:.75rem;color:var(--text-secondary);margin-top:2px}' +
    '.br-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:480px){.br-row-2{grid-template-columns:1fr}.br-results{grid-template-columns:1fr}}';

  function calc() {
    var met = w('br-units').value === 'metric';
    var wt = parseFloat(w('br-weight').value) || 0;
    var ht = parseFloat(w('br-height').value) || 0;
    var age = parseFloat(w('br-age').value) || 30;
    var gender = w('br-gender').value;
    var act = parseFloat(w('br-activity').value) || 1.55;
    if (met) { wt = wt * 2.20462; ht = ht / 2.54; }
    var bmr = gender === 'male' ? (10 * wt / 2.20462 + 6.25 * ht * 2.54 - 5 * age + 5) : (10 * wt / 2.20462 + 6.25 * ht * 2.54 - 5 * age - 161);
    bmr = Math.round(bmr);
    w('br-bmr').textContent = bmr;
    w('br-maintain').textContent = Math.round(bmr * act);
    w('br-cut').textContent = Math.round(bmr * act - 500);
    w('br-bulk').textContent = Math.round(bmr * act + 300);
  }

  function toggleUnits() {
    var m = w('br-units').value === 'metric';
    w('br-wt-unit').textContent = m ? 'kg' : 'lbs';
    w('br-ht-unit').textContent = m ? 'cm' : 'in';
    calc();
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('br-units').addEventListener('change', toggleUnits);
    document.querySelectorAll('.br-field input, .br-field select').forEach(function (e) { e.addEventListener('input', calc); e.addEventListener('change', calc); });
    calc();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
