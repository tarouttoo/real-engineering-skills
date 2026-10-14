---
status: accepted
---

# Issue-driven AFK pipeline via Sandcastle

Issues labelled `ready-for-agent` are implemented unattended, not by a human. We run [mattpocock/sandcastle](https://github.com/mattpocock/sandcastle) (npm `@ai-hero/sandcastle`) from a hosted GitHub Actions workflow (`.github/workflows/agent-implement.yml`), driving the `pi` agent with model `glm-5.3-flash` on provider `zai` — reusing the zai credential pi already authenticates with, so no new credentials were created. Each run takes one issue, implements it on its own branch, reports back on the issue, and opens a pull request.

## Sandbox

AFK runs execute the agent inside a rootless Podman container — the agent never runs on the invoking host, locally or in CI. Podman was chosen over repairing WSL Docker because the maintainer's WSL has no systemd (Docker's daemon cannot run there reliably), while rootless Podman needs neither a daemon nor systemd, and `--userns=keep-id` maps container file ownership to the host user.

- **Image**: built per host from `.sandcastle/Containerfile`; sandcastle names it after the checkout directory, so local and CI share `sandcastle:real-engineering-skills`. The hosted workflow installs Podman and builds the image before each run; locals build once. A missing image or missing `podman` binary fails the run — there is no unsandboxed fallback, by design.
- **Secrets**: only `GH_TOKEN`, `GH_REPO`, and `ZAI_API_KEY` enter the container, via an explicit allowlist in `.sandcastle/main.ts`; pi's auth lives in `~/.pi/agent`, bind-mounted into the container home.
- **Not a security boundary**: the allowlisted credentials can still be exfiltrated by a misbehaving agent, and `GH_TOKEN`'s `contents: write` could push to `main`. The sandbox guards against accident and drift, not malice; token scoping and egress rules would be a separate decision.

Phase 1 ran with `noSandbox()` because Docker was unavailable in the maintainer's WSL. The planned "one-line swap" understated the migration: the `Dockerfile` became a `Containerfile` (the name the Podman provider expects), and the image's pi package (`@earendil-works/pi-coding-agent`) and Node version (24) had to be brought in line with the hosted workflow before the sandboxed agent matched the validated one.

## Workflow rules

- Applying `ready-for-agent` to an issue (or a manual `workflow_dispatch`) starts the GitHub Actions run.
- The agent works on `agent/issue-<N>`, leaves a report comment on the issue, and never pushes `main` or closes the issue.
- The workflow opens the pull request titled `agent: <issue title> (#<N>)`. Its body is agent-drafted into `.sandcastle/pr-body.md` via the `pr` skill, with `Closes #<N>` appended by the workflow; a canned fallback body is used when the file is missing.

## Config and secrets

Pipeline config is committed in-repo: `.sandcastle/` (prompt, pi settings, `main.ts`, `Containerfile`) and `.github/workflows/agent-implement.yml`. The only stored credential is the `ZAI_API_KEY` GitHub Actions secret; `.sandcastle/.env` is gitignored for local overrides.
