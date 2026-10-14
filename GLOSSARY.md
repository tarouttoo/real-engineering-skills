# Real Engineering Skills

This repo packages the skills, docs, and conventions for working on it with coding agents. Issues and specs live in the GitHub issue tracker; triage labels route them; domain docs tell an agent what to read before exploring.

## Language

### Skills

**Agent skill**:
A packaged capability an agent loads for a specific job, committed under `.agents/skills/`.
_Used in_: [AGENTS.md](AGENTS.md)

### Issues and triage

**Issue tracker**:
The GitHub tracker that is the single home for this repo's issues and specs; all operations go through the `gh` CLI.
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

**Spec**:
A written specification of a piece of work, published as a GitHub issue rather than kept as a file in the repo.
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

**Triage role**:
One of the five canonical states an issue moves through during triage; skills speak in roles.
_Used in_: [docs/agents/triage-labels.md](docs/agents/triage-labels.md)

**Triage label**:
The GitHub label string a triage role maps to in this repo's tracker.
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/triage-labels.md](docs/agents/triage-labels.md)

**`needs-triage`**:
Maintainer needs to evaluate this issue
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/triage-labels.md](docs/agents/triage-labels.md)

**`needs-info`**:
Waiting on reporter for more information
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/triage-labels.md](docs/agents/triage-labels.md)

**`ready-for-agent`**:
Fully specified, ready for an AFK agent
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/triage-labels.md](docs/agents/triage-labels.md)

**`ready-for-human`**:
Requires human implementation
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/triage-labels.md](docs/agents/triage-labels.md)

**`wontfix`**:
Will not be actioned
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/triage-labels.md](docs/agents/triage-labels.md)

**AFK agent**:
An agent working away from the keyboard — unattended, with no human available to answer questions mid-task. An issue must be fully specified before it earns the `ready-for-agent` label.
_Used in_: [docs/agents/triage-labels.md](docs/agents/triage-labels.md)

**Sub-issue**:
GitHub's native parent–child link between two issues; a child ticket is attached to its map this way.
_Used in_: [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

### Agent pipeline

**Sandcastle**:
The issue-driven AFK pipeline this repo runs: one agent implements one `ready-for-agent` issue on its own branch, and a GitHub Actions workflow opens its pull request.
_Used in_: [docs/adr/0001-sandcastle-afk-pipeline.md](docs/adr/0001-sandcastle-afk-pipeline.md)

**AFK run**:
A single unattended agent pass over one issue, triggered by the `ready-for-agent` label or a manual dispatch.
_Used in_: [docs/adr/0001-sandcastle-afk-pipeline.md](docs/adr/0001-sandcastle-afk-pipeline.md)

**Sandbox**:
The container isolation an agent runs inside during an AFK run; run without one today, with rootless Podman planned.
_Used in_: [docs/adr/0001-sandcastle-afk-pipeline.md](docs/adr/0001-sandcastle-afk-pipeline.md)

### Domain docs

**Domain docs**:
The docs an agent reads before exploring the codebase: the glossary and the ADRs.
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/domain.md](docs/agents/domain.md)

**Glossary**:
A `GLOSSARY.md` holding the canonical vocabulary of a context; created lazily once the first term is resolved.
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/domain.md](docs/agents/domain.md), [.agents/skills/domain-modeling/GLOSSARY-FORMAT.md](.agents/skills/domain-modeling/GLOSSARY-FORMAT.md), [.agents/skills/domain-modeling/SKILL.md](.agents/skills/domain-modeling/SKILL.md)

**Glossary map**:
A `GLOSSARY-MAP.md` at the repo root listing a multi-context repo's contexts and pointing at each one's glossary; its presence marks the repo as multi-context.
_Used in_: [docs/agents/domain.md](docs/agents/domain.md), [.agents/skills/domain-modeling/GLOSSARY-FORMAT.md](.agents/skills/domain-modeling/GLOSSARY-FORMAT.md), [.agents/skills/domain-modeling/SKILL.md](.agents/skills/domain-modeling/SKILL.md)

**Context**:
A bounded slice of the repo with a glossary of its own — a single root glossary in a single-context repo, one per context when a glossary map exists.
_Used in_: [docs/agents/domain.md](docs/agents/domain.md), [.agents/skills/domain-modeling/GLOSSARY-FORMAT.md](.agents/skills/domain-modeling/GLOSSARY-FORMAT.md), [.agents/skills/domain-modeling/SKILL.md](.agents/skills/domain-modeling/SKILL.md)

**ADR**:
An architecture decision record in `docs/adr/`, written down when a decision is hard to reverse, surprising without context, and the result of a real trade-off.
_Used in_: [AGENTS.md](AGENTS.md), [docs/agents/domain.md](docs/agents/domain.md), [.agents/skills/domain-modeling/SKILL.md](.agents/skills/domain-modeling/SKILL.md)

### Wayfinding

**Wayfinder**:
The skill (`/wayfinder`) that drives open-ended work through a map issue and its child tickets, claiming and resolving them one at a time.
_Used in_: [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

**Map**:
A single issue labelled `wayfinder:map` that anchors a wayfinding effort and holds its Notes, Decisions-so-far, and Fog; its work is tracked as child tickets.
_Used in_: [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

**Child ticket**:
An issue attached to a map as a sub-issue; the unit of wayfinding work, labelled `wayfinder:<type>` — research, prototype, grilling, or task.
_Avoid_: child issue
_Used in_: [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

**Blocker**:
An open issue that must close before a child ticket can be taken; a ticket is unblocked when every blocker is closed.
_Used in_: [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

**Frontier query**:
The map's open child tickets that have no open blocker and no assignee; first in map order wins.
_Used in_: [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

**Claim**:
Taking ownership of a child ticket by assigning it to yourself — a wayfinding session's first write.
_Used in_: [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)

**Resolve**:
Answering a child ticket, closing it, and appending a context pointer to the map's Decisions-so-far.
_Used in_: [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md)
