(function () {
  var w = document.getElementById.bind(document);

  var UNITS = {
    mL: 0.001, L: 1, 'm3': 1000,
    gal: 3.78541, qt: 0.946353, pt: 0.473176,
    cup: 0.236588, 'fl oz': 0.0295735, tbsp: 0.0147868,
    tsp: 0.00492892, 'in3': 0.0163871, 'ft3': 28.3168,
    bbl: 158.987
  };

  var UNIT_LABELS = {
    mL: 'Milliliter', L: 'Liter', 'm3': 'Cubic meter',
    gal: 'Gallon (US)', qt: 'Quart (US)', pt: 'Pint (US)',
    cup: 'Cup (US)', 'fl oz': 'Fluid oz (US)', tbsp: 'Tablespoon',
    tsp: 'Teaspoon', 'in3': 'Cubic inch', 'ft3': 'Cubic foot',
    bbl: 'Oil barrel'
  };

  var opts = function (selected) {
    var html = '';
    for (var k in UNITS) html += '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' + UNIT_LABELS[k] + '</option>';
    return html;
  };

  var HTML =
    '<div class="conv-widget">' +
    '<div class="conv-row">' +
    '<div class="conv-field"><label>Value</label><input type="number" id="conv-val" value="5" step="any" min="0"></div>' +
    '<div class="conv-field"><label>From</label><select id="conv-from">' + opts('L') + '</select></div>' +
    '<div class="conv-field"><label>To</label><select id="conv-to">' + opts('gal') + '</select></div>' +
    '</div>' +
    '<div class="conv-result-box">' +
    '<div class="conv-result" id="conv-result">1.3209</div>' +
    '<div class="conv-detail" id="conv-detail">5 liters = 1.3209 gallons</div>' +
    '</div>' +
    '<button class="conv-swap" id="conv-swap">&#x21C4; Swap Units</button>' +
    '<div class="conv-table-wrap" id="conv-table-wrap"></div></div>';

  var CSS =
    '.conv-widget{display:flex;flex-direction:column;gap:14px}' +
    '.conv-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.conv-field{display:flex;flex-direction:column;gap:4px}' +
    '.conv-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.conv-field input,.conv-field select{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.conv-field input:focus,.conv-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.conv-result-box{text-align:center;padding:24px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}' +
    '.conv-result{font-size:2.2rem;font-weight:800;color:var(--primary)}' +
    '.conv-detail{font-size:.9rem;color:var(--text-secondary);margin-top:4px}' +
    '.conv-swap{padding:10px 20px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;font-weight:600;cursor:pointer;background:var(--bg);color:var(--text-secondary);align-self:center}' +
    '.conv-swap:hover{border-color:var(--primary);color:var(--primary)}' +
    '.conv-table-wrap{max-height:200px;overflow-y:auto;padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.82rem}' +
    '.conv-table-wrap table{width:100%;border-collapse:collapse}' +
    '.conv-table-wrap td{padding:4px 8px;border-bottom:1px solid var(--border)}' +
    '.conv-table-wrap td:first-child{font-weight:600}' +
    '.conv-table-wrap td:last-child{text-align:right;font-family:monospace}' +
    '@media(max-width:500px){.conv-row{grid-template-columns:1fr}}';

  function convert() {
    var val = parseFloat(w('conv-val').value) || 0;
    var from = w('conv-from').value;
    var to = w('conv-to').value;
    var liters = val * UNITS[from];
    var result = liters / UNITS[to];
    w('conv-result').textContent = result.toFixed(4);
    w('conv-detail').innerHTML = val + ' ' + UNIT_LABELS[from].toLowerCase() + ' = ' + result.toFixed(4) + ' ' + UNIT_LABELS[to].toLowerCase();
    var html = '<table>';
    var common = ['mL', 'L', 'm3', 'gal', 'qt', 'pt', 'cup', 'fl oz', 'tbsp', 'tsp'];
    for (var i = 0; i < common.length; i++) {
      if (common[i] === to) continue;
      html += '<tr><td>' + UNIT_LABELS[common[i]] + '</td><td>' + (liters / UNITS[common[i]]).toFixed(4) + '</td></tr>';
    }
    html += '</table>';
    document.getElementById('conv-table-wrap').innerHTML = html;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('conv-val').addEventListener('input', convert);
    w('conv-from').addEventListener('change', convert);
    w('conv-to').addEventListener('change', convert);
    w('conv-swap').addEventListener('click', function () { var t = w('conv-from').value; w('conv-from').value = w('conv-to').value; w('conv-to').value = t; convert(); });
    convert();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
