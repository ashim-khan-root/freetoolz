(function () {
  var w = document.getElementById.bind(document);

  function isPrime(n) {
    if (n < 2) return false;
    if (n === 2 || n === 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    var limit = Math.sqrt(n);
    for (var i = 5; i <= limit; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  function primeFactors(n) {
    var num = Math.abs(n);
    var factors = [];
    var d = 2;
    while (num > 1) {
      if (d * d > num) { factors.push(num); break; }
      if (num % d === 0) { factors.push(d); num = Math.floor(num / d); }
      else { d++; }
    }
    return factors;
  }

  function getDivisors(n) {
    var divs = [];
    var limit = Math.sqrt(n);
    for (var i = 1; i <= limit; i++) {
      if (n % i === 0) {
        divs.push(i);
        if (i !== n / i) divs.push(n / i);
      }
    }
    return divs.sort(function (a, b) { return a - b; });
  }

  var HTML =
    '<div class="pr-widget">' +
    '<div class="pr-input-row">' +
    '<input type="number" id="pr-input" value="97" class="pr-input" min="1" step="1">' +
    '<button id="pr-check" class="pr-btn">Check</button>' +
    '</div>' +
    '<div class="pr-result" id="pr-result">' +
    '<div class="pr-badge" id="pr-badge">&#x2705; Prime</div>' +
    '<div class="pr-details" id="pr-details">97 is a prime number.</div>' +
    '</div>' +
    '<div class="pr-grid">' +
    '<div class="pr-item"><span class="pr-il">Prime Factors</span><span class="pr-iv" id="pr-factors">97</span></div>' +
    '<div class="pr-item"><span class="pr-il">Divisors</span><span class="pr-iv" id="pr-divisors">1, 97</span></div>' +
    '<div class="pr-item"><span class="pr-il">Next Prime</span><span class="pr-iv" id="pr-next">101</span></div>' +
    '<div class="pr-item"><span class="pr-il">Previous Prime</span><span class="pr-iv" id="pr-prev">89</span></div>' +
    '</div>' +
    '<div class="pr-range-section">' +
    '<label style="font-size:.85rem;font-weight:600;color:var(--text-secondary);display:block;margin-bottom:6px">List Primes Up To:</label>' +
    '<div class="pr-range-row">' +
    '<input type="number" id="pr-range-input" value="100" class="pr-input" min="2" max="10000">' +
    '<button id="pr-list-btn" class="pr-btn">List Primes</button>' +
    '</div>' +
    '<div class="pr-range-output" id="pr-range-output"></div>' +
    '</div></div>';

  var CSS =
    '.pr-widget{display:flex;flex-direction:column;gap:16px}' +
    '.pr-input-row{display:flex;gap:10px}' +
    '.pr-input{flex:1;padding:14px 16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:1.2rem;background:var(--bg);color:var(--text);outline:none;font-family:monospace}' +
    '.pr-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.pr-btn{padding:12px 28px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);font-size:.95rem;font-weight:600;cursor:pointer}' +
    '.pr-btn:hover{background:var(--primary-dark)}' +
    '.pr-result{text-align:center;padding:24px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}' +
    '.pr-badge{font-size:1.3rem;font-weight:800;margin-bottom:6px}' +
    '.pr-details{font-size:.9rem;color:var(--text-secondary)}' +
    '.pr-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:8px}' +
    '.pr-item{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px}' +
    '.pr-il{display:block;font-size:.68rem;color:var(--text-tertiary);text-transform:uppercase;margin-bottom:4px}' +
    '.pr-iv{font-size:.9rem;font-weight:700;color:var(--text);word-break:break-all}' +
    '.pr-range-section{padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}' +
    '.pr-range-row{display:flex;gap:10px;margin-bottom:10px}' +
    '.pr-range-output{padding:10px;background:var(--bg-card);border-radius:var(--radius-sm);font-family:monospace;font-size:.82rem;line-height:1.8;max-height:200px;overflow-y:auto}' +
    '@media(max-width:600px){.pr-grid{grid-template-columns:1fr 1fr}}';

  function check() {
    var n = parseInt(w('pr-input').value) || 0;
    var prime = isPrime(n);
    var badge = document.getElementById('pr-badge');
    var details = document.getElementById('pr-details');

    if (n < 2) {
      badge.innerHTML = '&#x274C; Not Prime';
      badge.style.color = '#ef4444';
      details.textContent = 'Numbers less than 2 are not prime by definition.';
    } else if (prime) {
      badge.innerHTML = '&#x2705; Prime';
      badge.style.color = '#22c55e';
      details.textContent = n.toLocaleString() + ' is a prime number. It has exactly two divisors: 1 and itself.';
    } else {
      badge.innerHTML = '&#x274C; Not Prime';
      badge.style.color = '#ef4444';
      details.textContent = n.toLocaleString() + ' is not a prime number. It has more than two divisors.';
    }

    // Factors
    var factors = primeFactors(n);
    w('pr-factors').textContent = factors.length > 0 ? factors.join(' &times; ') : 'None';

    // Divisors
    var divs = getDivisors(n);
    w('pr-divisors').textContent = divs.join(', ');

    // Next prime
    var next = n + 1;
    while (!isPrime(next)) next++;
    w('pr-next').textContent = next.toLocaleString();

    // Prev prime
    var prev = n - 1;
    while (prev >= 2 && !isPrime(prev)) prev--;
    w('pr-prev').textContent = prev < 2 ? 'None' : prev.toLocaleString();
  }

  function listPrimes() {
    var limit = parseInt(w('pr-range-input').value) || 100;
    if (limit > 100000) limit = 100000;
    var primes = [];
    for (var i = 2; i <= limit; i++) {
      if (isPrime(i)) primes.push(i);
    }
    var output = document.getElementById('pr-range-output');
    if (primes.length === 0) {
      output.textContent = 'No primes found in range.';
      return;
    }
    var html = '<strong>' + primes.length + ' primes</strong> up to ' + limit + ':<br>';
    var chunk = [];
    for (var j = 0; j < primes.length; j += 20) {
      chunk.push(primes.slice(j, j + 20).join(', '));
    }
    output.innerHTML = html + chunk.join('<br>');
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('pr-check').addEventListener('click', check);
    w('pr-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
    w('pr-list-btn').addEventListener('click', listPrimes);
    w('pr-range-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') listPrimes(); });
    check();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
