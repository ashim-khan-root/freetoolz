(function () {
  var WIDGET_HTML =
    '<div class="ir-widget">' +
    '<div class="ir-upload" id="ir-upload">' +
    '<div class="ir-upload-area" id="ir-upload-area">' +
    '<div class="ir-upload-icon">&#x1F4C1;</div>' +
    '<p>Click to upload or drag &amp; drop</p>' +
    '<p class="ir-upload-hint">PNG, JPG, or GIF</p>' +
    '<p class="ir-error" id="ir-error" style="display:none"></p>' +
    '<input type="file" id="ir-file-input" accept="image/png,image/jpeg,image/gif" hidden>' +
    '</div>' +
    '</div>' +
    '<div class="ir-controls" id="ir-controls" style="display:none;">' +
    '<div class="ir-dimensions">' +
    '<label>Width: <input type="number" id="ir-width" min="1" value="800"></label>' +
    '<label>Height: <input type="number" id="ir-height" min="1" value="600"></label>' +
    '<label class="ir-aspect"><input type="checkbox" id="ir-aspect" checked> Lock aspect ratio</label>' +
    '</div>' +
    '<div class="ir-previews">' +
    '<div class="ir-preview-box">' +
    '<h4>Original</h4>' +
    '<div class="ir-preview-container"><img id="ir-original-preview" alt="Original image preview"></div>' +
    '<p class="ir-size" id="ir-original-size"></p>' +
    '</div>' +
    '<div class="ir-preview-box">' +
    '<h4>Resized</h4>' +
    '<div class="ir-preview-container"><canvas id="ir-result-canvas"></canvas></div>' +
    '<p class="ir-size" id="ir-result-size"></p>' +
    '</div>' +
    '</div>' +
    '<button onclick="downloadResized()" class="btn" id="ir-download-btn">Download Resized Image</button>' +
    '</div>' +
    '</div>';

  var CSS =
    '.ir-widget{display:flex;flex-direction:column;gap:24px}' +
    '.ir-upload-area{border:2px dashed var(--border);border-radius:var(--radius);padding:48px 24px;text-align:center;cursor:pointer;transition:all var(--transition);background:var(--bg)}' +
    '.ir-upload-area:hover,.ir-upload-area.dragover{border-color:var(--primary);background:rgba(99,102,241,0.04)}' +
    '.ir-upload-icon{font-size:3rem;line-height:1;margin-bottom:12px}' +
    '.ir-upload-area p{margin:0 0 4px;color:var(--text);font-size:1rem}' +
    '.ir-upload-hint{color:var(--text-secondary)!important;font-size:0.85rem!important}' +
    '.ir-error{color:#ef4444;font-size:0.88rem;margin-top:8px;font-weight:600}' +
    '.ir-controls{display:flex;flex-direction:column;gap:20px}' +
    '.ir-dimensions{display:flex;flex-wrap:wrap;gap:16px;align-items:center}' +
    '.ir-dimensions label{font-size:0.9rem;font-weight:600;color:var(--text);display:flex;align-items:center;gap:6px}' +
    '.ir-dimensions input[type=number]{width:90px;padding:8px 10px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg);color:var(--text);font-size:0.95rem;outline:none;transition:var(--transition)}' +
    '.ir-dimensions input[type=number]:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(99,102,241,0.1)}' +
    '.ir-aspect{display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none}' +
    '.ir-aspect input[type=checkbox]{accent-color:var(--primary);width:16px;height:16px}' +
    '.ir-previews{display:grid;grid-template-columns:1fr 1fr;gap:20px}' +
    '.ir-preview-box{display:flex;flex-direction:column;gap:8px}' +
    '.ir-preview-box h4{margin:0;font-size:0.9rem;color:var(--text-secondary)}' +
    '.ir-preview-container{border:1px solid var(--border);border-radius:var(--radius-sm);padding:8px;background:var(--bg);display:flex;align-items:center;justify-content:center;min-height:180px;overflow:hidden}' +
    '.ir-preview-container img,.ir-preview-container canvas{max-width:100%;max-height:300px;display:block}' +
    '.ir-size{font-size:0.82rem;color:var(--text-secondary);margin:0;font-weight:500}' +
    '.ir-controls .btn{padding:14px 28px;background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);font-size:1rem;font-weight:600;cursor:pointer;transition:all var(--transition);align-self:flex-start}' +
    '.ir-controls .btn:hover{background:var(--primary-dark);transform:translateY(-1px);box-shadow:0 4px 14px rgba(99,102,241,0.35)}' +
    '.ir-controls .btn:active{transform:translateY(0)}' +
    '.ir-controls .btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none}' +
    '@media(max-width:600px){.ir-previews{grid-template-columns:1fr}.ir-dimensions{flex-direction:column;align-items:stretch}}';

  var originalImage = null;

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var container = document.getElementById('tool-widget');
    if (!container) return;
    container.innerHTML = WIDGET_HTML;

    var fileInput = document.getElementById('ir-file-input');
    var uploadArea = document.getElementById('ir-upload-area');
    var uploadSection = document.getElementById('ir-upload');
    var controls = document.getElementById('ir-controls');
    var widthInput = document.getElementById('ir-width');
    var heightInput = document.getElementById('ir-height');
    var aspectCheck = document.getElementById('ir-aspect');
    var errorEl = document.getElementById('ir-error');
    var loadingEl = document.createElement('p');
    loadingEl.textContent = 'Processing...';
    loadingEl.style.cssText = 'color:var(--primary);font-weight:600;display:none';

    if (!fileInput || !uploadArea || !controls || !widthInput || !heightInput || !aspectCheck || !errorEl) return;

    uploadArea.appendChild(loadingEl);

    function showError(msg) {
      errorEl.textContent = msg;
      errorEl.style.display = 'block';
    }

    function clearError() {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }

    function handleFile(file) {
      clearError();
      if (!file) return;

      var validTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (validTypes.indexOf(file.type) === -1) {
        showError('Invalid file type. Please select PNG, JPG, or GIF.');
        return;
      }

      var maxSize = 20 * 1024 * 1024;
      if (file.size > maxSize) {
        showError('File too large. Maximum size is 20 MB.');
        return;
      }

      loadingEl.style.display = 'block';

      var reader = new FileReader();
      reader.onload = function (e) {
        var img = new Image();
        img.onload = function () {
          loadingEl.style.display = 'none';
          originalImage = img;
          uploadSection.style.display = 'none';
          controls.style.display = 'flex';

          document.getElementById('ir-original-preview').src = e.target.result;
          document.getElementById('ir-original-size').textContent = img.width + ' x ' + img.height + ' px';

          widthInput.value = widthInput.value > 0 ? widthInput.value : img.width;
          heightInput.value = heightInput.value > 0 ? heightInput.value : img.height;

          resizeAndRender();
        };
        img.onerror = function () {
          loadingEl.style.display = 'none';
          showError('Failed to load image. The file may be corrupted.');
        };
        img.src = e.target.result;
      };
      reader.onerror = function () {
        loadingEl.style.display = 'none';
        showError('Failed to read file. Please try again.');
      };
      reader.readAsDataURL(file);
    }

    fileInput.addEventListener('change', function (e) {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });

    uploadArea.addEventListener('click', function () {
      fileInput.click();
    });

    uploadArea.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function (e) {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    var aspectRatio = 1;

    function calculateAspectRatio() {
      if (originalImage && originalImage.width && originalImage.height) {
        aspectRatio = originalImage.width / originalImage.height;
      }
    }

    function resizeAndRender() {
      if (!originalImage) return;

      calculateAspectRatio();

      var w = parseInt(widthInput.value, 10);
      var h = parseInt(heightInput.value, 10);

      if (isNaN(w) || w < 1) w = 1;
      if (isNaN(h) || h < 1) h = 1;
      widthInput.value = w;
      heightInput.value = h;

      var canvas = document.getElementById('ir-result-canvas');
      canvas.width = w;
      canvas.height = h;

      var ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(originalImage, 0, 0, w, h);

      document.getElementById('ir-result-size').textContent = w + ' x ' + h + ' px';
    }

    widthInput.addEventListener('input', function () {
      if (aspectCheck.checked && originalImage) {
        calculateAspectRatio();
        var w = parseInt(this.value, 10);
        if (!isNaN(w) && w > 0) {
          heightInput.value = Math.round(w / aspectRatio);
        }
      }
      resizeAndRender();
    });

    heightInput.addEventListener('input', function () {
      if (aspectCheck.checked && originalImage) {
        calculateAspectRatio();
        var h = parseInt(this.value, 10);
        if (!isNaN(h) && h > 0) {
          widthInput.value = Math.round(h * aspectRatio);
        }
      }
      resizeAndRender();
    });

    aspectCheck.addEventListener('change', function () {
      if (this.checked && originalImage) {
        calculateAspectRatio();
        var w = parseInt(widthInput.value, 10);
        if (!isNaN(w) && w > 0) {
          heightInput.value = Math.round(w / aspectRatio);
        }
        resizeAndRender();
      }
    });

    window.downloadResized = function () {
      var canvas = document.getElementById('ir-result-canvas');
      if (!canvas || canvas.width === 0 || canvas.height === 0) return;

      var link = document.createElement('a');
      link.download = 'resized-image.png';
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
