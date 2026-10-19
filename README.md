# Skills

Sunjay's personal agent skills: the standing orders and workflows behind how I run real work with coding agents (Claude Code, Codex, OpenCode, or any [Agent Skills](https://skills.sh)-compatible harness).

Small, editable, composable. Straight from my `.agents` directories.

## Skills

### foreman

The two skills that run my 24/7 autonomous worker pool. Each is a full set of standing orders: a foreman agent orchestrates worker sessions that implement `ready-for-agent` GitHub issues as PRs, babysits those PRs, and splits the queue with a sibling pool through GitHub only (labels, claim comments, branches, PRs). The human reviews and merges; the foreman never merges and never pushes the default branch.

- **[foreman-pool-a](./skills/foreman/foreman-pool-a/SKILL.md)**: Foreman for the main server (pool-A). Round robin starts with Gemini; owns the hourly dispatch, spec branch bootstrap, and the daily maintenance item. Coordinates with a sibling pool-B through GitHub only.
- **[foreman-pool-b](./skills/foreman/foreman-pool-b/SKILL.md)**: Foreman for the second server (pool-B). Round robin starts with OpenCode; skips maintenance by default (pool-A owns it) and re-checks origin before bootstrapping spec branches so the two pools never mint parallel branches.

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
