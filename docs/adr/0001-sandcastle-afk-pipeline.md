---
status: accepted
---

# Sandcastle AFK pipeline

This repo implements issues with an issue-driven AFK pipeline: an issue labelled `ready-for-agent` — or a manual `workflow_dispatch` — triggers a hosted GitHub Actions run in which one AFK run implements that issue on `agent/issue-<N>` and opens its pull request. The pipeline is built on Sandcastle (`mattpocock/sandcastle`, npm `@ai-hero/sandcastle`) driving the pi coding agent as `pi("glm-5.3-flash")` on provider `zai`, reusing pi's existing auth — no new credentials. These decisions previously lived only in setup conversation; this ADR records them.

## Sandbox

Phase 1 runs unsandboxed (`noSandbox()` in `.sandcastle/main.ts`) because Docker is unavailable in the maintainer's WSL. Phase 2 is rootless Podman; the swap is a single line (`noSandbox()` → `podman()`). The image in `.sandcastle/Dockerfile` is kept for that phase.

## Workflow rules

- The agent works on `agent/issue-<N>` and comments its report on the issue; it never pushes `main` and never closes the issue — the pull request closes it.
- The workflow opens the PR titled `agent: <issue title> (#N)` with a `Closes #N` trailer.
- The agent drafts the PR body into `.sandcastle/pr-body.md` via the `pr` skill; if the file is missing, the workflow falls back to a canned body.

## Config & secrets

Pipeline config is committed in-repo: `.sandcastle/` (runner, prompt, pi settings) and `.github/workflows/agent-implement.yml`. The only stored credential is the `ZAI_API_KEY` GitHub Actions secret; `.sandcastle/.env` is gitignored for local runs.
