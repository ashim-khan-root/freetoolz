(function () {
  var widgetHTML =
    '<div class="json-widget">' +
    '  <div class="json-input-section">' +
    '    <div class="json-header-row">' +
    '      <label>Input JSON</label>' +
    '      <div class="json-actions">' +
    '        <button onclick="formatJSON()" class="btn">Format</button>' +
    '        <button onclick="minifyJSON()" class="btn-secondary">Minify</button>' +
    '        <button onclick="clearJSON()" class="btn-secondary">Clear</button>' +
    "      </div>" +
    "    </div>" +
    '    <textarea id="json-input" rows="8" placeholder=\'Paste your JSON here...\ne.g. {"name":"John","age":30}\'></textarea>' +
    "  </div>" +
    '  <div class="json-output-section">' +
    '    <div class="json-header-row">' +
    "      <label>Output</label>" +
    '      <button onclick="copyOutput()" class="btn-secondary">Copy Result</button>' +
    "    </div>" +
    '    <textarea id="json-output" rows="8" readonly placeholder="Formatted JSON will appear here..."></textarea>' +
    "  </div>" +
    '  <div id="json-error" class="json-error" style="display:none;"></div>' +
    "</div>";

  var style = document.createElement("style");
  style.textContent =
    ".json-widget{display:flex;flex-direction:column;gap:20px}" +
    ".json-header-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:8px}" +
    ".json-header-row label{font-weight:600;font-size:0.95rem;color:var(--text)}" +
    ".json-actions{display:flex;gap:8px;flex-wrap:wrap}" +
    ".btn-secondary{padding:10px 20px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:var(--radius-sm);font-weight:600;font-size:0.9rem;cursor:pointer;transition:var(--transition)}" +
    ".btn-secondary:hover{background:var(--border);border-color:var(--primary-light)}" +
    ".json-widget textarea{width:100%;padding:16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:'SF Mono','Fira Code','Consolas',monospace;font-size:0.85rem;line-height:1.5;color:var(--text);background:var(--bg-card);resize:vertical;transition:var(--transition);min-height:180px}" +
    ".json-widget textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}" +
    ".json-widget textarea[readonly]{background:var(--bg);cursor:default}" +
    ".json-widget textarea[readonly]:focus{box-shadow:none;border-color:var(--border)}" +
    ".json-error{padding:16px;background:#fef2f2;border:1px solid #fecaca;border-radius:var(--radius-sm);color:#b91c1c;font-family:'SF Mono','Fira Code','Consolas',monospace;font-size:0.85rem;line-height:1.5;white-space:pre-wrap;word-break:break-word}" +
    "@media(max-width:640px){.json-header-row{flex-direction:column;align-items:flex-start}.json-actions{width:100%}.json-actions .btn,.json-actions .btn-secondary{flex:1;text-align:center}}";

  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", function () {
    var widget = document.getElementById("tool-widget");
    if (widget) {
      widget.innerHTML = widgetHTML;
    }
  });
})();

function formatJSON() {
  var input = document.getElementById("json-input");
  var output = document.getElementById("json-output");
  var error = document.getElementById("json-error");
  error.style.display = "none";
  error.textContent = "";
  try {
    var parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    showError(e.message);
  }
}

function minifyJSON() {
  var input = document.getElementById("json-input");
  var output = document.getElementById("json-output");
  var error = document.getElementById("json-error");
  error.style.display = "none";
  error.textContent = "";
  try {
    var parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed);
  } catch (e) {
    showError(e.message);
  }
}

function clearJSON() {
  document.getElementById("json-input").value = "";
  document.getElementById("json-output").value = "";
  var error = document.getElementById("json-error");
  error.style.display = "none";
  error.textContent = "";
}

function copyOutput() {
  var output = document.getElementById("json-output");
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(function () {
    var btn = document.querySelector(
      '.json-output-section .btn-secondary'
    );
    if (btn) {
      var orig = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(function () {
        btn.textContent = orig;
      }, 1500);
    }
  });
}

function showError(msg) {
  var error = document.getElementById("json-error");
  error.textContent = msg;
  error.style.display = "block";
}
