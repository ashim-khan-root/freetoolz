(function () {
  var w = document.getElementById.bind(document);

  var LOREM = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.';

  var WORDS = LOREM.split(/[\s,]+/);

  function rand(n) { return Math.floor(Math.random() * n); }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function genWords(n) {
    var result = [];
    for (var i = 0; i < n; i++) result.push(WORDS[rand(WORDS.length)]);
    return result.join(' ');
  }

  function genSentence() {
    var len = 5 + rand(15);
    var words = [];
    for (var i = 0; i < len; i++) words.push(WORDS[rand(WORDS.length)]);
    return capitalize(words.join(' ')) + '.';
  }

  function genSentences(n) {
    var result = [];
    for (var i = 0; i < n; i++) result.push(genSentence());
    return result.join(' ');
  }

  function genParagraph() {
    var sentences = 3 + rand(5);
    return genSentences(sentences);
  }

  function genParagraphs(n) {
    var result = [];
    for (var i = 0; i < n; i++) result.push(genParagraph());
    return result.join('\n\n');
  }

  var HTML =
    '<div class="lip-widget">' +
    '<div class="lip-bar">' +
    '<div class="lip-field"><label>Mode</label><select id="lip-mode"><option value="words">Words</option><option value="sentences" selected>Sentences</option><option value="paragraphs">Paragraphs</option></select></div>' +
    '<div class="lip-field"><label>Quantity</label><input type="number" id="lip-qty" value="3" min="1" max="500"></div>' +
    '<div class="lip-field lip-field-btn"><label>&nbsp;</label><button id="lip-gen-btn" class="lip-btn">Generate</button></div>' +
    '</div>' +
    '<div class="lip-output" id="lip-output">Click Generate to create Lorem Ipsum text.</div>' +
    '<div class="lip-actions"><button id="lip-copy" class="lip-btn-sm">Copy to Clipboard</button></div></div>';

  var CSS =
    '.lip-widget{display:flex;flex-direction:column;gap:14px}' +
    '.lip-bar{display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:end}' +
    '.lip-field{display:flex;flex-direction:column;gap:4px}' +
    '.lip-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.lip-field select,.lip-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none}' +
    '.lip-field input:focus,.lip-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.lip-btn{padding:10px 24px;border:none;border-radius:var(--radius-sm);font-size:.9rem;font-weight:600;cursor:pointer;background:var(--primary);color:#fff;transition:var(--transition)}' +
    '.lip-btn:hover{background:var(--primary-dark)}' +
    '.lip-btn-sm{padding:7px 18px;border:1px solid var(--primary);border-radius:var(--radius-sm);font-size:.8rem;font-weight:600;cursor:pointer;background:transparent;color:var(--primary)}' +
    '.lip-btn-sm:hover{background:var(--primary);color:#fff}' +
    '.lip-output{padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);font-size:.9rem;line-height:1.7;color:var(--text);min-height:120px;max-height:400px;overflow-y:auto}' +
    '.lip-actions{display:flex;gap:8px}' +
    '@media(max-width:500px){.lip-bar{grid-template-columns:1fr 1fr}}';

  function generate() {
    var mode = w('lip-mode').value;
    var qty = parseInt(w('lip-qty').value) || 1;
    var text = '';

    switch (mode) {
      case 'words': text = genWords(qty); break;
      case 'sentences': text = genSentences(qty); break;
      case 'paragraphs': text = genParagraphs(qty); break;
    }
    w('lip-output').textContent = text;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('lip-gen-btn').addEventListener('click', generate);
    w('lip-copy').addEventListener('click', function () {
      navigator.clipboard.writeText(w('lip-output').textContent);
      this.textContent = 'Copied!';
      var t = this; setTimeout(function () { t.textContent = 'Copy to Clipboard'; }, 1500);
    });
    generate();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
