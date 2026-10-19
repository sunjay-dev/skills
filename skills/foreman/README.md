# Foreman

The standing orders for a 24/7 autonomous worker pool: a foreman agent orchestrates worker sessions that implement `ready-for-agent` GitHub issues as PRs, babysits those PRs, and splits the queue with a sibling pool through GitHub only. The human reviews and merges.

Both skills here are **user-invoked** (`disable-model-invocation: true`): you launch a pool by hand with one line, and the agent must never fire them on its own.

## Skills

- **[foreman-pool-a](./foreman-pool-a/SKILL.md)**: Main-server foreman. Round robin starts with Gemini; owns the hourly dispatch, spec branch bootstrap, and the daily maintenance item. Launch line: `You are the foreman for this repository (pool-A, main server). Read .agents/skills/foreman-pool-a/SKILL.md and follow it exactly, starting with SETUP.`
- **[foreman-pool-b](./foreman-pool-b/SKILL.md)**: Second-server foreman. Round robin starts with OpenCode; skips maintenance by default (pool-A owns it) and re-checks origin before bootstrapping spec branches so the two pools never mint parallel branches. Launch line: same as pool-A with `pool-B, second server` and `foreman-pool-b`.
