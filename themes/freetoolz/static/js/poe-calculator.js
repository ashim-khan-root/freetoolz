(function () {
  var w = document.getElementById.bind(document);

  var POE_CLASSES = [
    { value: '1', label: 'Class 1 — 4W (Device 3.84W)', pse: 4, pd: 3.84 },
    { value: '2', label: 'Class 2 — 7W (Device 6.49W)', pse: 7, pd: 6.49 },
    { value: '3', label: 'Class 3 — 15.4W (Device 12.95W)', pse: 15.4, pd: 12.95 },
    { value: '4', label: 'Class 4 PoE+ — 30W (Device 25.5W)', pse: 30, pd: 25.5 }
  ];

  var HTML_TABLE =
    '<div class="poe-widget">' +
    '<div class="poe-form-grid">' +
    '<div class="poe-field"><label>PoE Switch Budget (W)</label><input type="number" id="poe-budget" value="150" min="0" max="2000" step="10"></div>' +
    '<div class="poe-field"><label>Cable Length (m)</label><input type="number" id="poe-cable" value="50" min="1" max="300" step="5"></div>' +
    '</div>' +
    '<div class="poe-add-row">' +
    '<button class="poe-btn" id="poe-add-btn">+ Add Device</button>' +
    '</div>' +
    '<div class="poe-devices" id="poe-devices"></div>' +
    '<div class="poe-results-grid">' +
    '<div class="poe-rc"><span class="poe-rl">Total Power Draw</span><span class="poe-rv" id="poe-total">0 W</span></div>' +
    '<div class="poe-rc" style="background:var(--primary);color:#fff"><span class="poe-rl" style="color:rgba(255,255,255,.7)">Remaining Budget</span><span class="poe-rv" id="poe-remaining" style="color:#fff">0 W</span></div>' +
    '<div class="poe-rc"><span class="poe-rl">Utilization</span><span class="poe-rv" id="poe-util">0%</span></div>' +
    '<div class="poe-rc"><span class="poe-rl">Cable Loss Est.</span><span class="poe-rv" id="poe-loss">0 W</span></div>' +
    '</div>' +
    '<div class="poe-note" id="poe-note">Add devices above to calculate your PoE power budget.</div></div>';

  var CSS =
    '.poe-widget{display:flex;flex-direction:column;gap:16px}' +
    '.poe-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}' +
    '.poe-field{display:flex;flex-direction:column;gap:4px}' +
    '.poe-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.poe-field input,.poe-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none}' +
    '.poe-field input:focus,.poe-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.poe-add-row{display:flex;gap:10px;align-items:center}' +
    '.poe-btn{padding:8px 20px;border:none;border-radius:var(--radius-sm);font-size:.88rem;font-weight:600;cursor:pointer;transition:var(--transition);background:var(--primary);color:#fff}' +
    '.poe-btn:hover{background:var(--primary-dark)}' +
    '.poe-btn-del{background:#ef4444;color:#fff;padding:6px 14px;border:none;border-radius:var(--radius-sm);font-size:.8rem;font-weight:600;cursor:pointer}' +
    '.poe-btn-del:hover{background:#dc2626}' +
    '.poe-device-row{display:grid;grid-template-columns:2fr 1fr 1.5fr 1fr auto;gap:8px;align-items:end;margin-bottom:8px;padding:10px 14px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border)}' +
    '.poe-device-row .poe-field{margin:0}' +
    '.poe-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-top:8px}' +
    '.poe-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.poe-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.poe-rv{font-size:1.2rem;font-weight:800;color:var(--primary);display:block}' +
    '.poe-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5;margin-top:4px}' +
    '@media(max-width:768px){.poe-form-grid{grid-template-columns:1fr}.poe-results-grid{grid-template-columns:1fr 1fr}.poe-device-row{grid-template-columns:1fr 1fr;gap:6px}}';

  var deviceCount = 0;

  function addDevice(type, qty, cls) {
    deviceCount++;
    var id = 'poe-d' + deviceCount;
    var container = document.getElementById('poe-devices');
    var row = document.createElement('div');
    row.className = 'poe-device-row';
    row.id = id + '-row';

    var clsOpts = '';
    for (var i = 0; i < POE_CLASSES.length; i++) {
      var c = POE_CLASSES[i];
      clsOpts += '<option value="' + c.value + '"' + (c.value === cls ? ' selected' : '') + '>' + c.label + '</option>';
    }

    row.innerHTML =
      '<div class="poe-field"><label>Device Type</label><input type="text" id="' + id + '-type" value="' + type + '" placeholder="e.g. Camera"></div>' +
      '<div class="poe-field"><label>Qty</label><input type="number" id="' + id + '-qty" value="' + qty + '" min="1" max="256"></div>' +
      '<div class="poe-field"><label>PoE Class</label><select id="' + id + '-class">' + clsOpts + '</select></div>' +
      '<div class="poe-field"><label>Total Power</label><span style="padding:10px 0;font-weight:700;color:var(--primary);font-size:1.05rem" id="' + id + '-power">0 W</span></div>' +
      '<button class="poe-btn-del" id="' + id + '-del">&times;</button>';

    container.appendChild(row);

    document.getElementById(id + '-del').addEventListener('click', function () {
      row.remove();
      calc();
    });

    row.querySelectorAll('input, select').forEach(function (el) {
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });
    calc();
  }

  function calc() {
    var rows = document.querySelectorAll('.poe-device-row');
    var totalPower = 0;
    var cableLen = parseFloat(w('poe-cable').value) || 0;
    var budget = parseFloat(w('poe-budget').value) || 0;

    rows.forEach(function (row) {
      var inputs = row.querySelectorAll('input, select');
      var qty = parseFloat(inputs[1].value) || 0;
      var clsVal = inputs[2].value;
      var clsData = null;
      for (var i = 0; i < POE_CLASSES.length; i++) {
        if (POE_CLASSES[i].value === clsVal) { clsData = POE_CLASSES[i]; break; }
      }
      var power = qty * (clsData ? clsData.pd : 0);
      var powerEl = row.querySelector('[id$="-power"]');
      if (powerEl) powerEl.textContent = power.toFixed(1) + ' W';
      totalPower += power;
    });

    var cableLoss = cableLen > 0 ? totalPower * 0.005 * (cableLen / 50) : 0;
    var totalWithLoss = totalPower + cableLoss;
    var remaining = budget - totalWithLoss;
    var util = budget > 0 ? (totalWithLoss / budget * 100) : 0;

    w('poe-total').textContent = totalWithLoss.toFixed(1) + ' W';
    w('poe-remaining').textContent = remaining.toFixed(1) + ' W';
    w('poe-util').textContent = Math.min(100, util).toFixed(0) + '%';
    w('poe-loss').textContent = cableLoss.toFixed(1) + ' W';

    var note = document.getElementById('poe-note');
    if (rows.length === 0) {
      note.textContent = 'Add devices above to calculate your PoE power budget.';
      note.style.borderLeftColor = 'var(--primary)';
    } else if (remaining < 0) {
      note.innerHTML = '&#9888; Power budget EXCEEDED by ' + Math.abs(remaining).toFixed(1) + ' W. Upgrade to a higher-capacity PoE switch or reduce devices.';
      note.style.borderLeftColor = '#ef4444';
    } else if (remaining < budget * 0.2) {
      note.innerHTML = '&#9888; Only ' + remaining.toFixed(1) + ' W remaining (' + util.toFixed(0) + '% utilized). Consider a larger switch for headroom.';
      note.style.borderLeftColor = '#eab308';
    } else {
      note.innerHTML = 'Power budget is healthy. ' + remaining.toFixed(1) + ' W remaining (' + (100 - util).toFixed(0) + '% headroom). Cable loss is a linear estimate; actual loss depends on cable gauge (Cat5e vs Cat6) and quality.';
      note.style.borderLeftColor = '#22c55e';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML_TABLE;
    document.getElementById('poe-add-btn').addEventListener('click', function () { addDevice('Camera', 4, '2'); });
    w('poe-budget').addEventListener('input', calc);
    w('poe-cable').addEventListener('input', calc);
    addDevice('IP Camera', 8, '2');
    addDevice('Access Point', 2, '3');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
