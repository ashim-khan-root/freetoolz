(function () {
  var w = document.getElementById.bind(document);

  var RESOLUTIONS = [
    { label: 'SD (720×480)', w: 720, h: 480, pixels: 345600 },
    { label: 'HD (1280×720)', w: 1280, h: 720, pixels: 921600 },
    { label: 'Full HD (1920×1080)', w: 1920, h: 1080, pixels: 2073600 },
    { label: '2K (2560×1440)', w: 2560, h: 1440, pixels: 3686400 },
    { label: '4K (3840×2160)', w: 3840, h: 2160, pixels: 8294400 },
    { label: '5K (5120×2880)', w: 5120, h: 2880, pixels: 14745600 },
    { label: '8K (7680×4320)', w: 7680, h: 4320, pixels: 33177600 }
  ];

  var CODECS = [
    { label: 'H.264', ratio: 0.025 },
    { label: 'H.265 / HEVC', ratio: 0.015 },
    { label: 'H.265+ / Smart', ratio: 0.010 },
    { label: 'VP9', ratio: 0.013 },
    { label: 'AV1', ratio: 0.009 }
  ];

  var resOpts = '', codecOpts = '';
  for (var i = 0; i < RESOLUTIONS.length; i++) resOpts += '<option value="' + i + '"' + (i === 3 ? ' selected' : '') + '>' + RESOLUTIONS[i].label + '</option>';
  for (var i = 0; i < CODECS.length; i++) codecOpts += '<option value="' + i + '"' + (i === 1 ? ' selected' : '') + '>' + CODECS[i].label + '</option>';

  var HTML =
    '<div class="vbr-widget">' +
    '<div class="vbr-form-grid">' +
    '<div class="vbr-field"><label>Resolution</label><select id="vbr-res">' + resOpts + '</select></div>' +
    '<div class="vbr-field"><label>Frame Rate (FPS)</label><input type="number" id="vbr-fps" value="30" min="1" max="120"></div>' +
    '<div class="vbr-field"><label>Codec</label><select id="vbr-codec">' + codecOpts + '</select></div>' +
    '<div class="vbr-field"><label>Bit Depth</label><select id="vbr-depth"><option value="8">8-bit</option><option value="10" selected>10-bit</option></select></div>' +
    '</div>' +
    '<div class="vbr-results-grid">' +
    '<div class="vbr-rc" style="background:var(--primary);color:#fff"><span class="vbr-rl" style="color:rgba(255,255,255,.7)">Estimated Bitrate</span><span class="vbr-rv" id="vbr-bitrate" style="color:#fff">0 Mbps</span></div>' +
    '<div class="vbr-rc"><span class="vbr-rl">Per Minute</span><span class="vbr-rv" id="vbr-per-min">0 MB</span></div>' +
    '<div class="vbr-rc"><span class="vbr-rl">Per Hour</span><span class="vbr-rv" id="vbr-per-hour">0 GB</span></div>' +
    '<div class="vbr-rc"><span class="vbr-rl">Per Day (24h)</span><span class="vbr-rv" id="vbr-per-day">0 GB</span></div>' +
    '</div>' +
    '<div class="vbr-custom">' +
    '<div class="vbr-field"><label>Custom Duration (minutes)</label><input type="number" id="vbr-custom-mins" value="60" min="1" max="100000"></div>' +
    '<div class="vbr-field" style="justify-content:flex-end"><span class="vbr-rv" id="vbr-custom-result" style="padding:10px 0;font-size:1rem">0 GB</span></div>' +
    '</div>' +
    '<div class="vbr-note" id="vbr-note">Bitrate is an estimate based on resolution, FPS, and codec. Actual bitrate varies with scene complexity, motion level, and encoder settings. H.265 typically saves 40-50% over H.264 at the same quality.</div></div>';

  var CSS =
    '.vbr-widget{display:flex;flex-direction:column;gap:16px}' +
    '.vbr-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.vbr-field{display:flex;flex-direction:column;gap:4px}' +
    '.vbr-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.vbr-field input,.vbr-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.vbr-field input:focus,.vbr-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.vbr-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.vbr-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.vbr-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.vbr-rv{font-size:1.15rem;font-weight:800;color:var(--primary);display:block}' +
    '.vbr-custom{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:end}' +
    '.vbr-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:768px){.vbr-form-grid{grid-template-columns:1fr 1fr}.vbr-results-grid{grid-template-columns:1fr 1fr}.vbr-custom{grid-template-columns:1fr}}';

  function calc() {
    var resIdx = parseInt(w('vbr-res').value);
    var fps = parseFloat(w('vbr-fps').value) || 0;
    var codecIdx = parseInt(w('vbr-codec').value);
    var depth = parseInt(w('vbr-depth').value);
    var customMins = parseFloat(w('vbr-custom-mins').value) || 0;

    var pixels = RESOLUTIONS[resIdx].pixels;
    var ratio = CODECS[codecIdx].ratio;
    var depthFactor = depth === 10 ? 1.25 : 1.0;

    var bitsPerFrame = pixels * ratio * depthFactor;
    var bps = bitsPerFrame * fps;
    var mbps = bps / 1000000;

    var perMinMB = (bps / 8) * 60 / (1024 * 1024);
    var perHourGB = (bps / 8) * 3600 / (1024 * 1024 * 1024);
    var perDayGB = perHourGB * 24;
    var customGB = customMins > 0 ? (bps / 8) * customMins * 60 / (1024 * 1024 * 1024) : 0;

    w('vbr-bitrate').textContent = mbps.toFixed(1) + ' Mbps';
    w('vbr-per-min').textContent = perMinMB >= 1024 ? (perMinMB / 1024).toFixed(2) + ' GB' : perMinMB.toFixed(1) + ' MB';
    w('vbr-per-hour').textContent = perHourGB.toFixed(2) + ' GB';
    w('vbr-per-day').textContent = perDayGB.toFixed(2) + ' GB';
    w('vbr-custom-result').textContent = customGB >= 1 ? customGB.toFixed(2) + ' GB' : (customGB * 1024).toFixed(0) + ' MB';
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.vbr-field input, .vbr-field select').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
