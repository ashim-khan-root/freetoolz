(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="ls-widget">' +
      '<div class="ls-cols">' +
        '<div class="ls-col">' +
          '<label for="ls-input">Enter list (one item per line)</label>' +
          '<textarea id="ls-input" rows="10" placeholder="Apple&#10;Banana&#10;Cherry&#10;Apple&#10;Date"></textarea>' +
        '</div>' +
        '<div class="ls-col">' +
          '<label for="ls-output">Sorted output</label>' +
          '<textarea id="ls-output" rows="10" readonly></textarea>' +
        '</div>' +
      '</div>' +
      '<div class="ls-opts">' +
        '<div class="ls-field"><label>Sort type</label><select id="ls-type"><option value="alpha">Alphabetical</option><option value="numeric">Numeric</option></select></div>' +
        '<div class="ls-field"><label>Order</label><select id="ls-order"><option value="asc">A-Z / Ascending</option><option value="desc">Z-A / Descending</option></select></div>' +
        '<div class="ls-field ls-check"><label>&nbsp;</label><label class="ls-cb"><input type="checkbox" id="ls-unique"> Remove duplicates</label></div>' +
        '<div class="ls-field ls-check"><label>&nbsp;</label><label class="ls-cb"><input type="checkbox" id="ls-trim"> Trim whitespace</label></div>' +
      '</div>' +
      '<div class="ls-actions">' +
        '<button id="ls-sort-btn" class="ls-btn">Sort</button>' +
        '<button id="ls-copy-btn" class="ls-btn ls-btn-secondary">Copy Output</button>' +
        '<span class="ls-count" id="ls-count"></span>' +
      '</div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.ls-widget{display:flex;flex-direction:column;gap:14px}' +
    '.ls-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}' +
    '.ls-col{display:flex;flex-direction:column;gap:4px}' +
    '.ls-col label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.ls-col textarea{width:100%;padding:12px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;font-family:inherit;background:var(--bg);color:var(--text);resize:vertical;outline:none;transition:border-color var(--transition),box-shadow var(--transition);line-height:1.5}' +
    '.ls-col textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-light)}' +
    '.ls-opts{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end}' +
    '.ls-field{display:flex;flex-direction:column;gap:4px}' +
    '.ls-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary);white-space:nowrap}' +
    '.ls-field select{padding:8px 12px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:.9rem;background:var(--bg);color:var(--text);outline:none;cursor:pointer}' +
    '.ls-field select:focus{border-color:var(--primary)}' +
    '.ls-cb{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:.9rem;color:var(--text)}' +
    '.ls-cb input[type="checkbox"]{width:16px;height:16px;accent-color:var(--primary);cursor:pointer}' +
    '.ls-actions{display:flex;gap:10px;align-items:center}' +
    '.ls-btn{padding:12px 28px;border:none;border-radius:var(--radius-sm);font-size:.95rem;font-weight:700;cursor:pointer;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;transition:var(--transition)}' +
    '.ls-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,.3)}' +
    '.ls-btn-secondary{background:var(--bg);border:1px solid var(--border);color:var(--text)}' +
    '.ls-btn-secondary:hover{background:var(--primary);color:#fff;border-color:var(--primary)}' +
    '.ls-count{font-size:.85rem;color:var(--text-secondary);margin-left:auto}' +
    '@media(max-width:640px){.ls-cols{grid-template-columns:1fr}}';
  document.head.appendChild(style);

  var input = document.getElementById('ls-input');
  var output = document.getElementById('ls-output');
  var sortType = document.getElementById('ls-type');
  var sortOrder = document.getElementById('ls-order');
  var uniqueChk = document.getElementById('ls-unique');
  var trimChk = document.getElementById('ls-trim');
  var countSpan = document.getElementById('ls-count');

  function doSort() {
    var items = input.value.split('\n');
    if (trimChk.checked) {
      items = items.map(function (s) { return s.trim(); });
    }
    items = items.filter(function (s) { return s.length > 0; });
    var originalCount = items.length;

    if (uniqueChk.checked) {
      var seen = {};
      items = items.filter(function (s) {
        var key = s.toLowerCase();
        if (seen[key]) return false;
        seen[key] = true;
        return true;
      });
    }

    var type = sortType.value;
    var order = sortOrder.value;

    if (type === 'numeric') {
      items.sort(function (a, b) {
        var an = parseFloat(a);
        var bn = parseFloat(b);
        if (isNaN(an)) an = 0;
        if (isNaN(bn)) bn = 0;
        return order === 'asc' ? an - bn : bn - an;
      });
    } else {
      items.sort(function (a, b) {
        var al = a.toLowerCase();
        var bl = b.toLowerCase();
        if (al < bl) return order === 'asc' ? -1 : 1;
        if (al > bl) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    output.value = items.join('\n');
    countSpan.textContent = items.length + ' of ' + originalCount + ' items';
  }

  document.getElementById('ls-sort-btn').addEventListener('click', doSort);
  document.getElementById('ls-copy-btn').addEventListener('click', function () {
    if (output.value) {
      navigator.clipboard.writeText(output.value).catch(function () { output.select(); document.execCommand('copy'); });
    }
  });
})();
