(function () {
  var widgetHTML =
    '<div class="hg-widget">' +
    '  <div class="hg-input-section">' +
    '    <textarea id="hg-input" rows="4" placeholder="Type text to hash..." class="hg-textarea"></textarea>' +
    '  </div>' +
    '  <div class="hg-results">' +
    '    <div class="hg-row">' +
    '      <span class="hg-label">MD5</span>' +
    '      <input type="text" id="hg-md5" readonly class="hg-value">' +
    '      <button onclick="hgCopy(\'hg-md5\')" class="hg-copy-btn">Copy</button>' +
    '    </div>' +
    '    <div class="hg-row">' +
    '      <span class="hg-label">SHA-1</span>' +
    '      <input type="text" id="hg-sha1" readonly class="hg-value">' +
    '      <button onclick="hgCopy(\'hg-sha1\')" class="hg-copy-btn">Copy</button>' +
    '    </div>' +
    '    <div class="hg-row">' +
    '      <span class="hg-label">SHA-256</span>' +
    '      <input type="text" id="hg-sha256" readonly class="hg-value">' +
    '      <button onclick="hgCopy(\'hg-sha256\')" class="hg-copy-btn">Copy</button>' +
    '    </div>' +
    '    <div class="hg-row">' +
    '      <span class="hg-label">SHA-512</span>' +
    '      <input type="text" id="hg-sha512" readonly class="hg-value">' +
    '      <button onclick="hgCopy(\'hg-sha512\')" class="hg-copy-btn">Copy</button>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  var style = document.createElement("style");
  style.textContent =
    ".hg-widget{display:flex;flex-direction:column;gap:24px}" +
    ".hg-textarea{width:100%;padding:16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:'SF Mono','Fira Code','Consolas',monospace;font-size:0.9rem;line-height:1.6;color:var(--text);background:var(--bg-card);resize:vertical;transition:var(--transition);min-height:120px;box-sizing:border-box}" +
    ".hg-textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}" +
    ".hg-results{display:flex;flex-direction:column;gap:12px}" +
    ".hg-row{display:flex;align-items:center;gap:10px}" +
    ".hg-label{min-width:72px;font-weight:700;font-size:0.85rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em}" +
    ".hg-value{flex:1;padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:'SF Mono','Fira Code','Consolas',monospace;font-size:0.8rem;color:var(--text);background:var(--bg);cursor:default;transition:var(--transition);box-sizing:border-box;min-width:0}" +
    ".hg-value:focus{outline:none;border-color:var(--primary-light)}" +
    ".hg-copy-btn{padding:8px 16px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:var(--radius-sm);font-weight:600;font-size:0.8rem;cursor:pointer;transition:var(--transition);white-space:nowrap}" +
    ".hg-copy-btn:hover{background:var(--primary);color:#fff;border-color:var(--primary)}" +
    ".hg-copy-btn.copied{background:var(--success,#22c55e);color:#fff;border-color:var(--success,#22c55e)}" +
    "@media(max-width:640px){.hg-row{flex-wrap:wrap}.hg-label{min-width:60px}.hg-value{min-width:100%}.hg-copy-btn{width:100%}}";

  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", function () {
    var widget = document.getElementById("tool-widget");
    if (widget) {
      widget.innerHTML = widgetHTML;
      document.getElementById("hg-input").addEventListener("input", hgUpdate);
    }
  });
})();

function md5(str) {
  function rotateLeft(x, n) { return (x << n) | (x >>> (32 - n)); }
  function toHex(d, n) { var s = ''; for (var i = 0; i < 4; i++) s += '0123456789abcdef'[(d >> (i * 8 + 4)) & 15] + '0123456789abcdef'[(d >> (i * 8)) & 15]; return s; }
  function strToWords(s) { var w = new Array(((s.length + 8) >> 6) + 1); for (var i = 0; i < w.length; i++) w[i] = 0; for (var i = 0; i < s.length; i++) w[i >> 2] |= (s.charCodeAt(i) & 0xff) << ((i % 4) * 8); w[i >> 2] |= 0x80 << ((i % 4) * 8); w[w.length - 2] = s.length * 8; return w; }
  var w = strToWords(unescape(encodeURIComponent(str)));
  var a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  var K = [0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391];
  for (var i = 0; i < w.length; i += 16) {
    var A = a, B = b, C = c, D = d;
    for (var j = 0; j < 64; j++) {
      var F, g;
      if (j < 16) { F = (B & C) | (~B & D); g = j; }
      else if (j < 32) { F = (D & B) | (~D & C); g = (5 * j + 1) % 16; }
      else if (j < 48) { F = B ^ C ^ D; g = (3 * j + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * j) % 16; }
      F = F + A + K[j] + w[i + g];
      A = D; D = C; C = B; B = B + rotateLeft(F, [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21][j]);
    }
    a += A; b += B; c += C; d += D;
  }
  return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

function sha(text, algorithm) {
  var encoder = new TextEncoder();
  var data = encoder.encode(text);
  return crypto.subtle.digest(algorithm, data).then(function (hash) {
    return Array.from(new Uint8Array(hash)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  });
}

function hgUpdate() {
  var input = document.getElementById("hg-input").value;

  document.getElementById("hg-md5").value = input ? md5(input) : "";

  sha(input || " ", "SHA-1").then(function (h) {
    document.getElementById("hg-sha1").value = input ? h : "";
  });
  sha(input || " ", "SHA-256").then(function (h) {
    document.getElementById("hg-sha256").value = input ? h : "";
  });
  sha(input || " ", "SHA-512").then(function (h) {
    document.getElementById("hg-sha512").value = input ? h : "";
  });
}

function hgCopy(id) {
  var el = document.getElementById(id);
  if (!el.value) return;
  navigator.clipboard.writeText(el.value).then(function () {
    var btn = el.nextElementSibling;
    if (btn) {
      var orig = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = orig;
        btn.classList.remove("copied");
      }, 1500);
    }
  });
}
