(function () {
  function e(id){return document.getElementById(id)}

  var HTML =
    '<div class="sf-widget">' +
    '<div class="sf-field"><label>Input SQL</label><textarea id="sf-input" rows="10" placeholder="Paste your SQL query here..." spellcheck="false">SELECT id, name, email, created_at FROM users WHERE status = \'active\' AND age > 18 ORDER BY created_at DESC LIMIT 50</textarea></div>' +
    '<div class="sf-options"><label class="sf-opt-label">Indent:</label>' +
    '<label class="sf-radio"><input type="radio" name="sf-indent" value="2" checked> 2 spaces</label>' +
    '<label class="sf-radio"><input type="radio" name="sf-indent" value="4"> 4 spaces</label></div>' +
    '<button class="sf-btn" onclick="sfFormat()">Format SQL</button>' +
    '<div class="sf-field"><label>Output</label><textarea id="sf-output" rows="10" readonly placeholder="Formatted SQL will appear here..." spellcheck="false"></textarea></div>' +
    '<p class="sf-error" id="sf-error"></p>' +
    '<p class="sf-note">* Supports SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY, ORDER BY, and DDL. All processing is client-side.</p></div>';

  var CSS =
    '.sf-widget{display:flex;flex-direction:column;gap:16px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.sf-field{display:flex;flex-direction:column;gap:4px}' +
    '.sf-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.sf-field textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;font-family:ui-monospace,SFMono-Regular,monospace;background:var(--bg);color:var(--text);outline:none;resize:vertical;min-height:100px}' +
    '.sf-field textarea:focus{border-color:var(--primary)}' +
    '.sf-options{display:flex;align-items:center;gap:12px}' +
    '.sf-opt-label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.sf-radio{display:flex;align-items:center;gap:4px;font-size:.9rem;cursor:pointer;color:var(--text)}' +
    '.sf-radio input{accent-color:var(--primary)}' +
    '.sf-btn{padding:12px;border:none;border-radius:var(--radius-sm);font-size:1rem;font-weight:700;background:var(--primary);color:#fff;cursor:pointer}' +
    '.sf-btn:hover{background:var(--primary-dark);transform:translateY(-1px)}' +
    '.sf-error{font-size:.85rem;color:#ef4444;min-height:1.2em;margin:0}' +
    '.sf-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}' +
    '.sf-keyword{color:#3b82f6;font-weight:700}.sf-string{color:#22c55e}.sf-number{color:#f59e0b}.sf-comment{color:#6b7280;font-style:italic}';

  var KEYWORDS = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'AS', 'ON',
    'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'CROSS', 'FULL',
    'GROUP BY', 'ORDER BY', 'HAVING',
    'LIMIT', 'OFFSET', 'UNION', 'ALL', 'DISTINCT',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW',
    'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES', 'NOT NULL', 'UNIQUE',
    'DEFAULT', 'CHECK', 'CASCADE', 'CONSTRAINT',
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    'BETWEEN', 'LIKE', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'ASC', 'DESC', 'BY', 'HAVING'
  ];

  var KW_RE = new RegExp('\\b(' + KEYWORDS.join('|').replace(/ /g, '\\s+') + ')\\b', 'gi');

  function formatSql(sql, indent) {
    var sp = ' '.repeat(indent);
    // Remove leading/trailing whitespace
    sql = sql.trim();

    // Normalize whitespace around keywords
    sql = sql.replace(/\s+/g, ' ');

    // Insert newlines before major clauses
    var clauses = [
      'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING',
      'LIMIT', 'OFFSET', 'UNION', 'INSERT INTO', 'UPDATE', 'SET', 'DELETE FROM',
      'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'CROSS JOIN', 'JOIN',
      'ON', 'AND', 'OR'
    ];

    // First pass: insert newlines before clause keywords (case-insensitive)
    var clauseRe = new RegExp('\\b(' + clauses.join('|') + ')\\b', 'gi');
    sql = sql.replace(clauseRe, '\n$1');

    // Handle AND/OR inside WHERE specially - indent them
    var lines = sql.split('\n');
    var result = [];
    var inSelect = false;
    var inWhere = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      var upper = line.toUpperCase();

      if (upper.startsWith('SELECT')) {
        inSelect = true;
        result.push(line);
        // Put column list on next line with indent
        var rest = line.substring(6).trim();
        if (rest) {
          result[result.length - 1] = 'SELECT';
          var cols = rest.split(',').map(function(c) { return c.trim(); }).join(',\n' + sp);
          result.push(sp + cols);
        }
        continue;
      }

      if (upper.startsWith('FROM')) {
        inSelect = false;
        result.push(line);
        continue;
      }

      if (upper === 'WHERE' || upper.startsWith('WHERE ')) {
        inWhere = true;
        result.push(line);
        continue;
      }

      if (upper === 'ORDER BY' || upper === 'GROUP BY' || upper === 'HAVING') {
        inWhere = false;
        result.push(line);
        continue;
      }

      if (upper.startsWith('LIMIT') || upper.startsWith('OFFSET')) {
        result.push(line);
        continue;
      }

      if (upper.startsWith('LEFT JOIN') || upper.startsWith('RIGHT JOIN') ||
          upper.startsWith('INNER JOIN') || upper.startsWith('OUTER JOIN') ||
          upper.startsWith('CROSS JOIN') || upper.startsWith('JOIN')) {
        inWhere = false;
        result.push(line);
        continue;
      }

      if (upper.startsWith('ON')) {
        result.push(line);
        continue;
      }

      // AND / OR inside WHERE
      if (inWhere && (upper.startsWith('AND') || upper.startsWith('OR'))) {
        result.push(sp + line);
        continue;
      }

      // Regular content
      result.push(sp + line);
    }

    // Uppercase all SQL keywords
    sql = result.join('\n');
    sql = sql.replace(KW_RE, function(m) { return m.toUpperCase(); });

    return sql.trim();
  }

  window.sfFormat = function() {
    var input = e('sf-input').value;
    var indent = parseInt(document.querySelector('input[name="sf-indent"]:checked').value, 10);
    var errorEl = e('sf-error');
    errorEl.textContent = '';

    try {
      var formatted = formatSql(input, indent);
      e('sf-output').value = formatted;
    } catch (ex) {
      errorEl.textContent = 'Error: ' + ex.message;
    }
  };

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    var radios = document.querySelectorAll('input[name="sf-indent"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', sfFormat);
    }
    sfFormat();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
