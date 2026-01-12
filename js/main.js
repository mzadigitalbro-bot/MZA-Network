// Глобальная функция, которую вызовет reCAPTCHA после загрузки
window.onRecaptchaLoad = function() {
  console.log('reCAPTCHA загружена');
  window.recaptchaLoaded = true;
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('Site loaded');

  // ... весь остальной код ...

  // --- Form submission with reCAPTCHA ---
  var form = document.getElementById("contactForm");
  
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Проверка...';

      // Функция для выполнения reCAPTCHA
      function executeRecaptcha() {
        if (typeof grecaptcha === 'undefined' || !grecaptcha.enterprise) {
          console.error('reCAPTCHA не загружена');
          btn.textContent = 'Ошибка загрузки';
          btn.disabled = false;
          return;
        }

        grecaptcha.enterprise.ready(function() {
          grecaptcha.enterprise.execute('6Lc0xEcsAAAAADB1BXoNUKTUB8MhIhiWtgu-otGO', {
            action: 'form_contact'
          }).then(function(token) {
            document.getElementById('g-recaptcha-response').value = token;

            var formData = new FormData(form);
            fetch('https://n8n.mzanetwork.com/webhook/form-contact', {
              method: 'POST',
              body: formData
            }).then(function(response) {
              return response.json();
            }).then(function(data) {
              console.log('Success:', data);
              btn.textContent = 'Отправлено!';
              setTimeout(function() { 
                btn.textContent = 'Отправить'; 
                btn.disabled = false; 
                form.reset(); 
              }, 1500);
            }).catch(function(err) {
              console.error('Fetch error:', err);
              btn.textContent = 'Ошибка';
              btn.disabled = false;
            });
          }).catch(function(err) {
            console.error('reCAPTCHA error:', err);
            btn.textContent = 'Ошибка';
            btn.disabled = false;
          });
        });
      }

      // Если reCAPTCHA уже загружена - выполняем сразу
      if (window.recaptchaLoaded) {
        executeRecaptcha();
      } else {
        // Иначе ждем загрузки
        btn.textContent = 'Загрузка...';
        var checkInterval = setInterval(function() {
          if (window.recaptchaLoaded) {
            clearInterval(checkInterval);
            executeRecaptcha();
          }
        }, 100);
        
        // Таймаут на случай если не загрузится
        setTimeout(function() {
          clearInterval(checkInterval);
          if (!window.recaptchaLoaded) {
            btn.textContent = 'Ошибка загрузки';
            btn.disabled = false;
          }
        }, 10000);
      }
    });
  }
});