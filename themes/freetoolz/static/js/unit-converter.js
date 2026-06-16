(function () {
  var WIDGET_HTML =
    '<div class="uc-widget">' +
    '<div class="uc-category-select">' +
    '<label for="uc-category">Category:</label>' +
    '<select id="uc-category">' +
    '<option value="length">Length</option>' +
    '<option value="weight">Weight</option>' +
    '<option value="temperature">Temperature</option>' +
    '<option value="area">Area</option>' +
    '<option value="volume">Volume</option>' +
    '</select>' +
    '</div>' +
    '<div class="uc-converters" id="uc-converters"></div>' +
    '</div>';

  var CSS =
    '.uc-widget{display:flex;flex-direction:column;gap:20px}' +
    '.uc-category-select{display:flex;align-items:center;gap:10px}' +
    '.uc-category-select label{font-size:0.9rem;font-weight:600;color:var(--text)}' +
    '.uc-category-select select{padding:10px 14px;border:2px solid var(--border);border-radius:var(--radius-sm);background:var(--bg);color:var(--text);font-size:0.95rem;cursor:pointer;outline:none;transition:border-color var(--transition);flex:1;max-width:280px}' +
    '.uc-category-select select:focus{border-color:var(--primary)}' +
    '.uc-converters{display:flex;flex-direction:column;gap:6px}' +
    '.uc-row{display:flex;align-items:center;gap:8px;padding:2px 0}' +
    '.uc-row-label{min-width:56px;font-size:0.82rem;font-weight:600;color:var(--text-secondary);text-align:right}' +
    '.uc-row input{flex:1;padding:10px 14px;border:2px solid var(--border);border-radius:var(--radius-sm);background:var(--bg);color:var(--text);font-size:0.95rem;outline:none;transition:border-color var(--transition);font-family:inherit}' +
    '.uc-row input:focus{border-color:var(--primary)}' +
    '.uc-row input::placeholder{color:var(--text-muted);opacity:0.5}' +
    '@media(max-width:480px){.uc-row{flex-wrap:wrap}.uc-row-label{min-width:48px;font-size:0.78rem}.uc-row input{font-size:0.9rem;padding:8px 12px}}';

  var TABLES = {
    length: {
      base: 'm',
      units: {
        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344
      },
      labels: {
        mm: 'mm', cm: 'cm', m: 'm', km: 'km',
        in: 'in', ft: 'ft', yd: 'yd', mi: 'mi'
      }
    },
    weight: {
      base: 'kg',
      units: {
        mg: 0.000001,
        g: 0.001,
        kg: 1,
        oz: 0.0283495,
        lb: 0.453592
      },
      labels: {
        mg: 'mg', g: 'g', kg: 'kg',
        oz: 'oz', lb: 'lb'
      }
    },
    temperature: {
      base: 'celsius',
      units: {
        celsius: 1,
        fahrenheit: 2,
        kelvin: 3
      },
      labels: {
        celsius: '°C', fahrenheit: '°F', kelvin: 'K'
      }
    },
    area: {
      base: 'm²',
      units: {
        'mm²': 0.000001,
        'cm²': 0.0001,
        'm²': 1,
        'km²': 1000000,
        'in²': 0.00064516,
        'ft²': 0.092903,
        acre: 4046.86
      },
      labels: {
        'mm²': 'mm²', 'cm²': 'cm²', 'm²': 'm²', 'km²': 'km²',
        'in²': 'in²', 'ft²': 'ft²', acre: 'acre'
      }
    },
    volume: {
      base: 'L',
      units: {
        mL: 0.001,
        L: 1,
        gal: 3.78541,
        qt: 0.946353,
        pt: 0.473176,
        cup: 0.236588,
        'fl oz': 0.0295735
      },
      labels: {
        mL: 'mL', L: 'L', gal: 'gal (US)',
        qt: 'qt', pt: 'pt', cup: 'cup', 'fl oz': 'fl oz'
      }
    }
  };

  function toBase(value, unit, table) {
    if (table === TABLES.temperature) {
      if (unit === 'celsius') return value;
      if (unit === 'fahrenheit') return (value - 32) * 5 / 9;
      if (unit === 'kelvin') return value - 273.15;
      return value;
    }
    return value * table.units[unit];
  }

  function fromBase(value, unit, table) {
    if (table === TABLES.temperature) {
      if (unit === 'celsius') return value;
      if (unit === 'fahrenheit') return value * 9 / 5 + 32;
      if (unit === 'kelvin') return value + 273.15;
      return value;
    }
    return value / table.units[unit];
  }

  function formatNum(v) {
    if (!isFinite(v)) return '';
    if (Math.abs(v) >= 1e9 || (Math.abs(v) > 0 && Math.abs(v) < 1e-6)) return v.toExponential(6);
    if (Number.isInteger(v) && Math.abs(v) < 1e9) return v.toString();
    var s = v.toFixed(6);
    while (s.indexOf('.') >= 0 && s.charAt(s.length - 1) === '0') s = s.slice(0, -1);
    if (s.charAt(s.length - 1) === '.') s = s.slice(0, -1);
    return s;
  }

  function parseNum(s) {
    var v = parseFloat(s);
    return isNaN(v) ? NaN : v;
  }

  function buildRows(category) {
    var container = document.getElementById('uc-converters');
    var table = TABLES[category];
    if (!table) return;
    var html = '';
    var keys = Object.keys(table.units);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var label = table.labels[k] || k;
      html += '<div class="uc-row">' +
        '<span class="uc-row-label">' + label + '</span>' +
        '<input type="text" id="uc-input-' + k + '" data-unit="' + k + '" placeholder="0" autocomplete="off">' +
        '</div>';
    }
    container.innerHTML = html;

    var inputs = container.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('input', onChange);
    }
  }

  function onChange(e) {
    var input = e.target;
    var category = document.getElementById('uc-category').value;
    var table = TABLES[category];
    if (!table) return;

    var raw = input.value.trim();
    if (raw === '') {
      clearAll();
      return;
    }

    var val = parseNum(raw);
    if (isNaN(val)) return;

    var unit = input.getAttribute('data-unit');
    var baseVal = toBase(val, unit, table);

    var container = document.getElementById('uc-converters');
    var inputs = container.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      var other = inputs[i];
      var otherUnit = other.getAttribute('data-unit');
      if (otherUnit === unit) continue;
      var converted = fromBase(baseVal, otherUnit, table);
      other.value = formatNum(converted);
    }
  }

  function clearAll() {
    var container = document.getElementById('uc-converters');
    var inputs = container.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
  }

  function onCategoryChange() {
    var category = document.getElementById('uc-category').value;
    buildRows(category);
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = WIDGET_HTML;

    document.getElementById('uc-category').addEventListener('change', onCategoryChange);
    buildRows('length');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
