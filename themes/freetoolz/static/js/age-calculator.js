(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="age-widget">' +
    '<div class="age-form">' +
    '<div class="age-field"><label>Date of Birth</label><input type="date" id="age-dob" value="1990-06-15"></div>' +
    '<div class="age-field"><label>Reference Date</label><input type="date" id="age-ref"></div>' +
    '</div>' +
    '<div class="age-results">' +
    '<div class="age-main" id="age-main">' +
    '<span class="age-number" id="age-years">0</span><span class="age-unit">years</span>' +
    '<span class="age-number" id="age-months">0</span><span class="age-unit">months</span>' +
    '<span class="age-number" id="age-days">0</span><span class="age-unit">days</span>' +
    '</div>' +
    '<div class="age-detailed">' +
    '<div class="age-det-item"><span class="age-det-label">Hours</span><span class="age-det-val" id="age-hours">0</span></div>' +
    '<div class="age-det-item"><span class="age-det-label">Minutes</span><span class="age-det-val" id="age-mins">0</span></div>' +
    '<div class="age-det-item"><span class="age-det-label">Seconds</span><span class="age-det-val" id="age-secs">0</span></div>' +
    '<div class="age-det-item"><span class="age-det-label">Total Months</span><span class="age-det-val" id="age-total-months">0</span></div>' +
    '<div class="age-det-item"><span class="age-det-label">Total Weeks</span><span class="age-det-val" id="age-total-weeks">0</span></div>' +
    '<div class="age-det-item"><span class="age-det-label">Total Days</span><span class="age-det-val" id="age-total-days">0</span></div>' +
    '</div>' +
    '<div class="age-next-bd" id="age-next-bd">Next birthday: --</div>' +
    '</div></div>';

  var CSS =
    '.age-widget{display:flex;flex-direction:column;gap:20px}' +
    '.age-form{display:grid;grid-template-columns:1fr 1fr;gap:14px}' +
    '.age-field{display:flex;flex-direction:column;gap:4px}' +
    '.age-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.age-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.age-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.age-results{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:28px;text-align:center}' +
    '.age-main{display:flex;justify-content:center;align-items:baseline;gap:16px;margin-bottom:20px;flex-wrap:wrap}' +
    '.age-number{font-size:2.5rem;font-weight:800;color:var(--primary);line-height:1}' +
    '.age-unit{font-size:.85rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.04em}' +
    '.age-detailed{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr;gap:8px;margin-bottom:16px}' +
    '.age-det-item{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 6px}' +
    '.age-det-label{display:block;font-size:.68rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.age-det-val{font-size:1.1rem;font-weight:700;color:var(--text)}' +
    '.age-next-bd{font-size:.9rem;color:var(--text-secondary);padding:8px;background:var(--primary-glow);border-radius:var(--radius-sm)}' +
    '@media(max-width:700px){.age-detailed{grid-template-columns:1fr 1fr 1fr}}' +
    '@media(max-width:480px){.age-form{grid-template-columns:1fr}.age-number{font-size:1.8rem}}';

  var timerId = null;

  function calc() {
    var dob = new Date(w('age-dob').value);
    var ref = new Date(w('age-ref').value);

    if (isNaN(dob.getTime())) return;

    // Always use ref date, default to now
    var now = ref;
    var diff = now - dob;

    if (diff < 0) {
      w('age-years').textContent = '0';
      w('age-months').textContent = '0';
      w('age-days').textContent = '0';
      w('age-hours').textContent = '0';
      w('age-mins').textContent = '0';
      w('age-secs').textContent = '0';
      w('age-total-months').textContent = '0';
      w('age-total-weeks').textContent = '0';
      w('age-total-days').textContent = '0';
      w('age-next-bd').textContent = 'Date of birth is in the future';
      return;
    }

    var y = now.getFullYear() - dob.getFullYear();
    var m = now.getMonth() - dob.getMonth();
    var d = now.getDate() - dob.getDate();
    if (d < 0) { m--; var pm = new Date(now.getFullYear(), now.getMonth(), 0); d += pm.getDate(); }
    if (m < 0) { y--; m += 12; }

    var totalDays = Math.floor(diff / 86400000);
    var totalHours = Math.floor(diff / 3600000);
    var totalMins = Math.floor(diff / 60000);
    var totalSecs = Math.floor(diff / 1000);
    var totalMonths = y * 12 + m;
    var totalWeeks = Math.floor(totalDays / 7);

    var daysIn = diff % 86400000;
    var hours = Math.floor(daysIn / 3600000);
    var mins = Math.floor((daysIn % 3600000) / 60000);
    var secs = Math.floor((daysIn % 60000) / 1000);

    w('age-years').textContent = y;
    w('age-months').textContent = m;
    w('age-days').textContent = d;
    w('age-hours').textContent = totalHours;
    w('age-mins').textContent = totalMins;
    w('age-secs').textContent = totalSecs;
    w('age-total-months').textContent = totalMonths;
    w('age-total-weeks').textContent = totalWeeks;
    w('age-total-days').textContent = totalDays.toLocaleString();

    // Next birthday
    var nextBd = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBd < now) nextBd.setFullYear(nextBd.getFullYear() + 1);
    var daysToBd = Math.ceil((nextBd - now) / 86400000);
    if (daysToBd === 0 || (now.getMonth() === dob.getMonth() && now.getDate() === dob.getDate())) {
      w('age-next-bd').textContent = 'Today is your birthday! Happy Birthday!';
    } else {
      w('age-next-bd').textContent = 'Next birthday in ' + daysToBd + ' day' + (daysToBd === 1 ? '' : 's') + ' (' + nextBd.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ')';
    }
  }

  function tick() {
    // Only auto-tick if ref date is today
    var now = new Date();
    var refVal = w('age-ref').value;
    var todayStr = now.toISOString().split('T')[0];
    if (refVal === todayStr || !refVal) {
      w('age-ref').value = todayStr;
      calc();
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    var now = new Date();
    w('age-ref').value = now.toISOString().split('T')[0];
    if (!w('age-dob').value) w('age-dob').value = '1990-06-15';

    w('age-dob').addEventListener('change', calc);
    w('age-ref').addEventListener('change', function () {
      if (timerId) clearInterval(timerId);
      calc();
    });
    calc();
    timerId = setInterval(tick, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
