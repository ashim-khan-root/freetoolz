(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="read-widget">' +
    '<div class="read-field"><label>Paste your text here</label><textarea id="read-text" rows="10" placeholder="Paste article, blog post, or content to analyze readability...">The quick brown fox jumps over the lazy dog. This simple sentence uses every letter of the alphabet and is often used for typing practice. Readability analysis helps writers create content that matches their audience reading level.</textarea></div>' +
    '<div class="read-results-grid">' +
    '<div class="read-rc"><span class="read-rl">Word Count</span><span class="read-rv" id="read-words">0</span></div>' +
    '<div class="read-rc"><span class="read-rl">Sentences</span><span class="read-rv" id="read-sentences">0</span></div>' +
    '<div class="read-rc"><span class="read-rl">Syllables</span><span class="read-rv" id="read-syllables">0</span></div>' +
    '<div class="read-rc"><span class="read-rl">Avg. Words/Sentence</span><span class="read-rv" id="read-avg-words">0</span></div>' +
    '</div>' +
    '<div class="read-scores-grid">' +
    '<div class="read-sc" style="background:var(--primary);color:#fff"><span class="read-sl" style="color:rgba(255,255,255,.7)">Flesch Reading Ease</span><span class="read-sv" id="read-flesch" style="color:#fff">0</span></div>' +
    '<div class="read-sc"><span class="read-sl">Flesch-Kincaid Grade</span><span class="read-sv" id="read-grade">0</span></div>' +
    '<div class="read-sc"><span class="read-sl">Reading Level</span><span class="read-sv" id="read-level">—</span></div>' +
    '</div>' +
    '<div class="read-note" id="read-note">Flesch Reading Ease: 90-100 = Very Easy, 60-70 = Plain English, 0-30 = Very Difficult. Aim for 60-70 for general audiences.</div></div>';

  var CSS =
    '.read-widget{display:flex;flex-direction:column;gap:16px}' +
    '.read-field{display:flex;flex-direction:column;gap:4px}' +
    '.read-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.read-field textarea{padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.95rem;background:var(--bg);color:var(--text);outline:none;font-family:inherit;resize:vertical;min-height:150px}' +
    '.read-field textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.read-results-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}' +
    '.read-rc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:14px;text-align:center}' +
    '.read-rl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}' +
    '.read-rv{font-size:1.1rem;font-weight:800;color:var(--primary);display:block}' +
    '.read-scores-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}' +
    '.read-sc{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center}' +
    '.read-sl{display:block;font-size:.72rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}' +
    '.read-sv{font-size:1.5rem;font-weight:800;color:var(--primary);display:block}' +
    '.read-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:600px){.read-results-grid{grid-template-columns:1fr 1fr}.read-scores-grid{grid-template-columns:1fr}}';

  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!word) return 0;
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    var syl = word.match(/[aeiouy]{1,2}/g);
    return syl ? syl.length : 1;
  }

  function calc() {
    var text = w('read-text').value.trim();
    if (!text) {
      ['read-words', 'read-sentences', 'read-syllables', 'read-avg-words', 'read-flesch', 'read-grade'].forEach(function (id) { w(id).textContent = '0'; });
      w('read-level').textContent = '—';
      return;
    }

    var words = text.match(/[a-zA-Z]+(?:'[a-zA-Z]+)?/g) || [];
    var wordCount = words.length;
    var sentences = text.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; }).length || 1;
    var syllables = 0;
    for (var i = 0; i < words.length; i++) syllables += countSyllables(words[i]);

    var avgWords = wordCount / sentences;
    var avgSyllables = syllables / wordCount;

    var flesch = 206.835 - 1.015 * avgWords - 84.6 * avgSyllables;
    flesch = Math.max(0, Math.min(100, flesch));
    var grade = 0.39 * avgWords + 11.8 * avgSyllables - 15.59;
    grade = Math.max(1, Math.round(grade * 10) / 10);

    var level = '';
    if (flesch >= 90) level = 'Very Easy (5th grade)';
    else if (flesch >= 80) level = 'Easy (6th grade)';
    else if (flesch >= 70) level = 'Fairly Easy (7th grade)';
    else if (flesch >= 60) level = 'Standard (8th-9th grade)';
    else if (flesch >= 50) level = 'Fairly Difficult (10th-12th grade)';
    else if (flesch >= 30) level = 'Difficult (College)';
    else level = 'Very Difficult (College Graduate)';

    w('read-words').textContent = wordCount;
    w('read-sentences').textContent = sentences;
    w('read-syllables').textContent = syllables;
    w('read-avg-words').textContent = avgWords.toFixed(1);
    w('read-flesch').textContent = flesch.toFixed(0);
    w('read-grade').textContent = 'Grade ' + grade;
    w('read-level').textContent = level;

    var note = document.getElementById('read-note');
    if (flesch >= 60) {
      note.innerHTML = level + '. Good readability for general audiences. Aim for 60-70 (Plain English) for broad accessibility.';
      note.style.borderLeftColor = '#22c55e';
    } else if (flesch >= 30) {
      note.innerHTML = level + '. This may be hard for general readers. Consider simplifying sentences and using shorter words.';
      note.style.borderLeftColor = '#eab308';
    } else {
      note.innerHTML = level + '. Very complex text. Consider breaking long sentences and replacing complex words for broader audience reach.';
      note.style.borderLeftColor = '#ef4444';
    }
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('read-text').addEventListener('input', calc);
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
