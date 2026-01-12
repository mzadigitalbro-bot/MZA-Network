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
      e.preventDefault();

      var formData = new FormData(form);
      var data = new URLSearchParams();

      for (const pair of formData) {
        data.append(pair[0], pair[1]);
      }

      fetch('https://n8n.mzanetwork.com/webhook/form-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data.toString()
      })
        .then(() => {
          var btn = form.querySelector('button[type="submit"]');
          if (btn) {
            var old = btn.textContent;
            btn.textContent = 'Отправлено!';
            btn.disabled = true;
            setTimeout(function () {
              btn.textContent = old;
              btn.disabled = false;
              form.reset();
            }, 1800);
          }
        })
        .catch(err => console.error(err));
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

document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  // Блокируем кнопку до получения токена
  var submitBtn = form.querySelector('button[type="submit"]');
  
  form.addEventListener("submit", function(e) {
    e.preventDefault(); // ❌ отменяем обычный submit

    if (!submitBtn) return;

    submitBtn.disabled = true; // блокируем кнопку сразу
    submitBtn.textContent = 'Проверка...';

    // Генерируем reCAPTCHA token
    grecaptcha.enterprise.execute('6Lc0xEcsAAAAADB1BXoNUKTUB8MhIhiWtgu-otGO', {
      action: "https://n8n.mzanetwork.com/webhook/form-contact"
    }).then(function(token) {

      document.getElementById('g-recaptcha-response').value = token;

      // Теперь отправляем форму через fetch
      var formData = new FormData(form);
      var data = new URLSearchParams();
      for (const pair of formData) {
        data.append(pair[0], pair[1]);
      }

      fetch('https://n8n.mzanetwork.com/webhook/form-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString()
      })
      .then(() => {
        submitBtn.textContent = 'Отправлено!';
        setTimeout(function () {
          submitBtn.textContent = 'Отправить';
          submitBtn.disabled = false;
          form.reset();
        }, 1800);
      })
      .catch(err => {
        console.error(err);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Ошибка! Попробуйте ещё раз';
      });
    });
  });
});

