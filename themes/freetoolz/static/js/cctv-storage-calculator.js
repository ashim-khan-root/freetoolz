(function () {
  var w = document.getElementById.bind(document);

  var BITRATES = {
    '2': { 'H.264': { '5': 1.5, '10': 1.5, '15': 2.0, '25': 4.1, '30': 4.1 }, 'H.265': { '5': 1.0, '10': 1.0, '15': 1.3, '25': 2.6, '30': 2.6 }, 'H.265+': { '5': 0.6, '10': 0.6, '15': 0.8, '25': 1.5, '30': 1.5 } },
    '4': { 'H.264': { '5': 3.1, '10': 3.1, '15': 4.1, '25': 8.2, '30': 8.2 }, 'H.265': { '5': 1.9, '10': 1.9, '15': 2.6, '25': 5.1, '30': 5.1 }, 'H.265+': { '5': 1.2, '10': 1.2, '15': 1.5, '25': 3.1, '30': 3.1 } },
    '5': { 'H.264': { '5': 3.5, '10': 3.5, '15': 4.6, '25': 9.2, '30': 9.2 }, 'H.265': { '5': 2.2, '10': 2.2, '15': 2.9, '25': 5.8, '30': 5.8 }, 'H.265+': { '5': 1.3, '10': 1.3, '15': 1.7, '25': 3.5, '30': 3.5 } },
    '8': { 'H.264': { '5': 6.1, '10': 6.1, '15': 8.2, '25': 16.4, '30': 16.4 }, 'H.265': { '5': 3.8, '10': 3.8, '15': 5.1, '25': 10.2, '30': 10.2 }, 'H.265+': { '5': 2.3, '10': 2.3, '15': 3.1, '25': 6.1, '30': 6.1 } },
    '12': { 'H.264': { '5': 7.7, '10': 7.7, '15': 10.2, '25': 20.5, '30': 20.5 }, 'H.265': { '5': 4.8, '10': 4.8, '15': 6.4, '25': 12.8, '30': 12.8 }, 'H.265+': { '5': 2.9, '10': 2.9, '15': 3.8, '25': 7.7, '30': 7.7 } }
  };

  var RES_NAMES = { '2': '2MP (1080p)', '4': '4MP (2K)', '5': '5MP', '8': '8MP (4K)', '12': '12MP' };

  var FPS_OPTIONS = ['5', '10', '15', '25', '30'];

  var HTML =
    '<div class="cctv-widget">' +
    '<div class="cctv-form-grid">' +
    '<div class="cctv-field"><label>Number of Cameras</label><input type="number" id="cs-cameras" value="8" min="1" max="256"></div>' +
    '<div class="cctv-field"><label>Resolution</label><select id="cs-resolution"><option value="2">2MP (1080p)</option><option value="4" selected>4MP (2K)</option><option value="5">5MP</option><option value="8">8MP (4K)</option><option value="12">12MP</option></select></div>' +
    '<div class="cctv-field"><label>Frame Rate (FPS)</label><select id="cs-fps"><option value="5">5 fps</option><option value="10">10 fps</option><option value="15" selected>15 fps</option><option value="25">25 fps</option><option value="30">30 fps</option></select></div>' +
    '<div class="cctv-field"><label>Compression</label><select id="cs-codec"><option value="H.264">H.264</option><option value="H.265" selected>H.265</option><option value="H.265+">H.265+ / Smart Codec</option></select></div>' +
    '<div class="cctv-field"><label>Recording Hours/Day</label><input type="number" id="cs-hours" value="24" min="1" max="24"></div>' +
    '<div class="cctv-field"><label>Retention (Days)</label><input type="number" id="cs-days" value="30" min="1" max="365"></div>' +
    '</div>' +
    '<div class="cctv-results-grid">' +
    '<div class="cctv-result-card"><span class="cctv-rl">Per Camera Bitrate</span><span class="cctv-rv" id="cs-bitrate">0 Mbps</span></div>' +
    '<div class="cctv-result-card"><span class="cctv-rl">Daily Storage</span><span class="cctv-rv" id="cs-daily">0 GB</span></div>' +
    '<div class="cctv-result-card" style="background:var(--primary);color:#fff"><span class="cctv-rl" style="color:rgba(255,255,255,.7)">Total Storage Required</span><span class="cctv-rv" id="cs-total" style="color:#fff">0 GB</span></div>' +
    '<div class="cctv-result-card"><span class="cctv-rl">Recommended HDD</span><span class="cctv-rv" id="cs-hdd">0 TB</span></div>' +
    '</div>' +
    '<div class="cctv-breakdown" id="cs-breakdown"></div>' +
    '<div class="cctv-note" id="cs-note">Bitrate estimates are based on H.264 mid-quality. Actual bitrate varies by scene complexity, camera quality, and compression settings. H.265 can reduce bitrate ~40% vs H.264.</div></div>';

  var CSS =
    '.cctv-widget{display:flex;flex-direction:column;gap:20px}' +
    '.cctv-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}' +
    '.cctv-field{display:flex;flex-direction:column;gap:4px}' +
    '.cctv-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.cctv-field input,.cctv-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none}' +
    '.cctv-field input:focus,.cctv-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.cctv-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.cctv-result-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.cctv-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.cctv-rv{font-size:1.3rem;font-weight:800;color:var(--primary);display:block}' +
    '.cctv-breakdown{font-size:.82rem;color:var(--text-secondary);padding:10px 0;line-height:1.6}' +
    '.cctv-note{font-size:.82rem;color:var(--text-secondary);padding:12px 16px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5;margin-top:4px}' +
    '@media(max-width:768px){.cctv-form-grid{grid-template-columns:1fr 1fr}.cctv-results-grid{grid-template-columns:1fr 1fr}}' +
    '@media(max-width:480px){.cctv-form-grid{grid-template-columns:1fr}}';

  function nearestHDD(gb) {
    var sizes = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000, 10000, 12000, 16000, 20000];
    for (var i = 0; i < sizes.length; i++) {
      if (sizes[i] >= gb * 1.1) return sizes[i] / 1000;
    }
    var needed = gb * 1.1 / 1000;
    var maxDrive = sizes[sizes.length - 1] / 1000;
    var drives = Math.ceil(needed / maxDrive);
    return drives + 'x ' + maxDrive + 'TB';
  }

  function clampFps(fps) {
    var closest = FPS_OPTIONS[0];
    for (var i = 0; i < FPS_OPTIONS.length; i++) {
      if (Math.abs(parseInt(FPS_OPTIONS[i]) - fps) < Math.abs(parseInt(closest) - fps)) closest = FPS_OPTIONS[i];
    }
    return closest;
  }

  function calc() {
    var cams = parseInt(w('cs-cameras').value) || 0;
    var res = parseInt(w('cs-resolution').value);
    var fps = parseInt(w('cs-fps').value);
    var codec = w('cs-codec').value;
    var hours = parseInt(w('cs-hours').value) || 0;
    var days = parseInt(w('cs-days').value) || 0;

    var fpsKey = clampFps(fps).toString();
    var bitrate = (BITRATES[res] && BITRATES[res][codec] && BITRATES[res][codec][fpsKey]) || 0;

    var dailyGb = bitrate * cams * hours * 3600 / 8 / 1024;
    var totalGb = dailyGb * days;
    var hddTb = nearestHDD(totalGb);

    w('cs-bitrate').textContent = bitrate.toFixed(1) + ' Mbps';
    w('cs-daily').textContent = dailyGb >= 1024 ? (dailyGb / 1024).toFixed(1) + ' TB' : dailyGb.toFixed(1) + ' GB';
    w('cs-total').textContent = totalGb >= 1024 ? (totalGb / 1024).toFixed(1) + ' TB' : totalGb.toFixed(0) + ' GB';
    w('cs-hdd').textContent = typeof hddTb === 'string' ? hddTb : (hddTb >= 1 ? hddTb + ' TB' : (hddTb * 1000) + ' GB');

    var bd = document.getElementById('cs-breakdown');
    if (cams > 0 && bitrate > 0) {
      bd.innerHTML = '&#8226; ' + cams + ' cameras &times; ' + RES_NAMES[res] + ' @ ' + fps + ' fps &middot; ' + codec + '<br>' +
        '&#8226; ' + hours + '/hr recording &times; ' + days + ' days retention<br>' +
        '&#8226; Total bandwidth: ' + (bitrate * cams).toFixed(1) + ' Mbps';
      bd.style.display = '';
    } else {
      bd.innerHTML = 'Enter valid camera details to see storage breakdown.';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.cctv-field input, .cctv-field select').forEach(function (e) {
      e.addEventListener('input', calc); e.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
