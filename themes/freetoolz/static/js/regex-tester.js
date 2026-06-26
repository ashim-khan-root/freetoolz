(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="rx-widget">' +
    '<div class="rx-form">' +
    '<div class="rx-field"><label>Regular Expression</label><input type="text" id="rx-pattern" value="\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b" placeholder="/pattern/flags"></div>' +
    '<div class="rx-field"><label>Flags</label><input type="text" id="rx-flags" value="gi" placeholder="g, i, m, s, u, y" style="font-family:monospace;width:120px"></div>' +
    '</div>' +
    '<div class="rx-test-field"><label>Test String</label><textarea id="rx-text" rows="6" placeholder="Enter text to test against the regex...">Contact us at support@freetoolz.in or hello@example.com for assistance. Visit https://freetoolz.in for more tools.</textarea></div>' +
    '<div class="rx-results">' +
    '<div class="rx-rc"><span class="rx-rl">Matches</span><span class="rx-rv" id="rx-count">0</span></div>' +
    '<div class="rx-rc" style="background:var(--primary);color:#fff"><span class="rx-rl" style="color:rgba(255,255,255,.7)">Status</span><span class="rx-rv" id="rx-status" style="color:#fff">No match</span></div>' +
    '<div class="rx-rc"><span class="rx-rl">Replacement Count</span><span class="rx-rv" id="rx-replace-count">0</span></div>' +
    '</div>' +
    '<div class="rx-field"><label>Replacement String (optional)</label><input type="text" id="rx-replace" value="[REDACTED]" placeholder="$1 for backreferences"></div>' +
    '<div class="rx-result-box"><div class="rx-rb-label">Matched / Replaced Output</div><div class="rx-rb-content" id="rx-output">Enter a pattern and test string to see matches.</div></div>' +
    '<div class="rx-note" id="rx-note">Enter a regex pattern (without delimiters) and flags to test against your text. Supports capture groups and replacement.</div></div>';

  var CSS =
    '.rx-widget{display:flex;flex-direction:column;gap:16px}' +
    '.rx-form{display:flex;gap:12px;align-items:end}' +
    '.rx-field{display:flex;flex-direction:column;gap:4px;flex:1}' +
    '.rx-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.rx-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;font-family:monospace;background:var(--bg);color:var(--text);outline:none}' +
    '.rx-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.rx-test-field{display:flex;flex-direction:column;gap:4px}' +
    '.rx-test-field>label{font-size:.82rem;font-weight:600;color:var(--text-secondary)}' +
    '.rx-test-field textarea{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none;font-family:inherit;resize:vertical;min-height:100px}' +
    '.rx-test-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.rx-results{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.rx-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center}' +
    '.rx-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}' +
    '.rx-rv{font-size:1.1rem;font-weight:800;color:var(--primary);display:block}' +
    '.rx-result-box{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden}' +
    '.rx-rb-label{font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;padding:10px 14px;border-bottom:1px solid var(--border)}' +
    '.rx-rb-content{padding:14px;font-size:.92rem;font-family:monospace;line-height:1.7;white-space:pre-wrap;word-break:break-word;color:var(--text);min-height:40px}' +
    '.rx-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:500px){.rx-form{flex-direction:column}}';

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function highlightMatches(text, matches) {
    if (!matches || matches.length === 0) return escapeHtml(text);
    var result = '';
    var lastIdx = 0;
    for (var i = 0; i < matches.length; i++) {
      var m = matches[i];
      if (m.index > lastIdx) result += escapeHtml(text.substring(lastIdx, m.index));
      result += '<mark style="background:#fef08a;padding:1px 2px;border-radius:2px">' + escapeHtml(m[0]) + '</mark>';
      lastIdx = m.index + m[0].length;
    }
    if (lastIdx < text.length) result += escapeHtml(text.substring(lastIdx));
    return result;
  }

  function calc() {
    var pattern = w('rx-pattern').value;
    var flags = w('rx-flags').value;
    var text = w('rx-text').value;
    var replaceStr = w('rx-replace').value;

    var output = document.getElementById('rx-output');
    var note = document.getElementById('rx-note');

    if (!pattern) {
      w('rx-count').textContent = '0';
      w('rx-status').textContent = 'No pattern';
      w('rx-status').style.color = 'var(--text-tertiary)';
      w('rx-replace-count').textContent = '0';
      output.innerHTML = 'Enter a regex pattern.';
      note.style.borderLeftColor = 'var(--primary)';
      return;
    }

    try {
      var regex = new RegExp(pattern, flags);
      var matches = [];
      var match;
      var global = flags.indexOf('g') > -1;
      if (global) {
        while ((match = regex.exec(text)) !== null) {
          matches.push(match);
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(text);
        if (match) matches.push(match);
      }

      w('rx-count').textContent = matches.length;

      if (matches.length > 0) {
        w('rx-status').textContent = matches.length + ' match' + (matches.length > 1 ? 'es' : '');
        w('rx-status').style.color = '#22c55e';
        output.innerHTML = highlightMatches(text, matches);
        note.innerHTML = 'Found ' + matches.length + ' match' + (matches.length > 1 ? 'es' : '') + '. ' +
          (global ? 'Global flag enabled — all matches shown.' : 'No global flag — first match shown.');
        note.style.borderLeftColor = '#22c55e';
      } else {
        w('rx-status').textContent = 'No match';
        w('rx-status').style.color = '#ef4444';
        output.innerHTML = escapeHtml(text);
        note.innerHTML = 'No matches found. Try adjusting your pattern or flags.';
        note.style.borderLeftColor = '#ef4444';
      }

      if (replaceStr) {
        regex = new RegExp(pattern, flags);
        var replaced = text.replace(regex, replaceStr);
        var diffCount = 0;
        var tempRegex = new RegExp(pattern, flags.indexOf('g') > -1 ? flags : flags + 'g');
        diffCount = (text.match(tempRegex) || []).length;
        w('rx-replace-count').textContent = diffCount;
        if (diffCount > 0) {
          output.innerHTML = '<div style="margin-bottom:8px;color:var(--text-tertiary);font-size:.82rem">Replaced ' + diffCount + ' occurrence(s):</div>' + escapeHtml(replaced);
        }
      } else {
        w('rx-replace-count').textContent = '0';
      }

    } catch (e) {
      w('rx-count').textContent = 'Error';
      w('rx-status').textContent = 'Invalid regex';
      w('rx-status').style.color = '#ef4444';
      w('rx-replace-count').textContent = '0';
      output.innerHTML = '<span style="color:#ef4444">' + escapeHtml(e.message) + '</span>';
      note.innerHTML = '&#9888; ' + escapeHtml(e.message);
      note.style.borderLeftColor = '#ef4444';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('#rx-pattern, #rx-flags, #rx-text, #rx-replace').forEach(function (el) {
      el.addEventListener('input', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
