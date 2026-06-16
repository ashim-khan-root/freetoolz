(function () {
  function pt(t) { return document.getElementById(t); }

  var HTML =
    '<div class="pt-widget">' +
    '<div class="pt-form">' +

    '<div class="pt-field">' +
    '<label>Units</label>' +
    '<select id="pt-units">' +
    '<option value="imperial">Feet & Inches</option>' +
    '<option value="metric">Meters</option>' +
    '</select></div>' +

    '<div class="pt-row-3">' +
    '<div class="pt-field"><label>Room Length</label><input type="number" id="pt-length" value="12" min="0" step="any"><span class="pt-unit" id="pt-len-unit">ft</span></div>' +
    '<div class="pt-field"><label>Room Width</label><input type="number" id="pt-width" value="10" min="0" step="any"><span class="pt-unit" id="pt-wid-unit">ft</span></div>' +
    '<div class="pt-field"><label>Wall Height</label><input type="number" id="pt-height" value="8" min="0" step="any"><span class="pt-unit" id="pt-ht-unit">ft</span></div>' +
    '</div>' +

    '<div class="pt-row-3">' +
    '<div class="pt-field"><label>Windows</label><input type="number" id="pt-windows" value="2" min="0" step="1" class="pt-small"></div>' +
    '<div class="pt-field"><label>Doors</label><input type="number" id="pt-doors" value="2" min="0" step="1" class="pt-small"></div>' +
    '<div class="pt-field"><label>Coats</label><select id="pt-coats"><option value="1">1 coat</option><option value="2" selected>2 coats</option></select></div>' +
    '</div>' +

    '<div class="pt-checkbox-row">' +
    '<label class="pt-cb"><input type="checkbox" id="pt-ceiling" checked> Include ceiling</label>' +
    '<label class="pt-cb"><input type="checkbox" id="pt-trim" checked> Include trim/baseboards</label>' +
    '</div>' +

    '</div>' +

    '<div class="pt-results">' +
    '<div class="pt-stat"><span class="pt-stat-label">Walls</span><span class="pt-stat-val" id="pt-walls">0 gal</span></div>' +
    '<div class="pt-stat"><span class="pt-stat-label">Ceiling</span><span class="pt-stat-val" id="pt-ceil-gals">0 gal</span></div>' +
    '<div class="pt-stat"><span class="pt-stat-label">Trim</span><span class="pt-stat-val" id="pt-trim-gals">0 gal</span></div>' +
    '<div class="pt-stat pt-stat-total"><span class="pt-stat-label">Total</span><span class="pt-stat-val" id="pt-total">0 gal</span></div>' +
    '</div>' +

    '<p class="pt-note">* Based on 350 sq ft per gallon coverage. Includes 10% waste. Actual coverage varies by surface and paint type.</p>' +
    '</div>';

  var CSS =
    '.pt-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.pt-form{display:flex;flex-direction:column;gap:14px}' +
    '.pt-field{display:flex;flex-direction:column;gap:4px}' +
    '.pt-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.pt-field input,.pt-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.pt-field select{cursor:pointer}' +
    '.pt-field input:focus,.pt-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,0.1)}' +
    '.pt-small{max-width:100px}' +
    '.pt-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.pt-unit{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.pt-checkbox-row{display:flex;gap:20px}' +
    '.pt-cb{display:flex;align-items:center;gap:8px;font-size:.9rem;font-weight:500;color:var(--text);cursor:pointer}' +
    '.pt-cb input{width:16px;height:16px;accent-color:var(--primary);cursor:pointer}' +
    '.pt-results{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.pt-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center}' +
    '.pt-stat-total{background:var(--primary);border-color:var(--primary)}' +
    '.pt-stat-total .pt-stat-label{color:#fff;opacity:.85}' +
    '.pt-stat-total .pt-stat-val{color:#fff}' +
    '.pt-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:4px}' +
    '.pt-stat-val{display:block;font-size:1.2rem;font-weight:700;color:var(--primary)}' +
    '.pt-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.pt-row-3{grid-template-columns:1fr}.pt-results{grid-template-columns:1fr 1fr}}';

  function calc() {
    var imp = pt('pt-units').value === 'imperial';
    var len = parseFloat(pt('pt-length').value) || 0;
    var wid = parseFloat(pt('pt-width').value) || 0;
    var ht = parseFloat(pt('pt-height').value) || 0;
    var wins = parseInt(pt('pt-windows').value, 10) || 0;
    var doors = parseInt(pt('pt-doors').value, 10) || 0;
    var coats = parseInt(pt('pt-coats').value, 10);
    var ceil = pt('pt-ceiling').checked;
    var trim = pt('pt-trim').checked;

    if (!imp) {
      len = len * 3.28084;
      wid = wid * 3.28084;
      ht = ht * 3.28084;
    }

    var winArea = wins * 15;
    var doorArea = doors * 21;
    var wallPerimeter = 2 * (len + wid);
    var wallArea = wallPerimeter * ht - winArea - doorArea;
    var ceilArea = len * wid;
    var trimLF = wallPerimeter;

    var coverage = 350;
    var waste = 1.1;

    var wallGals = Math.ceil(wallArea * coats * waste / coverage);
    var ceilGals = ceil ? Math.ceil(ceilArea * coats * waste / coverage) : 0;
    var trimGals = trim ? Math.ceil(trimLF * 0.5 * coats * waste / coverage) : 0;
    var total = wallGals + ceilGals + trimGals;

    pt('pt-walls').textContent = wallGals + ' gal';
    pt('pt-ceil-gals').textContent = ceilGals + ' gal';
    pt('pt-trim-gals').textContent = trimGals + ' gal';
    pt('pt-total').textContent = total + ' gal';
  }

  function updateLabels() {
    var imp = pt('pt-units').value === 'imperial';
    pt('pt-len-unit').textContent = imp ? 'ft' : 'm';
    pt('pt-wid-unit').textContent = imp ? 'ft' : 'm';
    pt('pt-ht-unit').textContent = imp ? 'ft' : 'm';
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = HTML;

    pt('pt-units').addEventListener('change', function () { updateLabels(); calc(); });
    document.querySelectorAll('.pt-field input, .pt-field select, .pt-cb input').forEach(function (el) {
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
