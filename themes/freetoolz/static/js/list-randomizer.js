(function () {
  var w = document.getElementById.bind(document);

  var HTML =
    '<div class="lr-widget">' +
    '<div class="lr-layout">' +
    '<div class="lr-input-panel">' +
    '<label style="font-size:.85rem;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:8px">Enter Items (one per line)</label>' +
    '<textarea id="lr-input" class="lr-textarea" placeholder="Item 1&#10;Item 2&#10;Item 3&#10;...">Apple&#10;Banana&#10;Cherry&#10;Date&#10;Elderberry&#10;Fig&#10;Grape</textarea>' +
    '</div>' +
    '<div class="lr-controls">' +
    '<div class="lr-field"><label>Action</label><select id="lr-action"><option value="shuffle">Shuffle All</option><option value="pick">Pick Random</option></select></div>' +
    '<div class="lr-field" id="lr-pick-field"><label>Pick Count</label><input type="number" id="lr-pick" value="1" min="1" max="100"></div>' +
    '<button id="lr-go" class="lr-btn">Go!</button>' +
    '</div>' +
    '<div class="lr-output-panel">' +
    '<label style="font-size:.85rem;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:8px">Result</label>' +
    '<div class="lr-result" id="lr-result">Click "Go!" to randomize</div>' +
    '</div>' +
    '</div></div>';

  var CSS =
    '.lr-widget{display:flex;flex-direction:column;gap:16px}' +
    '.lr-layout{display:grid;grid-template-columns:1fr 220px 1fr;gap:16px}' +
    '.lr-textarea{width:100%;height:240px;padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none;resize:vertical;font-family:inherit}' +
    '.lr-textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.lr-controls{display:flex;flex-direction:column;gap:12px;justify-content:center}' +
    '.lr-field{display:flex;flex-direction:column;gap:4px}' +
    '.lr-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.lr-field select,.lr-field input{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none}' +
    '.lr-field input:focus,.lr-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.lr-btn{padding:12px;border:none;border-radius:var(--radius-sm);font-size:1rem;font-weight:700;cursor:pointer;background:var(--primary);color:#fff;transition:var(--transition)}' +
    '.lr-btn:hover{background:var(--primary-dark)}' +
    '.lr-result{padding:12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);min-height:240px;max-height:400px;overflow-y:auto;font-size:.9rem;line-height:1.7;color:var(--text)}' +
    '.lr-result .lr-item{padding:6px 10px;margin:3px 0;background:var(--bg-card);border-radius:var(--radius-sm);border-left:3px solid var(--primary)}' +
    '.lr-result .lr-pick-item{padding:10px 14px;margin:4px 0;background:var(--primary-glow);border-radius:var(--radius-sm);font-weight:700;font-size:1rem;color:var(--primary)}' +
    '@media(max-width:768px){.lr-layout{grid-template-columns:1fr;gap:12px}.lr-controls{flex-direction:row;flex-wrap:wrap}.lr-textarea{height:150px}.lr-result{min-height:100px}}';

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function go() {
    var input = w('lr-input').value;
    var items = input.split('\n').map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });

    if (items.length === 0) {
      w('lr-result').innerHTML = '<div style="color:var(--text-tertiary);padding:20px;text-align:center">Please enter some items.</div>';
      return;
    }

    var action = w('lr-action').value;
    var result = document.getElementById('lr-result');

    if (action === 'shuffle') {
      var shuffled = shuffle(items.slice());
      var html = shuffled.map(function (item, i) {
        return '<div class="lr-item">' + (i + 1) + '. ' + item + '</div>';
      }).join('');
      result.innerHTML = html;
    } else {
      var pick = parseInt(w('lr-pick').value) || 1;
      if (pick > items.length) pick = items.length;
      var copy = items.slice();
      var picks = [];
      for (var j = 0; j < pick; j++) {
        var idx = Math.floor(Math.random() * copy.length);
        picks.push(copy.splice(idx, 1)[0]);
      }
      if (pick === 1) {
        result.innerHTML = '<div class="lr-pick-item">' + picks[0] + '</div>';
      } else {
        result.innerHTML = picks.map(function (item) {
          return '<div class="lr-pick-item">&#x2713; ' + item + '</div>';
        }).join('');
      }
    }
  }

  function togglePickField() {
    var field = document.getElementById('lr-pick-field');
    field.style.display = w('lr-action').value === 'pick' ? '' : 'none';
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('lr-go').addEventListener('click', go);
    w('lr-action').addEventListener('change', togglePickField);
    togglePickField();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
