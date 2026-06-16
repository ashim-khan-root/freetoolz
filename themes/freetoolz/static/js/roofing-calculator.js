(function () {
  function rf(t) { return document.getElementById(t); }

  var HTML =
    '<div class="rf-widget">' +
    '<div class="rf-form">' +

    '<div class="rf-field">' +
    '<label>Units</label>' +
    '<select id="rf-units">' +
    '<option value="imperial">Feet & Inches</option>' +
    '<option value="metric">Meters</option>' +
    '</select></div>' +

    '<div class="rf-row">' +
    '<div class="rf-field"><label>Length of roof</label><input type="number" id="rf-length" value="40" min="0" step="any"><span class="rf-unit" id="rf-len-unit">ft</span></div>' +
    '<div class="rf-field"><label>Width (eave to eave)</label><input type="number" id="rf-width" value="30" min="0" step="any"><span class="rf-unit" id="rf-wid-unit">ft</span></div>' +
    '</div>' +

    '<div class="rf-field">' +
    '<label>Roof Pitch (rise per 12")</label>' +
    '<select id="rf-pitch">' +
    '<option value="2">2/12 — Low slope</option>' +
    '<option value="3">3/12</option>' +
    '<option value="4">4/12</option>' +
    '<option value="5">5/12</option>' +
    '<option value="6" selected>6/12</option>' +
    '<option value="7">7/12</option>' +
    '<option value="8">8/12</option>' +
    '<option value="9">9/12</option>' +
    '<option value="10">10/12</option>' +
    '<option value="12">12/12 — Steep</option>' +
    '</select></div>' +

    '<div class="rf-field">' +
    '<label>Number of roof planes/sides</label>' +
    '<select id="rf-planes">' +
    '<option value="1">1 — Single slope</option>' +
    '<option value="2" selected>2 — Standard gable</option>' +
    '<option value="3">3 — Complex</option>' +
    '<option value="4">4 — Hip roof</option>' +
    '</select></div>' +

    '</div>' +

    '<div class="rf-results">' +
    '<div class="rf-stat"><span class="rf-stat-label">Total Roof Area</span><span class="rf-stat-val" id="rf-area">0 sq ft</span></div>' +
    '<div class="rf-stat"><span class="rf-stat-label">Roof Squares</span><span class="rf-stat-val" id="rf-squares">0</span></div>' +
    '<div class="rf-stat"><span class="rf-stat-label">Shingle Bundles</span><span class="rf-stat-val" id="rf-bundles">0</span></div>' +
    '<div class="rf-stat"><span class="rf-stat-label">#15 Felt Rolls</span><span class="rf-stat-val" id="rf-felt">0</span></div>' +
    '<div class="rf-stat"><span class="rf-stat-label">Ridge Cap (LF)</span><span class="rf-stat-val" id="rf-ridge">0 ft</span></div>' +
    '<div class="rf-stat"><span class="rf-stat-label">Est. Weight</span><span class="rf-stat-val" id="rf-weight">0 lbs</span></div>' +
    '</div>' +

    '<p class="rf-note">* Based on 3 bundles per square, 4 squares per #15 felt roll. Includes 10% waste. Always consult a professional roofer.</p>' +
    '</div>';

  var CSS =
    '.rf-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.rf-form{display:flex;flex-direction:column;gap:14px}' +
    '.rf-field{display:flex;flex-direction:column;gap:4px}' +
    '.rf-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.rf-field input,.rf-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.rf-field select{cursor:pointer}' +
    '.rf-field input:focus,.rf-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,0.1)}' +
    '.rf-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.rf-unit{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.rf-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.rf-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center}' +
    '.rf-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:4px}' +
    '.rf-stat-val{display:block;font-size:1.2rem;font-weight:700;color:var(--primary)}' +
    '.rf-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.rf-row{grid-template-columns:1fr}.rf-results{grid-template-columns:1fr 1fr}}' +
    '@media(max-width:400px){.rf-results{grid-template-columns:1fr}}';

  function calc() {
    var imp = rf('rf-units').value === 'imperial';
    var len = parseFloat(rf('rf-length').value) || 0;
    var wid = parseFloat(rf('rf-width').value) || 0;
    var pitch = parseInt(rf('rf-pitch').value, 10);
    var planes = parseInt(rf('rf-planes').value, 10);

    var pitchFactor = Math.sqrt(144 + pitch * pitch) / 12;
    var areaPerPlane = len * wid * pitchFactor;
    var totalArea = areaPerPlane * planes;

    var squares = totalArea / 100;
    var bundles = Math.ceil(squares * 3 * 1.1);
    var feltRolls = Math.ceil(squares / 4 * 1.1);
    var ridgeLen = len * (planes > 2 ? 1.5 : 1);
    var weight = squares * 250 * 1.1;

    if (!imp) {
      totalArea = totalArea * 0.0929;
      rf('rf-area').textContent = totalArea.toFixed(1) + ' m²';
      rf('rf-ridge').textContent = (ridgeLen * 0.3048).toFixed(1) + ' m';
      rf('rf-weight').textContent = (weight * 0.4536).toFixed(0) + ' kg';
    } else {
      rf('rf-area').textContent = totalArea.toFixed(1) + ' sq ft';
      rf('rf-ridge').textContent = ridgeLen.toFixed(1) + ' ft';
      rf('rf-weight').textContent = weight.toFixed(0) + ' lbs';
    }

    rf('rf-squares').textContent = Math.ceil(squares);
    rf('rf-bundles').textContent = bundles;
    rf('rf-felt').textContent = feltRolls;
    rf('rf-ridge').textContent = (imp ? ridgeLen : ridgeLen * 0.3048).toFixed(1) + (imp ? ' ft' : ' m');
  }

  function updateLabels() {
    var imp = rf('rf-units').value === 'imperial';
    rf('rf-len-unit').textContent = imp ? 'ft' : 'm';
    rf('rf-wid-unit').textContent = imp ? 'ft' : 'm';
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = HTML;

    rf('rf-units').addEventListener('change', function () { updateLabels(); calc(); });
    document.querySelectorAll('.rf-field input, .rf-field select').forEach(function (el) {
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
