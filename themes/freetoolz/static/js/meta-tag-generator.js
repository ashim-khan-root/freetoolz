(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="mtg-widget">' +
    '<div class="mtg-inputs">' +
    '<div class="mtg-field"><label>Page Title</label><input type="text" id="mtg-title" value="Free SEO Tools - Online Meta Tag Generator"></div>' +
    '<div class="mtg-field"><label>Meta Description</label><textarea id="mtg-desc" rows="2">Generate meta title, description, OG tags, and Twitter cards for your website. Free online SEO meta tag generator.</textarea></div>' +
    '<div class="mtg-field"><label>Meta Keywords</label><input type="text" id="mtg-keywords" value="seo tools, meta tag generator, free seo tools, meta tags"></div>' +
    '<div class="mtg-field"><label>Page URL</label><input type="text" id="mtg-url" value="https://example.com/page"></div>' +
    '<div class="mtg-field"><label>Site Name</label><input type="text" id="mtg-sitename" value="Example Site"></div>' +
    '<div class="mtg-field"><label>OG Image URL</label><input type="text" id="mtg-image" value="https://example.com/og-image.jpg"></div>' +
    '</div>' +
    '<div class="mtg-preview" id="mtg-preview">' +
    '<div class="mtg-pp">' +
    '<div class="mtg-purl">https://example.com/page</div>' +
    '<div class="mtg-ptitle">Free SEO Tools - Online Meta Tag Generator</div>' +
    '<div class="mtg-pdesc">Generate meta title, description, OG tags, and Twitter cards for your website. Free online SEO meta tag generator.</div>' +
    '</div>' +
    '</div>' +
    '<div class="mtg-output"><label>HTML Meta Tags</label><textarea id="mtg-output" rows="8" readonly></textarea><button id="mtg-copy" class="mtg-copy-btn">Copy to Clipboard</button></div></div>';

  var CSS =
    '.mtg-widget{display:flex;flex-direction:column;gap:16px}' +
    '.mtg-inputs{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.mtg-field{display:flex;flex-direction:column;gap:4px}' +
    '.mtg-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.mtg-field input,.mtg-field textarea{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none;font-family:inherit}' +
    '.mtg-field input:focus,.mtg-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.mtg-field:first-child{grid-column:1/-1}' +
    '.mtg-field:nth-child(2){grid-column:1/-1}' +
    '.mtg-preview{padding:16px 20px;background:#fff;border:1px solid var(--border);border-radius:var(--radius);box-shadow:0 1px 4px rgba(0,0,0,.08);font-family:Arial,sans-serif}' +
    '.mtg-pp{max-width:600px}' +
    '.mtg-purl{font-size:.82rem;color:#006621;margin-bottom:2px}' +
    '.mtg-ptitle{font-size:1.1rem;color:#1a0dab;font-weight:400;margin-bottom:2px}' +
    '.mtg-pdesc{font-size:.88rem;color:#545454;line-height:1.4}' +
    '.mtg-output{display:flex;flex-direction:column;gap:8px}' +
    '.mtg-output label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.mtg-output textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:monospace;font-size:.82rem;background:var(--bg-card);color:var(--text);outline:none;resize:vertical}' +
    '.mtg-copy-btn{padding:10px 20px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);font-size:.9rem;font-weight:600;cursor:pointer;align-self:flex-start}' +
    '.mtg-copy-btn:hover{background:var(--primary-dark)}' +
    '@media(max-width:600px){.mtg-inputs{grid-template-columns:1fr}}';

  function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function generate() {
    var title = w('mtg-title').value || 'Untitled';
    var desc = w('mtg-desc').value || '';
    var keywords = w('mtg-keywords').value || '';
    var url = w('mtg-url').value || '';
    var sitename = w('mtg-sitename').value || '';
    var image = w('mtg-image').value || '';

    // Update preview
    w('mtg-purl').textContent = url || '/';
    w('mtg-ptitle').textContent = title;
    w('mtg-pdesc').textContent = desc;

    // Generate HTML
    var html = '';
    html += '<meta charset="UTF-8">\n';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '<title>' + escapeHtml(title) + '</title>\n';
    html += '<meta name="description" content="' + escapeHtml(desc) + '">\n';
    if (keywords) html += '<meta name="keywords" content="' + escapeHtml(keywords) + '">\n';
    html += '<meta name="robots" content="index, follow">\n';
    html += '\n<!-- Open Graph -->\n';
    html += '<meta property="og:title" content="' + escapeHtml(title) + '">\n';
    html += '<meta property="og:description" content="' + escapeHtml(desc) + '">\n';
    if (url) html += '<meta property="og:url" content="' + escapeHtml(url) + '">\n';
    if (sitename) html += '<meta property="og:site_name" content="' + escapeHtml(sitename) + '">\n';
    if (image) html += '<meta property="og:image" content="' + escapeHtml(image) + '">\n';
    html += '<meta property="og:type" content="website">\n';
    html += '\n<!-- Twitter Card -->\n';
    html += '<meta name="twitter:card" content="summary_large_image">\n';
    html += '<meta name="twitter:title" content="' + escapeHtml(title) + '">\n';
    html += '<meta name="twitter:description" content="' + escapeHtml(desc) + '">\n';
    if (image) html += '<meta name="twitter:image" content="' + escapeHtml(image) + '">\n';

    w('mtg-output').value = html;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    document.querySelectorAll('#mtg-title, #mtg-desc, #mtg-keywords, #mtg-url, #mtg-sitename, #mtg-image').forEach(function (el) {
      el.addEventListener('input', generate);
    });

    w('mtg-copy').addEventListener('click', function () {
      w('mtg-output').select();
      document.execCommand('copy');
      this.textContent = 'Copied!';
      var self = this;
      setTimeout(function () { self.textContent = 'Copy to Clipboard'; }, 2000);
    });

    generate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
