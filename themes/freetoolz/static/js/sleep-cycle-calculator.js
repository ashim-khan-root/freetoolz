(function () {
  var w = document.getElementById.bind(document);

  var CYCLE_LEN = 90;

  var HTML =
    '<div class="sleep-widget">' +
    '<div class="sleep-tabs">' +
    '<button class="sleep-tab sleep-tab-active" id="sleep-tab-wake">Wake-up Time</button>' +
    '<button class="sleep-tab" id="sleep-tab-bed">Bedtime</button>' +
    '</div>' +
    '<div class="sleep-form" id="sleep-form-wake">' +
    '<div class="sleep-field"><label>I want to wake up at</label><input type="time" id="sleep-wake-time" value="07:00"></div>' +
    '<div class="sleep-field"><label>Falling asleep takes (min)</label><input type="number" id="sleep-fall-asleep" value="15" min="0" max="120" step="5"></div>' +
    '</div>' +
    '<div class="sleep-form" id="sleep-form-bed" style="display:none">' +
    '<div class="sleep-field"><label>I plan to go to bed at</label><input type="time" id="sleep-bed-time" value="23:00"></div>' +
    '<div class="sleep-field"><label>Falling asleep takes (min)</label><input type="number" id="sleep-fall-asleep-2" value="15" min="0" max="120" step="5"></div>' +
    '</div>' +
    '<div class="sleep-results">' +
    '<div class="sleep-rl">Recommended Bedtimes / Wake Times</div>' +
    '<div class="sleep-cycle-list" id="sleep-cycle-list"></div>' +
    '</div>' +
    '<div class="sleep-info" id="sleep-info">A full sleep cycle lasts about 90 minutes. Waking up at the end of a cycle (not mid-cycle) leaves you feeling refreshed. Most adults need 5-6 cycles (7.5-9 hours).</div></div>';

  var CSS =
    '.sleep-widget{display:flex;flex-direction:column;gap:16px}' +
    '.sleep-tabs{display:flex;gap:0;border-radius:var(--radius-sm);overflow:hidden;border:1px solid var(--border);width:fit-content}' +
    '.sleep-tab{padding:10px 24px;border:none;font-size:.88rem;font-weight:600;cursor:pointer;background:var(--bg);color:var(--text-secondary);transition:var(--transition)}' +
    '.sleep-tab-active{background:var(--primary);color:#fff}' +
    '.sleep-form{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.sleep-field{display:flex;flex-direction:column;gap:4px}' +
    '.sleep-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.sleep-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.sleep-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.sleep-results{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:18px}' +
    '.sleep-rl{font-size:.78rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.03em;margin-bottom:12px}' +
    '.sleep-cycle-list{display:flex;flex-direction:column;gap:6px}' +
    '.sleep-cycle-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.sleep-cycle-row.sleep-rec{background:var(--primary);color:#fff;border-color:var(--primary)}' +
    '.sleep-cycle-row.sleep-rec .sleep-cyc-label{color:rgba(255,255,255,.7)}' +
    '.sleep-cycle-row.sleep-rec .sleep-cyc-time{color:#fff}' +
    '.sleep-cyc-label{font-size:.82rem;color:var(--text-secondary)}' +
    '.sleep-cyc-time{font-size:1.05rem;font-weight:700;color:var(--primary);font-family:monospace}' +
    '.sleep-info{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:500px){.sleep-form{grid-template-columns:1fr}.sleep-cycle-row{padding:8px 12px}}';

  function fmtTime(h, m) {
    var ampm = h >= 12 ? 'PM' : 'AM';
    var hh = h % 12 || 12;
    return String(hh).padStart(2) + ':' + String(m).padStart(2, '0') + ' ' + ampm;
  }

  var mode = 'wake';

  function calc() {
    if (mode === 'wake') {
      var wakeVal = w('sleep-wake-time').value;
      var fallAsleep = parseInt(w('sleep-fall-asleep').value) || 15;
      if (!wakeVal) return;
      var parts = wakeVal.split(':');
      var wakeMin = parseInt(parts[0]) * 60 + parseInt(parts[1]);

      var list = document.getElementById('sleep-cycle-list');
      var html = '';
      for (var cycles = 6; cycles >= 4; cycles--) {
        var totalMin = cycles * CYCLE_LEN + fallAsleep;
        var bedMin = wakeMin - totalMin;
        if (bedMin < 0) bedMin += 1440;
        var bh = Math.floor(bedMin / 60) % 24;
        var bm = bedMin % 60;
        var rec = cycles === 5 || cycles === 6;
        html += '<div class="sleep-cycle-row' + (rec ? ' sleep-rec' : '') + '">' +
          '<span class="sleep-cyc-label">' + cycles + ' cycles (' + (cycles * CYCLE_LEN / 60) + ' hrs)</span>' +
          '<span class="sleep-cyc-time">Bedtime: ' + fmtTime(bh, bm) + '</span></div>';
      }
      list.innerHTML = html;
    } else {
      var bedVal = w('sleep-bed-time').value;
      var fallAsleep2 = parseInt(w('sleep-fall-asleep-2').value) || 15;
      if (!bedVal) return;
      var parts = bedVal.split(':');
      var bedMin = parseInt(parts[0]) * 60 + parseInt(parts[1]);

      var list = document.getElementById('sleep-cycle-list');
      var html = '';
      for (var cycles = 4; cycles <= 6; cycles++) {
        var totalMin = cycles * CYCLE_LEN + fallAsleep2;
        var wakeMin = bedMin + totalMin;
        if (wakeMin >= 1440) wakeMin -= 1440;
        var wh = Math.floor(wakeMin / 60) % 24;
        var wm = wakeMin % 60;
        var rec = cycles === 5 || cycles === 6;
        html += '<div class="sleep-cycle-row' + (rec ? ' sleep-rec' : '') + '">' +
          '<span class="sleep-cyc-label">' + cycles + ' cycles (' + (cycles * CYCLE_LEN / 60) + ' hrs)</span>' +
          '<span class="sleep-cyc-time">Wake: ' + fmtTime(wh, wm) + '</span></div>';
      }
      list.innerHTML = html;
    }
  }

  function setMode(m) {
    mode = m;
    document.getElementById('sleep-tab-wake').className = 'sleep-tab' + (m === 'wake' ? ' sleep-tab-active' : '');
    document.getElementById('sleep-tab-bed').className = 'sleep-tab' + (m === 'bed' ? ' sleep-tab-active' : '');
    document.getElementById('sleep-form-wake').style.display = m === 'wake' ? 'grid' : 'none';
    document.getElementById('sleep-form-bed').style.display = m === 'bed' ? 'grid' : 'none';
    calc();
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.getElementById('sleep-tab-wake').addEventListener('click', function () { setMode('wake'); });
    document.getElementById('sleep-tab-bed').addEventListener('click', function () { setMode('bed'); });
    document.querySelectorAll('#sleep-wake-time, #sleep-fall-asleep, #sleep-bed-time, #sleep-fall-asleep-2').forEach(function (el) {
      el.addEventListener('input', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
