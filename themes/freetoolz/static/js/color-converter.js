(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="cc-widget">' +
      '<div class="cc-preview" id="cc-preview"></div>' +
      '<div class="cc-field"><label>Pick a color</label><input type="color" id="cc-picker" value="#6366f1"></div>' +
      '<div class="cc-field"><label for="cc-hex">HEX</label><input type="text" id="cc-hex" value="#6366f1" class="cc-copy"></div>' +
      '<div class="cc-field"><label for="cc-rgb">RGB</label><input type="text" id="cc-rgb" value="rgb(99, 102, 241)" class="cc-copy"></div>' +
      '<div class="cc-field"><label for="cc-hsl">HSL</label><input type="text" id="cc-hsl" value="hsl(239, 84%, 67%)" class="cc-copy"></div>' +
      '<div class="cc-field"><label for="cc-cmyk">CMYK</label><input type="text" id="cc-cmyk" value="cmyk(59%, 58%, 0%, 5%)" class="cc-copy"></div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.cc-widget{display:flex;flex-direction:column;gap:14px}' +
    '.cc-preview{height:80px;border-radius:var(--radius);border:1px solid var(--border);transition:background var(--transition)}' +
    '.cc-field{display:flex;flex-direction:column;gap:4px}' +
    '.cc-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.cc-field input[type="color"]{width:60px;height:44px;padding:4px;border:2px solid var(--border);border-radius:var(--radius-sm);cursor:pointer;background:var(--bg)}' +
    '.cc-field input[type="text"]{padding:12px 14px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;font-family:monospace;background:var(--bg);color:var(--text);outline:none;transition:border-color var(--transition),box-shadow var(--transition);cursor:pointer}' +
    '.cc-field input[type="text"]:focus{border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-light)}' +
    '.cc-field input[type="text"]:hover{border-color:var(--primary-light)}';
  document.head.appendChild(style);

  var picker = document.getElementById('cc-picker');
  var hexInp = document.getElementById('cc-hex');
  var rgbInp = document.getElementById('cc-rgb');
  var hslInp = document.getElementById('cc-hsl');
  var cmykInp = document.getElementById('cc-cmyk');
  var preview = document.getElementById('cc-preview');
  var updating = false;

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return { r: r, g: g, b: b };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function rgbToCmyk(r, g, b) {
    var c = 1 - (r / 255);
    var m = 1 - (g / 255);
    var y = 1 - (b / 255);
    var k = Math.min(c, m, y);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);
    return { c: c, m: m, y: y, k: k };
  }

  function updateFromHex(hex) {
    if (updating) return;
    updating = true;
    hex = hex.trim();
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) { updating = false; return; }
    var rgb = hexToRgb(hex);
    var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    var cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    hexInp.value = hex.toUpperCase();
    rgbInp.value = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    hslInp.value = 'hsl(' + hsl.h + ', ' + hsl.s + '%, ' + hsl.l + '%)';
    cmykInp.value = 'cmyk(' + cmyk.c + '%, ' + cmyk.m + '%, ' + cmyk.y + '%, ' + cmyk.k + '%)';
    preview.style.background = hex;
    picker.value = hex;
    updating = false;
  }

  function copyHandler(inp) {
    inp.addEventListener('click', function () {
      var val = this.value;
      navigator.clipboard.writeText(val).catch(function () { this.select(); }.bind(this));
    });
  }

  copyHandler(hexInp);
  copyHandler(rgbInp);
  copyHandler(hslInp);
  copyHandler(cmykInp);

  picker.addEventListener('input', function () { updateFromHex(this.value); });
  hexInp.addEventListener('input', function () { updateFromHex(this.value); });

  updateFromHex('#6366f1');
})();
