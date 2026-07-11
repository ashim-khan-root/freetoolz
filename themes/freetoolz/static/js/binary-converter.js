(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="bc-widget">' +
      '<div class="bc-field"><label for="bc-binary">Binary</label><input type="text" id="bc-binary" value="1010"></div>' +
      '<div class="bc-field"><label for="bc-decimal">Decimal</label><input type="text" id="bc-decimal" value="10"></div>' +
      '<div class="bc-field"><label for="bc-hex">Hexadecimal</label><input type="text" id="bc-hex" value="A"></div>' +
      '<div class="bc-field"><label for="bc-octal">Octal</label><input type="text" id="bc-octal" value="12"></div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.bc-widget{display:flex;flex-direction:column;gap:14px}' +
    '.bc-field{display:flex;flex-direction:column;gap:4px}' +
    '.bc-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.bc-field input{padding:12px 14px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:1.05rem;font-family:monospace;background:var(--bg);color:var(--text);outline:none;transition:border-color var(--transition),box-shadow var(--transition)}' +
    '.bc-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-light)}';
  document.head.appendChild(style);

  var binary = document.getElementById('bc-binary');
  var decimal = document.getElementById('bc-decimal');
  var hex = document.getElementById('bc-hex');
  var octal = document.getElementById('bc-octal');
  var updating = false;

  function updateFrom(source, value) {
    if (updating) return;
    updating = true;
    try {
      var dec;
      if (source === 'binary') {
        if (!/^[01]+$/.test(value)) throw new Error('invalid');
        dec = parseInt(value, 2);
      } else if (source === 'decimal') {
        if (!/^\d+$/.test(value)) throw new Error('invalid');
        dec = parseInt(value, 10);
      } else if (source === 'hex') {
        if (!/^[0-9a-fA-F]+$/.test(value)) throw new Error('invalid');
        dec = parseInt(value, 16);
      } else if (source === 'octal') {
        if (!/^[0-7]+$/.test(value)) throw new Error('invalid');
        dec = parseInt(value, 8);
      }
      if (isNaN(dec) || dec < 0) throw new Error('invalid');
      binary.value = dec.toString(2);
      decimal.value = dec.toString(10);
      hex.value = dec.toString(16).toUpperCase();
      octal.value = dec.toString(8);
    } catch (e) {
      // leave other fields as-is when invalid input
    }
    updating = false;
  }

  binary.addEventListener('input', function () { updateFrom('binary', this.value); });
  decimal.addEventListener('input', function () { updateFrom('decimal', this.value); });
  hex.addEventListener('input', function () { updateFrom('hex', this.value); });
  octal.addEventListener('input', function () { updateFrom('octal', this.value); });
})();
