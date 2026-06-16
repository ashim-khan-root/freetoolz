(function () {
  var w = document.getElementById.bind(document);

  var UNITS = [
    { id: 'bps', label: 'bit/s (bps)', toBase: 1 },
    { id: 'kbps', label: 'Kilobit/s (Kbps)', toBase: 1000 },
    { id: 'mbps', label: 'Megabit/s (Mbps)', toBase: 1000000 },
    { id: 'gbps', label: 'Gigabit/s (Gbps)', toBase: 1000000000 },
    { id: 'tbps', label: 'Terabit/s (Tbps)', toBase: 1000000000000 },
    { id: 'Bs', label: 'Byte/s (B/s)', toBase: 8 },
    { id: 'kBs', label: 'Kilobyte/s (KB/s)', toBase: 8000 },
    { id: 'MBs', label: 'Megabyte/s (MB/s)', toBase: 8000000 },
    { id: 'GBs', label: 'Gigabyte/s (GB/s)', toBase: 8000000000 },
    { id: 'TBs', label: 'Terabyte/s (TB/s)', toBase: 8000000000000 }
  ];

  var HTML =
    '<div class="bc-widget">' +
    '<div class="bc-input-row">' +
    '<div class="bc-field-horiz">' +
    '<input type="number" id="bc-value" value="100" min="0" step="any" class="bc-num-input">' +
    '<select id="bc-from" class="bc-select">' +
    UNITS.map(function (u) { return '<option value="' + u.id + '"' + (u.id === 'mbps' ? ' selected' : '') + '>' + u.label + '</option>'; }).join('') +
    '</select></div>' +
    '</div>' +
    '<div class="bc-table-wrap"><table class="bc-table">' +
    '<thead><tr><th>Unit</th><th>Value</th><th>Action</th></tr></thead><tbody id="bc-results"></tbody></table></div></div>';

  var CSS =
    '.bc-widget{display:flex;flex-direction:column;gap:20px}' +
    '.bc-input-row{max-width:500px}' +
    '.bc-field-horiz{display:flex;gap:10px}' +
    '.bc-num-input{flex:1;padding:14px 16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1.1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.bc-num-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.bc-select{padding:14px 16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none}' +
    '.bc-table-wrap{overflow-x:auto}' +
    '.bc-table{width:100%;border-collapse:collapse;font-size:.9rem}' +
    '.bc-table th{background:var(--bg);color:var(--text-secondary);font-weight:600;font-size:.8rem;text-transform:uppercase;letter-spacing:.03em;padding:12px 16px;text-align:left;border-bottom:2px solid var(--border)}' +
    '.bc-table td{padding:12px 16px;border-bottom:1px solid var(--border);color:var(--text)}' +
    '.bc-table tr:last-child td{border-bottom:none}' +
    '.bc-table tr:hover td{background:var(--primary-glow)}' +
    '.bc-copy-btn{padding:4px 14px;border:1px solid var(--primary);color:var(--primary);border-radius:var(--radius-sm);font-size:.78rem;font-weight:600;cursor:pointer;background:transparent;transition:var(--transition)}' +
    '.bc-copy-btn:hover{background:var(--primary);color:#fff}' +
    '.bc-highlight{font-weight:700;color:var(--primary)}' +
    '@media(max-width:480px){.bc-field-horiz{flex-direction:column}}';

  function convert() {
    var val = parseFloat(w('bc-value').value) || 0;
    var fromId = w('bc-from').value;

    var fromUnit = null;
    for (var i = 0; i < UNITS.length; i++) {
      if (UNITS[i].id === fromId) { fromUnit = UNITS[i]; break; }
    }
    if (!fromUnit) return;

    var bits = val * fromUnit.toBase;
    var tbody = document.getElementById('bc-results');

    var html = '';
    for (var j = 0; j < UNITS.length; j++) {
      var u = UNITS[j];
      var converted = bits / u.toBase;
      var formatted = converted >= 0.0001 && converted < 1000000
        ? converted.toFixed(4).replace(/\.?0+$/, '')
        : converted.toExponential(4);
      var isOriginal = u.id === fromId;
      html += '<tr' + (isOriginal ? ' style="background:var(--primary-glow)"' : '') + '>' +
        '<td' + (isOriginal ? ' class="bc-highlight"' : '') + '>' + u.label + '</td>' +
        '<td' + (isOriginal ? ' class="bc-highlight"' : '') + '>' + formatted + '</td>' +
        '<td><button class="bc-copy-btn" data-val="' + formatted + '" onclick="navigator.clipboard.writeText(\'' + formatted + '\');this.textContent=\'Copied!\';var t=this;setTimeout(function(){t.textContent=\'Copy\'},1500)">Copy</button></td>' +
        '</tr>';
    }
    tbody.innerHTML = html;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('bc-value').addEventListener('input', convert);
    w('bc-from').addEventListener('change', convert);
    convert();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
