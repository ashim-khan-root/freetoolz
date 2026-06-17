(function () {
  'use strict';

  var isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length || isReduced) {
      for (var i = 0; i < els.length; i++) els[i].classList.add('visible');
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('visible');
          obs.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    for (var i = 0; i < els.length; i++) obs.observe(els[i]);
  }

  /* Staggered card entrance */
  function initStagger() {
    var grids = document.querySelectorAll('.tools-grid, .blog-grid, .hero-grid');
    if (isReduced) return;

    for (var g = 0; g < grids.length; g++) {
      var cards = grids[g].querySelectorAll('.tool-card, .blog-card');
      if (!cards.length) continue;

      var obs = new IntersectionObserver(function (entries) {
        for (var e = 0; e < entries.length; e++) {
          if (entries[e].isIntersecting) {
            var grid = entries[e].target;
            var items = grid.querySelectorAll('.tool-card, .blog-card');
            for (var i = 0; i < items.length; i++) {
              (function (el, idx) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)';
                el.style.transitionDelay = (idx * 0.06) + 's';
                requestAnimationFrame(function () {
                  el.style.opacity = '1';
                  el.style.transform = 'translateY(0)';
                });
              })(items[i], i);
            }
            obs.unobserve(grid);
          }
        }
      }, { threshold: 0.05 });

      obs.observe(grids[g]);
    }
  }

  /* Search + Filter */
  function initSearch() {
    var searchInput = document.getElementById('tool-search');
    var catNav = document.getElementById('cat-nav');
    if (!searchInput) return;

    var catItems = catNav ? catNav.querySelectorAll('.cat-nav-item') : [];
    var sections = document.querySelectorAll('.cat-section');
    var noResults = document.getElementById('no-results');

    function filterTools() {
      var query = searchInput.value.toLowerCase().trim();
      var activeCat = null;
      for (var i = 0; i < catItems.length; i++) {
        if (catItems[i].classList.contains('active')) activeCat = catItems[i].getAttribute('data-cat');
      }

      var showAll = !activeCat || activeCat === 'all';
      var visibleCount = 0;

      for (var s = 0; s < sections.length; s++) {
        var section = sections[s];
        var cards = section.querySelectorAll('.tool-card');
        var sectionVisible = 0;

        for (var c = 0; c < cards.length; c++) {
          var card = cards[c];
          var text = card.textContent.toLowerCase();
          var match = !query || text.indexOf(query) !== -1;
          var catMatch = showAll || section.id === 'cat-' + activeCat;

          if (match && catMatch) {
            card.style.display = '';
            sectionVisible++;
          } else {
            card.style.display = 'none';
          }
        }

        if (sectionVisible > 0 && (showAll || section.id === 'cat-' + activeCat)) {
          section.style.display = '';
          visibleCount += sectionVisible;
        } else {
          section.style.display = 'none';
        }

        /* Update count badge */
        var countEl = section.querySelector('.cat-heading-count');
        if (countEl && sectionVisible !== parseInt(countEl.textContent, 10)) {
          countEl.textContent = sectionVisible;
        }
      }

      if (noResults) {
        noResults.classList.toggle('visible', visibleCount === 0);
      }
    }

    searchInput.addEventListener('input', filterTools);

    /* Category nav clicks */
    for (var i = 0; i < catItems.length; i++) {
      catItems[i].addEventListener('click', function (e) {
        e.preventDefault();
        var cat = this.getAttribute('data-cat');

        for (var j = 0; j < catItems.length; j++) catItems[j].classList.remove('active');

        if (cat === activeFilter()) {
          /* Toggle off */
        } else {
          this.classList.add('active');
        }

        filterTools();
      });

      function activeFilter() {
        for (var j = 0; j < catItems.length; j++) {
          if (catItems[j].classList.contains('active')) return catItems[j].getAttribute('data-cat');
        }
        return null;
      }
    }
  }

  /* Dark mode */
  function initTheme() {
    var btn = document.getElementById('theme-toggle');
    var saved = localStorage.getItem('theme');
    var html = document.documentElement;

    if (saved) {
      html.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.setAttribute('data-theme', 'dark');
    }

    if (btn) {
      btn.addEventListener('click', function () {
        var current = html.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
      });
    }
  }

  /* Hamburger menu */
  function initHamburger() {
    var btn = document.getElementById('hamburger');
    var nav = document.getElementById('main-nav');
    var overlay = document.getElementById('nav-overlay');
    if (!btn || !nav) return;

    function toggle(e) {
      e.stopPropagation();
      var open = nav.classList.toggle('open');
      btn.classList.toggle('open', open);
      if (overlay) overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    function close() {
      nav.classList.remove('open');
      btn.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', toggle);
    if (overlay) overlay.addEventListener('click', close);

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    /* Close on nav link click */
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', close);
    });
  }

  /* Init */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initTheme();
      initReveal();
      initStagger();
      initSearch();
      initHamburger();
    });
  } else {
    initTheme();
    initReveal();
    initStagger();
    initSearch();
    initHamburger();
  }
})();
