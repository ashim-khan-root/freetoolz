(function () {
  var w = document.getElementById.bind(document);

  function cToF(c) { return c * 9 / 5 + 32; }
  function cToK(c) { return c + 273.15; }
  function fToC(f) { return (f - 32) * 5 / 9; }
  function fToK(f) { return (f - 32) * 5 / 9 + 273.15; }
  function kToC(k) { return k - 273.15; }
  function kToF(k) { return (k - 273.15) * 9 / 5 + 32; }

  var CONVERTERS = { c: { c: function (v) { return v; }, f: cToF, k: cToK }, f: { c: fToC, f: function (v) { return v; }, k: fToK }, k: { c: kToC, f: kToF, k: function (v) { return v; } } };
  var LABELS = { c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin' };
  var REF = { c: { freeze: 0, boil: 100, abs: -273.15 }, f: { freeze: 32, boil: 212, abs: -459.67 }, k: { freeze: 273.15, boil: 373.15, abs: 0 } };

  var opts = function (selected) {
    var html = '';
    for (var k in LABELS) html += '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' + LABELS[k] + '</option>';
    return html;
  };

  var HTML =
    '<div class="conv-widget">' +
    '<div class="conv-row">' +
    '<div class="conv-field"><label>Value</label><input type="number" id="conv-val" value="100" step="any"></div>' +
    '<div class="conv-field"><label>From</label><select id="conv-from">' + opts('c') + '</select></div>' +
    '<div class="conv-field"><label>To</label><select id="conv-to">' + opts('f') + '</select></div>' +
    '</div>' +
    '<div class="conv-result-box">' +
    '<div class="conv-result" id="conv-result">212</div>' +
    '<div class="conv-detail" id="conv-detail">100 Celsius = 212 Fahrenheit</div>' +
    '</div>' +
    '<button class="conv-swap" id="conv-swap">&#x21C4; Swap Units</button>' +
    '<div class="conv-ref" id="conv-ref"></div></div>';

  var CSS =
    '.conv-widget{display:flex;flex-direction:column;gap:14px}' +
    '.conv-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.conv-field{display:flex;flex-direction:column;gap:4px}' +
    '.conv-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.conv-field input,.conv-field select{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.conv-field input:focus,.conv-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.conv-result-box{text-align:center;padding:24px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}' +
    '.conv-result{font-size:2.2rem;font-weight:800;color:var(--primary)}' +
    '.conv-detail{font-size:.9rem;color:var(--text-secondary);margin-top:4px}' +
    '.conv-swap{padding:10px 20px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;font-weight:600;cursor:pointer;background:var(--bg);color:var(--text-secondary);align-self:center}' +
    '.conv-swap:hover{border-color:var(--primary);color:var(--primary)}' +
    '.conv-ref{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;padding:14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.82rem}' +
    '.conv-ref-item{text-align:center}' +
    '.conv-ref-item strong{display:block;font-size:.7rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.conv-ref-item span{font-weight:600}' +
    '@media(max-width:500px){.conv-row{grid-template-columns:1fr}.conv-ref{grid-template-columns:1fr}}';

  function convert() {
    var val = parseFloat(w('conv-val').value) || 0;
    var from = w('conv-from').value;
    var to = w('conv-to').value;
    var result = CONVERTERS[from][to](val);
    w('conv-result').textContent = result.toFixed(2);
    w('conv-detail').innerHTML = val + ' ' + LABELS[from] + ' = ' + result.toFixed(2) + ' ' + LABELS[to];

    var refHtml = '';
    for (var k in LABELS) {
      var r = REF[k];
      refHtml += '<div class="conv-ref-item"><strong>' + LABELS[k] + '</strong><span>' + r.freeze + ' (freeze) / ' + r.boil + ' (boil) / ' + r.abs + ' (abs zero)</span></div>';
    }
    document.getElementById('conv-ref').innerHTML = refHtml;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('conv-val').addEventListener('input', convert);
    w('conv-from').addEventListener('change', convert);
    w('conv-to').addEventListener('change', convert);
    w('conv-swap').addEventListener('click', function () { var t = w('conv-from').value; w('conv-from').value = w('conv-to').value; w('conv-to').value = t; convert(); });
    convert();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
