(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="og-widget">' +
    '<div class="og-form">' +
    '<div class="og-field"><label>Page URL</label><input type="text" id="og-url" value="https://freetoolz.in/tools/serp-preview"></div>' +
    '<div class="og-field"><label>OG Title</label><input type="text" id="og-title" value="SERP Preview - Google Search Preview Free | FreeToolz" maxlength="100"></div>' +
    '<div class="og-field"><label>OG Description</label><textarea id="og-desc" rows="2" maxlength="300">Preview how your page looks in Google search results. Free SERP preview tool with live character count.</textarea></div>' +
    '<div class="og-field"><label>OG Image URL (optional)</label><input type="text" id="og-image" value="https://freetoolz.in/og-default.png" placeholder="https://example.com/image.jpg"></div>' +
    '</div>' +
    '<div class="og-label">Preview (Facebook / LinkedIn / Slack style)</div>' +
    '<div class="og-card">' +
    '<div class="og-img-placeholder" id="og-img-preview">' +
    '<svg viewBox="0 0 1200 630" style="width:100%;height:auto;display:block"><rect width="1200" height="630" fill="#e5e7eb"/><text x="600" y="315" text-anchor="middle" fill="#9ca3af" font-size="24" font-family="Arial">OG Image Preview</text></svg>' +
    '</div>' +
    '<div class="og-body">' +
    '<div class="og-domain" id="og-domain">freetoolz.in</div>' +
    '<div class="og-otitle" id="og-otitle">OG Title Here</div>' +
    '<div class="og-odesc" id="og-odesc">OG description will appear here.</div>' +
    '</div></div>' +
    '<div class="og-metrics">' +
    '<div class="og-m"><span class="og-ml">Title</span><span class="og-mv" id="og-title-len">0 chars</span></div>' +
    '<div class="og-m"><span class="og-ml">Description</span><span class="og-mv" id="og-desc-len">0 chars</span></div>' +
    '<div class="og-m"><span class="og-ml">Image</span><span class="og-mv" id="og-img-status">Not set</span></div>' +
    '</div></div>';

  var CSS =
    '.og-widget{display:flex;flex-direction:column;gap:16px}' +
    '.og-form{display:flex;flex-direction:column;gap:12px}' +
    '.og-field{display:flex;flex-direction:column;gap:4px}' +
    '.og-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.og-field input,.og-field textarea{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none;font-family:inherit}' +
    '.og-field input:focus,.og-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.og-field textarea{resize:vertical}' +
    '.og-label{font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em}' +
    '.og-card{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;max-width:550px;background:#fff}' +
    '.og-img-placeholder{background:#f3f4f6;line-height:0}' +
    '.og-img-placeholder img{width:100%;height:auto;display:block}' +
    '.og-body{padding:14px 16px}' +
    '.og-domain{font-size:11px;color:#606770;text-transform:uppercase;letter-spacing:.02em;margin-bottom:4px;font-family:Helvetica,Arial,sans-serif}' +
    '.og-otitle{font-size:16px;font-weight:600;color:#1d2129;line-height:1.3;margin-bottom:4px;font-family:Helvetica,Arial,sans-serif}' +
    '.og-odesc{font-size:14px;color:#606770;line-height:1.4;font-family:Helvetica,Arial,sans-serif}' +
    '.og-metrics{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.og-m{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:12px;text-align:center}' +
    '.og-ml{display:block;font-size:.7rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.03em;margin-bottom:3px}' +
    '.og-mv{font-size:1rem;font-weight:700;color:var(--primary);display:block}' +
    '@media(max-width:500px){.og-metrics{grid-template-columns:1fr}}';

  function calc() {
    var url = w('og-url').value;
    var title = w('og-title').value;
    var desc = w('og-desc').value;
    var img = w('og-image').value;

    var domain = '—';
    try {
      domain = new URL(url.includes('://') ? url : 'https://' + url).hostname.replace('www.', '');
    } catch (e) {}

    w('og-domain').textContent = domain;
    w('og-otitle').textContent = title || '(no title)';
    w('og-odesc').textContent = desc || '(no description)';

    w('og-title-len').textContent = title.length + ' chars' + (title.length > 70 ? ' (long)' : '');
    w('og-desc-len').textContent = desc.length + ' chars';

    if (img && img.match(/^https?:\/\/.+/)) {
      document.getElementById('og-img-preview').innerHTML = '<img src="' + img.replace(/"/g, '&quot;') + '" alt="OG Preview" onerror="this.parentElement.innerHTML=\'<svg viewBox=0 0 1200 630 style=width:100%;height:auto;display:block><rect width=1200 height=630 fill=#fef2f2/><text x=600 y=315 text-anchor=middle fill=#ef4444 font-size=20 font-family=Arial>Image failed to load</text></svg>\'">';
      w('og-img-status').textContent = 'Set';
      w('og-img-status').style.color = '#22c55e';
    } else {
      document.getElementById('og-img-preview').innerHTML = '<svg viewBox="0 0 1200 630" style="width:100%;height:auto;display:block"><rect width="1200" height="630" fill="#e5e7eb"/><text x="600" y="315" text-anchor="middle" fill="#9ca3af" font-size="24" font-family="Arial">OG Image Preview</text></svg>';
      w('og-img-status').textContent = 'Not set';
      w('og-img-status').style.color = 'var(--text-tertiary)';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('.og-field input, .og-field textarea').forEach(function (el) {
      el.addEventListener('input', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
