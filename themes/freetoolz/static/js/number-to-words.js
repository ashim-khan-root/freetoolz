(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="nw-widget">' +
      '<div class="nw-field"><label for="nw-number">Enter a number</label><input type="text" id="nw-number" value="1234" placeholder="Enter any number..."></div>' +
      '<div class="nw-opts">' +
        '<label class="nw-cb"><input type="checkbox" id="nw-currency"> Currency format (dollars and cents)</label>' +
        '<label class="nw-cb"><input type="checkbox" id="nw-indian"> Indian numbering (lakh/crore)</label>' +
      '</div>' +
      '<div class="nw-result" id="nw-result">One thousand two hundred thirty-four</div>' +
      '<button id="nw-copy-btn" class="nw-btn">Copy to Clipboard</button>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.nw-widget{display:flex;flex-direction:column;gap:14px}' +
    '.nw-field{display:flex;flex-direction:column;gap:4px}' +
    '.nw-field label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.nw-field input{padding:12px 14px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:1.1rem;font-weight:600;background:var(--bg);color:var(--text);outline:none;transition:border-color var(--transition),box-shadow var(--transition);font-family:monospace}' +
    '.nw-field input:focus{border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-light)}' +
    '.nw-opts{display:flex;gap:20px;flex-wrap:wrap}' +
    '.nw-cb{display:flex;align-items:center;gap:6px;font-size:.9rem;color:var(--text);cursor:pointer}' +
    '.nw-cb input[type="checkbox"]{width:16px;height:16px;accent-color:var(--primary);cursor:pointer}' +
    '.nw-result{padding:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);font-size:1.1rem;line-height:1.6;min-height:50px;color:var(--text)}' +
    '.nw-btn{padding:12px 28px;border:none;border-radius:var(--radius-sm);font-size:.95rem;font-weight:700;cursor:pointer;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;transition:var(--transition);align-self:flex-start}' +
    '.nw-btn:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(99,102,241,.3)}';
  document.head.appendChild(style);

  var ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function convertHundreds(n) {
    var str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  }

  function convertIndian(n) {
    var str = '';
    if (n >= 10000000) { str += convertHundreds(Math.floor(n / 10000000)) + ' crore '; n %= 10000000; }
    if (n >= 100000) { str += convertHundreds(Math.floor(n / 100000)) + ' lakh '; n %= 100000; }
    if (n >= 1000) { str += convertHundreds(Math.floor(n / 1000)) + ' thousand '; n %= 1000; }
    if (n > 0) { str += convertHundreds(n); }
    return str.trim() || 'zero';
  }

  function convertStandard(n) {
    var str = '';
    if (n >= 1000000000000000) return n.toString();
    if (n >= 1000000000000) { var q = Math.floor(n / 1000000000000); str += convertHundreds(q) + ' trillion '; n %= 1000000000000; }
    if (n >= 1000000000) { var b = Math.floor(n / 1000000000); str += convertHundreds(b) + ' billion '; n %= 1000000000; }
    if (n >= 1000000) { var m = Math.floor(n / 1000000); str += convertHundreds(m) + ' million '; n %= 1000000; }
    if (n >= 1000) { var t = Math.floor(n / 1000); str += convertHundreds(t) + ' thousand '; n %= 1000; }
    if (n > 0) { str += convertHundreds(n); }
    return str.trim() || 'zero';
  }

  function convert() {
    var raw = document.getElementById('nw-number').value.trim();
    var currency = document.getElementById('nw-currency').checked;
    var indian = document.getElementById('nw-indian').checked;
    var result = document.getElementById('nw-result');

    if (!raw || !/^-?\d+(\.\d+)?$/.test(raw)) {
      result.textContent = 'Please enter a valid number';
      return;
    }

    var negative = raw.startsWith('-');
    var absRaw = negative ? raw.slice(1) : raw;
    var parts = absRaw.split('.');
    var intPart = parseInt(parts[0]);
    var decPart = parts[1] ? parts[1].replace(/0+$/, '') : '';

    if (intPart >= 1000000000000000 && !indian) {
      result.textContent = 'Number too large (max 999,999,999,999,999)';
      return;
    }
    if (intPart >= 10000000000000 && indian) {
      result.textContent = 'Number too large for Indian system';
      return;
    }

    var words = '';
    if (currency) {
      var intWords = indian ? convertIndian(intPart) : convertStandard(intPart);
      words = intWords.charAt(0).toUpperCase() + intWords.slice(1) + ' dollar' + (intPart !== 1 ? 's' : '');
      if (decPart && parseInt(decPart) > 0) {
        var cents = parseInt(decPart);
        words += ' and ' + convertStandard(cents) + ' cent' + (cents !== 1 ? 's' : '');
      }
    } else {
      words = indian ? convertIndian(intPart) : convertStandard(intPart);
      if (decPart && parseInt(decPart) > 0) {
        words += ' point';
        for (var i = 0; i < decPart.length; i++) {
          words += ' ' + ones[parseInt(decPart[i])];
        }
      }
      words = words.charAt(0).toUpperCase() + words.slice(1);
    }

    if (negative) words = 'Negative ' + words;
    result.textContent = words;
  }

  document.getElementById('nw-number').addEventListener('input', convert);
  document.getElementById('nw-currency').addEventListener('change', convert);
  document.getElementById('nw-indian').addEventListener('change', convert);
  document.getElementById('nw-copy-btn').addEventListener('click', function () {
    var text = document.getElementById('nw-result').textContent;
    if (text) navigator.clipboard.writeText(text);
  });

  convert();
})();
