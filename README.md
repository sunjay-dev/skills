# Skills

My personal agent skills: a growing collection of standing orders and workflows I use with real coding agents.

Small, editable, composable. Straight from my `.agents` directories.

## Skills

### foreman

The skill that runs my 24/7 autonomous worker pool: full standing orders where a foreman agent orchestrates worker sessions that implement `ready-for-agent` GitHub issues as PRs, babysits those PRs, and splits the queue with the other pools through GitHub only (labels, claim comments, branches, PRs). The human reviews and merges; the foreman never merges and never pushes the default branch.

- **[foreman](./skills/foreman/foreman/SKILL.md)**: The full standing orders for every pool — shared orders in the main file, plus one small role file each pool reads at setup (`prime-duties.md` / `peer-duties.md`, same folder); each role reads only its own. The launch line's role token picks the role — `prime` (the one pool on the main server that owns the shared duties and anchors the others) or `peer-<n>` (any number, one live pool per server). Covers the claim protocol, dispatch, spec branches, PR babysitting, and the guardrails.

#### What a pool needs

These skills are built for **T3 Code** and designed to run on top of **[Matt Pocock's skills](https://github.com/mattpocock/skills)**. A running pool needs:

1. **T3 Code.** The standing orders are written for a runtime that exposes real agent threads, schedules, worktrees, and PR watches (the skills call tools like `t3_thread_launch`, `t3_thread_send`, `schedule_task`, `watch_pull_request`). T3 Code is the reference deployment; the tooling notes in the skill tell the agent how to re-discover the tools if a name differs in another runtime.
2. **[Matt Pocock's skills](https://github.com/mattpocock/skills)** installed in the target repo. Workers are launched with the repo's `/implement` flow and are expected to follow the repo's PR and review conventions; those live in Matt's engineering skills (`implement`, `tdd`, `code-review`, `pr`, plus `to-spec`, `to-tickets` and `triage` for filling the queue with `ready-for-agent` issues). Install them alongside these:

```sh
npx skills add mattpocock/skills
```

The division of labour: Matt's skills describe how the work gets done; these skills describe who does it, when, and how the pools split the queue.

#### How to run a pool

The foreman skills are launched by hand, with one line, from a fresh thread in the target project:

> You are the foreman for this repository (prime, main server). Read `.agents/skills/foreman/SKILL.md` and follow it exactly, starting with SETUP.

That assumes the skill folder is installed in the target repo at `.agents/skills/foreman/`. Any further pools use the same line with a peer token — one live pool per server, e.g.:

> You are the foreman for this repository (peer-1, server 2). Read `.agents/skills/foreman/SKILL.md` and follow it exactly, starting with SETUP.

The skill then walks through setup, schedules, the claim protocol, dispatch, and the guardrails. Install [Matt Pocock's skills](https://github.com/mattpocock/skills) into the target repo first (`npx skills add mattpocock/skills`): the worker launch depends on the repo's `/implement` flow and its PR conventions coming from that set.

## Install

### Any Agent Skills-compatible harness (skills.sh)

```sh
npx skills add sunjay-dev/skills
```

Copies editable skill files into your project.

### Claude Code (plugin, auto-updates)

```
/plugin marketplace add sunjay-dev/skills
/plugin install sunjay-skills@sunjay-dev
```

### Manual

Copy (or link) a skill folder into wherever your harness scans for skills:

- Project-local: `<repo>/.agents/skills/<skill-name>/`
- User-global: `~/.agents/skills/<skill-name>/` or `~/.claude/skills/<skill-name>/`

On Windows, `scripts/link-skills.ps1` links every skill in this repo into your global skill directories using directory junctions. On macOS/Linux, run `scripts/link-skills.sh` (symlinks; a `git pull` keeps installs current).

## Contributing

Repo layout, skill conventions, checks, and the release flow live in [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT. See [LICENSE](./LICENSE).
