(function () {
  var root = document.createElement('style');
  root.textContent = [
    '.ue-widget {',
    '  max-width: 640px;',
    '  margin: 2rem 0;',
    '  font-family: var(--font-family, system-ui, sans-serif);',
    '}',
    '.ue-widget label {',
    '  display: block;',
    '  font-weight: 600;',
    '  margin-bottom: 0.5rem;',
    '  color: var(--text-color, #1a1a1a);',
    '}',
    '.ue-widget textarea {',
    '  width: 100%;',
    '  padding: 0.75rem;',
    '  border: 1px solid var(--border-color, #ccc);',
    '  border-radius: var(--border-radius, 6px);',
    '  font-family: var(--font-family-mono, "Cascadia Code", "JetBrains Mono", monospace);',
    '  font-size: 0.9rem;',
    '  resize: vertical;',
    '  box-sizing: border-box;',
    '  background: var(--input-bg, #fff);',
    '  color: var(--text-color, #1a1a1a);',
    '}',
    '.ue-section {',
    '  margin-bottom: 1.5rem;',
    '}',
    '.ue-actions {',
    '  display: flex;',
    '  gap: 0.5rem;',
    '  margin-top: 0.75rem;',
    '}',
    '.ue-widget .btn,',
    '.ue-widget .btn-secondary {',
    '  padding: 0.5rem 1.25rem;',
    '  border: none;',
    '  border-radius: var(--border-radius, 6px);',
    '  cursor: pointer;',
    '  font-size: 0.9rem;',
    '  font-weight: 500;',
    '  transition: opacity 0.15s, transform 0.1s;',
    '}',
    '.ue-widget .btn:hover,',
    '.ue-widget .btn-secondary:hover {',
    '  opacity: 0.85;',
    '}',
    '.ue-widget .btn:active,',
    '.ue-widget .btn-secondary:active {',
    '  transform: scale(0.97);',
    '}',
    '.ue-widget .btn {',
    '  background: var(--primary-color, #2563eb);',
    '  color: #fff;',
    '}',
    '.ue-widget .btn-secondary {',
    '  background: var(--secondary-bg, #e5e7eb);',
    '  color: var(--text-color, #1a1a1a);',
    '}',
    '.ue-error {',
    '  padding: 0.75rem;',
    '  border-radius: var(--border-radius, 6px);',
    '  background: var(--error-bg, #fef2f2);',
    '  color: var(--error-color, #b91c1c);',
    '  border: 1px solid var(--error-border, #fecaca);',
    '  font-size: 0.9rem;',
    '}',
  ].join('\n');
  document.head.appendChild(root);

  function getInput() { return document.getElementById('ue-input'); }
  function getOutput() { return document.getElementById('ue-output'); }
  function getError() { return document.getElementById('ue-error'); }

  window.ueEncode = function () {
    var inp = getInput(), out = getOutput(), err = getError();
    err.style.display = 'none';
    try { out.value = encodeURIComponent(inp.value); } catch (e) { showErr(e.message); }
  };

  window.ueDecode = function () {
    var inp = getInput(), out = getOutput(), err = getError();
    err.style.display = 'none';
    try {
      out.value = decodeURIComponent(inp.value.trim());
    } catch (e) {
      showErr('Invalid URL-encoded input: ' + e.message);
    }
  };

  window.ueClear = function () {
    getInput().value = '';
    getOutput().value = '';
    getError().style.display = 'none';
  };

  window.ueCopy = function () {
    var out = getOutput(), btn = out.nextElementSibling;
    if (!out.value) return;
    navigator.clipboard.writeText(out.value).then(function () {
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(function () { btn.textContent = orig; }, 1800);
    });
  };

  function showErr(msg) {
    var err = getError();
    err.textContent = msg;
    err.style.display = 'block';
  }
})();
