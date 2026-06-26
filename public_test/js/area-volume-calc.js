(function () {
  var w = document.getElementById.bind(document);

  var SHAPES = {
    area: [
      { id: 'square', label: 'Square', fields: [{ id: 'side', label: 'Side (s)' }], calc: function (v) { return v[0] * v[0]; }, formula: 'A = s<sUp>2</sUp>' },
      { id: 'rectangle', label: 'Rectangle', fields: [{ id: 'len', label: 'Length (l)' }, { id: 'wid', label: 'Width (w)' }], calc: function (v) { return v[0] * v[1]; }, formula: 'A = l &times; w' },
      { id: 'circle', label: 'Circle', fields: [{ id: 'rad', label: 'Radius (r)' }], calc: function (v) { return Math.PI * v[0] * v[0]; }, formula: 'A = &pi;r<sUp>2</sUp>' },
      { id: 'triangle', label: 'Triangle', fields: [{ id: 'base', label: 'Base (b)' }, { id: 'ht', label: 'Height (h)' }], calc: function (v) { return 0.5 * v[0] * v[1]; }, formula: 'A = &frac12;bh' },
      { id: 'parallelogram', label: 'Parallelogram', fields: [{ id: 'base', label: 'Base (b)' }, { id: 'ht', label: 'Height (h)' }], calc: function (v) { return v[0] * v[1]; }, formula: 'A = b &times; h' },
      { id: 'trapezoid', label: 'Trapezoid', fields: [{ id: 'base1', label: 'Base 1 (a)' }, { id: 'base2', label: 'Base 2 (b)' }, { id: 'ht', label: 'Height (h)' }], calc: function (v) { return 0.5 * (v[0] + v[1]) * v[2]; }, formula: 'A = &frac12;(a+b)h' }
    ],
    volume: [
      { id: 'cube', label: 'Cube', fields: [{ id: 'side', label: 'Side (s)' }], calc: function (v) { return v[0] * v[0] * v[0]; }, formula: 'V = s<sUp>3</sUp>' },
      { id: 'rectprism', label: 'Rectangular Prism', fields: [{ id: 'len', label: 'Length (l)' }, { id: 'wid', label: 'Width (w)' }, { id: 'ht', label: 'Height (h)' }], calc: function (v) { return v[0] * v[1] * v[2]; }, formula: 'V = l &times; w &times; h' },
      { id: 'sphere', label: 'Sphere', fields: [{ id: 'rad', label: 'Radius (r)' }], calc: function (v) { return (4 / 3) * Math.PI * v[0] * v[0] * v[0]; }, formula: 'V = &frac43;&pi;r<sUp>3</sUp>' },
      { id: 'cylinder', label: 'Cylinder', fields: [{ id: 'rad', label: 'Radius (r)' }, { id: 'ht', label: 'Height (h)' }], calc: function (v) { return Math.PI * v[0] * v[0] * v[1]; }, formula: 'V = &pi;r<sUp>2</sUp>h' },
      { id: 'cone', label: 'Cone', fields: [{ id: 'rad', label: 'Radius (r)' }, { id: 'ht', label: 'Height (h)' }], calc: function (v) { return (1 / 3) * Math.PI * v[0] * v[0] * v[1]; }, formula: 'V = &frac13;&pi;r<sUp>2</sUp>h' }
    ]
  };

  var HTML =
    '<div class="geo-widget">' +
    '<div class="geo-bar">' +
    '<div class="geo-field"><label>Mode</label><select id="geo-mode"><option value="area">Area</option><option value="volume">Volume</option></select></div>' +
    '<div class="geo-field"><label>Shape</label><select id="geo-shape"></select></div>' +
    '<div class="geo-field"><label>Unit</label><select id="geo-unit"><option value="cm">cm</option><option value="m" selected>m</option><option value="in">in</option><option value="ft">ft</option></select></div>' +
    '</div>' +
    '<div class="geo-fields" id="geo-fields"></div>' +
    '<div class="geo-result-box">' +
    '<div class="geo-result" id="geo-result">0</div>' +
    '<div class="geo-formula" id="geo-formula">A = l &times; w</div>' +
    '</div></div>';

  var CSS =
    '.geo-widget{display:flex;flex-direction:column;gap:16px}' +
    '.geo-bar{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.geo-field{display:flex;flex-direction:column;gap:4px}' +
    '.geo-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.geo-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none}' +
    '.geo-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.geo-fields{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.geo-field-inner{display:flex;flex-direction:column;gap:4px}' +
    '.geo-field-inner>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.geo-field-inner input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.geo-field-inner input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.geo-result-box{text-align:center;padding:24px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}' +
    '.geo-result{font-size:2.5rem;font-weight:800;color:var(--primary)}' +
    '.geo-formula{font-size:.9rem;color:var(--text-secondary);margin-top:6px}' +
    '@media(max-width:500px){.geo-bar{grid-template-columns:1fr}.geo-fields{grid-template-columns:1fr}}';

  function loadShape() {
    var mode = w('geo-mode').value;
    var shapeId = w('geo-shape').value;
    var shapes = SHAPES[mode];
    var shape = null;
    for (var i = 0; i < shapes.length; i++) {
      if (shapes[i].id === shapeId) { shape = shapes[i]; break; }
    }
    if (!shape) shape = shapes[0];

    var fieldsContainer = document.getElementById('geo-fields');
    fieldsContainer.innerHTML = '';
    var vals = [];
    for (var j = 0; j < shape.fields.length; j++) {
      var f = shape.fields[j];
      var div = document.createElement('div');
      div.className = 'geo-field-inner';
      div.innerHTML = '<label>' + f.label + '</label><input type="number" id="geo-' + f.id + '" value="10" step="any" min="0">';
      fieldsContainer.appendChild(div);
      var input = div.querySelector('input');
      input.addEventListener('input', function () { calc(); });
      input.addEventListener('change', function () { calc(); });
      vals.push(input);
    }
    calc();
  }

  function populateShapes() {
    var mode = w('geo-mode').value;
    var select = w('geo-shape');
    var shapes = SHAPES[mode];
    var current = select.value;
    select.innerHTML = shapes.map(function (s) { return '<option value="' + s.id + '"' + (s.id === current ? ' selected' : '') + '>' + s.label + '</option>'; }).join('');
    loadShape();
  }

  function calc() {
    var mode = w('geo-mode').value;
    var shapeId = w('geo-shape').value;
    var unit = w('geo-unit').value;
    var shapes = SHAPES[mode];
    var shape = null;
    for (var i = 0; i < shapes.length; i++) {
      if (shapes[i].id === shapeId) { shape = shapes[i]; break; }
    }
    if (!shape) return;

    var values = [];
    var unitLabels = { cm: 'cm', m: 'm', in: 'in', ft: 'ft' };
    var unitLabel = unitLabels[unit] || '';
    var areaUnit = unitLabel;
    var volUnit = unitLabel;

    for (var j = 0; j < shape.fields.length; j++) {
      var f = shape.fields[j];
      var input = document.getElementById('geo-' + f.id);
      values.push(parseFloat(input ? input.value : 0) || 0);
    }

    var result = shape.calc(values);

    w('geo-result').textContent = result.toFixed(4) + ' ' + (mode === 'area' ? areaUnit + '<sUp>2</sUp>' : volUnit + '<sUp>3</sUp>');
    w('geo-formula').innerHTML = shape.formula + ' = ' + result.toFixed(4) + ' ' + (mode === 'area' ? unitLabel + '<sUp>2</sUp>' : unitLabel + '<sUp>3</sUp>');
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    // Populate shapes initially
    var modeSelect = w('geo-mode');
    modeSelect.addEventListener('change', populateShapes);
    w('geo-shape').addEventListener('change', loadShape);
    w('geo-unit').addEventListener('change', calc);
    populateShapes();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
