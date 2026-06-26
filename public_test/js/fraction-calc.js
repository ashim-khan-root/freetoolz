(function () {
  var w = document.getElementById.bind(document);

  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }

  function simplify(n, d) {
    if (d === 0) return { n: n, d: 0 };
    if (n === 0) return { n: 0, d: 1 };
    var g = gcd(Math.abs(n), Math.abs(d));
    var sign = (n < 0 ? -1 : 1) * (d < 0 ? -1 : 1);
    return { n: sign * Math.abs(n) / g, d: Math.abs(d) / g };
  }

  var HTML =
    '<div class="fr-widget">' +
    '<div class="fr-grid">' +
    '<div class="fr-frac">' +
    '<input type="number" id="fr-n1" value="1" class="fr-num" step="1"><hr class="fr-bar"><input type="number" id="fr-d1" value="3" class="fr-den" step="1" min="1">' +
    '</div>' +
    '<div class="fr-op">' +
    '<select id="fr-op" class="fr-op-sel"><option value="add">+</option><option value="sub">−</option><option value="mul" selected>&times;</option><option value="div">&divide;</option></select>' +
    '</div>' +
    '<div class="fr-frac">' +
    '<input type="number" id="fr-n2" value="2" class="fr-num" step="1"><hr class="fr-bar"><input type="number" id="fr-d2" value="5" class="fr-den" step="1" min="1">' +
    '</div>' +
    '<div class="fr-op">=</div>' +
    '<div class="fr-frac fr-frac-result">' +
    '<span class="fr-num fr-ans-num" id="fr-rn">7</span><hr class="fr-bar"><span class="fr-den fr-ans-den" id="fr-rd">15</span>' +
    '</div>' +
    '</div>' +
    '<div class="fr-details" id="fr-details">' +
    '<div class="fr-detail-item">Decimal: <strong id="fr-decimal">0.4667</strong></div>' +
    '<div class="fr-detail-item">In words: <strong id="fr-words">seven-fifteenths</strong></div>' +
    '</div>' +
    '<div class="fr-steps" id="fr-steps"></div></div>';

  var CSS =
    '.fr-widget{display:flex;flex-direction:column;gap:20px}' +
    '.fr-grid{display:flex;align-items:center;gap:16px;justify-content:center;flex-wrap:wrap}' +
    '.fr-frac{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:80px}' +
    '.fr-frac-result .fr-num,.fr-frac-result .fr-den{font-size:1.3rem;font-weight:800;color:var(--primary)}' +
    '.fr-num,.fr-den{width:80px;padding:10px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1.1rem;text-align:center;background:var(--bg);color:var(--text);outline:none}' +
    '.fr-num:focus,.fr-den:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.fr-bar{width:100%;border:none;border-top:2px solid var(--text);margin:0}' +
    '.fr-frac-result .fr-bar{border-color:var(--primary)}' +
    '.fr-op{font-size:1.8rem;font-weight:700;color:var(--text-secondary)}' +
    '.fr-op-sel{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1.3rem;background:var(--bg);color:var(--text);outline:none}' +
    '.fr-details{display:flex;gap:24px;justify-content:center;padding:12px;background:var(--bg);border-radius:var(--radius-sm);font-size:.9rem;color:var(--text-secondary)}' +
    '.fr-steps{padding:14px 18px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);font-size:.85rem;line-height:1.7;color:var(--text-secondary)}' +
    '@media(max-width:500px){.fr-grid{gap:10px}.fr-num,.fr-den{width:65px}}';

  var NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  var TENS_WORDS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function numToWords(n) {
    if (n < 0) return 'negative ' + numToWords(-n);
    if (n <= 20) return NUM_WORDS[n];
    if (n < 100) {
      var t = Math.floor(n / 10);
      var u = n % 10;
      return TENS_WORDS[t] + (u > 0 ? '-' + NUM_WORDS[u] : '');
    }
    if (n < 1000) {
      var h = Math.floor(n / 100);
      var r = n % 100;
      return NUM_WORDS[h] + ' hundred' + (r > 0 ? ' ' + numToWords(r) : '');
    }
    return n.toString();
  }

  function ordinal(d) {
    if (d === 2) return 'halves';
    if (d === 3) return 'thirds';
    if (d === 4) return 'fourths';
    if (d <= 20) return NUM_WORDS[d] + 'ths';
    return numToWords(d) + 'ths';
  }

  function calc() {
    var n1 = parseInt(w('fr-n1').value) || 0;
    var d1 = parseInt(w('fr-d1').value) || 1;
    var n2 = parseInt(w('fr-n2').value) || 0;
    var d2 = parseInt(w('fr-d2').value) || 1;
    var op = w('fr-op').value;

    if (d1 <= 0 || d2 <= 0) { w('fr-rn').textContent = 'Err'; w('fr-rd').textContent = '?'; return; }

    var rn, rd, steps = '';
    var s1 = simplify(n1, d1), s2 = simplify(n2, d2);
    var sn1 = s1.n, sd1 = s1.d, sn2 = s2.n, sd2 = s2.d;

    switch (op) {
      case 'add':
        rn = sn1 * sd2 + sn2 * sd1;
        rd = sd1 * sd2;
        steps = sn1 + '/' + sd1 + ' + ' + sn2 + '/' + sd2 + ' = (' + sn1 + ' &times; ' + sd2 + ' + ' + sn2 + ' &times; ' + sd1 + ') / (' + sd1 + ' &times; ' + sd2 + ') = ' + rn + '/' + rd;
        break;
      case 'sub':
        rn = sn1 * sd2 - sn2 * sd1;
        rd = sd1 * sd2;
        steps = sn1 + '/' + sd1 + ' - ' + sn2 + '/' + sd2 + ' = (' + sn1 + ' &times; ' + sd2 + ' - ' + sn2 + ' &times; ' + sd1 + ') / (' + sd1 + ' &times; ' + sd2 + ') = ' + rn + '/' + rd;
        break;
      case 'mul':
        rn = sn1 * sn2;
        rd = sd1 * sd2;
        steps = sn1 + '/' + sd1 + ' &times; ' + sn2 + '/' + sd2 + ' = (' + sn1 + ' &times; ' + sn2 + ') / (' + sd1 + ' &times; ' + sd2 + ') = ' + rn + '/' + rd;
        break;
      case 'div':
        rn = sn1 * sd2;
        rd = sd1 * sn2;
        steps = sn1 + '/' + sd1 + ' &divide; ' + sn2 + '/' + sd2 + ' = (' + sn1 + ' &times; ' + sd2 + ') / (' + sd1 + ' &times; ' + sn2 + ') = ' + rn + '/' + rd;
        break;
    }

    if (rd < 0) { rn = -rn; rd = -rd; }
    var result = simplify(rn, rd);
    if (result.d === 0) { w('fr-rn').textContent = 'Err'; w('fr-rd').textContent = '?'; return; }

    w('fr-rn').textContent = result.n;
    w('fr-rd').textContent = result.d;

    var decimal = result.n / result.d;
    w('fr-decimal').textContent = decimal.toFixed(4);

    var words = '';
    if (result.n === 0) words = 'zero';
    else if (result.d === 1) words = numToWords(result.n);
    else {
      var absN = Math.abs(result.n);
      var prefix = result.n < 0 ? 'negative ' : '';
      words = prefix + numToWords(absN) + ' ' + ordinal(result.d);
      if (absN !== 1) words = words.replace('half', 'halves');
    }
    w('fr-words').textContent = words;

    // Show simplification step
    if (n1 !== sn1 || d1 !== sd1 || n2 !== sn2 || d2 !== sd2) {
      var preSteps = '';
      if (n1 !== sn1 || d1 !== sd1) preSteps += 'Simplify ' + n1 + '/' + d1 + ' = ' + sn1 + '/' + sd1 + '<br>';
      if (n2 !== sn2 || d2 !== sd2) preSteps += 'Simplify ' + n2 + '/' + d2 + ' = ' + sn2 + '/' + sd2 + '<br>';
      steps = preSteps + steps;
    }

    var finalStep = '';
    if (result.n !== rn || result.d !== rd) {
      finalStep = '<br>Simplify: ' + rn + '/' + rd + ' = <strong>' + result.n + '/' + result.d + '</strong>';
    }
    document.getElementById('fr-steps').innerHTML = (steps || '') + finalStep;
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    document.querySelectorAll('#fr-n1, #fr-d1, #fr-n2, #fr-d2, #fr-op').forEach(function (el) {
      el.addEventListener('input', calc); el.addEventListener('change', calc);
    });
    calc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
