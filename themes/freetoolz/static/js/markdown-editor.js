(function () {
  var widgetId = 'tool-widget';
  var widget = document.getElementById(widgetId);
  if (!widget) return;

  widget.innerHTML =
    '<div class="md-widget">' +
      '<div class="md-toolbar">' +
        '<button onclick="mdInsert(\'**\',\'**\')" title="Bold"><strong>B</strong></button>' +
        '<button onclick="mdInsert(\'*\',\'*\')" title="Italic"><em>I</em></button>' +
        '<button onclick="mdInsert(\'[\',\'](url)\')" title="Link">Link</button>' +
        '<button onclick="mdInsert(\'```\\n\',\'\\n```\')" title="Code">Code</button>' +
        '<button onclick="mdInsert(\'# \',\'\')" title="Heading">H</button>' +
        '<button onclick="mdInsert(\'- \',\'\')" title="List">List</button>' +
      '</div>' +
      '<div class="md-split">' +
        '<div class="md-pane">' +
          '<div class="md-pane-header">Markdown</div>' +
          '<textarea id="md-input" rows="15" placeholder="Type Markdown here..."></textarea>' +
        '</div>' +
        '<div class="md-pane">' +
          '<div class="md-pane-header">Preview</div>' +
          '<div class="md-preview" id="md-preview"></div>' +
        '</div>' +
      '</div>' +
      '<div class="md-footer">' +
        '<button onclick="mdCopyHtml()" class="btn-secondary">Copy HTML</button>' +
      '</div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.md-widget { display: flex; flex-direction: column; gap: 16px; }' +
    '.md-toolbar { display: flex; gap: 6px; flex-wrap: wrap; padding: 10px 12px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-sm); }' +
    '.md-toolbar button { padding: 6px 14px; background: var(--bg); color: var(--text); border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; font-size: 0.85rem; transition: background var(--transition), border-color var(--transition); }' +
    '.md-toolbar button:hover { background: var(--primary); color: #fff; border-color: var(--primary); }' +
    '.md-split { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }' +
    '.md-pane { display: flex; flex-direction: column; }' +
    '.md-pane-header { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); margin-bottom: 8px; }' +
    '#md-input {' +
      'width: 100%; padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-sm);' +
      'font-size: 0.95rem; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;' +
      'line-height: 1.6; resize: vertical; background: var(--bg); color: var(--text);' +
      'transition: border-color var(--transition), box-shadow var(--transition); outline: none;' +
      'min-height: 320px; box-sizing: border-box;' +
    '}' +
    '#md-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }' +
    '#md-input::placeholder { color: var(--text-secondary); opacity: 0.6; }' +
    '.md-preview {' +
      'width: 100%; min-height: 320px; padding: 16px; border: 1px solid var(--border); border-radius: var(--radius-sm);' +
      'background: var(--bg-card); color: var(--text); line-height: 1.7; overflow-y: auto;' +
      'box-sizing: border-box; word-wrap: break-word;' +
    '}' +
    '.md-preview h1, .md-preview h2, .md-preview h3, .md-preview h4, .md-preview h5, .md-preview h6 {' +
      'margin: 0.5em 0 0.25em; line-height: 1.3; font-weight: 700; color: var(--text);' +
    '}' +
    '.md-preview h1 { font-size: 1.8rem; border-bottom: 2px solid var(--border); padding-bottom: 8px; }' +
    '.md-preview h2 { font-size: 1.5rem; border-bottom: 1px solid var(--border); padding-bottom: 6px; }' +
    '.md-preview h3 { font-size: 1.25rem; }' +
    '.md-preview h4 { font-size: 1.1rem; }' +
    '.md-preview h5 { font-size: 1rem; }' +
    '.md-preview h6 { font-size: 0.9rem; color: var(--text-secondary); }' +
    '.md-preview p { margin: 0 0 12px; }' +
    '.md-preview a { color: var(--primary); text-decoration: underline; }' +
    '.md-preview a:hover { opacity: 0.85; }' +
    '.md-preview img { max-width: 100%; height: auto; border-radius: var(--radius-sm); margin: 8px 0; }' +
    '.md-preview strong { font-weight: 700; }' +
    '.md-preview em { font-style: italic; }' +
    '.md-preview code {' +
      'font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;' +
      'background: var(--bg); padding: 2px 6px; border-radius: 3px; font-size: 0.88em;' +
    '}' +
    '.md-preview pre {' +
      'background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm);' +
      'padding: 14px 16px; overflow-x: auto; margin: 12px 0;' +
    '}' +
    '.md-preview pre code { background: none; padding: 0; border-radius: 0; }' +
    '.md-preview blockquote {' +
      'border-left: 4px solid var(--primary); padding: 8px 16px; margin: 12px 0;' +
      'background: var(--bg); border-radius: 0 var(--radius-sm) var(--radius-sm) 0;' +
      'color: var(--text-secondary);' +
    '}' +
    '.md-preview blockquote p:last-child { margin-bottom: 0; }' +
    '.md-preview ul, .md-preview ol { padding-left: 24px; margin: 8px 0; }' +
    '.md-preview li { margin: 4px 0; }' +
    '.md-preview hr { border: none; border-top: 2px solid var(--border); margin: 20px 0; }' +
    '.md-preview table { border-collapse: collapse; width: 100%; margin: 12px 0; }' +
    '.md-preview th, .md-preview td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; }' +
    '.md-preview th { background: var(--bg); font-weight: 700; }' +
    '.md-footer { display: flex; gap: 10px; }' +
    '.btn-secondary {' +
      'padding: 10px 24px; background: var(--bg); color: var(--text);' +
      'border: 1px solid var(--border); border-radius: var(--radius-sm);' +
      'font-size: 0.9rem; font-weight: 600; cursor: pointer;' +
      'transition: background var(--transition), border-color var(--transition);' +
    '}' +
    '.btn-secondary:hover { background: var(--primary); color: #fff; border-color: var(--primary); }' +
    '@media (max-width: 768px) { .md-split { grid-template-columns: 1fr; } }';
  document.head.appendChild(style);

  var input = document.getElementById('md-input');
  var preview = document.getElementById('md-preview');

  function escapeHtml(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function parseMarkdown(text) {
    var lines = text.split('\n');
    var html = [];
    var i = 0;
    var inCodeBlock = false;

    while (i < lines.length) {
      var line = lines[i];

      if (/^```/.test(line)) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          var codeLines = [];
          i++;
          while (i < lines.length && !/^```/.test(lines[i])) {
            codeLines.push(lines[i]);
            i++;
          }
          inCodeBlock = false;
          html.push('<pre><code>' + escapeHtml(codeLines.join('\n')) + '</code></pre>');
          i++;
          continue;
        }
        i++;
        continue;
      }

      var trimmed = line.trim();

      if (trimmed === '') {
        html.push('');
        i++;
        continue;
      }

      var parsed = '';

      if (/^#{1,6}\s/.test(trimmed)) {
        var level = trimmed.match(/^(#+)/)[1].length;
        var content = trimmed.replace(/^#+\s+/, '');
        parsed = '<h' + level + '>' + parseInline(escapeHtml(content)) + '</h' + level + '>';
      } else if (/^---+$/.test(trimmed)) {
        parsed = '<hr>';
      } else if (/^>\s/.test(trimmed)) {
        var bqLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          bqLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        parsed = '<blockquote><p>' + bqLines.map(function (l) { return parseInline(escapeHtml(l)); }).join('<br>') + '</p></blockquote>';
        i--;
      } else if (/^- \s/.test(trimmed) || /^\* \s/.test(trimmed)) {
        var ulLines = [];
        while (i < lines.length && (/^- \s/.test(lines[i].trim()) || /^\* \s/.test(lines[i].trim()))) {
          ulLines.push(lines[i].trim().replace(/^[-*]\s+/, ''));
          i++;
        }
        var items = ulLines.map(function (l) { return '<li>' + parseInline(escapeHtml(l)) + '</li>'; }).join('');
        parsed = '<ul>' + items + '</ul>';
        i--;
      } else if (/^\d+\.\s/.test(trimmed)) {
        var olLines = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          olLines.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
          i++;
        }
        var oitems = olLines.map(function (l) { return '<li>' + parseInline(escapeHtml(l)) + '</li>'; }).join('');
        parsed = '<ol>' + oitems + '</ol>';
        i--;
      } else {
        parsed = '<p>' + parseInline(escapeHtml(line)) + '</p>';
      }

      html.push(parsed);
      i++;
    }

    return html.join('\n');
  }

  function parseInline(text) {
    text = text
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
    return text;
  }

  function render() {
    var raw = input.value;
    preview.innerHTML = parseMarkdown(raw);
  }

  input.addEventListener('input', render);

  window.mdInsert = function (prefix, suffix) {
    var start = input.selectionStart;
    var end = input.selectionEnd;
    var text = input.value;
    var selected = text.substring(start, end);
    var before = text.substring(0, start);
    var after = text.substring(end);
    input.value = before + prefix + selected + suffix + after;
    var cursorPos = selected ? start + prefix.length + selected.length + suffix.length : start + prefix.length;
    input.setSelectionRange(cursorPos, cursorPos);
    input.focus();
    render();
  };

  window.mdCopyHtml = function () {
    var html = preview.innerHTML;
    if (html) {
      navigator.clipboard.writeText(html).catch(function () {
        var ta = document.createElement('textarea');
        ta.value = html;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      });
    }
  };

  render();
})();
