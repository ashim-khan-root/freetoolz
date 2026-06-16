(function () {
  var w = document.getElementById.bind(document);

  var GROUP_COUNTER = 0;
  var LINK_COUNTER = 0;
  var GROUPS = [];

  function addGroup(name) {
    GROUPS.push({ id: ++GROUP_COUNTER, name: name || 'Group', links: [] });
  }

  function addLink(groupId, label, url) {
    var g = GROUPS.find(function (x) { return x.id === groupId; });
    if (g) g.links.push({ id: ++LINK_COUNTER, label: label || 'Link', url: url || '/' });
  }

  var HTML =
    '<div class="hsg-widget">' +
    '<div class="hsg-field"><label>Site Name</label><input type="text" id="hsg-sitename" value="Example Site"></div>' +
    '<div class="hsg-section"><h4>Link Groups</h4><div id="hsg-groups"></div><button id="hsg-add-group" class="hsg-btn">+ Add Group</button></div>' +
    '<div class="hsg-output"><label>HTML Sitemap</label><textarea id="hsg-output" rows="12" readonly></textarea><button id="hsg-copy" class="hsg-btn">Copy to Clipboard</button></div></div>';

  var CSS =
    '.hsg-widget{display:flex;flex-direction:column;gap:16px}' +
    '.hsg-field{display:flex;flex-direction:column;gap:4px}' +
    '.hsg-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.hsg-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none}' +
    '.hsg-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.hsg-section h4{font-size:.9rem;margin-bottom:8px}' +
    '.hsg-group{border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:10px;overflow:hidden}' +
    '.hsg-group-header{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--bg);border-bottom:1px solid var(--border)}' +
    '.hsg-group-header input{flex:1;padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem}' +
    '.hsg-group-header input:focus{border-color:var(--primary)}' +
    '.hsg-group-remove{padding:2px 10px;background:#ef4444;color:#fff;border:none;border-radius:var(--radius-sm);font-size:.8rem;cursor:pointer}' +
    '.hsg-links{padding:8px 12px}' +
    '.hsg-link{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:center;margin-bottom:6px}' +
    '.hsg-link input{padding:6px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.82rem}' +
    '.hsg-link input:focus{border-color:var(--primary)}' +
    '.hsg-link-remove{padding:2px 10px;background:#6b7280;color:#fff;border:none;border-radius:var(--radius-sm);font-size:.75rem;cursor:pointer}' +
    '.hsg-link-remove:hover{background:#4b5563}' +
    '.hsg-add-link{padding:4px 12px;background:var(--bg);border:1px dashed var(--border);border-radius:var(--radius-sm);font-size:.82rem;cursor:pointer;color:var(--text-secondary);margin-top:4px}' +
    '.hsg-add-link:hover{border-color:var(--primary);color:var(--primary)}' +
    '.hsg-btn{padding:10px 20px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);font-size:.9rem;font-weight:600;cursor:pointer}' +
    '.hsg-btn:hover{background:var(--primary-dark)}' +
    '.hsg-output{display:flex;flex-direction:column;gap:8px}' +
    '.hsg-output label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.hsg-output textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:monospace;font-size:.82rem;background:var(--bg-card);color:var(--text);outline:none;resize:vertical}' +
    '@media(max-width:500px){.hsg-link{grid-template-columns:1fr}}';

  function render() {
    var container = document.getElementById('hsg-groups');
    container.innerHTML = '';

    for (var gi = 0; gi < GROUPS.length; gi++) {
      var g = GROUPS[gi];
      var groupDiv = document.createElement('div');
      groupDiv.className = 'hsg-group';
      groupDiv.innerHTML =
        '<div class="hsg-group-header"><input type="text" class="hsg-group-name" value="' + g.name.replace(/"/g, '&quot;') + '"><button class="hsg-group-remove" data-id="' + g.id + '">Remove</button></div>' +
        '<div class="hsg-links" data-group-id="' + g.id + '"></div>';

      var linksContainer = groupDiv.querySelector('.hsg-links');

      for (var li = 0; li < g.links.length; li++) {
        var l = g.links[li];
        var linkDiv = document.createElement('div');
        linkDiv.className = 'hsg-link';
        linkDiv.innerHTML =
          '<input type="text" class="hsg-link-label" value="' + l.label.replace(/"/g, '&quot;') + '" placeholder="Label">' +
          '<input type="text" class="hsg-link-url" value="' + l.url.replace(/"/g, '&quot;') + '" placeholder="URL">' +
          '<button class="hsg-link-remove" data-id="' + l.id + '">&times;</button>';
        linkDiv.querySelector('.hsg-link-remove').addEventListener('click', function () {
          var id = parseInt(this.getAttribute('data-id'));
          for (var ggi = 0; ggi < GROUPS.length; ggi++) {
            var grp = GROUPS[ggi];
            for (var lli = 0; lli < grp.links.length; lli++) {
              if (grp.links[lli].id === id) { grp.links.splice(lli, 1); break; }
            }
          }
          render(); generate();
        });
        linkDiv.querySelectorAll('input').forEach(function (el) {
          el.addEventListener('input', function () { generate(); });
        });
        linksContainer.appendChild(linkDiv);
      }

      // Add link button
      var addLinkBtn = document.createElement('button');
      addLinkBtn.className = 'hsg-add-link';
      addLinkBtn.textContent = '+ Add Link';
      addLinkBtn.addEventListener('click', function () {
        var gid = parseInt(this.parentElement.getAttribute('data-group-id'));
        addLink(gid, 'New Page', '/new-page');
        render(); generate();
      });
      linksContainer.appendChild(addLinkBtn);

      groupDiv.querySelector('.hsg-group-name').addEventListener('input', function () { generate(); });
      groupDiv.querySelector('.hsg-group-remove').addEventListener('click', function () {
        var id = parseInt(this.getAttribute('data-id'));
        for (var k = 0; k < GROUPS.length; k++) {
          if (GROUPS[k].id === id) { GROUPS.splice(k, 1); break; }
        }
        render(); generate();
      });

      container.appendChild(groupDiv);
    }
    generate();
  }

  function generate() {
    var sitename = w('hsg-sitename').value || 'Sitemap';
    var groupEls = document.querySelectorAll('.hsg-group');

    var html = '<h2>' + sitename.replace(/</g, '&lt;') + ' - Sitemap</h2>\n';
    html += '<ul>\n';

    groupEls.forEach(function (groupEl) {
      var groupName = groupEl.querySelector('.hsg-group-name').value || 'Group';
      html += '  <li><strong>' + groupName.replace(/</g, '&lt;') + '</strong>\n    <ul>\n';

      var linkEls = groupEl.querySelectorAll('.hsg-link');
      linkEls.forEach(function (linkEl) {
        var label = linkEl.querySelector('.hsg-link-label').value || 'Link';
        var url = linkEl.querySelector('.hsg-link-url').value || '/';
        html += '      <li><a href="' + url.replace(/"/g, '&quot;') + '">' + label.replace(/</g, '&lt;') + '</a></li>\n';
      });

      html += '    </ul>\n  </li>\n';
    });

    html += '</ul>';

    w('hsg-output').value = html;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;

    // Default groups & links
    addGroup('Pages');
    addLink(1, 'Home', '/');
    addLink(1, 'About', '/about');
    addLink(1, 'Contact', '/contact');
    addGroup('Services');
    addLink(2, 'Web Design', '/services/web-design');
    addLink(2, 'SEO', '/services/seo');

    render();

    w('hsg-add-group').addEventListener('click', function () {
      addGroup('New Group ' + (GROUPS.length + 1));
      render();
    });

    w('hsg-sitename').addEventListener('input', generate);

    w('hsg-copy').addEventListener('click', function () {
      w('hsg-output').select();
      document.execCommand('copy');
      this.textContent = 'Copied!';
      var self = this;
      setTimeout(function () { self.textContent = 'Copy to Clipboard'; }, 2000);
    });

    generate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
