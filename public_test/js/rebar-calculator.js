(function () {
  function rb(t) { return document.getElementById(t); }

  var REBAR = {
    '#3': { dia: 0.375, wpl: 0.376, metric: '10mm' },
    '#4': { dia: 0.5, wpl: 0.668, metric: '12mm' },
    '#5': { dia: 0.625, wpl: 1.043, metric: '16mm' },
    '#6': { dia: 0.75, wpl: 1.502, metric: '20mm' },
    '#7': { dia: 0.875, wpl: 2.044, metric: '22mm' },
    '#8': { dia: 1.0, wpl: 2.67, metric: '25mm' }
  };

  var HTML =
    '<div class="rb-widget">' +
    '<div class="rb-form">' +

    '<div class="rb-field">' +
    '<label>Units</label>' +
    '<select id="rb-units">' +
    '<option value="imperial">Feet & Inches</option>' +
    '<option value="metric">Meters</option>' +
    '</select></div>' +

    '<div class="rb-row">' +
    '<div class="rb-field"><label>Length</label><input type="number" id="rb-length" value="20" min="0" step="any"><span class="rb-unit" id="rb-len-unit">ft</span></div>' +
    '<div class="rb-field"><label>Width</label><input type="number" id="rb-width" value="12" min="0" step="any"><span class="rb-unit" id="rb-wid-unit">ft</span></div>' +
    '</div>' +

    '<div class="rb-row">' +
    '<div class="rb-field"><label>Spacing (horizontal)</label><input type="number" id="rb-spacing-h" value="12" min="1" step="any"><span class="rb-unit" id="rb-sp-h-unit">in</span></div>' +
    '<div class="rb-field"><label>Spacing (vertical)</label><input type="number" id="rb-spacing-v" value="12" min="1" step="any"><span class="rb-unit" id="rb-sp-v-unit">in</span></div>' +
    '</div>' +

    '<div class="rb-field">' +
    '<label>Rebar Size</label>' +
    '<select id="rb-size">' +
    '<option value="#3">#3 (10mm)</option>' +
    '<option value="#4" selected>#4 (12mm)</option>' +
    '<option value="#5">#5 (16mm)</option>' +
    '<option value="#6">#6 (20mm)</option>' +
    '<option value="#7">#7 (22mm)</option>' +
    '<option value="#8">#8 (25mm)</option>' +
    '</select></div>' +

    '<div class="rb-field">' +
    '<label><input type="checkbox" id="rb-overlap" checked> Include overlap allowance (+18")</label>' +
    '</div>' +

    '</div>' +

    '<div class="rb-results">' +
    '<div class="rb-stat"><span class="rb-stat-label">Bars (horizontal)</span><span class="rb-stat-val" id="rb-bars-h">0</span></div>' +
    '<div class="rb-stat"><span class="rb-stat-label">Bars (vertical)</span><span class="rb-stat-val" id="rb-bars-v">0</span></div>' +
    '<div class="rb-stat"><span class="rb-stat-label">Total Length</span><span class="rb-stat-val" id="rb-total-len">0 ft</span></div>' +
    '<div class="rb-stat"><span class="rb-stat-label">Total Weight</span><span class="rb-stat-val" id="rb-total-wt">0 lbs</span></div>' +
    '</div>' +

    '<p class="rb-note">* Estimates for standard grid reinforcement. Add 5-10% for waste and overlaps.</p>' +
    '</div>';

  var CSS =
    '.rb-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.rb-form{display:flex;flex-direction:column;gap:14px}' +
    '.rb-field{display:flex;flex-direction:column;gap:4px}' +
    '.rb-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.rb-field input,.rb-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.rb-field select{cursor:pointer}' +
    '.rb-field input:focus,.rb-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,0.1)}' +
    '.rb-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.rb-unit{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.rb-results{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.rb-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;text-align:center}' +
    '.rb-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:4px}' +
    '.rb-stat-val{display:block;font-size:1.3rem;font-weight:700;color:var(--primary)}' +
    '.rb-field input[type=checkbox]{width:16px;height:16px;accent-color:var(--primary);margin-right:8px;cursor:pointer}' +
    '.rb-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:480px){.rb-row{grid-template-columns:1fr}.rb-results{grid-template-columns:1fr}}';

  function calc() {
    var imp = rb('rb-units').value === 'imperial';
    var len = parseFloat(rb('rb-length').value) || 0;
    var wid = parseFloat(rb('rb-width').value) || 0;
    var spH = parseFloat(rb('rb-spacing-h').value) || 12;
    var spV = parseFloat(rb('rb-spacing-v').value) || 12;
    var size = rb('rb-size').value;
    var overlap = rb('rb-overlap').checked;
    var rebar = REBAR[size];
    if (!imp) { spH = spH * 3.28084; spV = spV * 3.28084; }
    else { spH = spH / 12; spV = spV / 12; }

    var barsH = Math.floor(wid / spH) + 1;
    var barsV = Math.floor(len / spV) + 1;

    var totalLen = (barsH * len) + (barsV * wid);
    if (overlap) totalLen += (barsH + barsV) * 1.5;
    var weight = totalLen * rebar.wpl;

    if (!imp) {
      totalLen = totalLen * 0.3048;
      weight = weight * 0.453592;
    }

    rb('rb-bars-h').textContent = barsH;
    rb('rb-bars-v').textContent = barsV;
    rb('rb-total-len').textContent = totalLen.toFixed(1) + (imp ? ' ft' : ' m');
    rb('rb-total-wt').textContent = weight.toFixed(1) + (imp ? ' lbs' : ' kg');
  }

  function updateLabels() {
    var imp = rb('rb-units').value === 'imperial';
    rb('rb-len-unit').textContent = imp ? 'ft' : 'm';
    rb('rb-wid-unit').textContent = imp ? 'ft' : 'm';
    rb('rb-sp-h-unit').textContent = imp ? 'in' : 'm';
    rb('rb-sp-v-unit').textContent = imp ? 'in' : 'm';
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = HTML;

    rb('rb-units').addEventListener('change', function () { updateLabels(); calc(); });
    document.querySelectorAll('.rb-field input, .rb-field select').forEach(function (el) {
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
