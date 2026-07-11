(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="hx-widget">' +
      '<div class="hx-field"><label for="hx-hex">Hexadecimal</label><input type="text" id="hx-hex" value="48656C6C6F"></div>' +
      '<div class="hx-field"><label for="hx-decimal">Decimal</label><input type="text" id="hx-decimal" value="310939249774"></div>' +
      '<div class="hx-field"><label for="hx-text">Text</label><input type="text" id="hx-text" value="Hello" class="hx-text-input"></div>' +
      '<div class="hx-field"><label for="hx-ascii">ASCII Bytes</label><textarea id="hx-ascii" rows="2" readonly></textarea></div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.hx-widget{display:flex;flex-direction:column;gap:14px}' +
    '.hx-field{display:flex;flex-direction:column;gap:4px}' +
    '.hx-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.hx-field input,.hx-field textarea{padding:12px 14px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;font-family:monospace;background:var(--bg);color:var(--text);outline:none;transition:border-color var(--transition),box-shadow var(--transition)}' +
    '.hx-field input:focus,.hx-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-light)}' +
    '.hx-field textarea{resize:vertical;min-height:50px;font-size:.85rem}' +
    '.hx-text-input{font-family:inherit!important}';
  document.head.appendChild(style);

  var hexInp = document.getElementById('hx-hex');
  var decInp = document.getElementById('hx-decimal');
  var txtInp = document.getElementById('hx-text');
  var asciiInp = document.getElementById('hx-ascii');
  var updating = false;

  function hexToBytes(hex) {
    var bytes = [];
    for (var i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
  }

  function bytesToHex(bytes) {
    var h = '';
    for (var i = 0; i < bytes.length; i++) {
      h += ('0' + bytes[i].toString(16)).slice(-2).toUpperCase();
    }
    return h;
  }

  function hexToStr(hex) {
    var bytes = hexToBytes(hex);
    var str = '';
    for (var i = 0; i < bytes.length; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    return str;
  }

  function strToHex(str) {
    var bytes = [];
    for (var i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
    return bytesToHex(bytes);
  }

  function updateAll(source, value) {
    if (updating) return;
    updating = true;
    try {
      if (source === 'hex') {
        var clean = value.replace(/\s/g, '').toUpperCase();
        if (!/^[0-9A-F]*$/.test(clean)) throw new Error('invalid hex');
        if (clean.length % 2 !== 0) clean = '0' + clean;
        if (clean.length === 0) { clearFields(); updating = false; return; }
        hexInp.value = clean;
        var dec = parseInt(clean, 16);
        decInp.value = isNaN(dec) ? '' : dec.toString();
        txtInp.value = hexToStr(clean);
        var bytes = hexToBytes(clean);
        asciiInp.value = bytes.map(function (b) { return (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.'; }).join(' ');
      } else if (source === 'decimal') {
        if (!/^\d+$/.test(value)) throw new Error('invalid decimal');
        var decVal = parseInt(value, 10);
        if (isNaN(decVal)) { clearFields(); updating = false; return; }
        var h = decVal.toString(16).toUpperCase();
        if (h.length % 2 !== 0) h = '0' + h;
        hexInp.value = h;
        txtInp.value = hexToStr(h);
        var bytes2 = hexToBytes(h);
        asciiInp.value = bytes2.map(function (b) { return (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.'; }).join(' ');
      } else if (source === 'text') {
        if (value.length === 0) { clearFields(); updating = false; return; }
        var h2 = strToHex(value);
        hexInp.value = h2;
        decInp.value = parseInt(h2, 16).toString();
        var bytes3 = hexToBytes(h2);
        asciiInp.value = bytes3.map(function (b) { return (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.'; }).join(' ');
      }
    } catch (e) {
      // partial input, leave fields
    }
    updating = false;
  }

  function clearFields() {
    hexInp.value = '';
    decInp.value = '';
    txtInp.value = '';
    asciiInp.value = '';
  }

  hexInp.addEventListener('input', function () { updateAll('hex', this.value); });
  decInp.addEventListener('input', function () { updateAll('decimal', this.value); });
  txtInp.addEventListener('input', function () { updateAll('text', this.value); });
})();
