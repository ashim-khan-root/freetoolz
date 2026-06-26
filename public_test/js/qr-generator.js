(function () {
  var WIDGET_HTML =
    '<div class="qr-widget">' +
    '<div class="qr-input-section">' +
    '<input type="text" id="qr-input" placeholder="Enter text or URL..." />' +
    '<div class="qr-options">' +
    '<label>Size: <select id="qr-size">' +
    '<option value="128">Small (128x128)</option>' +
    '<option value="256" selected>Medium (256x256)</option>' +
    '<option value="512">Large (512x512)</option>' +
    '<option value="1024">Extra Large (1024x1024)</option>' +
    '</select></label>' +
    '</div>' +
    '</div>' +
    '<div class="qr-output-section">' +
    '<div class="qr-canvas-wrapper"><canvas id="qr-canvas" width="256" height="256"></canvas></div>' +
    '<div class="qr-actions"><button onclick="downloadQR()" class="btn" id="qr-download-btn">Download PNG</button></div>' +
    '</div>' +
    '</div>';

  var CSS =
    '.qr-widget{display:flex;flex-direction:column;gap:20px;align-items:center}' +
    '.qr-input-section{width:100%;display:flex;flex-direction:column;gap:12px}' +
    '.qr-input-section input{width:100%;padding:14px 16px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none;transition:var(--transition)}' +
    '.qr-input-section input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.1)}' +
    '.qr-options{display:flex;gap:12px;align-items:center}' +
    '.qr-options label{font-size:0.9rem;font-weight:600;color:var(--text);display:flex;align-items:center;gap:8px}' +
    '.qr-options select{padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-card);color:var(--text);font-size:0.9rem;cursor:pointer}' +
    '.qr-output-section{display:flex;flex-direction:column;align-items:center;gap:16px}' +
    '.qr-canvas-wrapper{border:2px solid var(--border);border-radius:var(--radius);padding:16px;background:#fff;box-shadow:var(--shadow)}' +
    '.qr-canvas-wrapper canvas{display:block;max-width:100%;height:auto}' +
    '.qr-actions .btn:disabled{opacity:0.5;cursor:not-allowed}' +
    '@media(max-width:480px){.qr-options{flex-direction:column;align-items:stretch}}';

  // ---- QR Code Core Engine (ISO/IEC 18004) ----
  var QR_GF256 = (function () {
    var exp = new Array(256);
    var log = new Array(256);
    for (var i = 0, v = 1; i < 256; i++) {
      exp[i] = v;
      log[v] = i;
      v = v * 2 ^ (v >= 128 ? 0x11d : 0);
    }
    return { exp: exp, log: log };
  })();

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return QR_GF256.exp[(QR_GF256.log[a] + QR_GF256.log[b]) % 255];
  }

  function gfPolyMul(p, q) {
    var r = new Array(p.length + q.length - 1).fill(0);
    for (var i = 0; i < p.length; i++)
      for (var j = 0; j < q.length; j++)
        r[i + j] ^= gfMul(p[i], q[j]);
    return r;
  }

  function gfPolyMod(dividend, divisor) {
    var d = dividend.slice();
    while (d.length >= divisor.length && d.length > 0) {
      var scale = d[0];
      if (scale === 0) { d.shift(); continue; }
      for (var i = 0; i < divisor.length; i++)
        d[i] ^= gfMul(scale, divisor[i]);
      d.shift();
    }
    return d;
  }

  function rsGeneratorPoly(degree) {
    var g = [1];
    for (var i = 0; i < degree; i++)
      g = gfPolyMul(g, [1, QR_GF256.exp[i]]);
    return g;
  }

  function rsEncode(data, ecCount) {
    var gen = rsGeneratorPoly(ecCount);
    var padded = data.concat(new Array(ecCount).fill(0));
    var rem = gfPolyMod(padded, gen);
    while (rem.length < ecCount) rem.unshift(0);
    return data.concat(rem);
  }

  var VERSION_TABLE = [
    { ver: 1, total: 26, ec: 7, blocks: 1, blockEc: 7 },
    { ver: 2, total: 44, ec: 10, blocks: 1, blockEc: 10 },
    { ver: 3, total: 70, ec: 15, blocks: 1, blockEc: 15 },
    { ver: 4, total: 100, ec: 20, blocks: 1, blockEc: 20 },
    { ver: 5, total: 134, ec: 26, blocks: 1, blockEc: 26 },
    { ver: 6, total: 172, ec: 18, blocks: 2, blockEc: 9 },
  ];

  function BitBuffer() {
    this.buf = [];
    this.len = 0;
  }
  BitBuffer.prototype.put = function (val, bits) {
    for (var i = bits - 1; i >= 0; i--)
      this.buf.push((val >>> i) & 1);
    this.len += bits;
  };
  BitBuffer.prototype.toBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.buf.length; i += 8) {
      var b = 0;
      for (var j = 0; j < 8 && i + j < this.buf.length; j++)
        b = (b << 1) | (this.buf[i + j] || 0);
      bytes.push(b);
    }
    return bytes;
  };

  function encodeData(text) {
    var buf = new BitBuffer();
    var data = unescape(encodeURIComponent(text));
    var len = data.length;

    buf.put(4, 4);
    if (len <= 9) buf.put(len, 8);
    else if (len <= 26) buf.put(len, 16);
    else buf.put(len, 16);

    for (var i = 0; i < data.length; i++)
      buf.put(data.charCodeAt(i), 8);

    buf.put(0, 4);
    while (buf.len % 8 !== 0) buf.put(0, 1);

    return buf;
  }

  function chooseVersion(dataBits) {
    for (var i = 0; i < VERSION_TABLE.length; i++) {
      var v = VERSION_TABLE[i];
      if (dataBits <= v.total * 8) return v;
    }
    return VERSION_TABLE[VERSION_TABLE.length - 1];
  }

  var finderPattern = [
    [1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1],
  ];

  var timing = [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1];

  function buildMatrix(ver, dataBytes) {
    var size = 17 + ver.ver * 4;
    var m = new Array(size);
    for (var r = 0; r < size; r++) {
      m[r] = new Array(size).fill(0);
    }

    function placeFinder(row, col) {
      for (var r = 0; r < 7; r++)
        for (var c = 0; c < 7; c++)
          m[row + r][col + c] = finderPattern[r][c];
      for (var i = -1; i <= 7; i++) {
        if (row + i >= 0 && row + i < size) {
          if (col - 1 >= 0) m[row + i][col - 1] = 0;
          if (col + 7 < size) m[row + i][col + 7] = 0;
        }
        if (col + i >= 0 && col + i < size) {
          if (row - 1 >= 0) m[row - 1][col + i] = 0;
          if (row + 7 < size) m[row + 7][col + i] = 0;
        }
      }
    }

    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    for (var i = 8; i < size - 8; i++) {
      m[6][i] = timing[(i - 8) % timing.length];
      m[i][6] = timing[(i - 8) % timing.length];
    }

    m[size - 8][8] = 1;

    var bits = [];
    for (var b = 0; b < dataBytes.length; b++) {
      for (var bit = 7; bit >= 0; bit--)
        bits.push((dataBytes[b] >>> bit) & 1);
    }

    var dir = -1;
    var col = size - 1;
    var row = size - 1;
    var bitIdx = 0;

    while (col > 0) {
      if (col === 6) col--;
      for (var r = 0; r < size; r++) {
        var rr = dir === -1 ? size - 1 - r : r;
        for (var c = 0; c < 2; c++) {
          var cc = col - c;
          if (cc < 0) continue;
          if (m[rr][cc] !== 0) continue;
          if (bitIdx < bits.length) {
            m[rr][cc] = bits[bitIdx++];
          }
        }
      }
      col -= 2;
      dir = -dir;
    }

    for (var r = 0; r < size; r++) {
      for (var c = 0; c < size; c++) {
        if (m[r][c] !== 0 && m[r][c] !== 1) {
          var isReserved = false;
          if (r < 9 && c < 9) isReserved = true;
          if (r < 9 && c >= size - 8) isReserved = true;
          if (r >= size - 8 && c < 9) isReserved = true;
          if (r === 6 || c === 6) isReserved = true;
          if (!isReserved && (r + c) % 2 === 0) m[r][c] = m[r][c] === 0 ? 1 : 0;
        }
      }
    }

    var formatBits = [1,1,1,0,1,1,1,1,1,0,0,1,0,0,1];
    var formatIdx = 0;
    for (var i = 0; i <= 8; i++) {
      if (i === 6) continue;
      m[8][i] = formatBits[formatIdx++];
    }
    for (var i = 7; i >= 0; i--) {
      if (i === 6) continue;
      m[8][size - 1 - i] = formatBits[formatIdx++];
    }
    formatIdx = 0;
    for (var i = 8; i >= 0; i--) {
      if (i === 6) continue;
      m[i][8] = formatBits[formatIdx++];
    }
    for (var i = 8; i < size; i++) {
      m[size - 1 - (i - 8)][8] = formatBits[formatIdx++];
    }

    return m;
  }

  function generateQR(text) {
    if (!text || text.length === 0) return null;
    var buf = encodeData(text);
    var ver = chooseVersion(buf.len);
    var dataBytes = buf.toBytes();
    while (dataBytes.length < ver.total - ver.ec) {
      dataBytes.push(dataBytes.length % 2 === 0 ? 0xec : 0x11);
    }
    var ecBytes = rsEncode(dataBytes.slice(0, ver.total - ver.ec), ver.ec);
    return buildMatrix(ver, ecBytes);
  }

  function renderQR(matrix, canvas, size) {
    var ctx = canvas.getContext('2d');
    var dim = matrix.length;
    var cellSize = size / dim;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';
    for (var r = 0; r < dim; r++) {
      for (var c = 0; c < dim; c++) {
        if (matrix[r][c] === 1) {
          ctx.fillRect(c * cellSize, r * cellSize, Math.ceil(cellSize), Math.ceil(cellSize));
        }
      }
    }
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = WIDGET_HTML;

    var inputEl = document.getElementById('qr-input');
    var canvasEl = document.getElementById('qr-canvas');
    var sizeSelect = document.getElementById('qr-size');
    var downloadBtn = document.getElementById('qr-download-btn');
    if (!inputEl || !canvasEl || !sizeSelect || !downloadBtn) return;

    var currentMatrix = null;

    function updateQR() {
      var text = inputEl.value.trim();
      var size = parseInt(sizeSelect.value, 10);
      canvasEl.width = size;
      canvasEl.height = size;

      if (text.length === 0) {
        var ctx = canvasEl.getContext('2d');
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#adb5bd';
        ctx.font = (size * 0.05) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Enter text above', size / 2, size / 2);
        currentMatrix = null;
        return;
      }

      try {
        currentMatrix = generateQR(text);
        if (currentMatrix) {
          renderQR(currentMatrix, canvasEl, size);
          downloadBtn.disabled = false;
        }
      } catch (e) {
        var ctx = canvasEl.getContext('2d');
        ctx.fillStyle = '#fff3cd';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#856404';
        ctx.font = (size * 0.04) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Text too long', size / 2, size / 2);
        currentMatrix = null;
        downloadBtn.disabled = true;
      }
    }

    inputEl.addEventListener('input', updateQR);
    sizeSelect.addEventListener('change', updateQR);

    window.downloadQR = function () {
      if (!currentMatrix) return;
      var size = parseInt(sizeSelect.value, 10);
      var dlCanvas = document.createElement('canvas');
      dlCanvas.width = size;
      dlCanvas.height = size;
      renderQR(currentMatrix, dlCanvas, size);
      var link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = dlCanvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    updateQR();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
