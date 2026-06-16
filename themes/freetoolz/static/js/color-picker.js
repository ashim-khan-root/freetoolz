(function () {
  var style = document.createElement("style");
  style.textContent =
    ":root{--cp-radius:12px;--cp-gap:20px;--cp-bg:#fff;--cp-border:#e5e7eb;--cp-text:#1f2937;--cp-label:#6b7280;--cp-input-bg:#f9fafb;--cp-input-border:#d1d5db;--cp-primary:#6366f1;--cp-primary-hover:#4f46e5;--cp-shadow:0 4px 24px rgba(0,0,0,.08)}.cp-widget{display:flex;gap:var(--cp-gap);padding:24px;background:var(--cp-bg);border-radius:var(--cp-radius);box-shadow:var(--cp-shadow);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}.cp-preview-section{display:flex;flex-direction:column;align-items:center;gap:16px}.cp-color-preview{width:200px;height:200px;border-radius:var(--cp-radius);border:2px solid var(--cp-border);transition:background-color .15s ease}.cp-picker input[type=color]{width:60px;height:60px;padding:0;border:2px solid var(--cp-border);border-radius:8px;cursor:pointer;background:0 0}.cp-picker input[type=color]::-webkit-color-swatch-wrapper{padding:2px}.cp-picker input[type=color]::-webkit-color-swatch{border:none;border-radius:6px}.cp-values-section{flex:1;display:flex;flex-direction:column;gap:12px}.cp-value-row{display:flex;align-items:center;gap:8px}.cp-label{min-width:40px;font-size:13px;font-weight:600;color:var(--cp-label);text-transform:uppercase;letter-spacing:.5px}.cp-value-row input{flex:1;padding:10px 12px;font-size:14px;font-family:ui-monospace,SFMono-Regular,monospace;background:var(--cp-input-bg);border:1px solid var(--cp-input-border);border-radius:6px;color:var(--cp-text);outline:0;cursor:default}.cp-value-row input:focus{border-color:var(--cp-primary)}.cp-copy{padding:8px 16px;font-size:13px;font-weight:600;color:#fff;background:var(--cp-primary);border:none;border-radius:6px;cursor:pointer;white-space:nowrap;transition:background .15s ease}.cp-copy:hover{background:var(--cp-primary-hover)}.cp-copy.copied{background:#16a34a}.cp-swatches{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}.cp-swatch{width:36px;height:36px;border-radius:8px;cursor:pointer;transition:transform .15s ease;flex-shrink:0}.cp-swatch:hover{transform:scale(1.15)}@media(max-width:600px){.cp-widget{flex-direction:column;align-items:center}.cp-color-preview{width:160px;height:160px}}";
  document.head.appendChild(style);

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
    if (max === min) {
      h = s = 0;
    } else {
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

  function updateColor(hex) {
    var preview = document.getElementById("color-preview");
    var hexInput = document.getElementById("cp-hex");
    var rgbInput = document.getElementById("cp-rgb");
    var hslInput = document.getElementById("cp-hsl");
    var colorInput = document.getElementById("color-input");
    if (!preview) return;
    preview.style.backgroundColor = hex;
    if (colorInput) colorInput.value = hex;
    if (hexInput) hexInput.value = hex;
    var rgb = hexToRgb(hex);
    if (rgbInput) rgbInput.value = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";
    var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    if (hslInput) hslInput.value = "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)";
  }

  window.pickColor = function (hex) {
    updateColor(hex);
  };

  window.copyValue = function (id) {
    var input = document.getElementById(id);
    if (!input) return;
    navigator.clipboard.writeText(input.value).then(function () {
      var btn = input.nextElementSibling;
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(function () {
          btn.textContent = orig;
          btn.classList.remove("copied");
        }, 1500);
      }
    }).catch(function () {
      input.select();
      document.execCommand("copy");
    });
  };

  window.addEventListener("DOMContentLoaded", function () {
    var widget = document.getElementById("tool-widget");
    if (!widget) return;
    widget.innerHTML =
      '<div class="cp-widget">' +
        '<div class="cp-preview-section">' +
          '<div class="cp-color-preview" id="color-preview" style="background-color:#6366f1"></div>' +
          '<div class="cp-picker">' +
            '<input type="color" id="color-input" value="#6366f1">' +
          '</div>' +
        '</div>' +
        '<div class="cp-values-section">' +
          '<div class="cp-value-row">' +
            '<span class="cp-label">HEX</span>' +
            '<input type="text" id="cp-hex" value="#6366f1" readonly>' +
            '<button onclick="copyValue(\'cp-hex\')" class="cp-copy">Copy</button>' +
          '</div>' +
          '<div class="cp-value-row">' +
            '<span class="cp-label">RGB</span>' +
            '<input type="text" id="cp-rgb" value="rgb(99, 102, 241)" readonly>' +
            '<button onclick="copyValue(\'cp-rgb\')" class="cp-copy">Copy</button>' +
          '</div>' +
          '<div class="cp-value-row">' +
            '<span class="cp-label">HSL</span>' +
            '<input type="text" id="cp-hsl" value="hsl(239, 84%, 67%)" readonly>' +
            '<button onclick="copyValue(\'cp-hsl\')" class="cp-copy">Copy</button>' +
          '</div>' +
          '<div class="cp-swatches">' +
            '<div class="cp-swatch" style="background:#ef4444" onclick="pickColor(\'#ef4444\')"></div>' +
            '<div class="cp-swatch" style="background:#f97316" onclick="pickColor(\'#f97316\')"></div>' +
            '<div class="cp-swatch" style="background:#eab308" onclick="pickColor(\'#eab308\')"></div>' +
            '<div class="cp-swatch" style="background:#22c55e" onclick="pickColor(\'#22c55e\')"></div>' +
            '<div class="cp-swatch" style="background:#06b6d4" onclick="pickColor(\'#06b6d4\')"></div>' +
            '<div class="cp-swatch" style="background:#6366f1" onclick="pickColor(\'#6366f1\')"></div>' +
            '<div class="cp-swatch" style="background:#a855f7" onclick="pickColor(\'#a855f7\')"></div>' +
            '<div class="cp-swatch" style="background:#ec4899" onclick="pickColor(\'#ec4899\')"></div>' +
            '<div class="cp-swatch" style="background:#000000" onclick="pickColor(\'#000000\')"></div>' +
            '<div class="cp-swatch" style="background:#ffffff;border:2px solid #ddd" onclick="pickColor(\'#ffffff\')"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var colorInput = document.getElementById("color-input");
    if (colorInput) {
      colorInput.addEventListener("input", function () {
        updateColor(this.value);
      });
    }
  });
})();
