(function () {
  var w = document.getElementById.bind(document);

  var UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  // Binary (1024) and Decimal (1000)
  var BASE = { binary: 1024, decimal: 1000 };

  var UNIT_LABELS = {
    B: 'Byte', KB: 'Kilobyte', MB: 'Megabyte', GB: 'Gigabyte',
    TB: 'Terabyte', PB: 'Petabyte', EB: 'Exabyte', ZB: 'Zettabyte', YB: 'Yottabyte'
  };

  var opts = function (selected) {
    var html = '';
    for (var i = 0; i < UNITS.length; i++) {
      html += '<option value="' + UNITS[i] + '"' + (UNITS[i] === selected ? ' selected' : '') + '>' + UNIT_LABELS[UNITS[i]] + '</option>';
    }
    return html;
  };

  var HTML =
    '<div class="conv-widget">' +
    '<div class="conv-type"><label><input type="radio" name="ds-type" value="decimal" checked> Decimal (1000)</label><label><input type="radio" name="ds-type" value="binary"> Binary (1024)</label></div>' +
    '<div class="conv-row">' +
    '<div class="conv-field"><label>Value</label><input type="number" id="conv-val" value="10" step="any" min="0"></div>' +
    '<div class="conv-field"><label>From</label><select id="conv-from">' + opts('GB') + '</select></div>' +
    '<div class="conv-field"><label>To</label><select id="conv-to">' + opts('MB') + '</select></div>' +
    '</div>' +
    '<div class="conv-result-box">' +
    '<div class="conv-result" id="conv-result">10000</div>' +
    '<div class="conv-detail" id="conv-detail">10 GB = 10000 MB (decimal)</div>' +
    '</div>' +
    '<button class="conv-swap" id="conv-swap">&#x21C4; Swap Units</button>' +
    '<div class="conv-table-wrap" id="conv-table-wrap"></div></div>';

  var CSS =
    '.conv-widget{display:flex;flex-direction:column;gap:14px}' +
    '.conv-type{display:flex;gap:20px;padding:12px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.conv-type label{display:flex;align-items:center;gap:6px;font-size:.9rem;font-weight:600;cursor:pointer}' +
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

  function getBase() {
    return document.querySelector('input[name="ds-type"]:checked').value === 'binary' ? 1024 : 1000;
  }

  function toBytes(val, unit, base) {
    var idx = UNITS.indexOf(unit);
    for (var i = 0; i < idx; i++) val *= base;
    return val;
  }

  function fromBytes(bytes, unit, base) {
    var idx = UNITS.indexOf(unit);
    for (var i = 0; i < idx; i++) bytes /= base;
    return bytes;
  }

  function convert() {
    var val = parseFloat(w('conv-val').value) || 0;
    var from = w('conv-from').value;
    var to = w('conv-to').value;
    var base = getBase();

    var bytes = toBytes(val, from, base);
    var result = fromBytes(bytes, to, base);

    var modeLabel = base === 1024 ? 'binary' : 'decimal';
    w('conv-result').textContent = result.toFixed(4);
    w('conv-detail').innerHTML = val + ' ' + UNIT_LABELS[from] + ' = ' + result.toFixed(4) + ' ' + UNIT_LABELS[to] + ' (' + modeLabel + ')';

    var html = '<table>';
    for (var i = 0; i < UNITS.length; i++) {
      if (UNITS[i] === to) continue;
      var v = fromBytes(bytes, UNITS[i], base);
      html += '<tr><td>' + UNIT_LABELS[UNITS[i]] + '</td><td>' + v.toFixed(4) + '</td></tr>';
    }
    html += '</table>';
    document.getElementById('conv-table-wrap').innerHTML = html;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    document.querySelectorAll('input[name="ds-type"]').forEach(function (el) {
      el.addEventListener('change', convert);
    });
    w('conv-val').addEventListener('input', convert);
    w('conv-from').addEventListener('change', convert);
    w('conv-to').addEventListener('change', convert);
    w('conv-swap').addEventListener('click', function () { var t = w('conv-from').value; w('conv-from').value = w('conv-to').value; w('conv-to').value = t; convert(); });
    convert();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
