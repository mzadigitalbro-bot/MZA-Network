// Form submission
var form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Отправка...';

    function sendForm() {
      grecaptcha.enterprise.ready(function() {
        grecaptcha.enterprise.execute('6LcA7EcsAAAAAHwn5rLB2n9YemqWFU2Vo0Y3sTGL', {
          action: 'form_contact'
        }).then(function(token) {
          document.getElementById('g-recaptcha-response').value = token;
          var formData = new FormData(form);
          
          fetch('https://n8n.mzanetwork.com/webhook/form-contact', {
            method: 'POST',
            body: formData
          })
          .then(function(response) { return response.json(); })
          .then(function(data) {
            btn.textContent = 'Отправлено!';
            setTimeout(function() { 
              btn.textContent = 'Отправить'; 
              btn.disabled = false; 
              form.reset(); 
            }, 2000);
          })
          .catch(function(err) {
            console.error(err);
            btn.textContent = 'Ошибка';
            setTimeout(function() {
              btn.textContent = 'Отправить';
              btn.disabled = false;
            }, 2000);
          });
        });
      });
    }

    // Ждем загрузки reCAPTCHA если нужно
    if (window.recaptchaReady && typeof grecaptcha !== 'undefined') {
      sendForm();
    } else {
      var attempts = 0;
      var checkReady = setInterval(function() {
        attempts++;
        if ((window.recaptchaReady && typeof grecaptcha !== 'undefined') || attempts > 50) {
          clearInterval(checkReady);
          if (window.recaptchaReady) {
            sendForm();
          } else {
            btn.textContent = 'Ошибка загрузки';
            btn.disabled = false;
          }
        }
      }, 100);
    }
  });
}