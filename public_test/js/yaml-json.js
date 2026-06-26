(function () {
  function e(id){return document.getElementById(id)}

  var HTML =
    '<div class="yj-widget">' +
    '<div class="yj-direction"><label>Direction</label><div class="yj-radio-group">' +
    '<label class="yj-radio"><input type="radio" name="yj-dir" value="yaml2json" checked> YAML → JSON</label>' +
    '<label class="yj-radio"><input type="radio" name="yj-dir" value="json2yaml"> JSON → YAML</label></div></div>' +
    '<div class="yj-field"><label>Input</label><textarea id="yj-input" rows="10" placeholder="Paste your YAML or JSON here..." spellcheck="false">name: My App\nversion: "1.0"\ndependencies:\n  - express\n  - react\n  - mongoose\nconfig:\n  port: 3000\n  debug: true</textarea></div>' +
    '<button class="yj-btn" onclick="yjConvert()">Convert</button>' +
    '<div class="yj-field"><label>Output</label><textarea id="yj-output" rows="10" readonly placeholder="Result will appear here..." spellcheck="false"></textarea></div>' +
    '<p class="yj-error" id="yj-error"></p>' +
    '<p class="yj-note">* Supports strings, numbers, booleans, null, nested objects, and arrays. All processing is client-side.</p></div>';

  var CSS =
    '.yj-widget{display:flex;flex-direction:column;gap:16px;padding:24px;background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow)}' +
    '.yj-direction{display:flex;flex-direction:column;gap:6px}' +
    '.yj-direction label{font-size:.85rem;font-weight:600;color:var(--text-secondary)}' +
    '.yj-radio-group{display:flex;gap:16px}' +
    '.yj-radio{display:flex;align-items:center;gap:6px;font-size:.9rem;cursor:pointer;color:var(--text)}' +
    '.yj-radio input{accent-color:var(--primary)}' +
    '.yj-field{display:flex;flex-direction:column;gap:4px}' +
    '.yj-field textarea{padding:12px;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.85rem;font-family:ui-monospace,SFMono-Regular,monospace;background:var(--bg);color:var(--text);outline:none;resize:vertical;min-height:120px}' +
    '.yj-field textarea:focus{border-color:var(--primary)}' +
    '.yj-btn{padding:12px;border:none;border-radius:var(--radius-sm);font-size:1rem;font-weight:700;background:var(--primary);color:#fff;cursor:pointer}' +
    '.yj-btn:hover{background:var(--primary-dark);transform:translateY(-1px)}' +
    '.yj-error{font-size:.85rem;color:#ef4444;min-height:1.2em;margin:0}' +
    '.yj-note{font-size:.8rem;color:var(--text-secondary);font-style:italic;margin:0}';

  function yamlToJson(yaml) {
    var lines = yaml.split('\n');
    var result = {};
    var stack = [{obj: result, indent: -1}];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      var indent = line.length - line.replace(/^\s+/, '').length;

      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();

      var current = stack[stack.length - 1].obj;

      // Array item
      if (trimmed.startsWith('- ')) {
        var val = trimmed.substring(2).trim();
        var arr;
        if (current instanceof Array) {
          arr = current;
        } else {
          // Find the last key that has an array value
          var keys = Object.keys(stack[stack.length - 1].obj);
          var lastKey = keys[keys.length - 1];
          if (lastKey && stack[stack.length - 1].obj[lastKey] instanceof Array) {
            arr = stack[stack.length - 1].obj[lastKey];
          } else {
            arr = [];
            stack[stack.length - 1].obj = arr;
            // This is a top-level array
            if (stack.length === 1) { result = arr; stack[0].obj = arr; }
          }
        }
        var parsedVal = parseYamlValue(val);
        arr.push(parsedVal);
        if (typeof parsedVal === 'object' && parsedVal !== null) {
          stack.push({obj: parsedVal, indent: indent});
        }
        continue;
      }

      // Key: value
      var colonIdx = trimmed.indexOf(':');
      if (colonIdx === -1) continue;

      var key = trimmed.substring(0, colonIdx).trim();
      var rest = trimmed.substring(colonIdx + 1).trim();

      if (rest === '' || rest === '|' || rest === '>') {
        // Nested object
        if (current instanceof Array) {
          var obj = {}; current.push(obj); stack.push({obj: obj, indent: indent});
        } else {
          current[key] = {}; stack.push({obj: current[key], indent: indent});
        }
      } else {
        var parsedVal = parseYamlValue(rest);
        current[key] = parsedVal;
        if (typeof parsedVal === 'object' && parsedVal !== null && !(parsedVal instanceof Array)) {
          stack.push({obj: parsedVal, indent: indent});
        }
      }
    }
    return result;
  }

  function parseYamlValue(val) {
    if (val === '~' || val === 'null' || val === '') return null;
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(val)) return parseFloat(val);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) return val.slice(1, -1);
    if (val.startsWith('[') && val.endsWith(']')) {
      try { return JSON.parse(val); } catch(e) { return val; }
    }
    if (val.startsWith('{') && val.endsWith('}')) {
      try { return JSON.parse(val); } catch(e) { return val; }
    }
    return val;
  }

  function jsonToYaml(obj, indent) {
    indent = indent || 0;
    var sp = '  '.repeat(indent);
    var result = '';
    var isArr = obj instanceof Array;

    if (obj === null || obj === undefined) return sp + '~';
    if (typeof obj === 'string') return sp + (obj.match(/^[\w.\-\/]+$/) ? obj : '"' + obj.replace(/"/g, '\\"') + '"');
    if (typeof obj === 'number' || typeof obj === 'boolean') return sp + obj;

    if (isArr) {
      for (var i = 0; i < obj.length; i++) {
        if (typeof obj[i] === 'object' && obj[i] !== null) {
          var keys = Object.keys(obj[i]);
          result += sp + '- ' + keys[0] + ': ' + jsonToYaml(obj[i][keys[0]], 0).trim() + '\n';
          for (var k = 1; k < keys.length; k++) {
            result += sp + '  ' + keys[k] + ': ' + jsonToYaml(obj[i][keys[k]], 0).trim() + '\n';
          }
        } else {
          result += sp + '- ' + jsonToYaml(obj[i], 0).trim() + '\n';
        }
      }
    } else {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        var val = obj[keys[i]];
        var keyStr = keys[i].match(/^[\w]+$/) ? keys[i] : '"' + keys[i] + '"';
        if (typeof val === 'object' && val !== null) {
          if (val instanceof Array && val.length > 0 && typeof val[0] !== 'object') {
            result += sp + keyStr + ':\n';
            for (var j = 0; j < val.length; j++) {
              result += sp + '  - ' + jsonToYaml(val[j], 0).trim() + '\n';
            }
          } else {
            result += sp + keyStr + ':\n' + jsonToYaml(val, indent + 1);
          }
        } else {
          result += sp + keyStr + ': ' + jsonToYaml(val, 0).trim() + '\n';
        }
      }
    }
    return result;
  }

  window.yjConvert = function() {
    var input = e('yj-input').value;
    var dir = document.querySelector('input[name="yj-dir"]:checked').value;
    var errorEl = e('yj-error');
    errorEl.textContent = '';

    try {
      if (dir === 'yaml2json') {
        var parsed = yamlToJson(input);
        e('yj-output').value = JSON.stringify(parsed, null, 2);
      } else {
        var parsed = JSON.parse(input);
        e('yj-output').value = jsonToYaml(parsed).trim();
      }
    } catch (ex) {
      errorEl.textContent = 'Error: ' + ex.message;
    }
  };

  function init() {
    var s = document.createElement('style'); s.textContent = CSS; document.head.appendChild(s);
    var c = document.getElementById('tool-widget'); if (!c) return; c.innerHTML = HTML;
    var radios = document.querySelectorAll('input[name="yj-dir"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', yjConvert);
    }
    yjConvert();
    e('yj-input').addEventListener('input', function() { setTimeout(yjConvert, 300); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
