---
status: accepted
---

# Sandcastle AFK pipeline

Implementing an issue is delegated to an unattended agent: an issue labelled `ready-for-agent` triggers a hosted GitHub Actions run of Sandcastle (mattpocock/sandcastle, npm `@ai-hero/sandcastle`), which drives the `pi` coding agent with `pi("glm-5.3-flash")` on provider `zai`. `zai` is the provider pi already authenticates against, so no new credentials were needed. A hosted run was chosen over local execution so any fully specified issue can be implemented AFK, not just on the maintainer's machine.

## Sandbox

Phase 1 runs on the host with `noSandbox()`: Docker is unavailable in the maintainer's WSL. The phase-2 plan is rootless Podman; the swap is one line in `.sandcastle/main.ts` (`noSandbox()` → `podman()`). `.sandcastle/Dockerfile` is kept for that containerised phase — it is unused today.

## Workflow rules

- An issue labelled `ready-for-agent` triggers a hosted GitHub Actions run (`.github/workflows/agent-implement.yml`; manual `workflow_dispatch` also works).
- The agent works on `agent/issue-<N>`, comments a report on the issue, and never pushes `main` or closes the issue.
- The workflow opens the pull request titled `agent: <issue title> (#N)` with a `Closes #N` trailer; the PR — not the agent — closes the issue.
- The PR body is agent-drafted into `.sandcastle/pr-body.md` via the `pr` skill, with a canned fallback body when the agent didn't write one.

## Config & secrets

Pipeline config is committed in-repo: `.sandcastle/` (prompt, pi settings, `main.ts`) and `.github/workflows/agent-implement.yml`. The only stored credential is the `ZAI_API_KEY` GitHub Actions secret; `.sandcastle/.env` is gitignored.
