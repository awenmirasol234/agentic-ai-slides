/**
 * Agentic AI in Software Development — Presentation Controller
 */

(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;

  const progressFill = document.getElementById('progress-fill');
  const slideCounter = document.getElementById('slide-counter');
  const recommendedTimeEl = document.getElementById('recommended-time');
  const navDotsContainer = document.getElementById('nav-dots');

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnNotes = document.getElementById('btn-notes');
  const btnCloseNotes = document.getElementById('btn-close-notes');
  const btnTheme = document.getElementById('btn-theme');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  const presenterDrawer = document.getElementById('presenter-drawer');
  const presenterSlideLabel = document.getElementById('presenter-slide-label');
  const presenterNotesContent = document.getElementById('presenter-notes-content');
  const elapsedTimeEl = document.getElementById('elapsed-time');

  const speakerNotes = [
    {
      time: '1.0 min',
      notes: [
        'Welcome everyone. Today we are exploring a major shift in software engineering: moving from AI-assisted coding to autonomous, Agentic AI.',
        'For the past couple of years, developers have used AI primarily as a smart autocomplete or a chatbot that answers questions one prompt at a time.',
        'Pause on the opening question: "What if you could assign an AI the task of building an application instead of writing every instruction yourself?" That question defines the transition to Agentic AI.'
      ]
    },
    {
      time: '1.5 min',
      notes: [
        'So what actually is Agentic AI? It is an AI system capable of pursuing a goal by planning tasks, making decisions, using tools, executing actions, and evaluating results.',
        'Highlight the four pillars: Goal-oriented (it knows the finish line), Autonomous (it chains steps without hand-holding), Action-oriented (it runs real commands and edits files), and Adaptive (it fixes its own errors).',
        'Use the authentication example: instead of asking for a single login helper function, you ask for the whole authentication feature—database tables, validation, routes, and tests.'
      ]
    },
    {
      time: '2.0 min',
      notes: [
        'Let’s contrast Traditional AI with Agentic AI side by side.',
        'With Traditional AI, the human developer is the glue: you copy an error, paste it into chat, copy the suggested snippet back into your editor, and run the tests yourself.',
        'With Agentic AI, the agent investigates the codebase directly, locates the bug, edits the source file, runs the test suite, and verifies the result before reporting back.'
      ]
    },
    {
      time: '1.5 min',
      notes: [
        'Six core characteristics make an AI system truly agentic: Autonomy, Planning, Reasoning, Tool Usage, Memory & Context, and Adaptability.',
        'Emphasize the callout at the bottom: simply wrapping an LLM or calling multiple models in a fixed script does NOT make a system agentic. Agency comes from the closed-loop ability to make decisions, take actions with tools, and adapt based on feedback.'
      ]
    },
    {
      time: '2.0 min',
      notes: [
        'How does an agent operate under the hood? Through a continuous 6-step execution cycle: Goal -> Planning -> Execution -> Observation -> Evaluation -> Iteration.',
        'Walk through the Student Management System example on the right: the agent analyzes requirements, designs the database, builds frontend and backend, runs the app, tests login/registration, fixes any test failures, and verifies the final build.'
      ]
    },
    {
      time: '2.0 min',
      notes: [
        'This isn’t theoretical—several production tools already operate this way.',
        '1. OpenAI Codex: understands repositories, implements features, and executes test commands.',
        '2. GitHub Copilot Coding Agent: can be assigned a GitHub issue directly, investigates the repo, and opens a reviewed Pull Request.',
        '3. Devin: operates inside a full cloud development environment to execute multi-step engineering tasks.'
      ]
    },
    {
      time: '2.0 min',
      notes: [
        'Now let’s take it one step further: Multi-Agent Systems. Instead of one generalist agent doing everything, specialized agents collaborate like an engineering team.',
        'In our Student Management System example, an Orchestrator delegates work to a Planner, Frontend Dev, Backend Dev, Database Engineer, Tester, Code Reviewer, and Security Reviewer.',
        'Mention that tools like OpenCode allow configuring an orchestrator with specialized subagents to run this exact architecture.'
      ]
    },
    {
      time: '1.0 min',
      notes: [
        'To wrap up: Agentic AI unlocks faster workflows, parallel execution, and frees developers to focus on system architecture.',
        'However, it brings real challenges: flawed decisions, security risks, higher token/compute costs, and coordination overhead.',
        'Close with the final quote: "Developers may no longer need to write every line of code themselves, but they will still need to understand, direct, and validate the systems they build."'
      ]
    }
  ];

  let currentIndex = 0;
  let notesOpen = false;
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

  function updatePresenterNotes(idx) {
    const noteObj = speakerNotes[idx] || { time: '1.5 min', notes: [] };
    presenterSlideLabel.textContent = `SPEAKER NOTES // SLIDE ${pad2(idx + 1)} (${noteObj.time})`;
    presenterNotesContent.innerHTML = noteObj.notes.map(p => `<p>${p}</p>`).join('');
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

    const duration = slides[currentIndex].getAttribute('data-duration') || '1.5 min';
    recommendedTimeEl.textContent = duration;

    btnPrev.disabled = currentIndex === 0;
    btnPrev.style.opacity = currentIndex === 0 ? '0.45' : '1';
    btnNext.disabled = currentIndex === totalSlides - 1;
    btnNext.style.opacity = currentIndex === totalSlides - 1 ? '0.45' : '1';

    updatePresenterNotes(currentIndex);

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

  function toggleNotes() {
    notesOpen = !notesOpen;
    presenterDrawer.classList.toggle('is-open', notesOpen);
    presenterDrawer.setAttribute('aria-hidden', String(!notesOpen));
    btnNotes.classList.toggle('active', notesOpen);
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

  // Presentation Elapsed Timer
  let startTime = Date.now();
  setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    elapsedTimeEl.textContent = `${pad2(mins)}:${pad2(secs)}`;
  }, 1000);

  // Event Listeners
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  btnNotes.addEventListener('click', toggleNotes);
  btnCloseNotes.addEventListener('click', toggleNotes);
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
      case 'p':
      case 'P':
        e.preventDefault();
        toggleNotes();
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
      case 't':
      case 'T':
        e.preventDefault();
        startTime = Date.now();
        elapsedTimeEl.textContent = '00:00';
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
