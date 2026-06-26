(function () {
  var w = document.getElementById.bind(document);

  var ZONES = [
    { name: 'UTC', offset: 0, cities: 'Reykjavik, Accra' },
    { name: 'Europe/London', offset: 1, cities: 'London, Dublin, Lisbon' },
    { name: 'Europe/Paris', offset: 2, cities: 'Paris, Berlin, Rome, Madrid' },
    { name: 'Europe/Helsinki', offset: 3, cities: 'Helsinki, Athens, Istanbul' },
    { name: 'Asia/Dubai', offset: 4, cities: 'Dubai, Abu Dhabi, Muscat' },
    { name: 'Asia/Karachi', offset: 5, cities: 'Karachi, Lahore, Islamabad' },
    { name: 'Asia/Kolkata', offset: 5.5, cities: 'Mumbai, Delhi, Bangalore' },
    { name: 'Asia/Dhaka', offset: 6, cities: 'Dhaka, Chittagong' },
    { name: 'Asia/Bangkok', offset: 7, cities: 'Bangkok, Jakarta, Hanoi' },
    { name: 'Asia/Shanghai', offset: 8, cities: 'Beijing, Shanghai, Singapore, Kuala Lumpur' },
    { name: 'Asia/Tokyo', offset: 9, cities: 'Tokyo, Seoul, Osaka' },
    { name: 'Australia/Sydney', offset: 10, cities: 'Sydney, Melbourne, Brisbane' },
    { name: 'Pacific/Auckland', offset: 12, cities: 'Auckland, Wellington' },
    { name: 'Pacific/Honolulu', offset: -10, cities: 'Honolulu' },
    { name: 'America/Anchorage', offset: -9, cities: 'Anchorage' },
    { name: 'America/Los_Angeles', offset: -8, cities: 'Los Angeles, San Francisco, Vancouver' },
    { name: 'America/Denver', offset: -7, cities: 'Denver, Salt Lake City' },
    { name: 'America/Chicago', offset: -6, cities: 'Chicago, Dallas, Mexico City' },
    { name: 'America/New_York', offset: -5, cities: 'New York, Toronto, Miami, Atlanta' },
    { name: 'America/Sao_Paulo', offset: -3, cities: 'Sao Paulo, Rio de Janeiro, Buenos Aires' }
  ];

  var HTML =
    '<div class="tz-widget">' +
    '<div class="tz-form">' +
    '<div class="tz-field"><label>From Timezone</label><select id="tz-from">' +
    ZONES.map(function (z) { return '<option value="' + z.offset + '"' + (z.name === 'Asia/Dubai' ? ' selected' : '') + '>UTC' + (z.offset >= 0 ? '+' : '') + z.offset + ' — ' + z.name.split('/')[1] + '</option>'; }).join('') +
    '</select></div>' +
    '<div class="tz-field"><label>Time</label><input type="time" id="tz-time" value="14:00"></div>' +
    '<div class="tz-field tz-swap-field"><label>&nbsp;</label><button id="tz-swap" class="tz-swap-btn">&#x21C4; Swap</button></div>' +
    '<div class="tz-field"><label>To Timezone</label><select id="tz-to">' +
    ZONES.map(function (z) { return '<option value="' + z.offset + '"' + (z.name === 'America/New_York' ? ' selected' : '') + '>UTC' + (z.offset >= 0 ? '+' : '') + z.offset + ' — ' + z.name.split('/')[1] + '</option>'; }).join('') +
    '</select></div>' +
    '</div>' +
    '<div class="tz-result" id="tz-result">' +
    '<div class="tz-result-box">' +
    '<span class="tz-rl" id="tz-from-label">UTC+4</span>' +
    '<span class="tz-rt" id="tz-from-time">14:00</span>' +
    '<span class="tz-rc" id="tz-from-city">Dubai</span>' +
    '</div>' +
    '<div class="tz-arrow">&#x27A1;</div>' +
    '<div class="tz-result-box tz-result-box-to">' +
    '<span class="tz-rl" id="tz-to-label">UTC-5</span>' +
    '<span class="tz-rt" id="tz-to-time">05:00</span>' +
    '<span class="tz-rc" id="tz-to-city">New York</span>' +
    '</div>' +
    '</div>' +
    '<div class="tz-city-ref"><strong>Local time in major cities:</strong><div id="tz-world-clocks"></div></div></div>';

  var CSS =
    '.tz-widget{display:flex;flex-direction:column;gap:20px}' +
    '.tz-form{display:grid;grid-template-columns:1fr 1fr auto 1fr;gap:12px;align-items:end}' +
    '.tz-field{display:flex;flex-direction:column;gap:4px}' +
    '.tz-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.tz-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none}' +
    '.tz-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.tz-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.tz-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.tz-swap-btn{padding:10px 18px;border:none;border-radius:var(--radius-sm);font-size:1.1rem;cursor:pointer;background:var(--bg);border:1px solid var(--border);color:var(--text);transition:var(--transition)}' +
    '.tz-swap-btn:hover{background:var(--primary-glow);border-color:var(--primary)}' +
    '.tz-result{display:flex;align-items:center;justify-content:center;gap:24px;padding:24px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}' +
    '.tz-result-box{text-align:center}' +
    '.tz-rl{display:block;font-size:.78rem;color:var(--text-tertiary);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}' +
    '.tz-rt{display:block;font-size:2rem;font-weight:800;color:var(--primary)}' +
    '.tz-rc{display:block;font-size:.85rem;color:var(--text-secondary);margin-top:4px}' +
    '.tz-arrow{font-size:1.8rem;color:var(--text-tertiary)}' +
    '.tz-city-ref{font-size:.82rem;color:var(--text-secondary);line-height:1.8}' +
    '.tz-city-ref strong{display:block;margin-bottom:4px}' +
    '.tz-city-ref span{margin-right:12px;display:inline-block}' +
    '.tz-city-ref .tz-now{font-weight:600;color:var(--primary)}' +
    '@media(max-width:700px){.tz-form{grid-template-columns:1fr 1fr}.tz-swap-field{display:none}.tz-result{flex-direction:column;gap:12px}.tz-arrow{transform:rotate(90deg)}}' +
    '@media(max-width:480px){.tz-form{grid-template-columns:1fr}}';

  function getOffsetVal(sel) { return parseFloat(sel.value); }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function formatOffset(offset) {
    var h = Math.floor(offset);
    var m = Math.abs(offset - h) * 60;
    return 'UTC' + (offset >= 0 ? '+' : '') + h + (m > 0 ? ':' + pad(m) : '');
  }

  function calc() {
    var fromOffset = getOffsetVal(w('tz-from'));
    var toOffset = getOffsetVal(w('tz-to'));
    var timeStr = w('tz-time').value || '00:00';
    var parts = timeStr.split(':');
    var hours = parseInt(parts[0]) || 0;
    var mins = parseInt(parts[1]) || 0;

    // Convert to UTC minutes then to target
    var totalMins = hours * 60 + mins;
    var utcMins = totalMins - fromOffset * 60;
    var targetMins = utcMins + toOffset * 60;
    targetMins = ((targetMins % 1440) + 1440) % 1440;

    var tHours = Math.floor(targetMins / 60);
    var tMins = targetMins % 60;

    var fromZone = ZONES[tzFrom.selectedIndex];
    var toZone = ZONES[tzTo.selectedIndex];

    w('tz-from-label').textContent = formatOffset(fromOffset);
    w('tz-from-time').textContent = pad(hours) + ':' + pad(mins);
    w('tz-from-city').textContent = fromZone.cities.split(',')[0];

    w('tz-to-label').textContent = formatOffset(toOffset);
    w('tz-to-time').textContent = pad(tHours) + ':' + pad(tMins);
    w('tz-to-city').textContent = toZone.cities.split(',')[0];

    // World clocks
    var now = new Date();
    var utcNow = now.getTime() + now.getTimezoneOffset() * 60000;
    var clocks = document.getElementById('tz-world-clocks');
    var html = '';
    var topCities = ['Asia/Dubai', 'Asia/Kolkata', 'Asia/Shanghai', 'Europe/London', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Australia/Sydney'];
    for (var i = 0; i < ZONES.length; i++) {
      if (topCities.indexOf(ZONES[i].name) === -1) continue;
      var localTime = new Date(utcNow + ZONES[i].offset * 3600000);
      var hh = localTime.getUTCHours();
      var mm = localTime.getUTCMinutes();
      var city = ZONES[i].cities.split(',')[0];
      html += '<span>' + city + ': <span class="tz-now">' + pad(hh) + ':' + pad(mm) + '</span></span>';
    }
    clocks.innerHTML = html;
  }

  var tzFrom, tzTo;

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    tzFrom = w('tz-from');
    tzTo = w('tz-to');

    w('tz-from').addEventListener('change', calc);
    w('tz-to').addEventListener('change', calc);
    w('tz-time').addEventListener('input', calc);
    w('tz-time').addEventListener('change', calc);
    w('tz-swap').addEventListener('click', function () {
      var tmp = tzFrom.value;
      tzFrom.value = tzTo.value;
      tzTo.value = tmp;
      calc();
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
