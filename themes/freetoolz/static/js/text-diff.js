(function () {
  var widgetId = 'tool-widget';
  var widget = document.getElementById(widgetId);
  if (!widget) return;

  widget.innerHTML =
    '<div class="td-widget">' +
      '<div class="td-columns">' +
        '<div class="td-column">' +
          '<div class="td-header">Original Text</div>' +
          '<textarea id="td-input-a" rows="8" placeholder="Original text..."></textarea>' +
        '</div>' +
        '<div class="td-column">' +
          '<div class="td-header">Changed Text</div>' +
          '<textarea id="td-input-b" rows="8" placeholder="Changed text..."></textarea>' +
        '</div>' +
      '</div>' +
      '<button onclick="computeDiff()" class="td-btn">Compare</button>' +
      '<div class="td-output" id="td-output" style="display:none;">' +
        '<div class="td-header">Differences</div>' +
        '<div id="td-result"></div>' +
      '</div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.td-widget { display:flex; flex-direction:column; gap:20px; }' +
    '.td-columns { display:flex; gap:16px; }' +
    '.td-column { flex:1; display:flex; flex-direction:column; gap:8px; min-width:0; }' +
    '.td-header { font-size:0.95rem; font-weight:700; color:var(--text); }' +
    '.td-column textarea {' +
      'width:100%; padding:12px; border:1px solid var(--border); border-radius:var(--radius-sm);' +
      'font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;' +
      'font-size:0.85rem; line-height:1.5; resize:vertical; background:var(--bg); color:var(--text);' +
      'outline:none; transition:border-color var(--transition),box-shadow var(--transition);' +
    '}' +
    '.td-column textarea:focus {' +
      'border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-light);' +
    '}' +
    '.td-column textarea::placeholder { color:var(--text-secondary); opacity:0.6; }' +
    '.td-btn {' +
      'padding:12px 32px; background:var(--primary); color:#fff; border:none;' +
      'border-radius:var(--radius-sm); font-size:1rem; font-weight:700; cursor:pointer;' +
      'transition:background var(--transition),transform var(--transition);' +
      'align-self:flex-start;' +
    '}' +
    '.td-btn:hover { background:var(--primary-hover); transform:translateY(-1px); }' +
    '.td-output { display:flex; flex-direction:column; gap:8px; }' +
    '#td-result {' +
      'font-family:"SFMono-Regular",Consolas,"Liberation Mono",Menlo,monospace;' +
      'font-size:0.85rem; line-height:1.6; border:1px solid var(--border);' +
      'border-radius:var(--radius); background:var(--bg-card); overflow:hidden;' +
    '}' +
    '.td-line {' +
      'display:flex; align-items:flex-start; padding:4px 12px; border-bottom:1px solid var(--border);' +
    '}' +
    '.td-line:last-child { border-bottom:none; }' +
    '.td-ln { color:var(--text-secondary); min-width:36px; text-align:right; padding-right:12px; user-select:none; font-size:0.8rem; }' +
    '.td-content { white-space:pre-wrap; word-break:break-word; flex:1; }' +
    '.td-add { background:#e6ffe6; }' +
    '.td-rem { background:#ffe6e6; }' +
    '.td-eq { background:transparent; }' +
    '.td-chr-add { background:#b3ffb3; font-weight:700; }' +
    '.td-chr-rem { background:#ffb3b3; font-weight:700; text-decoration:line-through; }' +
    '.td-status {' +
      'padding:12px 16px; background:var(--bg-card); border:1px solid var(--border);' +
      'border-radius:var(--radius); color:var(--text-secondary); text-align:center; font-size:0.9rem;' +
    '}' +
    '@media (max-width:768px) {' +
      '.td-columns { flex-direction:column; }' +
      '.td-btn { align-self:stretch; text-align:center; }' +
    '}';
  document.head.appendChild(style);

  function lcsLines(a, b) {
    var m = a.length, n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = [];
      for (var j = 0; j <= n; j++) {
        dp[i][j] = 0;
      }
    }
    for (var i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    var result = [];
    var i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
        result.unshift({ type: 'eq', line: a[i - 1] });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({ type: 'add', line: b[j - 1] });
        j--;
      } else {
        result.unshift({ type: 'rem', line: a[i - 1] });
        i--;
      }
    }
    return result;
  }

  function charDiff(oldStr, newStr) {
    var m = oldStr.length, n = newStr.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = [];
      for (var j = 0; j <= n; j++) {
        dp[i][j] = 0;
      }
    }
    for (var i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        if (oldStr[i - 1] === newStr[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    var result = [];
    var i = m, j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && oldStr[i - 1] === newStr[j - 1]) {
        result.unshift({ type: 'eq', ch: oldStr[i - 1] });
        i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        result.unshift({ type: 'add', ch: newStr[j - 1] });
        j--;
      } else {
        result.unshift({ type: 'rem', ch: oldStr[i - 1] });
        i--;
      }
    }
    return result;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  window.computeDiff = function () {
    var a = document.getElementById('td-input-a');
    var b = document.getElementById('td-input-b');
    var linesA = a.value.split('\n');
    var linesB = b.value.split('\n');
    var diff = lcsLines(linesA, linesB);
    var output = document.getElementById('td-output');
    var result = document.getElementById('td-result');

    if (diff.length === 0) {
      output.style.display = 'block';
      result.innerHTML = '<div class="td-status">Both texts are identical.</div>';
      return;
    }

    var html = '';
    var aLine = 1, bLine = 1;
    for (var i = 0; i < diff.length; i++) {
      var d = diff[i];
      if (d.type === 'eq') {
        html += '<div class="td-line td-eq"><span class="td-ln">' + aLine + '</span><span class="td-content">' + escapeHtml(d.line) + '</span></div>';
        aLine++; bLine++;
      } else if (d.type === 'rem') {
        html += '<div class="td-line td-rem"><span class="td-ln">' + aLine + '</span><span class="td-content">' + escapeHtml(d.line) + '</span></div>';
        aLine++;
      } else {
        html += '<div class="td-line td-add"><span class="td-ln">' + bLine + '</span><span class="td-content">' + escapeHtml(d.line) + '</span></div>';
        bLine++;
      }
    }

    var changedLines = [];
    var ai = 0, bi = 0;
    while (ai < linesA.length && bi < linesB.length) {
      if (linesA[ai] === linesB[bi]) {
        ai++; bi++;
      } else {
        var remLines = [], addLines = [];
        while (ai < linesA.length && bi < linesB.length && linesA[ai] !== linesB[bi]) {
          remLines.push(linesA[ai]);
          addLines.push(linesB[bi]);
          ai++; bi++;
        }
        changedLines.push({ rem: remLines.join('\n'), add: addLines.join('\n') });
      }
    }

    html += '<div class="td-header" style="margin-top:16px;">Inline Changes</div>';
    if (changedLines.length === 0) {
      html += '<div class="td-line td-eq"><span class="td-content">No inline changes — all differences are full line additions or removals.</span></div>';
    } else {
      for (var k = 0; k < changedLines.length; k++) {
        var cl = changedLines[k];
        var ch = charDiff(cl.rem, cl.add);
        var inlineHtml = '';
        for (var c = 0; c < ch.length; c++) {
          if (ch[c].type === 'eq') {
            inlineHtml += escapeHtml(ch[c].ch);
          } else if (ch[c].type === 'rem') {
            inlineHtml += '<span class="td-chr-rem">' + escapeHtml(ch[c].ch) + '</span>';
          } else {
            inlineHtml += '<span class="td-chr-add">' + escapeHtml(ch[c].ch) + '</span>';
          }
        }
        html += '<div class="td-line td-eq"><span class="td-content">' + inlineHtml + '</span></div>';
      }
    }

    output.style.display = 'block';
    result.innerHTML = html;
  };
})();
