(function () {
  var w = document.getElementById.bind(document);

  var BITRATES = {
    '2': { 'H.264': { '5': 2, '10': 3, '15': 4, '25': 6, '30': 8 }, 'H.265': { '5': 1.2, '10': 2, '15': 2.5, '25': 4, '30': 5 }, 'H.265+': { '5': 0.7, '10': 1.2, '15': 1.5, '25': 2.5, '30': 3 } },
    '4': { 'H.264': { '5': 4, '10': 6, '15': 8, '25': 12, '30': 16 }, 'H.265': { '5': 2.5, '10': 4, '15': 5, '25': 8, '30': 10 }, 'H.265+': { '5': 1.5, '10': 2.5, '15': 3, '25': 5, '30': 6 } },
    '5': { 'H.264': { '5': 5, '10': 8, '15': 10, '25': 15, '30': 20 }, 'H.265': { '5': 3, '10': 5, '15': 6, '25': 10, '30': 12 }, 'H.265+': { '5': 2, '10': 3, '15': 4, '25': 6, '30': 7 } },
    '8': { 'H.264': { '5': 8, '10': 12, '15': 16, '25': 24, '30': 32 }, 'H.265': { '5': 5, '10': 8, '15': 10, '25': 15, '30': 20 }, 'H.265+': { '5': 3, '10': 5, '15': 6, '25': 10, '30': 12 } },
    '12': { 'H.264': { '5': 12, '10': 18, '15': 24, '25': 36, '30': 48 }, 'H.265': { '5': 8, '10': 12, '15': 16, '25': 24, '30': 32 }, 'H.265+': { '5': 5, '10': 8, '15': 10, '25': 16, '30': 20 } }
  };

  var RES_NAMES = { '2': '2MP', '4': '4MP', '5': '5MP', '8': '8MP', '12': '12MP' };
  var FPS_OPTIONS = ['5', '10', '15', '25', '30'];

  var HTML =
    '<div class="bw-widget">' +
    '<div class="bw-form-grid">' +
    '<div class="bw-field"><label>Number of Cameras</label><input type="number" id="bw-cameras" value="16" min="1" max="512"></div>' +
    '<div class="bw-field"><label>Resolution</label><select id="bw-resolution"><option value="2">2MP (1080p)</option><option value="4" selected>4MP (2K)</option><option value="5">5MP</option><option value="8">8MP (4K)</option><option value="12">12MP</option></select></div>' +
    '<div class="bw-field"><label>Frame Rate (FPS)</label><select id="bw-fps"><option value="5">5 fps</option><option value="10">10 fps</option><option value="15" selected>15 fps</option><option value="25">25 fps</option><option value="30">30 fps</option></select></div>' +
    '<div class="bw-field"><label>Compression</label><select id="bw-codec"><option value="H.264">H.264</option><option value="H.265" selected>H.265</option><option value="H.265+">H.265+ / Smart Codec</option></select></div>' +
    '</div>' +
    '<div class="bw-results-grid">' +
    '<div class="bw-result-card"><span class="bw-rl">Per Camera</span><span class="bw-rv" id="bw-percam">0 Mbps</span></div>' +
    '<div class="bw-result-card" style="background:var(--primary);color:#fff"><span class="bw-rl" style="color:rgba(255,255,255,.7)">Total Bandwidth</span><span class="bw-rv" id="bw-total">0 Mbps</span></div>' +
    '<div class="bw-result-card"><span class="bw-rl">Per Month (30d)</span><span class="bw-rv" id="bw-monthly">0 TB</span></div>' +
    '<div class="bw-result-card"><span class="bw-rl">Network Required</span><span class="bw-rv" id="bw-network">100 Mbps</span></div>' +
    '</div>' +
    '<div class="bw-note" id="bw-note">This network can handle this camera load.</div></div>';

  var CSS =
    '.bw-widget{display:flex;flex-direction:column;gap:20px}' +
    '.bw-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px}' +
    '.bw-field{display:flex;flex-direction:column;gap:4px}' +
    '.bw-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.bw-field input,.bw-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none}' +
    '.bw-field input:focus,.bw-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.bw-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.bw-result-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.bw-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.bw-rv{font-size:1.3rem;font-weight:800;color:var(--primary);display:block}' +
    '.bw-note{font-size:.85rem;padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:768px){.bw-form-grid{grid-template-columns:1fr 1fr}.bw-results-grid{grid-template-columns:1fr 1fr}}' +
    '@media(max-width:480px){.bw-form-grid{grid-template-columns:1fr}}';

  function clampFps(fps) {
    var closest = FPS_OPTIONS[0];
    for (var i = 0; i < FPS_OPTIONS.length; i++) {
      if (Math.abs(parseInt(FPS_OPTIONS[i]) - fps) < Math.abs(parseInt(closest) - fps)) closest = FPS_OPTIONS[i];
    }
    return closest;
  }

  function calc() {
    var cams = parseInt(w('bw-cameras').value) || 0;
    var res = parseInt(w('bw-resolution').value);
    var fps = parseInt(w('bw-fps').value);
    var codec = w('bw-codec').value;

    var fpsKey = clampFps(fps).toString();
    var bitrate = (BITRATES[res] && BITRATES[res][codec] && BITRATES[res][codec][fpsKey]) || 0;
    var total = bitrate * cams;
    var monthlyTb = total * 3600 * 24 * 30 / 8 / 1024 / 1024;

    w('bw-percam').textContent = bitrate.toFixed(1) + ' Mbps';
    w('bw-total').textContent = total.toFixed(1) + ' Mbps';
    w('bw-monthly').textContent = monthlyTb.toFixed(1) + ' TB';

    var netNote = document.getElementById('bw-note');
    if (total <= 80) {
      w('bw-network').textContent = '100 Mbps';
      netNote.textContent = '100 Mbps network is sufficient (' + total.toFixed(1) + ' Mbps used, ' + (100 - total).toFixed(1) + ' Mbps spare).';
      netNote.style.borderLeftColor = '#22c55e';
    } else if (total <= 800) {
      w('bw-network').textContent = '1000 Mbps (1 GbE)';
      netNote.textContent = 'Gigabit network recommended (' + total.toFixed(1) + ' Mbps used, ' + (1000 - total).toFixed(1) + ' Mbps spare).';
      netNote.style.borderLeftColor = '#eab308';
    } else {
      w('bw-network').textContent = '10 GbE';
      netNote.textContent = 'WARNING: 10 GbE network may be needed (' + total.toFixed(1) + ' Mbps total). Consider reducing resolution or FPS.';
      netNote.style.borderLeftColor = '#ef4444';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.bw-field input, .bw-field select').forEach(function (e) {
      e.addEventListener('input', calc); e.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
