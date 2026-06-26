(function () {
  var w = document.getElementById.bind(document);

  var STATUS_CODES = {
    '100': { name: 'Continue', cat: 'Informational', desc: 'Server has received the request headers and the client should proceed to send the body.' },
    '101': { name: 'Switching Protocols', cat: 'Informational', desc: 'Server is switching protocols as requested by the client.' },
    '200': { name: 'OK', cat: 'Success', desc: 'Standard response for successful HTTP requests.' },
    '201': { name: 'Created', cat: 'Success', desc: 'Request has been fulfilled and a new resource has been created.' },
    '202': { name: 'Accepted', cat: 'Success', desc: 'Request has been accepted for processing but is not yet complete.' },
    '204': { name: 'No Content', cat: 'Success', desc: 'Request succeeded but no content to return (e.g., DELETE requests).' },
    '301': { name: 'Moved Permanently', cat: 'Redirect', desc: 'Resource has been permanently moved to a new URL. Search engines update their indexes.' },
    '302': { name: 'Found (Temporary Redirect)', cat: 'Redirect', desc: 'Resource is temporarily located at a different URL.' },
    '303': { name: 'See Other', cat: 'Redirect', desc: 'Response can be found at another URL using GET.' },
    '304': { name: 'Not Modified', cat: 'Redirect', desc: 'Resource has not been modified since last request (use cache).' },
    '307': { name: 'Temporary Redirect', cat: 'Redirect', desc: 'Request should be repeated with the same method at another URL.' },
    '308': { name: 'Permanent Redirect', cat: 'Redirect', desc: 'Resource has been permanently moved. Like 301 but preserves HTTP method.' },
    '400': { name: 'Bad Request', cat: 'Client Error', desc: 'Server cannot process the request due to malformed syntax.' },
    '401': { name: 'Unauthorized', cat: 'Client Error', desc: 'Authentication is required and has failed or not been provided.' },
    '403': { name: 'Forbidden', cat: 'Client Error', desc: 'Server understood the request but refuses to authorize it.' },
    '404': { name: 'Not Found', cat: 'Client Error', desc: 'Requested resource could not be found on the server.' },
    '405': { name: 'Method Not Allowed', cat: 'Client Error', desc: 'Request method is not supported for the requested resource.' },
    '408': { name: 'Request Timeout', cat: 'Client Error', desc: 'Server timed out waiting for the request.' },
    '409': { name: 'Conflict', cat: 'Client Error', desc: 'Request conflicts with the current state of the resource.' },
    '410': { name: 'Gone', cat: 'Client Error', desc: 'Resource is no longer available and no forwarding address is known.' },
    '429': { name: 'Too Many Requests', cat: 'Client Error', desc: 'User has sent too many requests in a given time (rate limiting).' },
    '451': { name: 'Unavailable For Legal Reasons', cat: 'Client Error', desc: 'Resource is blocked due to legal demands.' },
    '500': { name: 'Internal Server Error', cat: 'Server Error', desc: 'Generic error message when the server encountered an unexpected condition.' },
    '502': { name: 'Bad Gateway', cat: 'Server Error', desc: 'Server received an invalid response from an upstream server.' },
    '503': { name: 'Service Unavailable', cat: 'Server Error', desc: 'Server is temporarily unable to handle the request (overloaded or down for maintenance).' },
    '504': { name: 'Gateway Timeout', cat: 'Server Error', desc: 'Server did not receive a timely response from an upstream server.' }
  };

  var cats = {};
  var codeOpts = '';
  var allCodes = Object.keys(STATUS_CODES).sort(function (a, b) { return parseInt(a) - parseInt(b); });
  for (var i = 0; i < allCodes.length; i++) {
    var c = STATUS_CODES[allCodes[i]];
    codeOpts += '<option value="' + allCodes[i] + '">' + allCodes[i] + ' ' + c.name + '</option>';
    if (!cats[c.cat]) cats[c.cat] = [];
    cats[c.cat].push(allCodes[i]);
  }

  var catHtml = '';
  var catKeys = Object.keys(cats);
  for (var i = 0; i < catKeys.length; i++) {
    var codeList = '';
    for (var j = 0; j < cats[catKeys[i]].length; j++) {
      if (j > 0) codeList += ', ';
      codeList += cats[catKeys[i]][j];
    }
    catHtml += '<div class="hsc-cat"><span class="hsc-cat-name">' + catKeys[i] + '</span><span class="hsc-cat-codes">' + codeList + '</span></div>';
  }

  var HTML =
    '<div class="hsc-widget">' +
    '<div class="hsc-form">' +
    '<div class="hsc-field"><label>Search by Code</label><select id="hsc-code">' + codeOpts + '</select></div>' +
    '<div class="hsc-field"><label>Or Search by Keyword</label><input type="text" id="hsc-search" placeholder="e.g. redirect, timeout, forbidden"></div>' +
    '</div>' +
    '<div class="hsc-detail" id="hsc-detail">' +
    '<div class="hsc-code-big" id="hsc-code-display">200</div>' +
    '<div class="hsc-name" id="hsc-name">OK</div>' +
    '<div class="hsc-cat-badge" id="hsc-cat-badge">Success</div>' +
    '<div class="hsc-desc" id="hsc-desc">Description appears here.</div>' +
    '</div>' +
    '<div class="hsc-categories"><div class="hsc-cat-title">Status Code Categories</div>' + catHtml + '</div>' +
    '<div class="hsc-note">HTTP status codes are grouped into 5 categories: 1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, 5xx Server Error.</div></div>';

  var CSS =
    '.hsc-widget{display:flex;flex-direction:column;gap:16px}' +
    '.hsc-form{display:grid;grid-template-columns:1fr 1fr;gap:12px}' +
    '.hsc-field{display:flex;flex-direction:column;gap:4px}' +
    '.hsc-field>label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.hsc-field input,.hsc-field select{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.92rem;background:var(--bg);color:var(--text);outline:none}' +
    '.hsc-field input:focus,.hsc-field select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}' +
    '.hsc-detail{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:24px;text-align:center}' +
    '.hsc-code-big{font-size:3rem;font-weight:900;color:var(--primary);font-family:monospace;line-height:1}' +
    '.hsc-name{font-size:1.3rem;font-weight:700;color:var(--text);margin:4px 0}' +
    '.hsc-cat-badge{display:inline-block;padding:4px 14px;border-radius:20px;font-size:.78rem;font-weight:600;background:#dbeafe;color:#1e40af;margin:8px 0}' +
    '.hsc-desc{font-size:.92rem;color:var(--text-secondary);line-height:1.5;margin-top:8px}' +
    '.hsc-categories{padding:16px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm)}' +
    '.hsc-cat-title{font-size:.78rem;font-weight:600;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.03em;margin-bottom:10px}' +
    '.hsc-cat{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)}' +
    '.hsc-cat:last-child{border-bottom:none}' +
    '.hsc-cat-name{font-weight:600;color:var(--text);min-width:130px;font-size:.88rem}' +
    '.hsc-cat-codes{color:var(--primary);font-family:monospace;font-size:.88rem}' +
    '.hsc-note{font-size:.85rem;color:var(--text-secondary);padding:14px 18px;border-radius:var(--radius-sm);border-left:3px solid var(--primary);line-height:1.5}' +
    '@media(max-width:500px){.hsc-form{grid-template-columns:1fr}.hsc-cat{flex-direction:column;gap:4px}}';

  function showCode(code) {
    var info = STATUS_CODES[code];
    if (!info) return;
    w('hsc-code-display').textContent = code;
    w('hsc-name').textContent = info.name;
    var badge = document.getElementById('hsc-cat-badge');
    badge.textContent = info.cat;
    var colors = {
      'Informational': 'background:#dbeafe;color:#1e40af',
      'Success': 'background:#d1fae5;color:#065f46',
      'Redirect': 'background:#fef3c7;color:#92400e',
      'Client Error': 'background:#fee2e2;color:#991b1b',
      'Server Error': 'background:#fce7f3;color:#9d174d'
    };
    badge.style.cssText = 'display:inline-block;padding:4px 14px;border-radius:20px;font-size:.78rem;font-weight:600;' + (colors[info.cat] || colors['Informational']);
    w('hsc-desc').textContent = info.desc;
  }

  function search() {
    var query = w('hsc-search').value.toLowerCase().trim();
    if (!query) {
      showCode(w('hsc-code').value);
      return;
    }
    for (var code in STATUS_CODES) {
      var info = STATUS_CODES[code];
      if (info.name.toLowerCase().indexOf(query) > -1 || info.desc.toLowerCase().indexOf(query) > -1 || info.cat.toLowerCase().indexOf(query) > -1 || code.indexOf(query) > -1) {
        w('hsc-code').value = code;
        showCode(code);
        return;
      }
    }
    w('hsc-code-display').textContent = '—';
    w('hsc-name').textContent = 'Not found';
    w('hsc-cat-badge').textContent = '—';
    w('hsc-desc').textContent = 'No status code matches "' + query + '". Try a different keyword.';
  }

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    w('hsc-code').addEventListener('change', function () { showCode(this.value); });
    w('hsc-search').addEventListener('input', search);
    showCode(w('hsc-code').value);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
