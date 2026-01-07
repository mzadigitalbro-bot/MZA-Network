document.addEventListener('DOMContentLoaded', function () {
  console.log('Site loaded');

  // Navigation toggle for mobile
  var nav = document.querySelector('nav');
  var toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.textContent = 'Menu';
  var header = document.querySelector('header .container');
  if (header) { header.appendChild(toggle); }
  toggle.addEventListener('click', function () {
    if (nav) nav.classList.toggle('open');
  });

  var form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      // не делаем e.preventDefault()
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true; // чтобы избежать двойного submit
      }
    });
  }



  // Smooth anchor scrolling fallback and history handling
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerOffset = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
          var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          try { history.replaceState(null, '', href); } catch (e) { }
        }
      }
    });
  });

  // Scroll reveal using IntersectionObserver
  (function () {
    var selector = 'header, .hero, .services, .services .card, .portfolio, .project, .about, .contacts, footer';
    var nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!nodes.length) return;
    nodes.forEach(function (n) { n.classList.add('reveal'); });

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.12 });

    nodes.forEach(function (n) { io.observe(n); });
  })();
});
