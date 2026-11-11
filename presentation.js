/**
 * Agentic AI in Software Development — Presentation Controller
 */

(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;

  const progressFill = document.getElementById('progress-fill');
  const slideCounter = document.getElementById('slide-counter');
  const navDotsContainer = document.getElementById('nav-dots');

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnTheme = document.getElementById('btn-theme');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  let currentIndex = 0;
  let cycleInterval = null;
  let currentCycleStep = 0;

  // Build navigation dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'nav-dot' + (idx === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.setAttribute('title', `Slide ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    navDotsContainer.appendChild(dot);
  });

  const navDots = Array.from(navDotsContainer.querySelectorAll('.nav-dot'));

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function goToSlide(index, updateHash = true) {
    if (index < 0 || index >= totalSlides) return;
    currentIndex = index;

    slides.forEach((slide, idx) => {
      slide.classList.remove('is-active', 'is-prev');
      if (idx === currentIndex) {
        slide.classList.add('is-active');
      } else if (idx < currentIndex) {
        slide.classList.add('is-prev');
      }
    });

    navDots.forEach((dot, idx) => {
      dot.classList.toggle('is-active', idx === currentIndex);
    });

    const pct = ((currentIndex + 1) / totalSlides) * 100;
    progressFill.style.width = `${pct}%`;
    slideCounter.textContent = `${pad2(currentIndex + 1)} / ${pad2(totalSlides)}`;

    btnPrev.disabled = currentIndex === 0;
    btnPrev.style.opacity = currentIndex === 0 ? '0.45' : '1';
    btnNext.disabled = currentIndex === totalSlides - 1;
    btnNext.style.opacity = currentIndex === totalSlides - 1 ? '0.45' : '1';

    if (updateHash) {
      history.replaceState(null, '', `#slide-${currentIndex + 1}`);
    }

    manageCycleAnimation();
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // Slide 5 Interactive Stepper Loop
  const cycleCards = Array.from(document.querySelectorAll('#cycle-stepper .cycle-step-card'));

  function setActiveCycleStep(stepIdx) {
    currentCycleStep = stepIdx % cycleCards.length;
    cycleCards.forEach((card, idx) => {
      card.classList.toggle('is-pulsing', idx === currentCycleStep);
    });
  }

  cycleCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      setActiveCycleStep(idx);
      restartCycleInterval();
    });
  });

  function restartCycleInterval() {
    if (cycleInterval) clearInterval(cycleInterval);
    if (currentIndex === 4) {
      cycleInterval = setInterval(() => {
        setActiveCycleStep(currentCycleStep + 1);
      }, 2200);
    }
  }

  function manageCycleAnimation() {
    if (currentIndex === 4) {
      setActiveCycleStep(0);
      restartCycleInterval();
    } else if (cycleInterval) {
      clearInterval(cycleInterval);
      cycleInterval = null;
    }
  }

  // Event Listeners
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  btnTheme.addEventListener('click', toggleTheme);
  btnFullscreen.addEventListener('click', toggleFullscreen);

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
      case 'l':
      case 'L':
        e.preventDefault();
        toggleTheme();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
    }
  });

  // Initialize from URL hash if present
  function initFromHash() {
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      if (idx >= 0 && idx < totalSlides) {
        goToSlide(idx, false);
        return;
      }
    }
    goToSlide(0, false);
  }

  window.addEventListener('hashchange', initFromHash);
  initFromHash();
})();
