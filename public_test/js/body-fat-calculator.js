(function () {
  var w = document.getElementById.bind(document);
  var HTML =
    '<div class="bf-widget"><div class="bf-form">' +
    '<div class="bf-field"><label>Method</label><select id="bf-method"><option value="navy">US Navy (most accurate)</option><option value="bmi">BMI-based (quick estimate)</option></select></div>' +
    '<div class="bf-field"><label>Gender</label><select id="bf-gender"><option value="male">Male</option><option value="female">Female</option></select></div>' +
    '<div id="bf-navy"><div class="bf-row-3"><div class="bf-field"><label>Height</label><input type="number" id="bf-height" value="70" min="0" step="any"><span class="bf-unit" id="bf-ht-unit">in</span></div>' +
    '<div class="bf-field"><label>Neck</label><input type="number" id="bf-neck" value="15" min="0" step="any"><span class="bf-unit" id="bf-nk-unit">in</span></div>' +
    '<div class="bf-field"><label>Waist</label><input type="number" id="bf-waist" value="34" min="0" step="any"><span class="bf-unit" id="bf-wa-unit">in</span></div></div>' +
    '<div class="bf-field" id="bf-hip-field"><label>Hips</label><input type="number" id="bf-hip" value="38" min="0" step="any"><span class="bf-unit" id="bf-hp-unit">in</span></div></div>' +
    '</div>' +
    '<div class="bf-result-box"><div class="bf-score-wrap"><span class="bf-score-label">Body Fat</span><span class="bf-score" id="bf-score">0.0%</span></div>' +
    '<div class="bf-gauge"><div class="bf-gauge-fill" id="bf-gauge" style="width:0%"></div></div>' +
    '<div class="bf-category" id="bf-category">Enter your details</div>' +
    '<div class="bf-detail" id="bf-detail">Fat Mass: — | Lean Mass: —</div></div>' +
    '<div class="bf-bands"><div class="bf-band" style="background:#3b82f6">Essential<br><strong>2-5% M<br>10-13% F</strong></div>' +
    '<div class="bf-band" style="background:#22c55e">Athlete<br><strong>6-13% M<br>14-20% F</strong></div>' +
    '<div class="bf-band" style="background:#eab308">Fitness<br><strong>14-17% M<br>21-24% F</strong></div>' +
    '<div class="bf-band" style="background:#f97316">Average<br><strong>18-24% M<br>25-31% F</strong></div>' +
    '<div class="bf-band" style="background:#ef4444">Obese<br><strong>25%+ M<br>32%+ F</strong></div></div>' +
    '<p class="bf-note">* US Navy method accuracy is ±3%. BMI-based is less accurate. Consult a professional for precise measurement.</p></div>';
  var CSS =
    '.bf-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.bf-form{display:flex;flex-direction:column;gap:14px}' +
    '.bf-field{display:flex;flex-direction:column;gap:4px}' +
    '.bf-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.bf-field input,.bf-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.bf-field select{cursor:pointer}.bf-field input:focus,.bf-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,.1)}' +
    '.bf-unit{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.bf-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.bf-result-box{background:var(--bg);border:2px solid var(--border);border-radius:var(--radius);padding:20px;text-align:center}' +
    '.bf-score-label{font-size:1rem;color:var(--text-secondary)}' +
    '.bf-score{font-size:2.5rem;font-weight:800;color:var(--primary)}' +
    '.bf-gauge{height:12px;background:var(--border);border-radius:6px;margin:12px 0;overflow:hidden}' +
    '.bf-gauge-fill{height:100%;border-radius:6px;transition:width .4s ease,background .4s ease}' +
    '.bf-category{font-size:1.1rem;font-weight:700;margin-bottom:4px}' +
    '.bf-detail{font-size:.85rem;color:var(--text-secondary)}' +
    '.bf-bands{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:6px}' +
    '.bf-band{padding:10px 4px;border-radius:var(--radius-sm);color:#fff;text-align:center;font-size:.7rem;line-height:1.3}' +
    '.bf-band strong{display:block;font-size:.8rem;margin-top:2px}' +
    '.bf-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0;text-align:center}' +
    '@media(max-width:600px){.bf-row-3{grid-template-columns:1fr}.bf-bands{grid-template-columns:1fr 1fr 1fr}.bf-score{font-size:2rem}}';
  function calc() {
    var m = w('bf-method').value; var gender = w('bf-gender').value;
    var ht = parseFloat(w('bf-height').value) || 0; var bfp = 0;
    if (m === 'navy') {
      var nk = parseFloat(w('bf-neck').value) || 0; var wa = parseFloat(w('bf-waist').value) || 0;
      if (gender === 'male') { bfp = 86.010 * Math.log10(wa - nk) - 70.041 * Math.log10(ht) + 36.76; }
      else { var hp = parseFloat(w('bf-hip').value) || 0; bfp = 163.205 * Math.log10(wa + hp - nk) - 97.684 * Math.log10(ht) - 78.387; }
    } else {
      var wt = parseFloat(w('bf-weight-bmi') ? (w('bf-weight-bmi').value || 170) : 170);
      var bmi = wt / (ht * ht) * 703; bfp = gender === 'male' ? 1.2 * bmi + 0.23 * 30 - 16.2 : 1.2 * bmi + 0.23 * 30 - 5.4;
    }
    bfp = Math.max(2, Math.min(55, bfp));
    var col, cat;
    if (gender === 'male') { if (bfp < 6) { cat='Essential'; col='#3b82f6'; } else if (bfp < 14) { cat='Athlete'; col='#22c55e'; } else if (bfp < 18) { cat='Fitness'; col='#eab308'; } else if (bfp < 25) { cat='Average'; col='#f97316'; } else { cat='Obese'; col='#ef4444'; } }
    else { if (bfp < 14) { cat='Essential'; col='#3b82f6'; } else if (bfp < 21) { cat='Athlete'; col='#22c55e'; } else if (bfp < 25) { cat='Fitness'; col='#eab308'; } else if (bfp < 32) { cat='Average'; col='#f97316'; } else { cat='Obese'; col='#ef4444'; } }
    w('bf-score').textContent = bfp.toFixed(1) + '%'; w('bf-score').style.color = col;
    w('bf-gauge').style.width = (bfp / 45 * 100) + '%'; w('bf-gauge').style.background = col;
    w('bf-category').textContent = cat; w('bf-category').style.color = col;
    var wt = 170; try { var inp = document.getElementById('bf-weight-bmi'); if (inp) wt = parseFloat(inp.value) || 170; } catch(e) {}
    w('bf-detail').textContent = 'Fat Mass: ' + (wt * bfp / 100).toFixed(1) + ' lbs | Lean Mass: ' + (wt * (100-bfp) / 100).toFixed(1) + ' lbs';
  }
  function toggleMethod() { w('bf-navy').style.display = w('bf-method').value === 'navy' ? '' : 'none'; calc(); }
  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('bf-method').addEventListener('change', toggleMethod);
    document.querySelectorAll('.bf-field input, .bf-field select').forEach(function (e) { e.addEventListener('input', calc); e.addEventListener('change', calc); });
    calc();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
