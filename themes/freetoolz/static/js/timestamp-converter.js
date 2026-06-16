(function () {
  function addStyles() {
    var style = document.createElement("style");
    style.textContent = `
      .ts-widget {
        --ts-bg: #f8fafc;
        --ts-border: #e2e8f0;
        --ts-radius: 8px;
        --ts-accent: #3b82f6;
        --ts-accent-hover: #2563eb;
        --ts-text: #1e293b;
        --ts-muted: #64748b;
        --ts-font: system-ui, -apple-system, sans-serif;
        font-family: var(--ts-font);
        background: var(--ts-bg);
        border: 1px solid var(--ts-border);
        border-radius: var(--ts-radius);
        padding: 1.5rem;
        max-width: 500px;
        margin: 1.5rem 0;
      }
      .ts-section { margin-bottom: 0; }
      .ts-section label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--ts-text);
      }
      .ts-row {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .ts-row input {
        flex: 1;
        min-width: 180px;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--ts-border);
        border-radius: var(--ts-radius);
        font-size: 0.9rem;
        font-family: var(--ts-font);
        color: var(--ts-text);
        background: #fff;
      }
      .ts-row input:focus {
        outline: none;
        border-color: var(--ts-accent);
        box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
      }
      .btn, .btn-secondary {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: var(--ts-radius);
        font-size: 0.9rem;
        cursor: pointer;
        font-family: var(--ts-font);
        font-weight: 500;
        white-space: nowrap;
      }
      .btn {
        background: var(--ts-accent);
        color: #fff;
      }
      .btn:hover { background: var(--ts-accent-hover); }
      .btn-secondary {
        background: #e2e8f0;
        color: var(--ts-text);
      }
      .btn-secondary:hover { background: #cbd5e1; }
      .ts-result {
        margin-top: 0.75rem;
        padding: 0.75rem;
        background: #fff;
        border: 1px solid var(--ts-border);
        border-radius: var(--ts-radius);
        min-height: 2.5rem;
      }
      .ts-result-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0;
      }
      .ts-label {
        font-weight: 600;
        color: var(--ts-muted);
        min-width: 4rem;
        font-size: 0.85rem;
      }
      #ts-utc, #ts-local, #ts-unix-value {
        font-family: "SFMono-Regular", Consolas, monospace;
        font-size: 0.9rem;
        color: var(--ts-text);
        word-break: break-all;
      }
      .ts-copy-btn {
        margin-left: auto;
        background: none;
        border: 1px solid var(--ts-border);
        border-radius: 4px;
        padding: 0.15rem 0.5rem;
        font-size: 0.75rem;
        cursor: pointer;
        color: var(--ts-muted);
        font-family: var(--ts-font);
        flex-shrink: 0;
      }
      .ts-copy-btn:hover {
        background: var(--ts-accent);
        color: #fff;
        border-color: var(--ts-accent);
      }
      .ts-divider {
        height: 1px;
        background: var(--ts-border);
        margin: 1.25rem 0;
      }
      .ts-error {
        color: #dc2626;
        font-size: 0.85rem;
        margin-top: 0.25rem;
      }
    `;
    document.head.appendChild(style);
  }

  function $(id) { return document.getElementById(id); }

  function formatUTC(d) {
    return d.toUTCString();
  }

  function formatLocal(d) {
    return d.toLocaleString();
  }

  function tsFromTimestamp() {
    var input = $("ts-timestamp");
    var val = input.value.trim();
    if (!val) {
      $("ts-utc").textContent = "";
      $("ts-local").textContent = "";
      return;
    }
    var sec = Number(val);
    if (!Number.isInteger(sec) || sec < 0) {
      $("ts-utc").textContent = "Invalid timestamp";
      $("ts-local").textContent = "Invalid timestamp";
      return;
    }
    var d = new Date(sec * 1000);
    if (isNaN(d.getTime())) {
      $("ts-utc").textContent = "Invalid timestamp";
      $("ts-local").textContent = "Invalid timestamp";
      return;
    }
    $("ts-utc").textContent = formatUTC(d);
    $("ts-local").textContent = formatLocal(d);
  }

  function tsNow() {
    var now = Math.floor(Date.now() / 1000);
    $("ts-timestamp").value = now;
    tsFromTimestamp();
  }

  function tsFromDate() {
    var input = $("ts-date");
    var val = input.value;
    if (!val) {
      $("ts-unix-value").textContent = "";
      return;
    }
    var d = new Date(val);
    if (isNaN(d.getTime())) {
      $("ts-unix-value").textContent = "Invalid date";
      return;
    }
    $("ts-unix-value").textContent = Math.floor(d.getTime() / 1000);
  }

  function tsCopy(id) {
    var el = $(id);
    if (!el || !el.textContent) return;
    navigator.clipboard.writeText(el.textContent).catch(function () {
      var sel = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand("copy");
      sel.removeAllRanges();
    });
    var btn = el.parentElement.querySelector(".ts-copy-btn");
    if (btn) {
      var orig = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(function () { btn.textContent = orig; }, 1500);
    }
  }

  addStyles();
  window.tsFromTimestamp = tsFromTimestamp;
  window.tsNow = tsNow;
  window.tsFromDate = tsFromDate;
  window.tsCopy = tsCopy;

  if ($("ts-timestamp")) {
    $("ts-timestamp").addEventListener("keydown", function (e) {
      if (e.key === "Enter") tsFromTimestamp();
    });
  }
  if ($("ts-date")) {
    $("ts-date").addEventListener("keydown", function (e) {
      if (e.key === "Enter") tsFromDate();
    });
  }

  if ($("ts-timestamp") && $("ts-timestamp").value) {
    tsFromTimestamp();
  }
  if ($("ts-date") && !$("ts-date").value) {
    var now = new Date();
    var pad = function (n) { return String(n).padStart(2, "0"); };
    $("ts-date").value =
      now.getFullYear() + "-" +
      pad(now.getMonth() + 1) + "-" +
      pad(now.getDate()) + "T" +
      pad(now.getHours()) + ":" +
      pad(now.getMinutes());
  }
})();
