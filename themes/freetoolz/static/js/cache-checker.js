(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="cc-widget">' +
    '<div class="cc-field"><label>Enter URL to check</label><input type="text" id="cc-url" value="freetoolz.in" placeholder="example.com/page"></div>' +
    '<div class="cc-btn-row"><button class="cc-btn" id="cc-open">Open in Google Cache</button></div>' +
    '<div class="cc-results">' +
    '<div class="cc-rc"><span class="cc-rl">Google Cache URL</span><span class="cc-rv" id="cc-cache-url">—</span></div>' +
    '<div class="cc-rc"><span class="cc-rl">Web Cache URL</span><span class="cc-rv" id="cc-web-url">—</span></div>' +
    '<div class="cc-rc"><span class="cc-rl">Text-Only Cache</span><span class="cc-rv" id="cc-text-url">—</span></div>' +
    '</div>' +
    '<div class="cc-other-services">' +
    '<div class="cc-os-title">Other Cache & Archive Services</div>' +
    '<div class="cc-os-links" id="cc-other-links"></div>' +
    '</div>' +
    '<div class="cc-note" id="cc-note">Google Cache shows the last snapshot Google took of your page. Not all pages are cached. If no cache exists, try the Wayback Machine.</div></div>';

  var CSS =
    '.cc-widget{display:flex;flex-direction:column;gap:16px}' +
    '.cc-field{display:flex;flex-direction:column;gap:4px}' +
    '.cc-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.cc-field input{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1rem;background:var(--bg);color:var(--text);outline:none}' +
    '.cc-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.cc-btn-row{display:flex;gap:10px}' +
    '.cc-btn{padding:10px 24px;border:none;border-radius:var(--radius-sm);font-size:.92rem;font-weight:600;cursor:pointer;background:var(--primary);color:#fff;transition:var(--transition)}' +
    '.cc-btn:hover{background:var(--primary-dark)}' +
    '.cc-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.cc-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center}' +
    '.cc-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}' +
    '.cc-rv{font-size:.92rem;font-weight:700;color:var(--primary);display:block;word-break:break-all}' +
    '.cc-other-services{padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.cc-os-title{font-size:.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:10px}' +
    '.cc-os-links{display:flex;flex-wrap:wrap;gap:8px}' +
    '.cc-os-links a{padding:6px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.82rem;color:var(--primary);text-decoration:none;transition:var(--transition)}' +
    '.cc-os-links a:hover{background:var(--primary);color:#fff;border-color:var(--primary)}' +
    '.cc-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:600px){.cc-results{grid-template-columns:1fr}}';

  var SERVICES = [
    { name: 'Wayback Machine', url: 'https://web.archive.org/web/*/{url}' },
    { name: 'CachedViews', url: 'https://cachedviews.com/{url}' },
    { name: 'Google Cache', url: 'https://webcache.googleusercontent.com/search?q=cache:{url}' },
    { name: 'Textise Dot IY', url: 'https://r.jina.ai/http://{url}' }
  ];

  function normalizeUrl(raw) {
    var u = raw.trim();
    if (!u) return '';
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    try {
      var p = new URL(u);
      return p.href.replace(/\/$/, '');
    } catch (e) {
      return u;
    }
  }

  function calc() {
    var raw = w('cc-url').value;
    var url = normalizeUrl(raw);
    var display = url.replace(/^https?:\/\//, '');

    if (!url) {
      w('cc-cache-url').textContent = '—';
      w('cc-web-url').textContent = '—';
      w('cc-text-url').textContent = '—';
      document.getElementById('cc-other-links').innerHTML = '';
      return;
    }

    var cacheUrl = 'https://webcache.googleusercontent.com/search?q=cache:' + encodeURI(url);
    var webCache = 'https://webcache.googleusercontent.com/search?q=cache:' + encodeURI(url) + '&strip=1&vwsrc=0';
    var textCache = 'https://webcache.googleusercontent.com/search?q=cache:' + encodeURI(url) + '&strip=1&vwsrc=0';

    w('cc-cache-url').innerHTML = '<a href="' + cacheUrl + '" target="_blank" rel="noopener">' + cacheUrl.substring(0, 60) + '...</a>';
    w('cc-web-url').innerHTML = '<a href="' + webCache + '" target="_blank" rel="noopener">' + webCache.substring(0, 60) + '...</a>';
    w('cc-text-url').innerHTML = '<a href="' + textCache + '" target="_blank" rel="noopener">' + textCache.substring(0, 60) + '...</a>';

    var links = document.getElementById('cc-other-links');
    var html = '';
    for (var i = 0; i < SERVICES.length; i++) {
      var href = SERVICES[i].url.replace(/\{url\}/g, encodeURI(url));
      html += '<a href="' + href + '" target="_blank" rel="noopener">' + SERVICES[i].name + '</a>';
    }
    links.innerHTML = html;
  }

  function openCache() {
    var url = normalizeUrl(w('cc-url').value);
    if (url) window.open('https://webcache.googleusercontent.com/search?q=cache:' + encodeURI(url), '_blank');
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('cc-url').addEventListener('input', calc);
    document.getElementById('cc-open').addEventListener('click', openCache);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
