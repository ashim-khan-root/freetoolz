(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="rng-widget">' +
      '<div class="rng-bar">' +
        '<div class="rng-field"><label for="rng-min">Minimum</label><input type="number" id="rng-min" value="1"></div>' +
        '<div class="rng-field"><label for="rng-max">Maximum</label><input type="number" id="rng-max" value="100"></div>' +
        '<div class="rng-field"><label for="rng-count">Count</label><input type="number" id="rng-count" value="1" min="1" max="100"></div>' +
      '</div>' +
      '<div class="rng-opts">' +
        '<label class="rng-check"><input type="checkbox" id="rng-unique"> <span>Unique numbers</span></label>' +
        '<label class="rng-check"><input type="checkbox" id="rng-sort"> <span>Sort ascending</span></label>' +
      '</div>' +
      '<button id="rng-btn" class="rng-btn">Generate</button>' +
      '<div class="rng-output" id="rng-output"></div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.rng-widget{display:flex;flex-direction:column;gap:16px}' +
    '.rng-bar{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.rng-field{display:flex;flex-direction:column;gap:4px}' +
    '.rng-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.rng-field input{padding:10px 12px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none;transition:border-color var(--transition)}' +
    '.rng-field input:focus{border-color:var(--primary)}' +
    '.rng-opts{display:flex;gap:20px;flex-wrap:wrap}' +
    '.rng-check{display:flex;align-items:center;gap:6px;font-size:.9rem;color:var(--text);cursor:pointer}' +
    '.rng-check input[type="checkbox"]{width:16px;height:16px;accent-color:var(--primary);cursor:pointer}' +
    '.rng-btn{padding:12px 32px;border:none;border-radius:var(--radius-sm);font-size:1rem;font-weight:700;cursor:pointer;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;transition:var(--transition);align-self:flex-start}' +
    '.rng-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,.3)}' +
    '.rng-output{display:flex;flex-wrap:wrap;gap:8px;padding:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);min-height:50px;font-size:1.1rem;font-weight:600}' +
    '.rng-num{padding:8px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);color:var(--primary)}' +
    '.rng-empty{color:var(--text-secondary);font-weight:400;font-size:.9rem}' +
    '.rng-err{color:#ef4444;font-size:.85rem;font-weight:400}' +
    '@media(max-width:480px){.rng-bar{grid-template-columns:1fr 1fr}}';
  document.head.appendChild(style);

  function generate() {
    var min = parseInt(document.getElementById('rng-min').value) || 0;
    var max = parseInt(document.getElementById('rng-max').value) || 100;
    var count = parseInt(document.getElementById('rng-count').value) || 1;
    var unique = document.getElementById('rng-unique').checked;
    var sort = document.getElementById('rng-sort').checked;
    var output = document.getElementById('rng-output');

    if (min > max) { output.innerHTML = '<span class="rng-err">Minimum must be less than or equal to Maximum</span>'; return; }
    if (count < 1) { output.innerHTML = '<span class="rng-err">Count must be at least 1</span>'; return; }
    if (count > 100) { output.innerHTML = '<span class="rng-err">Maximum count is 100</span>'; return; }

    var range = max - min + 1;
    if (unique && count > range) {
      output.innerHTML = '<span class="rng-err">Range too small for ' + count + ' unique numbers</span>';
      return;
    }

    var crypto = window.crypto || window.msCrypto;
    var results = [];
    if (unique) {
      var pool = [];
      for (var i = min; i <= max; i++) pool.push(i);
      for (var n = range - 1; n > 0; n--) {
        var r = 0;
        if (crypto) { var arr = new Uint32Array(1); crypto.getRandomValues(arr); r = arr[0] % (n + 1); }
        else { r = Math.floor(Math.random() * (n + 1)); }
        var tmp = pool[n]; pool[n] = pool[r]; pool[r] = tmp;
      }
      results = pool.slice(0, count);
    } else {
      for (var j = 0; j < count; j++) {
        if (crypto) { var arr2 = new Uint32Array(1); crypto.getRandomValues(arr2); results.push(min + (arr2[0] % range)); }
        else { results.push(min + Math.floor(Math.random() * range)); }
      }
    }

    if (sort) results.sort(function (a, b) { return a - b; });

    var html = '';
    for (var k = 0; k < results.length; k++) {
      html += '<span class="rng-num">' + results[k] + '</span>';
    }
    output.innerHTML = html || '<span class="rng-empty">No numbers generated</span>';
  }

  document.getElementById('rng-btn').addEventListener('click', generate);
})();
