(function () {
  var w = document.getElementById.bind(document);

  var SCENES = [
    { label: 'Bright sunlight', lux: 50000 },
    { label: 'Overcast daylight', lux: 10000 },
    { label: 'Well-lit office', lux: 500 },
    { label: 'Supermarket / retail', lux: 750 },
    { label: 'Parking lot (well-lit)', lux: 50 },
    { label: 'Parking lot (dim)', lux: 10 },
    { label: 'Street at night (lit)', lux: 20 },
    { label: 'Street at night (unlit)', lux: 1 },
    { label: 'Warehouse (lit)', lux: 150 },
    { label: 'Warehouse (dim)', lux: 30 },
    { label: 'Residential at night (lit)', lux: 5 },
    { label: 'Residential at night (unlit)', lux: 0.5 },
    { label: 'Moonlit night', lux: 0.2 },
    { label: 'Starlight only', lux: 0.01 }
  ];

  var sceneOpts = '';
  for (var i = 0; i < SCENES.length; i++) sceneOpts += '<option value="' + i + '">' + SCENES[i].label + ' (' + SCENES[i].lux + ' lux)</option>';

  var HTML =
    '<div class="mil-widget">' +
    '<div class="mil-form-grid">' +
    '<div class="mil-field"><label>Camera Min. Illumination (lux)</label><input type="number" id="mil-cam" value="0.05" min="0.001" max="100" step="0.001"></div>' +
    '<div class="mil-field"><label>Camera Mode</label><select id="mil-mode"><option value="color">Color</option><option value="bw" selected>B&W / IR Mode</option></select></div>' +
    '<div class="mil-field"><label>Scene Type</label><select id="mil-scene">' + sceneOpts + '</select></div>' +
    '<div class="mil-field"><label>Or Custom Scene Lux</label><input type="number" id="mil-custom" value="" min="0" max="100000" step="0.1" placeholder="Leave blank to use scene"></div>' +
    '</div>' +
    '<div class="mil-results-grid">' +
    '<div class="mil-rc" style="background:var(--primary);color:#fff"><span class="mil-rl" style="color:rgba(255,255,255,.7)">Camera Rating</span><span class="mil-rv" id="mil-rating" style="color:#fff">—</span></div>' +
    '<div class="mil-rc"><span class="mil-rl">Scene Illumination</span><span class="mil-rv" id="mil-scene-lux">0 lux</span></div>' +
    '<div class="mil-rc"><span class="mil-rl">Safety Margin</span><span class="mil-rv" id="mil-margin">0&times;</span></div>' +
    '</div>' +
    '<div class="mil-recs" id="mil-recs"></div>' +
    '<div class="mil-note" id="mil-note">Camera min illumination specs are measured in ideal lab conditions. Real-world performance is 2-3&times; worse. Always add headroom.</div></div>';

  var CSS =
    '.mil-widget{display:flex;flex-direction:column;gap:16px}' +
    '.mil-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}' +
    '.mil-field{display:flex;flex-direction:column;gap:4px}' +
    '.mil-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.mil-field input,.mil-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.mil-field input:focus,.mil-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.mil-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.mil-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.mil-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.mil-rv{font-size:1.15rem;font-weight:800;color:var(--primary);display:block}' +
    '.mil-recs{padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;line-height:1.7}' +
    '.mil-note{font-size:.82rem;color:var(--text-secondary);padding:12px 16px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:768px){.mil-form-grid{grid-template-columns:1fr 1fr}.mil-results-grid{grid-template-columns:1fr}}';

  function calc() {
    var camLux = parseFloat(w('mil-cam').value) || 0;
    var mode = w('mil-mode').value;
    var sceneIdx = parseInt(w('mil-scene').value);
    var custom = parseFloat(w('mil-custom').value);

    var sceneLux = !isNaN(custom) && custom > 0 ? custom : SCENES[sceneIdx].lux;
    var effLux = mode === 'bw' ? camLux * 3 : camLux;
    var margin = effLux > 0 ? sceneLux / effLux : 0;

    w('mil-scene-lux').textContent = sceneLux >= 1000 ? sceneLux.toLocaleString() + ' lux' : sceneLux + ' lux';

    var rating = '', badge = '';
    if (effLux <= 0) {
      rating = 'No spec';
      badge = '—';
    } else if (margin >= 10) {
      rating = 'Excellent';
      badge = '<span style="color:#22c55e">&#9711;</span>';
    } else if (margin >= 4) {
      rating = 'Good';
      badge = '<span style="color:#22c55e">&#9711;</span>';
    } else if (margin >= 2) {
      rating = 'Adequate';
      badge = '<span style="color:#eab308">&#9679;</span>';
    } else if (margin >= 1) {
      rating = 'Marginal';
      badge = '<span style="color:#eab308">&#9679;</span>';
    } else {
      rating = 'Insufficient';
      badge = '<span style="color:#ef4444">&#10060;</span>';
    }
    w('mil-rating').innerHTML = badge + ' ' + rating;
    w('mil-margin').textContent = margin.toFixed(1) + '&times;';

    var recs = document.getElementById('mil-recs');
    var lines = [];
    lines.push('<strong>Scene:</strong> ' + SCENES[sceneIdx].label + ' (' + sceneLux + ' lux)');
    lines.push('<strong>Camera:</strong> ' + camLux + ' lux min. illumination (' + mode + ' mode, effective ' + effLux + ' lux)');

    if (mode === 'bw') {
      lines.push('<strong>IR mode boost:</strong> B&W/IR mode gives ~3&times; sensitivity over color');
    }

    if (margin < 1) {
      lines.push('<strong>Result:</strong> Camera cannot see in this lighting. ' +
        'Needs ' + (effLux).toFixed(3) + ' lux minimum but scene is ' + sceneLux + ' lux. ' +
        '<span style="color:#ef4444">Add IR illuminators or switch to a camera with lower min. illumination.</span>');
    } else if (margin < 2) {
      lines.push('<strong>Result:</strong> Barely sufficient (' + margin.toFixed(1) + '&times; margin). ' +
        '<span style="color:#eab308">Image quality will be poor in low-light conditions. Consider IR illumination or a higher-sensitivity camera.</span>');
    } else if (margin < 4) {
      lines.push('<strong>Result:</strong> Adequate (' + margin.toFixed(1) + '&times; margin). ' +
        'Acceptable for most applications but may struggle at the far end of the range.');
    } else {
      lines.push('<strong>Result:</strong> Good margin (' + margin.toFixed(1) + '&times;). ' +
        'Camera will perform well in this lighting condition.');
    }

    recs.innerHTML = lines.join('<br>');

    var note = document.getElementById('mil-note');
    if (margin < 1) {
      note.style.borderLeftColor = '#ef4444';
    } else if (margin < 2) {
      note.style.borderLeftColor = '#eab308';
    } else {
      note.style.borderLeftColor = '#22c55e';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.mil-field input, .mil-field select').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
