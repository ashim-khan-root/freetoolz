(function () {
  var w = document.getElementById.bind(document);

  // Top ~150 common OUI vendors (first 6 hex digits)
  var OUI = {
    '000000': 'Xerox Corporation',
    '00037F': 'Intel Corporate',
    '000C29': 'VMware, Inc.',
    '0016E6': 'HTC Corporation',
    '001DD0': 'Samsung Electronics',
    '001E58': 'LG Electronics',
    '001EC0': 'Apple, Inc.',
    '00215F': 'Dell Inc.',
    '002219': 'Cisco Systems',
    '00236D': 'Acer Incorporated',
    '00241C': 'Hewlett Packard',
    '00254B': 'ASUStek Computer Inc.',
    '00262C': 'Huawei Technologies Co.',
    '0026BB': 'Xiaomi Communications',
    '00278C': 'Lenovo Mobile Communication',
    '0027FE': 'Motorola Mobility',
    '0029E1': 'Sony Mobile Communications',
    '002A6A': 'ZTE Corporation',
    '003018': 'TP-LINK Technologies',
    '0034B1': 'D-Link Corporation',
    '004565': 'Netgear Inc.',
    '0050B6': 'Ruckus Wireless',
    '0050F2': 'Microsemi Corporation',
    '0080C8': 'Zhejiang Dahua Technology',
    '009B74': 'Roku, Inc.',
    '00A0C9': 'Intel Corporation',
    '00B0D0': 'LG Innotek',
    '00C0CA': 'Panasonic AVC',
    '00D017': 'Axis Communications',
    '00D07E': 'Shenzhen Hikvision Digital Tech',
    '00E04C': 'Microsoft Corporation',
    '00E08F': 'Bosch Security Systems',
    '00E0B0': 'Nortel Networks',
    '00F4B9': 'Shenzhen UniView Technologies',
    '080007': 'Apple, Inc.',
    '080028': 'Texas Instruments',
    '080046': 'IBM Corp',
    '08005A': 'IBM Corp',
    '080087': 'Xerox Corporation',
    '0C8268': 'Hangzhou Hikvision Digital Tech',
    '0CB5DE': 'Shenzhen Jumaoyun Technology',
    '10880F': 'Huawei Technologies Co.',
    '10C37B': 'Shenzhen Hikvision Digital Tech',
    '10FEED': 'Extreme Networks',
    '141877': 'Nest Labs Inc.',
    '1477C1': 'Shenzhen RF Technology Co.',
    '183451': 'Hangzhou H3C Technologies',
    '1CC1DE': 'Huawei Technologies Co.',
    '1CEDE6': 'Shenzhen Shidean Technology',
    '207B85': 'Shenzhen Apexis Electronic',
    '20AA4B': 'TP-LINK Technologies',
    '24336C': 'Dahua Technology',
    '24BE05': 'Ubiquiti Networks',
    '24F094': 'Samsung Electronics',
    '28C6FE': 'Shenzhen Hailian Technology',
    '28E3BF': 'Valve Corporation',
    '2C33C1': 'Belkin International',
    '2C36F8': 'Xiaomi Communications',
    '2C5A8F': 'Dell Inc.',
    '309C23': 'Ubiquiti Networks',
    '30B3A2': 'TP-LINK Technologies',
    '34C059': 'Intel Corporate',
    '34F39A': 'TP-LINK Technologies',
    '3822D6': 'LG Electronics',
    '38B14B': 'Shenzhen Eeyes Technology',
    '3C18A0': 'Shenzhen Chuangwei Technology',
    '3C61D8': 'Shenzhen Unitend Technologies',
    '3C7DB1': 'Huawei Technologies Co.',
    '3CD16E': 'Intel Corporate',
    '400132': 'Shenzhen Hailian Technology',
    '404A03': 'EnGenius Technologies',
    '40B2C8': 'Shenzhen Yichen Technology',
    '44D1FA': 'Shenzhen XGIMI Technology',
    '482AE3': 'Ruijie Networks',
    '48A22D': 'Arris Group',
    '48E7DA': 'Hangzhou Hikvision Digital Tech',
    '4C11BF': 'Samsung Electronics',
    '4C5F70': 'TP-LINK Technologies',
    '4CEDFB': 'Ubiquiti Networks',
    '500B32': 'Huawei Technologies Co.',
    '508569': 'Cisco Systems',
    '50C58D': 'Wistron Infocomm',
    '50E085': 'Intel Corporate',
    '5404EA': 'Shenzhen Coship Electronics',
    '54A51B': 'Huawei Technologies Co.',
    '54AF97': 'Shenzhen Smart-eye Digital',
    '54E43A': 'Intel Corporate',
    '58639A': 'TP-LINK Technologies',
    '5866BA': 'Hewlett Packard',
    '5C518F': 'Nokia Corporation',
    '5C7939': 'Samsung Electronics',
    '60812B': 'Shenzhen UFODA Technology',
    '60A1A1': 'Shenzhen Jovision Technology',
    '641A22': 'Shenzhen VStarcam Technology',
    '6469D2': 'Shenzhen Eyesse Technology',
    '647D81': 'Samsung Electronics',
    '64D989': 'Shenzhen Haili Intelligence',
    '683B1E': 'Shenzhen Besovideo Technology',
    '6C3E6D': 'Samsung Electronics',
    '6C704B': 'Zhejiang Uniview Technologies',
    '6C9B02': 'Huawei Technologies Co.',
    '702DE3': 'Shenzhen VStarcam Technology',
    '706F81': 'Shenzhen Aoni Electronic',
    '70DDA3': 'Shenzhen Megvii Technology',
    '70F1A1': 'Micro-Star International',
    '74DA88': 'ZTE Corporation',
    '78A2A0': 'Samsung Electronics',
    '78DD08': 'Microsoft Corporation',
    '7C2CF4': 'Shenzhen VStarcam Technology',
    '7C69F6': 'Uniview Technologies',
    '7CA237': 'Shenzhen Hikvision Digital Tech',
    '7CE4AA': 'Shenzhen Sang Fei Consumer Comms',
    '7CF05F': 'Shenzhen Huawei Device',
    '800EA0': 'Shenzhen Reach Technology',
    '80C67B': 'Shenzhen Bilian Electronic',
    '84D452': 'Shenzhen Wision Technology',
    '88D7F6': 'TP-LINK Technologies',
    '8C8590': 'TP-LINK Technologies',
    '8CAE4C': 'Shenzhen Netcom Electronics',
    '90B0ED': 'Shenzhen C&T Technology',
    '947C24': 'Shenzhen J&R Technology',
    '94B035': 'Shenzhen LinkMagic Technology',
    '94DBDA': 'Shenzhen Kaadas Intelligent Tech',
    '98D6BB': 'Huawei Technologies Co.',
    '9C3EAA': 'Shenzhen TVT Digital Technology',
    '9C4CA6': 'Shenzhen Notion Technology',
    '9CADEF': 'Samsung Electronics',
    'A020A6': 'Hangzhou Hikvision Digital Tech',
    'A0B045': 'Shenzhen Apexis Electronic',
    'A0B3CC': 'Hewlett Packard Enterprise',
    'A4D18F': 'Shenzhen Viewpro Technology',
    'A8BD1A': 'Samsung Electronics',
    'AC9E17': 'Shenzhen Lookcam Technology',
    'B075D5': 'Beijing Xiaomi Electronics',
    'B0A10A': 'Shenzhen VStarcam Technology',
    'B0C4DE': 'Shenzhen Hailian Technology',
    'B4E62D': 'Huawei Technologies Co.',
    'B8D06C': 'Shenzhen Jinao Technology',
    'BC7975': 'Shenzhen Gwelltimes Technology',
    'BCF685': 'Sony Corporation',
    'C02588': 'Shenzhen Zhuotong Technology',
    'C0847A': 'TP-LINK Technologies',
    'C433E5': 'Dahua Technology',
    'C4FCE4': 'Shenzhen Unitend Technologies',
    'C81ED6': 'Shenzhen Chuangwei Technology',
    'C8D9D8': 'Shenzhen Wesuntel Technology',
    'CC16F1': 'Shenzhen Tp-Link Technologies',
    'CC34D6': 'ZTE Corporation',
    'CCB691': 'Shenzhen Megvii Smart Technology',
    'CCF8F0': 'Shenzhen Smart-eye Digital',
    'D067E5': 'Apple, Inc.',
    'D46E0E': 'Samsung Electronics',
    'D4993F': 'Shenzhen Unitend Technologies',
    'D8B04D': 'Shenzhen Aoni Electronic',
    'DC094C': 'Shenzhen Coship Electronics',
    'DC4427': 'Shenzhen Huawei Device',
    'DC68C2': 'Shenzhen Kaadas Intelligent Tech',
    'E006E6': 'Taicang T&W Electronics',
    'E06995': 'Shenzhen Megvii Technology',
    'E0ACCB': 'Shenzhen UniView Technologies',
    'E46C21': 'Shenzhen iCmoto Electronics',
    'E4C722': 'Shenzhen RF Technology Co.',
    'E89F6D': 'Shenzhen Bilian Electronic',
    'F04A51': 'Shenzhen Foscam Intelligent Tech',
    'F44EFD': 'Shenzhen Laude Electronic',
    'F483E1': 'Shenzhen Kean Digital Tech',
    'F4B164': 'Shenzhen Wansview Technology',
    'F81EDF': 'Shenzhen Apexis Electronic',
    'F8F27E': 'Shenzhen Eeyes Technology',
    'FC2D5E': 'Shenzhen Unitend Technologies',
    'FC3F5C': 'Shenzhen Xiongmai Technology',
    'FCF1CD': 'Shenzhen Youngzhi Technology',
    '0015C2': 'Dahua Technology Co.',
    '001BF6': 'Mobotix AG',
    '0024CD': 'Arecont Vision',
    '00508B': 'Vicon Industries',
    '00C0B6': 'Samsung Techwin',
    '00D07F': 'Samsung Techwin'
  };

  var recent = [];

  var HTML =
    '<div class="mac-widget">' +
    '<div class="mac-input-row">' +
    '<input type="text" id="mac-input" placeholder="e.g. 00:1A:2B:3C:4D:5E" class="mac-input" autocomplete="off">' +
    '<button class="mac-btn" id="mac-lookup-btn">Lookup</button>' +
    '</div>' +
    '<div class="mac-result" id="mac-result">' +
    '<div class="mac-result-icon">&#x1F50D;</div>' +
    '<p>Enter a MAC address above to identify the vendor.</p>' +
    '</div>' +
    '<div class="mac-recent" id="mac-recent" style="display:none">' +
    '<h4>Recent Lookups</h4>' +
    '<div id="mac-recent-list"></div></div></div>';

  var CSS =
    '.mac-widget{display:flex;flex-direction:column;gap:20px}' +
    '.mac-input-row{display:flex;gap:10px}' +
    '.mac-input{flex:1;padding:14px 16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none;font-family:monospace}' +
    '.mac-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.mac-btn{padding:12px 28px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);font-size:.95rem;font-weight:600;cursor:pointer;transition:var(--transition)}' +
    '.mac-btn:hover{background:var(--primary-dark)}' +
    '.mac-result{text-align:center;padding:32px 24px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}' +
    '.mac-result-icon{font-size:2.5rem;margin-bottom:12px}' +
    '.mac-result p{color:var(--text-secondary);font-size:.95rem}' +
    '.mac-result .mac-vendor{font-size:1.3rem;font-weight:800;color:var(--primary);display:block;margin-bottom:6px}' +
    '.mac-result .mac-oui{font-size:.85rem;color:var(--text-tertiary);display:block}' +
    '.mac-result .mac-note{font-size:.85rem;color:var(--text-secondary);margin-top:8px}' +
    '.mac-recent h4{font-size:.82rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;margin-bottom:10px}' +
    '.mac-recent-item{padding:6px 12px;background:var(--bg);border-radius:var(--radius-sm);margin-bottom:4px;font-size:.85rem;display:flex;justify-content:space-between}' +
    '.mac-recent-item span:first-child{font-family:monospace;font-weight:600}' +
    '.mac-recent-item span:last-child{color:var(--text-secondary)}';

  function normalizeMac(mac) {
    mac = mac.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    if (mac.length < 6) return null;
    return mac.substring(0, 6);
  }

  function formatMac(mac) {
    mac = mac.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    var parts = [];
    for (var i = 0; i < mac.length && i < 12; i += 2) parts.push(mac.substring(i, i + 2));
    return parts.join(':');
  }

  function lookup() {
    var input = w('mac-input').value.trim();
    if (!input) return;

    var oui = normalizeMac(input);
    if (!oui) {
      var r = document.getElementById('mac-result');
      r.innerHTML = '<div class="mac-result-icon">&#x26A0;</div><p>Please enter a valid MAC address (at least 6 hex digits).</p>';
      return;
    }

    var vendor = OUI[oui];
    var formatted = formatMac(input);

    var r = document.getElementById('mac-result');
    if (vendor) {
      r.innerHTML = '<div class="mac-result-icon">&#x2705;</div>' +
        '<span class="mac-vendor">' + vendor + '</span>' +
        '<span class="mac-oui">OUI: ' + oui + ' (' + formatted + ')</span>' +
        '<p class="mac-note">This vendor prefix indicates the device manufacturer.</p>';
    } else {
      r.innerHTML = '<div class="mac-result-icon">&#x2753;</div>' +
        '<span class="mac-vendor" style="color:var(--text-tertiary)">Unknown Vendor</span>' +
        '<span class="mac-oui">OUI: ' + oui + ' not found in local database</span>' +
        '<p class="mac-note">This OUI may belong to an uncommon manufacturer. Try searching the full IEEE OUI registry online.</p>';
    }

    // Add to recent
    recent.unshift({ mac: formatted, vendor: vendor || 'Unknown' });
    if (recent.length > 5) recent.pop();
    updateRecent();
  }

  function updateRecent() {
    var container = document.getElementById('mac-recent');
    var list = document.getElementById('mac-recent-list');
    if (recent.length === 0) { container.style.display = 'none'; return; }
    container.style.display = '';
    list.innerHTML = recent.map(function (r) {
      return '<div class="mac-recent-item"><span>' + r.mac + '</span><span>' + r.vendor + '</span></div>';
    }).join('');
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('mac-lookup-btn').addEventListener('click', lookup);
    w('mac-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') lookup(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
