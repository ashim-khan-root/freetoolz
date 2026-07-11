(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="sw-widget">' +
      '<div class="sw-display" id="sw-display">00:00:00.00</div>' +
      '<div class="sw-controls">' +
        '<button id="sw-start" class="sw-btn sw-btn-green">Start</button>' +
        '<button id="sw-lap" class="sw-btn sw-btn-gray" disabled>Lap</button>' +
        '<button id="sw-stop" class="sw-btn sw-btn-red" disabled>Stop</button>' +
        '<button id="sw-reset" class="sw-btn sw-btn-gray">Reset</button>' +
      '</div>' +
      '<div class="sw-laps-header">Laps</div>' +
      '<div class="sw-laps" id="sw-laps"></div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.sw-widget{display:flex;flex-direction:column;gap:16px}' +
    '.sw-display{font-size:2.8rem;font-weight:800;font-family:monospace;text-align:center;color:var(--primary);padding:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);letter-spacing:2px}' +
    '.sw-controls{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}' +
    '.sw-btn{padding:12px 28px;border:none;border-radius:var(--radius-sm);font-size:.95rem;font-weight:700;cursor:pointer;transition:var(--transition);color:#fff}' +
    '.sw-btn:disabled{opacity:.4;cursor:not-allowed}' +
    '.sw-btn:not(:disabled):hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.15)}' +
    '.sw-btn-green{background:#22c55e}' +
    '.sw-btn-green:hover{background:#16a34a}' +
    '.sw-btn-red{background:#ef4444}' +
    '.sw-btn-red:hover{background:#dc2626}' +
    '.sw-btn-gray{background:var(--text-secondary)}' +
    '.sw-btn-gray:hover{background:var(--text)}' +
    '.sw-laps-header{font-size:.9rem;font-weight:700;color:var(--text-secondary);margin-top:4px}' +
    '.sw-laps{display:flex;flex-direction:column;gap:4px;max-height:200px;overflow-y:auto}' +
    '.sw-lap-item{display:flex;justify-content:space-between;padding:8px 14px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);font-family:monospace;font-size:.85rem}' +
    '.sw-lap-item .sw-lap-num{color:var(--text-secondary)}' +
    '.sw-lap-item .sw-lap-time{color:var(--text);font-weight:600}' +
    '@media(max-width:480px){.sw-display{font-size:2rem}}';
  document.head.appendChild(style);

  var startBtn = document.getElementById('sw-start');
  var lapBtn = document.getElementById('sw-lap');
  var stopBtn = document.getElementById('sw-stop');
  var resetBtn = document.getElementById('sw-reset');
  var display = document.getElementById('sw-display');
  var lapsContainer = document.getElementById('sw-laps');

  var running = false;
  var startTime = 0;
  var elapsed = 0;
  var timerInterval = null;
  var lapCount = 0;
  var lastLapTime = 0;

  function formatTime(ms) {
    var total = Math.floor(ms);
    var hours = Math.floor(total / 3600000);
    var minutes = Math.floor((total % 3600000) / 60000);
    var seconds = Math.floor((total % 60000) / 1000);
    var millis = Math.floor((total % 1000) / 10);
    return (hours < 10 ? '0' : '') + hours + ':' +
           (minutes < 10 ? '0' : '') + minutes + ':' +
           (seconds < 10 ? '0' : '') + seconds + '.' +
           (millis < 10 ? '0' : '') + millis;
  }

  function updateDisplay() {
    display.textContent = formatTime(elapsed);
  }

  function tick() {
    elapsed = Date.now() - startTime;
    updateDisplay();
  }

  startBtn.addEventListener('click', function () {
    if (running) return;
    running = true;
    startTime = Date.now() - elapsed;
    timerInterval = setInterval(tick, 10);
    startBtn.disabled = true;
    lapBtn.disabled = false;
    stopBtn.disabled = false;
  });

  lapBtn.addEventListener('click', function () {
    if (!running) return;
    lapCount++;
    var lapTime = elapsed - lastLapTime;
    var item = document.createElement('div');
    item.className = 'sw-lap-item';
    item.innerHTML = '<span class="sw-lap-num">Lap ' + lapCount + '</span><span class="sw-lap-time">+' + formatTime(lapTime) + '</span>';
    lapsContainer.insertBefore(item, lapsContainer.firstChild);
    lastLapTime = elapsed;
  });

  stopBtn.addEventListener('click', function () {
    if (!running) return;
    running = false;
    clearInterval(timerInterval);
    startBtn.disabled = false;
    startBtn.textContent = 'Resume';
    lapBtn.disabled = true;
    stopBtn.disabled = true;
  });

  resetBtn.addEventListener('click', function () {
    running = false;
    clearInterval(timerInterval);
    elapsed = 0;
    lastLapTime = 0;
    lapCount = 0;
    updateDisplay();
    startBtn.disabled = false;
    startBtn.textContent = 'Start';
    lapBtn.disabled = true;
    stopBtn.disabled = true;
    lapsContainer.innerHTML = '';
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') { e.preventDefault(); if (running) stopBtn.click(); else startBtn.click(); }
    if (e.code === 'KeyL' && running) lapBtn.click();
  });
})();
