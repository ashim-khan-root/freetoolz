(function () {
  var w = document.getElementById.bind(document);

  var UNITS = {
    'mm2': 0.000001, 'cm2': 0.0001, 'm2': 1, 'km2': 1000000,
    'ha': 10000, 'acre': 4046.86, 'ft2': 0.092903, 'yd2': 0.836127,
    'mi2': 2589988.1, 'in2': 0.00064516, 'rood': 1011.71, 'da': 10
  };

  var UNIT_LABELS = {
    'mm2': 'Square mm', 'cm2': 'Square cm', 'm2': 'Square m', 'km2': 'Square km',
    'ha': 'Hectare', 'acre': 'Acre', 'ft2': 'Square ft', 'yd2': 'Square yd',
    'mi2': 'Square mi', 'in2': 'Square in', 'rood': 'Rood', 'da': 'Dunam'
  };

  var opts = function (selected) {
    var html = '';
    for (var k in UNITS) html += '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' + UNIT_LABELS[k] + '</option>';
    return html;
  };

  var HTML =
    '<div class="conv-widget">' +
    '<div class="conv-row">' +
    '<div class="conv-field"><label>Value</label><input type="number" id="conv-val" value="100" step="any" min="0"></div>' +
    '<div class="conv-field"><label>From</label><select id="conv-from">' + opts('m2') + '</select></div>' +
    '<div class="conv-field"><label>To</label><select id="conv-to">' + opts('ft2') + '</select></div>' +
    '</div>' +
    '<div class="conv-result-box">' +
    '<div class="conv-result" id="conv-result">1076.391</div>' +
    '<div class="conv-detail" id="conv-detail">100 m&#178; = 1076.391 ft&#178;</div>' +
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
    var sqm = val * UNITS[from];
    var result = sqm / UNITS[to];
    w('conv-result').textContent = result.toFixed(4);
    w('conv-detail').innerHTML = val + ' ' + UNIT_LABELS[from].toLowerCase() + ' = ' + result.toFixed(4) + ' ' + UNIT_LABELS[to].toLowerCase();
    var html = '<table>';
    var common = ['mm2', 'cm2', 'm2', 'km2', 'ha', 'acre', 'ft2', 'yd2', 'mi2'];
    for (var i = 0; i < common.length; i++) {
      if (common[i] === to) continue;
      html += '<tr><td>' + UNIT_LABELS[common[i]] + '</td><td>' + (sqm / UNITS[common[i]]).toFixed(4) + '</td></tr>';
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
