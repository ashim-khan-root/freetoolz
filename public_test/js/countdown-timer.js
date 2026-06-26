(function () {
  var w = document.getElementById.bind(document);

  var timerId = null;

  var HTML =
    '<div class="cd-widget">' +
    '<div class="cd-form">' +
    '<div class="cd-field"><label>Target Date</label><input type="date" id="cd-date"></div>' +
    '<div class="cd-field"><label>Target Time</label><input type="time" id="cd-time" value="00:00"></div>' +
    '<div class="cd-field"><label>Event Label</label><input type="text" id="cd-label" placeholder="e.g. New Year, Birthday, Deadline"></div>' +
    '<div class="cd-field cd-field-btn"><label>&nbsp;</label><button id="cd-start-btn" class="cd-btn">Start Countdown</button></div>' +
    '</div>' +
    '<div class="cd-display" id="cd-display">' +
    '<div class="cd-label-text" id="cd-label-text">Countdown</div>' +
    '<div class="cd-grid">' +
    '<div class="cd-block"><span class="cd-num" id="cd-days">00</span><span class="cd-unit">Days</span></div>' +
    '<div class="cd-sep">:</div>' +
    '<div class="cd-block"><span class="cd-num" id="cd-hours">00</span><span class="cd-unit">Hours</span></div>' +
    '<div class="cd-sep">:</div>' +
    '<div class="cd-block"><span class="cd-num" id="cd-mins">00</span><span class="cd-unit">Minutes</span></div>' +
    '<div class="cd-sep">:</div>' +
    '<div class="cd-block"><span class="cd-num" id="cd-secs">00</span><span class="cd-unit">Seconds</span></div>' +
    '</div>' +
    '<div class="cd-message" id="cd-message"></div>' +
    '</div></div>';

  var CSS =
    '.cd-widget{display:flex;flex-direction:column;gap:22px}' +
    '.cd-form{display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end}' +
    '.cd-field{display:flex;flex-direction:column;gap:4px}' +
    '.cd-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.cd-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none}' +
    '.cd-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.cd-btn{padding:10px 24px;border:none;border-radius:var(--radius-sm);font-size:.95rem;font-weight:600;cursor:pointer;background:var(--primary);color:#fff;transition:var(--transition);white-space:nowrap}' +
    '.cd-btn:hover{background:var(--primary-dark)}' +
    '.cd-display{text-align:center;padding:36px 24px;background:var(--bg);border:2px solid var(--border);border-radius:var(--radius-lg)}' +
    '.cd-label-text{font-size:.95rem;color:var(--text-secondary);font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-bottom:20px}' +
    '.cd-grid{display:flex;align-items:center;justify-content:center;gap:4px}' +
    '.cd-block{display:flex;flex-direction:column;align-items:center;min-width:80px}' +
    '.cd-num{font-size:3.5rem;font-weight:800;color:var(--primary);line-height:1;font-family:monospace;letter-spacing:.02em}' +
    '.cd-unit{font-size:.78rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-top:6px}' +
    '.cd-sep{font-size:2.5rem;font-weight:300;color:var(--text-tertiary);margin:0 4px;padding-bottom:20px}' +
    '.cd-message{margin-top:16px;font-size:1rem;color:var(--accent);font-weight:700}' +
    '@media(max-width:700px){.cd-form{grid-template-columns:1fr 1fr}.cd-field-btn{grid-column:1/-1}.cd-num{font-size:2.2rem}.cd-block{min-width:55px}.cd-sep{font-size:1.8rem}}' +
    '@media(max-width:400px){.cd-num{font-size:1.8rem}.cd-block{min-width:45px}.cd-sep{font-size:1.4rem}}';

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function startCountdown() {
    var dateStr = w('cd-date').value;
    var timeStr = w('cd-time').value || '00:00';
    var label = w('cd-label').value.trim() || 'Countdown';

    if (!dateStr) { alert('Please select a target date.'); return; }

    var target = new Date(dateStr + 'T' + timeStr);
    var now = new Date();

    if (target <= now) {
      document.getElementById('cd-message').textContent = 'Target time is in the past. Choose a future date.';
      if (timerId) clearInterval(timerId);
      return;
    }

    w('cd-label-text').textContent = label;

    if (timerId) clearInterval(timerId);

    timerId = setInterval(function () {
      var diff = target - new Date();
      if (diff <= 0) {
        clearInterval(timerId);
        timerId = null;
        w('cd-days').textContent = '00';
        w('cd-hours').textContent = '00';
        w('cd-mins').textContent = '00';
        w('cd-secs').textContent = '00';
        document.getElementById('cd-message').innerHTML = '&#x1F389; Countdown complete!';
        return;
      }

      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var mins = Math.floor((diff % 3600000) / 60000);
      var secs = Math.floor((diff % 60000) / 1000);

      w('cd-days').textContent = pad2(days);
      w('cd-hours').textContent = pad2(hours);
      w('cd-mins').textContent = pad2(mins);
      w('cd-secs').textContent = pad2(secs);
      document.getElementById('cd-message').textContent = '';
    }, 1000);
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    var now = new Date();
    var tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 7);
    w('cd-date').value = tomorrow.toISOString().split('T')[0];
    w('cd-time').value = '12:00';
    w('cd-label').value = 'My Deadline';

    w('cd-start-btn').addEventListener('click', startCountdown);
    w('cd-date').addEventListener('keydown', function (e) { if (e.key === 'Enter') startCountdown(); });
    w('cd-time').addEventListener('keydown', function (e) { if (e.key === 'Enter') startCountdown(); });
    w('cd-label').addEventListener('keydown', function (e) { if (e.key === 'Enter') startCountdown(); });

    startCountdown();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
