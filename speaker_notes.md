# Speaker Notes & Timing Guide: Agentic AI in Software Development

**Estimated Total Duration:** 13 Minutes (Fits comfortably inside a 10–15 minute slot)

| Slide | Topic | Recommended Time | Cumulative Time |
| :--- | :--- | :--- | :--- |
| **Slide 1** | Introduction to Agentic AI | 1.0 min | 1.0 min |
| **Slide 2** | What Is Agentic AI? | 1.5 min | 2.5 min |
| **Slide 3** | Traditional AI vs. Agentic AI | 2.0 min | 4.5 min |
| **Slide 4** | What Makes an AI Agentic? | 1.5 min | 6.0 min |
| **Slide 5** | How Does Agentic AI Work? | 2.0 min | 8.0 min |
| **Slide 6** | Real-World Examples of Agentic AI | 2.0 min | 10.0 min |
| **Slide 7** | Multi-Agent AI in Software Development | 2.0 min | 12.0 min |
| **Slide 8** | Benefits, Challenges, and Conclusion | 1.0 min | 13.0 min |

---

## Slide 1 — Introduction to Agentic AI (1.0 min)

**Talking Points:**
- Welcome everyone. Over the past few years, AI has transformed how we write software—starting with smart autocomplete and chat assistants.
- Today, however, we are witnessing a deeper paradigm shift: moving from *AI-assisted coding* to *autonomous software engineering*.
- Instead of prompting an AI for single functions or isolated code snippets, developers can now delegate multi-step tasks that require planning, execution, and self-correction.
- **Ask the audience:** *"What if you could assign an AI the task of building an application instead of writing every instruction yourself?"*

---

## Slide 2 — What Is Agentic AI? (1.5 min)

**Talking Points:**
- Let’s define Agentic AI clearly: it is an AI system capable of pursuing a goal by planning tasks, making decisions, using tools, executing actions, and evaluating results with varying degrees of human supervision.
- Notice the four foundational pillars on screen:
  1. **Goal-oriented**: You give it a destination, not just a single turn-by-turn command.
  2. **Autonomous**: It moves from step to step without waiting for a prompt at every line.
  3. **Action-oriented**: It actually interacts with the environment—editing files, running terminal commands, querying databases.
  4. **Adaptive**: When a test fails or a build breaks, it reads the error and adjusts its approach.
- **Concrete Example:** Instead of asking AI to write a `login()` function, you tell it to implement the entire authentication feature—database integration, input validation, and tests included.

---

## Slide 3 — Traditional AI vs. Agentic AI (2.0 min)

**Talking Points:**
- Why does this distinction matter in day-to-day engineering? Let’s compare Traditional AI and Agentic AI side by side.
- **Traditional AI** is reactive. It waits for your prompt, generates a snippet, and stops. The human developer acts as the coordinator—copying code, pasting it into the IDE, running the compiler, copying the error back into the chat window.
- **Agentic AI** is goal-driven. It coordinates connected actions across your workspace.
- **Bug Fix Scenario:** Imagine a broken login flow. Traditional AI explains the stack trace you pasted and suggests a fix. Agentic AI searches the repository, locates the root cause, edits the module, runs the test suite, and confirms the tests pass.

---

## Slide 4 — What Makes an AI Agentic? (1.5 min)

**Talking Points:**
- Six capabilities work together to make a system agentic:
  1. **Autonomy** to operate without constant babysitting.
  2. **Planning** to decompose large goals into manageable steps.
  3. **Reasoning** to weigh trade-offs and analyze code structure.
  4. **Tool Usage** to run CLIs, APIs, databases, and compilers.
  5. **Memory and Context** to remember architectural decisions across files.
  6. **Adaptability** to recover when an initial attempt fails.
- **Key Nuance:** Simply calling an LLM—or even chaining multiple models together—does not automatically make a system agentic. Agency is defined by the system's ability to pursue goals through closed-loop decisions and actions.

---

## Slide 5 — How Does Agentic AI Work? (2.0 min)

**Talking Points:**
- Under the hood, an agent operates in a continuous 6-stage loop:
  - **Goal** (understand objective) → **Planning** (break into tasks) → **Execution** (use tools) → **Observation** (read logs/outputs) → **Evaluation** (check against requirements) → **Iteration** (fix issues and repeat).
- Look at the practical example on the right: building a **Student Management System**.
- The agent analyzes requirements, designs the schema, writes frontend and backend code, starts the server, runs registration and auth tests, fixes any errors it encounters, and verifies the final build before handing control back to the developer.

---

## Slide 6 — Real-World Examples of Agentic AI (2.0 min)

**Talking Points:**
- This isn't science fiction—developers are using production agentic tools right now:
  1. **OpenAI Codex**: Understands existing codebases, implements features or bug fixes, and executes tests and terminal commands in a sandbox.
  2. **GitHub Copilot Coding Agent**: You can assign a GitHub issue directly to Copilot; it investigates the repository, makes the changes, and opens a Pull Request ready for human review.
  3. **Devin**: Operates inside a full development environment—terminal, browser, and editor—to tackle multi-step engineering problems.
- **Takeaway:** These systems participate directly in engineering workflows rather than merely generating text.

---

## Slide 7 — Multi-Agent AI in Software Development (2.0 min)

**Talking Points:**
- What happens when a project is complex? We use **Multi-Agent Systems**—multiple AI agents with specialized roles collaborating toward a shared goal.
- Returning to our **Student Management System**, an **Orchestrator** coordinates specialized subagents: a **Planner**, **Frontend Developer**, **Backend Developer**, **Database Engineer**, **Tester**, **Code Reviewer**, and **Security Reviewer**.
- The workflow mirrors a real engineering team: the developer sets the objective, the Orchestrator delegates, specialists build in parallel or sequence, and testing/review agents verify quality and security until requirements are met.
- Tools like **OpenCode** can be configured with an orchestrator and specialized subagents to demonstrate this exact architecture.

---

## Slide 8 — Benefits, Challenges, and Conclusion (1.0 min)

**Talking Points:**
- **Benefits:** Faster workflows, less boilerplate, parallel task execution, automated test assistance, and more mental bandwidth for high-level architecture.
- **Challenges:** Agents can still produce flawed logic or introduce security vulnerabilities, API and compute costs can climb quickly, multi-agent coordination is non-trivial, and human oversight remains essential.
- **Closing Thought:** Leave the audience with this statement:
  > *"Developers may no longer need to write every line of code themselves, but they will still need to understand, direct, and validate the systems they build."*
