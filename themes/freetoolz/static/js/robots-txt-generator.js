(function () {
  var w = document.getElementById.bind(document);

  var ruleIdCounter = 0;
  var RULES = [];

  function addRule(userAgent, allowDisallow, path) {
    RULES.push({ id: ++ruleIdCounter, userAgent: userAgent || '*', type: allowDisallow, path: path || '/' });
  }

  var HTML =
    '<div class="rtg-widget">' +
    '<div class="rtg-section">' +
    '<h4>Rules</h4>' +
    '<div id="rtg-rules"></div>' +
    '<button id="rtg-add-rule" class="rtg-btn">+ Add Rule</button>' +
    '</div>' +
    '<div class="rtg-section">' +
    '<div class="rtg-field"><label>Sitemap URL</label><input type="text" id="rtg-sitemap" placeholder="https://example.com/sitemap.xml"></div>' +
    '<div class="rtg-field"><label>Crawl Delay (seconds, optional)</label><input type="number" id="rtg-delay" value="" step="1" min="0" placeholder="e.g. 10"></div>' +
    '</div>' +
    '<div class="rtg-output"><label>robots.txt</label><textarea id="rtg-output" rows="12" readonly></textarea><button id="rtg-copy" class="rtg-btn">Copy to Clipboard</button></div></div>';

  var CSS =
    '.rtg-widget{display:flex;flex-direction:column;gap:16px}' +
    '.rtg-section h4{font-size:.9rem;margin-bottom:8px}' +
    '.rtg-rule{display:grid;grid-template-columns:1fr auto 1fr auto;gap:8px;align-items:center;padding:10px 12px;margin-bottom:8px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.rtg-rule select,.rtg-rule input{padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;background:#fff;color:var(--text);outline:none}' +
    '.rtg-rule select:focus,.rtg-rule input:focus{border-color:var(--primary)}' +
    '.rtg-rule-remove{padding:4px 12px;background:#ef4444;color:#fff;border:none;border-radius:var(--radius-sm);font-size:.85rem;cursor:pointer}' +
    '.rtg-rule-remove:hover{background:#dc2626}' +
    '.rtg-btn{padding:10px 20px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);font-size:.9rem;font-weight:600;cursor:pointer;align-self:flex-start}' +
    '.rtg-btn:hover{background:var(--primary-dark)}' +
    '.rtg-field{margin-bottom:10px}' +
    '.rtg-field>label{display:block;font-size:.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:4px}' +
    '.rtg-field input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none}' +
    '.rtg-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.rtg-output{display:flex;flex-direction:column;gap:8px}' +
    '.rtg-output label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.rtg-output textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:monospace;font-size:.82rem;background:var(--bg-card);color:var(--text);outline:none;resize:vertical}' +
    '@media(max-width:500px){.rtg-rule{grid-template-columns:1fr}}';

  function renderRules() {
    var container = document.getElementById('rtg-rules');
    container.innerHTML = '';
    for (var i = 0; i < RULES.length; i++) {
      var r = RULES[i];
      var div = document.createElement('div');
      div.className = 'rtg-rule';
      div.innerHTML =
        '<select class="rtg-ua">' +
        '<option value="*"' + (r.userAgent === '*' ? ' selected' : '') + '>All (Any bot)</option>' +
        '<option value="Googlebot"' + (r.userAgent === 'Googlebot' ? ' selected' : '') + '>Googlebot</option>' +
        '<option value="Bingbot"' + (r.userAgent === 'Bingbot' ? ' selected' : '') + '>Bingbot</option>' +
        '<option value="Googlebot-Image"' + (r.userAgent === 'Googlebot-Image' ? ' selected' : '') + '>Googlebot-Image</option>' +
        '<option value="YandexBot"' + (r.userAgent === 'YandexBot' ? ' selected' : '') + '>YandexBot</option>' +
        '<option value="GPTBot"' + (r.userAgent === 'GPTBot' ? ' selected' : '') + '>GPTBot</option>' +
        '</select>' +
        '<select class="rtg-type">' +
        '<option value="Disallow"' + (r.type === 'Disallow' ? ' selected' : '') + '>Disallow</option>' +
        '<option value="Allow"' + (r.type === 'Allow' ? ' selected' : '') + '>Allow</option>' +
        '</select>' +
        '<input type="text" class="rtg-path" value="' + r.path + '" placeholder="/">' +
        '<button class="rtg-rule-remove" data-id="' + r.id + '">&times;</button>';
      div.querySelector('.rtg-rule-remove').addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'));
        for (var j = 0; j < RULES.length; j++) {
          if (RULES[j].id === id) { RULES.splice(j, 1); break; }
        }
        renderRules(); generate();
      });
      div.querySelectorAll('select, input').forEach(function (el) {
        el.addEventListener('change', function () { generate(); });
        el.addEventListener('input', function () { generate(); });
      });
      container.appendChild(div);
    }
    generate();
  }

  function generate() {
    var lines = ['User-agent: *'];
    var seenUAs = {};
    var ruleEls = document.querySelectorAll('.rtg-rule');

    ruleEls.forEach(function (el) {
      var ua = el.querySelector('.rtg-ua').value;
      var type = el.querySelector('.rtg-type').value;
      var path = el.querySelector('.rtg-path').value || '/';

      if (!seenUAs[ua]) {
        if (Object.keys(seenUAs).length > 0) lines.push('');
        lines.push('User-agent: ' + ua);
        seenUAs[ua] = true;
      }
      lines.push(type + ': ' + path);
    });

    var delay = w('rtg-delay').value;
    if (delay) { lines.push(''); lines.push('Crawl-delay: ' + delay); }

    var sitemap = w('rtg-sitemap').value;
    if (sitemap) { lines.push(''); lines.push('Sitemap: ' + sitemap); }

    w('rtg-output').value = lines.join('\n');
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    // Default rules
    addRule('*', 'Disallow', '/admin/');
    addRule('*', 'Allow', '/');
    addRule('GPTBot', 'Disallow', '/');

    renderRules();

    w('rtg-add-rule').addEventListener('click', function () {
      RULES.push({ id: ++ruleIdCounter, userAgent: '*', type: 'Disallow', path: '/' });
      renderRules();
    });

    w('rtg-sitemap').addEventListener('input', generate);
    w('rtg-delay').addEventListener('input', generate);

    w('rtg-copy').addEventListener('click', function () {
      w('rtg-output').select();
      document.execCommand('copy');
      this.textContent = 'Copied!';
      var self = this;
      setTimeout(function () { self.textContent = 'Copy to Clipboard'; }, 2000);
    });

    generate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
