(function () {
  var w = document.getElementById.bind(document);

  // Sensor sizes in mm (width, height) for common security camera sensors
  var SENSORS = {
    '1_3':   { w: 4.8, h: 3.6, label: '1/3" (6mm)' },
    '1_2_7': { w: 5.37, h: 4.04, label: '1/2.7" (6.7mm)' },
    '1_2_5': { w: 5.76, h: 4.29, label: '1/2.5" (7.2mm)' },
    '1_2':   { w: 6.4, h: 4.8, label: '1/2" (8mm)' },
    '1_1_8': { w: 7.18, h: 5.32, label: '1/1.8" (8.9mm)' }
  };

  var HTML =
    '<div class="fov-widget">' +
    '<div class="fov-form-grid">' +
    '<div class="fov-field"><label>Sensor Size</label><select id="fov-sensor">' +
    '<option value="1_3">1/3" (2MP/1080p typical)</option>' +
    '<option value="1_2_7" selected>1/2.7" (2-4MP typical)</option>' +
    '<option value="1_2_5">1/2.5" (4-5MP typical)</option>' +
    '<option value="1_2">1/2" (5-8MP typical)</option>' +
    '<option value="1_1_8">1/1.8" (8-12MP typical)</option>' +
    '</select></div>' +
    '<div class="fov-field"><label>Focal Length (mm)</label><input type="number" id="fov-focal" value="4" min="1" max="50" step="0.5"></div>' +
    '<div class="fov-field"><label>Distance to Target (m)</label><input type="number" id="fov-distance" value="10" min="0.5" max="500" step="1"></div>' +
    '<div class="fov-field"><label>Desired Width (m) — optional</label><input type="number" id="fov-target-w" placeholder="Leave empty for calc" min="1" max="500" step="1"></div>' +
    '</div>' +
    '<div class="fov-results-grid">' +
    '<div class="fov-rc"><span class="fov-rl">Horizontal FOV</span><span class="fov-rv" id="fov-h">0&deg;</span></div>' +
    '<div class="fov-rc"><span class="fov-rl">Vertical FOV</span><span class="fov-rv" id="fov-v">0&deg;</span></div>' +
    '<div class="fov-rc" style="background:var(--primary);color:#fff"><span class="fov-rl" style="color:rgba(255,255,255,.7)">Coverage at Distance</span><span class="fov-rv" id="fov-coverage">0 &times; 0 m</span></div>' +
    '<div class="fov-rc"><span class="fov-rl">Lens Type</span><span class="fov-rv" id="fov-lens-type" style="font-size:1rem">Standard</span></div>' +
    '</div>' +
    '<div class="fov-note" id="fov-note">Adjust sensor size and focal length to see field of view.</div>' +
    '<div class="fov-visual" id="fov-visual">' +
    '<svg viewBox="0 0 260 200" style="width:100%;max-width:300px;display:block;margin:0 auto">' +
    '<defs><linearGradient id="fov-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--primary)" stop-opacity=".3"/><stop offset="100%" stop-color="var(--primary)" stop-opacity=".05"/></linearGradient></defs>' +
    '<line x1="130" y1="190" x2="10" y2="190" stroke="var(--border)" stroke-width="1"/><line x1="130" y1="190" x2="250" y2="190" stroke="var(--border)" stroke-width="1"/>' +
    '<line x1="130" y1="190" x2="130" y2="10" stroke="var(--border)" stroke-dasharray="4,4" stroke-width="1"/>' +
    '<polygon id="fov-poly" points="130,190 30,190 130,40" fill="url(#fov-grad)" stroke="var(--primary)" stroke-width="2"/>' +
    '<circle cx="130" cy="190" r="4" fill="var(--primary)"/>' +
    '<text x="130" y="185" text-anchor="middle" font-size="10" fill="var(--text-tertiary)">Camera</text>' +
    '<text id="fov-label-l" x="30" y="202" text-anchor="middle" font-size="9" fill="var(--text-tertiary)">0&deg;</text>' +
    '<text id="fov-label-r" x="230" y="202" text-anchor="middle" font-size="9" fill="var(--text-tertiary)">0&deg;</text>' +
    '<text id="fov-label-cover" x="130" y="28" text-anchor="middle" font-size="9" fill="var(--primary)" font-weight="600">0m</text>' +
    '</svg></div></div>';

  var CSS =
    '.fov-widget{display:flex;flex-direction:column;gap:20px}' +
    '.fov-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px}' +
    '.fov-field{display:flex;flex-direction:column;gap:4px}' +
    '.fov-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.fov-field input,.fov-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none}' +
    '.fov-field input:focus,.fov-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.fov-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.fov-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px;text-align:center}' +
    '.fov-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.fov-rv{font-size:1.2rem;font-weight:800;color:var(--primary);display:block}' +
    '.fov-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '.fov-visual{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:16px}' +
    '@media(max-width:900px){.fov-form-grid{grid-template-columns:1fr 1fr}}' +
    '@media(max-width:768px){.fov-results-grid{grid-template-columns:1fr 1fr}}' +
    '@media(max-width:480px){.fov-form-grid{grid-template-columns:1fr}}';

  function deg(rad) { return rad * 180 / Math.PI; }

  function calc() {
    var sensorId = w('fov-sensor').value;
    var sensor = SENSORS[sensorId];
    var focal = parseFloat(w('fov-focal').value) || 1;
    var dist = parseFloat(w('fov-distance').value) || 0;
    var targetW = parseFloat(w('fov-target-w').value) || 0;

    var hFovRad = 2 * Math.atan(sensor.w / (2 * focal));
    var vFovRad = 2 * Math.atan(sensor.h / (2 * focal));
    var hFov = deg(hFovRad);
    var vFov = deg(vFovRad);

    var covW = dist * Math.tan(hFovRad / 2) * 2;
    var covH = dist * Math.tan(vFovRad / 2) * 2;

    // If target width provided, suggest focal length
    var suggestedFocal = null;
    if (targetW > 0 && dist > 0) {
      suggestedFocal = (sensor.w * dist) / (targetW * 2 * Math.tan(hFovRad / 2) * 2);
      // Actually simpler: recompute needed focal
      var neededFocal = (sensor.w * dist) / targetW;
      if (neededFocal > 0.1) suggestedFocal = neededFocal;
    }

    w('fov-h').textContent = hFov.toFixed(1) + '°';
    w('fov-v').textContent = vFov.toFixed(1) + '°';
    w('fov-coverage').textContent = covW.toFixed(1) + ' × ' + covH.toFixed(1) + ' m';

    var lensType = '';
    if (focal <= 2.8) lensType = 'Wide Angle';
    else if (focal <= 4) lensType = 'Standard';
    else if (focal <= 6) lensType = 'Standard Tele';
    else if (focal <= 12) lensType = 'Telephoto';
    else lensType = 'Long Telephoto';
    w('fov-lens-type').textContent = lensType;

    var note = document.getElementById('fov-note');
    var noteText = '';
    if (dist > 0) {
      noteText = sensor.label + ' sensor, ' + focal + 'mm lens at ' + dist + 'm: ' +
        hFov.toFixed(1) + '° H × ' + vFov.toFixed(1) + '° V, covering ' + covW.toFixed(1) + ' × ' + covH.toFixed(1) + ' m area.';
      if (suggestedFocal && targetW > 0) {
        noteText += ' For ' + targetW + 'm width at this distance, try ~' + suggestedFocal.toFixed(1) + 'mm lens.';
      }
    } else {
      noteText = 'Enter distance to see coverage area.';
    }
    note.innerHTML = noteText;

    // Update SVG
    var poly = document.getElementById('fov-poly');
    var maxAngle = 120;
    var angleDeg = Math.min(hFov, maxAngle);
    // Map angle to SVG: half-angle on each side
    var halfAngle = Math.min(angleDeg / 2, 60);
    var halfRad = halfAngle * Math.PI / 180;
    var svgH = 150;
    var baseX = 130;
    var baseY = 190;
    var armLen = 140;
    var leftX = baseX - Math.sin(halfRad) * armLen;
    var leftY = baseY - Math.cos(halfRad) * armLen;
    var rightX = baseX + Math.sin(halfRad) * armLen;
    var rightY = baseY - Math.cos(halfRad) * armLen;
    poly.setAttribute('points', baseX + ',' + baseY + ' ' + leftX + ',' + leftY + ' ' + rightX + ',' + rightY);

    document.getElementById('fov-label-l').textContent = '- ' + (hFov / 2).toFixed(0) + '°';
    document.getElementById('fov-label-l').setAttribute('x', Math.max(15, leftX));
    document.getElementById('fov-label-r').textContent = '+ ' + (hFov / 2).toFixed(0) + '°';
    document.getElementById('fov-label-r').setAttribute('x', Math.min(245, rightX));

    var coverEl = document.getElementById('fov-label-cover');
    if (dist > 0 && covW > 0) {
      coverEl.textContent = covW.toFixed(1) + 'm';
      coverEl.setAttribute('y', Math.max(15, leftY - 8));
    } else {
      coverEl.textContent = '—';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.fov-field input, .fov-field select').forEach(function (e) {
      e.addEventListener('input', calc); e.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
