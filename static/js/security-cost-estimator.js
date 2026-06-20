(function () {
  var w = document.getElementById.bind(document);

  var PRICES = {
    camera: { '2': { bullet: 45, dome: 50, turret: 55, ptz: 180 }, '4': { bullet: 65, dome: 70, turret: 75, ptz: 250 }, '5': { bullet: 85, dome: 90, turret: 95, ptz: 320 }, '8': { bullet: 120, dome: 130, turret: 140, ptz: 450 }, '12': { bullet: 180, dome: 195, turret: 210, ptz: 600 } },
    nvr: { '4': 120, '8': 180, '16': 280, '32': 450, '64': 700 },
    hdd: { 1000: 45, 2000: 55, 4000: 80, 6000: 110, 8000: 140, 10000: 170, 12000: 200, 16000: 260 },
    poe_switch: { '4': 35, '8': 55, '16': 120, '24': 200, '48': 400 },
    ups: { 600: 65, 1000: 110, 1500: 180, 2000: 250 },
    cable_per_m: 0.8,
    connector: 1.5,
    install_per_cam: 35
  };

  var RES_NAMES = { '2': '2MP (1080p)', '4': '4MP (2K)', '5': '5MP', '8': '8MP (4K)', '12': '12MP' };
  var CAM_TYPES = ['bullet', 'dome', 'turret', 'ptz'];

  var BITRATES = { '2': 4, '4': 8, '5': 10, '8': 16, '12': 24 };

  function nearest(arr, val) { return arr.reduce(function(p, c) { return Math.abs(c - val) < Math.abs(p - val) ? c : p; }); }

  function calcStorage(cameras, mp, fps, hours, days) {
    var bitrate = BITRATES[mp] * (fps / 15) * 0.7;
    var gbPerDay = (bitrate / 8) * 3600 * hours * cameras / 1024;
    return { bitrate: bitrate, daily: gbPerDay, total: gbPerDay * days };
  }

  function nearestHDD(gb) {
    var sizes = [1000, 2000, 4000, 6000, 8000, 10000, 12000, 16000];
    return sizes.reduce(function(p, c) { return Math.abs(c - gb) < Math.abs(p - gb) ? c : p; });
  }

  var HTML =
    '<div class="sec-widget">' +
    '<div class="sec-section"><h3 class="sec-section-title">Camera Configuration</h3><div class="sec-grid">' +
    '<div class="sec-field"><label>Number of Cameras</label><input type="number" id="sec-cameras" value="8" min="1" max="256"></div>' +
    '<div class="sec-field"><label>Resolution</label><select id="sec-resolution"><option value="2">2MP (1080p)</option><option value="4" selected>4MP (2K)</option><option value="5">5MP</option><option value="8">8MP (4K)</option><option value="12">12MP</option></select></div>' +
    '<div class="sec-field"><label>Camera Type</label><select id="sec-type"><option value="bullet">Bullet</option><option value="dome">Dome</option><option value="turret" selected>Turret</option><option value="ptz">PTZ</option></select></div>' +
    '<div class="sec-field"><label>Frame Rate (FPS)</label><select id="sec-fps"><option value="10">10 fps</option><option value="15" selected>15 fps</option><option value="25">25 fps</option><option value="30">30 fps</option></select></div>' +
    '</div></div>' +
    '<div class="sec-section"><h3 class="sec-section-title">Recording & Storage</h3><div class="sec-grid">' +
    '<div class="sec-field"><label>Recording Hours/Day</label><input type="number" id="sec-hours" value="24" min="1" max="24"></div>' +
    '<div class="sec-field"><label>Retention (Days)</label><input type="number" id="sec-days" value="30" min="1" max="365"></div>' +
    '<div class="sec-field"><label>Recording Mode</label><select id="sec-mode"><option value="continuous" selected>24/7 Continuous</option><option value="motion">Motion Only</option></select></div>' +
    '</div></div>' +
    '<div class="sec-section"><h3 class="sec-section-title">Infrastructure</h3><div class="sec-grid">' +
    '<div class="sec-field"><label>Cable Length (m per cam)</label><input type="number" id="sec-cable" value="25" min="5" max="300"></div>' +
    '<div class="sec-field"><label>UPS Backup</label><select id="sec-ups"><option value="none">No UPS</option><option value="600">600 VA (Basic)</option><option value="1000" selected>1000 VA (Recommended)</option><option value="1500">1500 VA</option><option value="2000">2000 VA</option></select></div>' +
    '<div class="sec-field"><label>Installation</label><select id="sec-install"><option value="self">Self Install</option><option value="professional" selected>Professional Install</option></select></div>' +
    '</div></div>' +
    '<div class="sec-section"><h3 class="sec-section-title">Options</h3><div class="sec-grid">' +
    '<div class="sec-field sec-checkbox-field"><label class="sec-checkbox"><input type="checkbox" id="sec-moi"> <span>MOI Compliance (120-day storage, RAID 5, UPS)</span></label></div>' +
    '<div class="sec-field sec-checkbox-field"><label class="sec-checkbox"><input type="checkbox" id="sec-ptz-count"> <span>Include PTZ camera (replaces 1 bullet)</span></label></div>' +
    '</div></div>' +
    '<button class="sec-btn" id="sec-calc">Calculate Cost Estimate</button>' +
    '<div class="sec-results" id="sec-results" style="display:none">' +
    '<h3 class="sec-section-title">Cost Breakdown</h3>' +
    '<table class="sec-table"><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead><tbody id="sec-body"></tbody></table>' +
    '<div class="sec-total" id="sec-total"></div>' +
    '<div class="sec-note" id="sec-note"></div>' +
    '</div></div>';

  var CSS =
    '.sec-widget{display:flex;flex-direction:column;gap:20px;font-family:Inter,system-ui,sans-serif}' +
    '.sec-section{border:1px solid var(--border);border-radius:var(--radius);padding:16px;background:var(--bg)}' +
    '.sec-section-title{font-size:.95rem;font-weight:700;margin:0 0 12px 0;color:var(--text)}' +
    '.sec-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.sec-field{display:flex;flex-direction:column;gap:4px}' +
    '.sec-field>label{font-size:.8rem;font-weight:600;color:var(--text-secondary)}' +
    '.sec-field input,.sec-field select{padding:9px 11px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none}' +
    '.sec-field input:focus,.sec-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.sec-checkbox-field{grid-column:span 2}' +
    '.sec-checkbox{display:flex;align-items:center;gap:8px;font-size:.9rem;color:var(--text);cursor:pointer;padding:8px 0}' +
    '.sec-checkbox input{width:18px;height:18px;accent-color:var(--primary)}' +
    '.sec-btn{background:var(--primary);color:#fff;border:none;padding:14px 28px;border-radius:var(--radius);font-size:1rem;font-weight:700;cursor:pointer;transition:opacity .2s;align-self:flex-start}' +
    '.sec-btn:hover{opacity:.9}' +
    '.sec-results{border:2px solid var(--primary);border-radius:var(--radius);padding:20px;background:var(--bg)}' +
    '.sec-table{width:100%;border-collapse:collapse;font-size:.88rem}' +
    '.sec-table th{text-align:left;padding:8px 10px;border-bottom:2px solid var(--border);font-weight:700;color:var(--text-secondary);font-size:.78rem;text-transform:uppercase}' +
    '.sec-table td{padding:8px 10px;border-bottom:1px solid var(--border);color:var(--text)}' +
    '.sec-table tr:last-child td{border-bottom:none}' +
    '.sec-table .sec-ttl{font-weight:700;color:var(--primary)}' +
    '.sec-total{text-align:right;padding:16px 10px 0;font-size:1.3rem;font-weight:800;color:var(--primary);border-top:2px solid var(--border);margin-top:8px}' +
    '.sec-note{font-size:.8rem;color:var(--text-tertiary);padding:8px 10px 0;line-height:1.5}' +
    '@media(max-width:768px){.sec-grid{grid-template-columns:1fr 1fr}.sec-checkbox-field{grid-column:span 1}}' +
    '@media(max-width:480px){.sec-grid{grid-template-columns:1fr}}';

  function formatCurrency(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  function calculate() {
    var cameras = parseInt(w('sec-cameras').value) || 8;
    var mp = w('sec-resolution').value;
    var type = w('sec-type').value;
    var fps = parseInt(w('sec-fps').value) || 15;
    var hours = parseInt(w('sec-hours').value) || 24;
    var days = parseInt(w('sec-days').value) || 30;
    var mode = w('sec-mode').value;
    var cableLen = parseInt(w('sec-cable').value) || 25;
    var ups = w('sec-ups').value;
    var install = w('sec-install').value;
    var moi = w('sec-moi').checked;
    var hasPtz = w('sec-ptz-count').checked;

    var recordingFactor = mode === 'motion' ? 0.4 : 1;
    var effectiveDays = moi ? Math.max(days, 120) : days;
    var adjHours = moi ? 24 : hours;

    var storage = calcStorage(cameras, mp, fps, adjHours, effectiveDays);
    storage.daily *= recordingFactor;
    storage.total *= recordingFactor;

    var rows = [];
    var camPrice = PRICES.camera[mp][type];
    var camCount = cameras;
    var ptzCount = hasPtz ? 1 : 0;
    var regCams = camCount - ptzCount;

    var ptzPrice = PRICES.camera[mp]['ptz'];

    if (ptzCount > 0 && regCams > 0) {
      rows.push({ item: RES_NAMES[mp] + ' ' + type.charAt(0).toUpperCase() + type.slice(1) + ' Camera', qty: regCams, unit: formatCurrency(camPrice), total: camPrice * regCams });
      rows.push({ item: 'PTZ Camera (' + RES_NAMES[mp] + ')', qty: ptzCount, unit: formatCurrency(ptzPrice), total: ptzPrice * ptzCount });
    } else {
      rows.push({ item: RES_NAMES[mp] + ' ' + type.charAt(0).toUpperCase() + type.slice(1) + ' Camera', qty: camCount, unit: formatCurrency(camPrice), total: camPrice * camCount });
    }

    var nvrChannels = [4, 8, 16, 32, 64].filter(function(c) { return c >= camCount; })[0] || 64;
    var nvrPrice = PRICES.nvr[nvrChannels];
    rows.push({ item: nvrChannels + '-Channel NVR', qty: 1, unit: formatCurrency(nvrPrice), total: nvrPrice });

    var hddGB = nearestHDD(storage.total * 1.15);
    if (moi) {
      var drives = Math.ceil(hddGB / 4000);
      var raidDrives = drives < 3 ? 3 : drives;
      rows.push({ item: 'WD Purple ' + (hddGB / drives / 1000).toFixed(0) + 'TB HDD (RAID ' + (raidDrives >= 4 ? '5' : '5') + ')', qty: raidDrives, unit: formatCurrency(PRICES.hdd[hddGB / drives > 4000 ? 6000 : 4000] || 80), total: (PRICES.hdd[hddGB / drives > 4000 ? 6000 : 4000] || 80) * raidDrives });
    } else {
      var singleHDD = hddGB > 6000 ? Math.ceil(hddGB / 6000) : 1;
      var hddSize = hddGB > 6000 ? 6000 : hddGB;
      rows.push({ item: (singleHDD > 1 ? (hddSize / 1000 * singleHDD).toFixed(0) : (hddSize / 1000).toFixed(0)) + 'TB Surveillance HDD', qty: singleHDD, unit: formatCurrency(PRICES.hdd[hddSize] || 80), total: (PRICES.hdd[hddSize] || 80) * singleHDD });
    }

    var poeChannels = [4, 8, 16, 24, 48].filter(function(c) { return c >= camCount; })[0] || 48;
    var poePrice = PRICES.poe_switch[poeChannels];
    rows.push({ item: poeChannels + '-Port PoE+ Switch', qty: 1, unit: formatCurrency(poePrice), total: poePrice });

    if (ups !== 'none') {
      var upsPrice = PRICES.ups[ups] || 110;
      rows.push({ item: ups + ' VA UPS Backup', qty: 1, unit: formatCurrency(upsPrice), total: upsPrice });
    }

    var totalCable = camCount * cableLen;
    var cableCost = totalCable * PRICES.cable_per_m;
    rows.push({ item: 'CAT6 Cable (' + cableLen + 'm each)', qty: camCount, unit: cableLen + 'm', total: cableCost });

    var connCost = camCount * 2 * PRICES.connector;
    rows.push({ item: 'RJ45 Connectors', qty: camCount * 2, unit: formatCurrency(PRICES.connector), total: connCost });

    if (install === 'professional') {
      var installCost = camCount * PRICES.install_per_cam;
      rows.push({ item: 'Professional Installation', qty: camCount, unit: formatCurrency(PRICES.install_per_cam), total: installCost });
    }

    var grandTotal = rows.reduce(function(s, r) { return s + r.total; }, 0);

    var tbody = '';
    rows.forEach(function(r) {
      tbody += '<tr><td>' + r.item + '</td><td>' + r.qty + '</td><td>' + r.unit + '</td><td class="sec-ttl">' + formatCurrency(r.total) + '</td></tr>';
    });
    w('sec-body').innerHTML = tbody;
    w('sec-total').innerHTML = 'Estimated Total: ' + formatCurrency(grandTotal);

    var note = 'Estimated pricing based on current market rates. Actual costs may vary by region, brand, and vendor. ';
    if (moi) note += 'MOI-compliant configuration includes 120-day storage, RAID 5, and UPS backup. ';
    note += 'Prices do not include taxes, permits, or structural modifications.';
    w('sec-note').textContent = note;

    var res = w('sec-results');
    res.style.display = 'block';
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var container = w('tool-widget');
  if (container) {
    container.innerHTML = HTML;
    w('sec-calc').addEventListener('click', calculate);
  }
})();
