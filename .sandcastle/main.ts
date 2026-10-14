import { run, pi } from "@ai-hero/sandcastle";
import { noSandbox } from "@ai-hero/sandcastle/sandboxes/no-sandbox";

// Issue-driven AFK run: implement one GitHub issue on its own branch.
// Usage: npx tsx .sandcastle/main.ts <issue-number>
//        ISSUE_NUMBER=42 npx tsx .sandcastle/main.ts

const issueNumber = process.argv[2] ?? process.env.ISSUE_NUMBER;
if (!issueNumber || !/^\d+$/.test(issueNumber)) {
  console.error("Usage: npx tsx .sandcastle/main.ts <issue-number>");
  process.exit(1);
}

const branch = `agent/issue-${issueNumber}`;

const result = await run({
  name: `implement-issue-${issueNumber}`,
  agent: pi("glm-5.3-flash"),
  // Phase 1: no container isolation (host runs). Plan: move to Podman later.
  sandbox: noSandbox(),
  branchStrategy: { type: "branch", branch },
  promptFile: "./.sandcastle/prompt.md",
  promptArgs: { ISSUE_NUMBER: issueNumber, BRANCH: branch },
  maxIterations: 3,
});

console.log(`\nDone. branch=${result.branch} commits=${result.commits.length}`);
for (const c of result.commits) console.log(`  ${c.sha}`);
