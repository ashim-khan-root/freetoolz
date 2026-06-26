(function () {
  var w = document.getElementById.bind(document);

  var UPS_SIZES = [
    { va: 500, label: '500 VA' },
    { va: 800, label: '800 VA' },
    { va: 1000, label: '1000 VA (1 kVA)' },
    { va: 1500, label: '1500 VA (1.5 kVA)' },
    { va: 2000, label: '2000 VA (2 kVA)' },
    { va: 3000, label: '3000 VA (3 kVA)' },
    { va: 5000, label: '5000 VA (5 kVA)' },
    { va: 10000, label: '10000 VA (10 kVA)' }
  ];

  var EFF = 0.6; // typical UPS power factor

  var HTML =
    '<div class="ups-widget">' +
    '<div class="ups-form-grid">' +
    '<div class="ups-field"><label>NVR Power (W)</label><input type="number" id="ups-nvr" value="80" min="0" max="5000" step="5"></div>' +
    '<div class="ups-field"><label>Number of Cameras</label><input type="number" id="ups-cams" value="8" min="0" max="256"></div>' +
    '<div class="ups-field"><label>Camera Power Each (W)</label><input type="number" id="ups-camw" value="7" min="0" max="100" step="0.5"></div>' +
    '<div class="ups-field"><label>PoE Switch Power (W)</label><input type="number" id="ups-switch" value="20" min="0" max="2000" step="5"></div>' +
    '</div>' +
    '<div class="ups-results-grid">' +
    '<div class="ups-rc"><span class="ups-rl">Total Load</span><span class="ups-rv" id="ups-load">0 W</span></div>' +
    '<div class="ups-rc" style="background:var(--primary);color:#fff"><span class="ups-rl" style="color:rgba(255,255,255,.7)">Recommended UPS</span><span class="ups-rv" id="ups-rec" style="color:#fff">—</span></div>' +
    '<div class="ups-rc"><span class="ups-rl">Min. UPS Rating</span><span class="ups-rv" id="ups-min">0 VA</span></div>' +
    '</div>' +
    '<div class="ups-table-wrap"><table class="ups-table"><thead><tr><th>UPS Size</th><th>Est. Runtime</th><th>Suitability</th></tr></thead><tbody id="ups-runtimes"></tbody></table></div>' +
    '<div class="ups-note" id="ups-note">Enter your equipment power to estimate UPS requirements.</div></div>';

  var CSS =
    '.ups-widget{display:flex;flex-direction:column;gap:20px}' +
    '.ups-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px}' +
    '.ups-field{display:flex;flex-direction:column;gap:4px}' +
    '.ups-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.ups-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none}' +
    '.ups-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.ups-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.ups-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.ups-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.ups-rv{font-size:1.2rem;font-weight:800;color:var(--primary);display:block}' +
    '.ups-table-wrap{overflow-x:auto}' +
    '.ups-table{width:100%;border-collapse:collapse;font-size:.9rem}' +
    '.ups-table th{background:var(--bg);color:var(--text-secondary);font-weight:600;font-size:.8rem;text-transform:uppercase;letter-spacing:.03em;padding:10px 14px;text-align:left;border-bottom:2px solid var(--border)}' +
    '.ups-table td{padding:10px 14px;border-bottom:1px solid var(--border);color:var(--text)}' +
    '.ups-table tr:last-child td{border-bottom:none}' +
    '.ups-badge{padding:2px 10px;border-radius:20px;font-size:.78rem;font-weight:600;display:inline-block}' +
    '.ups-badge-g{background:#d1fae5;color:#065f46}.ups-badge-y{background:#fef9c3;color:#92400e}.ups-badge-r{background:#fee2e2;color:#991b1b}' +
    '.ups-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:900px){.ups-form-grid{grid-template-columns:1fr 1fr}}' +
    '@media(max-width:600px){.ups-form-grid{grid-template-columns:1fr}.ups-results-grid{grid-template-columns:1fr}}';

  function calc() {
    var nvr = parseFloat(w('ups-nvr').value) || 0;
    var cams = parseFloat(w('ups-cams').value) || 0;
    var camW = parseFloat(w('ups-camw').value) || 0;
    var sw = parseFloat(w('ups-switch').value) || 0;

    var totalLoad = nvr + (cams * camW) + sw;
    var minVA = Math.ceil(totalLoad / EFF);
    var recommended = '';
    var recVA = 0;

    for (var i = 0; i < UPS_SIZES.length; i++) {
      if (UPS_SIZES[i].va >= minVA * 1.3) {
        recommended = UPS_SIZES[i].label;
        recVA = UPS_SIZES[i].va;
        break;
      }
    }
    if (!recommended) recommended = UPS_SIZES[UPS_SIZES.length - 1].label;

    w('ups-load').textContent = totalLoad.toFixed(0) + ' W';
    w('ups-rec').textContent = recommended;
    w('ups-min').textContent = minVA + ' VA';

    var tbody = document.getElementById('ups-runtimes');
    var html = '';
    for (var j = 0; j < UPS_SIZES.length; j++) {
      var u = UPS_SIZES[j];
      var availW = u.va * EFF;
      var minRuntime = totalLoad > 0 ? (availW / totalLoad) * 10 : 0; // rough estimate in minutes
      minRuntime = Math.round(minRuntime * 10) / 10;
      var badge = '';
      var suit = '';
      if (u.va < minVA) {
        badge = '<span class="ups-badge ups-badge-r">Underpowered</span>';
        suit = 'Insufficient for this load';
      } else if (u.va < minVA * 1.3) {
        badge = '<span class="ups-badge ups-badge-y">Minimal</span>';
        suit = minRuntime + ' min — no headroom';
      } else {
        badge = '<span class="ups-badge ups-badge-g">Recommended</span>';
        suit = minRuntime + ' min — with headroom';
      }
      if (u.va === recVA) suit = '<strong>' + suit + ' &#10003;</strong>';
      html += '<tr><td>' + u.label + '</td><td>' + minRuntime + ' min</td><td>' + badge + ' ' + suit + '</td></tr>';
    }
    tbody.innerHTML = html;

    var note = document.getElementById('ups-note');
    if (totalLoad <= 0) {
      note.textContent = 'Enter equipment power to estimate UPS requirements.';
      note.style.borderLeftColor = 'var(--primary)';
    } else {
      note.innerHTML = 'Total load: <strong>' + totalLoad.toFixed(0) + ' W</strong>. ' +
        'Recommended UPS: <strong>' + recommended + '</strong> or larger (at least ' + minVA + ' VA to maintain 30% headroom). Runtime is a rough estimate — actual runtime depends on battery capacity (Ah), age, and temperature.';
      note.style.borderLeftColor = '#22c55e';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.ups-field input').forEach(function (e) {
      e.addEventListener('input', calc); e.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
