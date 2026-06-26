(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="fuel-widget">' +
    '<div class="fuel-form-grid">' +
    '<div class="fuel-field"><label>Distance (km)</label><input type="number" id="fuel-dist" value="500" min="1" max="100000" step="10"></div>' +
    '<div class="fuel-field"><label>Fuel Efficiency (km/L)</label><input type="number" id="fuel-eff" value="15" min="1" max="50" step="0.5"></div>' +
    '<div class="fuel-field"><label>Fuel Price (&#8377;/L)</label><input type="number" id="fuel-price" value="105" min="1" max="300" step="1"></div>' +
    '<div class="fuel-field"><label>Vehicle Type</label><select id="fuel-type"><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="cng">CNG</option><option value="ev">Electric (EV)</option></select></div>' +
    '</div>' +
    '<div class="fuel-results-grid">' +
    '<div class="fuel-rc" style="background:var(--primary);color:#fff"><span class="fuel-rl" style="color:rgba(255,255,255,.7)">Total Fuel Cost</span><span class="fuel-rv" id="fuel-cost" style="color:#fff">&#8377; 0</span></div>' +
    '<div class="fuel-rc"><span class="fuel-rl">Fuel Required</span><span class="fuel-rv" id="fuel-needed">0 L</span></div>' +
    '<div class="fuel-rc"><span class="fuel-rl">Cost per km</span><span class="fuel-rv" id="fuel-per-km">&#8377; 0</span></div>' +
    '<div class="fuel-rc"><span class="fuel-rl">Monthly Cost{{20 trips}}</span><span class="fuel-rv" id="fuel-monthly">&#8377; 0</span></div>' +
    '</div>' +
    '<div class="fuel-trip-inputs">' +
    '<div class="fuel-field"><label>Trips per Month</label><input type="number" id="fuel-trips" value="20" min="1" max="100"></div>' +
    '<div class="fuel-field"><label>One-Way Distance (km)</label><input type="number" id="fuel-oneway" value="25" min="1" max="500"></div>' +
    '</div>' +
    '<div class="fuel-savings" id="fuel-savings"></div>' +
    '<div class="fuel-note" id="fuel-note">Fuel costs are estimates based on entered efficiency and current fuel prices. Actual mileage varies with driving conditions, traffic, and vehicle maintenance.</div></div>';

  var CSS =
    '.fuel-widget{display:flex;flex-direction:column;gap:16px}' +
    '.fuel-form-grid,.fuel-trip-inputs{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.fuel-trip-inputs{grid-template-columns:1fr 1fr}' +
    '.fuel-field{display:flex;flex-direction:column;gap:4px}' +
    '.fuel-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.fuel-field input,.fuel-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.fuel-field input:focus,.fuel-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.fuel-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.fuel-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.fuel-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.fuel-rv{font-size:1.15rem;font-weight:800;color:var(--primary);display:block}' +
    '.fuel-savings{padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;line-height:1.7}' +
    '.fuel-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:768px){.fuel-form-grid,.fuel-trip-inputs{grid-template-columns:1fr 1fr}.fuel-results-grid{grid-template-columns:1fr 1fr}}';

  function fmtINR(n) { return '&#8377; ' + Math.round(n).toLocaleString('en-IN'); }

  var AVG_EFF = { petrol: 15, diesel: 18, cng: 22, ev: 6 };

  function calc() {
    var dist = parseFloat(w('fuel-dist').value) || 0;
    var eff = parseFloat(w('fuel-eff').value) || 1;
    var price = parseFloat(w('fuel-price').value) || 0;
    var type = w('fuel-type').value;
    var trips = parseFloat(w('fuel-trips').value) || 0;
    var oneway = parseFloat(w('fuel-oneway').value) || 0;

    var fuelNeeded = dist / eff;
    var totalCost = fuelNeeded * price;
    var costPerKm = dist > 0 ? totalCost / dist : 0;

    w('fuel-cost').innerHTML = fmtINR(totalCost);
    w('fuel-needed').textContent = fuelNeeded.toFixed(1) + ' L';
    w('fuel-per-km').innerHTML = fmtINR(costPerKm);

    var monthlyCommute = trips * oneway * 2;
    var monthlyFuel = monthlyCommute / eff;
    var monthlyCost = monthlyFuel * price;
    w('fuel-monthly').innerHTML = fmtINR(monthlyCost);

    var savings = document.getElementById('fuel-savings');
    var avgEff = AVG_EFF[type] || 15;
    if (eff < avgEff) {
      savings.innerHTML = '<strong>Fuel economy alert:</strong> Your vehicle (' + eff + ' km/L) is below average for ' + type + ' (' + avgEff + ' km/L). ' +
        'You\'re spending <span style="color:#ef4444">' + fmtINR(totalCost * (avgEff / eff - 1)) + ' more</span> per trip than average.';
    } else if (eff > avgEff) {
      var saved = totalCost * (1 - avgEff / eff);
      savings.innerHTML = '<strong>Great efficiency!</strong> Your vehicle (' + eff + ' km/L) beats the ' + type + ' average (' + avgEff + ' km/L). ' +
        'You save <span style="color:#22c55e">' + fmtINR(saved) + '</span> per trip compared to average.';
    } else {
      savings.innerHTML = 'Your vehicle&#8217;s efficiency (' + eff + ' km/L) is average for ' + type + '.';
    }

    var note = document.getElementById('fuel-note');
    if (totalCost > 0) {
      note.innerHTML = 'Trip cost: <strong>' + fmtINR(totalCost) + '</strong> for ' + dist + ' km. Monthly commute: <strong>' + fmtINR(monthlyCost) + '</strong>.';
      note.style.borderLeftColor = '#22c55e';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.fuel-field input, .fuel-field select').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
