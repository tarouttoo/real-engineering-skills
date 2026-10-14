---
status: accepted
---

# Issue-driven AFK pipeline via Sandcastle

Issues labelled `ready-for-agent` are implemented unattended, not by a human. We run [mattpocock/sandcastle](https://github.com/mattpocock/sandcastle) (npm `@ai-hero/sandcastle`) from a hosted GitHub Actions workflow (`.github/workflows/agent-implement.yml`), driving the `pi` agent with model `glm-5.3-flash` on provider `zai` — reusing the zai credential pi already authenticates with, so no new credentials were created. Each run takes one issue, implements it on its own branch, reports back on the issue, and opens a pull request.

## Sandbox

Phase 1 runs with `noSandbox()`: the agent executes directly on the host, because Docker is unavailable in the maintainer's WSL. The phase-2 plan is rootless Podman; the swap is one line in `.sandcastle/main.ts` (`noSandbox()` → `podman()`). `.sandcastle/Dockerfile` is kept for that containerized phase and is unused today.

## Workflow rules

- Applying `ready-for-agent` to an issue (or a manual `workflow_dispatch`) starts the GitHub Actions run.
- The agent works on `agent/issue-<N>`, leaves a report comment on the issue, and never pushes `main` or closes the issue.
- The workflow opens the pull request titled `agent: <issue title> (#<N>)`. Its body is agent-drafted into `.sandcastle/pr-body.md` via the `pr` skill, with `Closes #<N>` appended by the workflow; a canned fallback body is used when the file is missing.

## Config and secrets

Pipeline config is committed in-repo: `.sandcastle/` (prompt, pi settings, `main.ts`) and `.github/workflows/agent-implement.yml`. The only stored credential is the `ZAI_API_KEY` GitHub Actions secret; `.sandcastle/.env` is gitignored for local overrides.
