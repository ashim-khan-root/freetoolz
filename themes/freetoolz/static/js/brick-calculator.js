(function () {
  function bk(t) { return document.getElementById(t); }

  var BRICKS = {
    'modular': { l: 7.625, h: 2.25, d: 3.625, name: 'Modular' },
    'queen': { l: 7.625, h: 2.75, d: 2.75, name: 'Queen' },
    'king': { l: 9.625, h: 2.75, d: 2.75, name: 'King' },
    'utility': { l: 11.625, h: 3.625, d: 3.625, name: 'Utility' },
    'cmu4': { l: 15.625, h: 7.625, d: 3.625, name: '4" CMU Block' },
    'cmu6': { l: 15.625, h: 7.625, d: 5.625, name: '6" CMU Block' },
    'cmu8': { l: 15.625, h: 7.625, d: 7.625, name: '8" CMU Block' },
    'pmodular': { l: 7.625, h: 2.25, d: 3.625, name: 'Paver (Modular)' }
  };

  var HTML =
    '<div class="bk-widget">' +
    '<div class="bk-form">' +

    '<div class="bk-field">' +
    '<label>Units</label>' +
    '<select id="bk-units">' +
    '<option value="imperial">Feet & Inches</option>' +
    '<option value="metric">Meters</option>' +
    '</select></div>' +

    '<div class="bk-row-2">' +
    '<div class="bk-field"><label>Wall Length</label><input type="number" id="bk-length" value="10" min="0" step="any"><span class="bk-unit" id="bk-len-unit">ft</span></div>' +
    '<div class="bk-field"><label>Wall Height</label><input type="number" id="bk-height" value="8" min="0" step="any"><span class="bk-unit" id="bk-ht-unit">ft</span></div>' +
    '</div>' +

    '<div class="bk-field">' +
    '<label>Type</label>' +
    '<select id="bk-type">' +
    '<option value="modular">Modular Brick</option>' +
    '<option value="queen">Queen Brick</option>' +
    '<option value="king">King Brick</option>' +
    '<option value="utility">Utility Brick</option>' +
    '<option value="cmu4">4" CMU Block</option>' +
    '<option value="cmu6">6" CMU Block</option>' +
    '<option value="cmu8">8" CMU Block</option>' +
    '<option value="pmodular">Paver (Modular)</option>' +
    '</select></div>' +

    '<div class="bk-row-2">' +
    '<div class="bk-field"><label>Mortar Joint (in)</label><input type="number" id="bk-joint" value="0.375" min="0" step="any" class="bk-small"></div>' +
    '<div class="bk-field"><label>Waste (%)</label><input type="number" id="bk-waste" value="10" min="0" max="50" step="1" class="bk-small"></div>' +
    '</div>' +

    '<div class="bk-field">' +
    '<label>Mortar Type</label>' +
    '<select id="bk-mortar">' +
    '<option value="type-s">Type S (structural)</option>' +
    '<option value="type-n">Type N (general)</option>' +
    '</select></div>' +

    '</div>' +

    '<div class="bk-results">' +
    '<div class="bk-stat"><span class="bk-stat-label">Bricks/Blocks Needed</span><span class="bk-stat-val" id="bk-count">0</span></div>' +
    '<div class="bk-stat"><span class="bk-stat-label">+ Waste</span><span class="bk-stat-val" id="bk-with-waste">0</span></div>' +
    '<div class="bk-stat"><span class="bk-stat-label">Mortar Needed</span><span class="bk-stat-val" id="bk-mortar-qty">0 ft³</span></div>' +
    '<div class="bk-stat"><span class="bk-stat-label">Wall Area</span><span class="bk-stat-val" id="bk-area">0 sq ft</span></div>' +
    '</div>' +

    '<p class="bk-note">* Includes 10% waste for breakage. Mortar estimate is approximate. Add 5% more for complex patterns.</p>' +
    '</div>';

  var CSS =
    '.bk-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.bk-form{display:flex;flex-direction:column;gap:14px}' +
    '.bk-field{display:flex;flex-direction:column;gap:4px}' +
    '.bk-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.bk-field input,.bk-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.bk-field select{cursor:pointer}' +
    '.bk-field input:focus,.bk-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,0.1)}' +
    '.bk-small{max-width:120px}' +
    '.bk-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.bk-unit{font-size:.8rem;color:var(--text-secondary);margin-top:2px}' +
    '.bk-results{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.bk-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center}' +
    '.bk-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:4px}' +
    '.bk-stat-val{display:block;font-size:1.2rem;font-weight:700;color:var(--primary)}' +
    '.bk-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.bk-row-2{grid-template-columns:1fr}.bk-results{grid-template-columns:1fr 1fr}}';

  function calc() {
    var imp = bk('bk-units').value === 'imperial';
    var len = parseFloat(bk('bk-length').value) || 0;
    var ht = parseFloat(bk('bk-height').value) || 0;
    var type = bk('bk-type').value;
    var joint = parseFloat(bk('bk-joint').value) || 0.375;
    var wastePct = (parseFloat(bk('bk-waste').value) || 10) / 100;

    if (!imp) {
      len = len * 3.28084;
      ht = ht * 3.28084;
    }

    var brick = BRICKS[type];
    var wallArea = len * ht;
    var brickArea = ((brick.l + joint) / 12) * ((brick.h + joint) / 12);
    var count = Math.ceil(wallArea / brickArea);
    var withWaste = Math.ceil(count * (1 + wastePct));

    var mortarCF = count * brick.l * brick.h * joint / 12 / 12 / 12 * 1.2;

    var areaLabel = imp ? ' sq ft' : ' m²';
    var mortarLabel = imp ? ' ft³' : ' m³';

    if (!imp) {
      mortarCF = mortarCF * 0.0283;
      wallArea = wallArea * 0.0929;
    }

    bk('bk-count').textContent = count;
    bk('bk-with-waste').textContent = withWaste;
    bk('bk-mortar-qty').textContent = mortarCF.toFixed(2) + mortarLabel;
    bk('bk-area').textContent = wallArea.toFixed(2) + areaLabel;
  }

  function updateLabels() {
    var imp = bk('bk-units').value === 'imperial';
    bk('bk-len-unit').textContent = imp ? 'ft' : 'm';
    bk('bk-ht-unit').textContent = imp ? 'ft' : 'm';
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = HTML;

    bk('bk-units').addEventListener('change', function () { updateLabels(); calc(); });
    document.querySelectorAll('.bk-field input, .bk-field select').forEach(function (el) {
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
