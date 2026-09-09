/* =========================================================
   TIMELESS — script.js
   Carrossel do topo, menu mobile e revelação da linha do tempo
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Carrossel ---------- */

  const track = document.querySelector('.hero-track');
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dotsWrap = document.querySelector('.hero-dots');
  const prevBtn = document.querySelector('.hero-prev');
  const nextBtn = document.querySelector('.hero-next');

  if (slides.length && track) {
    let current = slides.findIndex((s) => s.classList.contains('is-active'));
    if (current < 0) current = 0;

    const AUTOPLAY_MS = 6500;
    let autoplayTimer = null;

    // cria os indicadores (dots)
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === current ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ir para o slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.children);

    function render() {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    }

    function goTo(index, userInitiated) {
      current = (index + slides.length) % slides.length;
      render();
      if (userInitiated) restartAutoplay();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(next, AUTOPLAY_MS);
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1, true));
    nextBtn?.addEventListener('click', () => goTo(current + 1, true));

    // pausa o autoplay quando o usuário passa o mouse sobre o carrossel
    const heroSection = document.querySelector('.hero');
    heroSection?.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    heroSection?.addEventListener('mouseleave', restartAutoplay);

    render();
    restartAutoplay();
  }

  /* ---------- Menu mobile ---------- */

  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  navToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mainNav.style.display = isOpen ? 'block' : '';
  });

  /* ---------- Revelação suave da linha do tempo ---------- */

  const timelineItems = document.querySelectorAll('.timeline-item');

  if ('IntersectionObserver' in window && timelineItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    timelineItems.forEach((item) => observer.observe(item));
  } else {
    // fallback: mostra tudo caso o navegador não suporte IntersectionObserver
    timelineItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ---------- Carrossel de obras (usado nas páginas de artista) ---------- */

  document.querySelectorAll('.obras-carousel').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.obras-slide'));
    if (!slides.length) return;

    let current = slides.findIndex((s) => s.classList.contains('is-active'));
    if (current < 0) current = 0;

    function render() {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      render();
    }

    carousel.querySelector('.obras-prev')?.addEventListener('click', () => goTo(current - 1));
    carousel.querySelector('.obras-next')?.addEventListener('click', () => goTo(current + 1));

    render();
  });

});
