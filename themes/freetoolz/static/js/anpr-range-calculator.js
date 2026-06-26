(function () {
  var w = document.getElementById.bind(document);

  var SENSORS = [
    { label: '1/3" (4.8×3.6mm)', w: 4.8, h: 3.6 },
    { label: '1/2.8" (5.12×3.84mm)', w: 5.12, h: 3.84 },
    { label: '1/2.5" (5.76×4.29mm)', w: 5.76, h: 4.29 },
    { label: '1/1.8" (7.2×5.4mm)', w: 7.2, h: 5.4 },
    { label: '2/3" (8.8×6.6mm)', w: 8.8, h: 6.6 },
    { label: '1" (12.8×9.6mm)', w: 12.8, h: 9.6 }
  ];

  var RESOLUTIONS = [
    { label: '2MP (1920×1080)', w: 1920, h: 1080 },
    { label: '4MP (2560×1440)', w: 2560, h: 1440 },
    { label: '5MP (2592×1944)', w: 2592, h: 1944 },
    { label: '8MP / 4K (3840×2160)', w: 3840, h: 2160 },
    { label: '12MP (4000×3000)', w: 4000, h: 3000 }
  ];

  var PLATES = [
    { label: 'EU standard (520mm)', mm: 520 },
    { label: 'US auto (600mm)', mm: 600 },
    { label: 'US motorcycle (300mm)', mm: 300 },
    { label: 'Asia standard (440mm)', mm: 440 },
    { label: 'UK standard (520mm)', mm: 520 }
  ];

  var PPM_LEVELS = [
    { label: 'Detection (75 px/m)', ppm: 75 },
    { label: 'Recognition — ANPR (125 px/m)', ppm: 125 },
    { label: 'Identification (250 px/m)', ppm: 250 }
  ];

  var sensorOpts = '', resOpts = '', plateOpts = '', ppmOpts = '';
  for (var i = 0; i < SENSORS.length; i++) sensorOpts += '<option value="' + i + '"' + (i === 1 ? ' selected' : '') + '>' + SENSORS[i].label + '</option>';
  for (var i = 0; i < RESOLUTIONS.length; i++) resOpts += '<option value="' + i + '"' + (i === 1 ? ' selected' : '') + '>' + RESOLUTIONS[i].label + '</option>';
  for (var i = 0; i < PLATES.length; i++) plateOpts += '<option value="' + i + '">' + PLATES[i].label + '</option>';
  for (var i = 0; i < PPM_LEVELS.length; i++) ppmOpts += '<option value="' + i + '"' + (i === 1 ? ' selected' : '') + '>' + PPM_LEVELS[i].label + '</option>';

  var HTML =
    '<div class="anpr-widget">' +
    '<div class="anpr-form-grid">' +
    '<div class="anpr-field"><label>Camera Resolution</label><select id="anpr-res">' + resOpts + '</select></div>' +
    '<div class="anpr-field"><label>Sensor Size</label><select id="anpr-sensor">' + sensorOpts + '</select></div>' +
    '<div class="anpr-field"><label>Lens Focal Length (mm)</label><input type="number" id="anpr-fl" value="12" min="1" max="200" step="0.5"></div>' +
    '<div class="anpr-field"><label>Plate Size</label><select id="anpr-plate">' + plateOpts + '</select></div>' +
    '<div class="anpr-field"><label>Required PPM</label><select id="anpr-ppm">' + ppmOpts + '</select></div>' +
    '<div class="anpr-field"><label>Test Distance (m)</label><input type="number" id="anpr-dist" value="20" min="1" max="500" step="1"></div>' +
    '</div>' +
    '<div class="anpr-results-grid">' +
    '<div class="anpr-rc" style="background:var(--primary);color:#fff"><span class="anpr-rl" style="color:rgba(255,255,255,.7)">Max ANPR Distance</span><span class="anpr-rv" id="anpr-max" style="color:#fff">0 m</span></div>' +
    '<div class="anpr-rc"><span class="anpr-rl">PPM at Test Distance</span><span class="anpr-rv" id="anpr-ppm-out">0</span></div>' +
    '<div class="anpr-rc"><span class="anpr-rl">Pixels Across Plate</span><span class="anpr-rv" id="anpr-px-plate">0 px</span></div>' +
    '<div class="anpr-rc"><span class="anpr-rl">HFOV at Distance</span><span class="anpr-rv" id="anpr-hfov">0 m</span></div>' +
    '</div>' +
    '<div class="anpr-detail-grid">' +
    '<div class="anpr-dc"><span class="anpr-dl">Detection (75 ppm)</span><span class="anpr-dv" id="anpr-det-dist">0 m</span></div>' +
    '<div class="anpr-dc" style="background:var(--primary);color:#fff"><span class="anpr-dl" style="color:rgba(255,255,255,.7)">Recognition (125 ppm)</span><span class="anpr-dv" id="anpr-rec-dist" style="color:#fff">0 m</span></div>' +
    '<div class="anpr-dc"><span class="anpr-dl">Identification (250 ppm)</span><span class="anpr-dv" id="anpr-id-dist">0 m</span></div>' +
    '</div>' +
    '<div class="anpr-note" id="anpr-note">Enter camera specs to calculate maximum ANPR range. Results are theoretical — real-world performance varies with lighting, weather, and lens quality.</div></div>';

  var CSS =
    '.anpr-widget{display:flex;flex-direction:column;gap:16px}' +
    '.anpr-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.anpr-field{display:flex;flex-direction:column;gap:4px}' +
    '.anpr-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.anpr-field input,.anpr-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.anpr-field input:focus,.anpr-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.anpr-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.anpr-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.anpr-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.anpr-rv{font-size:1.15rem;font-weight:800;color:var(--primary);display:block}' +
    '.anpr-detail-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.anpr-dc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center}' +
    '.anpr-dl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}' +
    '.anpr-dv{font-size:1rem;font-weight:700;color:var(--primary);display:block}' +
    '.anpr-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:768px){.anpr-form-grid{grid-template-columns:1fr 1fr}.anpr-results-grid{grid-template-columns:1fr 1fr}.anpr-detail-grid{grid-template-columns:1fr}}';

  function calc() {
    var resIdx = parseInt(w('anpr-res').value);
    var sensorIdx = parseInt(w('anpr-sensor').value);
    var fl = parseFloat(w('anpr-fl').value) || 1;
    var plateIdx = parseInt(w('anpr-plate').value);
    var ppmIdx = parseInt(w('anpr-ppm').value);
    var testDist = parseFloat(w('anpr-dist').value) || 1;

    var res = RESOLUTIONS[resIdx];
    var sensor = SENSORS[sensorIdx];
    var plateMm = PLATES[plateIdx].mm;
    var reqPpm = PPM_LEVELS[ppmIdx].ppm;
    var plateM = plateMm / 1000;

    var hfovRad = 2 * Math.atan(sensor.w / (2 * fl));
    var hfovAtDist = 2 * testDist * Math.tan(hfovRad / 2);
    var ppm = res.w / hfovAtDist;
    var pxAcross = ppm * plateM;

    var maxDist = (res.w * plateM) / (reqPpm * 2 * Math.tan(hfovRad / 2));

    var detDist = (res.w * plateM) / (75 * 2 * Math.tan(hfovRad / 2));
    var recDist = (res.w * plateM) / (125 * 2 * Math.tan(hfovRad / 2));
    var idDist = (res.w * plateM) / (250 * 2 * Math.tan(hfovRad / 2));

    w('anpr-max').textContent = maxDist.toFixed(1) + ' m';
    w('anpr-ppm-out').textContent = ppm.toFixed(0) + ' px/m';
    w('anpr-px-plate').textContent = pxAcross.toFixed(0) + ' px';
    w('anpr-hfov').textContent = hfovAtDist.toFixed(1) + ' m';
    w('anpr-det-dist').textContent = detDist.toFixed(1) + ' m';
    w('anpr-rec-dist').textContent = recDist.toFixed(1) + ' m';
    w('anpr-id-dist').textContent = idDist.toFixed(1) + ' m';

    var note = document.getElementById('anpr-note');
    if (pxAcross < 50) {
      note.innerHTML = '&#9888; Pixels across plate (' + pxAcross.toFixed(0) + ' px) is too low for reliable ANPR. Try a longer lens or higher resolution camera.';
      note.style.borderLeftColor = '#ef4444';
    } else if (pxAcross < 120) {
      note.innerHTML = '&#9888; Marginal pixel count (' + pxAcross.toFixed(0) + ' px). ANPR may work in ideal conditions but expect reduced accuracy.';
      note.style.borderLeftColor = '#eab308';
    } else {
      note.innerHTML = 'Good pixel density (' + pxAcross.toFixed(0) + ' px across plate). Suitable for ANPR in most conditions.';
      note.style.borderLeftColor = '#22c55e';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.anpr-field input, .anpr-field select').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
