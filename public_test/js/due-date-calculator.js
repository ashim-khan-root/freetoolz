(function () {
  var w = document.getElementById.bind(document);
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmt(d) { return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()); }
  var HTML =
    '<div class="dd-widget"><div class="dd-form">' +
    '<div class="dd-field"><label>Method</label><select id="dd-method"><option value="lmp">Last Menstrual Period (LMP)</option><option value="conception">Conception Date</option></select></div>' +
    '<div class="dd-field"><label id="dd-date-label">First day of last period</label><input type="date" id="dd-date"></div></div>' +
    '<div class="dd-results"><div class="dd-stat dd-primary"><span class="dd-stat-label">Estimated Due Date</span><span class="dd-stat-val" id="dd-due">—</span></div>' +
    '<div class="dd-stat"><span class="dd-stat-label">Current Week</span><span class="dd-stat-val" id="dd-week">0</span></div>' +
    '<div class="dd-stat"><span class="dd-stat-label">Trimester</span><span class="dd-stat-val" id="dd-trimester">—</span></div>' +
    '<div class="dd-stat"><span class="dd-stat-label">Days Remaining</span><span class="dd-stat-val" id="dd-remain">0</span></div></div>' +
    '<p class="dd-note">* Due dates are estimates. Only 5% of babies arrive on their exact due date. Consult your healthcare provider.</p></div>';
  var CSS =
    '.dd-widget{display:flex;flex-direction:column;gap:20px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.dd-form{display:flex;flex-direction:column;gap:14px}' +
    '.dd-field{display:flex;flex-direction:column;gap:4px}' +
    '.dd-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.dd-field input,.dd-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.dd-field select{cursor:pointer}.dd-field input:focus,.dd-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(59,130,246,.1)}' +
    '.dd-results{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.dd-stat{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px;text-align:center}' +
    '.dd-primary{background:var(--primary);border-color:var(--primary)}' +
    '.dd-primary .dd-stat-label{color:#fff;opacity:.85}.dd-primary .dd-stat-val{color:#fff}' +
    '.dd-stat-label{display:block;font-size:.8rem;color:var(--text-secondary);margin-bottom:4px}' +
    '.dd-stat-val{display:block;font-size:1.1rem;font-weight:700;color:var(--primary)}' +
    '.dd-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '@media(max-width:600px){.dd-results{grid-template-columns:1fr 1fr}}';
  function calc() {
    var d = w('dd-date').value; if (!d) return;
    var method = w('dd-method').value; var start = new Date(d + 'T12:00:00');
    var due = new Date(start); if (method === 'lmp') due.setDate(due.getDate() + 280); else due.setDate(due.getDate() + 266);
    var now = new Date(); var diffDays = Math.round((due - now) / (1000*60*60*24));
    var totalDays = 280; var elapsed = totalDays - diffDays;
    var week = Math.max(0, Math.floor(elapsed / 7)); week = Math.min(42, week);
    w('dd-due').textContent = fmt(due);
    w('dd-week').textContent = week;
    w('dd-remain').textContent = Math.max(0, diffDays);
    if (week < 13) w('dd-trimester').textContent = '1st';
    else if (week < 27) w('dd-trimester').textContent = '2nd';
    else w('dd-trimester').textContent = '3rd';
  }
  function toggleMethod() {
    w('dd-date-label').textContent = w('dd-method').value === 'lmp' ? 'First day of last period' : 'Conception date';
    calc();
  }
  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    var today = new Date(); w('dd-date').value = fmt(new Date(today.setDate(today.getDate() - 84)));
    w('dd-method').addEventListener('change', toggleMethod);
    w('dd-date').addEventListener('change', calc);
    calc();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
