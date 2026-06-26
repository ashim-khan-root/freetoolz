(function () {
  function cc(t) { return document.getElementById(t); }

  var HTML =
    '<div class="cc-widget">' +
    '<div class="cc-form">' +

    '<div class="cc-field">' +
    '<label>Shape</label>' +
    '<select id="cc-shape">' +
    '<option value="slab">Slab (Rectangle)</option>' +
    '<option value="column">Column (Cylinder)</option>' +
    '<option value="footing">Footing</option>' +
    '</select></div>' +

    '<div class="cc-field">' +
    '<label>Units</label>' +
    '<select id="cc-units">' +
    '<option value="imperial">Feet & Inches</option>' +
    '<option value="metric">Meters & Centimeters</option>' +
    '</select></div>' +

    '<div class="cc-fields" id="cc-slabs">' +
    '<div class="cc-row">' +
    '<div class="cc-field"><label>Length</label><input type="number" id="cc-length" value="10" min="0" step="any"><span class="cc-unit-label" id="cc-length-unit">ft</span></div>' +
    '<div class="cc-field"><label>Width</label><input type="number" id="cc-width" value="10" min="0" step="any"><span class="cc-unit-label" id="cc-width-unit">ft</span></div>' +
    '</div></div>' +

    '<div class="cc-fields" id="cc-columns" style="display:none">' +
    '<div class="cc-row">' +
    '<div class="cc-field"><label>Diameter</label><input type="number" id="cc-diameter" value="12" min="0" step="any"><span class="cc-unit-label" id="cc-dia-unit">in</span></div>' +
    '<div class="cc-field"><label>Height</label><input type="number" id="cc-height" value="10" min="0" step="any"><span class="cc-unit-label" id="cc-ht-unit">ft</span></div>' +
    '</div></div>' +

    '<div class="cc-field">' +
    '<label>Depth / Thickness</label>' +
    '<input type="number" id="cc-depth" value="4" min="0" step="any">' +
    '<span class="cc-unit-label" id="cc-depth-unit">in</span>' +
    '</div>' +

    '</div>' +

    '<div class="cc-results">' +
    '<div class="cc-stat"><span class="cc-stat-label">Cubic Feet</span><span class="cc-stat-val" id="cc-cuft">0</span></div>' +
    '<div class="cc-stat"><span class="cc-stat-label">Cubic Yards</span><span class="cc-stat-val" id="cc-cy">0</span></div>' +
    '<div class="cc-stat"><span class="cc-stat-label">Cubic Meters</span><span class="cc-stat-val" id="cc-cum">0</span></div>' +
    '<div class="cc-stat"><span class="cc-stat-label">Total Weight</span><span class="cc-stat-val" id="cc-weight">0 lbs</span></div>' +
    '</div>' +

    '<div class="cc-bags">' +
    '<h3>Bags Needed</h3>' +
    '<table class="cc-bag-table">' +
    '<tr><th>Bag Size</th><th>Qty</th><th>Total Weight</th></tr>' +
    '<tr><td>40 lb (0.011 yd³)</td><td id="cc-bag-40">0</td><td id="cc-wt-40">0 lbs</td></tr>' +
    '<tr><td>60 lb (0.017 yd³)</td><td id="cc-bag-60">0</td><td id="cc-wt-60">0 lbs</td></tr>' +
    '<tr><td>80 lb (0.022 yd³)</td><td id="cc-bag-80">0</td><td id="cc-wt-80">0 lbs</td></tr>' +
    '<tr><td>90 lb (0.025 yd³)</td><td id="cc-bag-90">0</td><td id="cc-wt-90">0 lbs</td></tr>' +
    '</table></div>' +

    '<p class="cc-note">* Estimates based on standard concrete density (150 lb/ft³). Actual needs may vary. Always order 5-10% extra.</p>' +
    '</div>';

  var CSS =
    '.cc-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.cc-form{display:flex;flex-direction:column;gap:14px}' +
    '.cc-field{display:flex;flex-direction:column;gap:4px}' +
    '.cc-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.cc-field input,.cc-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.cc-field select{cursor:pointer}' +
    '.cc-field input:focus,.cc-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,0.1)}' +
    '.cc-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.cc-unit-label{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.cc-results{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.cc-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center}' +
    '.cc-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:4px}' +
    '.cc-stat-val{display:block;font-size:1.5rem;font-weight:700;color:var(--primary)}' +
    '.cc-bags h3{font-size:1rem;margin:0 0 10px;color:var(--text)}' +
    '.cc-bag-table{width:100%;border-collapse:collapse}' +
    '.cc-bag-table th,.cc-bag-table td{padding:8px 12px;text-align:left;border-bottom:1px solid var(--border);font-size:.85rem}' +
    '.cc-bag-table th{font-weight:600;color:var(--text-secondary)}' +
    '.cc-bag-table td:last-child,.cc-bag-table th:last-child{text-align:right}' +
    '.cc-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:480px){.cc-row{grid-template-columns:1fr}.cc-results{grid-template-columns:1fr}}';

  function calc() {
    var shape = cc('cc-shape').value;
    var units = cc('cc-units').value;
    var isImperial = units === 'imperial';

    var volCF = 0;

    if (shape === 'slab') {
      var len = parseFloat(cc('cc-length').value) || 0;
      var wid = parseFloat(cc('cc-width').value) || 0;
      var dep = parseFloat(cc('cc-depth').value) || 0;
      if (isImperial) dep = dep / 12;
      else dep = dep / 100;
      volCF = len * wid * dep;
      if (!isImperial) volCF = volCF * 35.315;
    } else if (shape === 'column' || shape === 'footing') {
      var dia = parseFloat(cc('cc-diameter').value) || 0;
      var ht = (shape === 'column' ? (parseFloat(cc('cc-height').value) || 0) : (parseFloat(cc('cc-depth').value) || 0));
      var r = dia / 2;
      if (isImperial) r = r / 12;
      else r = r / 100;
      if (!isImperial) ht = ht * 3.28084;
      else if (shape === 'footing') ht = ht / 12;
      volCF = Math.PI * r * r * ht;
    }

    var volCY = volCF / 27;
    var volCM = volCF / 35.315;

    // bag yields in cubic yards
    var bags = { '40': 0.011, '60': 0.017, '80': 0.022, '90': 0.025 };

    cc('cc-cuft').textContent = volCF.toFixed(2);
    cc('cc-cy').textContent = volCY.toFixed(3);
    cc('cc-cum').textContent = volCM.toFixed(3);
    cc('cc-weight').textContent = (volCF * 150).toFixed(0) + ' lbs';
    if (!isImperial) cc('cc-weight').textContent = (volCM * 2400).toFixed(0) + ' kg';

    ['40', '60', '80', '90'].forEach(function (s) {
      var qty = Math.ceil(volCY / bags[s]);
      cc('cc-bag-' + s).textContent = qty || 0;
      cc('cc-wt-' + s).textContent = (qty * parseInt(s)) + ' lbs';
    });
  }

  function updateUnitLabels() {
    var imp = cc('cc-units').value === 'imperial';
    cc('cc-length-unit').textContent = imp ? 'ft' : 'm';
    cc('cc-width-unit').textContent = imp ? 'ft' : 'm';
    cc('cc-dia-unit').textContent = imp ? 'in' : 'cm';
    cc('cc-ht-unit').textContent = imp ? 'ft' : 'm';
    cc('cc-depth-unit').textContent = imp ? 'in' : 'cm';
  }

  function enhanceInputs() {
    cc('cc-shape').addEventListener('change', function () {
      var v = cc('cc-shape').value;
      cc('cc-slabs').style.display = v === 'slab' ? '' : 'none';
      cc('cc-columns').style.display = (v === 'column' || v === 'footing') ? '' : 'none';
      cc('cc-depth').parentElement.style.display = (v === 'slab' || v === 'footing') ? '' : 'none';
      calc();
    });

    cc('cc-units').addEventListener('change', function () {
      updateUnitLabels();
      calc();
    });

    document.querySelectorAll('.cc-field input').forEach(function (el) {
      el.addEventListener('input', calc);
    });
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = HTML;

    enhanceInputs();
    calc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
