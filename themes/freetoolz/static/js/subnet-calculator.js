(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="sub-widget">' +
    '<div class="sub-form-grid">' +
    '<div class="sub-field"><label>IP Address</label><input type="text" id="sub-ip" value="192.168.1.0" placeholder="e.g. 192.168.1.0"></div>' +
    '<div class="sub-field"><label>CIDR Prefix</label><input type="number" id="sub-cidr" value="24" min="0" max="32"></div>' +
    '<div class="sub-field"><label>Or Subnet Mask</label><input type="text" id="sub-mask" value="255.255.255.0" placeholder="e.g. 255.255.255.0"></div>' +
    '</div>' +
    '<div class="sub-results">' +
    '<div class="sub-row"><span class="sub-label">Network Address</span><span class="sub-val" id="sub-network">—</span></div>' +
    '<div class="sub-row"><span class="sub-label">Broadcast Address</span><span class="sub-val" id="sub-broadcast">—</span></div>' +
    '<div class="sub-row"><span class="sub-label">Usable IP Range</span><span class="sub-val" id="sub-range">—</span></div>' +
    '<div class="sub-row"><span class="sub-label">Total Hosts</span><span class="sub-val" id="sub-hosts">—</span></div>' +
    '<div class="sub-row"><span class="sub-label">Usable Hosts</span><span class="sub-val" id="sub-usable">—</span></div>' +
    '<div class="sub-row"><span class="sub-label">Subnet Mask</span><span class="sub-val" id="sub-mask-out">—</span></div>' +
    '<div class="sub-row"><span class="sub-label">Wildcard Mask</span><span class="sub-val" id="sub-wildcard">—</span></div>' +
    '<div class="sub-row"><span class="sub-label">Binary (Network)</span><span class="sub-val sub-mono" id="sub-binary">—</span></div>' +
    '</div>' +
    '<div class="sub-note" id="sub-note">Enter an IP address and CIDR to calculate subnet details.</div></div>';

  var CSS =
    '.sub-widget{display:flex;flex-direction:column;gap:20px}' +
    '.sub-form-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}' +
    '.sub-field{display:flex;flex-direction:column;gap:4px}' +
    '.sub-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.sub-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none;font-family:monospace}' +
    '.sub-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.sub-results{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}' +
    '.sub-row{display:flex;justify-content:space-between;align-items:center;padding:10px 18px;border-bottom:1px solid var(--border)}' +
    '.sub-row:last-child{border-bottom:none}' +
    '.sub-label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.sub-val{font-size:.95rem;font-weight:700;color:var(--text);font-family:monospace}' +
    '.sub-mono{font-size:.8rem;word-break:break-all}' +
    '.sub-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:600px){.sub-form-grid{grid-template-columns:1fr}}';

  function ipToInt(ip) {
    var parts = ip.split('.');
    if (parts.length !== 4) return -1;
    var n = 0;
    for (var i = 0; i < 4; i++) {
      var p = parseInt(parts[i]);
      if (isNaN(p) || p < 0 || p > 255) return -1;
      n = (n << 8) + p;
    }
    return n >>> 0;
  }

  function intToIp(n) {
    return ((n >>> 24) & 255) + '.' + ((n >>> 16) & 255) + '.' + ((n >>> 8) & 255) + '.' + (n & 255);
  }

  function toBin(n) {
    var s = '';
    for (var i = 31; i >= 0; i--) {
      s += (n >> i) & 1;
      if (i % 8 === 0 && i > 0) s += '.';
    }
    return s;
  }

  function cidrToMask(prefix) {
    return ~((1 << (32 - prefix)) - 1) >>> 0;
  }

  function maskToCidr(mask) {
    var n = 0;
    for (var i = 31; i >= 0; i--) {
      if ((mask >> i) & 1) n++;
      else break;
    }
    return n;
  }

  function parseMask(maskStr) {
    var n = ipToInt(maskStr);
    if (n === -1) return -1;
    // validate it's a valid contiguous mask
    var cidr = maskToCidr(n);
    if (cidrToMask(cidr) !== n) return -1;
    return cidr;
  }

  function calc() {
    var ipStr = w('sub-ip').value.trim();
    var cidr = parseInt(w('sub-cidr').value);
    var maskStr = w('sub-mask').value.trim();

    if (!isNaN(cidr) && cidr >= 0 && cidr <= 32) {
      // sync mask
      var maskInt = cidrToMask(cidr);
      w('sub-mask').value = intToIp(maskInt);
    } else {
      // try parsing mask
      var cidrFromMask = parseMask(maskStr);
      if (cidrFromMask >= 0) {
        cidr = cidrFromMask;
        w('sub-cidr').value = cidr;
      } else {
        w('sub-network').textContent = 'Invalid subnet mask';
        return;
      }
    }

    var ipInt = ipToInt(ipStr);
    if (ipInt === -1) {
      w('sub-network').textContent = 'Invalid IP address';
      return;
    }

    var maskInt = cidrToMask(cidr);
    var network = (ipInt & maskInt) >>> 0;
    var broadcast = (network | ~maskInt) >>> 0;
    var firstUsable = cidr >= 31 ? network : (network + 1) >>> 0;
    var lastUsable = cidr >= 31 ? broadcast : (broadcast - 1) >>> 0;
    var totalHosts = 1 << (32 - cidr);
    var usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : (totalHosts === 0 ? 0 : totalHosts)) : Math.max(0, totalHosts - 2);
    var wildcard = (~maskInt) >>> 0;

    if (cidr === 32) usableHosts = 1;
    else if (cidr === 31) usableHosts = 2;

    w('sub-network').textContent = intToIp(network) + '/' + cidr;
    w('sub-broadcast').textContent = intToIp(broadcast);
    w('sub-range').textContent = intToIp(firstUsable) + ' — ' + intToIp(lastUsable);
    w('sub-hosts').textContent = totalHosts.toLocaleString();
    w('sub-usable').textContent = usableHosts.toLocaleString();
    w('sub-mask-out').textContent = intToIp(maskInt) + ' (/' + cidr + ')';
    w('sub-wildcard').textContent = intToIp(wildcard);
    w('sub-binary').textContent = toBin(network) + ' / ' + cidr;

    var cls = '';
    var firstOctet = (ipInt >>> 24) & 255;
    if (firstOctet < 128) cls = 'A';
    else if (firstOctet < 192) cls = 'B';
    else if (firstOctet < 224) cls = 'C';
    else if (firstOctet < 240) cls = 'D (Multicast)';
    else cls = 'E (Reserved)';

    var note = document.getElementById('sub-note');
    note.innerHTML = 'Class ' + cls + ' network &mdash; ' + usableHosts.toLocaleString() + ' usable hosts &mdash; Range: ' + intToIp(firstUsable) + ' to ' + intToIp(lastUsable);
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('sub-ip').addEventListener('input', calc);
    w('sub-cidr').addEventListener('input', calc);
    w('sub-mask').addEventListener('input', calc);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
