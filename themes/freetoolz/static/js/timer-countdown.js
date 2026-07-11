(function () {
  var widget = document.getElementById('tool-widget');
  if (!widget) return;

  widget.innerHTML =
    '<div class="tm-widget">' +
      '<div class="tm-inputs">' +
        '<div class="tm-field"><label>Hours</label><input type="number" id="tm-hours" value="0" min="0" max="99"></div>' +
        '<div class="tm-sep">:</div>' +
        '<div class="tm-field"><label>Minutes</label><input type="number" id="tm-mins" value="5" min="0" max="59"></div>' +
        '<div class="tm-sep">:</div>' +
        '<div class="tm-field"><label>Seconds</label><input type="number" id="tm-secs" value="0" min="0" max="59"></div>' +
      '</div>' +
      '<div class="tm-display" id="tm-display"><span>00:05:00</span></div>' +
      '<div class="tm-controls">' +
        '<button id="tm-start" class="tm-btn tm-btn-green">Start</button>' +
        '<button id="tm-pause" class="tm-btn tm-btn-gray" disabled>Pause</button>' +
        '<button id="tm-reset" class="tm-btn tm-btn-gray">Reset</button>' +
      '</div>' +
      '<div class="tm-status" id="tm-status"></div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '.tm-widget{display:flex;flex-direction:column;gap:16px;align-items:center}' +
    '.tm-inputs{display:flex;align-items:center;gap:8px}' +
    '.tm-field{display:flex;flex-direction:column;align-items:center;gap:4px}' +
    '.tm-field label{font-size:.8rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase}' +
    '.tm-field input{width:70px;padding:10px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:1.2rem;font-weight:700;text-align:center;background:var(--bg);color:var(--text);outline:none;transition:border-color var(--transition)}' +
    '.tm-field input:focus{border-color:var(--primary)}' +
    '.tm-sep{font-size:1.5rem;font-weight:700;color:var(--text-secondary);margin-top:18px}' +
    '.tm-display{font-size:3.5rem;font-weight:800;font-family:monospace;text-align:center;color:var(--primary);padding:20px 40px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);letter-spacing:3px;min-width:300px}' +
    '.tm-display.tm-expired{color:#ef4444;animation:tm-flash 1s infinite}' +
    '@keyframes tm-flash{0%,100%{opacity:1}50%{opacity:.4}}' +
    '.tm-controls{display:flex;gap:10px}' +
    '.tm-btn{padding:12px 28px;border:none;border-radius:var(--radius-sm);font-size:.95rem;font-weight:700;cursor:pointer;transition:var(--transition);color:#fff}' +
    '.tm-btn:disabled{opacity:.4;cursor:not-allowed}' +
    '.tm-btn:not(:disabled):hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.15)}' +
    '.tm-btn-green{background:#22c55e}' +
    '.tm-btn-green:hover{background:#16a34a}' +
    '.tm-btn-gray{background:var(--text-secondary)}' +
    '.tm-btn-gray:hover{background:var(--text)}' +
    '.tm-status{font-size:.9rem;color:var(--text-secondary);min-height:24px;text-align:center}' +
    '@media(max-width:480px){.tm-display{font-size:2.2rem;min-width:auto;padding:16px}}';
  document.head.appendChild(style);

  var hoursInp = document.getElementById('tm-hours');
  var minsInp = document.getElementById('tm-mins');
  var secsInp = document.getElementById('tm-secs');
  var display = document.getElementById('tm-display');
  var status = document.getElementById('tm-status');
  var startBtn = document.getElementById('tm-start');
  var pauseBtn = document.getElementById('tm-pause');
  var resetBtn = document.getElementById('tm-reset');

  var totalSeconds = 0;
  var remainingSeconds = 0;
  var running = false;
  var paused = false;
  var timerInterval = null;
  var endTime = 0;

  function formatTime(secs) {
    var h = Math.floor(secs / 3600);
    var m = Math.floor((secs % 3600) / 60);
    var s = secs % 60;
    return (h < 10 ? '0' : '') + h + ':' +
           (m < 10 ? '0' : '') + m + ':' +
           (s < 10 ? '0' : '') + s;
  }

  function updateDisplay() {
    display.innerHTML = '<span>' + formatTime(remainingSeconds) + '</span>';
    if (remainingSeconds <= 0 && (running || paused)) {
      display.classList.add('tm-expired');
      status.textContent = 'Time is up!';
      if (running) {
        running = false;
        clearInterval(timerInterval);
        startBtn.textContent = 'Start';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        beep();
      }
    } else {
      display.classList.remove('tm-expired');
    }
  }

  function beep() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(function () {
        var osc2 = ctx.createOscillator();
        var gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 800;
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      }, 600);
    } catch (e) {}
  }

  function startTimer() {
    var h = parseInt(hoursInp.value) || 0;
    var m = parseInt(minsInp.value) || 0;
    var s = parseInt(secsInp.value) || 0;
    totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) { status.textContent = 'Please set a time greater than 0'; return; }
    remainingSeconds = totalSeconds;
    running = true;
    paused = false;
    endTime = Date.now() + remainingSeconds * 1000;
    timerInterval = setInterval(function () {
      remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      updateDisplay();
    }, 200);
    startBtn.textContent = 'Running';
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pause';
    status.textContent = 'Timer running...';
    hoursInp.disabled = true;
    minsInp.disabled = true;
    secsInp.disabled = true;
    updateDisplay();
  }

  function pauseTimer() {
    if (!running && !paused) return;
    if (paused) {
      paused = false;
      running = true;
      endTime = Date.now() + remainingSeconds * 1000;
      timerInterval = setInterval(function () {
        remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        updateDisplay();
      }, 200);
      pauseBtn.textContent = 'Pause';
      status.textContent = 'Timer running...';
    } else {
      running = false;
      paused = true;
      clearInterval(timerInterval);
      pauseBtn.textContent = 'Resume';
      status.textContent = 'Timer paused';
    }
  }

  function resetTimer() {
    running = false;
    paused = false;
    clearInterval(timerInterval);
    var h = parseInt(hoursInp.value) || 0;
    var m = parseInt(minsInp.value) || 0;
    var s = parseInt(secsInp.value) || 0;
    remainingSeconds = h * 3600 + m * 60 + s;
    display.classList.remove('tm-expired');
    updateDisplay();
    startBtn.textContent = 'Start';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    hoursInp.disabled = false;
    minsInp.disabled = false;
    secsInp.disabled = false;
    status.textContent = '';
  }

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  var initH = parseInt(hoursInp.value) || 0;
  var initM = parseInt(minsInp.value) || 0;
  var initS = parseInt(secsInp.value) || 0;
  remainingSeconds = initH * 3600 + initM * 60 + initS;
  updateDisplay();
})();
