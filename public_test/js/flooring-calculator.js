(function () {
  function fl(t) { return document.getElementById(t); }

  var HTML =
    '<div class="fl-widget">' +
    '<div class="fl-form">' +

    '<div class="fl-field">' +
    '<label>Units</label>' +
    '<select id="fl-units">' +
    '<option value="imperial">Feet & Inches</option>' +
    '<option value="metric">Meters</option>' +
    '</select></div>' +

    '<div class="fl-field">' +
    '<label>Room Shape</label>' +
    '<select id="fl-shape">' +
    '<option value="rectangle">Rectangle</option>' +
    '<option value="lshape">L-Shaped</option>' +
    '</select></div>' +

    '<div id="fl-rect">' +
    '<div class="fl-row-2">' +
    '<div class="fl-field"><label>Length</label><input type="number" id="fl-length" value="12" min="0" step="any"><span class="fl-unit" id="fl-len-unit">ft</span></div>' +
    '<div class="fl-field"><label>Width</label><input type="number" id="fl-width" value="10" min="0" step="any"><span class="fl-unit" id="fl-wid-unit">ft</span></div>' +
    '</div></div>' +

    '<div id="fl-lshape" style="display:none">' +
    '<div class="fl-row-2">' +
    '<div class="fl-field"><label>Main Length</label><input type="number" id="fl-mlen" value="12" min="0" step="any"><span class="fl-unit" id="fl-mlen-unit">ft</span></div>' +
    '<div class="fl-field"><label>Main Width</label><input type="number" id="fl-mwid" value="10" min="0" step="any"><span class="fl-unit" id="fl-mwid-unit">ft</span></div>' +
    '</div>' +
    '<div class="fl-row-2">' +
    '<div class="fl-field"><label>Extension Length</label><input type="number" id="fl-elen" value="6" min="0" step="any"><span class="fl-unit" id="fl-elen-unit">ft</span></div>' +
    '<div class="fl-field"><label>Extension Width</label><input type="number" id="fl-ewid" value="4" min="0" step="any"><span class="fl-unit" id="fl-ewid-unit">ft</span></div>' +
    '</div></div>' +

    '<div class="fl-row-2">' +
    '<div class="fl-field"><label>Waste (%)</label><input type="number" id="fl-waste" value="10" min="0" max="50" step="1"></div>' +
    '<div class="fl-field"><label>Box Coverage</label><input type="number" id="fl-box" value="20" min="0" step="any"><span class="fl-unit" id="fl-box-unit">sq ft</span></div>' +
    '</div>' +

    '</div>' +

    '<div class="fl-results">' +
    '<div class="fl-stat"><span class="fl-stat-label">Net Area</span><span class="fl-stat-val" id="fl-net-area">0</span></div>' +
    '<div class="fl-stat"><span class="fl-stat-label">+ Waste</span><span class="fl-stat-val" id="fl-waste-pct">0%</span></div>' +
    '<div class="fl-stat"><span class="fl-stat-label">Total to Order</span><span class="fl-stat-val" id="fl-total">0</span></div>' +
    '<div class="fl-stat"><span class="fl-stat-label">Boxes Needed</span><span class="fl-stat-val" id="fl-boxes">0</span></div>' +
    '</div>' +

    '<p class="fl-note">* Includes your selected waste percentage. For diagonal patterns, use 15% waste. Always buy 1 extra box for replacements.</p>' +
    '</div>';

  var CSS =
    '.fl-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.fl-form{display:flex;flex-direction:column;gap:14px}' +
    '.fl-field{display:flex;flex-direction:column;gap:4px}' +
    '.fl-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.fl-field input,.fl-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.fl-field select{cursor:pointer}' +
    '.fl-field input:focus,.fl-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,0.1)}' +
    '.fl-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.fl-unit{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.fl-results{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.fl-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center}' +
    '.fl-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:4px}' +
    '.fl-stat-val{display:block;font-size:1.2rem;font-weight:700;color:var(--primary)}' +
    '.fl-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.fl-row-2{grid-template-columns:1fr}.fl-results{grid-template-columns:1fr 1fr}}';

  function calc() {
    var imp = fl('fl-units').value === 'imperial';
    var shape = fl('fl-shape').value;
    var wastePct = (parseFloat(fl('fl-waste').value) || 10) / 100;
    var boxCov = parseFloat(fl('fl-box').value) || 20;

    var netArea = 0;

    if (shape === 'rectangle') {
      var len = parseFloat(fl('fl-length').value) || 0;
      var wid = parseFloat(fl('fl-width').value) || 0;
      netArea = len * wid;
    } else {
      var ml = parseFloat(fl('fl-mlen').value) || 0;
      var mw = parseFloat(fl('fl-mwid').value) || 0;
      var el = parseFloat(fl('fl-elen').value) || 0;
      var ew = parseFloat(fl('fl-ewid').value) || 0;
      netArea = (ml * mw) + (el * ew);
    }

    var totalArea = netArea * (1 + wastePct);
    var boxes = Math.ceil(totalArea / boxCov);

    var unit = imp ? ' sq ft' : ' m²';
    var boxUnit = imp ? 'sq ft' : 'm²';

    if (!imp) {
      netArea = netArea * 0.0929;
      totalArea = totalArea * 0.0929;
    }

    fl('fl-net-area').textContent = netArea.toFixed(2) + unit;
    fl('fl-waste-pct').textContent = (wastePct * 100).toFixed(0) + '%';
    fl('fl-total').textContent = totalArea.toFixed(2) + unit;
    fl('fl-box').parentElement.querySelector('.fl-unit').textContent = boxUnit;
    fl('fl-boxes').textContent = boxes;
  }

  function updateLabels() {
    var imp = fl('fl-units').value === 'imperial';
    var u = imp ? 'ft' : 'm';
    fl('fl-len-unit').textContent = u;
    fl('fl-wid-unit').textContent = u;
    fl('fl-mlen-unit').textContent = u;
    fl('fl-mwid-unit').textContent = u;
    fl('fl-elen-unit').textContent = u;
    fl('fl-ewid-unit').textContent = u;
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = HTML;

    fl('fl-shape').addEventListener('change', function () {
      fl('fl-rect').style.display = fl('fl-shape').value === 'rectangle' ? '' : 'none';
      fl('fl-lshape').style.display = fl('fl-shape').value === 'lshape' ? '' : 'none';
      calc();
    });

    fl('fl-units').addEventListener('change', function () { updateLabels(); calc(); });
    document.querySelectorAll('.fl-field input, .fl-field select').forEach(function (el) {
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
