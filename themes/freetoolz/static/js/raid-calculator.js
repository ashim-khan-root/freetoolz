(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="raid-widget">' +
    '<div class="raid-form">' +
    '<div class="raid-field">' +
    '<label>RAID Level</label>' +
    '<select id="raid-level">' +
    '<option value="0">RAID 0 — Striping</option>' +
    '<option value="1">RAID 1 — Mirroring</option>' +
    '<option value="5" selected>RAID 5 — Striping with Parity</option>' +
    '<option value="6">RAID 6 — Double Parity</option>' +
    '<option value="10">RAID 10 — Mirror + Stripe</option>' +
    '</select></div>' +
    '<div class="raid-field">' +
    '<label>Number of Drives</label>' +
    '<input type="number" id="raid-drives" value="4" min="1" max="64">' +
    '</div>' +
    '<div class="raid-field">' +
    '<label>Drive Capacity (TB)</label>' +
    '<input type="number" id="raid-capacity" value="4" min="0.1" max="100" step="0.5">' +
    '</div></div>' +
    '<div class="raid-results">' +
    '<div class="raid-result-card">' +
    '<span class="raid-result-label">Total Raw Capacity</span>' +
    '<span class="raid-result-value" id="raid-raw">0 TB</span></div>' +
    '<div class="raid-result-card" style="background:var(--primary);color:#fff">' +
    '<span class="raid-result-label" style="color:rgba(255,255,255,.7)">Usable Capacity</span>' +
    '<span class="raid-result-value" id="raid-usable" style="color:#fff">0 TB</span></div>' +
    '<div class="raid-result-card">' +
    '<span class="raid-result-label">Storage Efficiency</span>' +
    '<span class="raid-result-value" id="raid-efficiency">0%</span></div>' +
    '<div class="raid-result-card">' +
    '<span class="raid-result-label">Fault Tolerance</span>' +
    '<span class="raid-result-value" id="raid-fault">0 drives</span></div>' +
    '<div class="raid-result-card">' +
    '<span class="raid-result-label">Min. Drives Required</span>' +
    '<span class="raid-result-value" id="raid-min">2</span></div></div>' +
    '<div class="raid-note" id="raid-note">' +
    'With RAID 5 you get &frac34; of your total raw capacity usable with single-drive fault tolerance.' +
    '</div></div>';

  var CSS =
    '.raid-widget{display:flex;flex-direction:column;gap:20px}' +
    '.raid-form{display:flex;flex-direction:column;gap:14px}' +
    '.raid-field{display:flex;flex-direction:column;gap:4px}' +
    '.raid-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.raid-field input,.raid-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.raid-field input:focus,.raid-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.raid-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.raid-result-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.raid-result-label{display:block;font-size:.75rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.raid-result-value{font-size:1.3rem;font-weight:800;color:var(--primary)}' +
    '.raid-note{font-size:.85rem;color:var(--text-secondary);background:var(--bg);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:600px){.raid-results{grid-template-columns:1fr 1fr}}';

  function calc() {
    var level = parseInt(w('raid-level').value);
    var drives = parseInt(w('raid-drives').value) || 0;
    var cap = parseFloat(w('raid-capacity').value) || 0;
    var raw = drives * cap;
    var usable = 0, fault = 0, minDrives = 2, note = '';
    var levelName = '';

    switch (level) {
      case 0:
        levelName = 'RAID 0';
        minDrives = 2;
        usable = raw;
        fault = 0;
        note = 'RAID 0 offers maximum capacity with no redundancy. If any drive fails, all data is lost. Best for non-critical temporary data.';
        break;
      case 1:
        levelName = 'RAID 1';
        minDrives = 2;
        usable = drives >= 2 ? cap : 0;
        fault = drives >= 2 ? Math.floor(drives / 2) : 0;
        note = 'RAID 1 mirrors data across drives. You lose 50% capacity but gain full redundancy. If one drive in each pair fails, data survives.';
        break;
      case 5:
        levelName = 'RAID 5';
        minDrives = 3;
        usable = drives >= 3 ? (drives - 1) * cap : 0;
        fault = drives >= 3 ? 1 : 0;
        note = 'RAID 5 uses distributed parity — good balance of capacity and redundancy. Can survive a single drive failure. Rebuild times are long with large drives.';
        break;
      case 6:
        levelName = 'RAID 6';
        minDrives = 4;
        usable = drives >= 4 ? (drives - 2) * cap : 0;
        fault = drives >= 4 ? 2 : 0;
        note = 'RAID 6 uses double parity — can survive two simultaneous drive failures. Best for large-capacity arrays where rebuild times are long.';
        break;
      case 10:
        levelName = 'RAID 10';
        minDrives = 4;
        if (drives >= 4 && drives % 2 === 0) {
          usable = (drives / 2) * cap;
          fault = drives / 2;
        } else {
          usable = 0;
          fault = 0;
        }
        note = 'RAID 10 combines mirroring and striping. Excellent performance and redundancy but uses 50% of raw capacity for parity. Can survive one drive failure per mirror set.';
        break;
    }

    if (drives < minDrives || (level === 10 && drives % 2 !== 0)) {
      var msg = level === 10 && drives % 2 !== 0
        ? 'RAID 10 requires an even number of drives'
        : 'RAID ' + level + ' requires a minimum of ' + minDrives + ' drives';
      w('raid-raw').textContent = raw.toFixed(1) + ' TB';
      w('raid-usable').textContent = 'N/A';
      w('raid-efficiency').textContent = 'N/A';
      w('raid-fault').textContent = 'N/A';
      w('raid-min').textContent = minDrives;
      w('raid-note').textContent = msg;
      w('raid-note').style.borderLeftColor = '#ef4444';
      return;
    }

    var eff = raw > 0 ? (usable / raw * 100) : 0;
    w('raid-raw').textContent = raw.toFixed(1) + ' TB';
    w('raid-usable').textContent = usable.toFixed(1) + ' TB';
    w('raid-efficiency').textContent = eff.toFixed(0) + '%';
    w('raid-fault').textContent = fault + (fault === 1 ? ' drive' : ' drives');
    w('raid-min').textContent = minDrives;
    w('raid-note').textContent = note;
    w('raid-note').style.borderLeftColor = 'var(--primary)';
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('#raid-level, #raid-drives, #raid-capacity').forEach(function (e) {
      e.addEventListener('input', calc); e.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
