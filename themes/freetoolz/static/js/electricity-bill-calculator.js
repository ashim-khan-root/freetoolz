(function () {
  var w = document.getElementById.bind(document);

  var SLABS = [
    { label: 'Slab 1 (0-100 units)', from: 0, to: 100, rate: 3.5 },
    { label: 'Slab 2 (101-200 units)', from: 101, to: 200, rate: 4.5 },
    { label: 'Slab 3 (201-300 units)', from: 201, to: 300, rate: 6.0 },
    { label: 'Slab 4 (301-500 units)', from: 301, to: 500, rate: 7.5 },
    { label: 'Slab 5 (501+ units)', from: 501, to: 99999, rate: 9.0 }
  ];

  var APPLIANCES = [
    { name: 'LED Bulb (10W)', watts: 10 },
    { name: 'CFL Bulb (15W)', watts: 15 },
    { name: 'Fan (75W)', watts: 75 },
    { name: 'TV / Monitor (100W)', watts: 100 },
    { name: 'Laptop (50W)', watts: 50 },
    { name: 'Desktop PC (200W)', watts: 200 },
    { name: 'Refrigerator (150W)', watts: 150 },
    { name: 'AC 1 Ton (1500W)', watts: 1500 },
    { name: 'AC 1.5 Ton (2000W)', watts: 2000 },
    { name: 'Water Heater (2000W)', watts: 2000 },
    { name: 'Washing Machine (500W)', watts: 500 },
    { name: 'Microwave (1200W)', watts: 1200 },
    { name: 'Electric Kettle (1500W)', watts: 1500 },
    { name: 'Iron (1000W)', watts: 1000 },
    { name: 'Vacuum Cleaner (1200W)', watts: 1200 },
    { name: 'Water Pump (750W)', watts: 750 },
    { name: 'Router / Modem (10W)', watts: 10 },
    { name: 'Phone Charger (5W)', watts: 5 }
  ];

  var appHtml = '';
  for (var i = 0; i < APPLIANCES.length; i++) {
    appHtml += '<div class="eb-appliance-row" data-idx="' + i + '">' +
      '<span class="eb-app-name">' + APPLIANCES[i].name + '</span>' +
      '<input type="number" class="eb-app-qty" value="0" min="0" max="50" data-idx="' + i + '">' +
      '<input type="number" class="eb-app-hrs" value="0" min="0" max="24" step="0.5" data-idx="' + i + '">' +
      '<span class="eb-app-wh" id="eb-wh-' + i + '">0 kWh</span></div>';
  }

  var HTML =
    '<div class="eb-widget">' +
    '<div class="eb-form'>' +
    '<div class="eb-rate-grid">' +
    '<div class="eb-field"><label>Fixed Charge (&#8377;)</label><input type="number" id="eb-fixed" value="50" min="0" max="1000"></div>' +
    '<div class="eb-field"><label>Custom Rate (&#8377;/unit)</label><input type="number" id="eb-custom-rate" value="" min="0" max="50" step="0.5" placeholder="Leave blank for slabs"></div>' +
    '</div>' +
    '<div class="eb-apps-header">Add Appliances</div>' +
    '<div class="eb-apps-list" id="eb-apps-list">' +
    '<div class="eb-apps-grid-header"><span>Appliance</span><span>Qty</span><span>Hrs/Day</span><span>Energy</span></div>' +
    appHtml + '</div>' +
    '<div class="eb-manual-field"><label>Or enter kWh directly</label><input type="number" id="eb-manual-kwh" value="" min="0" max="100000" placeholder="kWh per month"></div>' +
    '</div>' +
    '<div class="eb-results-grid">' +
    '<div class="eb-rc" style="background:var(--primary);color:#fff"><span class="eb-rl" style="color:rgba(255,255,255,.7)">Total Consumption</span><span class="eb-rv" id="eb-kwh" style="color:#fff">0 kWh</span></div>' +
    '<div class="eb-rc"><span class="eb-rl">Energy Charge</span><span class="eb-rv" id="eb-energy">&#8377; 0</span></div>' +
    '<div class="eb-rc"><span class="eb-rl">Fixed Charge</span><span class="eb-rv" id="eb-fixed-display">&#8377; 0</span></div>' +
    '<div class="eb-rc"><span class="eb-rl">Total Bill</span><span class="eb-rv" id="eb-total">&#8377; 0</span></div>' +
    '</div>' +
    '<div class="eb-breakdown" id="eb-breakdown"></div>' +
    '<div class="eb-note" id="eb-note">Add appliances to estimate monthly consumption, or enter kWh directly. Slab rates are examples — adjust based on your local electricity board tariffs.</div></div>';

  var CSS =
    '.eb-widget{display:flex;flex-direction:column;gap:16px}' +
    '.eb-form{display:flex;flex-direction:column;gap:12px}' +
    '.eb-rate-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.eb-field{display:flex;flex-direction:column;gap:4px}' +
    '.eb-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.eb-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.eb-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.eb-apps-header{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.eb-apps-list{display:flex;flex-direction:column;gap:4px;max-height:400px;overflow-y:auto;padding-right:4px}' +
    '.eb-apps-grid-header{display:grid;grid-template-columns:2fr 60px 80px 80px;gap:8px;padding:8px 10px;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase}' +
    '.eb-appliance-row{display:grid;grid-template-columns:2fr 60px 80px 80px;gap:8px;padding:7px 10px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);align-items:center;font-size:.85rem}' +
    '.eb-app-name{color:var(--text)}' +
    '.eb-appliance-row input{padding:6px 8px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.82rem;width:100%;background:var(--bg);color:var(--text);outline:none}' +
    '.eb-appliance-row input:focus{border-color:var(--primary)}' +
    '.eb-app-wh{font-family:monospace;font-size:.82rem;color:var(--primary);font-weight:600}' +
    '.eb-manual-field{display:flex;flex-direction:column;gap:4px}' +
    '.eb-manual-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.eb-manual-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.eb-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.eb-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.eb-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.eb-rv{font-size:1.15rem;font-weight:800;color:var(--primary);display:block}' +
    '.eb-breakdown{padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;line-height:1.7}' +
    '.eb-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:768px){.eb-rate-grid{grid-template-columns:1fr}.eb-results-grid{grid-template-columns:1fr 1fr}.eb-apps-grid-header,.eb-appliance-row{grid-template-columns:1.5fr 50px 70px 70px;font-size:.78rem}}';

  function calc() {
    var manual = parseFloat(w('eb-manual-kwh').value);
    var fixed = parseFloat(w('eb-fixed').value) || 0;
    var customRate = parseFloat(w('eb-custom-rate').value);

    var totalWh = 0;

    if (!isNaN(manual) && manual > 0) {
      totalWh = manual * 1000;
    } else {
      for (var i = 0; i < APPLIANCES.length; i++) {
        var qty = parseFloat(document.querySelector('.eb-app-qty[data-idx="' + i + '"]').value) || 0;
        var hrs = parseFloat(document.querySelector('.eb-app-hrs[data-idx="' + i + '"]').value) || 0;
        var wh = APPLIANCES[i].watts * qty * hrs * 30;
        totalWh += wh;
        var whEl = document.getElementById('eb-wh-' + i);
        whEl.textContent = (wh / 1000).toFixed(1) + ' kWh';
      }
    }

    var kwh = totalWh / 1000;
    w('eb-kwh').textContent = kwh.toFixed(1) + ' kWh';

    var energyCharge = 0;
    if (!isNaN(customRate) && customRate > 0) {
      energyCharge = kwh * customRate;
    } else {
      var remaining = kwh;
      for (var i = 0; i < SLABS.length; i++) {
        var slabUnits = Math.min(Math.max(0, remaining), SLABS[i].to - SLABS[i].from + 1);
        energyCharge += slabUnits * SLABS[i].rate;
        remaining -= slabUnits;
        if (remaining <= 0) break;
      }
    }

    var total = energyCharge + fixed;
    w('eb-energy').innerHTML = '&#8377; ' + energyCharge.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    w('eb-fixed-display').innerHTML = '&#8377; ' + fixed.toLocaleString('en-IN', { maximumFractionDigits: 0 });
    w('eb-total').innerHTML = '&#8377; ' + total.toLocaleString('en-IN', { maximumFractionDigits: 0 });

    var bd = document.getElementById('eb-breakdown');
    if (kwh > 0 && isNaN(customRate)) {
      var lines = [];
      var rem = kwh;
      for (var i = 0; i < SLABS.length; i++) {
        var slabUnits = Math.min(Math.max(0, rem), SLABS[i].to - SLABS[i].from + 1);
        if (slabUnits > 0) {
          lines.push(SLABS[i].label + ': ' + slabUnits.toFixed(0) + ' units @ &#8377;' + SLABS[i].rate + ' = &#8377;' + (slabUnits * SLABS[i].rate).toFixed(0));
        }
        rem -= slabUnits;
        if (rem <= 0) break;
      }
      bd.innerHTML = lines.join('<br>');
    } else if (kwh > 0 && !isNaN(customRate)) {
      bd.innerHTML = kwh.toFixed(1) + ' kWh @ &#8377;' + customRate.toFixed(2) + ' = &#8377;' + energyCharge.toFixed(0) + ' (custom rate)';
    } else {
      bd.innerHTML = 'Add appliances or enter kWh manually to see the breakdown.';
    }

    var note = document.getElementById('eb-note');
    if (kwh > 0) {
      note.innerHTML = 'Estimated monthly bill: <strong>&#8377; ' + total.toLocaleString('en-IN', { maximumFractionDigits: 0 }) + '</strong> for ' + kwh.toFixed(1) + ' kWh. ' +
        (isNaN(customRate) ? 'Calculated using slab rates.' : 'Calculated using custom rate of &#8377;' + customRate.toFixed(2) + '/kWh.');
      note.style.borderLeftColor = '#22c55e';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('eb-fixed').addEventListener('input', calc);
    w('eb-custom-rate').addEventListener('input', calc);
    w('eb-manual-kwh').addEventListener('input', calc);
    document.querySelectorAll('.eb-app-qty, .eb-app-hrs').forEach(function (el) {
      el.addEventListener('input', function () { w('eb-manual-kwh').value = ''; calc(); });
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
