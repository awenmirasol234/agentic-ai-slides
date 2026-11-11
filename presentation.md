---
marp: true
theme: default
paginate: true
title: "Agentic AI: The Evolution of AI in Software Development"
description: "From AI-assisted coding to autonomous software engineering"
---

# Agentic AI: The Evolution of AI in Software Development
### From AI-assisted coding to autonomous software engineering.

---

# What Is Agentic AI?

**Definition:** An AI system capable of pursuing a goal by planning tasks, making decisions, using tools, executing actions, and evaluating results with varying degrees of human supervision.

### Key Concepts
- **Goal-Oriented**: Works toward a defined objective.
- **Autonomous**: Performs tasks without constant instructions.
- **Action-Oriented**: Interacts with tools and external systems.
- **Adaptive**: Adjusts its approach based on results.

> **Software Development Example:**
> Instead of asking AI to generate a login function, instruct it to implement an entire authentication feature—including database integration, validation, and testing.

---

# Traditional AI vs. Agentic AI

| Traditional AI (Reactive Assistant) | Agentic AI (Goal-Driven Executor) |
| :--- | :--- |
| Responds to individual prompts | Works toward overarching goals |
| Generates isolated code snippets | Implements complete features |
| Suggests theoretical solutions | Executes solutions using workspace tools |
| Waits passively for instructions | Determines appropriate next steps |
| Developer coordinates every step | Manages multiple connected actions |

**Example — Fixing a Login Bug:**
- **Traditional AI**: Explains the error and suggests code for the developer to test.
- **Agentic AI**: Investigates the codebase, identifies the root cause, modifies the code, runs tests, and evaluates the results.

---

# What Makes an AI Agentic?

1. **Autonomy** — Can perform assigned tasks without constant human intervention.
2. **Planning** — Breaks complex objectives into smaller tasks.
3. **Reasoning** — Analyzes situations and determines appropriate actions.
4. **Tool Usage** — Interacts with terminals, APIs, databases, and development environments.
5. **Memory and Context** — Maintains relevant project information and previous decisions.
6. **Adaptability** — Evaluates outcomes and adjusts when something fails.

> **Important Distinction:**
> Simply using an LLM or multiple AI models does not automatically make a system agentic. Its ability to **pursue goals through decisions and actions** is what matters.

---

# How Does Agentic AI Work?

### The 6-Stage Execution Cycle
`1. Goal` → `2. Planning` → `3. Execution` → `4. Observation` → `5. Evaluation` → `6. Iteration`

1. **Goal**: Understand the developer’s objective.
2. **Planning**: Break down the objective into smaller tasks.
3. **Execution**: Perform actions using available tools.
4. **Observation**: Inspect outputs, errors, and results.
5. **Evaluation**: Determine whether the outcome meets requirements.
6. **Iteration**: Correct problems and repeat until achieved or human input is needed.

**Practical Example — Building a Student Management System:**
Analyze requirements → Design database → Develop frontend & backend → Run application → Test registration & auth → Fix identified errors → Verify completed implementation.

---

# Real-World Examples of Agentic AI

### 1. OpenAI Codex (`https://openai.com/codex/`)
- Understands existing codebases, implements features/fixes, and runs tests & dev commands.

### 2. GitHub Copilot Coding Agent (`https://github.com/features/copilot`)
- Accepts assigned GitHub issues, investigates repositories, implements code changes, and creates pull requests for review.

### 3. Devin (`https://devin.ai/`)
- Operates in a sandboxed development environment, investigates engineering problems, and executes multi-step software development tasks.

### 4. OpenCode (`https://opencode.ai/`)
- Open-source terminal coding agent that navigates codebases, executes commands, and supports configurable orchestrator and subagent workflows.

### 5. Claude Code (`https://claude.com/product/claude-code`)
- Anthropic’s agentic CLI and IDE tool that reads codebases, edits files, runs tests, and manages Git workflows, hooks, and subagents.

> **Key Takeaway:** These tools demonstrate how AI can participate in actual software engineering workflows, not just generate code.

---

# Multi-Agent AI in Software Development

**Definition:** Multiple AI agents working together with specialized responsibilities to accomplish a shared objective.

### Example: Student Management System Roles
- **Orchestrator**: Coordinates the development process
- **Planner**: Analyzes requirements and creates tasks
- **Frontend / Backend / Database Engineers**: Build UI, APIs, and schema
- **Tester / Code Reviewer / Security Reviewer**: Verify functionality, quality, and security

### How They Collaborate
1. Developer provides high-level objective → 2. Orchestrator delegates tasks → 3. Specialists execute assignments → 4. Orchestrator integrates results → 5. Testing & reviews identify issues → 6. System iterates until satisfied. *(Demonstrated in tools like **OpenCode**).*

---

# Multi-Agent Terminal Demo

**Simulated OpenCode Terminal Session (`student-management-system`)**

1. **Prompt Input:** Developer asks the agent team to add JWT authentication and role-based access control to the Student Management System.
2. **Planning:** Orchestrator invokes **Planner**, breaking the objective into 4 workstreams (schema, API, UI, verification).
3. **Parallel Build:**
   - **Database Engineer:** Applies SQL migration (`004_create_users_roles.sql`) creating `users` and email index.
   - **Backend Developer:** Implements `/api/auth/login` (bcrypt + HS256 JWT) and `requireRole()` middleware.
   - **Frontend Developer:** Builds `LoginPage.tsx`, `useAuth.ts`, and `ProtectedRoute` navigation guards.
4. **Verification:**
   - **Tester:** Executes `npm test -- auth.spec.ts` (`PASS 6/6 assertions`).
   - **Security Reviewer:** Completes static & token audit (`0 high/critical issues`).
5. **Synthesis:** Orchestrator reports completion across DB, API, and UI ready for human review.

---

# Benefits, Challenges, and Conclusion

### Benefits
- Faster development workflows & reduced repetitive tasks
- Parallel execution of development work & automated testing assistance
- More time for developers to focus on architecture and problem-solving

### Challenges
- Incorrect code/decisions & potential security vulnerabilities
- Increased computational/API costs & agent coordination complexity
- Continued need for human supervision

> **Closing Statement:**
> *“Developers may no longer need to write every line of code themselves, but they will still need to understand, direct, and validate the systems they build.”*
