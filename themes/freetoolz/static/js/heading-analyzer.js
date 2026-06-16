(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="hdg-widget">' +
    '<div class="hdg-field"><label>Paste HTML or text with headings</label><textarea id="hdg-input" rows="8" placeholder="Paste HTML content or text with headings...">&lt;h1&gt;Welcome to Our Website&lt;/h1&gt;\n&lt;p&gt;Some content...&lt;/p&gt;\n&lt;h2&gt;Our Services&lt;/h2&gt;\n&lt;p&gt;Service description...&lt;/p&gt;\n&lt;h3&gt;Web Design&lt;/h3&gt;\n&lt;p&gt;Web design details...&lt;/p&gt;\n&lt;h3&gt;SEO Optimization&lt;/h3&gt;\n&lt;p&gt;SEO details...&lt;/p&gt;\n&lt;h2&gt;About Us&lt;/h2&gt;\n&lt;p&gt;About content...&lt;/p&gt;\n&lt;h2&gt;Contact&lt;/h2&gt;\n&lt;p&gt;Contact info...&lt;/p&gt;</textarea></div>' +
    '<div class="hdg-summary" id="hdg-summary"></div>' +
    '<div class="hdg-structure" id="hdg-structure"></div>' +
    '<div class="hdg-issues" id="hdg-issues"></div></div>';

  var CSS =
    '.hdg-widget{display:flex;flex-direction:column;gap:16px}' +
    '.hdg-field{display:flex;flex-direction:column;gap:4px}' +
    '.hdg-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.hdg-field textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;line-height:1.5;background:var(--bg);color:var(--text);outline:none;resize:vertical;font-family:monospace}' +
    '.hdg-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.hdg-summary{display:flex;gap:16px;flex-wrap:wrap}' +
    '.hdg-summary-item{text-align:center;padding:14px 18px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);min-width:80px}' +
    '.hdg-summary-item .hdg-label{font-size:.68rem;color:var(--text-tertiary);text-transform:uppercase}' +
    '.hdg-summary-item .hdg-count{font-size:1.5rem;font-weight:800;color:var(--primary)}' +
    '.hdg-structure{padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.hdg-structure .hdg-level{display:flex;align-items:center;gap:6px;padding:6px 0;font-size:.9rem}' +
    '.hdg-structure .hdg-tag{display:inline-block;padding:2px 8px;border-radius:4px;font-weight:700;font-size:.75rem;font-family:monospace}' +
    '.hdg-structure .hdg-tag.h1{background:#ef4444;color:#fff}' +
    '.hdg-structure .hdg-tag.h2{background:#f97316;color:#fff}' +
    '.hdg-structure .hdg-tag.h3{background:#eab308;color:#000}' +
    '.hdg-structure .hdg-tag.h4{background:#22c55e;color:#fff}' +
    '.hdg-structure .hdg-tag.h5{background:#3b82f6;color:#fff}' +
    '.hdg-structure .hdg-tag.h6{background:#8b5cf6;color:#fff}' +
    '.hdg-structure .hdg-indent{margin-left:20px}' +
    '.hdg-issues{padding:14px 16px;background:#fef2f2;border:1px solid #fecaca;border-radius:var(--radius-sm);color:#991b1b;font-size:.85rem}' +
    '.hdg-issues:empty{display:none}' +
    '.hdg-issues h4{font-size:.85rem;margin-bottom:6px;color:#991b1b}' +
    '.hdg-issues li{margin-bottom:4px}';

  function analyze() {
    var html = w('hdg-input').value || '';

    // Extract headings using regex
    var headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
    var headings = [];
    var match;
    while ((match = headingRegex.exec(html)) !== null) {
      var level = parseInt(match[1]);
      var text = match[2].replace(/<[^>]*>/g, '').trim();
      if (text) headings.push({ level: level, text: text });
    }

    // Summary
    var counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
    for (var i = 0; i < headings.length; i++) {
      counts['h' + headings[i].level]++;
    }

    var summary = document.getElementById('hdg-summary');
    summary.innerHTML = '';
    for (var h = 1; h <= 6; h++) {
      var div = document.createElement('div');
      div.className = 'hdg-summary-item';
      div.innerHTML = '<div class="hdg-label">H' + h + '</div><div class="hdg-count">' + (counts['h' + h] || 0) + '</div>';
      summary.appendChild(div);
    }

    // Structure visualization
    var structure = document.getElementById('hdg-structure');
    structure.innerHTML = '';
    if (headings.length === 0) {
      structure.innerHTML = '<div style="color:var(--text-secondary);font-size:.85rem">No headings found.</div>';
    } else {
      for (var j = 0; j < headings.length; j++) {
        var hh = headings[j];
        var div = document.createElement('div');
        div.className = 'hdg-level';
        for (var k = 2; k <= hh.level; k++) div.classList.add('hdg-indent');
        div.innerHTML = '<span class="hdg-tag h' + hh.level + '">H' + hh.level + '</span> ' + hh.text.substring(0, 120);
        structure.appendChild(div);
      }
    }

    // Issues
    var issues = [];
    if (counts.h1 === 0) issues.push('No H1 tag found. Each page should have exactly one H1.');
    if (counts.h1 > 1) issues.push('Multiple H1 tags found (' + counts.h1 + '). Each page should have exactly one H1.');
    if (counts.h2 === 0 && counts.h3 > 0) issues.push('H3 tags found but no H2 tags. Heading hierarchy may be broken.');
    if (counts.h2 === 0 && headings.length > 1) issues.push('No H2 tags found. Consider adding H2 sections.');

    // Check for skipped levels
    var maxLevel = 0;
    for (var m = 0; m < headings.length; m++) {
      if (headings[m].level > maxLevel + 1 && maxLevel > 0) {
        issues.push('Heading level skipped: from H' + maxLevel + ' to H' + headings[m].level + '.');
      }
      if (headings[m].level > maxLevel) maxLevel = headings[m].level;
    }

    // Check heading text length
    for (var n = 0; n < headings.length; n++) {
      if (headings[n].text.length > 120) {
        issues.push('Overly long heading: "' + headings[n].text.substring(0, 50) + '..." (' + headings[n].text.length + ' chars).');
      }
    }

    var issuesEl = document.getElementById('hdg-issues');
    if (issues.length > 0) {
      issuesEl.innerHTML = '<h4>&#x26A0; Issues Found</h4><ul>' + issues.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
    } else {
      issuesEl.innerHTML = '';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('hdg-input').addEventListener('input', analyze);
    analyze();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
