(function () {
  var widgetHTML =
    '<div class="b64-widget">' +
    '  <div class="b64-input-section">' +
    '    <label>Input</label>' +
    '    <textarea id="b64-input" rows="6" placeholder="Type or paste text here..."></textarea>' +
    '    <div class="b64-actions">' +
    '      <button onclick="b64Encode()" class="btn">Encode to Base64</button>' +
    '      <button onclick="b64Decode()" class="btn-secondary">Decode from Base64</button>' +
    '      <button onclick="b64Clear()" class="btn-secondary">Clear</button>' +
    "    </div>" +
    "  </div>" +
    '  <div class="b64-output-section">' +
    "    <label>Output</label>" +
    '    <textarea id="b64-output" rows="6" readonly></textarea>' +
    '    <button onclick="b64Copy()" class="btn-secondary">Copy Result</button>' +
    "  </div>" +
    '  <div id="b64-error" class="b64-error" style="display:none;"></div>' +
    "</div>";

  var style = document.createElement("style");
  style.textContent =
    ".b64-widget{display:flex;flex-direction:column;gap:20px}" +
    ".b64-widget label{font-weight:600;font-size:0.95rem;color:var(--text);display:block;margin-bottom:8px}" +
    ".b64-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}" +
    ".btn-secondary{padding:10px 20px;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:var(--radius-sm);font-weight:600;font-size:0.9rem;cursor:pointer;transition:var(--transition)}" +
    ".btn-secondary:hover{background:var(--border);border-color:var(--primary-light)}" +
    ".b64-widget textarea{width:100%;padding:16px;border:1px solid var(--border);border-radius:var(--radius-sm);font-family:'SF Mono','Fira Code','Consolas',monospace;font-size:0.85rem;line-height:1.5;color:var(--text);background:var(--bg-card);resize:vertical;transition:var(--transition);min-height:140px;box-sizing:border-box}" +
    ".b64-widget textarea:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.12)}" +
    ".b64-widget textarea[readonly]{background:var(--bg);cursor:default}" +
    ".b64-widget textarea[readonly]:focus{box-shadow:none;border-color:var(--border)}" +
    ".b64-error{padding:16px;background:#fef2f2;border:1px solid #fecaca;border-radius:var(--radius-sm);color:#b91c1c;font-family:'SF Mono','Fira Code','Consolas',monospace;font-size:0.85rem;line-height:1.5;white-space:pre-wrap;word-break:break-word}" +
    "@media(max-width:640px){.b64-actions{width:100%}.b64-actions .btn,.b64-actions .btn-secondary{flex:1;text-align:center}}";

  document.head.appendChild(style);

  document.addEventListener("DOMContentLoaded", function () {
    var widget = document.getElementById("tool-widget");
    if (widget) {
      widget.innerHTML = widgetHTML;
    }
  });
})();

function b64Encode() {
  var input = document.getElementById("b64-input");
  var output = document.getElementById("b64-output");
  var error = document.getElementById("b64-error");
  error.style.display = "none";
  error.textContent = "";
  if (!input.value) {
    showB64Error("Please enter text to encode.");
    return;
  }
  try {
    output.value = btoa(input.value);
  } catch (e) {
    showB64Error("Encoding failed: " + e.message);
  }
}

function b64Decode() {
  var input = document.getElementById("b64-input");
  var output = document.getElementById("b64-output");
  var error = document.getElementById("b64-error");
  error.style.display = "none";
  error.textContent = "";
  if (!input.value) {
    showB64Error("Please enter Base64 text to decode.");
    return;
  }
  try {
    output.value = atob(input.value);
  } catch (e) {
    showB64Error("Invalid Base64 input. Check your string and try again.");
  }
}

function b64Clear() {
  document.getElementById("b64-input").value = "";
  document.getElementById("b64-output").value = "";
  var error = document.getElementById("b64-error");
  error.style.display = "none";
  error.textContent = "";
}

function b64Copy() {
  var output = document.getElementById("b64-output");
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(function () {
    var btn = document.querySelector(
      ".b64-output-section .btn-secondary"
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

function showB64Error(msg) {
  var error = document.getElementById("b64-error");
  error.textContent = msg;
  error.style.display = "block";
}
