(function () {
  var w = document.getElementById.bind(document);
  var HTML =
    '<div class="cc-widget"><div class="cc-form">' +
    '<div class="cc-row-2"><div class="cc-field"><label>Units</label><select id="cc-units"><option value="imperial">Pounds & Inches</option><option value="metric">Kilograms & CM</option></select></div>' +
    '<div class="cc-field"><label>Gender</label><select id="cc-gender"><option value="male">Male</option><option value="female">Female</option></select></div></div>' +
    '<div class="cc-row-3"><div class="cc-field"><label>Age</label><input type="number" id="cc-age" value="30" min="10" max="120" step="1"></div>' +
    '<div class="cc-field"><label>Weight</label><input type="number" id="cc-weight" value="170" min="0" step="any"><span class="cc-unit" id="cc-wt-unit">lbs</span></div>' +
    '<div class="cc-field"><label>Height</label><input type="number" id="cc-height" value="70" min="0" step="any"><span class="cc-unit" id="cc-ht-unit">in</span></div></div>' +
    '<div class="cc-field"><label>Activity Level</label><select id="cc-activity">' +
    '<option value="1.2">Sedentary</option><option value="1.375">Lightly active</option><option value="1.55" selected>Moderately active</option>' +
    '<option value="1.725">Very active</option><option value="1.9">Extremely active</option></select></div>' +
    '<div class="cc-field"><label>Goal</label><select id="cc-goal">' +
    '<option value="-1000">Lose 2 lb/week (aggressive)</option><option value="-500" selected>Lose 1 lb/week (moderate)</option>' +
    '<option value="-250">Lose 0.5 lb/week (light)</option><option value="0">Maintain weight</option>' +
    '<option value="250">Gain 0.5 lb/week (light)</option><option value="500">Gain 1 lb/week (moderate)</option></select></div>' +
    '</div>' +
    '<div class="cc-results"><div class="cc-stat cc-primary"><span class="cc-stat-label">Daily Calories</span><span class="cc-stat-val" id="cc-cals">0</span></div>' +
    '<div class="cc-stat"><span class="cc-stat-label">Protein</span><span class="cc-stat-val" id="cc-protein">0g</span><span class="cc-stat-sub" id="cc-protein-pct">0%</span></div>' +
    '<div class="cc-stat"><span class="cc-stat-label">Carbs</span><span class="cc-stat-val" id="cc-carbs">0g</span><span class="cc-stat-sub" id="cc-carbs-pct">0%</span></div>' +
    '<div class="cc-stat"><span class="cc-stat-label">Fat</span><span class="cc-stat-val" id="cc-fat">0g</span><span class="cc-stat-sub" id="cc-fat-pct">0%</span></div></div>' +
    '<p class="cc-note">* Macros based on: protein 30%, carbs 40%, fat 30% of calories. Protein 1g per lb of bodyweight. Adjust based on individual needs.</p></div>';
  var CSS =
    '.cc-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.cc-form{display:flex;flex-direction:column;gap:14px}' +
    '.cc-field{display:flex;flex-direction:column;gap:4px}' +
    '.cc-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.cc-field input,.cc-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.cc-field select{cursor:pointer}.cc-field input:focus,.cc-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,.1)}' +
    '.cc-unit{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.cc-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.cc-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.cc-results{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.cc-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center}' +
    '.cc-primary{background:var(--primary);border-color:var(--primary)}' +
    '.cc-primary .cc-stat-label,.cc-primary .cc-stat-sub{color:#fff;opacity:.85}' +
    '.cc-primary .cc-stat-val{color:#fff}' +
    '.cc-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:2px}' +
    '.cc-stat-val{display:block;font-size:1.4rem;font-weight:800;color:var(--primary)}' +
    '.cc-stat-sub{display:block;font-size:.7rem;color:var(--text-secondary)}' +
    '.cc-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.cc-row-3{grid-template-columns:1fr}.cc-results{grid-template-columns:1fr 1fr}}';
  function calc() {
    var met = w('cc-units').value === 'metric';
    var wt = parseFloat(w('cc-weight').value) || 0; var ht = parseFloat(w('cc-height').value) || 0;
    var age = parseFloat(w('cc-age').value) || 30; var gender = w('cc-gender').value;
    var act = parseFloat(w('cc-activity').value) || 1.55; var goal = parseFloat(w('cc-goal').value) || 0;
    if (met) { wt = wt * 2.20462; ht = ht / 2.54; }
    var bmr = gender === 'male' ? (10*wt/2.20462 + 6.25*ht*2.54 - 5*age + 5) : (10*wt/2.20462 + 6.25*ht*2.54 - 5*age - 161);
    var cals = Math.round(bmr * act + goal);
    var protein = Math.round(wt * 1);
    var fat = Math.round(cals * 0.3 / 9);
    var carbs = Math.round((cals - protein * 4 - fat * 9) / 4);
    if (carbs < 0) carbs = 0;
    w('cc-cals').textContent = cals;
    w('cc-protein').textContent = protein + 'g'; w('cc-protein-pct').textContent = Math.round(protein*4/cals*100) + '%';
    w('cc-carbs').textContent = carbs + 'g'; w('cc-carbs-pct').textContent = Math.round(carbs*4/cals*100) + '%';
    w('cc-fat').textContent = fat + 'g'; w('cc-fat-pct').textContent = Math.round(fat*9/cals*100) + '%';
  }
  function toggleUnits() { var m = w('cc-units').value === 'metric'; w('cc-wt-unit').textContent = m ? 'kg' : 'lbs'; w('cc-ht-unit').textContent = m ? 'cm' : 'in'; calc(); }
  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('cc-units').addEventListener('change', toggleUnits);
    document.querySelectorAll('.cc-field input, .cc-field select').forEach(function (e) { e.addEventListener('input', calc); e.addEventListener('change', calc); });
    calc();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
