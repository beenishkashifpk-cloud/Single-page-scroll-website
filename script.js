(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  var printButton = document.getElementById('print-cv');
  if (printButton) printButton.addEventListener('click', function () { window.print(); });

  var menuButton = document.querySelector('.menu-toggle');
  var menu = document.getElementById('nav-menu');
  if (menuButton && menu) {
    function closeMenu() {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');
    }
    menuButton.addEventListener('click', function () {
      var willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(willOpen));
      menuButton.setAttribute('aria-label', willOpen ? 'Close navigation menu' : 'Open navigation menu');
      menu.classList.toggle('is-open', willOpen);
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        if (window.innerWidth <= 650) menuButton.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  var progress = document.querySelector('.scroll-progress span');
  var ticking = false;
  function updateProgress() {
    if (!progress) return;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var amount = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = 'scaleX(' + Math.max(0, Math.min(1, amount)) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  updateProgress();

  // Cycle the three monogram labels through the technical skills without adding libraries.
  var rotatingSkills = ['Python', 'C++', 'SQL', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Cryptography', 'OOP', 'Data Structures'];
  var bubbleNodes = [
    document.querySelector('.bubble-python'),
    document.querySelector('.bubble-sql'),
    document.querySelector('.bubble-security')
  ];
  var bubbleIcons = bubbleNodes.map(function (node) {
    var icon = node ? node.querySelector('span') : null;
    return icon ? icon.outerHTML : '';
  });
  var skillOffsets = [0, 3, 6];
  if (bubbleNodes.some(Boolean) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var skillIndex = 0;
    window.setInterval(function () {
      bubbleNodes.forEach(function (node, index) {
        if (!node) return;
        var skill = rotatingSkills[(skillIndex + skillOffsets[index]) % rotatingSkills.length];
        node.innerHTML = bubbleIcons[index] + ' ' + skill;
      });
      skillIndex = (skillIndex + 1) % rotatingSkills.length;
    }, 2100);
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navigationLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-motion');
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (element) { revealObserver.observe(element); });

    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }
})();
