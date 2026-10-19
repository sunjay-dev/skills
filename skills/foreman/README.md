# Foreman

The standing orders for a 24/7 autonomous worker pool: a foreman agent orchestrates worker sessions that implement `ready-for-agent` GitHub issues as PRs, babysits those PRs, and splits the queue with the other pools through GitHub only. The human reviews and merges.

The skill here is **user-invoked** (`disable-model-invocation: true`): you launch a pool by hand with one line, and the agent must never fire it on its own.

## Skills

- **[foreman](./foreman/SKILL.md)**: The full standing orders — shared orders in the main file, plus one small role file each pool reads at setup (`prime-duties.md` / `peer-duties.md`, same folder); each role reads only its own. The launch line's role token picks the role: `prime` (the one pool that owns the shared duties — the daily maintenance item — and anchors the others; runs on the main server) or `peer-<n>` (any number, one live pool per server, each with an id used in the GitHub claim tags). Launch lines:
  - Prime: `You are the foreman for this repository (prime, main server). Read .agents/skills/foreman/SKILL.md and follow it exactly, starting with SETUP.`
  - Peer: the same line with `(peer-1, server 2)` — `.agents/skills/foreman/SKILL.md` again.
