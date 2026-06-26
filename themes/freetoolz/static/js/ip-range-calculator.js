(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="ip-widget">' +
    '<div class="ip-form">' +
    '<div class="ip-field"><label>CIDR Notation</label><input type="text" id="ip-cidr" value="192.168.1.0/24" placeholder="e.g. 10.0.0.0/16"></div>' +
    '</div>' +
    '<div class="ip-results-grid">' +
    '<div class="ip-rc" style="background:var(--primary);color:#fff"><span class="ip-rl" style="color:rgba(255,255,255,.7)">Network Address</span><span class="ip-rv" id="ip-network" style="color:#fff">—</span></div>' +
    '<div class="ip-rc"><span class="ip-rl">Broadcast Address</span><span class="ip-rv" id="ip-broadcast">—</span></div>' +
    '<div class="ip-rc"><span class="ip-rl">First Usable</span><span class="ip-rv" id="ip-first">—</span></div>' +
    '<div class="ip-rc"><span class="ip-rl">Last Usable</span><span class="ip-rv" id="ip-last">—</span></div>' +
    '<div class="ip-rc"><span class="ip-rl">Total Hosts</span><span class="ip-rv" id="ip-total">0</span></div>' +
    '<div class="ip-rc"><span class="ip-rl">Usable Hosts</span><span class="ip-rv" id="ip-usable">0</span></div>' +
    '<div class="ip-rc"><span class="ip-rl">Subnet Mask</span><span class="ip-rv" id="ip-mask">—</span></div>' +
    '<div class="ip-rc"><span class="ip-rl">Wildcard Mask</span><span class="ip-rv" id="ip-wildcard">—</span></div>' +
    '<div class="ip-rc"><span class="ip-rl">Binary Network</span><span class="ip-rv" id="ip-binary" style="font-size:.75rem;word-break:break-all;font-family:monospace">—</span></div>' +
    '<div class="ip-rc"><span class="ip-rl">IP Class</span><span class="ip-rv" id="ip-class">—</span></div>' +
    '</div>' +
    '<div class="ip-note" id="ip-note">Enter a CIDR notation to see detailed subnet breakdown. Supports IPv4 CIDR (e.g., 192.168.1.0/24, 10.0.0.0/8).</div></div>';

  var CSS =
    '.ip-widget{display:flex;flex-direction:column;gap:16px}' +
    '.ip-form{display:flex;flex-direction:column;gap:8px}' +
    '.ip-field{display:flex;flex-direction:column;gap:4px}' +
    '.ip-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.ip-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1.1rem;font-family:monospace;background:var(--bg);color:var(--text);outline:none}' +
    '.ip-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.ip-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:8px}' +
    '.ip-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:12px;text-align:center}' +
    '.ip-rl{display:block;font-size:.68rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.03em;margin-bottom:4px}' +
    '.ip-rv{font-size:.9rem;font-weight:700;color:var(--primary);display:block;font-family:monospace}' +
    '.ip-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:900px){.ip-results-grid{grid-template-columns:1fr 1fr 1fr}}' +
    '@media(max-width:500px){.ip-results-grid{grid-template-columns:1fr 1fr}}';

  function ipToLong(ip) {
    var parts = ip.split('.');
    return ((parseInt(parts[0]) || 0) << 24) +
      ((parseInt(parts[1]) || 0) << 16) +
      ((parseInt(parts[2]) || 0) << 8) +
      (parseInt(parts[3]) || 0) >>> 0;
  }

  function longToIp(l) {
    return ((l >>> 24) & 255) + '.' + ((l >>> 16) & 255) + '.' + ((l >>> 8) & 255) + '.' + (l & 255);
  }

  function toBinary(ip) {
    var parts = ip.split('.');
    var bin = '';
    for (var i = 0; i < 4; i++) {
      var b = parseInt(parts[i]).toString(2);
      bin += ('00000000' + b).slice(-8) + (i < 3 ? '.' : '');
    }
    return bin;
  }

  function getIpClass(ip) {
    var first = parseInt(ip.split('.')[0]);
    if (first >= 1 && first <= 126) return 'A';
    if (first >= 128 && first <= 191) return 'B';
    if (first >= 192 && first <= 223) return 'C';
    if (first >= 224 && first <= 239) return 'D (Multicast)';
    return 'E (Reserved)';
  }

  function calc() {
    var input = w('ip-cidr').value.trim();
    var parts = input.split('/');
    var ip = parts[0];
    var cidr = parseInt(parts[1]);
    var valid = true;

    if (!ip || isNaN(cidr) || cidr < 0 || cidr > 32 || !/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) {
      valid = false;
    }

    if (valid) {
      var ipParts = ip.split('.');
      for (var i = 0; i < 4; i++) {
        var v = parseInt(ipParts[i]);
        if (v < 0 || v > 255) { valid = false; break; }
      }
    }

    if (!valid) {
      w('ip-network').textContent = 'Invalid';
      w('ip-broadcast').textContent = 'Invalid';
      w('ip-first').textContent = '—';
      w('ip-last').textContent = '—';
      w('ip-total').textContent = '—';
      w('ip-usable').textContent = '—';
      w('ip-mask').textContent = '—';
      w('ip-wildcard').textContent = '—';
      w('ip-binary').textContent = '—';
      w('ip-class').textContent = '—';
      var note = document.getElementById('ip-note');
      note.innerHTML = '&#9888; Invalid CIDR notation. Use format like 192.168.1.0/24';
      note.style.borderLeftColor = '#ef4444';
      return;
    }

    var ipLong = ipToLong(ip);
    var mask = (~0 >>> 0) << (32 - cidr) >>> 0;
    var network = ipLong & mask;
    var broadcast = network | (~mask >>> 0);
    var total = 1 << (32 - cidr);
    var usable = cidr < 31 ? total - 2 : total;
    var firstUsable = cidr < 31 ? network + 1 : network;
    var lastUsable = cidr < 31 ? broadcast - 1 : broadcast;

    var maskParts = [
      (mask >>> 24) & 255,
      (mask >>> 16) & 255,
      (mask >>> 8) & 255,
      mask & 255
    ].join('.');
    var wildcardParts = [
      (~mask >>> 24) & 255,
      (~mask >>> 16) & 255,
      (~mask >>> 8) & 255,
      ~mask & 255
    ].join('.');

    w('ip-network').textContent = longToIp(network) + '/' + cidr;
    w('ip-broadcast').textContent = longToIp(broadcast);
    w('ip-first').textContent = longToIp(firstUsable);
    w('ip-last').textContent = longToIp(lastUsable);
    w('ip-total').textContent = total.toLocaleString();
    w('ip-usable').textContent = usable.toLocaleString();
    w('ip-mask').textContent = maskParts;
    w('ip-wildcard').textContent = wildcardParts;
    w('ip-binary').textContent = toBinary(longToIp(network)) + ' / ' + cidr;
    w('ip-class').textContent = getIpClass(ip);

    var note = document.getElementById('ip-note');
    var classInfo = getIpClass(ip);
    note.innerHTML = 'Network <strong>' + longToIp(network) + '/' + cidr + '</strong> — ' +
      'Class ' + classInfo + ', ' + usable.toLocaleString() + ' usable hosts. ' +
      'Range: ' + longToIp(firstUsable) + ' — ' + longToIp(lastUsable);
    note.style.borderLeftColor = '#22c55e';
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('ip-cidr').addEventListener('input', calc);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
