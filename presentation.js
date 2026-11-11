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
  const termPromptBar = document.getElementById('term-prompt-bar');
  const termPromptBarTrack = document.getElementById('term-prompt-bar-track');
  const termPromptBarText = document.getElementById('term-prompt-bar-text');
  const termPromptBarMeta = document.getElementById('term-prompt-bar-meta');
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

  const DEMO_TURNS = [
    {
      label: 'Turn 1 // Auth & RBAC',
      prompt: 'Add JWT authentication and role-based access to the Student Management System',
      planSummary: 'Decomposed request into 4 parallelizable workstreams',
      planSteps: [
        '1. Schema & user seed migration',
        '2. Auth API & JWT middleware',
        '3. Login UI & protected routes',
        '4. Auth tests & security audit'
      ],
      executionBlocks: [
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
      ],
      qaSummary: 'Verification suite completed',
      qaBlocks: [
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
      ],
      summaryTitle: 'Orchestrator // Turn 1 Complete',
      summaryLines: [
        '• Authentication & RBAC implemented across DB, API, and UI.',
        '• 5 files updated, 6/6 tests passing, 0 security findings.'
      ]
    },
    {
      label: 'Turn 2 // Course Enrollment & Export',
      prompt: 'Now add course enrollment management and role-gated CSV roster export',
      planSummary: 'Planned 4 enrollment & export tasks across stack',
      planSteps: [
        '1. Enrollments schema & foreign keys',
        '2. Enrollment API & CSV export stream',
        '3. Enrollment modal & Export CSV button',
        '4. Integration & RBAC policy checks'
      ],
      executionBlocks: [
        {
          agent: 'db',
          tag: 'Database',
          cmd: '$ psql -f migrations/005_create_enrollments.sql',
          lines: [
            { text: '+ CREATE TABLE enrollments (id UUID PRIMARY KEY, student_id UUID, course_id UUID);', add: true }
          ]
        },
        {
          agent: 'backend',
          tag: 'Backend',
          cmd: 'write src/routes/enrollments.ts & src/services/csvExport.ts',
          lines: [
            { text: "+ GET /api/roster/export.csv (requireRole(['teacher', 'admin']))", add: true }
          ]
        },
        {
          agent: 'frontend',
          tag: 'Frontend',
          cmd: 'write src/components/EnrollmentModal.tsx & ExportButton.tsx',
          lines: [
            { text: '+ Added course enrollment table and role-gated CSV export action', add: true }
          ]
        }
      ],
      qaSummary: 'Enrollment & permission checks completed',
      qaBlocks: [
        {
          agent: 'tester',
          tag: 'Tester',
          cmd: '$ npm test -- enrollment.spec.ts',
          badge: 'PASS',
          summary: 'src/enrollments/enrollment.spec.ts (5/5 assertions passed in 0.38s)'
        },
        {
          agent: 'security',
          tag: 'Security',
          cmd: 'RBAC scope & student PII audit',
          badge: 'PASS',
          summary: 'Student role blocked from bulk roster export (HTTP 403 enforced)'
        }
      ],
      summaryTitle: 'Orchestrator // Turn 2 Complete',
      summaryLines: [
        '• Course enrollment & role-gated CSV roster export added.',
        '• 11/11 cumulative tests passing with RBAC policy verified.'
      ]
    },
    {
      label: 'Turn 3 // Race Fix & CSV Hardening',
      prompt: 'Fix duplicate enrollment race condition and sanitize CSV cell formulas',
      planSummary: 'Targeted hardening plan across constraint, API guard, and QA',
      planSteps: [
        '1. Unique composite constraint migration',
        '2. Idempotent upsert & CSV formula escaping',
        '3. Conflict notice in EnrollmentModal',
        '4. Regression & injection security suite'
      ],
      executionBlocks: [
        {
          agent: 'db',
          tag: 'Database',
          cmd: '$ psql -f migrations/006_unique_enrollment.sql',
          lines: [
            { text: '+ ALTER TABLE enrollments ADD CONSTRAINT uq_student_course UNIQUE (student_id, course_id);', add: true }
          ]
        },
        {
          agent: 'backend',
          tag: 'Backend',
          cmd: 'edit src/routes/enrollments.ts & src/services/csvExport.ts',
          lines: [
            { text: '+ ON CONFLICT DO NOTHING -> HTTP 409; escapeCsvCell() prefixes =, +, -, @', add: true }
          ]
        },
        {
          agent: 'frontend',
          tag: 'Frontend',
          cmd: 'edit src/components/EnrollmentModal.tsx',
          lines: [
            { text: '+ Handled HTTP 409 duplicate enrollment alert inline', add: true }
          ]
        }
      ],
      qaSummary: 'Full regression & CSV injection suite verified',
      qaBlocks: [
        {
          agent: 'tester',
          tag: 'Tester',
          cmd: '$ npm test',
          badge: 'PASS',
          summary: 'All 3 suites • 14/14 assertions passed in 0.71s'
        },
        {
          agent: 'security',
          tag: 'Security',
          cmd: 'OWASP CSV formula & concurrency replay test',
          badge: 'PASS',
          summary: 'Duplicate burst safe • =CMD() formula injection neutralized'
        }
      ],
      summaryTitle: 'Orchestrator // Session Verified & Ready',
      summaryLines: [
        '• Concurrent enrollment race & CSV formula risks resolved.',
        '• Full regression suite green (14/14 passing) — ready for review.'
      ]
    }
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

  function setPromptBar(state, text, meta) {
    if (termPromptBar) termPromptBar.dataset.state = state;
    if (termPromptBarText && text !== undefined) termPromptBarText.textContent = text;
    if (termPromptBarMeta && meta !== undefined) termPromptBarMeta.textContent = meta;
    if (termPromptBarTrack && state === 'typing') {
      termPromptBarTrack.scrollLeft = termPromptBarTrack.scrollWidth;
    }
  }

  function createTurnDivider(label) {
    const div = document.createElement('div');
    div.className = 'term-line term-turn-divider';
    div.textContent = label;
    return div;
  }

  function createPromptRow(initialText, withCursor, committed) {
    const row = document.createElement('div');
    row.className = committed
      ? 'term-line term-prompt-row term-prompt-row--committed'
      : 'term-line term-prompt-row';

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

  function createStatusRow(text, settled, agentId, tagLabel) {
    const row = document.createElement('div');
    row.className = 'term-line term-spinner-row';
    if (agentId) row.dataset.agent = agentId;

    const glyph = document.createElement('span');
    glyph.className = settled ? 'term-done-check' : 'term-spinner-glyph';
    glyph.textContent = settled ? '✓' : '⠋';
    row.appendChild(glyph);

    let tag = null;
    if (tagLabel) {
      tag = document.createElement('span');
      tag.className = 'term-agent-tag';
      tag.textContent = tagLabel;
      row.appendChild(tag);
    }

    const msg = document.createElement('span');
    msg.className = 'term-status-text';
    msg.textContent = text;

    row.appendChild(msg);
    return { row, glyph, tag, msg };
  }

  function startSpinner(text, agentId, tagLabel) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let frameIndex = 0;
    const { row, glyph, tag, msg } = createStatusRow(text, false, agentId, tagLabel);
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

    return (settledText, settledAgentId, settledTagLabel) => {
      if (termInterval) {
        clearInterval(termInterval);
        termInterval = null;
      }
      if (settledAgentId) row.dataset.agent = settledAgentId;
      if (tag && settledTagLabel) tag.textContent = settledTagLabel;
      glyph.className = 'term-done-check';
      glyph.textContent = '✓';
      msg.textContent = settledText;
      scrollTerminal();
    };
  }

  function createPlanBlock(steps) {
    const list = document.createElement('div');
    list.className = 'term-line term-plan-list';
    list.dataset.agent = 'planner';
    steps.forEach((step) => {
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
    if (block.agent) box.dataset.agent = block.agent;

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

  function createSummaryBox(summaryTitle, summaryLines) {
    const box = document.createElement('div');
    box.className = 'term-line term-response-box';
    box.dataset.agent = 'orchestrator';

    const title = document.createElement('div');
    title.className = 'term-response-title';
    title.textContent = summaryTitle;

    const list = document.createElement('div');
    list.className = 'term-response-list';
    summaryLines.forEach((line) => {
      const item = document.createElement('div');
      item.textContent = line;
      list.appendChild(item);
    });

    box.appendChild(title);
    box.appendChild(list);
    return box;
  }

  function runTurnSequence(turn, onComplete) {
    setTermPhase('Planning', 'active');
    setAgentStatus('orchestrator', 'active');
    const finishPlanSpinner = startSpinner(
      'Analyzing repository & delegating tasks...',
      'orchestrator',
      'Orchestrator'
    );

    scheduleTerm(300, () => setAgentStatus('planner', 'active'));

    scheduleTerm(950, () => {
      finishPlanSpinner(turn.planSummary, 'planner', 'Planner');
      appendOutputElement(createPlanBlock(turn.planSteps));
      setAgentStatus('planner', 'done');
    });

    scheduleTerm(1350, () => {
      setTermPhase('Executing', 'active');
      setAgentStatus('db', 'active');
    });
    scheduleTerm(1500, () => setAgentStatus('backend', 'active'));
    scheduleTerm(1650, () => setAgentStatus('frontend', 'active'));

    const blockStepMs = 680;
    const execStartMs = 2050;
    turn.executionBlocks.forEach((block, index) => {
      scheduleTerm(execStartMs + index * blockStepMs, () => {
        appendOutputElement(createCmdBlock(block));
        setAgentStatus(block.agent, 'done');
      });
    });

    const qaStartMs = execStartMs + turn.executionBlocks.length * blockStepMs + 320;
    let finishQaSpinner = null;
    scheduleTerm(qaStartMs, () => {
      setTermPhase('Verifying', 'active');
      setAgentStatus('tester', 'active');
      setAgentStatus('security', 'active');
      finishQaSpinner = startSpinner('Running verification suite...', 'tester', 'Verification');
    });

    scheduleTerm(qaStartMs + 780, () => {
      if (finishQaSpinner) finishQaSpinner(turn.qaSummary, 'tester', 'Verification');
      appendOutputElement(createCmdBlock(turn.qaBlocks[0]));
      setAgentStatus('tester', 'done');
    });

    scheduleTerm(qaStartMs + 1280, () => {
      appendOutputElement(createCmdBlock(turn.qaBlocks[1]));
      setAgentStatus('security', 'done');
    });

    scheduleTerm(qaStartMs + 1780, () => {
      setAgentStatus('orchestrator', 'done');
      appendOutputElement(createSummaryBox(turn.summaryTitle, turn.summaryLines));
      if (onComplete) onComplete();
    });
  }

  function playTurn(turnIndex) {
    const turn = DEMO_TURNS[turnIndex];
    if (!turn) return;

    const turnTag = `Prompt ${turnIndex + 1} / ${DEMO_TURNS.length}`;
    appendOutputElement(createTurnDivider(turn.label));
    setTermPhase('Typing', 'active');
    setPromptBar('typing', '', turnTag);

    let charIndex = 0;
    const runId = termRunId;
    if (termInterval) clearInterval(termInterval);
    termInterval = setInterval(() => {
      if (runId !== termRunId) {
        clearInterval(termInterval);
        termInterval = null;
        return;
      }
      charIndex += 1;
      setPromptBar('typing', turn.prompt.slice(0, charIndex));
      if (charIndex >= turn.prompt.length) {
        clearInterval(termInterval);
        termInterval = null;
        scheduleTerm(200, () => {
          appendOutputElement(createPromptRow(turn.prompt, false, true).row);
          resetAgentRoster('waiting');
          setPromptBar('busy', `Agents working on ${turnTag}...`, turnTag);
          runTurnSequence(turn, () => {
            if (turnIndex + 1 < DEMO_TURNS.length) {
              setPromptBar('busy', `Preparing Prompt ${turnIndex + 2} / ${DEMO_TURNS.length}...`, turnTag);
              scheduleTerm(1100, () => playTurn(turnIndex + 1));
            } else {
              setTermPhase('Verified', 'verified');
              setPromptBar('busy', 'Session complete — looping continuously...', 'Looping');
              scheduleTerm(2800, startTerminalDemo);
            }
          });
        });
      }
    }, 18);
  }

  function appendTurnSnapshot(turn) {
    termOutput.appendChild(createTurnDivider(turn.label));
    termOutput.appendChild(createPromptRow(turn.prompt, false, true).row);
    termOutput.appendChild(createStatusRow(turn.planSummary, true, 'planner', 'Planner').row);
    termOutput.appendChild(createPlanBlock(turn.planSteps));
    turn.executionBlocks.forEach((block) => termOutput.appendChild(createCmdBlock(block)));
    termOutput.appendChild(createStatusRow(turn.qaSummary, true, 'tester', 'Verification').row);
    turn.qaBlocks.forEach((block) => termOutput.appendChild(createCmdBlock(block)));
    termOutput.appendChild(createSummaryBox(turn.summaryTitle, turn.summaryLines));
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

    playTurn(0);
  }

  function completeTerminalDemo() {
    if (!termOutput) return;
    stopTerminalDemo();
    termOutput.innerHTML = '';
    resetAgentRoster('done');
    setTermPhase('Verified', 'verified');
    setPromptBar(
      'done',
      'All 3 prompts verified — click Replay to run continuous loop',
      `${DEMO_TURNS.length} / ${DEMO_TURNS.length} Done`
    );

    DEMO_TURNS.forEach(appendTurnSnapshot);
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
