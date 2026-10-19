# Foreman

The standing orders for a 24/7 autonomous worker pool: a foreman agent orchestrates worker sessions that implement `ready-for-agent` GitHub issues as PRs, babysits those PRs, and splits the queue with the other pools through GitHub only. The human reviews and merges.

Both skills here are **user-invoked** (`disable-model-invocation: true`): you launch a pool by hand with one line, and the agent must never fire them on its own.

## Skills

- **[foreman-prime](./foreman-prime/SKILL.md)**: The prime foreman — the one pool that owns the shared duties (the daily maintenance item). Runs on the main server; round robin starts with Gemini. Launch line: `You are the foreman for this repository (prime, main server). Read .agents/skills/foreman-prime/SKILL.md and follow it exactly, starting with SETUP.`
- **[foreman-peer](./foreman-peer/SKILL.md)**: The generic peer foreman — spin up any number, one live pool per server; each instance takes an id (e.g. `peer-1`) used in the GitHub claim tags. Round robin starts with OpenCode; skips maintenance by default (the prime owns it) and re-checks origin before bootstrapping spec branches so pools never mint parallel branches. Launch line: same as the prime with `(peer-1, server 2)` and `foreman-peer`.
