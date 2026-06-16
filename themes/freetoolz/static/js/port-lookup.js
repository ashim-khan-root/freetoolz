(function () {
  var w = document.getElementById.bind(document);

  var PORTS = [
    { port: 7, proto: 'TCP/UDP', name: 'Echo', desc: 'Ping service, echoes back received data' },
    { port: 20, proto: 'TCP', name: 'FTP Data', desc: 'File Transfer Protocol data transfer' },
    { port: 21, proto: 'TCP', name: 'FTP Control', desc: 'File Transfer Protocol command/control' },
    { port: 22, proto: 'TCP/UDP', name: 'SSH', desc: 'Secure Shell — encrypted remote login' },
    { port: 23, proto: 'TCP', name: 'Telnet', desc: 'Unencrypted remote terminal access' },
    { port: 25, proto: 'TCP', name: 'SMTP', desc: 'Simple Mail Transfer Protocol (email sending)' },
    { port: 53, proto: 'TCP/UDP', name: 'DNS', desc: 'Domain Name System — resolves hostnames' },
    { port: 67, proto: 'UDP', name: 'DHCP Server', desc: 'Dynamic Host Configuration Protocol (server)' },
    { port: 68, proto: 'UDP', name: 'DHCP Client', desc: 'Dynamic Host Configuration Protocol (client)' },
    { port: 69, proto: 'UDP', name: 'TFTP', desc: 'Trivial File Transfer Protocol' },
    { port: 80, proto: 'TCP', name: 'HTTP', desc: 'Hypertext Transfer Protocol — web traffic' },
    { port: 110, proto: 'TCP', name: 'POP3', desc: 'Post Office Protocol v3 (email retrieval)' },
    { port: 123, proto: 'UDP', name: 'NTP', desc: 'Network Time Protocol — time synchronization' },
    { port: 137, proto: 'UDP', name: 'NetBIOS Name', desc: 'NetBIOS name service (legacy Windows)' },
    { port: 138, proto: 'UDP', name: 'NetBIOS Datagram', desc: 'NetBIOS datagram service' },
    { port: 139, proto: 'TCP', name: 'NetBIOS Session', desc: 'NetBIOS session service' },
    { port: 143, proto: 'TCP', name: 'IMAP', desc: 'Internet Message Access Protocol (email)' },
    { port: 161, proto: 'UDP', name: 'SNMP', desc: 'Simple Network Management Protocol' },
    { port: 162, proto: 'UDP', name: 'SNMP Trap', desc: 'SNMP trap/asynchronous notifications' },
    { port: 179, proto: 'TCP', name: 'BGP', desc: 'Border Gateway Protocol (routing)' },
    { port: 389, proto: 'TCP/UDP', name: 'LDAP', desc: 'Lightweight Directory Access Protocol' },
    { port: 443, proto: 'TCP', name: 'HTTPS', desc: 'HTTP over TLS/SSL — encrypted web' },
    { port: 445, proto: 'TCP', name: 'SMB/CIFS', desc: 'Server Message Block (Windows file sharing)' },
    { port: 465, proto: 'TCP', name: 'SMTPS', desc: 'SMTP over SSL (deprecated, use 587)' },
    { port: 500, proto: 'UDP', name: 'IKE', desc: 'Internet Key Exchange (IPsec VPN)' },
    { port: 514, proto: 'UDP', name: 'Syslog', desc: 'System logging protocol' },
    { port: 546, proto: 'UDP', name: 'DHCPv6 Client', desc: 'DHCP for IPv6 (client)' },
    { port: 547, proto: 'UDP', name: 'DHCPv6 Server', desc: 'DHCP for IPv6 (server)' },
    { port: 554, proto: 'TCP/UDP', name: 'RTSP', desc: 'Real Time Streaming Protocol (video streams)' },
    { port: 587, proto: 'TCP', name: 'SMTP Submission', desc: 'SMTP message submission (modern)' },
    { port: 636, proto: 'TCP', name: 'LDAPS', desc: 'LDAP over SSL/TLS' },
    { port: 843, proto: 'TCP', name: 'Flash Policy', desc: 'Adobe Flash policy file server' },
    { port: 853, proto: 'TCP', name: 'DNS over TLS', desc: 'DNS queries over TLS (DoT)' },
    { port: 989, proto: 'TCP', name: 'FTP over SSL Data', desc: 'FTPS data transfer' },
    { port: 990, proto: 'TCP', name: 'FTP over SSL Ctrl', desc: 'FTPS control' },
    { port: 993, proto: 'TCP', name: 'IMAPS', desc: 'IMAP over SSL/TLS' },
    { port: 995, proto: 'TCP', name: 'POP3S', desc: 'POP3 over SSL/TLS' },
    { port: 1025, proto: 'TCP', name: 'NFS-or-IIS', desc: 'Network File Sharing or Microsoft RPC' },
    { port: 1080, proto: 'TCP', name: 'SOCKS Proxy', desc: 'SOCKS network proxy protocol' },
    { port: 1194, proto: 'UDP', name: 'OpenVPN', desc: 'OpenVPN VPN protocol' },
    { port: 1433, proto: 'TCP', name: 'MSSQL', desc: 'Microsoft SQL Server database' },
    { port: 1434, proto: 'UDP', name: 'MSSQL Monitor', desc: 'Microsoft SQL Server browser/monitor' },
    { port: 1521, proto: 'TCP', name: 'Oracle DB', desc: 'Oracle database listener' },
    { port: 1701, proto: 'UDP', name: 'L2TP', desc: 'Layer 2 Tunneling Protocol (VPN)' },
    { port: 1723, proto: 'TCP', name: 'PPTP', desc: 'Point-to-Point Tunneling Protocol (VPN)' },
    { port: 1812, proto: 'UDP', name: 'RADIUS Auth', desc: 'RADIUS authentication protocol' },
    { port: 1813, proto: 'UDP', name: 'RADIUS Acct', desc: 'RADIUS accounting protocol' },
    { port: 1883, proto: 'TCP', name: 'MQTT', desc: 'MQTT IoT messaging protocol' },
    { port: 1900, proto: 'UDP', name: 'UPnP SSDP', desc: 'Universal Plug and Play discovery' },
    { port: 2052, proto: 'TCP', name: 'ClearVPN', desc: 'ClearVPN protocol' },
    { port: 2082, proto: 'TCP', name: 'cPanel', desc: 'cPanel web hosting control panel' },
    { port: 2083, proto: 'TCP', name: 'cPanel SSL', desc: 'cPanel over SSL/TLS' },
    { port: 2086, proto: 'TCP', name: 'WHM', desc: 'WebHost Manager (unencrypted)' },
    { port: 2087, proto: 'TCP', name: 'WHM SSL', desc: 'WebHost Manager over SSL' },
    { port: 2095, proto: 'TCP', name: 'Webmail', desc: 'cPanel webmail (unencrypted)' },
    { port: 2096, proto: 'TCP', name: 'Webmail SSL', desc: 'cPanel webmail over SSL' },
    { port: 2181, proto: 'TCP', name: 'ZooKeeper', desc: 'Apache ZooKeeper coordination service' },
    { port: 2222, proto: 'TCP', name: 'DirectAdmin', desc: 'DirectAdmin web control panel' },
    { port: 2375, proto: 'TCP', name: 'Docker REST', desc: 'Docker REST API (plain, unencrypted)' },
    { port: 2376, proto: 'TCP', name: 'Docker SSL', desc: 'Docker REST API over TLS' },
    { port: 3000, proto: 'TCP', name: 'Dev Server', desc: 'Common development HTTP server port' },
    { port: 3128, proto: 'TCP', name: 'Squid Proxy', desc: 'Squid web proxy cache' },
    { port: 3306, proto: 'TCP', name: 'MySQL', desc: 'MySQL database server' },
    { port: 3389, proto: 'TCP/UDP', name: 'RDP', desc: 'Remote Desktop Protocol (Windows)' },
    { port: 3478, proto: 'UDP', name: 'STUN/TURN', desc: 'WebRTC NAT traversal service' },
    { port: 3689, proto: 'TCP', name: 'DAAP', desc: 'Apple Digital Audio Access Protocol' },
    { port: 3702, proto: 'UDP', name: 'WS-Discovery', desc: 'Web Services Dynamic Discovery' },
    { port: 4000, proto: 'TCP', name: 'ICSP', desc: 'Cisco IP Camera streaming protocol' },
    { port: 4369, proto: 'TCP', name: 'Erlang PM', desc: 'Erlang port mapper (RabbitMQ)' },
    { port: 4444, proto: 'TCP', name: 'WebAdmin Alt', desc: 'Alternative web admin console' },
    { port: 4500, proto: 'UDP', name: 'IPsec NAT-T', desc: 'IPsec NAT traversal (VPN)' },
    { port: 4567, proto: 'TCP', name: 'Camera Stream', desc: 'Hikvision/Dahua camera streaming' },
    { port: 5000, proto: 'TCP', name: 'UPnP/Flask', desc: 'UPnP or Flask dev server' },
    { port: 5001, proto: 'TCP', name: 'UPnP SSL', desc: 'UPnP over SSL, iSCSI target' },
    { port: 5060, proto: 'TCP/UDP', name: 'SIP', desc: 'Session Initiation Protocol (VoIP)' },
    { port: 5061, proto: 'TCP', name: 'SIP over TLS', desc: 'SIP encrypted (VoIP)' },
    { port: 5222, proto: 'TCP', name: 'XMPP', desc: 'Extensible Messaging and Presence Protocol' },
    { port: 5349, proto: 'TCP', name: 'STUN/TURN TLS', desc: 'STUN/TURN over TLS (WebRTC)' },
    { port: 5432, proto: 'TCP', name: 'PostgreSQL', desc: 'PostgreSQL database server' },
    { port: 5500, proto: 'TCP', name: 'VNC Listener', desc: 'VNC remote desktop listener' },
    { port: 5554, proto: 'TCP', name: 'Mobile GPS', desc: 'Mobile phone GPS/AGPS' },
    { port: 5600, proto: 'TCP', name: 'Camera HTTP', desc: 'Dahua/Hikvision camera web UI (alt)' },
    { port: 5672, proto: 'TCP', name: 'AMQP', desc: 'Advanced Message Queuing Protocol (RabbitMQ)' },
    { port: 5800, proto: 'TCP', name: 'VNC HTTP', desc: 'VNC over HTTP (Java client)' },
    { port: 5900, proto: 'TCP', name: 'VNC Server', desc: 'VNC remote desktop (RFB protocol)' },
    { port: 5985, proto: 'TCP', name: 'WinRM HTTP', desc: 'Windows Remote Management (HTTP)' },
    { port: 5986, proto: 'TCP', name: 'WinRM HTTPS', desc: 'Windows Remote Management (HTTPS)' },
    { port: 6000, proto: 'TCP', name: 'X11 Display', desc: 'X Window System display server' },
    { port: 6379, proto: 'TCP', name: 'Redis', desc: 'Redis key-value data store' },
    { port: 6443, proto: 'TCP', name: 'K8s API SSL', desc: 'Kubernetes API server over HTTPS' },
    { port: 6500, proto: 'TCP', name: 'Camera SDK', desc: 'Hikvision/Dahua SDK communication' },
    { port: 6666, proto: 'TCP', name: 'Camera Config', desc: 'Some camera configuration web UIs' },
    { port: 6677, proto: 'TCP', name: 'ONVIF Secure', desc: 'ONVIF profile over HTTPS' },
    { port: 7000, proto: 'TCP', name: 'Cassandra', desc: 'Apache Cassandra database' },
    { port: 7001, proto: 'TCP', name: 'WebLogic', desc: 'Oracle WebLogic admin console' },
    { port: 7070, proto: 'TCP', name: 'RTSP Alt', desc: 'Alternative RTSP streaming port' },
    { port: 7777, proto: 'TCP', name: 'iChat/SIP', desc: 'iChat server or SIP proxy' },
    { port: 8000, proto: 'TCP', name: 'Web Alt', desc: 'Common alternative HTTP port' },
    { port: 8008, proto: 'TCP', name: 'HTTP Alt', desc: 'Alternative HTTP port' },
    { port: 8009, proto: 'TCP', name: 'AJP', desc: 'Apache JServ Protocol (Tomcat)' },
    { port: 8080, proto: 'TCP', name: 'HTTP Proxy', desc: 'Common HTTP web proxy/alternative' },
    { port: 8081, proto: 'TCP', name: 'Management', desc: 'Common management/admin web UI' },
    { port: 8443, proto: 'TCP', name: 'HTTPS Alt', desc: 'Alternative HTTPS port (common)' },
    { port: 8554, proto: 'TCP', name: 'RTSP Alt 2', desc: 'Alternative RTSP port' },
    { port: 8820, proto: 'TCP', name: 'ONVIF', desc: 'ONVIF camera discovery protocol' },
    { port: 8883, proto: 'TCP', name: 'MQTT over SSL', desc: 'MQTT over TLS/SSL' },
    { port: 8888, proto: 'TCP', name: 'Web Admin', desc: 'Common admin web interface port' },
    { port: 8899, proto: 'TCP', name: 'Camera RTSP', desc: 'Dahua RTSP streaming port' },
    { port: 9000, proto: 'TCP', name: 'PHP-FPM', desc: 'PHP FastCGI Process Manager' },
    { port: 9001, proto: 'TCP', name: 'Supervisor', desc: 'Supervisor process control web UI' },
    { port: 9042, proto: 'TCP', name: 'Cassandra Native', desc: 'Cassandra native transport' },
    { port: 9090, proto: 'TCP', name: 'Prometheus', desc: 'Prometheus monitoring server' },
    { port: 9092, proto: 'TCP', name: 'Kafka', desc: 'Apache Kafka message broker' },
    { port: 9200, proto: 'TCP', name: 'Elasticsearch', desc: 'Elasticsearch REST API' },
    { port: 9300, proto: 'TCP', name: 'Elasticsearch Node', desc: 'Elasticsearch inter-node communication' },
    { port: 9418, proto: 'TCP', name: 'Git', desc: 'Git smart transport protocol' },
    { port: 9999, proto: 'TCP', name: 'Management', desc: 'Common management/admin port' },
    { port: 10000, proto: 'TCP', name: 'Webmin', desc: 'Webmin system administration' },
    { port: 11211, proto: 'TCP/UDP', name: 'Memcached', desc: 'Memcached distributed cache' },
    { port: 12345, proto: 'TCP', name: 'NetBus', desc: 'NetBus remote administration Trojan' },
    { port: 17000, proto: 'TCP', name: 'Camera Config', desc: 'Some IP camera configuration ports' },
    { port: 27017, proto: 'TCP', name: 'MongoDB', desc: 'MongoDB database server' },
    { port: 32400, proto: 'TCP', name: 'Plex Media', desc: 'Plex Media Server' },
    { port: 33434, proto: 'UDP', name: 'Traceroute', desc: 'traceroute default starting port' },
    { port: 37777, proto: 'TCP', name: 'Dahua SDK', desc: 'Dahua SDK/TCP command port' },
    { port: 37778, proto: 'TCP', name: 'Dahua HTTP', desc: 'Dahua camera HTTP web UI' },
    { port: 49152, proto: 'TCP/UDP', name: 'UPnP', desc: 'Universal Plug and Play (dynamic start)' },
    { port: 60001, proto: 'TCP', name: 'Hikvision SDK', desc: 'Hikvision SDK command port' },
    { port: 65000, proto: 'TCP', name: 'Hikvision HTTP', desc: 'Hikvision camera HTTP alternative' },
    { port: 65535, proto: 'TCP/UDP', name: 'Reserved', desc: 'Highest port number' }
  ];

  var HTML =
    '<div class="pl-widget">' +
    '<div class="pl-search-row">' +
    '<span class="pl-search-icon">&#x1F50D;</span>' +
    '<input type="text" id="pl-search" class="pl-search" placeholder="Search port number or service name..." autocomplete="off">' +
    '</div>' +
    '<div class="pl-count" id="pl-count">Showing ' + PORTS.length + ' ports</div>' +
    '<div class="pl-table-wrap"><table class="pl-table">' +
    '<thead><tr><th>Port</th><th>Proto</th><th>Service</th><th>Description</th></tr></thead><tbody id="pl-results"></tbody></table></div>' +
    '<div class="pl-legend">' +
    '<span class="pl-leg pl-leg-well">Well-known (0-1023)</span>' +
    '<span class="pl-leg pl-leg-reg">Registered (1024-49151)</span>' +
    '<span class="pl-leg pl-leg-dyn">Dynamic/Private (49152-65535)</span>' +
    '</div></div>';

  var CSS =
    '.pl-widget{display:flex;flex-direction:column;gap:12px}' +
    '.pl-search-row{position:relative}' +
    '.pl-search-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:1rem;color:var(--text-tertiary);pointer-events:none}' +
    '.pl-search{width:100%;padding:14px 16px 14px 46px;border:1px solid var(--border);border-radius:60px;font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.pl-search:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.pl-count{font-size:.8rem;color:var(--text-tertiary);padding:0 4px}' +
    '.pl-table-wrap{max-height:450px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius)}' +
    '.pl-table{width:100%;border-collapse:collapse;font-size:.85rem}' +
    '.pl-table thead{position:sticky;top:0;z-index:1}' +
    '.pl-table th{background:var(--bg-card-solid);color:var(--text-secondary);font-weight:600;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;padding:10px 14px;text-align:left;border-bottom:2px solid var(--border)}' +
    '.pl-table td{padding:9px 14px;border-bottom:1px solid var(--border);color:var(--text)}' +
    '.pl-table td:first-child{font-family:monospace;font-weight:700}' +
    '.pl-table tr.well td{background:#f0fdf4}.pl-table tr.reg td{background:transparent}.pl-table tr.dyn td{background:#f8fafc}' +
    '.pl-table tr:hover td{background:var(--primary-glow)!important}' +
    '.pl-legend{display:flex;gap:16px;font-size:.78rem;color:var(--text-tertiary)}' +
    '.pl-leg{display:flex;align-items:center;gap:6px}' +
    '.pl-leg::before{content:"";width:12px;height:12px;border-radius:3px;display:inline-block}' +
    '.pl-leg-well::before{background:#f0fdf4;border:1px solid #bbf7d0}' +
    '.pl-leg-reg::before{background:transparent;border:1px solid var(--border)}' +
    '.pl-leg-dyn::before{background:#f8fafc;border:1px solid var(--border)}' +
    '@media(max-width:600px){.pl-table{font-size:.78rem}.pl-table td,.pl-table th{padding:7px 10px}}';

  function filterPorts() {
    var q = w('pl-search').value.trim().toLowerCase();
    var tbody = document.getElementById('pl-results');
    var matchCount = 0;

    var html = '';
    for (var i = 0; i < PORTS.length; i++) {
      var p = PORTS[i];
      if (q && p.name.toLowerCase().indexOf(q) === -1 &&
          String(p.port).indexOf(q) === -1 &&
          p.desc.toLowerCase().indexOf(q) === -1 &&
          p.proto.toLowerCase().indexOf(q) === -1) continue;

      matchCount++;
      var cls = p.port <= 1023 ? 'well' : (p.port < 49152 ? 'reg' : 'dyn');
      html += '<tr class="' + cls + '"><td>' + p.port + '</td><td>' + p.proto + '</td><td><strong>' + p.name + '</strong></td><td>' + p.desc + '</td></tr>';
    }
    tbody.innerHTML = html || '<tr><td colspan="4" style="text-align:center;padding:40px;color:var(--text-tertiary)">No ports found matching "' + q + '"</td></tr>';
    document.getElementById('pl-count').textContent = 'Showing ' + matchCount + ' of ' + PORTS.length + ' ports';
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('pl-search').addEventListener('input', filterPorts);
    filterPorts();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
