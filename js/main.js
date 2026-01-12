document.addEventListener('DOMContentLoaded', function () {
  console.log('Site loaded');

  // --- Navigation toggle for mobile ---
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

  // --- Smooth anchor scrolling fallback ---
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

  // --- Scroll reveal using IntersectionObserver ---
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

  // --- Form submission with reCAPTCHA ---
 
  var form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // не отправляем сразу форму

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Проверка...';

    // вызываем reCAPTCHA Enterprise
    grecaptcha.enterprise.ready(function() {
      grecaptcha.enterprise.execute('6Lc0xEcsAAAAADB1BXoNUKTUB8MhIhiWtgu-otGO', {
        action: 'form_contact'  // любая метка действия
      }).then(function(token) {
        // записываем токен в скрытое поле
        document.getElementById('g-recaptcha-response').value = token;

        // теперь можно отправить форму через fetch или обычный submit
        var formData = new FormData(form);
        fetch('https://n8n.mzanetwork.com/webhook/form-contact', {
          method: 'POST',
          body: formData
        }).then(() => {
          btn.textContent = 'Отправлено!';
          setTimeout(() => { btn.textContent = 'Отправить'; btn.disabled = false; form.reset(); }, 1500);
        }).catch(err => {
          console.error(err);
          btn.textContent = 'Ошибка';
          btn.disabled = false;
        });
      });
    });
  });
});
