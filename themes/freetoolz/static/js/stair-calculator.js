(function () {
  function st(t) { return document.getElementById(t); }

  var HTML =
    '<div class="st-widget">' +
    '<div class="st-form">' +

    '<div class="st-field">' +
    '<label>Units</label>' +
    '<select id="st-units">' +
    '<option value="imperial">Inches & Feet</option>' +
    '<option value="metric">Centimeters</option>' +
    '</select></div>' +

    '<div class="st-field">' +
    '<label>Total Rise (floor to floor)</label>' +
    '<input type="number" id="st-rise" value="105" min="0" step="any">' +
    '<span class="st-unit" id="st-rise-unit">in</span>' +
    '</div>' +

    '<div class="st-row-2">' +
    '<div class="st-field"><label>Target Riser Height</label><input type="number" id="st-riser" value="7" min="1" step="any"><span class="st-unit" id="st-riser-unit">in</span></div>' +
    '<div class="st-field"><label>Tread Depth (run)</label><input type="number" id="st-tread" value="11" min="1" step="any"><span class="st-unit" id="st-tread-unit">in</span></div>' +
    '</div>' +

    '<div class="st-field">' +
    '<label>Stringer Thickness</label>' +
    '<select id="st-stringer">' +
    '<option value="1.5">1.5" (2x lumber)</option>' +
    '<option value="3">3" (two 2xs)</option>' +
    '</select></div>' +

    '</div>' +

    '<div class="st-results">' +
    '<div class="st-stat"><span class="st-stat-label">Number of Risers</span><span class="st-stat-val" id="st-num-risers">0</span></div>' +
    '<div class="st-stat"><span class="st-stat-label">Actual Riser Height</span><span class="st-stat-val" id="st-act-riser">0 in</span></div>' +
    '<div class="st-stat"><span class="st-stat-label">Number of Treads</span><span class="st-stat-val" id="st-num-treads">0</span></div>' +
    '<div class="st-stat"><span class="st-stat-label">Total Run</span><span class="st-stat-val" id="st-total-run">0 in</span></div>' +
    '<div class="st-stat"><span class="st-stat-label">Stringer Length</span><span class="st-stat-val" id="st-stringer-len">0 in</span></div>' +
    '<div class="st-stat"><span class="st-stat-label">Stair Angle</span><span class="st-stat-val" id="st-angle">0°</span></div>' +
    '</div>' +

    '<p class="st-note">* Follows IRC guidelines: max 7-3/4" riser, min 10" tread. Actual riser height adjusts to divide total rise evenly.</p>' +
    '</div>';

  var CSS =
    '.st-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.st-form{display:flex;flex-direction:column;gap:14px}' +
    '.st-field{display:flex;flex-direction:column;gap:4px}' +
    '.st-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.st-field input,.st-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.st-field select{cursor:pointer}' +
    '.st-field input:focus,.st-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,0.1)}' +
    '.st-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.st-unit{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.st-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.st-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center}' +
    '.st-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:4px}' +
    '.st-stat-val{display:block;font-size:1.2rem;font-weight:700;color:var(--primary)}' +
    '.st-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.st-row-2{grid-template-columns:1fr}.st-results{grid-template-columns:1fr 1fr}}';

  function calc() {
    var imp = st('st-units').value === 'imperial';
    var totalRise = parseFloat(st('st-rise').value) || 0;
    var targetRiser = parseFloat(st('st-riser').value) || 7;
    var tread = parseFloat(st('st-tread').value) || 11;
    var stThick = parseFloat(st('st-stringer').value) || 1.5;

    if (!imp) {
      totalRise = totalRise / 2.54;
      targetRiser = targetRiser / 2.54;
      tread = tread / 2.54;
    }

    var numRisers = Math.round(totalRise / targetRiser);
    if (numRisers < 1) numRisers = 1;
    var actualRiser = totalRise / numRisers;
    var numTreads = numRisers - 1;
    var totalRun = numTreads * tread;
    var stringerLen = Math.sqrt(totalRun * totalRun + totalRise * totalRise);
    var angle = Math.atan2(totalRise, totalRun) * (180 / Math.PI);

    var unit = imp ? ' in' : ' cm';
    var angUnit = '°';

    st('st-num-risers').textContent = numRisers;
    st('st-act-riser').textContent = actualRiser.toFixed(2) + unit;
    st('st-num-treads').textContent = numTreads;
    st('st-total-run').textContent = totalRun.toFixed(2) + unit;
    st('st-stringer-len').textContent = stringerLen.toFixed(2) + unit;
    st('st-angle').textContent = angle.toFixed(1) + angUnit;
  }

  function updateLabels() {
    var imp = st('st-units').value === 'imperial';
    var u = imp ? 'in' : 'cm';
    st('st-rise-unit').textContent = u;
    st('st-riser-unit').textContent = u;
    st('st-tread-unit').textContent = u;
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = HTML;

    st('st-units').addEventListener('change', function () { updateLabels(); calc(); });
    document.querySelectorAll('.st-field input, .st-field select').forEach(function (el) {
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
