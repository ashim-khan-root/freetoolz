(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="dd-widget">' +
    '<div class="dd-form">' +
    '<div class="dd-field"><label>Start Date</label><input type="date" id="dd-start"></div>' +
    '<div class="dd-field"><label>End Date</label><input type="date" id="dd-end"></div>' +
    '</div>' +
    '<div class="dd-results">' +
    '<div class="dd-main" id="dd-main">' +
    '<div class="dd-main-item"><span class="dd-main-num" id="dd-years">0</span><span class="dd-main-unit">Years</span></div>' +
    '<div class="dd-main-item"><span class="dd-main-num" id="dd-months">0</span><span class="dd-main-unit">Months</span></div>' +
    '<div class="dd-main-item"><span class="dd-main-num" id="dd-days">0</span><span class="dd-main-unit">Days</span></div>' +
    '</div>' +
    '<div class="dd-grid">' +
    '<div class="dd-item"><span class="dd-label">Total Days</span><span class="dd-val" id="dd-total-days">0</span></div>' +
    '<div class="dd-item"><span class="dd-label">Total Weeks</span><span class="dd-val" id="dd-total-weeks">0</span></div>' +
    '<div class="dd-item"><span class="dd-label">Weekdays</span><span class="dd-val" id="dd-weekdays">0</span></div>' +
    '<div class="dd-item"><span class="dd-label">Weekend Days</span><span class="dd-val" id="dd-weekends">0</span></div>' +
    '<div class="dd-item"><span class="dd-label">Total Hours</span><span class="dd-val" id="dd-hours">0</span></div>' +
    '<div class="dd-item"><span class="dd-label">Total Minutes</span><span class="dd-val" id="dd-mins">0</span></div>' +
    '</div>' +
    '<div class="dd-text" id="dd-text">Dates are equal</div>' +
    '</div></div>';

  var CSS =
    '.dd-widget{display:flex;flex-direction:column;gap:20px}' +
    '.dd-form{display:grid;grid-template-columns:1fr 1fr;gap:14px}' +
    '.dd-field{display:flex;flex-direction:column;gap:4px}' +
    '.dd-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.dd-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.dd-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.dd-results{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:28px;text-align:center}' +
    '.dd-main{display:flex;justify-content:center;gap:24px;margin-bottom:20px}' +
    '.dd-main-num{display:block;font-size:2rem;font-weight:800;color:var(--primary)}' +
    '.dd-main-unit{font-size:.78rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.04em}' +
    '.dd-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr;gap:8px;margin-bottom:16px}' +
    '.dd-item{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 8px}' +
    '.dd-label{display:block;font-size:.68rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.dd-val{font-size:1.1rem;font-weight:700;color:var(--text)}' +
    '.dd-text{font-size:.9rem;color:var(--text-secondary);padding:8px;background:var(--primary-glow);border-radius:var(--radius-sm)}' +
    '@media(max-width:600px){.dd-grid{grid-template-columns:1fr 1fr 1fr}}' +
    '@media(max-width:400px){.dd-grid{grid-template-columns:1fr 1fr}}';

  function calc() {
    var s = new Date(w('dd-start').value);
    var e = new Date(w('dd-end').value);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return;

    var diff = Math.abs(e - s);
    var sign = e >= s ? 1 : -1;

    var y, m, d;
    if (sign >= 0) {
      y = e.getFullYear() - s.getFullYear();
      m = e.getMonth() - s.getMonth();
      d = e.getDate() - s.getDate();
      if (d < 0) { m--; var pm = new Date(e.getFullYear(), e.getMonth(), 0); d += pm.getDate(); }
      if (m < 0) { y--; m += 12; }
    } else {
      y = s.getFullYear() - e.getFullYear();
      m = s.getMonth() - e.getMonth();
      d = s.getDate() - e.getDate();
      if (d < 0) { m--; var pm2 = new Date(s.getFullYear(), s.getMonth(), 0); d += pm2.getDate(); }
      if (m < 0) { y--; m += 12; }
    }

    var totalDays = Math.floor(diff / 86400000);
    var totalWeeks = Math.floor(totalDays / 7);
    var remainDays = totalDays % 7;

    // Count weekdays
    var weekdays = 0;
    var weekends = 0;
    var cur = new Date(Math.min(s, e));
    var end = new Date(Math.max(s, e));
    while (cur <= end) {
      var day = cur.getDay();
      if (day > 0 && day < 6) weekdays++;
      else weekends++;
      cur.setDate(cur.getDate() + 1);
    }
    // Don't count both start and end if same day
    if (s.toDateString() === e.toDateString()) { weekdays = 0; weekends = 0; }

    var totalHours = Math.floor(diff / 3600000);
    var totalMins = Math.floor(diff / 60000);

    w('dd-years').textContent = y;
    w('dd-months').textContent = m;
    w('dd-days').textContent = d;
    w('dd-total-days').textContent = totalDays.toLocaleString();
    w('dd-total-weeks').textContent = totalWeeks + (remainDays > 0 ? ' w' + remainDays + 'd' : '');
    w('dd-weekdays').textContent = weekdays.toLocaleString();
    w('dd-weekends').textContent = weekends.toLocaleString();
    w('dd-hours').textContent = totalHours.toLocaleString();
    w('dd-mins').textContent = totalMins.toLocaleString();

    var text = document.getElementById('dd-text');
    if (s.toDateString() === e.toDateString()) {
      text.textContent = 'Start and end date are the same.';
    } else {
      var dir = e > s ? 'after' : 'before';
      text.textContent = totalDays + ' day' + (totalDays !== 1 ? 's' : '') + ' ' + dir + ' start date';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    var today = new Date();
    var weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);
    w('dd-start').value = weekAgo.toISOString().split('T')[0];
    w('dd-end').value = today.toISOString().split('T')[0];

    w('dd-start').addEventListener('change', calc);
    w('dd-end').addEventListener('change', calc);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
