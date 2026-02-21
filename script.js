(function () {
  'use strict';

  // Pop-up: open
  document.querySelectorAll('.js-open-popup').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = this.getAttribute('data-popup');
      var popup = document.getElementById('popup-' + id);
      if (popup) {
        popup.classList.add('is-open');
        popup.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Pop-up: close by button and overlay
  document.querySelectorAll('.js-close-popup, .js-popup-overlay').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target === el || el.classList.contains('js-close-popup')) {
        var popup = el.closest('.js-popup-overlay') || document.querySelector('.popup-overlay.is-open');
        if (popup) {
          popup.classList.remove('is-open');
          popup.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });
  });

  document.querySelectorAll('.js-popup-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  // Close popup on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.popup-overlay.is-open, .lightbox-overlay.is-open').forEach(function (el) {
        el.classList.remove('is-open');
        el.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    }
  });

  // Booking form (demo: no backend)
  var form = document.querySelector('.js-booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]').value;
      var link = 'https://t.me/mari_january';
      alert('Спасибо, ' + name + '! Для записи напишите напрямую в Telegram: ' + link);
      form.reset();
      document.querySelector('#popup-booking').classList.remove('is-open');
      document.body.style.overflow = '';
    });
  }

  // FAQ accordion
  document.querySelectorAll('.js-faq-toggle').forEach(function (item) {
    var btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq-item.is-open').forEach(function (open) {
          if (open !== item) open.classList.remove('is-open');
        });
        item.classList.toggle('is-open', !isOpen);
      });
    }
  });

  // Lightbox: одно изображение или галерея (data-images = массив путей), PDF — в новой вкладке
  var galleryImages = [];
  var galleryIndex = 0;

  function showLightboxImage(src, alt) {
    var overlay = document.querySelector('.js-lightbox-overlay');
    var lightboxImg = overlay && overlay.querySelector('.js-lightbox-img');
    if (!overlay || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Документ';
    lightboxImg.style.display = 'block';
  }

  function updateGalleryUI() {
    var overlay = document.querySelector('.js-lightbox-overlay');
    var prevBtn = overlay && overlay.querySelector('.js-lightbox-prev');
    var nextBtn = overlay && overlay.querySelector('.js-lightbox-next');
    var counter = overlay && overlay.querySelector('.js-lightbox-counter');
    if (galleryImages.length <= 1) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (counter) counter.style.display = 'none';
      return;
    }
    if (prevBtn) prevBtn.style.display = 'block';
    if (nextBtn) nextBtn.style.display = 'block';
    if (counter) {
      counter.style.display = 'block';
      counter.textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
    }
    if (prevBtn) prevBtn.style.visibility = galleryIndex === 0 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.style.visibility = galleryIndex === galleryImages.length - 1 ? 'hidden' : 'visible';
  }

  function closeLightbox() {
    var overlay = document.querySelector('.lightbox-overlay.is-open');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    var lbImg = overlay.querySelector('.js-lightbox-img');
    if (lbImg) { lbImg.removeAttribute('src'); lbImg.style.display = ''; }
    galleryImages = [];
    galleryIndex = 0;
    var prevBtn = overlay.querySelector('.js-lightbox-prev');
    var nextBtn = overlay.querySelector('.js-lightbox-next');
    var counter = overlay.querySelector('.js-lightbox-counter');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (counter) counter.style.display = 'none';
  }

  document.querySelectorAll('.js-lightbox').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var img = el.querySelector('img');
      var dataImages = el.getAttribute('data-images');
      var dataSrc = el.getAttribute('data-src');
      var alt = el.getAttribute('data-alt') || (img && img.alt) || 'Документ';
      var src = dataSrc || (img && (img.currentSrc || img.src)) || '';

      if (dataImages) {
        try {
          galleryImages = JSON.parse(dataImages);
        } catch (err) {
          galleryImages = [src];
        }
        if (galleryImages.length === 0) return;
        galleryIndex = 0;
        showLightboxImage(galleryImages[0], alt);
        updateGalleryUI();
        var overlay = document.querySelector('.js-lightbox-overlay');
        if (overlay) {
          overlay.classList.add('is-open');
          overlay.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
        return;
      }

      if (!src) return;
      if (/\.pdf$/i.test(src)) {
        window.open(src, '_blank', 'noopener');
        return;
      }

      galleryImages = [src];
      galleryIndex = 0;
      showLightboxImage(src, alt);
      updateGalleryUI();
      var overlay = document.querySelector('.js-lightbox-overlay');
      if (overlay) {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  document.querySelector('.js-lightbox-prev') && document.querySelector('.js-lightbox-prev').addEventListener('click', function (e) {
    e.stopPropagation();
    if (galleryImages.length <= 1 || galleryIndex <= 0) return;
    galleryIndex--;
    showLightboxImage(galleryImages[galleryIndex], '');
    updateGalleryUI();
  });

  document.querySelector('.js-lightbox-next') && document.querySelector('.js-lightbox-next').addEventListener('click', function (e) {
    e.stopPropagation();
    if (galleryImages.length <= 1 || galleryIndex >= galleryImages.length - 1) return;
    galleryIndex++;
    showLightboxImage(galleryImages[galleryIndex], '');
    updateGalleryUI();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
    if (!document.querySelector('.lightbox-overlay.is-open')) return;
    if (e.key === 'ArrowLeft') {
      if (galleryImages.length > 1 && galleryIndex > 0) {
        galleryIndex--;
        showLightboxImage(galleryImages[galleryIndex], '');
        updateGalleryUI();
      }
    }
    if (e.key === 'ArrowRight') {
      if (galleryImages.length > 1 && galleryIndex < galleryImages.length - 1) {
        galleryIndex++;
        showLightboxImage(galleryImages[galleryIndex], '');
        updateGalleryUI();
      }
    }
  });

  document.querySelectorAll('.js-lightbox-close, .js-lightbox-overlay').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.target === el || el.classList.contains('js-lightbox-close')) {
        closeLightbox();
      }
    });
  });

  document.querySelector('.lightbox-content') && document.querySelector('.lightbox-content').addEventListener('click', function (e) {
    e.stopPropagation();
  });
})();
