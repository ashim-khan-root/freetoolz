(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="smg-widget">' +
    '<div class="smg-field"><label>Base URL</label><input type="text" id="smg-baseurl" value="https://example.com"></div>' +
    '<div class="smg-row">' +
    '<div class="smg-field"><label>Default Priority</label><select id="smg-priority"><option value="1.0">1.0</option><option value="0.9">0.9</option><option value="0.8" selected>0.8</option><option value="0.7">0.7</option><option value="0.6">0.6</option><option value="0.5">0.5</option></select></div>' +
    '<div class="smg-field"><label>Default Changefreq</label><select id="smg-freq"><option value="always">always</option><option value="hourly">hourly</option><option value="daily">daily</option><option value="weekly" selected>weekly</option><option value="monthly">monthly</option><option value="yearly">yearly</option><option value="never">never</option></select></div>' +
    '<div class="smg-field"><label>Last Modified</label><input type="date" id="smg-date"></div>' +
    '</div>' +
    '<div class="smg-field"><label>URLs (one per line)</label><textarea id="smg-urls" rows="8" placeholder="/&#10;/about&#10;/blog&#10;/contact">/' + '\n/about\n/blog\n/contact\n/services\n/faq</textarea></div>' +
    '<div class="smg-output"><label>XML Sitemap</label><textarea id="smg-output" rows="12" readonly></textarea><button id="smg-copy" class="smg-btn">Copy to Clipboard</button></div></div>';

  var CSS =
    '.smg-widget{display:flex;flex-direction:column;gap:14px}' +
    '.smg-field{display:flex;flex-direction:column;gap:4px}' +
    '.smg-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.smg-field input,.smg-field select,.smg-field textarea{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none;font-family:inherit}' +
    '.smg-field input:focus,.smg-field select:focus,.smg-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.smg-field textarea{resize:vertical;font-family:monospace}' +
    '.smg-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}' +
    '.smg-output{display:flex;flex-direction:column;gap:8px}' +
    '.smg-output label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.smg-output textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:monospace;font-size:.82rem;background:var(--bg-card);color:var(--text);outline:none;resize:vertical}' +
    '.smg-btn{padding:10px 20px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);font-size:.9rem;font-weight:600;cursor:pointer;align-self:flex-start}' +
    '.smg-btn:hover{background:var(--primary-dark)}' +
    '@media(max-width:500px){.smg-row{grid-template-columns:1fr}}';

  function generate() {
    var baseUrl = w('smg-baseurl').value || 'https://example.com';
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
    var priority = w('smg-priority').value;
    var freq = w('smg-freq').value;
    var date = w('smg-date').value || new Date().toISOString().split('T')[0];
    var urls = w('smg-urls').value.split('\n').filter(function (l) { return l.trim().length > 0; });

    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (var i = 0; i < urls.length; i++) {
      var u = urls[i].trim();
      if (u.startsWith('http')) { /* full URL */ } else if (u.startsWith('/')) { u = baseUrl + u; } else { u = baseUrl + '/' + u; }
      xml += '  <url>\n';
      xml += '    <loc>' + u.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</loc>\n';
      xml += '    <lastmod>' + date + '</lastmod>\n';
      xml += '    <changefreq>' + freq + '</changefreq>\n';
      xml += '    <priority>' + priority + '</priority>\n';
      xml += '  </url>\n';
    }
    xml += '</urlset>';

    w('smg-output').value = xml;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    // Set default date
    w('smg-date').value = new Date().toISOString().split('T')[0];

    document.querySelectorAll('#smg-baseurl, #smg-priority, #smg-freq, #smg-date, #smg-urls').forEach(function (el) {
      el.addEventListener('input', generate);
      el.addEventListener('change', generate);
    });

    w('smg-copy').addEventListener('click', function () {
      w('smg-output').select();
      document.execCommand('copy');
      this.textContent = 'Copied!';
      var self = this;
      setTimeout(function () { self.textContent = 'Copy to Clipboard'; }, 2000);
    });

    generate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
