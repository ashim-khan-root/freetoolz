(function () {
  var w = document.getElementById.bind(document);

  var STOP_WORDS = 'a,an,the,and,or,but,if,because,as,what,which,this,that,these,those,then,just,so,than,such,both,through,about,for,is,are,was,were,been,being,have,has,had,do,does,did,will,would,shall,should,may,might,can,could,need,dare,ought,used,to,of,in,on,at,by,with,from,up,into,over,again,further,once,here,there,when,where,why,how,all,each,every,own,same,not,no,nor,too,very,still,any,more,much,many,most,little,few,less,enough,also,only,other,else,off,out,let'.split(',');

  var HTML =
    '<div class="kdc-widget">' +
    '<div class="kdc-field"><label>Enter your content</label><textarea id="kdc-input" rows="10" placeholder="Paste or type your content here...">Free SEO tools help optimize your website for search engines. Use meta tag generators for SEO meta tags, keyword density checkers for SEO analysis, and sitemap generators for better SEO indexing. Free online SEO tools make search engine optimization easier.</textarea></div>' +
    '<div class="kdc-stats" id="kdc-stats">' +
    '<div class="kdc-stat"><div class="kdc-sl">Words</div><div class="kdc-sv" id="kdc-words">35</div></div>' +
    '<div class="kdc-stat"><div class="kdc-sl">Characters</div><div class="kdc-sv" id="kdc-chars">254</div></div>' +
    '<div class="kdc-stat"><div class="kdc-sl">Unique Words</div><div class="kdc-sv" id="kdc-unique">28</div></div>' +
    '<div class="kdc-stat"><div class="kdc-sl">Avg Word Length</div><div class="kdc-sv" id="kdc-avg">4.5</div></div>' +
    '</div>' +
    '<div class="kdc-section"><h4>Keyword Density</h4><div class="kdc-table-wrap"><table><thead><tr><th>Keyword</th><th>Count</th><th>Density (%)</th></tr></thead><tbody id="kdc-tbody"></tbody></table></div></div>' +
    '<div class="kdc-section"><h4>2-Word Phrases (2-grams)</h4><div class="kdc-table-wrap"><table><thead><tr><th>Phrase</th><th>Count</th></tr></thead><tbody id="kdc-tbody-2"></tbody></table></div></div>' +
    '<div class="kdc-section"><h4>3-Word Phrases (3-grams)</h4><div class="kdc-table-wrap"><table><thead><tr><th>Phrase</th><th>Count</th></tr></thead><tbody id="kdc-tbody-3"></tbody></table></div></div></div>';

  var CSS =
    '.kdc-widget{display:flex;flex-direction:column;gap:16px}' +
    '.kdc-field{display:flex;flex-direction:column;gap:4px}' +
    '.kdc-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.kdc-field textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;line-height:1.6;background:var(--bg);color:var(--text);outline:none;resize:vertical;font-family:inherit}' +
    '.kdc-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.kdc-stats{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.kdc-stat{text-align:center;padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.kdc-sl{font-size:.7rem;color:var(--text-tertiary);text-transform:uppercase}' +
    '.kdc-sv{font-size:1.5rem;font-weight:800;color:var(--primary)}' +
    '.kdc-section h4{font-size:.9rem;margin-bottom:8px}' +
    '.kdc-table-wrap{max-height:260px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.kdc-table-wrap table{width:100%;border-collapse:collapse;font-size:.82rem}' +
    '.kdc-table-wrap th{padding:8px 12px;text-align:right;background:var(--bg);border-bottom:2px solid var(--border);color:var(--text-secondary);position:sticky;top:0}' +
    '.kdc-table-wrap th:first-child{text-align:left}' +
    '.kdc-table-wrap td{padding:6px 12px;text-align:right;border-bottom:1px solid var(--border)}' +
    '.kdc-table-wrap td:first-child{text-align:left;font-weight:500}' +
    '.kdc-table-wrap tr:hover td{background:var(--bg)}' +
    '@media(max-width:500px){.kdc-stats{grid-template-columns:1fr 1fr}}';

  function isStopWord(w) { return STOP_WORDS.indexOf(w.toLowerCase()) >= 0; }

  function analyze() {
    var text = w('kdc-input').value || '';
    var words = text.toLowerCase().match(/\p{L}+(?:'\p{L}+)?/gu) || [];
    var chars = text.length;
    var wordCount = words.length;

    // Unique words (excl stop words)
    var freq = {};
    for (var i = 0; i < words.length; i++) {
      var ww = words[i];
      if (ww.length < 2 || isStopWord(ww)) continue;
      freq[ww] = (freq[ww] || 0) + 1;
    }

    var unique = Object.keys(freq).length;
    var avgLength = wordCount > 0 ? (words.reduce(function (s, w) { return s + w.length; }, 0) / wordCount) : 0;

    w('kdc-words').textContent = wordCount;
    w('kdc-chars').textContent = chars;
    w('kdc-unique').textContent = unique;
    w('kdc-avg').textContent = avgLength.toFixed(1);

    // Keyword density table
    var sorted = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; });
    var tbody = document.getElementById('kdc-tbody');
    tbody.innerHTML = '';
    var shown = 0;
    for (var j = 0; j < sorted.length && shown < 50; j++) {
      var kw = sorted[j];
      var density = (freq[kw] / wordCount) * 100;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + kw + '</td><td>' + freq[kw] + '</td><td>' + density.toFixed(2) + '%</td>';
      tbody.appendChild(tr);
      shown++;
    }

    // 2-grams
    var grams2 = {};
    for (var k = 0; k < words.length - 1; k++) {
      var g2 = words[k] + ' ' + words[k + 1];
      grams2[g2] = (grams2[g2] || 0) + 1;
    }
    var s2 = Object.keys(grams2).sort(function (a, b) { return grams2[b] - grams2[a]; });
    var t2 = document.getElementById('kdc-tbody-2');
    t2.innerHTML = '';
    for (var m = 0; m < Math.min(s2.length, 30); m++) {
      var r2 = document.createElement('tr');
      r2.innerHTML = '<td>' + s2[m] + '</td><td>' + grams2[s2[m]] + '</td>';
      t2.appendChild(r2);
    }

    // 3-grams
    var grams3 = {};
    for (var n = 0; n < words.length - 2; n++) {
      var g3 = words[n] + ' ' + words[n + 1] + ' ' + words[n + 2];
      grams3[g3] = (grams3[g3] || 0) + 1;
    }
    var s3 = Object.keys(grams3).sort(function (a, b) { return grams3[b] - grams3[a]; });
    var t3 = document.getElementById('kdc-tbody-3');
    t3.innerHTML = '';
    for (var p = 0; p < Math.min(s3.length, 30); p++) {
      var r3 = document.createElement('tr');
      r3.innerHTML = '<td>' + s3[p] + '</td><td>' + grams3[s3[p]] + '</td>';
      t3.appendChild(r3);
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('kdc-input').addEventListener('input', analyze);
    analyze();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
