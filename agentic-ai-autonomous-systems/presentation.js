/**
 * Agentic AI: The Evolution of Autonomous AI Systems — Presentation Controller
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

  const cycleCards = Array.from(document.querySelectorAll('#cycle-stepper .cycle-step-card'));
  const scenarioTabs = Array.from(document.querySelectorAll('.scenario-tab'));
  const scenarioPanels = Array.from(document.querySelectorAll('.scenario-panel'));

  const termBody = document.getElementById('term-body');
  const termPhaseBadge = document.getElementById('term-phase-badge');
  const btnTermReplay = document.getElementById('btn-term-replay');
  const btnTermSkip = document.getElementById('btn-term-skip');
  const roleCards = Array.from(document.querySelectorAll('.role-card'));

  let currentIndex = 0;
  let cycleInterval = null;
  let currentCycleStep = 0;
  let termRunId = 0;
  const termTimers = new Set();

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
    manageTerminalDemo();
  }

  function nextSlide() {
    if (currentIndex < totalSlides - 1) goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  }

  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // Slide 07 — Interactive Stepper & Scenario Tabs
  function setActiveCycleStep(stepIdx) {
    if (!cycleCards.length) return;
    currentCycleStep = stepIdx % cycleCards.length;
    cycleCards.forEach((card, idx) => {
      card.classList.toggle('is-pulsing', idx === currentCycleStep);
    });
  }

  function manageCycleAnimation() {
    if (cycleInterval) {
      clearInterval(cycleInterval);
      cycleInterval = null;
    }
    if (currentIndex === 6) {
      setActiveCycleStep(currentCycleStep);
      cycleInterval = setInterval(() => {
        setActiveCycleStep(currentCycleStep + 1);
      }, 2200);
    }
  }

  cycleCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      setActiveCycleStep(idx);
      if (cycleInterval) {
        clearInterval(cycleInterval);
        cycleInterval = setInterval(() => {
          setActiveCycleStep(currentCycleStep + 1);
        }, 2200);
      }
    });
  });

  scenarioTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-scenario');
      scenarioTabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      scenarioPanels.forEach((p) => {
        p.classList.toggle('is-active', p.getAttribute('data-panel') === target);
      });
    });
  });

  // Slide 08 — Multi-Agent Delegation Demo
  const demoSteps = [
    { delay: 250, role: 'coord', status: 'Planning', phase: 'Step 1/4: Delegating', cls: 'term-agent-coord', prefix: '[Coordinator]', text: 'Goal received: "Audit Q4 SaaS renewals & prepare team brief."' },
    { delay: 950, role: 'coord', status: 'Routing', phase: 'Step 1/4: Delegating', cls: 'term-agent-coord', prefix: '[Coordinator]', text: 'Assigning @Researcher (vendor pricing) & @Operator (billing export).' },
    { delay: 1750, role: 'research', status: 'Browsing', phase: 'Step 2/4: Researching', cls: 'term-agent-research', prefix: '[Researcher]', text: 'Checking 4 vendor portals in cloud browser; comparing annual tiers.' },
    { delay: 2600, role: 'operator', status: 'Executing', phase: 'Step 2/4: Operating', cls: 'term-agent-operator', prefix: '[Operator]', text: 'Exported invoice CSV via CLI; flagged 3 unused seats ($420/mo).' },
    { delay: 3450, role: 'guardrail', status: 'Auditing', phase: 'Step 3/4: Guardrail Check', cls: 'term-agent-guardrail', prefix: '[Guardrail]', text: 'Policy check: cancellation requires human sign-off. Drafting approval card.' },
    { delay: 4300, role: 'coord', status: 'Complete', phase: 'Step 4/4: Complete', cls: 'term-agent-done', prefix: '[Complete]', text: 'Posted summary + 1-click approval request to #ops-team in Slack.' }
  ];

  function clearTermTimers() {
    termTimers.forEach((id) => clearTimeout(id));
    termTimers.clear();
  }

  function resetRoles() {
    roleCards.forEach((card) => {
      card.classList.remove('is-working');
      const role = card.getAttribute('data-role');
      const statusEl = card.querySelector(`[data-status="${role}"]`);
      if (statusEl) statusEl.textContent = 'Idle';
    });
  }

  function appendTermLine(step) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="${step.cls}">${step.prefix}</span> ${step.text}`;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;

    roleCards.forEach((card) => {
      const role = card.getAttribute('data-role');
      const isMatch = role === step.role;
      card.classList.toggle('is-working', isMatch);
      const statusEl = card.querySelector(`[data-status="${role}"]`);
      if (statusEl && isMatch) statusEl.textContent = step.status;
    });

    if (termPhaseBadge) termPhaseBadge.textContent = step.phase;
  }

  function runTerminalDemo() {
    clearTermTimers();
    const runId = ++termRunId;
    if (!termBody) return;
    termBody.innerHTML = '';
    resetRoles();
    if (termPhaseBadge) termPhaseBadge.textContent = 'Starting';

    demoSteps.forEach((step) => {
      const id = setTimeout(() => {
        if (runId !== termRunId) return;
        appendTermLine(step);
      }, step.delay);
      termTimers.add(id);
    });
  }

  function skipTerminalDemo() {
    clearTermTimers();
    termRunId++;
    if (!termBody) return;
    termBody.innerHTML = '';
    resetRoles();
    demoSteps.forEach((step) => appendTermLine(step));
  }

  function manageTerminalDemo() {
    if (currentIndex === 7) {
      runTerminalDemo();
    } else {
      clearTermTimers();
      termRunId++;
    }
  }

  if (btnTermReplay) btnTermReplay.addEventListener('click', runTerminalDemo);
  if (btnTermSkip) btnTermSkip.addEventListener('click', skipTerminalDemo);

  // Event listeners
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  btnTheme.addEventListener('click', toggleTheme);
  btnFullscreen.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', (e) => {
    if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToSlide(totalSlides - 1);
    } else if (e.key === 'l' || e.key === 'L') {
      toggleTheme();
    } else if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
  });

  // Touch swipe support
  let touchStartX = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 48) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // Initialize from hash
  const hashMatch = window.location.hash.match(/^#slide-(\d+)$/);
  const initialIndex = hashMatch ? Math.min(Math.max(parseInt(hashMatch[1], 10) - 1, 0), totalSlides - 1) : 0;
  goToSlide(initialIndex, false);
})();
