(function () {
  'use strict';

  const API_URL = '/api/contact';

  // Header scroll shadow
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  }, { passive: true });

  // Mobile menu
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    burger.classList.toggle('burger--open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      burger.classList.remove('burger--open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Service cards accordion
  document.querySelectorAll('.service-card__more').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.service-card');
      const detail = card.querySelector('.service-card__detail');
      const isOpen = card.classList.contains('service-card--open');

      document.querySelectorAll('.service-card--open').forEach((openCard) => {
        if (openCard !== card) {
          openCard.classList.remove('service-card--open');
          openCard.querySelector('.service-card__detail').hidden = true;
          openCard.querySelector('.service-card__more').setAttribute('aria-expanded', 'false');
          openCard.querySelector('.service-card__more').textContent = 'Подробнее';
        }
      });

      if (isOpen) {
        card.classList.remove('service-card--open');
        detail.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = 'Подробнее';
      } else {
        card.classList.add('service-card--open');
        detail.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Свернуть';
      }
    });
  });

  // Form validation & submission
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');

  const fields = {
    name: {
      el: document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate: (v) => v.trim().length >= 2 || 'Введите имя (минимум 2 символа)',
    },
    phone: {
      el: document.getElementById('phone'),
      error: document.getElementById('phone-error'),
      validate: (v) => v.trim().length >= 5 || 'Укажите телефон или Telegram',
    },
    area: {
      el: document.getElementById('area'),
      error: document.getElementById('area-error'),
      validate: (v) => v !== '' || 'Выберите область права',
    },
  };

  function validateField(key) {
    const { el, error, validate } = fields[key];
    const result = validate(el.value);
    if (result === true) {
      el.classList.remove('form__input--error');
      error.textContent = '';
      return true;
    }
    el.classList.add('form__input--error');
    error.textContent = result;
    return false;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('form__input--error')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    successMsg.hidden = true;
    errorMsg.hidden = true;

    const isValid = Object.keys(fields).every(validateField);
    if (!isValid) return;

    const payload = {
      name: fields.name.el.value.trim(),
      phone: fields.phone.el.value.trim(),
      area: fields.area.el.value,
      message: document.getElementById('message').value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка…';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Server error');

      form.reset();
      successMsg.hidden = false;
      form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch {
      errorMsg.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
    }
  });
})();
