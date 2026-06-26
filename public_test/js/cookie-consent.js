(function () {
  'use strict';

  var COOKIE_NAME = 'freetoolz_consent';
  var AD_SCRIPT_ID = 'freetoolz-ads';

  function getCookie(name) {
    var match = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function hideBanner() {
    var el = document.getElementById('cc-banner');
    if (el) { el.style.opacity = '0'; setTimeout(function () { el.remove(); }, 400); }
  }

  function accept() {
    setCookie(COOKIE_NAME, 'accepted', 365);
    hideBanner();
  }

  function reject() {
    setCookie(COOKIE_NAME, 'rejected', 365);
    hideBanner();
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cc-inner">' +
      '<div class="cc-text">' +
      '<p>This site uses cookies from Google AdSense for personalized ads. <a href="/privacy/" target="_blank">Learn more</a></p>' +
      '</div>' +
      '<div class="cc-actions">' +
      '<button class="cc-btn cc-reject" id="cc-reject">Reject</button>' +
      '<button class="cc-btn cc-accept" id="cc-accept">Accept</button>' +
      '</div>' +
      '</div>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.style.opacity = '1'; });

    document.getElementById('cc-accept').addEventListener('click', accept);
    document.getElementById('cc-reject').addEventListener('click', reject);
  }

  var existing = getCookie(COOKIE_NAME);
  if (!existing) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
