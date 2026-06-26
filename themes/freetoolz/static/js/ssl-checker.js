(function () {
  var w = document.getElementById.bind(document);

  var SSL_TOOLS = [
    { name: 'SSL Labs (Qualys)', url: 'https://www.ssllabs.com/ssltest/analyze.html?d={domain}&hideResults=on' },
    { name: 'SSL Checker', url: 'https://www.sslshopper.com/ssl-checker.html#hostname={domain}' },
    { name: 'SSL Trust', url: 'https://www.ssltrust.com/ssl-checker?domain={domain}' },
    { name: 'DNS Checker SSL', url: 'https://dnschecker.org/ssl-certificate.php?domain={domain}' },
    { name: 'Curl Converter', url: 'https://curlconverter.com/ssllabs/{domain}' },
    { name: 'Security Headers', url: 'https://securityheaders.com/?q={domain}&hide=on&followRedirects=on' },
    { name: 'ImmuniWeb', url: 'https://www.immuniweb.com/ssl/?domain={domain}' },
    { name: 'Hardenize', url: 'https://www.hardenize.com/?domain={domain}' }
  ];

  var HTML =
    '<div class="ssl-widget">' +
    '<div class="ssl-field"><label>Enter Domain</label><input type="text" id="ssl-domain" value="freetoolz.in" placeholder="example.com"></div>' +
    '<div class="ssl-tools" id="ssl-tools"></div>' +
    '<div class="ssl-cli-section">' +
    '<div class="ssl-cli-title">Command Line (OpenSSL)</div>' +
    '<div class="ssl-cli-cmd" id="ssl-openssl-cmd">openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>&1 | openssl x509 -text -noout</div>' +
    '<button class="ssl-btn" id="ssl-copy-btn">Copy Command</button>' +
    '</div>' +
    '<div class="ssl-note" id="ssl-note">Enter a domain name to see SSL certificate testing tools. SSL Labs provides the most comprehensive analysis including certificate chain, cipher suites, and protocol support.</div></div>';

  var CSS =
    '.ssl-widget{display:flex;flex-direction:column;gap:16px}' +
    '.ssl-field{display:flex;flex-direction:column;gap:4px}' +
    '.ssl-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.ssl-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;font-family:monospace;background:var(--bg);color:var(--text);outline:none}' +
    '.ssl-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.ssl-tools{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.ssl-tool-link{display:block;padding:12px 16px;border:1px solid var(--border);border-radius:var(--radius-sm);text-decoration:none;color:var(--text);font-size:.88rem;font-weight:500;transition:var(--transition);background:var(--bg)}' +
    '.ssl-tool-link:hover{background:var(--primary);color:#fff;border-color:var(--primary)}' +
    '.ssl-cli-section{padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.ssl-cli-title{font-size:.78rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.03em;margin-bottom:8px}' +
    '.ssl-cli-cmd{padding:12px;background:#1e293b;color:#e2e8f0;border-radius:var(--radius-sm);font-family:monospace;font-size:.82rem;line-height:1.5;word-break:break-all;margin-bottom:10px}' +
    '.ssl-btn{padding:8px 20px;border:none;border-radius:var(--radius-sm);font-size:.85rem;font-weight:600;cursor:pointer;background:var(--primary);color:#fff;transition:var(--transition)}' +
    '.ssl-btn:hover{background:var(--primary-dark)}' +
    '.ssl-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:500px){.ssl-tools{grid-template-columns:1fr}}';

  function normalizeDomain(raw) {
    var d = raw.trim().toLowerCase();
    d = d.replace(/^https?:\/\//, '');
    d = d.replace(/\/.*$/, '');
    return d;
  }

  function calc() {
    var raw = w('ssl-domain').value;
    var domain = normalizeDomain(raw);
    var toolsDiv = document.getElementById('ssl-tools');

    if (!domain) {
      toolsDiv.innerHTML = '<div style="color:var(--text-tertiary);padding:10px">Enter a domain to see SSL testing tools.</div>';
      document.getElementById('ssl-openssl-cmd').textContent = 'openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>&1 | openssl x509 -text -noout';
      return;
    }

    var html = '';
    for (var i = 0; i < SSL_TOOLS.length; i++) {
      var href = SSL_TOOLS[i].url.replace(/\{domain\}/g, encodeURIComponent(domain));
      html += '<a class="ssl-tool-link" href="' + href + '" target="_blank" rel="noopener">' + SSL_TOOLS[i].name + ' &#8599;</a>';
    }
    toolsDiv.innerHTML = html;

    var cmd = 'openssl s_client -connect ' + domain + ':443 -servername ' + domain + ' < /dev/null 2>&1 | openssl x509 -text -noout';
    document.getElementById('ssl-openssl-cmd').textContent = cmd;
  }

  function copyCmd() {
    var cmd = document.getElementById('ssl-openssl-cmd').textContent;
    navigator.clipboard.writeText(cmd).then(function () {
      var btn = document.getElementById('ssl-copy-btn');
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = 'Copy Command'; }, 2000);
    }).catch(function () {
      var btn = document.getElementById('ssl-copy-btn');
      btn.textContent = 'Failed to copy';
      setTimeout(function () { btn.textContent = 'Copy Command'; }, 2000);
    });
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('ssl-domain').addEventListener('input', calc);
    document.getElementById('ssl-copy-btn').addEventListener('click', copyCmd);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
