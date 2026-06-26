(function () {
  var w = document.getElementById.bind(document);

  var UNITS = {
    mm: 0.001, cm: 0.01, m: 1, km: 1000,
    in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
    nmi: 1852, thou: 0.0000254, fathom: 1.8288, chain: 20.1168
  };

  var UNIT_LABELS = {
    mm: 'Millimeter', cm: 'Centimeter', m: 'Meter', km: 'Kilometer',
    in: 'Inch', ft: 'Foot', yd: 'Yard', mi: 'Mile',
    nmi: 'Nautical Mile', thou: 'Thou (mil)', fathom: 'Fathom', chain: 'Chain'
  };

  var opts = function (selected) {
    var html = '';
    for (var k in UNITS) {
      html += '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' + UNIT_LABELS[k] + '</option>';
    }
    return html;
  };

  var HTML =
    '<div class="conv-widget">' +
    '<div class="conv-row">' +
    '<div class="conv-field"><label>Value</label><input type="number" id="conv-val" value="100" step="any" min="0"></div>' +
    '<div class="conv-field"><label>From</label><select id="conv-from">' + opts('m') + '</select></div>' +
    '<div class="conv-field"><label>To</label><select id="conv-to">' + opts('ft') + '</select></div>' +
    '</div>' +
    '<div class="conv-result-box">' +
    '<div class="conv-result" id="conv-result">328.084</div>' +
    '<div class="conv-detail" id="conv-detail">100 meters = 328.084 feet</div>' +
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
    '.conv-table-wrap td:first-child{font-weight:600;color:var(--text)}' +
    '.conv-table-wrap td:last-child{text-align:right;font-family:monospace}' +
    '@media(max-width:500px){.conv-row{grid-template-columns:1fr}}';

  function convert() {
    var val = parseFloat(w('conv-val').value) || 0;
    var from = w('conv-from').value;
    var to = w('conv-to').value;

    var meters = val * UNITS[from];
    var result = meters / UNITS[to];

    w('conv-result').textContent = result.toFixed(4);
    w('conv-detail').innerHTML = val + ' ' + UNIT_LABELS[from].toLowerCase() + ' = ' + result.toFixed(4) + ' ' + UNIT_LABELS[to].toLowerCase();

    // Quick reference table
    var html = '<table>';
    var common = ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'];
    for (var i = 0; i < common.length; i++) {
      var u = common[i];
      if (u === to) continue;
      var v = meters / UNITS[u];
      html += '<tr><td>' + UNIT_LABELS[u] + '</td><td>' + v.toFixed(4) + '</td></tr>';
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
    w('conv-swap').addEventListener('click', function () {
      var tmp = w('conv-from').value;
      w('conv-from').value = w('conv-to').value;
      w('conv-to').value = tmp;
      convert();
    });
    convert();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
