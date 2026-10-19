# Skills

Sunjay's personal agent skills: the standing orders and workflows behind how I run real autonomous work with coding agents. Currently one bucket: the 24/7 foreman worker pools, built for T3 Code and designed to run on top of [Matt Pocock's skills](https://github.com/mattpocock/skills).

Small, editable, composable. Straight from my `.agents` directories.

## Skills

### foreman

The two skills that run my 24/7 autonomous worker pool. Each is a full set of standing orders: a foreman agent orchestrates worker sessions that implement `ready-for-agent` GitHub issues as PRs, babysits those PRs, and splits the queue with a sibling pool through GitHub only (labels, claim comments, branches, PRs). The human reviews and merges; the foreman never merges and never pushes the default branch.

- **[foreman-pool-a](./skills/foreman/foreman-pool-a/SKILL.md)**: Foreman for the main server (pool-A). Round robin starts with Gemini; owns the hourly dispatch, spec branch bootstrap, and the daily maintenance item. Coordinates with a sibling pool-B through GitHub only.
- **[foreman-pool-b](./skills/foreman/foreman-pool-b/SKILL.md)**: Foreman for the second server (pool-B). Round robin starts with OpenCode; skips maintenance by default (pool-A owns it) and re-checks origin before bootstrapping spec branches so the two pools never mint parallel branches.

## What a pool needs

The foreman skills are not standalone prompt files. A running pool needs two things in place:

1. **T3 Code.** The standing orders are written for a runtime that exposes real agent threads, schedules, worktrees, and PR watches (the skills call tools like `t3_thread_launch`, `t3_thread_send`, `schedule_task`, `watch_pull_request`). T3 Code is the reference deployment; the tooling notes in each skill tell the agent how to re-discover the tools if a name differs in another runtime.
2. **[Matt Pocock's skills](https://github.com/mattpocock/skills)** installed in the target repo. Workers are launched with the repo's `/implement` flow and are expected to follow the repo's PR and review conventions; those live in Matt's engineering skills (`implement`, `tdd`, `code-review`, `pr`, plus `to-spec`, `to-tickets` and `triage` for filling the queue with `ready-for-agent` issues). Install them alongside these:

```sh
npx skills add mattpocock/skills
```

The division of labour: Matt's skills describe how the work gets done; these skills describe who does it, when, and how the two pools split the queue.

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

## How to run a pool

The foreman skills are launched by hand, with one line, from a fresh thread in the target project:

> You are the foreman for this repository (pool-A, main server). Read `.agents/skills/foreman-pool-a/SKILL.md` and follow it exactly, starting with SETUP.

That assumes the skill folder is installed in the target repo at `.agents/skills/foreman-pool-a/`. Pool-B uses the same line with `pool-B, second server` and `foreman-pool-b`. Each skill then walks through setup, schedules, the claim protocol, dispatch, and the guardrails.

Install [Matt Pocock's skills](https://github.com/mattpocock/skills) into the target repo first (`npx skills add mattpocock/skills`): the worker launch depends on the repo's `/implement` flow and its PR conventions coming from that set.

## Repo layout

```
skills/
  foreman/        # the foreman pool standing orders (this repo's first bucket)
  ...             # future buckets: engineering/, productivity/, misc/, in-progress/, deprecated/
scripts/          # dev tooling: link-skills (install locally), validate-skills
.claude-plugin/   # Claude Code plugin + marketplace manifests
```

Conventions for adding skills live in [AGENTS.md](./AGENTS.md). Sanity-check the repo any time with:

```sh
node scripts/validate-skills.mjs
```

## License

MIT. See [LICENSE](./LICENSE).

Repo layout and skill conventions are adapted from [mattpocock/skills](https://github.com/mattpocock/skills), also MIT.
