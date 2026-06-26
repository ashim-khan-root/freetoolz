(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="macro-widget">' +
    '<div class="macro-form-grid">' +
    '<div class="macro-field"><label>Weight (kg)</label><input type="number" id="macro-weight" value="75" min="20" max="300" step="0.5"></div>' +
    '<div class="macro-field"><label>Height (cm)</label><input type="number" id="macro-height" value="175" min="100" max="250"></div>' +
    '<div class="macro-field"><label>Age</label><input type="number" id="macro-age" value="30" min="10" max="120"></div>' +
    '<div class="macro-field"><label>Gender</label><select id="macro-gender"><option value="male">Male</option><option value="female">Female</option></select></div>' +
    '<div class="macro-field"><label>Activity Level</label><select id="macro-activity"><option value="1.2">Sedentary (desk job)</option><option value="1.375" selected>Light (1-3 days/wk)</option><option value="1.55">Moderate (3-5 days/wk)</option><option value="1.725">Active (6-7 days/wk)</option><option value="1.9">Very Active (2x/day)</option></select></div>' +
    '<div class="macro-field"><label>Goal</label><select id="macro-goal"><option value="lose">Lose Weight</option><option value="maintain" selected>Maintain</option><option value="gain">Gain Weight</option></select></div>' +
    '</div>' +
    '<div class="macro-results-grid">' +
    '<div class="macro-rc" style="background:var(--primary);color:#fff"><span class="macro-rl" style="color:rgba(255,255,255,.7)">Daily Calories</span><span class="macro-rv" id="macro-calories" style="color:#fff">0 kcal</span></div>' +
    '<div class="macro-rc"><span class="macro-rl">Protein</span><span class="macro-rv" id="macro-protein">0 g</span></div>' +
    '<div class="macro-rc"><span class="macro-rl">Carbs</span><span class="macro-rv" id="macro-carbs">0 g</span></div>' +
    '<div class="macro-rc"><span class="macro-rl">Fat</span><span class="macro-rv" id="macro-fat">0 g</span></div>' +
    '</div>' +
    '<div class="macro-bmr-row"><span class="macro-bmr-label">BMR (Basal Metabolic Rate):</span><span class="macro-bmr-val" id="macro-bmr">0 kcal/day</span></div>' +
    '<div class="macro-note" id="macro-note">Macronutrient ratios: Protein 30%, Carbs 40%, Fat 30% of total calories. Adjust based on your specific dietary needs and preferences.</div></div>';

  var CSS =
    '.macro-widget{display:flex;flex-direction:column;gap:16px}' +
    '.macro-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.macro-field{display:flex;flex-direction:column;gap:4px}' +
    '.macro-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.macro-field input,.macro-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.macro-field input:focus,.macro-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.macro-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.macro-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.macro-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.macro-rv{font-size:1.15rem;font-weight:800;color:var(--primary);display:block}' +
    '.macro-bmr-row{text-align:center;padding:8px;font-size:.9rem;color:var(--text-secondary)}' +
    '.macro-bmr-label{font-weight:600}' +
    '.macro-bmr-val{font-weight:800;color:var(--primary);font-family:monospace}' +
    '.macro-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:600px){.macro-form-grid{grid-template-columns:1fr 1fr}.macro-results-grid{grid-template-columns:1fr 1fr}}';

  function calc() {
    var weight = parseFloat(w('macro-weight').value) || 0;
    var height = parseFloat(w('macro-height').value) || 0;
    var age = parseFloat(w('macro-age').value) || 0;
    var gender = w('macro-gender').value;
    var activity = parseFloat(w('macro-activity').value) || 1.2;
    var goal = w('macro-goal').value;

    var bmr = gender === 'male'
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

    var tdee = bmr * activity;

    var calGoal = tdee;
    if (goal === 'lose') calGoal = tdee - 500;
    else if (goal === 'gain') calGoal = tdee + 300;

    var proteinG = Math.round((calGoal * 0.30) / 4);
    var carbsG = Math.round((calGoal * 0.40) / 4);
    var fatG = Math.round((calGoal * 0.30) / 9);

    w('macro-bmr').textContent = Math.round(bmr) + ' kcal/day';
    w('macro-calories').textContent = Math.round(calGoal) + ' kcal';
    w('macro-protein').textContent = proteinG + ' g';
    w('macro-carbs').textContent = carbsG + ' g';
    w('macro-fat').textContent = fatG + ' g';

    var note = document.getElementById('macro-note');
    var goalLabel = goal === 'lose' ? 'weight loss' : goal === 'gain' ? 'weight gain' : 'maintenance';
    note.innerHTML = 'Your BMR is <strong>' + Math.round(bmr) + ' kcal</strong>, TDEE is <strong>' + Math.round(tdee) + ' kcal</strong>. ' +
      'For ' + goalLabel + ': <strong>' + Math.round(calGoal) + ' kcal/day</strong>. ' +
      'Macros: Protein ' + proteinG + 'g, Carbs ' + carbsG + 'g, Fat ' + fatG + 'g (30/40/30 split).';
    note.style.borderLeftColor = '#22c55e';
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.macro-field input, .macro-field select').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
