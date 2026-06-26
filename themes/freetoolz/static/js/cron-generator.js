(function () {
  var w = document.getElementById.bind(document);

  var PRESETS = [
    { label: 'Every minute', exp: '* * * * *', desc: 'Runs every minute' },
    { label: 'Every 5 minutes', exp: '*/5 * * * *', desc: 'Runs every 5 minutes' },
    { label: 'Every 15 minutes', exp: '*/15 * * * *', desc: 'Runs every 15 minutes' },
    { label: 'Every hour', exp: '0 * * * *', desc: 'Runs at the start of every hour' },
    { label: 'Daily at midnight', exp: '0 0 * * *', desc: 'Runs daily at 00:00' },
    { label: 'Daily at 9 AM', exp: '0 9 * * *', desc: 'Runs daily at 9:00 AM' },
    { label: 'Every weekday at 8 AM', exp: '0 8 * * 1-5', desc: 'Runs Mon-Fri at 8:00 AM' },
    { label: 'Weekly on Monday', exp: '0 0 * * 1', desc: 'Runs every Monday at midnight' },
    { label: 'First day of month', exp: '0 0 1 * *', desc: 'Runs on the 1st of every month' },
    { label: 'Every 30 minutes (9-5)', exp: '*/30 9-17 * * *', desc: 'Runs every 30 min between 9 AM and 5 PM' }
  ];

  var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  var DOWS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  var presetsHtml = '';
  for (var i = 0; i < PRESETS.length; i++) presetsHtml += '<option value="' + i + '">' + PRESETS[i].label + '</option>';

  var HTML =
    '<div class="cron-widget">' +
    '<div class="cron-form-grid">' +
    '<div class="cron-field"><label>Presets</label><select id="cron-preset">' + presetsHtml + '</select></div>' +
    '<div class="cron-field"><label>Cron Expression</label><input type="text" id="cron-expr" value="*/15 * * * *" placeholder="* * * * *"></div>' +
    '<div class="cron-field"><label>Minutes (0-59)</label><input type="text" id="cron-min" value="*" placeholder="*"></div>' +
    '<div class="cron-field"><label>Hours (0-23)</label><input type="text" id="cron-hour" value="*" placeholder="*"></div>' +
    '<div class="cron-field"><label>Day of Month (1-31)</label><input type="text" id="cron-dom" value="*" placeholder="*"></div>' +
    '<div class="cron-field"><label>Month (1-12)</label><input type="text" id="cron-month" value="*" placeholder="*"></div>' +
    '<div class="cron-field"><label>Day of Week (0-7)</label><input type="text" id="cron-dow" value="*" placeholder="*"></div>' +
    '</div>' +
    '<div class="cron-preview" id="cron-preview">' +
    '<div class="cron-exp-display"><code id="cron-display">*/15 * * * *</code></div>' +
    '<div class="cron-desc" id="cron-desc">Runs every 15 minutes</div>' +
    '</div>' +
    '<div class="cron-next-runs" id="cron-next">' +
    '<div class="cron-nr-title">Next 5 Scheduled Runs</div>' +
    '<div id="cron-run-list"></div></div>' +
    '<div class="cron-note" id="cron-note">Format: minute hour day-of-month month day-of-week. Use * for any, */n for every n, comma for list, hyphen for range.</div></div>';

  var CSS =
    '.cron-widget{display:flex;flex-direction:column;gap:16px}' +
    '.cron-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.cron-field{display:flex;flex-direction:column;gap:4px}' +
    '.cron-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.cron-field input,.cron-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none;font-family:monospace}' +
    '.cron-field input:focus,.cron-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.cron-preview{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center}' +
    '.cron-exp-display{font-size:1.6rem;font-weight:800;color:var(--primary);font-family:monospace;margin-bottom:6px}' +
    '.cron-desc{font-size:.95rem;color:var(--text-secondary)}' +
    '.cron-next-runs{padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.cron-nr-title{font-size:.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:8px}' +
    '.cron-run-list{font-size:.9rem;font-family:monospace;color:var(--text);line-height:1.8}' +
    '.cron-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:768px){.cron-form-grid{grid-template-columns:1fr 1fr}}' +
    '@media(max-width:500px){.cron-form-grid{grid-template-columns:1fr}}';

  function parseCronField(field, min, max) {
    var values = [];
    if (field === '*') {
      for (var i = min; i <= max; i++) values.push(i);
      return values;
    }
    var parts = field.split(',');
    for (var p = 0; p < parts.length; p++) {
      var part = parts[p].trim();
      var step = 1;
      if (part.indexOf('/') > -1) {
        var spl = part.split('/');
        step = parseInt(spl[1]) || 1;
        part = spl[0];
      }
      if (part === '*') {
        for (var i = min; i <= max; i += step) values.push(i);
      } else if (part.indexOf('-') > -1) {
        var range = part.split('-');
        var rStart = parseInt(range[0]), rEnd = parseInt(range[1]);
        for (var i = rStart; i <= rEnd; i += step) values.push(i);
      } else {
        var v = parseInt(part);
        if (!isNaN(v)) values.push(v);
      }
    }
    return values.sort(function (a, b) { return a - b; });
  }

  function describeCron(expr) {
    var parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return 'Invalid expression (need 5 fields)';
    var min = parts[0], hour = parts[1], dom = parts[2], month = parts[3], dow = parts[4];
    if (dow === '0' || dow === '7') dow = '0';
    if (min === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*') return 'Runs every minute';
    if (min.indexOf('/') > -1) {
      var m = parseInt(min.split('/')[1]);
      if (hour === '*' && dom === '*' && month === '*' && dow === '*') return 'Runs every ' + m + ' minutes';
      if (hour.indexOf('-') > -1) {
        var hr = hour.split('-');
        return 'Runs every ' + m + ' minutes between ' + hr[0] + ':00 and ' + hr[1] + ':00';
      }
    }
    if (min === '0' && hour.indexOf('/') > -1) {
      var h = parseInt(hour.split('/')[1]);
      if (dom === '*' && month === '*' && dow === '*') return 'Runs every ' + h + ' hours';
    }
    if (min === '0' && hour !== '*' && dom === '*' && month === '*' && dow === '*') {
      var hDesc = hour.indexOf('-') > -1 ? hour + ' (range)' : 'at ' + hour + ':00';
      return 'Runs daily at ' + hour + ':00';
    }
    if (min === '0' && hour !== '*' && dom === '*' && month === '*' && dow !== '*') {
      return 'Runs at ' + hour + ':00 on ' + dow.replace('1-5', 'weekdays').replace('0', 'Sunday') + ' only';
    }
    if (min === '0' && hour === '0' && dom === '1' && month === '*' && dow === '*') return 'Runs on the first day of every month at midnight';
    return 'Custom schedule: ' + expr;
  }

  function getNextRuns(expr, count) {
    var parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return [];
    var mins = parseCronField(parts[0], 0, 59);
    var hours = parseCronField(parts[1], 0, 23);
    var doms = parseCronField(parts[2], 1, 31);
    var months = parseCronField(parts[3], 1, 12);
    var dows = parseCronField(parts[4], 0, 6);

    var now = new Date();
    var runs = [];
    var maxIter = 100000;
    var iter = 0;
    var cur = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());

    while (runs.length < count && iter < maxIter) {
      iter++;
      cur.setMinutes(cur.getMinutes() + 1);
      var matches =
        mins.indexOf(cur.getMinutes()) > -1 &&
        hours.indexOf(cur.getHours()) > -1 &&
        doms.indexOf(cur.getDate()) > -1 &&
        months.indexOf(cur.getMonth() + 1) > -1 &&
        dows.indexOf(cur.getDay()) > -1;
      if (matches) runs.push(new Date(cur));
    }
    return runs;
  }

  function fmtDate(d) {
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()] + ' ' +
      String(d.getMonth() + 1).padStart(2, '0') + '/' +
      String(d.getDate()).padStart(2, '0') + '/' +
      d.getFullYear() + ' ' +
      String(d.getHours()).padStart(2, '0') + ':' +
      String(d.getMinutes()).padStart(2, '0');
  }

  function calc() {
    var expr = w('cron-expr').value.trim();
    w('cron-display').textContent = expr;
    var desc = describeCron(expr);
    w('cron-desc').textContent = desc;

    var runs = getNextRuns(expr, 5);
    var list = document.getElementById('cron-run-list');
    if (runs.length > 0) {
      var html = '';
      for (var i = 0; i < runs.length; i++) {
        html += '<div>' + (i + 1) + '. ' + fmtDate(runs[i]) + '</div>';
      }
      list.innerHTML = html;
    } else {
      list.innerHTML = '<div style="color:var(--text-tertiary)">Could not compute next runs (invalid expression?)</div>';
    }

    var note = document.getElementById('cron-note');
    if (parts.length !== 5) {
      note.style.borderLeftColor = '#ef4444';
    } else {
      note.style.borderLeftColor = '#22c55e';
    }
    var parts = expr.split(/\s+/);
  }

  function syncFields() {
    w('cron-expr').value = (w('cron-min').value || '*') + ' ' +
      (w('cron-hour').value || '*') + ' ' +
      (w('cron-dom').value || '*') + ' ' +
      (w('cron-month').value || '*') + ' ' +
      (w('cron-dow').value || '*');
    calc();
  }

  function fromExpr() {
    var parts = w('cron-expr').value.trim().split(/\s+/);
    if (parts.length === 5) {
      w('cron-min').value = parts[0];
      w('cron-hour').value = parts[1];
      w('cron-dom').value = parts[2];
      w('cron-month').value = parts[3];
      w('cron-dow').value = parts[4];
    }
    calc();
  }

  function selectPreset() {
    var idx = parseInt(w('cron-preset').value);
    w('cron-expr').value = PRESETS[idx].exp;
    fromExpr();
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('cron-preset').addEventListener('change', selectPreset);
    w('cron-expr').addEventListener('input', fromExpr);
    document.querySelectorAll('#cron-min, #cron-hour, #cron-dom, #cron-month, #cron-dow').forEach(function (el) {
      el.addEventListener('input', syncFields);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
