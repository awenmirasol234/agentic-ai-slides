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
  const termBody = document.getElementById('term-body');
  const termOutput = document.getElementById('term-output');
  const termPhaseBadge = document.getElementById('term-phase-badge');
  const termAgentsCount = document.getElementById('term-agents-count');
  const btnTermReplay = document.getElementById('btn-term-replay');
  const btnTermSkip = document.getElementById('btn-term-skip');
  const termAgentCards = Array.from(document.querySelectorAll('.term-agent-card'));

  let currentIndex = 0;
  let cycleInterval = null;
  let currentCycleStep = 0;
  let termRunId = 0;
  let termInterval = null;
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

  // ==========================================================================
  // SLIDE 8: MULTI-AGENT TERMINAL DEMO CONTROLLER
  // ==========================================================================

  const TERMINAL_PROMPT =
    'Add JWT authentication and role-based access to the Student Management System';

  const PLAN_STEPS = [
    '1. Schema & user seed migration',
    '2. Auth API & JWT middleware',
    '3. Login UI & protected routes',
    '4. Auth tests & security audit'
  ];

  const EXECUTION_BLOCKS = [
    {
      agent: 'db',
      tag: 'Database',
      cmd: '$ psql -f migrations/004_create_users_roles.sql',
      lines: [
        { text: '+ CREATE TABLE users (id UUID PRIMARY KEY, email TEXT UNIQUE, role TEXT);', add: true },
        { text: '+ CREATE INDEX idx_users_email ON users(email);', add: true }
      ]
    },
    {
      agent: 'backend',
      tag: 'Backend',
      cmd: 'edit src/auth/jwt.middleware.ts & src/routes/auth.ts',
      lines: [
        { text: '+ POST /api/auth/login (bcrypt verify + HS256 JWT)', add: true },
        { text: "+ requireRole(['admin', 'teacher']) guard attached", add: true }
      ]
    },
    {
      agent: 'frontend',
      tag: 'Frontend',
      cmd: 'write src/pages/LoginPage.tsx & src/hooks/useAuth.ts',
      lines: [
        { text: '+ ProtectedRoute wrapper + role-aware navigation', add: true }
      ]
    }
  ];

  const QA_BLOCKS = [
    {
      agent: 'tester',
      tag: 'Tester',
      cmd: '$ npm test -- auth.spec.ts',
      badge: 'PASS',
      summary: 'src/auth/auth.spec.ts (6/6 assertions passed in 0.42s)'
    },
    {
      agent: 'security',
      tag: 'Security',
      cmd: 'Static & JWT token configuration audit',
      badge: 'PASS',
      summary: '0 high/critical issues • rate limit & httpOnly cookie verified'
    }
  ];

  const SUMMARY_LINES = [
    '• Authentication & RBAC implemented across DB, API, and UI.',
    '• 5 files updated, 6/6 tests passing, 0 security findings.'
  ];

  const AGENT_STATUS_LABELS = {
    waiting: 'Waiting',
    active: 'Active',
    done: 'Done'
  };

  function manageTerminalDemo() {
    if (currentIndex === 7) {
      startTerminalDemo();
    } else {
      stopTerminalDemo();
    }
  }

  function stopTerminalDemo() {
    termRunId += 1;
    termTimers.forEach((id) => clearTimeout(id));
    termTimers.clear();
    if (termInterval) {
      clearInterval(termInterval);
      termInterval = null;
    }
  }

  function scheduleTerm(delayMs, callback) {
    const runId = termRunId;
    const id = setTimeout(() => {
      termTimers.delete(id);
      if (runId !== termRunId) return;
      callback();
    }, delayMs);
    termTimers.add(id);
  }

  function setTermPhase(label, state) {
    if (!termPhaseBadge) return;
    termPhaseBadge.textContent = label;
    termPhaseBadge.dataset.state = state;
  }

  function setAgentStatus(agentId, status) {
    const card = termAgentCards.find((el) => el.dataset.agent === agentId);
    if (card) {
      card.dataset.status = status;
      const badge = card.querySelector('.term-agent-status');
      if (badge) badge.textContent = AGENT_STATUS_LABELS[status] || status;
    }
    if (termAgentsCount) {
      const doneCount = termAgentCards.filter((el) => el.dataset.status === 'done').length;
      termAgentsCount.textContent = `${doneCount} / ${termAgentCards.length} done`;
    }
  }

  function resetAgentRoster(status) {
    termAgentCards.forEach((card) => {
      card.dataset.status = status;
      const badge = card.querySelector('.term-agent-status');
      if (badge) badge.textContent = AGENT_STATUS_LABELS[status] || status;
    });
    if (termAgentsCount) {
      const doneCount = status === 'done' ? termAgentCards.length : 0;
      termAgentsCount.textContent = `${doneCount} / ${termAgentCards.length} done`;
    }
  }

  function scrollTerminal() {
    if (termBody) {
      termBody.scrollTop = termBody.scrollHeight;
    }
  }

  function appendOutputElement(el) {
    if (!termOutput) return;
    termOutput.appendChild(el);
    scrollTerminal();
  }

  function createPromptRow(initialText, withCursor) {
    const row = document.createElement('div');
    row.className = 'term-line term-prompt-row';

    const sigil = document.createElement('span');
    sigil.className = 'term-prompt-sigil';
    sigil.textContent = '$';

    const typed = document.createElement('span');
    typed.className = 'term-typed-text';
    typed.textContent = initialText;

    row.appendChild(sigil);
    row.appendChild(typed);

    let cursor = null;
    if (withCursor) {
      cursor = document.createElement('span');
      cursor.className = 'term-cursor';
      cursor.textContent = '▊';
      row.appendChild(cursor);
    }

    return { row, typed, cursor };
  }

  function createStatusRow(text, settled) {
    const row = document.createElement('div');
    row.className = 'term-line term-spinner-row';

    const glyph = document.createElement('span');
    glyph.className = settled ? 'term-done-check' : 'term-spinner-glyph';
    glyph.textContent = settled ? '✓' : '⠋';

    const msg = document.createElement('span');
    msg.className = 'term-status-text';
    msg.textContent = text;

    row.appendChild(glyph);
    row.appendChild(msg);
    return { row, glyph, msg };
  }

  function startSpinner(text) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let frameIndex = 0;
    const { row, glyph, msg } = createStatusRow(text, false);
    appendOutputElement(row);

    const runId = termRunId;
    if (termInterval) clearInterval(termInterval);
    termInterval = setInterval(() => {
      if (runId !== termRunId) {
        clearInterval(termInterval);
        termInterval = null;
        return;
      }
      frameIndex = (frameIndex + 1) % frames.length;
      glyph.textContent = frames[frameIndex];
    }, 80);

    return (settledText) => {
      if (termInterval) {
        clearInterval(termInterval);
        termInterval = null;
      }
      glyph.className = 'term-done-check';
      glyph.textContent = '✓';
      msg.textContent = settledText;
      scrollTerminal();
    };
  }

  function createPlanBlock() {
    const list = document.createElement('div');
    list.className = 'term-line term-plan-list';
    PLAN_STEPS.forEach((step) => {
      const item = document.createElement('div');
      item.className = 'term-plan-item';
      item.textContent = step;
      list.appendChild(item);
    });
    return list;
  }

  function createCmdBlock(block) {
    const box = document.createElement('div');
    box.className = 'term-line term-cmd-block';

    const head = document.createElement('div');
    head.className = 'term-cmd-head';

    const tag = document.createElement('span');
    tag.className = 'term-agent-tag';
    tag.textContent = block.tag;

    const cmd = document.createElement('span');
    cmd.className = 'term-cmd-text';
    cmd.textContent = block.cmd;

    head.appendChild(tag);
    head.appendChild(cmd);
    box.appendChild(head);

    if (block.lines) {
      block.lines.forEach((line) => {
        const diff = document.createElement('div');
        diff.className = line.add ? 'term-diff-line term-diff-line--add' : 'term-diff-line';
        diff.textContent = line.text;
        box.appendChild(diff);
      });
    }

    if (block.badge) {
      const passRow = document.createElement('div');
      passRow.className = 'term-test-pass';

      const badge = document.createElement('span');
      badge.className = 'term-test-badge';
      badge.textContent = block.badge;

      const summary = document.createElement('span');
      summary.textContent = block.summary;

      passRow.appendChild(badge);
      passRow.appendChild(summary);
      box.appendChild(passRow);
    }

    return box;
  }

  function createSummaryBox() {
    const box = document.createElement('div');
    box.className = 'term-line term-response-box';

    const title = document.createElement('div');
    title.className = 'term-response-title';
    title.textContent = 'Orchestrator // Ready for Review';

    const list = document.createElement('div');
    list.className = 'term-response-list';
    SUMMARY_LINES.forEach((line) => {
      const item = document.createElement('div');
      item.textContent = line;
      list.appendChild(item);
    });

    box.appendChild(title);
    box.appendChild(list);
    return box;
  }

  function runOrchestrationSequence() {
    setTermPhase('Planning', 'active');
    setAgentStatus('orchestrator', 'active');
    const finishPlanSpinner = startSpinner('Orchestrator analyzing repository & delegating tasks...');

    scheduleTerm(350, () => setAgentStatus('planner', 'active'));

    scheduleTerm(1050, () => {
      finishPlanSpinner('Planner decomposed request into 4 parallelizable workstreams');
      appendOutputElement(createPlanBlock());
      setAgentStatus('planner', 'done');
    });

    scheduleTerm(1550, () => {
      setTermPhase('Executing', 'active');
      setAgentStatus('db', 'active');
    });
    scheduleTerm(1700, () => setAgentStatus('backend', 'active'));
    scheduleTerm(1850, () => setAgentStatus('frontend', 'active'));

    EXECUTION_BLOCKS.forEach((block, index) => {
      scheduleTerm(2350 + index * 800, () => {
        appendOutputElement(createCmdBlock(block));
        setAgentStatus(block.agent, 'done');
      });
    });

    let finishQaSpinner = null;
    scheduleTerm(4450, () => {
      setTermPhase('Verifying', 'active');
      setAgentStatus('tester', 'active');
      setAgentStatus('security', 'active');
      finishQaSpinner = startSpinner('Tester & Security running verification suite...');
    });

    scheduleTerm(5350, () => {
      if (finishQaSpinner) finishQaSpinner('Verification suite completed');
      appendOutputElement(createCmdBlock(QA_BLOCKS[0]));
      setAgentStatus('tester', 'done');
    });

    scheduleTerm(5900, () => {
      appendOutputElement(createCmdBlock(QA_BLOCKS[1]));
      setAgentStatus('security', 'done');
    });

    scheduleTerm(6500, () => {
      setAgentStatus('orchestrator', 'done');
      setTermPhase('Verified', 'verified');
      appendOutputElement(createSummaryBox());
    });
  }

  function startTerminalDemo() {
    if (!termOutput) return;
    stopTerminalDemo();
    termOutput.innerHTML = '';
    resetAgentRoster('waiting');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      completeTerminalDemo();
      return;
    }

    setTermPhase('Typing', 'active');
    const { row, typed, cursor } = createPromptRow('', true);
    appendOutputElement(row);

    let charIndex = 0;
    const runId = termRunId;
    termInterval = setInterval(() => {
      if (runId !== termRunId) {
        clearInterval(termInterval);
        termInterval = null;
        return;
      }
      charIndex += 1;
      typed.textContent = TERMINAL_PROMPT.slice(0, charIndex);
      if (charIndex >= TERMINAL_PROMPT.length) {
        clearInterval(termInterval);
        termInterval = null;
        if (cursor) cursor.remove();
        scheduleTerm(180, runOrchestrationSequence);
      }
    }, 20);
  }

  function completeTerminalDemo() {
    if (!termOutput) return;
    stopTerminalDemo();
    termOutput.innerHTML = '';
    resetAgentRoster('done');
    setTermPhase('Verified', 'verified');

    const { row } = createPromptRow(TERMINAL_PROMPT, false);
    termOutput.appendChild(row);
    termOutput.appendChild(createStatusRow('Planner decomposed request into 4 parallelizable workstreams', true).row);
    termOutput.appendChild(createPlanBlock());
    EXECUTION_BLOCKS.forEach((block) => termOutput.appendChild(createCmdBlock(block)));
    termOutput.appendChild(createStatusRow('Verification suite completed', true).row);
    QA_BLOCKS.forEach((block) => termOutput.appendChild(createCmdBlock(block)));
    termOutput.appendChild(createSummaryBox());
    scrollTerminal();
  }

  if (btnTermReplay) {
    btnTermReplay.addEventListener('click', (e) => {
      e.currentTarget.blur();
      startTerminalDemo();
    });
  }

  if (btnTermSkip) {
    btnTermSkip.addEventListener('click', (e) => {
      e.currentTarget.blur();
      completeTerminalDemo();
    });
  }

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
