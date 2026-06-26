(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="serp-widget">' +
    '<div class="serp-form-grid">' +
    '<div class="serp-field serp-full"><label>Page Title (60-70 chars)</label><input type="text" id="serp-title" value="Free Online Tools - Calculators, Generators & Converters | FreeToolz" maxlength="80"></div>' +
    '<div class="serp-field serp-full"><label>Meta Description (150-160 chars)</label><textarea id="serp-desc" rows="3" maxlength="320">Free online tools for everyone. Calculators, converters, generators, and utilities for SEO, development, math, and everyday use. No signup required.</textarea></div>' +
    '<div class="serp-field serp-full"><label>URL / Slug</label><input type="text" id="serp-url" value="freetoolz.in/tools/serp-preview"></div>' +
    '</div>' +
    '<div class="serp-preview">' +
    '<div class="serp-label">Google SERP Preview</div>' +
    '<div class="serp-card">' +
    '<div class="serp-url-bar" id="serp-display-url">freetoolz.in &#8250; tools &#8250; serp-preview</div>' +
    '<div class="serp-title-bar" id="serp-display-title">Free Online Tools - Calculators, Generators & Converters | FreeToolz</div>' +
    '<div class="serp-desc-bar" id="serp-display-desc">Free online tools for everyone. Calculators, converters, generators, and utilities for SEO, development, math, and everyday use. No signup required.</div>' +
    '</div></div>' +
    '<div class="serp-metrics" id="serp-metrics">' +
    '<div class="serp-m"><span class="serp-ml">Title Length</span><span class="serp-mv" id="serp-title-len">0</span></div>' +
    '<div class="serp-m"><span class="serp-ml">Description Length</span><span class="serp-mv" id="serp-desc-len">0</span></div>' +
    '<div class="serp-m"><span class="serp-ml">Status</span><span class="serp-mv" id="serp-status">Enter text</span></div>' +
    '</div></div>';

  var CSS =
    '.serp-widget{display:flex;flex-direction:column;gap:16px}' +
    '.serp-form-grid{display:grid;grid-template-columns:1fr;gap:12px}' +
    '.serp-full{grid-column:1}' +
    '.serp-field{display:flex;flex-direction:column;gap:4px}' +
    '.serp-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.serp-field input,.serp-field textarea{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none;font-family:inherit}' +
    '.serp-field input:focus,.serp-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.serp-field textarea{resize:vertical}' +
    '.serp-preview{display:flex;flex-direction:column;gap:8px}' +
    '.serp-label{font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em}' +
    '.serp-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;max-width:650px}' +
    '.serp-url-bar{font-size:14px;color:#006621;line-height:1.3;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.serp-title-bar{font-size:20px;color:#1a0dab;line-height:1.3;margin-bottom:3px;cursor:pointer;font-family:Arial,sans-serif}' +
    '.serp-title-bar:hover{text-decoration:underline}' +
    '.serp-desc-bar{font-size:14px;color:#545454;line-height:1.58;word-wrap:break-word;font-family:Arial,sans-serif}' +
    '.serp-metrics{display:grid;grid-template-columns:1fr 1fr 2fr;gap:10px}' +
    '.serp-m{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center}' +
    '.serp-ml{display:block;font-size:.7rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.03em;margin-bottom:4px}' +
    '.serp-mv{font-size:1.1rem;font-weight:800;color:var(--primary);display:block}' +
    '@media(max-width:500px){.serp-metrics{grid-template-columns:1fr}}';

  function fmtUrl(url) {
    var u = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return u.length > 50 ? u.substring(0, 47) + '...' : u;
  }

  function calc() {
    var title = w('serp-title').value;
    var desc = w('serp-desc').value;
    var url = w('serp-url').value;

    w('serp-display-url').textContent = fmtUrl(url);
    w('serp-display-title').textContent = title || '(no title)';
    w('serp-display-desc').textContent = desc || '(no description)';

    var tLen = title.length;
    var dLen = desc.length;
    w('serp-title-len').textContent = tLen + ' chars';
    w('serp-desc-len').textContent = dLen + ' chars';

    var status = '', statusColor = '';
    var issues = [];
    if (tLen < 30) issues.push('Title too short (<30)');
    else if (tLen > 70) issues.push('Title too long (>70, may be truncated)');
    else issues.push('Title length OK');

    if (dLen < 120) issues.push('Description too short (<120)');
    else if (dLen > 160) issues.push('Description exceeds 160 chars (may be truncated)');
    else issues.push('Description length OK');

    if (title && desc && url) {
      if (tLen >= 30 && tLen <= 70 && dLen >= 120 && dLen <= 160) {
        status = 'Looking good';
        statusColor = '#22c55e';
      } else {
        status = issues.filter(function (_, i) { return i > 0 || (tLen < 30 || tLen > 70); }).join(' | ');
        statusColor = '#eab308';
      }
    } else {
      status = 'Enter title and description';
      statusColor = 'var(--text-tertiary)';
    }

    var st = document.getElementById('serp-status');
    st.textContent = status;
    st.style.color = statusColor;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('#serp-title, #serp-desc, #serp-url').forEach(function (el) {
      el.addEventListener('input', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
